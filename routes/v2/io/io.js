var router = require("express").Router();
var nodeMailer = require("nodemailer");
var constants = require("../../../constants");

router.get("/", (req, res) => {
  res.send("io");
});

router.post("/send-email", (req, res) => {
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
    from: '"Notificaciones CCS" <ccs.notificaciones@ccscontactcenter.com>',
    to: req.body.to,
    subject: req.body.subject,
    html: "<html>" + req.body.body + "</html>", // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.status(500).send(error);
    }
    console.log("Message %s sent: %s", info.messageId, info.response);
    res.status(200).send({ Status: "Enviado" });
  });
});

module.exports = router;
