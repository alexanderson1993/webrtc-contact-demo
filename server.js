const express = require("express");
var Peer = require("simple-peer");
var wrtc = require("wrtc");
var cors = require("cors");
const WebSocket = require("ws");
const port = 3001;
const Game = require("./game");

const game = new Game();

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  var peer1 = new Peer({ initiator: true, wrtc: wrtc });
  var signal = null;
  var interval = null;
  peer1.on("signal", function(data) {
    // when peer1 has signaling data, give it to peer2 somehow
    if (!signal) signal = data;
    ws.send(JSON.stringify(data));
  });
  ws.on("message", function incoming(message) {
    console.log(message);
    peer1.signal(JSON.parse(message));
  });

  ws.send(signal);

  ws.on("close", () => {
    game.stop();
    clearInterval(interval);
    peer1.destroy();
    peer1 = null;
  });
  peer1.on("connect", function() {
    console.log("CONNECT");
    game.addContact();
    game.addContact();
    game.start();
    game.setCallback(game => {
      peer1.send(JSON.stringify(game.contacts));
    });
  });
  peer1.on("data", function(data) {
    if (data.toString() === "addContact") {
      game.addContact();
    }
  });
});

const app = express();
app.use(cors());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
