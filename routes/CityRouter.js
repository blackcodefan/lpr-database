const Router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const model = require('../model');

Router.post('/create', passport.authenticate('jwt', {session: false}), (req, res) =>{
    if(req.user.role !== 'admin' && req.user.permissions.indexOf('5fe9ae45f92b033e84a33ac7') === -1){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }
    let city = new model.City(req.body);
    city.save((error, document) =>{
        if(error)
            return res.status(500).send({
                true:false,
                errorMsg: "Algo deu errado"
            });

        return res.status(201).send({
            success: true,
            record: document
        })
    });
});

Router.put('/update', passport.authenticate('jwt', {session: false}), (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }

    model.City.findById({_id: req.body._id})
        .then(document =>{
            document.city = req.body.city || document.city;
            document.state = req.body.state || document.state;
            document.save((error, document) =>{
                if(error)
                    return res.status(500).send({success: false, errorMsg: "Algo deu errado"});
                else
                    return res.status(202).send({success: true, city: document});
            });
        }).catch(error=>{
            return res.status(500).send({success:false, errorMsg: "Algo deu errado"});
    });
});

Router.delete('/delete', passport.authenticate('jwt', {session: false}),  (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }
    model.City.deleteMany({_id: {$in: req.body.cities}})
        .then(response =>{
            res.status(202).send({success: true, count: response.deletedCount});
        });
});

Router.get('/fetchAll', passport.authenticate('jwt', {session: false}), (req, res) =>{
    model.City.find({}, null, {sort: {city: 'asc'}},function(err, cities) {
        return res.status(200).send({success: true, cities:cities});
    });
});

module.exports = Router;