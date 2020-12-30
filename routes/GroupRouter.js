const Router = require('express').Router();
const model = require('../model');

Router.post('/register', (req, res) =>{
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

Router.get('/read', (req, res) =>{
    model.Group.find({}, function(err, groups) {
        let groupMap = {};

        groups.forEach(function(group) {
            groupMap[group._id] = group;
        });

        return res.status(200).send(groupMap);
    });
});

module.exports = Router;