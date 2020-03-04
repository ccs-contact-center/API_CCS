var router = require('express').Router();

var constants = require('../../../../constants');
var utils = require("../../../../utils.js");

var exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: 'Grhzu92E_s3cr3t'
});



router.get('/Quejas_Diario',function(req, res) {
    var procedure = "[CCS].[dbo].[WEB_VIPS_Quejas_Diarias]";
    utils.executeProcedure(res, procedure);
})

router.get('/Tipo_Quejas', jwtMW,function(req, res) {
    var procedure = "[CCS].[dbo].[WEB_VIPS_Tipo_Quejas]";
    utils.executeProcedure(res, procedure);
})

router.get('/Top5_Motivos', jwtMW,function(req, res) {
    var procedure = "[CCS].[dbo].[WEB_VIPS_Top5_Motivos]";
    utils.executeProcedure(res, procedure);
})

router.get('/Resumen_Mensual', jwtMW,function(req, res) {
    var procedure = "[CCS].[dbo].[WEB_VIPS_Resumen_Mensual]";
    utils.executeProcedure(res, procedure);
})





module.exports = router;