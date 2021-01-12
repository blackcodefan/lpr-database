const Router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const model = require('../model');

Router.get('/fetchAll', passport.authenticate('jwt', {session: false}), (req, res) =>{
    model.Station.find()
        .sort({id: 'asc'})
        .populate({path: 'city', select: ['city', 'state']})
        .exec((error, documents) =>{
            if(error)
                return res.status(500).send({
                    success: false,
                    errorMsg: "Something went wrong"
                });
            return res.status(200).send({success: true, stations: documents});
        })
});

Router.post('/create', passport.authenticate('jwt', {session: false}), (req, res) =>{
    let station = new model.Station(req.body);
    station.save((error, document) =>{
        if(error){
            if(error.code === 11000)
            return res.status(400).send({
                success:false,
                errorCode: 11000,
                errorMsg: "Station Id is duplicated!"
            });
            else return res.status(500).send({
                success:false,
                errorMsg: "Something went wrong!"
            })
        }


        return res.status(201).send({
            success: true,
            record: document
        })
    });
});

Router.put('/update', passport.authenticate('jwt', {session: false}), (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permission denied"});
    }

    model.Station.findByIdAndUpdate(req.body.id, req.body.query,  {useFindAndModify: false},(err, docs) => {
        if (err){
            if(err.code === 11000){
                res.status(400).send({success:false, errorMsg: "Station Id duplicated"});
            }else{
                res.status(500).send({success:false, errorMsg: "Something went wrong"});
            }
        }
        else{
            res.status(202).send({success:true, docs: docs});
        }
    });
});

Router.delete('/delete', passport.authenticate('jwt', {session: false}),  (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permission denied"});
    }
    model.Station.deleteMany({_id: {$in: req.body.stations}})
        .then(response =>{
            res.status(202).send({success: true, count: response.deletedCount});
        });
});

module.exports = Router;