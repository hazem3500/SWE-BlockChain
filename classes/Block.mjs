import SHA256 from 'crypto-js/sha256';

export default class Block {
    constructor({
        index = 0,
        timestamp = Date.now(),
        transactions = [], // -> data //Mo3
        previousHash = ''
    }) {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
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

    mineBlock(difficulty) {
        console.log(`Mining block ${this.index + 1}...`);
        while (this.hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        Object.freeze(this); // MADE BLOCK IMMUTABLE
        console.log(`Block Mined: ${this.hash}`);
    }

    checkTransactions() {
        for (const trans of this.transactions) {
            if (!trans.isValid) return false;
        }
        return true;
    }
}
