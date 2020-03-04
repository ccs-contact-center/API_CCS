var router = require('express').Router();

// split up route handling

router.use('/', require('./edenred'));
// etc.

module.exports = router;