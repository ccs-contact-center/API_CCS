var router = require("express").Router();

// split up route handling

router.use("/", require("./campaigns"));

// etc.

module.exports = router;
