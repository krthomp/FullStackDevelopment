const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Import the Trip model
const User = require('../models/user'); // Assuming you have a User model

// Function to get the user based on the request payload
const getUser = async (req, res, callback) => {
    if (req.payload && req.payload.email) {
        try {
            const user = await User.findOne({ email: req.payload.email }).exec();
            if (!user) {
                return res.status(404).json({ "message": "User not found" });
            }
            callback(req, res, user);
        } catch (err) {
            return res.status(500).json({ "message": "Error finding user", "error": err });
        }
    } else {
        return res.status(400).json({ "message": "No user email in the request payload" });
    }
};

// Get all trips (Listing trips)
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

// Get trip by code
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

// POST: Add a new trip
const tripAddTrip = async (req, res) => {
    getUser(req, res, async (req, res, user) => {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description,
            userId: user._id // Associate the trip with the user
        });

        try {
            const savedTrip = await newTrip.save();
            res.status(201).json(savedTrip);
        } catch (err) {
            res.status(400).json({ "message": "Error adding trip", "error": err });
        }
    });
};

// PUT: Update an existing trip by code
const tripsUpdateTrip = async (req, res) => {
    getUser(req, res, (req, res, user) => {
        Trip.findOneAndUpdate(
            { 'code': req.params.tripCode },  // Find the trip by code
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
            { new: true }  // Return the updated document
        )
        .then(trip => {
            if (!trip) {
                return res.status(404).send({
                    message: "Trip not found with code " + req.params.tripCode
                });
            }
            res.send(trip);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Trip not found with code " + req.params.tripCode
                });
            }
            return res.status(500).json(err);  // Server error
        });
    });
};

// Export functions to use them in routes
module.exports = {
    tripsList,
    tripsFindByCode,
    tripAddTrip,
    tripsUpdateTrip
};
