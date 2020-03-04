var router = require('express').Router();
var os = require('os')
var apicache = require('apicache')
var cache = apicache.middleware


router.use('/auth', require('./auth'));
router.use('/interface', require('./interface'));
router.use('/users', require('./users'));
router.use('/campaigns', require('./campaigns'));
router.use('/comercial', require('./comercial'));
router.use('/reports', require('./reports'));
router.use('/personal', require('./personal'));
router.use('/catalogs', require('./catalogs'));
router.use('/ventas', require('./ventas'));

router.get('/',cache('5 minutes'),function(req, res) {


  res.send('Respuesta desde ' + os.hostname())
  
  })

  router.get('/daniel'), function(req,res){
      
  }

module.exports = router;