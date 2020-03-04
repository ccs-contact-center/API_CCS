var router = require('express').Router();
var constants = require('../../../../../constants');
var utils = require("../../../../../utils.js");
var apicache = require('apicache')
var cache = apicache.middleware

var exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: 'Grhzu92E_s3cr3t'
});


router.get('/',jwtMW,cache('5 minutes'),function(req, res) {
   res.send('Endpoint Televia Quejas')
})

router.get('/Medio',jwtMW,cache('5 minutes'),function(req, res) {
    var procedure = "[CCS].[dbo].[REP_WEB_REST_Televia_Medio_Quejas] @TIPO =" + req.query.tipo 
    utils.executeQuery(res, procedure);
})

router.get('/Top_5_Motivos',jwtMW,cache('5 minutes'),function(req, res) {
    var procedure = "[CCS].[dbo].[REP_WEB_REST_Televia_Top_5_Motivos] @TIPO =" + req.query.tipo 
    utils.executeQuery(res, procedure);
})

router.get('/Top_5_Vialidades',jwtMW,cache('5 minutes'),function(req, res) {
    var procedure = "[CCS].[dbo].[REP_WEB_REST_Televia_Top_5_Vialidades] @TIPO =" + req.query.tipo 
    utils.executeQuery(res, procedure);
})




module.exports = router;