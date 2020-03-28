var router = require("express").Router();

var parser = require("xml2json-light");
var sql = require("mssql");
var moment = require("moment");
var constants = require("../../../constants");
var utils = require("../../../utils.js");

var exjwt = require("express-jwt");

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t"
});

router.post("/updateStatus", function(req, res) {
  sql.connect(constants.dbCluster, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("USER", req.body.usuario);
    request.input("STATUS", req.body.status);
    request.query(
      "UPDATE [Coronabase].[dbo].[Coronaempleados] SET status = @STATUS, ultimo_status = GETDATE() OUTPUT inserted.id WHERE usuario = @USER",
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.post("/login", function(req, res) {
	sql.connect(constants.dbCluster, function(err) {
	  if (err) console.log(err);
  
	  var request = new sql.Request();
	  request.input("USER", req.body.usuario);
	  request.input("PASS", req.body.pass);
	  request.query(
		"SELECT * FROM [Coronabase].[dbo].[Coronaempleados] WHERE usuario",
		function(err, recordset) {
		  if (err) console.log(err);
  
		  res.send(recordset);
		}
	  );
	});
  });

module.exports = router;
