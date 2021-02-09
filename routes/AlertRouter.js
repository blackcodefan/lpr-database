const Router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const model = require('../model');
const client = require('../service/redisDB');

Router.post('/create', passport.authenticate('jwt', {session: false}), (req, res) =>{
    if(req.user.role !== 'admin' && req.user.permissions.indexOf('5fe9aea2f92b033e84a33aca') === -1){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }
    let alert = {...req.body};
    alert.createdBy = req.user._id;
    model.Alert.create(alert, (error, document) =>{
        if(error){
            if(error.code === 11000){
                res.status(401).send({success: false, errorMsg: "Licença duplicada"})
            }else{
                res.status(500).send({success: false, errorMsg: "Algo deu errado"})
            }
        }else{
            client.hmset('alert', alert.plate, alert.type);
            res.status(201).send({success: true, doc: document})
        }
    });
});

Router.post('/fetchAll', passport.authenticate('jwt', {session: false}), async (req, res) =>{
    let count = await model.Alert.countDocuments(req.body.filterObj);

    model.Alert.find(req.body.filterObj)
        .sort(req.body.sort)
        .skip((req.body.page -1) * req.body.sizePerPage)
        .limit(req.body.sizePerPage)
        .populate({path: 'createdBy', select: ['name']})
        .exec((error, documents) =>{
            if(error){
                return res.status(500).send({
                    success: false,
                    errorMsg: "Algo deu errado"
                });
            }

            return res.status(200).send({success: true, alerts: documents, total: count});
        })
});

Router.put('/update', passport.authenticate('jwt', {session: false}), (req, res) =>{

    model.Alert.findByIdAndUpdate(req.body.id, req.body.query,  {useFindAndModify: false},(err, docs) => {
        if (err){
            res.status(500).send({success:false, errorMsg: "Algo deu errado"});
        }
        else{
            if(req.body.query.active !== null){
                if(req.body.query.type)
                    client.hmset('alert', docs.plate, req.body.query.type);
                else
                    client.hmset('alert', docs.plate, docs.type);
            }else{
                client.del('alert', docs.plate);
            }

            res.status(202).send({success:true, doc: docs});
        }
    });
});

Router.delete('/delete', passport.authenticate('jwt', {session: false}),  (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }
    model.Alert.find({_id: {$in: req.body.alerts}})
        .exec((error, documents) =>{
            if(error){
                return res.status(500).send({
                    success: false,
                    errorMsg: "Algo deu errado"
                });
            }

            for (let document of documents){
                client.del('alert', document.plate);
            }

            model.Alert.deleteMany({_id: {$in: req.body.alerts}})
                .then(response =>{
                    res.status(202).send({success: true, count: response.deletedCount});
                });
        });
});

Router.get('/count', passport.authenticate('jwt', {session: false}), async (req, res) =>{
    let count = 0;
    if(req.user.role !== 'admin'){
        count = await model.Alert.countDocuments({active: true});
    }else{
        count = await model.Alert.countDocuments({active: true, createdBy: req.user._id});
    }

    return res.status(200).send({success: true, total: count});
});

module.exports = Router;