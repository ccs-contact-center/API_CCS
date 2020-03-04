var router = require('express').Router();

// split up route handling

router.use('/', require('./casas_atlas'));
// etc.

module.exports = router;