var router = require("express").Router();
var sql = require("mssql");
var constants = require("../../../constants");
var utils = require("../../../utils.js");

var exjwt = require("express-jwt");

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t",
});

router.get("/Campanias", (req, res) => {
  var query =
    "SELECT DISTINCT id_campania,campania,server,status ,id_local FROM CCS.dbo.Campanias WHERE status = 1 ORDER BY campania";
  utils.executeQuery(res, query);
});

router.get("/Avatar", jwtMW, (req, res) => {
  var query =
    "SELECT DISTINCT avatar FROM [CCS].[dbo].[Campanias] WHERE id_campania = '" +
    req.query.id +
    "'";
  utils.executeQuery(res, query);
});

router.get("/getByname/:name", jwtMW, (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(
      "SELECT id FROM CCS.dbo.SYS_Campanias WHERE nombre = '" +
        req.params.name +
        "'",
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

module.exports = router;
