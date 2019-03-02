import BlockChain from './classes/BlockChain.mjs';

const args = process.argv.slice(2);

const numOfBlocks = args[0] || 10;
const difficulty = args[1];

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
