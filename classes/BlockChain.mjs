import colorIt from 'color-it';
import emojic from 'emojic';

import Block from './Block';
import Transaction from './Transaction';

export default class BlockChain {
    constructor({
        chain = [
            new Block({
                transactions: []
            })],
        difficulty = 4,
        maxTransactions = 5,
        pendingTransactions = [],
        miningReward = 200
    } = {}) {
        this.chain = chain;
        this.difficulty = difficulty;
        this.maxTransactions = maxTransactions;
        this.pendingTransactions = pendingTransactions; // Mo3
        this.miningReward = miningReward; // Mo3
    }

    get latestBlock() {
        return this.chain[this.chain.length - 1];
    }

    async minePendingTransactions(miningRewardAddress) {
    // mine a block, push it in the blockChain, create a transaction to give the miner the miningReward //Mo3
        if (!this.pendingTransactions.length) {
            console.log(`${emojic.warning}  ${colorIt('There are no pending transactions for you to mine.').wetAsphalt()}`);
            return;
        }
        const block = new Block({
            index: this.chain.length,
            transactions: this.pendingTransactions.splice(0, this.maxTransactions),
            previousHash: this.chain[this.chain.length - 1].hash
        });
        await block.mineBlock(this.difficulty);
        console.log(`${emojic.whiteCheckMark}  ${colorIt('Block Successfully Mined').green()}`);
        this.chain.push(block);
        this.pendingTransactions = [
            ...this.pendingTransactions,
            new Transaction({
                toAddress: miningRewardAddress,
                amount: this.miningReward
            })
        ];
        // EVERY 1000 BLOCK PAST (INITIAL DIFFICULTY * 1000) INCREASE DIFFICULTY & DECREASE MINING REWARD
        if (this.difficulty < (this.chain.length / 1000)) {
            this.miningReward = Math.max(this.miningReward / 1.1, 1); // MINIMUM REWARD IS 1 🥔
            this.difficulty++;
        }
    }
    addTransaction(transaction) {
    // fill the array of transactions in the blockChain  //Mo3
        if (!transaction.fromAddress || !transaction.toAddress) {
            console.log(`${emojic.noEntry}  ${colorIt('Transaction must contain from and to address').red()}`);
            return;
        }

        if (!transaction.isValid()) {
            console.log(`${emojic.noEntry}  ${colorIt('Can\'t add invalid transaction to the chain.').red()}`);
            return;
        }
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address) {
    // get balance of a specific address //Mo3
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    checkIfValid() {
        return this.chain.every(
            (block, index, chain) =>
                index === 0 ||
                    (new Block(block).checkTransactions()
                        && block.hash === new Block(block).calculateHash()
                        && block.previousHash === chain[index - 1].hash)
        );
    }
}
