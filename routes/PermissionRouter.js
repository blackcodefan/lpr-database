const Router = require('express').Router();
const model = require('../model');

Router.post('/create', (req, res) =>{
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

Router.get('/read', (req, res) =>{
    model.Permission.find({}, function(err, permissions) {
        let permissionMaps = {};

        permissions.forEach(function(permission) {
            permissionMaps[permission._id] = permission;
        });

        return res.status(200).send(permissionMaps);
    });
});

module.exports = Router;