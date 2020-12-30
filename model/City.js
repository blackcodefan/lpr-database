const mongoose = require('mongoose');

const CitySchema = mongoose.Schema({
    id:{
        type: String,
        //required: true,
        //unique: true
    },
    city:{
        type: String,
        required: true,
        unique: true
    },
    state:{
        type: String,
        default: "SC"
    }
    },
    {
        timestamps: {
            createdAt: 'createdAt'
        }
    }
    );

module.exports = mongoose.model('City', CitySchema);