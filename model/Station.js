const mongoose = require('mongoose');

const StationSchema = mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    cameras:[
        {type: mongoose.Schema.Types.ObjectId, ref: 'Camera'}
    ],
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