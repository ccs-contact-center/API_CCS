var router = require("express").Router();
var constants = require("../../../constants");
var utils = require("../../../utils.js");
var exjwt = require("express-jwt");
var fetch = require("node-fetch");
var nodeMailer = require("nodemailer");
var md5 = require("md5");
var sql = require("mssql");
var jwt = require("jsonwebtoken");
var path = require("path");
const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t",
});

var fs = require("fs");
var nJwt = require("njwt");
var base64url = require("base64-url");

function generar(longitud) {
  var caracteres =
    "abcdefghjkmnpqrtuvwxyzABCDJKMNPQRTUVWXYZ2346789#!?#!?#!?#!?";
  var contraseña = "";
  for (i = 0; i < longitud; i++)
    contraseña += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
  return contraseña;
}

requestObjetivo = async (data) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const response = await await fetch(
    "https://api.ccscontactcenter.com/v1/auth/getToken",
    { headers, method: "POST", body: data }
  );
  var token = await response.json();

  return token.token;
};

router.post("/Login", (req, res) => {
  const { username, password } = req.body;

  var query =
    "SELECT * FROM [CCS].[dbo].[Usuarios] WHERE id_ccs = '" +
    username +
    "' AND pass_ccs = '" +
    password +
    "'";

  sql.connect(constants.dbConfig, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(query, function (err, recordset) {
      if (err) console.log(err);

      if (recordset === undefined) {
        console.log("undefinido");
      }

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
        res.json({
          sucess: false,
          token: null,
          err: "Tu usuario o password es incorrecto",
        });
      }
    });
  });
});

router.post("/Coronalogin", (req, res) => {
  const { username, password } = req.body;

  var query =
    "SELECT * FROM [Coronabase].[dbo].[Coronaempleados] WHERE usuario = '" +
    username +
    "'";

  sql.connect(constants.dbCluster, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(query, function (err, recordset) {
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
          err: "Username or password is incorrect",
        });
      }
    });
  });
});

router.post("/getToken", (req, res) => {
  const { username, mail } = req.body;

  var query =
    "SELECT * FROM [CCS].[dbo].[Usuarios] WHERE id_ccs = '" + username + "'";

  sql.connect(constants.dbConfig, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(query, function (err, recordset) {
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
          err: "Username or password is incorrect",
        });
      }
    });
  });
});

router.get("/", (req, res) => {
  res.send("You are authenticated");
  console.log("router.stack");
});

router.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send(err);
  } else {
    next(err);
  }
});

router.get("/resetPassword", async function (req, res) {
  var ascii = new Buffer.from(req.query.data, "base64").toString("ascii");
  var arrObjetivo = await this.requestObjetivo(ascii);
  var dataJSON = JSON.parse(ascii);

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + arrObjetivo,
  };

  fetch("https://api.ccscontactcenter.com/v1/auth/resetPassword", {
    headers,
    method: "POST",
    body: ascii,
  })
    .then((res) => res.text())
    .then((body) => console.log(body));

  //res.send("Se restableció la contraseña con éxito. Recibiras un mail a " + dataJSON.mail + " con la nueva contraseña.")

  res.redirect("../../../successUpdate.html");
});

