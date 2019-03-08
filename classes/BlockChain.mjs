import Block from "./Block";
import Transaction from "./Transaction";

export default class BlockChain {
  constructor({ difficulty = 4 } = {}) {
    this.chain = [
      new Block({
        transactions: "Genesis block"
      })
    ];
    this.difficulty = difficulty;
    this.pendingTransactions = []; //Mo3
    this.miningReward = 200; //Mo3
  }

  get latestBlock() {
    return this.chain[this.chain.length - 1];
  }
  minePendingTransactions(miningRewardAddress) {
    //mine a block, push it in the blockChain, create a transaction to give the miner the miningReward //Mo3
    let block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    console.log("Block Successfully Mined ");
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, this.miningRewardAddress, this.miningReward)
    ];
  }
  createTranaction(transaction) {
    //fill the array of transactions in the blockChain  //Mo3
    this.pendingTransactions.push(transaction);
  }
  getBalanceOfAddress(address) {
    //get balance of a specific address //Mo3
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === adress) {
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
        (block.hash === block.calculateHash() &&
          block.previousHash === chain[index - 1].hash)
    );
  }
}
