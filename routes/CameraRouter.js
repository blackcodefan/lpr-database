const Router = require('express').Router();
const passport = require('passport');
const passportConfig = require('../passport');
const model = require('../model');

Router.post('/fetchAll', passport.authenticate('jwt', {session: false}), async (req, res) =>{

    let count = await model.Camera.countDocuments(req.body.filterObj);

    model.Camera.find(req.body.filterObj)
        .sort(req.body.sort)
        .skip((req.body.page -1) * req.body.sizePerPage)
        .limit(req.body.sizePerPage)
        .populate({path: 'city', select: ['city', 'state']})
        .populate({path: 'station', select: ['id']})
        .exec((error, documents) =>{
            if(error){
                return res.status(500).send({
                    success: false,
                    errorMsg: "Algo deu errado"
                });
            }

            return res.status(200).send({success: true, cameras: documents, total: count});
        })
});

Router.get('/fetch', passport.authenticate('jwt', {session: false}), async (req, res) =>{
    model.Camera.find()
        .populate({path: 'city', select: ['city', 'state']})
        .populate({path: 'station', select: ['id']})
        .exec((error, documents) =>{
            if(error){
                return res.status(500).send({
                    success: false,
                    errorMsg: "Algo deu errado"
                });
            }

            return res.status(200).send({success: true, cameras: documents});
        })

});

Router.post('/create', passport.authenticate('jwt', {session: false}), (req, res) =>{
    let camera = new model.Camera(req.body);
    model.Camera.findOne({station: req.body.station, cameraId: req.body.cameraId})
        .then(document=>{
            if(document)
                return res.status(400).send({
                    true:false,
                    errorMsg: "Id da câmera duplicada"
                });
            else
                camera.save((error, document) =>{
                    if(error)
                        return res.status(500).send({
                            true:false,
                            errorMsg: error.message
                        });

                    return res.status(201).send({
                        success: true,
                        record: document
                    })
                });
        });
});

Router.put('/update', passport.authenticate('jwt', {session: false}), (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }


    model.Camera.findByIdAndUpdate(req.body.id, req.body.query,  {useFindAndModify: false},(err, docs) => {
        if (err){
            res.status(500).send({success:false, errorMsg: "Algo deu errado"})
        }
        else{
            res.status(202).send({success:true, docs: docs});
        }
    });
});

Router.delete('/delete', passport.authenticate('jwt', {session: false}),  (req, res) =>{
    if(req.user.role !== 'admin'){
        return res.status(401).send({success: false, errorMsg: "Permissão negada"});
    }
    model.Camera.deleteMany({_id: {$in: req.body.cameras}})
        .then(response =>{
            res.status(202).send({success: true, count: response.deletedCount});
        });
});

module.exports = Router;