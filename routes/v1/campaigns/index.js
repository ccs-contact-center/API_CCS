var router = require('express').Router();

// split up route handling

router.use('/', require('./campaigns'));
router.use('/general', require('./general'));
router.use('/vips', require('./vips'));
router.use('/edenred', require('./edenred'));
router.use('/televia', require('./televia'));
router.use('/televisa', require('./televisa'));
router.use('/casas_atlas', require('./casas_atlas'));
router.use('/altan_redes', require('./altan_redes'));
// etc.

module.exports = router;