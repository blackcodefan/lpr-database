const mongoose = require('mongoose');

const AlertSchema = mongoose.Schema({
    plate:{
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: Number,
        required: true,
        enum:[1, 2, 3, 4, 5]
    },
    note:{
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Alert', AlertSchema);