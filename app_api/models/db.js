const mongoose = require('mongoose');

// Use environment variable for host or default to localhost
const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = `mongodb://${host}/travlr`;
const readLine = require('readline');

// Connect to the database with a timeout
const connect = () => {
    setTimeout(() => mongoose.connect(dbURI, {}), 1000);
};

// Monitor Mongoose connection events
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Handle Windows-specific SIGINT signal
if (process.platform === 'win32') {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.on('SIGINT', () => {
        process.emit('SIGINT');
    });
}

// Graceful shutdown function
const gracefulShutdown = (msg) => {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}`);
    });
};

// Listen for process signals for graceful shutdown
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart');
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', () => {
    gracefulShutdown('app termination');
    process.exit(0);
});

process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown');
    process.exit(0);
});

// Make initial connection
connect();

// Import the Mongoose schema
require('./travlr');

// Export the Mongoose instance for use in the app
module.exports = mongoose;
