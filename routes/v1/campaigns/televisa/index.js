var router = require('express').Router();

// split up route handling

router.use('/', require('./televisa'));
// etc.

module.exports = router;