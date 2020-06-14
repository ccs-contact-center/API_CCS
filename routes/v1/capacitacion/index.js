var router = require('express').Router();

// split up route handling

router.use('/', require('./capacitacion'));
// etc.

module.exports = router;