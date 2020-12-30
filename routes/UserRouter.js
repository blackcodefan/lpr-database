const Router = require('express').Router();
const passport = require('passport');
const JWT = require('jsonwebtoken');
const passportConfig = require('../passport');
const model = require('../model');

const signToken = userId =>{
   return JWT.sign({
       iss: 'lpr',
       sub: userId,
   }, 'lpr', {expiresIn: "1h"});
};

Router.post('/register', passport.authenticate('jwt', {session: false}), (req, res) => {
    model.User.findOne({email: req.body.email}, (error, user) =>{
        if(error)
            return res.status(500).send({
                success: false,
                message: "Error occurred"
            });
        if(user)
            return res.status(400).send({
                success: false,
                message: "User already exists with this email"
            });

        let newUser = new model.User(req.body);
        newUser.save((error, document) =>{
            if(error)
                return res.status(400).send({
                    success:false,
                    error: error
                });

            return res.status(201).send({
                success: true,
                user: document
            })
        });
    });

});

Router.post('/login', passport.authenticate('local', {session: false}), (req, res) =>{
    if(req.isAuthenticated()){
        const token = signToken(req.user._id);
        res.cookie('access_token', token, {httpOnly: true, sameSite: true});
        res.status(200).send({success: true, user: req.user})
    }
});

Router.post('/logout', passport.authenticate('jwt', {session: false}), (req, res) =>{
    res.clearCookie('access_token');
    res.status(200).send({success: true});
});

Router.get('/authenticated', passport.authenticate('jwt', {session: false}), (req, res) =>{
    res.status(200).send({isAuthenticated: true, user: req.user});
});

Router.get('/:id', passport.authenticate('jwt', {session: false}), (req, res) =>{
    model.User
        .findById({_id: req.params.id})
        .populate({path: 'city', select: 'city, state'})
        .populate({path: 'group', select: 'name'})
        .populate({path: 'permissions', select: 'name'})
        .exec((error, document) =>{
            if(error)
                return res.status(400).send({
                    success: false,
                    error: error
                });
            return res.status(200).send(document);
        });
});

module.exports = Router;