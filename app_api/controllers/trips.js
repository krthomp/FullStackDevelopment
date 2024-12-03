const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

const tripList = async (req, res) => {
    const q = await Model.find({}).exec();
    if (!q) {
        return res.status(404).json({ message: 'No trips found' });
    } else {
        return res.status(200).json(q);
    }
};

const tripDetail = async (req, res) => {
    const { code } = req.params;
    try {
        const trip = await Model.findOne({ code: code }).exec();
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        return res.status(200).json(trip);
    } catch (err) {
        return res.status(500).json({ message: 'Error retrieving trip', error: err });
    }
};

module.exports = {
    tripList,
    tripDetail
};
