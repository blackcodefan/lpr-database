const mongoose = require('mongoose');

const CitySchema = mongoose.Schema({
    city:{
        type: String,
        required: true
    },
    state:{
        type: String,
        required: true
    }
    },
    {
        timestamps: {
            createdAt: 'createdAt'
        }
    }
    );

module.exports = mongoose.model('City', CitySchema);