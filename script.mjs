import BlockChain from './classes/BlockChain.mjs';
import keyFileStorage from 'key-file-storage';

const kfs = keyFileStorage('./');

const args = process.argv.slice(2);

const difficulty = args[0];

let blockChainInstance;

if (!kfs.blockChain) {
    blockChainInstance = new BlockChain({ difficulty });
    kfs.blockChain = blockChainInstance;
} else {
    blockChainInstance = new BlockChain(kfs.blockChain);
}

blockChainInstance.minePendingTransactions();

console.log(JSON.stringify(blockChainInstance, null, 4));
console.log(
    `Is blockchain valid? ${blockChainInstance.checkIfValid().toString()}`
);
