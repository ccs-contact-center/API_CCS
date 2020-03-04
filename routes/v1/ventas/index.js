var router = require('express').Router();

// split up route handling

router.use('/', require('./ventas'));
// etc.

module.exports = router;