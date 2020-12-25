const Router = require('express').Router();
const path = require('path');
const {promisify} = require('util');
const client = require('../service/redisDB');
const hmget = promisify(client.hmget).bind(client);
const model = require('../model');
const { Worker } = require('worker_threads');

/**===============================
 *  Extract info from vehicle name. blueprint of vehicle info
 */
class VehicleImageInterpreter {
    constructor(filename){
        this.name = path.parse(filename).name;
        this.ext = path.parse(filename).ext;
        const namePiece = this.name.split('_');
        this.station = namePiece[0];
        this.camera = namePiece[1];
        this.license = namePiece[2];
        this.date = namePiece[3];
        this.time = namePiece[4];
        this.color = namePiece[5];
        this.alert = "0";
        this.email = '';
        this.mobile = '';
    }

    vehicleName(){
        return `${this.name}${this.ext}`
    }

    plateImgName(){
        return `${this.station}_${this.camera}_${this.license}_${this.date}_${this.time}${this.ext}`;
    }

    toJson(){
        return {
            station: this.station,
            camera: this.camera,
            license: this.license,
            date: this.date,
            time: this.time,
            color: this.color,
            vehicleImg: this.vehicleName(),
            plateImg: this.plateImgName(),
            alert: this.alert,
            email: this.email,
            mobile: this.mobile
        }
    }
}

const rootPath = path.dirname(require.main.filename || process.mainModule.filename);

const thread = vehicles =>{
    return new Promise((resolve, reject) =>{
        const worker = new Worker(`${rootPath}/service/worker.js`, {workerData:vehicles});
        worker.on('message', resolve);
        worker.on('error', reject);
    });
};

/**===========================
 *  Handle new vehicle request from station
 */
Router.post('/add', async (req, res) =>{

    if (req.headers.authorization !== process.env.SERVER_TOKEN)
        return res.status(401)
            .send({
                success: false,
                error: "Unauthorized"});

    let vehicle = new VehicleImageInterpreter(req.body.image);
    let alerts = await hmget('alert', vehicle.license); // get vehicle from redisDB

    if(alerts[0]){
        let alertObject = JSON.parse(alerts[0]);
        vehicle.alert = alertObject.alertType;
        if(alertObject.email) vehicle.email = alertObject.email;
        if(alertObject.mobile) vehicle.mobile = alertObject.mobile;
    }

    const vehicleModel = new model.Vehicle(vehicle.toJson());

    vehicleModel.save((error, document) =>{
        if(error)
            return res.status(403).send({
                true:false,
                error: error.message
            });

        return res.status(201).send({
            success: true,
            record: document
        })
    });
});

module.exports = Router;