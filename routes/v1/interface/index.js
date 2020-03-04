var router = require('express').Router();

// split up route handling

router.use('/', require('./interface'));
// etc.

module.exports = router;