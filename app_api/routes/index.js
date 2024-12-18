const express = require('express');
const router = express.Router();
const { expressjwt } = require('express-jwt'); // Correct import for express-jwt v7.x.x

const auth = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'], // Specify the algorithm
    userProperty: 'payload'
});

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Routes for trips
router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(auth, tripsController.tripAddTrip);

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(auth, tripsController.tripsUpdateTrip);

// Routes for authentication
router
    .route('/login')
    .post(authController.login);
router
    .route('/register')
    .post(authController.register);

module.exports = router;
