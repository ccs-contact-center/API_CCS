var router = require("express").Router();
var sql = require("mssql");
var constants = require("../../constants");

router.get("/", function (req, res) {
  res.send("Endpoints de Prueba App CRUD");
});

router.get("/post", function (req, res) {
  sql.connect(constants.dbCluster, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(
      "SELECT * FROM EjemploCRUD.dbo.Posts",

      function (err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/post/:id", function (req, res) {
  sql.connect(constants.dbCluster, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.input("id", req.params.id);

    request.query(
      "SELECT * FROM EjemploCRUD.dbo.Posts WHERE id=@id",

      function (err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.post("/post", function (req, res) {
  sql.connect(constants.dbCluster, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.input("titulo", req.body.titulo);
    request.input("contenido", req.body.contenido);

    request.query(
      "INSERT INTO EjemploCRUD.dbo.Posts (fecha_alta,titulo, contenido) OUTPUT INSERTED.* VALUES (GETDATE(),@titulo,@contenido)",

      function (err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.put("/post/:id", function (req, res) {
  sql.connect(constants.dbCluster, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.input("id", req.params.id);
    request.input("titulo", req.body.titulo);
    request.input("contenido", req.body.contenido);

    request.query(
      "UPDATE EjemploCRUD.dbo.Posts SET titulo=@titulo, contenido=@contenido, fecha_update=GETDATE() OUTPUT INSERTED.* WHERE id =@id",

      function (err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.delete("/post/:id", function (req, res) {
  sql.connect(constants.dbCluster, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.input("id", req.params.id);

    request.query(
      "DELETE EjemploCRUD.dbo.Posts OUTPUT DELETED.* WHERE id =@id",

      function (err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/PruebaProduccion",(req,res)=>{
  res.send('Pruebita')
})
module.exports = router;
