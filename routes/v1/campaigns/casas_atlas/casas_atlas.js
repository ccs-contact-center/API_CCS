var router = require("express").Router();

var constants = require("../../../../constants");
var utils = require("../../../../utils.js");
var sql = require("mssql");
var exjwt = require("express-jwt");

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t"
});

router.get("/clientes/", function(req, res) {
  var query =
    "SELECT no_cliente ,nombres ,paterno ,materno ,tel1 ,tel2 ,plaza  ,desarrollo ,cerrada ,manzana ,lote,interior FROM SQLCLUSTER.CasasAtlas.dbo.SYS_Clientes";

  utils.executeQuery(res, query);
});

router.get("/ticket", function(req, res) {
  var query =
    `SELECT
    a.nombre + ' ' + a.paterno + ' ' + a.materno as 'Cliente', 
    a.Plaza, 
    a.Desarrollo, 
    a.Cerrada, 
    a.Prototipo, 
    a.Manzana, 
    a.Lote, 
    a.Interior, 
    a.entrega_escrituras, 
    a.entrega_vivienda, 
    a.contacto as 'Responsable de la Llamada',
    b.tel1,
    b.tel2,
    a.racs as Detalles,
    fecha_alta as 'Fecha y Hora de Creacion'

FROM SQLCLUSTER.CasasAtlas.dbo.SYS_RACS a
LEFT JOIN SQLCLUSTER.CasasAtlas.dbo.SYS_Clientes b ON a.id_cliente = b.no_cliente
where a.clave_reporte = '` +
    req.query.ticket +
    `'`;

  utils.executeQuery(res, query);
});

router.post("/clientes/", function(req, res) {
  var entrega_vivienda = "";
  var entrega_escrituras = "";

  if (req.body.entrega_vivienda === "") {
    entrega_vivienda = "NULL";
  } else {
    entrega_vivienda =
      "CONVERT(DATETIME,'" + req.body.entrega_vivienda + "',101)";
  }

  if (req.body.entrega_escrituras === "") {
    entrega_escrituras = "NULL";
  } else {
    entrega_escrituras =
      "CONVERT(DATETIME,'" + req.body.entrega_escrituras + "',101)";
  }

  var query =
    "INSERT INTO SQLCLUSTER.CasasAtlas.dbo.SYS_Clientes (no_cliente,nombres,paterno,materno,sexo,fecha_nacimiento,estado_civil,plaza,desarrollo,cerrada,prototipo,sector,supermanzana,manzana,lote,interior,tel1,ext1,tel2,ext2,email,entrega_vivienda,entrega_escrituras) VALUES ('" +
    req.body.no_cliente +
    "', '" +
    req.body.nombres +
    "', '" +
    req.body.paterno +
    "', '" +
    req.body.materno +
    "', '" +
    req.body.sexo +
    "', CONVERT(DATETIME,'" +
    req.body.fecha_nacimiento +
    "',101), '" +
    req.body.estado_civil +
    "', '" +
    req.body.plaza +
    "','" +
    req.body.desarrollo +
    "', '" +
    req.body.cerrada +
    "', '" +
    req.body.prototipo +
    "', '" +
    req.body.sector +
    "','" +
    req.body.supermanzana +
    "','" +
    req.body.manzana +
    "', '" +
    req.body.lote +
    "', '" +
    req.body.interior +
    "', '" +
    req.body.tel1 +
    "', '" +
    req.body.ext1 +
    "', '" +
    req.body.tel2 +
    "', '" +
    req.body.ext2 +
    "', '" +
    req.body.email +
    "', " +
    entrega_vivienda +
    ", " +
    entrega_escrituras +
    ")";
  console.log(query);

  sql.connect(constants.dbConfig, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(query, function(err, recordset) {
      if (err) console.log(err);

      res.status(200).json({
        sucess: true,
        inserted: "OK",
        err: "OK"
      });
      //res.send("" + recordset[0].Id + "");
    });
  });
  //utils.executeQuery(res, query);
});

