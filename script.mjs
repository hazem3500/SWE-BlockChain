import BlockChain from './classes/BlockChain.mjs';

const args = process.argv.slice(2);

const numOfTransactions = args[0] || 10;
const difficulty = args[1];

const blockChainInstance = new BlockChain({ difficulty });

for (let index = 0; index < numOfTransactions; index++) {
    blockChainInstance.createTransaction({
        transactions: `Block ${index + 1}`
    });
}

blockChainInstance.minePendingTransactions();

console.log(JSON.stringify(blockChainInstance, null, 4));
console.log(
    `Is blockchain valid? ${blockChainInstance.checkIfValid().toString()}`
);
