const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trips');

// Define route for trips endpoint
router.route('/trips').get(tripController.tripList); // GET Method for tripList

// Define route for a single trip by code
router.route('/trips/:code').get(tripController.tripDetail); // GET Method for tripDetail

module.exports = router;
