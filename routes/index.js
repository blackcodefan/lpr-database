const vehicle = require('./VehicleRouter');
const city = require('./CityRouter');
const group = require('./GroupRouter');
const permission = require('./PermissionRouter');
const user = require('./UserRouter');
const station = require('./StationRouter');
const camera = require('./CameraRouter');
const alert = require('./AlertRouter');
const notification = require('./NotificationRouter');

module.exports = {
    VehicleRouter: vehicle,
    CityRouter: city,
    GroupRouter: group,
    PermissionRouter: permission,
    UserRouter: user,
    StationRouter: station,
    CameraRouter: camera,
    AlertRouter: alert,
    NotificationRouter: notification
};