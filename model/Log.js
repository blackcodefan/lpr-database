const mongoose = require('mongoose');

const LogSchema = mongoose.Schema({
    action:{
        type: String,
        required: true,
        enum: ['Login', 'Search', 'Create', 'Update', 'Delete', 'Alert']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    description:{
        type: String
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Log', LogSchema);