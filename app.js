var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('hbs');
const cors = require('cors'); // Importing the cors package

// Import Passport and Passport configuration
require('dotenv').config(); // Load environment variables from .env file
const passport = require('passport');
require('./app_api/models/user'); // Import Mongoose User model
require('./app_api/config/passport'); // Import Passport configuration

var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var travelRouter = require('./app_server/routes/travel');
var apiRouter = require('./app_api/routes/index');

// Connect to the database
require('./app_api/models/db');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server/views')); // Fixed views path
app.set('view engine', 'hbs');

// Register handlebars partials
hbs.registerPartials(path.join(__dirname, 'app_server/views/partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Enable CORS middleware globally for the Angular app (localhost:4200)
const corsOptions = {
  origin: 'http://localhost:4200', // Allow Angular to access Express
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'], // Allowed headers
};
app.use(cors(corsOptions));

app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Initialize Passport
app.use(passport.initialize()); // Initialize Passport authentication middleware

// Error handling for UnauthorizedError
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ "message": err.name + ": " + err.message });
  } else {
    next(err); // Pass the error to the next middleware if it's not UnauthorizedError
  }
});

// Wire-up routes to controllers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Generic error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
