var router = require('express').Router();

// split up route handling

router.use('/', require('./users'));
// etc.

module.exports = router;