router.post("/resetPassword", jwtMW, function (req, res) {
  var password = generar(8);

  var msgHTML =
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml"><head><meta content="text/html; charset=utf-8" http-equiv="Content-Type"/><meta content="width=device-width" name="viewport"/><meta content="IE=edge" http-equiv="X-UA-Compatible"/><title></title><style type="text/css">body{margin: 0;padding: 0;}table,td,tr{vertical-align: top;border-collapse: collapse;}*{line-height: inherit;}a[x-apple-data-detectors=true]{color: inherit !important;text-decoration: none !important;}.ie-browser table{table-layout: fixed;}[owa] .img-container div,[owa] .img-container button{display: block !important;}[owa] .fullwidth button{width: 100% !important;}[owa] .block-grid .col{display: table-cell;float: none !important;vertical-align: top;}.ie-browser .block-grid,.ie-browser .num12,[owa] .num12,[owa] .block-grid{width: 600px !important;}.ie-browser .mixed-two-up .num4,[owa] .mixed-two-up .num4{width: 200px !important;}.ie-browser .mixed-two-up .num8,[owa] .mixed-two-up .num8{width: 400px !important;}.ie-browser .block-grid.two-up .col,[owa] .block-grid.two-up .col{width: 300px !important;}.ie-browser .block-grid.three-up .col,[owa] .block-grid.three-up .col{width: 300px !important;}.ie-browser .block-grid.four-up .col [owa] .block-grid.four-up .col{width: 150px !important;}.ie-browser .block-grid.five-up .col [owa] .block-grid.five-up .col{width: 120px !important;}.ie-browser .block-grid.six-up .col,[owa] .block-grid.six-up .col{width: 100px !important;}.ie-browser .block-grid.seven-up .col,[owa] .block-grid.seven-up .col{width: 85px !important;}.ie-browser .block-grid.eight-up .col,[owa] .block-grid.eight-up .col{width: 75px !important;}.ie-browser .block-grid.nine-up .col,[owa] .block-grid.nine-up .col{width: 66px !important;}.ie-browser .block-grid.ten-up .col,[owa] .block-grid.ten-up .col{width: 60px !important;}.ie-browser .block-grid.eleven-up .col,[owa] .block-grid.eleven-up .col{width: 54px !important;}.ie-browser .block-grid.twelve-up .col,[owa] .block-grid.twelve-up .col{width: 50px !important;}</style><style id="media-query" type="text/css">@media only screen and (min-width: 620px){.block-grid{width: 600px !important;}.block-grid .col{vertical-align: top;}.block-grid .col.num12{width: 600px !important;}.block-grid.mixed-two-up .col.num3{width: 150px !important;}.block-grid.mixed-two-up .col.num4{width: 200px !important;}.block-grid.mixed-two-up .col.num8{width: 400px !important;}.block-grid.mixed-two-up .col.num9{width: 450px !important;}.block-grid.two-up .col{width: 300px !important;}.block-grid.three-up .col{width: 200px !important;}.block-grid.four-up .col{width: 150px !important;}.block-grid.five-up .col{width: 120px !important;}.block-grid.six-up .col{width: 100px !important;}.block-grid.seven-up .col{width: 85px !important;}.block-grid.eight-up .col{width: 75px !important;}.block-grid.nine-up .col{width: 66px !important;}.block-grid.ten-up .col{width: 60px !important;}.block-grid.eleven-up .col{width: 54px !important;}.block-grid.twelve-up .col{width: 50px !important;}}@media (max-width: 620px){.block-grid,.col{min-width: 320px !important;max-width: 100% !important;display: block !important;}.block-grid{width: 100% !important;}.col{width: 100% !important;}.col>div{margin: 0 auto;}img.fullwidth,img.fullwidthOnMobile{max-width: 100% !important;}.no-stack .col{min-width: 0 !important;display: table-cell !important;}.no-stack.two-up .col{width: 50% !important;}.no-stack .col.num4{width: 33% !important;}.no-stack .col.num8{width: 66% !important;}.no-stack .col.num4{width: 33% !important;}.no-stack .col.num3{width: 25% !important;}.no-stack .col.num6{width: 50% !important;}.no-stack .col.num9{width: 75% !important;}.video-block{max-width: none !important;}.mobile_hide{min-height: 0px;max-height: 0px;max-width: 0px;display: none;overflow: hidden;font-size: 0px;}.desktop_hide{display: block !important;max-height: none !important;}}</style></head><body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;"><style id="media-query-bodytag" type="text/css">@media (max-width: 620px){.block-grid{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col{min-width: 320px!important; max-width: 100%!important; width: 100%!important; display: block!important;}.col > div{margin: 0 auto;}img.fullwidth{max-width: 100%!important; height: auto!important;}img.fullwidthOnMobile{max-width: 100%!important; height: auto!important;}.no-stack .col{min-width: 0!important; display: table-cell!important;}.no-stack.two-up .col{width: 50%!important;}.no-stack.mixed-two-up .col.num4{width: 33%!important;}.no-stack.mixed-two-up .col.num8{width: 66%!important;}.no-stack.three-up .col.num4{width: 33%!important}.no-stack.four-up .col.num3{width: 25%!important}}</style><table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;" valign="top" width="100%"><tbody><tr style="vertical-align: top;" valign="top"><td style="word-break: break-word; vertical-align: top; border-collapse: collapse;" valign="top"><div style="background-color:#FFFFFF;"><div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;;"><div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;"><div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top;;"><div style="width:100% !important;"><div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><div align="center" class="img-container center fixedwidth" style="padding-right: 25px;padding-left: 25px;"><div style="font-size:1px;line-height:25px"> </div><img align="center" alt="Image" border="0" class="center fixedwidth" src="http://200.57.117.105/logo.jpg" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; border: 0; height: auto; float: none; width: 100%; max-width: 120px; display: block;" title="Image" width="120"/><div style="font-size:1px;line-height:25px"> </div></div></div></div></div></div></div></div><div style="background-color:#FFFFFF;"><div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #C00327;;"><div style="border-collapse: collapse;display: table;width: 100%;background-color:#C00327;"><div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top;;"><div style="width:100% !important;"><div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><div style="color:#FFFFFF;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;line-height:120%;padding-top:30px;padding-right:20px;padding-bottom:20px;padding-left:20px;"><div style="font-size: 12px; line-height: 14px; color: #FFFFFF; font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif;"><p style="font-size: 18px; line-height: 28px; text-align: center; margin: 0;"><span style="font-size: 24px;">Recuperación de Contraseña</span></p></div></div></div></div></div></div></div></div><div style="background-color:#FFFFFF;"><div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;;"><div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;"><div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top;;"><div style="width:100% !important;"><div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:15px; padding-right: 0px; padding-left: 0px;"><div style="color:#283C4B;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;line-height:150%;padding-top:10px;padding-right:30px;padding-bottom:10px;padding-left:30px;"><div style="font-size: 12px; line-height: 18px; color: #283C4B; font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif;"><p style="font-size: 12px; line-height: 24px; text-align: center; margin: 0;"><span style="font-size: 16px;"><strong><span style="line-height: 24px; font-size: 16px;">Contraseña restablecida</span></strong></span></p></div></div><div style="color:#283C4B;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;line-height:150%;padding-top:10px;padding-right:30px;padding-bottom:0px;padding-left:30px;"><div style="line-height: 18px; font-size: 12px; color: #283C4B; font-family: Arial, \'Helvetica Neue\', Helvetica, sans-serif;"><p style="line-height: 21px; text-align: center; font-size: 12px; margin: 0;"><span style="font-size: 14px;">Te enviamos tu nueva contraseña (en el recuadro rojo), te recomendamos ingresar a la aplicación y cambiarla. </br> </br> Distingue entre mayúsculas y minúsculas</span></p><p style="line-height: 18px; text-align: center; font-size: 12px; margin: 0;"> </p><p style="line-height: 21px; text-align: center; font-size: 12px; margin: 0;"></p></div></div><div align="center" class="button-container" style="padding-top:25px;padding-right:0px;padding-bottom:0px;padding-left:0px;"><div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#C00327;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #C00327;border-right:1px solid #C00327;border-bottom:1px solid #C00327;border-left:1px solid #C00327;padding-top:10px;padding-bottom:10px;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:14px;display:inline-block;"><span style="font-size: 16px; line-height: 32px;"><span style="font-family: \'lucida sans unicode\', \'lucida grande\', sans-serif;"><span style="font-size: 14px; line-height: 28px;">' +
    password +
    "</span></span></span></span></div></div></div></div></div></div></div></div></td></tr></tbody></table></body></html>";

  let transporter = nodeMailer.createTransport({
    host: constants.mailHost,
    port: constants.mailPort,
    secure: constants.mailSecure,
    auth: {
      user: constants.mailAccount,
      pass: constants.mailPass,
    },
  });

  let mailOptions = {
    from: '"Notificaciones CCS" <ccs.notificaciones@ccscontactcenter.com>', // sender address
    to: req.body.mail, // list of receivers
    subject: "Contraseña Actualizada", // Subject line
    //text: req.body.body, // plain text body
    html: "<html>" + msgHTML + "</html>", // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
    res.status(200).send({ Enviado: "ok" });
  });

  var query =
    "UPDATE [CCS].[dbo].[Usuarios] SET pass_ccs ='" +
    md5(password) +
    "' WHERE id_ccs = '" +
    req.body.username +
    "'";
  utils.executeQuery(res, query);
});

