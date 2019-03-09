const crypto = require('crypto');
const Swarm = require('discovery-swarm');
const defaults = require('dat-swarm-defaults');
const getPort = require('get-port');




export default class P2pNetwork {
  constructor({
    myId = crypto.randomBytes(32), // default random 32 crypto 
    channel = 'private-blockchain-channel'
  }) {
    this.myId = myId; // peer id 
    this.channel = channel;
    this.config = defaults({
      id: myId
    });
    this.sw = Swarm(config);
    this.peers = {};
    this.connSeq = 0;
    init();
  }

  async init() {
    const port = await getPort();
    sw.listen(port);
    console.log("Listening on: " + port);
    sw.join(channel);
    sw.on('connection', function (conn, info) {
      const seq = connSeq;
      const peerId = info.id.toString('hex');
      console.log("connected!");

      if (info.initiator) {
        try {
          conn.setKeepAlive(true, 600);
        } catch (exception) {
          console.log('exception', exception);
        }
      }

      conn.on('data', data => {
        console.log('Received new Block ' + data.toString());
      });

      conn.on('close', () => {
        if (peers[peerId].seq === seq) {
          delete peers[peerId];
        }
      })

      if (!peers[peerId]) {
        peers[peerId] = {}
      }
      peers[peerId].conn = conn;
      peers[peerId].seq = seq;
      connSeq++;

    });
  }

  broadcast(message) {
    for (let id in peers) {
      peers[id].conn.write(message);
    }
  }


}