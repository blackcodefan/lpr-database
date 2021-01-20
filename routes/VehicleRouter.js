const Router = require('express').Router();
const path = require('path');
const {promisify} = require('util');
const client = require('../service/redisDB');
const hmget = promisify(client.hmget).bind(client);
const passport = require('passport');
const passportConfig = require('../passport');
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
        this.alert = 0;
        this.street = '';
        this.city = '';
        this.model = '';
        this.renavamId = '';
        this.owner = '';
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
            alertType: alertTypes[this.alert],
            city: this.city,
            street: this.street,
            model: this.model,
            renavam: this.renavamId,
            owner: this.owner
        }
    }
}

const groupsForAlert = [
    '5ff8c5a94ec2f1483053684d',
    '5ff8c5f24ec2f14830536851',
    '5ff8c6034ec2f14830536852',
    '5ff8c6114ec2f14830536853',
    '5ff8c61a4ec2f14830536854'
];

const alertTypes = [
    'Nenhum',
    'Roubo',
    'Licenciamento',
    'Renajud',
    'Envolvido na ocorrência',
    'Investigado'
];

const rootPath = path.dirname(require.main.filename || process.mainModule.filename);

const thread = data =>{
    return new Promise((resolve, reject) =>{
        const worker = new Worker(`${rootPath}/service/worker.js`, {workerData:data});
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
                errorMsg: "Não autorizado"});

    let vehicle = new VehicleImageInterpreter(req.body.image);
    let renavamData = await hmget('renavam', vehicle.license);

    if(renavamData[0]){
        let renavamObj = JSON.parse(renavamData[0]);
        let modelId = renavamObj.makeAndModel;
        let modelData = await hmget('brand', modelId);
        if(modelData[0]){
            vehicle.model = modelData[0];
        }
        vehicle.renavamId = renavamObj.renavamId;
        vehicle.owner = renavamObj.owner;
    }

    let alerts = await hmget('alert', vehicle.license);

    if(alerts[0]){
        vehicle.alert = parseInt(alerts[0]);

        let station = await model.Station.findOne({id: vehicle.station});
        let camera = await model.Camera.findOne({cameraId: vehicle.camera, station: station._id});
        let city = await model.City.findById(camera.city);
        vehicle.street = camera.street;
        vehicle.city = `${city.city}-${city.state}`;
        let users = [];
        if(vehicle.alert === 1 || vehicle.alert === 4){
            users = await model.User.find({city: station.city, group: {$in: groupsForAlert}}, {_id: 0, role: 0, password: 0, createdAt: 0, updatedAt: 0});
            thread({vehicle: vehicle.toJson(), users: JSON.stringify(users)});
        }else if(vehicle.alert === 5){
            let alert = await model.Alert.findOne({plate: vehicle.license, type: vehicle.alert});
            if(alert){
                users = await model.User.find({_id: alert.createdBy}, {_id: 0, role: 0, password: 0, createdAt: 0, updatedAt: 0});
                thread({vehicle: vehicle.toJson(), users: JSON.stringify(users)});
            }
        }
    }

    /// missing system notification

    model.Vehicle.create(vehicle.toJson(), (error, document) =>{
        if(error)
            return res.status(500).send({success: 0});

        else {
            if(vehicle.alert !== 0){
                io.emit('vehicle', document);
            }
            return res.status(201).send({success: 1});
        }
    });
});

Router.post('/fetchAll', passport.authenticate('jwt', {session: false}), async (req, res) =>{

    let count = await model.Vehicle.countDocuments(req.body.filterObj);

    model.Vehicle.find(req.body.filterObj)
        .sort(req.body.sort)
        .skip((req.body.page -1) * req.body.sizePerPage)
        .limit(req.body.sizePerPage)
        .exec((error, documents) =>{
            if(error){
                return res.status(500).send({
                    success: false,
                    errorMsg: "Algo deu errado"
                });
            }

            return res.status(200).send({success: true, vehicles: documents, total: count});
        })
});

Router.post('/alert', passport.authenticate('jwt', {session: false}), async (req, res) =>{

    // console.log(count);
    let filter = {};
    req.body.filterObj.alert.length < 1
        ?filter.alert = {$ne: 0}
        :filter.alert = {$in: req.body.filterObj.alert};
    if(req.body.filterObj.range){
        let day = new Date();
        day.setDate(day.getDate() - req.body.filterObj.range);
        filter.createdAt = {$gte: day}
    }

    let count = await model.Vehicle.countDocuments(filter);
    model.Vehicle.find(filter)
        .sort(req.body.sort)
        .skip((req.body.page -1) * req.body.sizePerPage)
        .limit(req.body.sizePerPage)
        .exec((error, documents) =>{
            if(error){
                return res.status(500).send({
                    success: false,
                    errorMsg: "Algo deu errado"
                });
            }

            return res.status(200).send({success: true, vehicles: documents, total: count});
        })
});

Router.get('/fetch/:id', passport.authenticate('jwt', {session: false}), async (req, res) =>{
    let vehicle = await model.Vehicle.findById({_id: req.params.id}, {_id: 0});
    if(vehicle){
        let station = await model.Station.findOne({id: vehicle.station})
            .populate({path: 'city'});
        let camera = await model.Camera.findOne({station: station._id, cameraId: vehicle.camera});
        return res.status(200).send({
            success: true,
            vehicle: vehicle,
            station: station,
            camera: camera
        })
    }else {
        return res.status(400).send({success: false, errorMsg: 'Relatório não existe'});
    }
});

module.exports = Router;