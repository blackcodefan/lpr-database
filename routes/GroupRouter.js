const Router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const model = require('../model');

Router.post('/create', passport.authenticate('jwt', {session: false}), (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }

    model.Group.create(req.body, (error, document)=>{
        if(error){
            if(error.code === 11000){
                res.status(401).send({success: false, errorMsg: "Id duplicada"})
            }else{
                res.status(500).send({success: false, errorMsg: "Algo deu errado"})
            }
        }else{
            res.status(201).send({success: true, doc: document});
        }
    });

});

Router.get('/fetchAll', passport.authenticate('jwt', {session: false}), (req, res) =>{
    model.Group.find({}, null, {sort: {name: 'asc'}},function(err, groups) {
        if(err)
            res.status(500).send({success:false, errorMsg: "Algo deu errado"});
        else
            return res.status(200).send({success: true, groups:groups});
    });
});

module.exports = Router;