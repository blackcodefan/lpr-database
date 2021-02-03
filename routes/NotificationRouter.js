const Router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const model = require('../model');

Router.get('/get', passport.authenticate('jwt', {session: false}), async (req, res) =>{

    let count = await model.Notification.countDocuments({user: req.user._id, status: false});

    model.Notification.find({user: req.user._id, status: false})
        .populate({path: 'vehicle'})
        .limit(100)
        .exec((error, documents) =>{
            if(error){
                return res.status(500).send({
                    success: false,
                    errorMsg: "Algo deu errado"
                });
            }

            return res.status(200).send({success: true, notifications: documents, total: count});
        });
});

Router.get('/read/:id', passport.authenticate('jwt', {session: false}), async (req, res) =>{
    model.Notification.findByIdAndUpdate(req.params.id, {status: true},  (error, doc) =>{
        if(error){
            return res.status(500).send({
                success: false,
                errorMsg: "Algo deu errado"
            });
        }else{
            return res.status(200).send({
                success: true,
                notification: doc
            })
        }
    })
});

module.exports = Router;