var router = require('express').Router();

// split up route handling

router.use('/', require('./calidad'));
// etc.

module.exports = router;