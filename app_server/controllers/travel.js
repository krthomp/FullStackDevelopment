const fetch = require("node-fetch"); // Ensure you have node-fetch installed and required

const tripsEndpoint = 'http://localhost:3000/api/trips';
const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
};

/* GET travel view */
const travel = async (req, res, next) => {
    try {
        const response = await fetch(tripsEndpoint, options); // Await fetch call
        const trips = await response.json(); // Await JSON parsing
        // Render the travel view with the fetched trips
        res.render('travel', { 
            title: 'Travlr Getaways', 
            trips 
        });
    } catch (err) {
        console.error('Error fetching trips:', err);
        res.render('error', { 
            message: 'Unable to fetch trips', 
            error: err 
        });
    }
};

module.exports = {
    travel
};
