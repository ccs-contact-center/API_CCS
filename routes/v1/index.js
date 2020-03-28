var router = require("express").Router();
var os = require("os");

router.use("/auth", require("./auth"));
router.use("/interface", require("./interface"));
router.use("/users", require("./users"));
router.use("/campaigns", require("./campaigns"));
router.use("/comercial", require("./comercial"));
router.use("/reports", require("./reports"));
router.use("/personal", require("./personal"));
router.use("/catalogs", require("./catalogs"));
router.use("/ventas", require("./ventas"));
router.use("/coronastuff", require("./coronastuff"));

router.get("/", function(req, res) {
  res.send("Respuesta desde " + os.hostname());
});

module.exports = router;
