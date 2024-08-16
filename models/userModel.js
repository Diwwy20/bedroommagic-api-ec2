const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'please add name'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'please add password'],
        min: 6,
        max: 64
    },
    role: {
        type: String,
        default: 'user'
    }
}, 
    {timestamps: true}
);

module.exports = mongoose.model('User', userSchema);