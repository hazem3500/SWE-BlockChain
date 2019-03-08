export default class Transaction {
    constructor({ fromAddress = null, toAddress = null, amount = 0 }) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
