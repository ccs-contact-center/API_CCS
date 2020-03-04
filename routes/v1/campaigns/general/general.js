var router = require('express').Router();


var constants = require('../../../../constants');
var utils = require("../../../../utils.js");

var exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: 'Grhzu92E_s3cr3t'
});



//Mantenido por compatibilidad con la app
router.get('/Application_Data',jwtMW,function(req, res) {
    var procedure = "[CCS].[dbo].[REP_WEB_REST_Aplicacion] @CAMPANIA = " + req.query.campania + " , @TIPO = " + req.query.tipo;
    utils.executeQuery(res, procedure);
})


router.get('/General',jwtMW,function(req, res) {
    var procedure = "[CCS].[dbo].[REP_WEB_REST_Campanias_General] @TOTALIZADO =" + req.query.totalizado + ",@CAMPANIA = " + req.query.campania + " , @TIPO = " + req.query.tipo;
    utils.executeQuery(res, procedure);
})

router.get('/Objetivos',jwtMW,function(req, res) {
    var query = "SELECT DISTINCT id_campania ,campania ,SLA,ABA,AHT,TT ,OCCY,QA FROM CCS.dbo.Campanias WHERE id_campania = " + req.query.campania;
    utils.executeQuery(res, query);
})

module.exports = router;