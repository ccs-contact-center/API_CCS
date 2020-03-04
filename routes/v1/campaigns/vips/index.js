var router = require('express').Router();

// split up route handling

router.use('/', require('./vips'));
// etc.

module.exports = router;