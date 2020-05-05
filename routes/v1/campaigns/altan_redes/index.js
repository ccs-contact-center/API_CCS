var router = require('express').Router();

// split up route handling

router.use('/', require('./altan_redes'));
// etc.

module.exports = router;