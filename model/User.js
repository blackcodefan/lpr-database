const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    cpf: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        required: true,
    },
    city:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
    },
    permissions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Permission'}],
    email:{
        type: String,
        required: true,
        unique: true
    },
    whatsApp:{
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sms:{
        type: Boolean,
        required: true,
    },
    whatsAppMessage: {
        type: Boolean,
        required: true
    },
    mail: {
        type: Boolean,
        required: true
    }
},
    {
        timestamps: true
    });

UserSchema.pre('save', function(next) {
    if (!this.isModified('password'))
        return next();
    bcrypt.hash(this.password, 10, (error, passwordHash) =>{
        if(error)
            return next(error);
        this.password = passwordHash;
        next();
    })
});

UserSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (error, isMatch) =>{
        if(error)
            return callback(error);
        else {
            if(!isMatch)
                return callback(null, isMatch);
            return callback(null, this);
        }
    })
};

module.exports = mongoose.model('User', UserSchema);