router.get("/clientes/:client", function(req, res) {
  var query =
    "SELECT id,no_cliente,nombres ,paterno ,materno,sexo,CONVERT(NVARCHAR(10),fecha_nacimiento,126) as fecha_nacimiento ,estado_civil,plaza ,desarrollo,cerrada,prototipo,sector,supermanzana ,manzana,lote ,interior ,tel1 ,ext1 ,tel2  ,ext2 ,email ,estado,CONVERT(NVARCHAR(10),CONVERT(DATETIME,entrega_vivienda),126) as entrega_vivienda ,CONVERT(NVARCHAR(10),entrega_escrituras,126) as entrega_escrituras FROM SQLCLUSTER.CasasAtlas.dbo.SYS_Clientes WHERE no_cliente =" +
    req.params.client;

  utils.executeQuery(res, query);
});

router.put("/clientes/:client", function(req, res) {
  var now = new Date();
  var curDate = now.toLocaleString("es-MX", {
    timeZone: "America/Mexico_City"
  });

  var insertNew =
    "UPDATE SQLCLUSTER.CasasAtlas.dbo.SYS_Clientes SET nombres = '" +
    req.body.nombres +
    "', paterno='" +
    req.body.paterno +
    "', materno='" +
    req.body.materno +
    "', sexo='" +
    req.body.sexo +
    "', fecha_nacimiento=CONVERT(VARCHAR(10),'" +
    req.body.fecha_nacimiento +
    "',101), estado_civil='" +
    req.body.estado_civil +
    "', plaza='" +
    req.body.plaza +
    "', desarrollo='" +
    req.body.desarrollo +
    "', cerrada='" +
    req.body.cerrada +
    "', prototipo='" +
    req.body.prototipo +
    "', sector='" +
    req.body.sector +
    "', supermanzana='" +
    req.body.supermanzana +
    "', manzana='" +
    req.body.manzana +
    "', lote='" +
    req.body.lote +
    "', interior='" +
    req.body.interior +
    "', tel1 = '" +
    req.body.tel1 +
    "', ext1='" +
    req.body.ext1 +
    "', tel2='" +
    req.body.tel2 +
    "', ext2='" +
    req.body.ext2 +
    "', email='" +
    req.body.email +
    "', entrega_vivienda=CONVERT(VARCHAR(10),'" +
    req.body.entrega_vivienda +
    "',101), entrega_escrituras=CONVERT(VARCHAR(10),'" +
    req.body.entrega_escrituras +
    "',101), no_cliente='" +
    req.body.no_cliente +
    "' WHERE no_cliente='" +
    req.body.no_cliente +
    "'";

  console.log(insertNew);

  sql.connect(constants.dbConfig, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(insertNew, function(err, recordset) {
      if (err) console.log(err);

      res.status(200).json({
        sucess: true,
        inserted: "OK",
        err: "OK"
      });
      //res.send("" + recordset[0].Id + "");
    });
  });
});

router.get("/racs/", function(req, res) {
  var query =
    "SELECT clave_reporte,CONVERT(NVARCHAR(10),fecha_alta, 103) as fecha_alta,contacto ,nombre + ' ' + paterno + ' ' + materno as titular,id_cliente,plaza,desarrollo,prototipo,cerrada,manzana,lote ,interior FROM SQLCLUSTER.CasasAtlas.dbo.SYS_RACS ORDER BY id DESC";

  utils.executeQuery(res, query);
});

router.get("/racs/:client", function(req, res) {
  var query =
    "SELECT clave_reporte,CONVERT(NVARCHAR(10),fecha_alta, 103) as fecha_alta,contacto ,nombre + ' ' + paterno + ' ' + materno as titular,id_cliente,plaza,desarrollo,prototipo,cerrada,manzana,lote ,interior FROM SQLCLUSTER.CasasAtlas.dbo.SYS_RACS WHERE id_cliente ='" +
    req.params.client +
    "'";

  utils.executeQuery(res, query);
});

router.get("/rac/:id", function(req, res) {
  var query =
    "SELECT detalles as descripcion,descripcion as status, racs,clave_reporte,CONVERT(NVARCHAR(10),fecha_alta, 103) as fecha_alta,contacto ,nombre + ' ' + paterno + ' ' + materno as titular,id_cliente,plaza,desarrollo,prototipo,cerrada,manzana,lote ,interior FROM SQLCLUSTER.CasasAtlas.dbo.SYS_RACS WHERE clave_reporte ='" +
    req.params.id +
    "'";
  console.log(query);
  utils.executeQuery(res, query);
});

