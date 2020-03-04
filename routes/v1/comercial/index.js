var router = require('express').Router();

// split up route handling

router.use('/', require('./comercial'));
// etc.

module.exports = router;