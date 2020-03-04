var router = require('express').Router();

// split up route handling

router.use('/', require('./televia'));
router.use('/quejas', require('./quejas'));
// etc.

module.exports = router;