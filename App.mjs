import keyFileStorage from 'key-file-storage';
import inquirer from 'inquirer';
import colorIt from 'color-it';
import emojic from 'emojic';

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
                message: "Enter receiver's key: "
            },
            {
                name: 'amount',
                message: 'Enter amount: '
            }
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

    async mine() {
        await this.blockChain.minePendingTransactions(Key.getPublic('hex'));
        kfs.blockChain = this.blockChain;
    }

    getUserInfo() {
        const balance = this.blockChain.getBalanceOfAddress(
            Key.getPublic('hex')
        );
        console.log(
            `${emojic.key}  PUBLIC KEY: ${colorIt(
                Key.getPublic('hex')
            ).emerland()}`
        );
        console.log(
            `${emojic.potato}  BALANCE: ${colorIt(
                balance
            ).emerland()} ${colorIt('PC').wetAsphalt()}`
        );
    }

    logBlockChain() {
        console.log(
            `${colorIt(JSON.stringify(this.blockChain, null, 4)).blue()}`
        );
    }

    isBlockChainValid() {
        if (this.blockChain.checkIfValid()) {
            console.log(
                `${emojic.whiteCheckMark}  ${colorIt(
                    'Block chain is valid.'
                ).green()}`
            );
        } else {
            console.log(
                `${emojic.noEntry}  ${colorIt("Block chain isn't valid.").red}`
            );
        }
    }
}
