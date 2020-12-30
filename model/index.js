const vehicle = require('./Vehicle');
const user = require('./User');
const city = require('./City');
const group = require('./Group');
const permission = require('./Permission');
const station = require('./Station');
const camera = require('./Camera');
const alertModel = require('./Alert');
const log = require('./Log');

module.exports = {
    User: user,
    City: city,
    Group: group,
    Permission: permission,
    Vehicle: vehicle,
    Station: station,
    Camera: camera,
    AlertType: alertModel.type,
    Alert: alertModel.alert,
    Log: log
};