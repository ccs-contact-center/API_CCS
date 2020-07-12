var router = require("express").Router();
var utils = require("../../../../utils.js");
var exjwt = require("express-jwt");
const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t",
});


module.exports = router;