router.post("/changePassword", jwtMW, function (req, res) {
  var query =
    "UPDATE [CCS].[dbo].[Usuarios] SET pass_ccs ='" +
    req.body.password +
    "' WHERE id_ccs = '" +
    req.body.username +
    "'";
  utils.executeQuery(res, query);
});

var jwt_consumer_key =
  "3MVG9Kip4IKAZQEVqfLm8ZumQDciE2fl.S_E4XwoU51Ym6bgoCyotmPrFb9kA4SFh1Vvha5QjwoeFXI8iu9tx";

var jwt_consumer_keyEZET =
  "3MVG9CVKiXR7Ri5rmWroGb1B6_KbUtIrTu9iqCK9WJWUlJzATZN_VL_ojdmx71.Xzk5aGakcjSRYaQMF9Gq7B";
var jwt_aud = "https://login.salesforce.com";

function getJWTSignedToken_nJWTLib(sfdcUserName) {
  var claims = {
    iss: jwt_consumer_key,
    sub: sfdcUserName,
    aud: jwt_aud,
    exp: Math.floor(Date.now() / 1000) + 60 * 3,
  };

  return encryptUsingPrivateKey_nJWTLib(claims);
}

function getJWTSignedToken_nJWTLibEZET(sfdcUserName) {
  var claims = {
    iss: jwt_consumer_keyEZET,
    sub: sfdcUserName,
    aud: jwt_aud,
    exp: Math.floor(Date.now() / 1000) + 60 * 3,
  };

  return encryptUsingPrivateKey_nJWTLib(claims);
}

