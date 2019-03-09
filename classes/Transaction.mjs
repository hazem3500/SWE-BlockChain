import SHA256 from 'crypto-js/sha256';
import elliptic from 'elliptic';
import colorIt from 'color-it';
import emojic from 'emojic';

const ec = new elliptic.ec('secp256k1');

export default class Transaction {
    constructor({ fromAddress = null, toAddress = null, amount = 0, signature = null} = {}) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.signature = signature;
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            console.log(`${emojic.noEntry}  ${colorIt('Can\'t sign transactions from other wallets').red()}`);
            return;
        }
        const hash = this.calculateHash();
        this.signature = signingKey.sign(hash, 'base64').toDER('hex');
    }

    isValid() {
        if (this.fromAddress === null) return true;
        if (!this.signature) {
            console.log(`${emojic.noEntry}  ${colorIt('Transaction isn\'t signed!').red()}`);
            return false;
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}
