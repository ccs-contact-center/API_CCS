var router = require("express").Router();

router.use("/campaigns", require("./campaigns"));
router.use("/agents", require("./agents"));

module.exports = router;
