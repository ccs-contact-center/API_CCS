var router = require("express").Router();
var os = require("os");

router.use("/auth", require("./auth"));
router.use("/io", require("./io"));
router.use("/users", require("./users"));
router.use("/reports", require("./reports"));
router.use("/personal", require("./personal"));
router.use("/catalogs", require("./catalogs"));

router.get("/", function (req, res) {
  res.send("Respuesta desde " + os.hostname());
});

module.exports = router;
