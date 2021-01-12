const mongoose = require('mongoose');

const StationSchema = mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
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