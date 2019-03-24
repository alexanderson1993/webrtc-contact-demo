import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Peer from "simple-peer";

const ws = new window.WebSocket("ws://localhost:8080");

ws.onopen = function open() {};

const Contact = ({ location, dimensions }) => {
  const transform = `translate3d(${((location.x + 1000) / 2000) *
    dimensions.width}px, ${((location.y + 1000) / 2000) *
    dimensions.height}px, 0px)`;
  return (
    <div
      className="smol-contact"
      style={{
        transform
      }}
    />
  );
};

const App = () => {
  const p = useRef();
  const [contacts, setData] = useState([]);
  const error = console.error;
  console.error = err => {
    setData(err.message);
    error(err);
  };
  useEffect(() => {
    p.current = new Peer({
      initiator: window.location.hash === "#1",
      trickle: false
    });

    ws.onmessage = function incoming(data) {
      console.log(data);
      p.current.signal(JSON.parse(data.data));
    };
    p.current.on("error", function(err) {
      console.log("error", err);
    });

    p.current.on("signal", function(data) {
      ws.send(JSON.stringify(data));
    });

    p.current.on("connect", function() {
      console.log("CONNECT");
      p.current.send("whatever" + Math.random());
    });

    p.current.on("data", function(data) {
      setData(JSON.parse(String(data)));
    });

    return () => {
      p.current.destroy();
      p.current = null;
    };
  }, []);
  const addContact = () => {
    p.current && p.current.send("addContact");
  };
  const ref = useRef();
  const dimensions = ref.current && ref.current.getBoundingClientRect();
  return (
    <>
      <button onClick={addContact}>Add Contact</button>
      <div className="ship-container" ref={ref}>
        {dimensions &&
          contacts.map(c => (
            <Contact key={c.id} {...c} dimensions={dimensions} />
          ))}
      </div>
    </>
  );
};

export default App;
