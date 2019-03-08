import Block from './Block';
import Transaction from './Transaction';

export default class BlockChain {
    constructor({
        chain = [
            new Block({
                transactions: []
            })],
        difficulty = 4,
        maxTransactions = 5,
        pendingTransactions = [],
        miningReward = 200
    }) {
        this.chain = chain;
        this.difficulty = difficulty;
        this.maxTransactions = maxTransactions;
        this.pendingTransactions = pendingTransactions; // Mo3
        this.miningReward = miningReward; // Mo3
    }

    get latestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
    // mine a block, push it in the blockChain, create a transaction to give the miner the miningReward //Mo3
        if (!this.pendingTransactions.length) {
            console.log('There are no pending transactions for you to mine.');
            return;
        }
        const block = new Block({
            transactions: this.pendingTransactions.splice(0, this.maxTransactions),
            previousHash: this.chain[this.chain.length - 1]
        });
        block.mineBlock(this.difficulty);
        console.log('Block Successfully Mined ');
        this.chain.push(block);
        this.pendingTransactions = [
            ...this.pendingTransactions,
            new Transaction({
                toAddress: miningRewardAddress,
                amount: this.miningReward
            })
        ];
    }
    addTransaction(transaction) {
    // fill the array of transactions in the blockChain  //Mo3
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must contain from and to address');
        }

        if (!transaction.isValid()) {
            throw new Error('Can\'t add invalid transaction to the chain.');
        }
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address) {
    // get balance of a specific address //Mo3
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    checkIfValid() {
        return this.chain.every(
            (block, index, chain) =>
                index === 0 ||
        (block.checkTransactions() && block.hash === block.calculateHash() &&
          block.previousHash === chain[index - 1].hash)
        );
    }
}
