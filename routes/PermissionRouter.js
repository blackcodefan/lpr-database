const Router = require('express').Router();
const model = require('../model');

Router.post('/create', (req, res) =>{
    model.Permission.create(req.body, (error, document)=>{
        if(error)
            res.status(500).send({success: false, errorMsg: "Algo deu errado"});

        return res.status(201).send({
            success: true,
            record: document
        })
    });
});

Router.get('/fetchAll', (req, res) =>{
    model.Permission.find({}, null, {sort: {city: 'asc'}},function(err, permissions) {
        if (err)
            return res.status(500).send({
                success: false,
                errorMsg: "Algo deu errado"
            });
        return res.status(200).send({success: true, permissions:permissions});
    });
});

module.exports = Router;