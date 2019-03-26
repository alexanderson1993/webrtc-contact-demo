import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import WrtcPeer from "./wrtcClient";

const actions = [];
const peer = new WrtcPeer({
  url: "ws://localhost:8080",
  onData: data => actions.forEach(a => a(data))
});

const Contact = ({ location, dimensions }) => {
  const transform = `translate3d(${((location.x + 1000) / 2000) *
    dimensions.width}px, ${((location.y + 1000) / 2000) *
    dimensions.height}px, ${(location.z + 1000) / 2000}px)`;
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
  const [contacts, setData] = useState([]);
  if (actions.length === 0) actions.push(setData);
  const addContact = () => {
    peer.peer.send("addContact");
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
