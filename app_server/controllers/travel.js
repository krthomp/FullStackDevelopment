const tripsEndpoint = 'https://localhost:3000/api/trips';
const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
}

// var fs = require('fs');
// var trips  = JSON.parse(fs.readFileSync('app_server/controllers/travel.json', 'utf8'));

/* Get travel view */
const travel = async function (req, res, next) {
    await fetch(tripsEndpoint, options)
        .then(res => res.json())
        .then(json => {
            let message = null;
            if(!(json instanceof Array)) {
                message = "API lokcup error";
                json = [];
            } else {
                if(!json.length){
                    message = "No trips exist in your database!";
                }
            }
            res.render('travel', {title: 'Travlr Getaways', trips: json, message});
            })
            .catch(err => res.status(500).send (e.message));
};

module.exports = {
    travel
};