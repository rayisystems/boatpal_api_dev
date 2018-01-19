const mongoose = require('mongoose');

const userProfileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fieldName: String,
    originalName: String, 
    uploaded_at: String
});

module.exports = mongoose.model('UserProfile', userProfileSchema);