var router = require('express').Router();

// split up route handling

router.use('/', require('./personal'));
// etc.

module.exports = router;