function encryptUsingPrivateKey_nJWTLib(claims) {
  var absolutePath = path.resolve("key.pem");
  var cert = fs.readFileSync(absolutePath);
  var jwt_token = nJwt.create(claims, cert, "RS256");
  //console.log(jwt_token);
  var jwt_token_b64 = jwt_token.compact();
  //console.log(jwt_token_b64);

  return jwt_token_b64;
}

router.get("/salesforceCCSAuth", (req, res) => {
  var sfdcURL = "https://login.salesforce.com/services/oauth2/token";

  var token = getJWTSignedToken_nJWTLib("iacontrerasg@icloud.com");

  var paramBody =
    "grant_type=" +
    base64url.escape("urn:ietf:params:oauth:grant-type:jwt-bearer") +
    "&assertion=" +
    token;
  var req_sfdcOpts = {
    url: sfdcURL,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: paramBody,
  };

  fetch(sfdcURL, req_sfdcOpts)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      res.send(json);
    });
});

router.get("/salesforceEzeteraAuth", (req, res) => {
  var sfdcURL = "https://login.salesforce.com/services/oauth2/token";

  var token = getJWTSignedToken_nJWTLibEZET(
    "isaac.contreras@ccscontactcenter.com"
  );

  var paramBody =
    "grant_type=" +
    base64url.escape("urn:ietf:params:oauth:grant-type:jwt-bearer") +
    "&assertion=" +
    token;
  var req_sfdcOpts = {
    url: sfdcURL,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: paramBody,
  };

  fetch(sfdcURL, req_sfdcOpts)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      res.send(json);
    });
});

router.post("/salesforceQuery", (req, res) => {
  var sfdcURL = req.body.instance + req.body.query;

  var req_sfdcOpts = {
    url: sfdcURL,
    method: "GET",
    headers: {
      Authorization: "Bearer " + req.body.token,
    },
  };

  fetch(sfdcURL, req_sfdcOpts)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      res.send(json);
    });
});

module.exports = router;
