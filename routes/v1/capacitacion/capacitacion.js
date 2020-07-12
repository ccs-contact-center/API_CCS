var router = require("express").Router();
var sql = require("mssql");
var constants = require("../../../constants");

router.get("/", (req, res) => {
  res.send("Endpoints Capacitacion");
});

router.post("/ejemplo", (req, res) => {
  res.send(req.body.prueba);
});

router.post("/formularioEncuesta", (req, res) => {
  sql.connect(constants.db40, (err) => {
    if (err) console.log(err);
    var request = new sql.Request();

    request.input("pregunta1", req.body.pregunta1);
    request.input("pregunta2", req.body.pregunta2);
    request.input("pregunta3", req.body.pregunta3);
    request.input("pregunta4", req.body.pregunta4);
    request.input("pregunta5", req.body.pregunta5);
    request.input("pregunta6", req.body.pregunta6);
    request.input("pregunta7", req.body.pregunta7);
    request.input("pregunta8", req.body.pregunta8);
    request.input("pregunta9", req.body.pregunta9);
    request.input("pregunta10", req.body.pregunta10);
    request.input("nombre", req.body.nombre);
    request.input("paterno", req.body.paterno);
    request.input("materno", req.body.materno);
    request.query(
      `INSERT INTO [PruebaCurso].[dbo].[encuesta] (
        pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, pregunta6, pregunta7, pregunta8, pregunta9,  pregunta10, nombres, paterno, materno
        ) OUTPUT INSERTED.id VALUES (
            @pregunta1, @pregunta2,  @pregunta3,  @pregunta4,  @pregunta5,  @pregunta6,  @pregunta7,  @pregunta8,  @pregunta9,  @pregunta10, @nombre, @paterno, @materno
            )`,
      (err, recordset) => {
        if (err) console.log(err);
        res.send(recordset);
      }
    );
  });
});

module.exports = router;
