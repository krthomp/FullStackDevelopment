const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('Trip');

const tripList = async (req, res) => {
    try {
        const trips = await Model.find({}).exec();
        if (!trips) {
            return res.status(404).json({ message: 'No trips found' });
        } else {
            return res.status(200).json(trips);
        }
    } catch (err) {
        return res.status(500).json({ message: 'Error retrieving trips', error: err });
    }
};

const tripsFindByCode = async (req, res) => {
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

const tripsAddTrip = async (req, res) => {
    try {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        const savedTrip = await newTrip.save();

        if (!savedTrip) {
            return res.status(400).json({ message: 'Failed to add trip' });
        } else {
            return res.status(201).json(savedTrip);
        }

    } catch (err) {
        return res.status(500).json({ message: 'Error adding trip', error: err });
    }
};

// PUT: /trips/:tripCode - Updates an existing Trip
const tripsUpdateTrip = async (req, res) => {
    console.log(req.params);
    console.log(req.body);

    try {
        const updatedTrip = await Model.findOneAndUpdate(
            { code: req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true } // Return the updated document
        ).exec();

        if (!updatedTrip) {
            return res.status(400).json({ message: 'Failed to update trip' });
        } else {
            return res.status(200).json(updatedTrip);
        }

    } catch (err) {
        return res.status(500).json({ message: 'Error updating trip', error: err });
    }
};

module.exports = {
    tripList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};
