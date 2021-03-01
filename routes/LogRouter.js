const Router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const model = require('../model');

Router.post('/fetchAll', passport.authenticate('jwt', {session: false}), async (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }
    let count = await model.Log.countDocuments(req.body.filterObj);

    model.Log.find(req.body.filterObj)
        .populate({path: 'user', select: ['name']})
        .sort(req.body.sort)
        .skip((req.body.page -1) * req.body.sizePerPage)
        .limit(req.body.sizePerPage)
        .exec((error, documents) =>{
            if(error){
                return res.status(500).send({
                    success: false,
                    errorMsg: "Algo deu errado"
                });
            }

            return res.status(200).send({success: true, logs: documents, total: count});
        });
});

module.exports = Router;