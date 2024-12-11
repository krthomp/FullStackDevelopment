const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trips');

// Define route for trips endpoint
router
    .route('/trips')
    .get(tripController.tripList) // GET Method for tripList
    .post(tripController.tripCreate); // POST Method for tripCreate

// Define route for a single trip by code
router
    .route('/trips/:tripCode')
    .get(tripController.tripsFindByCode)
    .put(tripController.tripsUpdateTrip); // GET Method for tripDetail

module.exports = router;
