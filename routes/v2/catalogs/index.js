var router = require('express').Router();

// split up route handling

router.use('/', require('./catalogs'));
// etc.

module.exports = router;