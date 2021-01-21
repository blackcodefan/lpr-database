const Router = require('express').Router();
const crypto = require('crypto');
const passport = require('passport');
const JWT = require('jsonwebtoken');
const sendMail = require('../service/mailer');
const passportConfig = require('../passport');
const model = require('../model');

const signToken = userId =>{
   return JWT.sign({
       iss: 'lpr',
       sub: userId,
   }, 'lpr', {expiresIn: "1h"});
};

Router.post('/create', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }

    model.User.findOne({email: req.body.email}, (error, user) =>{
        if(error){
            if(error.code === 11000){
                return res.status(400).send({success: false, errorMsg: "Alguns campos duplicados"});
            }else{
                return res.status(500).send({success: false, errorMsg: "Algo deu errado"});
            }
        }
        if(user)
            return res.status(400).send({
                success: false,
                errorMsg: "O usuário já existe com este e-mail"
            });

        let newUser = new model.User(req.body);
        newUser.save((error, document) =>{
            if(error){
                return res.status(500).send({
                    success:false,
                    errorMsg: "Algo deu errado"
                });
            }
            return res.status(201).send({
                success: true,
                user: document
            })
        });
    });

});

Router.post('/fetchAll', passport.authenticate('jwt', {session: false}), async (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }
    let count = await model.User.countDocuments(req.body.filterObj);

    model.User.find(req.body.filterObj)
        .sort(req.body.sort)
        .skip((req.body.page -1) * req.body.sizePerPage)
        .limit(req.body.sizePerPage)
        .populate({path: 'city', select: ['city', 'state']})
        .populate({path: 'group', select: ['name']})
        .populate({path: 'permissions', select: ['name']})
        .exec((error, documents) =>{
            if(error){
                return res.status(500).send({
                    success: false,
                    errorMsg: "Algo deu errado"
                });
            }

            return res.status(200).send({success: true, users: documents, total: count});
        })
});

Router.put('/update/:id', passport.authenticate('jwt', {session: false}), (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }

    model.User.findById(req.params.id, (error, user) =>{
        if(error){
            return res.status(500).send({success: false, errorMsg: "Algo deu errado"});
        }

        user.name = req.body.name;
        user.cpf = req.body.cpf;
        user.organization = req.body.organization;
        user.city = req.body.city;
        user.group = req.body.group;
        user.permissions = req.body.permissions;
        user.email = req.body.email;
        user.whatsApp = req.body.whatsApp;
        user.mobile = req.body.mobile;
        user.role = req.body.role;
        user.sms = req.body.sms;
        user.whatsAppMessage = req.body.whatsAppMessage;
        user.mail = req.body.mail;

        user.save((error, document) =>{
            if(error){
                return res.status(500).send({
                    success:false,
                    errorMsg: "Algo deu errado"
                });
            }
            return res.status(201).send({
                success: true,
                user: document
            })
        });
    });
});

Router.delete('/delete', passport.authenticate('jwt', {session: false}), (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }
    model.User.deleteMany({_id: {$in: req.body.users}})
        .then(response =>{
            res.status(202).send({success: true, count: response.deletedCount});
        });
});

Router.post('/login', passport.authenticate('local', {session: false}), (req, res) =>{
    if(req.isAuthenticated()){
        const token = signToken(req.user._id);
        res.cookie('access_token', token, {httpOnly: true, sameSite: true});
        res.status(200).send({success: true, user: req.user});
        model.Log.create({
            action: 'Login',
            user: req.user._id,
            description: 'User logged in'
        }).then((res) =>{
            console.log(res)
        })
    }
});

Router.post('/logout', passport.authenticate('jwt', {session: false}), (req, res) =>{
    res.clearCookie('access_token');
    res.status(200).send({success: true});
});

Router.get('/authenticated', passport.authenticate('jwt', {session: false}), (req, res) =>{
    res.status(200).send({isAuthenticated: true, user: req.user});
});

Router.get('/profile/:id', passport.authenticate('jwt', {session: false}), (req, res) =>{
    model.User
        .findById({_id: req.params.id}, {_id: 0, password: 0})
        .populate({path: 'permissions', select: 'name'})
        .exec((error, document) =>{
            if(error)
                return res.status(400).send({
                    success: false,
                    errorMsg: "Algo deu errado"
                });
            return res.status(200).send({success: true, profile: document});
        });
});

Router.get('/count', passport.authenticate('jwt', {session: false}), async (req, res) =>{
    let count = await model.User.countDocuments();

    return res.status(200).send({success: true, total: count});
});

Router.post('/reset-link', (req, res) =>{
    crypto.randomBytes(32, (err, buffer) =>{
        if(err){
            console.log(err);
        }
        const token = buffer.toString("hex");
        model.User.findOne({email: req.body.email})
            .then(user =>{
                if(!user){
                    return res.status(422).send({success: false, errorMsg: "Usuário não existe"});
                }else{
                    user.resetToken = token;
                    user.tokenExpire = Date.now() + 3600000;
                    user.save()
                        .then(response =>{
                            sendMail.sendResetMail(user.email, token);
                            return res.status(200).send({success: true});
                        })
                }
            })
    });
});

Router.get('/get-link/:token', (req, res) =>{
    model.User.findOne({resetToken: req.params.token})
        .then(user =>{
            if(!user){
                return res.status(400).send({success: false, errorMsg: 'Token inválido'});
            }else{
                if(user.tokenExpire.getTime() > Date.now())
                    return res.status(200).send({success: true, user: user});
                else
                    return res.status(400).send({success: false, errorMsg: "Link expirado"});
            }
        });
});

Router.put('/reset-password', (req, res) =>{
    model.User.findOne({_id: req.body._id, resetToken: req.body.resetToken})
        .then(user =>{
            if(!user){
                return res.status(400).send({success: false, errorMsg: "Usuário não existe"});
            }else{
                if(user.tokenExpire.getTime() > Date.now()){
                    user.password = req.body.password;
                    user.resetToken = '';
                    user.tokenExpire = '';
                    user.save()
                        .then(response =>{
                            return res.status(200).send({success: true});
                        })
                }
                else
                    return res.status(400).send({success: false, errorMsg: "Link expirado"});
            }
        })
});

module.exports = Router;