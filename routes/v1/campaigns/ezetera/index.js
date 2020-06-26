var router = require('express').Router();

// split up route handling

router.use('/', require('./ezetera'));
// etc.

module.exports = router;