import SHA256 from 'crypto-js/sha256';

export default class Block {
    constructor({
        index = 0,
        timestamp = Date.now(),
        data,
        previousHash = ''
    }) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(
            this.index +
                this.previousHash +
                this.timestamp +
                JSON.stringify(this.data) +
                this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        console.log('Mining block...');
        while (this.hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block Mined: ${this.hash}`);
    }
}
