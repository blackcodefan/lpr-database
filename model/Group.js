const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    }
    },
    {
        timestamps: {
            createdAt: 'createdAt'
        }
    });

module.exports = mongoose.model('Group', GroupSchema);