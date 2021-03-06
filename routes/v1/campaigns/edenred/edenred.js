var router = require('express').Router();

var constants = require('../../../../constants');
var utils = require("../../../../utils.js");

var exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: 'Grhzu92E_s3cr3t'
});



router.get('/Resumen_Edenred/',function(req, res) {
	
    var procedure = "[CCS].[dbo].[REP_WEB_REST_Edenred] @TIPO = " + req.query.tipo;
    utils.executeQuery(res, procedure);
})

router.get('/Totales_Edenred/',function(req, res) {
	
    var query = "[CCS].[dbo].[REP_WEB_REST_Edenred_Total] @TIPO = " + req.query.tipo;
    utils.executeQuery(res, query);
})

module.exports = router;