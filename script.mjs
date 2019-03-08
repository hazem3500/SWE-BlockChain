import colorIt from 'color-it';
import emojic from 'emojic';
import inquirer from 'inquirer';
import promiseWhile from './helpers/promiseWhile';
import App from './App';

const app = new App();
let userInfo = app.getUserInfo();
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
            { name: 'Exit', value: 'exit' },
        ]
    }
];

console.log(`${colorIt(`WELCOME TO THE POTATO ${emojic.potato}  BLOCK CHAIN!`).wetAsphalt()}`);

promiseWhile(() => !exitApplication, () => inquirer.prompt(options).then(async answers => {
    console.log('\n', `${emojic.smallOrangeDiamond} `.repeat(55), '\n');
    switch (answers.option) {
    case 'transaction':
        await app.addTransaction();
        break;
    case 'mine':
        app.mine();
        break;
    case 'info':
        userInfo = app.getUserInfo();
        console.log(`${emojic.key}  PUBLIC KEY: ${colorIt(userInfo.publicKey).emerland()}`);
        console.log(`${emojic.potato}  BALANCE: ${colorIt(userInfo.balance).emerland()} ${colorIt('PC').wetAsphalt()}`);
        break;
    case 'exit':
        exitApplication = true;
        console.log(`${colorIt(`${emojic.wave}  GOOD BYE!`).wetAsphalt()}`);
        break;
    default:
    }
    console.log('\n', `${emojic.smallOrangeDiamond} `.repeat(55), '\n');
}));
