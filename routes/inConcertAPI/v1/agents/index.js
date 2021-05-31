var router = require("express").Router();

router.use("/", require("./agents"));

module.exports = router;
