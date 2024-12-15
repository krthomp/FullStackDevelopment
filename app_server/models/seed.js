// Bring in the DB connection and Trip schema
const Mongoose = require('./db');
const Trip = require('./travlr');

// Read see data from JSON file
var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('./app_server/models/trips.json', 'utf8'));

// detlete any existing recors, then insert seed data
const seedDB = async () => {
    await Trip.deleteMany({});
    await Trip.insertMany(trips);
};

// Close the MongoDB connection and exit
seedDB().then(async() => {
    await Mongoose.connection.close();
    process.exit(0);
});