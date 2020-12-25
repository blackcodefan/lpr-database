const mongoose = require('mongoose');

const StationSchema = mongoose.Schema({
    deviceId:{
        type: String,
        required: true,
        unique: true
    },
    model: {
        type: String,
        required: true
    },
    city:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    }
    },
    {
        timestamps: {
            createdAt: 'createdAt'
        }
    });

module.exports = mongoose.model('Station', StationSchema);