import BlockChain from './classes/BlockChain.mjs';

const numOfBlocks = 10;
const difficulty = 3;

const blockChainInstance = new BlockChain({ difficulty });

for (let index = 0; index < numOfBlocks; index++) {
    blockChainInstance.addBlock({
        data: `Block ${index + 1}`
    });
}
console.log(JSON.stringify(blockChainInstance, null, 4));
console.log(
    `Is blockchain valid? ${blockChainInstance.checkIfValid().toString()}`
);
