const Router = require('express').Router();
const model = require('../model');

Router.post('/add', (req, res) =>{
    let permission = new model.Permission(req.body);
    permission.save((error, document) =>{
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