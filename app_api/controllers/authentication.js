const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

// Register a new user
const register = (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "All fields required" });
    }

    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password); // Hash and salt the password

    user.save((err) => {
        if (err) {
            res.status(400).json(err); // If saving the user fails, return an error
        } else {
            const token = user.generateJwt(); // Generate a JWT for the user
            res.status(200).json({ token }); // Send the token back in the response
        }
    });
};

// Login an existing user
const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "All fields required" });
    }

    // Authenticate the user with Passport's 'local' strategy
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(404).json(err); // If there's an error during authentication
        }
        if (user) {
            const token = user.generateJwt(); // Generate a JWT for the authenticated user
            res.status(200).json({ token }); // Send the token back in the response
        } else {
            res.status(401).json(info); // If authentication fails, send the error info
        }
    })(req, res); // Pass the request and response to the authenticate function
};

module.exports = {
    register,
    login
};
