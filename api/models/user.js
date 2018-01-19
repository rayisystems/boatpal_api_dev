const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    local: {
        email: {
            type: String,
            unique: true,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        },
        password: {
            type: String,

        },
    },
    created_at: String,
    resetToken: String,
    resetToken_created_at: String,
    google: {
        userId: String,
        displayName: String,
        email:{
            type: String,
            unique: true
        }
    },
    facebook: {
        accessToken: String,
        userId: {
            type: String, 
            unique: true
        },
        expiresIn: Number
    }
});

module.exports = mongoose.model('User', userSchema);