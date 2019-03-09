import colorIt from 'color-it';
import emojic from 'emojic';
import inquirer from 'inquirer';
import promiseWhile from './helpers/promiseWhile';
import App from './App';

import P2P from './classes/p2p-network';

const p2p = new P2P();
const app = new App({ p2p });
let exitApplication = false;

const options = [
    {
        type: 'list',
        name: 'option',
        message: 'choose: ',
        choices: [
            { name: 'Make a transaction', value: 'transaction' },
            { name: 'Mine PotatoCoins', value: 'mine' },
            { name: 'Get my info', value: 'info' },
            { name: 'Log block chain', value: 'log' },
            { name: 'Validate block chain', value: 'validate' },
            { name: 'List all peers', value: 'listPeers' },
            { name: 'Exit', value: 'exit' }
        ]
    }
];

async function run() {
    await p2p.init();
    console.log(
        `${colorIt(
            `WELCOME TO THE POTATO ${emojic.potato}  BLOCK CHAIN!`
        ).wetAsphalt()}`
    );

    promiseWhile(
        () => !exitApplication,
        () =>
            inquirer.prompt(options).then(async (answers) => {
                // kfs.blockChain = await p2p.getLongestBlockChain(); TODO: UNCOMMENT AFTER IMPLEMENTATION
                console.log(
                    '\n',
                    `${emojic.smallOrangeDiamond} `.repeat(55),
                    '\n'
                );
                switch (answers.option) {
                case 'transaction':
                    await app.addTransaction();
                    break;
                case 'mine':
                    await app.mine();
                    break;
                case 'info':
                    app.getUserInfo();
                    break;
                case 'log':
                    app.logBlockChain();
                    break;
                case 'validate':
                    app.isBlockChainValid();
                    break;
                case 'listPeers':
                    app.listPeers();
                    break;
                case 'exit':
                    exitApplication = true;
                    console.log(
                        `${colorIt(
                            `${emojic.wave}  GOOD BYE!`
                        ).wetAsphalt()}`
                    );
                    process.exit(0);
                    break;
                default:
                }
                console.log(
                    '\n',
                    `${emojic.smallOrangeDiamond} `.repeat(55),
                    '\n'
                );
            })
    );
}

run();
