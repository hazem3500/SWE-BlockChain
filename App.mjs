import keyFileStorage from 'key-file-storage';
import inquirer from 'inquirer';

import BlockChain from './classes/BlockChain.mjs';
import Transaction from './classes/Transaction';
import Key from './classes/KeyHandler';


const kfs = keyFileStorage('./');

export default class App {
    constructor() {
        // CHECK IF BLOCKCHAIN SAVED IN STORAGE OR NOT
        if (!kfs.blockChain) {
            this.blockChain = new BlockChain();
            kfs.blockChain = this.blockChain;
        } else {
            this.blockChain = new BlockChain(kfs.blockChain);
        }
    }

    async addTransaction() {
        const answers = await inquirer.prompt([
            {
                name: 'toAddress',
                message: 'Enter receiver\'s key: '
            },
            {
                name: 'amount',
                message: 'Enter amount: '
            },
        ]);
        const transaction = new Transaction({
            fromAddress: Key.getPublic('hex'),
            toAddress: answers.toAddress,
            amount: answers.amount
        });
        transaction.signTransaction(Key);
        this.blockChain.addTransaction(transaction);
        kfs.blockChain = this.blockChain;
    }

    mine() {
        this.blockChain.minePendingTransactions(Key.getPublic('hex'));
        kfs.blockChain = this.blockChain;
    }

    getUserInfo() {
        return {
            publicKey: Key.getPublic('hex'),
            balance: this.blockChain.getBalanceOfAddress(Key.getPublic('hex'))
        };
    }

    logBlockChain() {
        console.log(JSON.stringify(this.blockChain, null, 4));
        console.log(
            `Is blockchain valid? ${blockChain.checkIfValid().toString()}`
        );
    }
}
