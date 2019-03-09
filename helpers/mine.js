const { workerData, parentPort } = require('worker_threads');
const SHA256 = require('crypto-js/sha256');


const {
    index,
    previousHash,
    timestamp,
    transactions,
    difficulty
} = workerData;
let { nonce } = workerData;
let hash = '';

function calculateHash() {
    return SHA256(
        index +
        previousHash +
        timestamp +
        JSON.stringify(transactions) +
        nonce
    ).toString();
}

while (hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
    nonce++;
    hash = calculateHash();
}

parentPort.postMessage({ hash, nonce });
