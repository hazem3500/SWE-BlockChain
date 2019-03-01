import Block from './Block';

export default class BlockChain {
    constructor() {
        this.chain = [
            new Block({
                data: 'Genesis block'
            })
        ];
    }

    latestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data) {
        const newBlock = new Block({
            index: this.chain.length - 1,
            data,
            previousHash: this.latestBlock().hash
        });
        this.chain.push(newBlock);
    }

    checkIfValid() {
        return this.chain.every(
            (block, index, chain) =>
                index === 0 ||
                (block.hash === block.calculateHash &&
                    block.previousHash === chain[index - 1].hash)
        );
    }
}
