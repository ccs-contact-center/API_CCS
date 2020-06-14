var router = require("express").Router();

router.get("/", function (req, res) {
  res.send("Endpoints Capacitacion");
});

//Declaramos un endpoont POST para recibir un payload en json
router.post("/EjemploDany", (req, res) => {
  //Creamos una conexión a  SQL con la configuracion del  40 en constants.db40
  sql.connect(constants.db40, (err) => {
    //Manejamos errores en la conexión
    if (err) console.log(err);

    //Declaramoos un nuevo request (Una petición única dentro de la conexión)
    var request = new sql.Request();
    //Agregamos parametros, uno por cada  campo a recibir, del lado izquierdo el nombre del parametro y del lado derecho el parametro recibido del json
    //(req.body trae el payload que enviamos desde la app)
    //Ejemplo:
    //{ parametro1:valor1, parametro2:valor2 }
    //req.boody.parametro1 devolvería valor1
    //Importante agregar parametros de esta forma para evitar inyección SQL
    request.input("PARAMETRO1", req.body.parametro1);
    request.input("PARAMETRO2", req.body.parametro2);
    //Ejecutamos nuestra consulta SQL
    //SUPER IMPORTANTE siempre tener una clausula output para poder devolver algo en nuestro endpoint
    request.query(
      `INSERT INTO CCS.dbo.SYS_Empleados (
            status,
            id_ccs,
        ) OUTPUT INSERTED.id VALUES (
            @RECLUTADOR,
            @RECLUTADOR
            )`,
    //Manejamos los resultados, err en caso de error y recordset en caso de ejecución correcta
      (err, recordset) => {
    //Si error, pintamos en consola el error devuelto
        if (err) console.log(err);
    //Si se ejecuta correctamente, devolvemos el resultadoo del output de la consulta
        res.send(recordset);
      }
    );
  });
});

module.exports = router;
