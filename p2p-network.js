const crypto = require('crypto');
const Swarm = require('discovery-swarm');
const defaults = require('dat-swarm-defaults');
const getPort = require('get-port');
const readline = require('readline');

const peers = {};

let connSeq = 0;

export default class P2pNetwork {
  constructor({
    myId = crypto.randomBytes(32) // default random 32 crypto 
  }) {
    this.myId = myId; // peer id 
    this.config = defaults({
      id: myId
    })
    this.sw = Swarm(config);
  }
  /**
   * discovery-swarm library establishes a TCP p2p connection and uses
   * discovery-channel library for peer discovery
   */


}


// reference to redline interface
let rl;
/**
 * Function for safely call console.log with readline interface active
 */
function log() {
  if (rl) {
    rl.clearLine();
    rl.close();
    rl = undefined;
  }
  for (let i = 0, len = arguments.length; i < len; i++) {
    console.log(arguments[i])
  }
  askUser();
}

/*
 * Function to get text input from user and send it to other peers
 * Like a chat :)
 */
// const askUser = async () => {
//   rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   })

//   rl.question('Send message: ', message => {
//     // Broadcast to peers
//     for (let id in peers) {
//       peers[id].conn.write(message);
//     }
//     rl.close();
//     rl = undefined;
//     askUser();
//   });
// }

/** 
 * Default DNS and DHT servers
 * This servers are used for peer discovery and establishing connection
 */


;
(async () => {

  // Choose a random unused port for listening TCP peer connections
  const port = await getPort();

  sw.listen(port);
  console.log('Listening to port: ' + port);

  /**
   * The channel we are connecting to.
   * Peers should discover other peers in this channel
   */
  sw.join('private-blockchain-channel');

  sw.on('connection', (conn, info) => {
    // Connection id
    const seq = connSeq

    const peerId = info.id.toString('hex')
    log(`Connected #${seq} to peer: ${peerId}`)

    // Keep alive TCP connection with peer
    if (info.initiator) {
      try {
        conn.setKeepAlive(true, 600)
      } catch (exception) {
        log('exception', exception)
      }
    }

    conn.on('data', data => {
      // Here we handle incomming messages
      log(
        'Received Message from peer ' + peerId,
        '----> ' + data.toString()
      )
    })

    conn.on('close', () => {
      // Here we handle peer disconnection
      log(`Connection ${seq} closed, peer id: ${peerId}`)
      // If the closing connection is the last connection with the peer, removes the peer
      if (peers[peerId].seq === seq) {
        delete peers[peerId]
      }
    })

    // Save the connection
    if (!peers[peerId]) {
      peers[peerId] = {}
    }
    peers[peerId].conn = conn;
    peers[peerId].seq = seq;
    connSeq++;

  })

  // Read user message from command line
  askUser()

})()