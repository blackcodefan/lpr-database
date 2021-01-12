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

    model.User.findByIdAndUpdate(req.params.id, req.body,  {useFindAndModify: false},(err, docs) => {
        if (err){
            if(err.code === 11000){
                res.status(400).send({success:false, errorMsg: "Email ou cpf duplicado"});
            }else{
                res.status(500).send({success:false, errorMsg: "Algo deu errado"});
            }
        }
        else{
            res.status(202).send({success:true, doc: docs});
        }
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

module.exports = Router;