router.put("/rac/:id", function(req, res) {
  var now = new Date();
  var curDate = now.toLocaleString("es-MX", {
    timeZone: "America/Mexico_City"
  });

  var insertNew =
    "UPDATE SQLCLUSTER.CasasAtlas.dbo.SYS_RACS SET detalles = '" +
    req.body.descripcion +
    " || " +
    req.body.id_user +
    "@ (" +
    curDate +
    "): " +
    req.body.seguimiento +
    " ####' WHERE clave_reporte ='" +
    req.params.id +
    "'";

  sql.connect(constants.dbConfig, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(insertNew, function(err, recordset) {
      if (err) console.log(err);

      res.status(200).json({
        sucess: true,
        inserted: "OK",
        err: "OK"
      });
      //res.send("" + recordset[0].Id + "");
    });
  });
});

router.put("/racDesarrollo/:id", function(req, res) {
  var now = new Date();
  var curDate = now.toLocaleString("es-MX", {
    timeZone: "America/Mexico_City"
  });

  console.log(req.body);
  var insertNew = "";
  if (
    req.body.estatusRAC === "Cerrado" ||
    req.body.estatusRAC === "Cerrado Inconformidad"
  ) {
    insertNew =
      "UPDATE SQLCLUSTER.CasasAtlas.dbo.SYS_RACS SET user_cierre = '" +
      req.body.id_user +
      "', fecha_cierre=GETDATE(),descripcion='" +
      req.body.estatusRAC +
      "', detalles = '" +
      req.body.descripcion +
      " || " +
      req.body.id_user +
      "@ (" +
      curDate +
      "): " +
      req.body.seguimiento +
      " ####' WHERE clave_reporte ='" +
      req.params.id +
      "'";
  } else {
    insertNew =
      "UPDATE SQLCLUSTER.CasasAtlas.dbo.SYS_RACS SET descripcion='" +
      req.body.estatusRAC +
      "', detalles = '" +
      req.body.descripcion +
      " || " +
      req.body.id_user +
      "@ (" +
      curDate +
      "): " +
      req.body.seguimiento +
      " ####' WHERE clave_reporte ='" +
      req.params.id +
      "'";
  }
  console.log(insertNew);

  sql.connect(constants.dbConfig, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(insertNew, function(err, recordset) {
      if (err) console.log(err);

      res.status(200).json({
        sucess: true,
        inserted: "OK",
        err: "OK"
      });
      //res.send("" + recordset[0].Id + "");
    });
  });
});

