const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    city:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'City'
    }
    },
    {
        timestamps: {
            createdAt: 'createdAt'
        }
    });

module.exports = mongoose.model('Group', GroupSchema);