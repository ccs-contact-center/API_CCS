var router = require('express').Router();

// split up route handling

router.use('/', require('./general'));

// etc.

module.exports = router;