router.get("/tip2", function(req, res) {
  sql.connect(constants.dbConfig, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("FILTER", req.query.tip1);
    console.log(req.query.tip1);
    request.query(
      "SELECT DISTINCT tip_2 as label,tip_2 as value FROM SQLCLUSTER.CasasAtlas.dbo.SYS_Tipificaciones where tip_1 = @FILTER",
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/tip3", function(req, res) {
  sql.connect(constants.dbConfig, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("FILTER", req.query.tip1);
    request.input("FILTER2", req.query.tip2);
    console.log(req.query.tip1, req.query.tip2);
    request.query(
      "SELECT DISTINCT tip_3 as label,tip_3 as value FROM SQLCLUSTER.CasasAtlas.dbo.SYS_Tipificaciones where tip_1 = @FILTER AND tip_2 = @FILTER2",
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.post("/rac", function(req, res) {
  var RACS = JSON.parse(req.body.racs);
  var fRAC = RACS[0].tipo;
  var ticket = "";

  switch (fRAC) {
    case "Solicitud de Entrega de Vivienda":
      ticket = "SEV";
      break;
    case "Reporte de Garantia":
      ticket = "RAC";
      break;
    case "Garantia Vencida":
      ticket = "GVA";
      break;
    case "Queja":
      ticket = "QJA";
      break;
    case "Informacion":
      ticket = "INF";
      break;
    default:
      ticket = "OTR";
      break;
  }

  sql
    .connect(constants.dbCluster)
    .then(function() {
      var request = new sql.Request();
      request
        .query(
          "INSERT INTO CasasAtlas.dbo.SYS_RACS (fecha_alta ,user_alta ,contacto ,id_cliente,nombre ,paterno,materno ,plaza,desarrollo ,prototipo,cerrada,manzana,lote,interior,racs) OUTPUT INSERTED.id VALUES (GETDATE(),'" +
            req.body.user_alta +
            "', '" +
            req.body.contacto +
            "', '" +
            req.body.id_cliente +
            "', '" +
            req.body.nombres +
            "', '" +
            req.body.paterno +
            "', '" +
            req.body.materno +
            "', '" +
            req.body.plaza +
            "', '" +
            req.body.desarrollo +
            "', '" +
            req.body.prototipo +
            "', '" +
            req.body.cerrada +
            "','" +
            req.body.manzana +
            "', '" +
            req.body.lote +
            "', '" +
            req.body.interior +
            "', '" +
            req.body.racs +
            "')"
        )
        .then(result => {
          return result; // Contiene los ID
        })
        .then(async cols => {
          const request = new sql.Request();
          return request.query(
            "UPDATE CasasAtlas.dbo.SYS_RACS SET clave_reporte = '" +
              ticket +
              "-' + right(replicate('0', 8) + ltrim(" +
              cols[0].id +
              "), 8) OUTPUT inserted.clave_reporte WHERE id=" +
              cols[0].id
          );

          //var coloniasPromise = await Promise.all(colPromises);

          return "result";
        })
        .then(final => {
          res.status(200).json({
            sucess: true,
            clave_reporte: final[0].clave_reporte,
            err: "OK"
          });
          res.send(final);
        })
        .catch(function(err) {
          console.log(err);
        });
    })
    .catch(function(err) {
      console.log(err);
    });
});

router.post("/llamadas", function(req, res) {
  var fecha_nacimiento = "";
  var tip_2 = "";
  if (req.body.fecha_nacimiento === "") {
    fecha_nacimiento = "NULL";
  } else {
    fecha_nacimiento =
      "CONVERT(DATETIME,'" + req.body.fecha_nacimiento + "',103)";
  }

  if (req.body.tip_2 === "") {
    tip_2 = "NULL";
  } else {
    tip_2 = req.body.tip_2;
  }

  var query =
    //"INSERT INTO CasasAtlas.dbo.SYS_Generales (nombres,paterno,materno,sexo,fecha_nacimiento,estado_civil,tipo_vial,calle,exterior,interior,entrecalles,cp,colonia,delagacion_municipio,estado,tel1,ext1,tel2,ext2,email1,email2,tipificacion,comentarios,fecha_registro,usuario_registro) OUTPUT Inserted.id VALUES ('" +
    "INSERT INTO CasasAtlas.dbo.SYS_Generales (nombres,paterno,materno,sexo,fecha_nacimiento,estado_civil,tipo_vial,calle,exterior,interior,entrecalles,cp,colonia,delagacion_municipio,estado,tel1,ext1,tel2,ext2,email1,email2,tipificacion,tip_2,comentarios,fecha_registro,usuario_registro) OUTPUT Inserted.id VALUES ('" +
    req.body.nombres +
    "', '" +
    req.body.paterno +
    "', '" +
    req.body.materno +
    "', '" +
    req.body.sexo +
    "', " +
    fecha_nacimiento +
    ", '" +
    req.body.edo_civil +
    "', '" +
    req.body.tipo_vial +
    "', '" +
    req.body.calle +
    "', '" +
    req.body.exterior +
    "', '" +
    req.body.interior +
    "', '" +
    req.body.entrecalles +
    "','" +
    req.body.cp +
    "', '" +
    req.body.colonia +
    "', '" +
    req.body.municipio +
    "', '" +
    req.body.estado +
    "', '" +
    req.body.tel_1 +
    "','" +
    req.body.ext_1 +
    "','" +
    req.body.tel_2 +
    "','" +
    req.body.ext_2 +
    "', '" +
    req.body.email_1 +
    "','" +
    req.body.email_2 +
    "','" +
    req.body.tip_1 +
    "','" +
    //req.body.tip_2 +
    //"','" +
    req.body.comentarios +
    "', GETDATE(),'" +
    req.body.id_user +
    "')";

  console.log(query);
  sql.connect(constants.dbCluster, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();
    request.query(query, function(err, recordset) {
      if (err) console.log(err);

      res.send(recordset);
    });
  });
});

module.exports = router;
