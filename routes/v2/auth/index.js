var router = require('express').Router();

// split up route handling

router.use('/', require('./auth'));
// etc.

module.exports = router;