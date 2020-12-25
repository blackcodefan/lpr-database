const Router = require('express').Router();
const model = require('../model');

Router.post('/add', (req, res) =>{
    let station = new model.Station(req.body);
    station.save((error, document) =>{
        if(error)
            return res.status(401).send({
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