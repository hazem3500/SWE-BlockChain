import SHA256 from 'crypto-js/sha256';

export default class Block {
    constructor({
        index = 0,
        timestamp = new Date().toString(),
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
}
