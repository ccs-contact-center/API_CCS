var router = require('express').Router();

// split up route handling

router.use('/', require('./quejas'));
// etc.

module.exports = router;