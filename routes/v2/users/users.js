var router = require('express').Router();

var constants = require('../../../constants');
var utils = require("../../../utils.js");

var exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: 'Grhzu92E_s3cr3t'
});



router.get('/Profile',jwtMW,function(req, res) {

  var query = "SELECT * FROM [CCS].[dbo].[Usuarios] WHERE id_ccs = '" + req.query.user + "'";
  utils.executeQuery(res, query);

})

router.get('/Mail',function(req, res) {

    var query = "SELECT email FROM [CCS].[dbo].[Usuarios] WHERE id_ccs = '" + req.query.usuario + "' OR email = '" + req.query.usuario + "'";
    utils.executeQuery(res, query);
  
})

module.exports = router;