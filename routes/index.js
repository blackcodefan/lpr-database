const vehicle = require('./VehicleRouter');
const city = require('./CityRouter');
const group = require('./GroupRouter');
const permission = require('./PermissionRouter');
const user = require('./UserRouter');
const station = require('./StationRouter');

module.exports = {
    VehicleRouter: vehicle,
    CityRouter: city,
    GroupRouter: group,
    PermissionRouter: permission,
    UserRouter: user,
    StationRouter: station
};