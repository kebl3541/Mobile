const { buildLocationLabel } = require('./utils/weatherUtils');

const berlin = {
  name: "Berlin",
  admin1: "State of Berlin",
  country: "Germany"
};

// Simulate how it's mapped in useGeocoding.js
const mappedBerlin = {
  name: berlin.name,
  region: [undefined, berlin.admin1].filter(Boolean).join(', '),
  country: berlin.country
};

console.log('Mapped Berlin:', mappedBerlin);
console.log('Label:', buildLocationLabel(mappedBerlin));
