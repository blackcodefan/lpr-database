const mongoose = require('mongoose');

const PermissionSchema = mongoose.Schema({
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

module.exports = mongoose.model('Permission', PermissionSchema);