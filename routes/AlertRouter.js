const Router = require('express').Router();
const model = require('../model');

Router.post('/add', (req, res) =>{
    let alert = new model.Alert(req.body);
    alert.save((error, document) =>{
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

Router.post('/addType', (req, res) =>{
    let alert = new model.AlertType(req.body);
    alert.save((error, document) =>{
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