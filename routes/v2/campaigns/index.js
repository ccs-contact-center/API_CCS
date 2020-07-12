var router = require("express").Router();

router.use("/", require("./campaigns"));
router.use("/general", require("./general"));

module.exports = router;
