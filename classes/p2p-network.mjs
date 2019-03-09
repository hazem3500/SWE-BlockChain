import Swarm from 'discovery-swarm';
import defaults from 'dat-swarm-defaults';
import getPort from 'get-port';
import keyFileStorage from 'key-file-storage';

import Key from './KeyHandler';

const kfs = keyFileStorage('./');

export default class P2pNetwork {
    constructor({
        myId = Key.getPublic('hex'),
        channel = 'potato-blockchain-channel'
    } = {}) {
        this.myId = myId; // peer id
        this.channel = channel;
        this.config = defaults({
            id: myId
        });
        this.sw = Swarm(this.config);
        this.peers = {};
        this.connSeq = 0;
    }

    async init() {
        const port = await getPort();
        this.sw.listen(port);
        console.log(`Listening on: ${port}`);
        this.sw.join(this.channel);
        this.sw.on('connection', (conn, info) => {
            const seq = this.connSeq;
            const peerId = info.id.toString('hex');
            console.log('connected!');

            if (info.initiator) {
                try {
                    conn.setKeepAlive(true, 600);
                } catch (exception) {
                    console.log('exception', exception);
                }
            }

            conn.on('data', (data) => {
                console.log(`Received new Block ${data.toString()}`);
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
        });
    }

    broadcast(message) {
        for (const id in this.peers) {
            this.peers[id].conn.write(message);
        }
    }

    getAllPeers() {
        return this.peers;
    }

    async requestFromPeer(peerPublicKey) {
        // TODO: returns specified peer's copy of the block chain
        // returned message should be parsed with JSON.parse(returnedMessage);
    }

    async getLongestBlockChain() {
        let longestBlockChain = kfs.blockChain;
        for (const id in this.peers) {
            const peerBlockChain = await this.requestFromPeer(id);
            if (peerBlockChain.chain.length > longestBlockChain.chain) {
                longestBlockChain = peerBlockChain;
            }
        }
        return longestBlockChain;
    }
}
