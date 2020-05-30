var router = require("express").Router();
var databases = require("../../../databases");
var exjwt = require("express-jwt");
var fetch = require("node-fetch");
var sql = require("mssql");
var jwt = require("jsonwebtoken");

requestToken = async (data) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const response = await await fetch(
    "https://api.ccscontactcenter.com/v2/Auth/getToken",
    { headers, method: "POST", body: data }
  );
  var token = await response.json();

  return token.token;
};

router.post("/Login", (req, res) => {
  const { username, password } = req.body;

  sql.connect(databases.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("USER", username);
    request.input("PASSWORD", password);
    request.query(
      "SELECT * FROM [CCS].[dbo].[SYS_Usuarios] WHERE id_ccs = @USER",
      (err, recordset) => {
        if (err) console.log(err);
        let exist =
          Array.isArray(recordset) && recordset.length === 1 ? true : false;

        if (exist === false) {
          res.json({
            sucess: false,
            token: null,
            err: "¡El usuario ingresado no existe!",
          });
        } else if (exist && recordset.length > 1) {
          res.json({
            sucess: false,
            token: null,
            err:
              "¡Existe más de un usuario con ese ID, favor de reportarlo a sistemas!",
          });
        } else if (
          exist &&
          recordset.length === 1 &&
          recordset[0].pass_ccs !== password
        ) {
          res.json({
            sucess: false,
            token: null,
            err: "¡El password introducido es incorrecto!",
          });
        } else if (
          exist &&
          recordset.length === 1 &&
          recordset[0].pass_ccs === password
        ) {
          let token = jwt.sign(recordset[0], "Grhzu92E_s3cr3t", {
            expiresIn: 1800,
          });
          res.json({
            sucess: true,
            err: null,
            token,
            recordset,
          });
        } else {
          res.json({
            sucess: false,
            token: null,
            err: "¡Ocurrió un error inesperado, por favor reportalo a sistemas!",
          });
        }
      }
    );
  });
});

router.post("/getToken", (req, res) => {
  const { username } = req.body;

  var query =
    "SELECT * FROM [CCS].[dbo].[Usuarios] WHERE id_ccs = '" + username + "'";

  sql.connect(constants.dbConfig, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(query, (err, recordset) => {
      if (err) console.log(err);

      if (recordset.length == 1) {
        let token = jwt.sign(recordset[0], "Grhzu92E_s3cr3t", {
          expiresIn: 1800,
        });
        res.json({
          sucess: true,
          err: null,
          token,
          recordset,
        });
      } else {
        res.status(401).json({
          sucess: false,
          token: null,
          err: "Tu usuario o password es incorrecto",
        });
      }
    });
  });
});

module.exports = router;
