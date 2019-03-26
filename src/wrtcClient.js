import Peer from "simple-peer";
import msgpack from "@ygoe/msgpack";

export default class WrtcPeer {
  constructor({ url, onData = () => {} }) {
    this.peer = new Peer({
      initiator: window.location.hash === "#1",
      trickle: false
    });
    this.ws = new window.WebSocket(url);

    this.ws.onmessage = async data => {
      this.peer.signal(JSON.parse(data.data));
    };
    this.peer.on("error", function(err) {
      console.log("error", err);
    });

    this.peer.on("signal", data => {
      this.ws.send(JSON.stringify(data));
    });

    this.peer.on("connect", function() {
      this.connected = true;
    });

    this.peer.on("data", async function(data) {
      onData(msgpack.deserialize(data));
    });
  }
}
