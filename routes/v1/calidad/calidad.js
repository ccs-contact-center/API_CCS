var router = require("express").Router();
var utils = require("../../../utils.js");
var exjwt = require("express-jwt");

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t"
});

router.get("/LayoutOXXO", function(req, res) {
  var query = "";
  utils.executeQuery(res, query);
});

module.exports = router;
