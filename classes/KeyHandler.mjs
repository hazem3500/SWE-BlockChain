import elliptic from 'elliptic';
import keyFileStorage from 'key-file-storage';

const kfs = keyFileStorage('./');

const ec = new elliptic.ec('secp256k1');

if (!kfs.privateKey) {
    kfs.privateKey = ec.genKeyPair().getPrivate('hex');
}

console.log(kfs.privateKey);

export default ec.keyFromPrivate(kfs.privateKey);
