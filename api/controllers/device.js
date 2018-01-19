const mongoose = require('mongoose');
const unixTimeStamp = require('unix-time');
const Device = require('../models/device')

exports.devices_get_all_device = (req, res, next) => {
    Device.find()
        .select('_id device data time duplicate snr station avgSnr lat lng rssi seqNumber')
        .exec()
        .then(docs => {
            const devices = docs.map(doc => {
                return {
                    _id: doc._id,
                    device: doc.device,
                    data: doc.data,
                    time: doc.time,
                    duplicate: doc.duplicate,
                    snr: doc.snr,
                    station: doc.station,
                    avgSnr: doc.avgSnr,
                    lat: doc.lat,
                    lng: doc.lng,
                    rssi: doc.rssi,
                    seqNumber: doc.seqNumber,
                    request: {
                        type: "GET",
                        url: "http://159.89.164.181:3000/devices/" + doc._id
                    }
                };
            })
            res.status(200).json(devices);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
};

exports.devices_create_device = (req, res, next) => {

    const device = new Device({
        _id: new mongoose.Types.ObjectId(),
        device: req.body.device,
        data: req.body.data,
        D_data: new Buffer(req.body.D_data),
        time: unixTimeStamp(new Date()),
        duplicate: req.body.duplicate,
        snr: req.body.snr,
        station: req.body.station,
        avgSnr: req.body.avgSnr,
        lat: req.body.lat,
        lng: req.body.lng,
        rssi: req.body.rssi,
        seqNumber: req.body.seqNumber
    });

    device
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Device created successfully",
                createdDevice: {
                    device
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/devices/" + result._id
                }
            })
        })
        .catch()
};