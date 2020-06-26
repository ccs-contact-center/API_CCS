var router = require("express").Router();

var constants = require("../../../../constants");
var utils = require("../../../../utils.js");

var exjwt = require("express-jwt");

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t",
});

router.get("/Top10Tipificaciones", (req, res) => {
  var procedure =
    "EXEC   [CCS].[dbo].[REP_WEB_REST_Ezetera_TOP_10] @TIPO = " +
    req.query.tipo +
    ", @COLEGIO = " +
    req.query.colegio;
  utils.executeQuery(res, procedure);
});

module.exports = router;
