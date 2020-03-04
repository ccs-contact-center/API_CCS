var router = require('express').Router();

// split up route handling

router.use('/', require('./reports'));
// etc.

module.exports = router;