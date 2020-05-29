var router = require('express').Router();

// split up route handling

router.use('/', require('./io'));
// etc.

module.exports = router;