const mongoose = require('mongoose'); 
const UserProfile = require('../models/userProfile');

exports.user_profile_picture = (req, res, next) => {
    const profilePicture = new UserProfile({
        _id: new mongoose.Types.ObjectId(),
        fieldName: req.file.fieldname,
        originalName: req.file.originalname, 
        created_at: new Date()
    });
    profilePicture
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'profile has been added',
                status: 'success',
                result
            });
        })
        .catch(err => {
            res.json({
                err
            })
        })
};