var router = require('express').Router();

// split up route handling

router.use('/', require('./campaigns'));
router.use('/general', require('./general'));
router.use('/vips', require('./vips'));
router.use('/edenred', require('./edenred'));
router.use('/televia', require('./televia'));
router.use('/casas_atlas', require('./casas_atlas'));
// etc.

module.exports = router;