const mongoose = require('mongoose');

const PermissionSchema = mongoose.Schema({
        id:{
            type: Number,
            required: true,
            unique: true
        },
        name:{
            type: String,
            required: true
        },
        description:{
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