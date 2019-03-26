var Peer = require("simple-peer");
var wrtc = require("wrtc");
const WebSocket = require("ws");
const uuid = require("uuid");
const Game = require("./game");
const msgpack = require("@ygoe/msgpack");

const game = new Game();
game.addContact();
game.addContact();
game.start();

const peers = {};
game.setCallback(game => {
  Object.values(peers)
    .filter(Boolean)
    .forEach(p => p.send(msgpack.serialize(game.contacts)));
});
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  const id = uuid.v4();
  console.log("Made connection", id);
  var peer1 = new Peer({ initiator: true, wrtc: wrtc });
  peer1.on("signal", function(data) {
    ws.send(JSON.stringify(data));
  });
  ws.on("message", function incoming(message) {
    peer1.signal(JSON.parse(message));
  });

  ws.on("close", () => {
    if (!peers[id]) return;
    peers[id].destroy();
    peers[id] = null;
    peer1 = null;
  });
  peer1.on("connect", function() {
    peers[id] = peer1;
  });
  peer1.on("data", function(data) {
    if (data.toString() === "addContact") {
      game.addContact();
    }
  });
  peer1.on("error", function(error) {
    console.error(error);
  });
});

console.log("Started");
