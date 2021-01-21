const mongoose = require('mongoose');

const NotificationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicle:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('Notification', NotificationSchema);