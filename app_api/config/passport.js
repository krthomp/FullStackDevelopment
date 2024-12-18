const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');

// Set up the Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email', // Using 'email' field for username
}, (username, password, done) => {
    // Find the user by email
    User.findOne({ email: username }, (err, user) => {
        if (err) {
            return done(err); // If there's an error, pass it to done
        }

        if (!user) {
            return done(null, false, {
                message: 'Incorrect username.', // If no user is found
            });
        }

        if (!user.validPassword(password)) {
            return done(null, false, {
                message: 'Incorrect password.', // If password is incorrect
            });
        }

        return done(null, user); // If everything is valid, return the user
    });
}));
