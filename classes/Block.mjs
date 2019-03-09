import { Worker } from 'worker_threads';
import SHA256 from 'crypto-js/sha256';
import Spinner from 'cli-spinner';
import colorIt from 'color-it';

import Transaction from './Transaction';

export default class Block {
    constructor({
        index = 0,
        timestamp = Date.now(),
        transactions = [], // -> data //Mo3
        previousHash = '',
        nonce = 0,
        hash
    } = {}) {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = hash || this.calculateHash();
        this.nonce = nonce;
    }

    calculateHash() {
        return SHA256(
            this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.nonce
        ).toString();
    }

    mineHash(difficulty) {
        return new Promise((resolve, reject) => {
            const worker = new Worker('./helpers/mine.js', {
                workerData: {
                    index: this.index,
                    previousHash: this.previousHash,
                    timestamp: this.timestamp,
                    transactions: this.transactions,
                    nonce: this.nonce,
                    difficulty
                }
            });
            worker.on('message', ({ hash, nonce }) => {
                this.hash = hash;
                this.nonce = nonce;
                resolve();
            });
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    }

    async mineBlock(difficulty) {
        const spinner = new Spinner.Spinner(`Mining block ${this.index}...`);
        spinner.setSpinnerString(18);
        spinner.start();
        await this.mineHash(difficulty);
        spinner.stop();
        Object.freeze(this); // MADE BLOCK IMMUTABLE
        console.log(`\n Block Mined: ${colorIt(this.hash).blue()}`);
    }

    checkTransactions() {
        for (const trans of this.transactions) {
            const transObj = new Transaction(trans);
            if (!transObj.isValid()) return false;
        }
        return true;
    }
}
