const vehicle = require('./Vehicle');
const user = require('./User');
const city = require('./City');
const group = require('./Group');
const permission = require('./Permission');
const station = require('./Station');

module.exports = {
    User: user,
    City: city,
    Group: group,
    Permission: permission,
    Vehicle: vehicle,
    Station: station
};