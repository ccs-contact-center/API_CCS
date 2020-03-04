var router = require('express').Router();

var constants = require('../../../constants');
var utils = require("../../../utils.js");

var exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: 'Grhzu92E_s3cr3t'
});



router.get('/Campanias',function(req, res) {
  var query = "SELECT DISTINCT id_campania,campania,server,status ,id_local,avatar FROM CCS.dbo.Campanias WHERE status = 1 ORDER BY campania";
  utils.executeQuery(res, query);
})

router.get('/Avatar',jwtMW,function(req, res) {
  var query = "SELECT DISTINCT avatar FROM [CCS].[dbo].[Campanias] WHERE id_campania = '" + req.query.id + "'";
  utils.executeQuery(res, query);
})


module.exports = router;