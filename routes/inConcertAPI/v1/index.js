var router = require("express").Router();

router.use("/campaigns", require("./campaigns"));

module.exports = router;
