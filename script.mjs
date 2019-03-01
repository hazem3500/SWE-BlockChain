import BlockChain from './classes/BlockChain.mjs';

const blockChainInstance = new BlockChain();

blockChainInstance.addBlock({
    data: 'Block 1'
});

blockChainInstance.addBlock({
    data: 'Block 2'
});

console.log(JSON.stringify(blockChainInstance, null, 4));
console.log(
    `Is blockchain valid? ${blockChainInstance.checkIfValid().toString()}`
);
