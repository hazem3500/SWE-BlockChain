import Block from './Block';

export default class BlockChain {
    constructor({ difficulty = 4 } = {}) {
        this.chain = [
            new Block({
                data: 'Genesis block'
            })
        ];
        this.difficulty = difficulty;
    }

    get latestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock({ data }) {
        const newBlock = new Block({
            index: this.chain.length - 1,
            data,
            previousHash: this.latestBlock.hash
        });
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    checkIfValid() {
        return this.chain.every(
            (block, index, chain) =>
                index === 0 ||
                (block.hash === block.calculateHash() &&
                    block.previousHash === chain[index - 1].hash)
        );
    }
}
