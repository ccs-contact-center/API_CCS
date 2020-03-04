var router = require('express').Router();

var constants = require('../../../../constants');
var utils = require("../../../../utils.js");

var exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: 'Grhzu92E_s3cr3t'
});



router.get('/',function(req, res) {
   res.send('Endpoint Televia')
})






module.exports = router;