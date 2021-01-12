const mongoose = require('mongoose');

const CameraSchema = mongoose.Schema({
    cameraId:{
        type: String,
        required: true
    },
    model:{
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    station: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Station'
    },
    city:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'City'
    },
    location:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },
    street:{
        type: String,
        required: true
    },
    neighborhood:{
        type: String,
        required: true
    },
    serialNumber:{
        type: String,
        required: true
    },
    note:{
        type: String,
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Camera', CameraSchema);