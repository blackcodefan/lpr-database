const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    license: {
        type: String,
        required: true,
    },
    station: {
        type: String,
        required: true
    },
    camera: {
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    color:{
        type: String,
        required: true
    },
    originColor:{// from renavam
        type: String,
        required: true
    },
    vehicleImg:{
        type: String,
        required:true
    },
    plateImg:{
        type: String,
        required: true
    },
    alert:{
        type: Number,
        default: 0
    },
    model:{
        type: String
    },
    renavam:{
        type: String
    },
    owner: {
        type: String
    },
    city:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    }
    },
    {
        timestamps: {
            createdAt: 'createdAt'
        }
    }
);

module.exports = mongoose.model('Vehicle', VehicleSchema);