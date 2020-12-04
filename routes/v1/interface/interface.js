var router = require('express').Router();
var nodeMailer = require('nodemailer')
var constants = require('../../../constants');
const simpleGit = require('simple-git')


router.post('/send-email', function (req, res) {
  
  
      let transporter = nodeMailer.createTransport({
          host: constants.mailHost,
          port: constants.mailPort,
          secure: constants.mailSecure,
          auth: {
              user: constants.mailAccount,
              pass: constants.mailPass
          }
      });
      
      
      let mailOptions = {
          from: '"Notificaciones CCS" <ccs.notificaciones@ccscontactcenter.com>', // sender address
          to: req.body.to, // list of receivers
          subject: req.body.subject, // Subject line
          //text: req.body.body, // plain text body
          html: '<html>' + req.body.body + '</html>' // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              res.status(500).send(error)
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.status(200).send({'Status': 'Enviado'})
          });
      });


      router.post('/send-email-atlas', function (req, res) {
  
  
        let transporter = nodeMailer.createTransport({
            host: constants.mailHostAtlas,
            port: constants.mailPortAtlas,
            secure: constants.mailSecureAtlas,
            auth: {
                user: constants.mailAccountAtlas,
                pass: constants.mailPassAtlas
            }
        });
        
        
        let mailOptions = {
            from: '"Notificaciones Atlas" <css.notificaciones@atlasdesarrollos.com>', // sender address
            to: req.body.to, // list of receivers
            subject: req.body.subject, // Subject line
            //text: req.body.body, // plain text body
            html: '<html>' + req.body.body + '</html>' // html body
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).send(error)
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
                res.status(200).send({'Status': 'Enviado'})
            });
        });

        
router.post('/gitHubPull', function (req, res) {  

     simpleGit().pull('origin', 'master', {'--rebase': 'true'})
     console.log('Actualizado')
     res.status(200).json({"Actualizado": true});

  });


module.exports = router;