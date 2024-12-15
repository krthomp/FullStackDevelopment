var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main ');
const Trip = require('../models/travlr');

/* GET home page. */
router
    .get('/', ctrlMain.index);

module.exports = router;
