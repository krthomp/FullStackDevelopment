const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Import the Trip model

const tripsList = async (req, res) => {
    try {
        const trips = await Trip.find({}).exec();
        if (!trips) {
            return res.status(404).json({ "message": "Trips not found" });
        }
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json({ "message": "Error retrieving trips", "error": err });
    }
};

const tripsFindByCode = async (req, res) => {
    try {
        const trip = await Trip.findOne({ 'code': req.params.tripCode }).exec();
        if (!trip) {
            return res.status(404).json({ "message": "Trip not found" });
        }
        res.status(200).json(trip);
    } catch (err) {
        res.status(500).json({ "message": "Error retrieving trip", "error": err });
    }
};

// POST /trips - Add a new trip
const tripAddTrip = async (req, res) => {
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

    try {
        const q = await newTrip.save();
        res.status(201).json(q);
    } catch (err) {
        res.status(400).json({ "message": "Error adding trip", "error": err });
    }
};

// PUT: /trips/:tripCode - Update an existing trip
const tripsUpdateTrip = async (req, res) => {
    // Uncomment for debugging
    // console.log(req.params);
    // console.log(req.body);

    try {
        const q = await Trip.findOneAndUpdate(
            { 'code': req.params.tripCode },
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

        if (!q) {
            return res.status(400).json({ "message": "Trip not found" });
        } else {
            return res.status(200).json(q);
        }
    } catch (err) {
        return res.status(500).json({ "message": "Error updating trip", "error": err });
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripAddTrip,
    tripsUpdateTrip // Include the new function in the exports
};