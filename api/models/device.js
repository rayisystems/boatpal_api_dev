const mongoose = require('mongoose');
const Float = require('mongoose-float');

const deviceSchema = mongoose.Schema({

    _id : mongoose.Schema.Types.ObjectId,

    device: String,

    data: String,

    D_data: String,

    time: Number,

    duplicate: Boolean,

    snr: {
        type: Float
    },

    station: String,

    avgSnr: {
        type: Float
    },

    lat: {
        type: Float
    },

    lng: {
        type: Float
    },

    rssi: {
        type: Float
    },

    seqNumber: String

});

module.exports = mongoose.model('Device', deviceSchema);