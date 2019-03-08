import SHA256 from 'crypto-js/sha256';
import elliptic from 'elliptic';

const ec = new elliptic.ec('secp256k1');

export default class Transaction {
    constructor({ fromAddress = null, toAddress = null, amount = 0 }) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('Transaction not allowed!');
        }
        const hash = this.calculateHash();
        this.signature = signingKey.sign(hash, 'base64').toDER('hex');
    }

    isValid() {
        if (this.fromAddress === null) return true;
        if (!this.signature) {
            throw new Error('Transaction isn\'t signed!');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}
