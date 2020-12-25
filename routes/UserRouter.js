const Router = require('express').Router();
const model = require('../model');

Router.get('/:id', async (req, res) =>{
    model
        .User
        .findOne({_id: req.params.id})
        .populate({path: 'city', select: 'city, state'})
        .populate({path: 'group', select: 'name'})
        .populate({path: 'permissions', select: 'name'})
        .exec()
        .then(user =>{
            res.status(200).send(user)
        })
        .catch(error =>{
            res.status(400).send({
                success: false,
                error: error
            })
        });
});

Router.post('/add', (req, res) => {
    let user = new model.User(req.body);
    user.save((error, document) =>{
        if(error)
            return res.status(400).send({
                true:false,
                error: error
            });

        return res.status(201).send({
            success: true,
            record: document
        })
    });
});

module.exports = Router;