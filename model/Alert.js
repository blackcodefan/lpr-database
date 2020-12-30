const mongoose = require('mongoose');

const AlertTypeSchema = mongoose.Schema({
    type:{
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    });

const AlertSchema = mongoose.Schema({
    plate:{
        type: String,
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'AlertType'
    },
    note:{
        type: String,
    },
    approved:{
        type: Boolean,
        default: false
    },
    receiverType:{
        type: String,
        enum:['Individual', 'Group', 'City']
    },
    receiverIndividual:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverGroup:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    receiverCity:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    }
},
    {
        timestamps: true
    });

module.exports = {
    type: mongoose.model('AlertType', AlertTypeSchema),
    alert: mongoose.model('Alert', AlertSchema)
};