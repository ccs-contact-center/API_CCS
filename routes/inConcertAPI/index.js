var router = require("express").Router();
var os = require("os");

router.use("/campaigns", require("./campaigns"));

router.get("/", (req, res) => {
  res.send("Respuesta desde " + os.hostname());
});

module.exports = router;
