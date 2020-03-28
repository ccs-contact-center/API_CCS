var router = require('express').Router();

// split up route handling

router.use('/', require('./coronastuff'));
// etc.

module.exports = router;