var router = require("express").Router();

var constants = require("../../../../constants");
var utils = require("../../../../utils.js");
var sql = require("mssql");
var exjwt = require("express-jwt");

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t",
});

router.get("/general", function (req, res) {
  sql.connect(constants.dbConfig, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("TIPO", req.query.tipo);
    request.input("TOTALIZADO", req.query.totalizado);
    request.input("BASE", req.query.base);

    request.query(
      "EXEC CCS.dbo.REP_WEB_REST_Altan_Redes @CAMPANIA = 23,@TIPO = @TIPO,@TOTALIZADO = @TOTALIZADO,@BASE = @BASE",
      function (err, recordset) {
        if (err) console.log(err);
        res.send(recordset);
      }
    );
  });
});

router.get("/bases", function (req, res) {
  sql.connect(constants.dbConfig, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("TIPO", req.query.tipo);
    request.input("TOTALIZADO", req.query.totalizado);
    request.input("BASE", req.query.base);

    request.query("SELECT * FROM altanredes_out.dbo.bases", function (
      err,
      recordset
    ) {
      if (err) console.log(err);
      res.send(recordset);
    });
  });
});

module.exports = router;
