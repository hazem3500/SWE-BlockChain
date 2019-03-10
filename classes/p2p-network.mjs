import Swarm from 'discovery-swarm';
import crypto from 'crypto';
import defaults from 'dat-swarm-defaults';
import getPort from 'get-port';
import keyFileStorage from 'key-file-storage';
import colorIt from 'color-it';
import emojic from 'emojic';
import Key from './KeyHandler';

const kfs = keyFileStorage('./');

export default class P2pNetwork {
    constructor({
        myId = Key.getPublic('hex'),
        p2pId = crypto.randomBytes(32),
        channel = 'potato-blockchain-channel'
    } = {}) {
        this.myId = myId; // peer id
        this.channel = channel;
        this.config = defaults({
            id: p2pId
        });
        this.sw = Swarm(this.config);
        this.peers = {};
        this.connSeq = 0;
    }

    async init(app) {
        this.app = app;
        const port = await getPort();
        this.sw.listen(port);
        this.sw.join(this.channel);
        this.sw.on('connection', (conn, info) => {
            const seq = this.connSeq;
            const peerId = info.id.toString('hex');
            if (info.initiator) {
                try {
                    conn.setKeepAlive(true, 600);
                } catch (exception) {
                    console.log('exception', exception);
                }
            }

            conn.on('data', (data) => {
                let message = data.toString();
                let publicKeyIndex = message.search("publicKey:");
                let blockCHainIndex = message.search("blockChain:");
                if (message.search("json:") !== -1)
                    this.checkMessage(message.split("json:")[1]);
                else if (publicKeyIndex !== -1){
                    this.peers[peerId].publicKey = message.split("publicKey:")[1];
                }else if (blockCHainIndex !== -1){
                    this.peers[peerId].blockChain = message.split("blockChain:")[1];
                }
                else 
                 console.log(`Received new Block ${message}`);
            });

            conn.on('close', () => {
                if (this.peers[peerId].seq === seq) {
                    delete this.peers[peerId];
                }
            });

            if (!this.peers[peerId]) {
                this.peers[peerId] = {};
            }
            this.peers[peerId].conn = conn;
            this.peers[peerId].seq = seq;
            this.connSeq++;
            this.updatePublicKey();
            this.updateBlockChain();
        });
    }

    updateBlockChain(){
        this.broadcast("blockChain:" + JSON.stringify(this.app.getLatestBlockChain()));
    }

    updatePublicKey(){
        this.broadcast("publicKey:" + this.myId);
    }
    checkMessage(message) {
        let message_json = JSON.parse(message);
        if (message_json.to !== this.myId)
            return;

        switch (message_json.action){
            case 'request':
                let blockChain = JSON.stringify(this.app.getLatestBlockChain());
                this.sendJsonMessage(message_json.from, 'response',blockChain);
                break;
            case 'response':
                console.log(`${colorIt(message_json.message).emerland()}`);
                break;
            default:    
        }

    }

    broadcast(message) {
        for (const id in this.peers) {
            this.peers[id].conn.write(message);
        }
    }


    hashBroadcast(message){
        message = '{"moh":"mohamed","ahm":"ahmed"}';
        for (const id in this.peers) {
            this.peers[id].conn.write("hash:"+message);
        }
    }

    sendJsonMessage(to,action,message = null){
        let json_message = {to: to, from: this.myId, action: action, message:message};
        this.broadcast("json:"+JSON.stringify(json_message));
    }


    getAllPeers() {
        return this.peers;
    }

    listPeers() {
        for (const peerId in this.peers) {
            console.log(`${emojic.key}  PUBLIC KEY: ${colorIt(this.peers[peerId].publicKey).emerland()}`);
        }
    }

    async requestFromPeer(peerPublicKey) {
        this.sendJsonMessage(peerPublicKey,'request');
    }

    async getLongestBlockChain() {
        let longestBlockChain = kfs.blockChain;
        for (const peerId in this.peers) {
            let publicKey = this.peers[peerId].publicKey;
            const peerBlockChain = JSON.parse(this.peers[peerId].blockChain);
            if (peerBlockChain.chain.length > longestBlockChain.chain) {
                longestBlockChain = peerBlockChain;
            }
        }
        
        console.log(`${colorIt(JSON.stringify(longestBlockChain)).emerland()}`);
        return longestBlockChain;
    }
}
