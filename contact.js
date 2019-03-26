const uuid = require("uuid");
module.exports = class Contact {
  constructor(params) {
    this.id = params.id || uuid.v4();
    this.location = params.location || {
      x: Math.random() * 1000 - 1000,
      y: Math.random() * 1000 - 1000,
      z: Math.random() * 1000 - 1000
    };
    this.destination = params.destination || {
      x: Math.random() * 1000 - 1000,
      y: Math.random() * 1000 - 1000,
      z: Math.random() * 1000 - 1000
    };
    this.velocity = params.location || {
      x: 0,
      y: 0,
      z: 0
    };
    this.maxVelocity = 3;
    this.acceleration = 0.1;
  }
};
