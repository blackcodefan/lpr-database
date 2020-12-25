const Router = require('express').Router();
const model = require('../model');

Router.post('/add', (req, res) =>{
    let group = new model.Group(req.body);
    group.save((error, document) =>{
        if(error)
            return res.status(400).send({
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