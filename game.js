const interval = 1000 / 60;
const Contact = require("./contact");

function distance3d(coord2, coord1) {
  const { x: x1, y: y1, z: z1 } = coord1;
  let { x: x2, y: y2, z: z2 } = coord2;
  return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2 + (z2 -= z1) * z2);
}

function velocityAxis(v, l, d, maxVelocity, acceleration) {
  // Slow down as it approaches destination.
  const distance = Math.abs(d - l);
  return (
    Math.sign(v + Math.sign(d - l)) *
    Math.min(
      Math.abs(v + Math.sign(d - l) * acceleration),
      distance * 2,
      maxVelocity
    )
  );
}
function processVelocity({
  acceleration,
  maxVelocity,
  location,
  destination,
  velocity
}) {
  let x = velocityAxis(
    velocity.x,
    location.x,
    destination.x,
    maxVelocity,
    acceleration
  );
  let y = velocityAxis(
    velocity.y,
    location.y,
    destination.y,
    maxVelocity,
    acceleration
  );
  let z = velocityAxis(
    velocity.z,
    location.z,
    destination.z,
    maxVelocity,
    acceleration
  );
  return { x, y, z };
}
function processLocation({ velocity, location }) {
  let x = Math.min(1000, Math.max(-1000, velocity.x + location.x));
  let y = Math.min(1000, Math.max(-1000, velocity.y + location.y));
  let z = Math.min(1000, Math.max(-1000, velocity.z + location.z));

  return { x, y, z };
}

module.exports = class Game {
  constructor() {
    this.timeout = null;
    this.contacts = [];
    this.callback = null;
  }

  loop() {
    this.contacts.forEach(c => {
      // Update velocity
      c.velocity = processVelocity(c);
      // Update location
      c.location = processLocation(c);
      if (distance3d(c.location, c.destination) < 1) {
        c.destination = {
          x: Math.random() * 2000 - 1000,
          y: Math.random() * 2000 - 1000,
          z: Math.random() * 2000 - 1000
        };
      }
    });
    if (this.callback) {
      this.callback(this);
    }
    this.timeout = setTimeout(this.loop.bind(this), interval);
  }
  start() {
    if (!this.timeout) this.loop();
  }
  stop() {
    clearTimeout(this.timeout);
    this.timeout = null;
  }
  setCallback(cb) {
    this.callback = cb;
  }
  addContact() {
    this.contacts.push(new Contact({}));
  }
};
