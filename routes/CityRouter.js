const Router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const model = require('../model');

Router.post('/create', passport.authenticate('jwt', {session: false}), (req, res) =>{
    let city = new model.City(req.body);
    city.save((error, document) =>{
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

Router.put('/update', passport.authenticate('jwt', {session: false}), (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, error: "Permission denied"});
    }

    model.City.findById({_id: req.body._id})
        .then(document =>{
            document.city = req.body.city || document.city;
            document.state = req.body.state || document.state;
            document.save((error, document) =>{
                if(error)
                    return res.status(500).send({success: false, error: error});
                else
                    return res.status(202).send({success: true, city: document});
            });
        }).catch(error=>{
            return res.status(500).send({success:false, error: error});
    });
});

Router.delete('/delete', passport.authenticate('jwt', {session: false}),  (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, error: "Permission denied"});
    }
    model.City.deleteMany({_id: {$in: req.body.id}})
        .then(response =>{
            res.status(202).send({success: true});
        });
});

Router.get('/fetchAll', passport.authenticate('jwt', {session: false}), (req, res) =>{
    model.City.find({}, function(err, cities) {
        return res.status(200).send({success: true, cities:cities});
    });
});

module.exports = Router;