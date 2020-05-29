var router = require("express").Router();

var sql = require("mssql");
var moment = require("moment");
var constants = require("../../../constants");
var utils = require("../../../utils.js");

var exjwt = require("express-jwt");

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t"
});

router.get("/AsistenciaValidacion", function(req, res) {
  var query =
    "SELECT * FROM [40].[CCS].[dbo].[OP_Asistencia]  WHERE Validacion=0  AND Fecha_Asistencia between getdate()-6 and getdate()-1 AND Medio IS NOT NULL";

  utils.executeQuery(res, query);
});

router.patch("/AsistenciaValidacion", function(req, res) {
  /* console.log(req.body) */

  var query = "EXEC [40].[CCS].[dbo].UpdateValidacion @id=" + req.body.id + ", @user='" + req.body.user +"'";
  utils.executeQuery(res, query);
});

router.get("/Asistencia", function(req, res) {
  /* console.log(req.body) */

  var query =
    "EXEC [40].[CCS].[dbo].[REP_Asistencia_Rick] @Fecha='" +
    req.query.fecha +
    "', @Idmitrol='" +
    req.query.id +
    "',  @Nombre= '" +
    req.query.nombres +
    "'";
  utils.executeQuery(res, query);
});

router.patch("/Asistencia", function(req, res) {
  var query =
    "EXEC [40].[CCS].[dbo].UpdateAsistencia @medio='" +
    req.body.medio +
    "', @motivo='" +
    req.body.motivo +
    "', @desconexion='" +
    req.body.desconexion +
    "', @asistencia='" +
    req.body.asistencia +
    "', @id=" +
    req.body.id;
  utils.executeQuery(res, query);
});

router.post("/Candidatos", function(req, res) {
  sql.connect(constants.dbCluster, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.input("MOTIVO_RECHAZO", null);
    request.input("CAMPANIA", null);
    request.input("TURNO", null);
    request.input("RECLUTADOR", null);
    request.input("NOMBRES", req.body.nombres.toUpperCase());
    request.input("PATERNO", req.body.paterno.toUpperCase());
    request.input("MATERNO", req.body.materno.toUpperCase());
    request.input("SEXO", req.body.sexo.toUpperCase());
    request.input("FECHA_NACIMIENTO", req.body.fecha_nacimiento);
    request.input("EDO_NACIMIENTO", req.body.estadoNacimiento.toUpperCase());
    request.input("EDO_CIVIL", req.body.edo_civil.toUpperCase());
    request.input("CURP", req.body.CURP.toUpperCase());
    request.input("RFC", req.body.RFC.toUpperCase());
    request.input("NSS", req.body.NSS.toUpperCase());
    request.input("DEP_ECONOMICOS", req.body.dependientes);
    request.input("ESCOLARIDAD", req.body.escolaridad.toUpperCase());
    request.input("TIPO_VIAL", req.body.tipo_vial.toUpperCase());
    request.input("CALLE", req.body.calle.toUpperCase());
    request.input("EXT", req.body.exterior.toUpperCase());
    request.input("INT", req.body.interior.toUpperCase());
    request.input("ENTRECALLES", req.body.entrecalles.toUpperCase());
    request.input("CP", req.body.cp);
    request.input("COLONIA", req.body.colonia.toUpperCase());
    request.input("DEL_MUN", req.body.municipio.toUpperCase());
    request.input("ESTADO", req.body.estado.toUpperCase());
    request.input("TEL_CEL", req.body.tel_1);
    request.input("TEL_CASA", req.body.tel_2);
    request.input("EMAIL", req.body.email.toLowerCase());
    request.input("HOBBIES", req.body.hobbies.toUpperCase());

    request.query(
      "INSERT INTO CCS.dbo.SYS_Candidatos OUTPUT INSERTED.folio VALUES (0,@MOTIVO_RECHAZO,NULL,@CAMPANIA,@TURNO,GETDATE(),NULL,@RECLUTADOR,NULL,NULL,@NOMBRES,@PATERNO,@MATERNO,@SEXO,@FECHA_NACIMIENTO,@EDO_NACIMIENTO,@EDO_CIVIL,@CURP,@RFC,@NSS,@DEP_ECONOMICOS,@ESCOLARIDAD,@TIPO_VIAL,@CALLE,@EXT,@INT,@ENTRECALLES,@CP,@COLONIA,@DEL_MUN,@ESTADO,@TEL_CEL,@TEL_CASA,@EMAIL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,@HOBBIES, NULL, NULL,NULL,NULL)",
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.post("/EmpleadosIntegracion", function(req, res) {
  sql.connect(constants.db40, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();


    request.input("RECLUTADOR", req.body.reclutador);
    request.input("NOMBRES", req.body.nombres.toUpperCase());
    request.input("PATERNO", req.body.paterno.toUpperCase());
    request.input("MATERNO", req.body.materno.toUpperCase());
    request.input("SEXO", req.body.sexo.toUpperCase());
    request.input("FECHA_NACIMIENTO", req.body.fecha_nacimiento);
    request.input("EDO_CIVIL", req.body.edo_civil.toUpperCase());
    request.input("CURP", req.body.CURP.toUpperCase());
    request.input("RFC", req.body.RFC.toUpperCase());
    request.input("NSS", req.body.NSS.toUpperCase());
    request.input("DEP_ECONOMICOS", req.body.dependientes);
    request.input("ESCOLARIDAD", req.body.escolaridad.toUpperCase());
    request.input("CALLE", req.body.calle.toUpperCase());
    request.input("EXT", req.body.exterior);
    request.input("INT", req.body.interior);
    request.input("CP", req.body.cp);
    request.input("COLONIA", req.body.colonia.toUpperCase());
    request.input("DEL_MUN", req.body.municipio.toUpperCase());
    request.input("ESTADO", req.body.estado.toUpperCase());
    request.input("TEL_CEL", req.body.tel_1);
    request.input("TEL_CASA", req.body.tel_2);


    request.query(
      `INSERT INTO CCS.dbo.SYS_Empleados (
            status,
            id_ccs,
            reclutador,
            pass_ccs,
            fecha_tronco,
            area,puesto,
            campaña,
            nombres,
            paterno,
            materno,
            fecha_nacimiento,
            sexo,
            estado_civil,
            curp,
            rfc,
            nss,
            dependientes_economicos,
            escolaridad,
            calle,
            delegacion_municipio,
            estado,
            cp,
            celular,
            telefono
        ) OUTPUT INSERTED.id VALUES (
            0, 
            LOWER(LEFT(REPLACE(@NOMBRES,' ',''),1) + LEFT(REPLACE(@PATERNO,' ',''),4)+LEFT(REPLACE(@MATERNO,' ',''),3)),
            @RECLUTADOR,
            LOWER(CONVERT(VARCHAR(32), HashBytes('MD5', LOWER(LEFT(REPLACE(@NOMBRES,' ',''),1) + LEFT(REPLACE(@PATERNO,' ',''),4)+LEFT(REPLACE(@MATERNO,' ',''),3))), 2)),
            GETDATE(),
            0,0,
            NULL,
            @NOMBRES,
            @PATERNO,
            @MATERNO,
            @FECHA_NACIMIENTO,
            @SEXO,
            @EDO_CIVIL,
            @CURP,
            @RFC,
            @NSS,
            @DEP_ECONOMICOS,
            @ESCOLARIDAD,
            @CALLE + ' ' + @EXT + ' ' + @INT,
            @DEL_MUN,
            @ESTADO,
            @CP,
            @TEL_CEL,
            @TEL_CASA
            )`,
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/CandidatoValidacion", function(req, res) {
  sql.connect(constants.dbCluster, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    var nom = req.query.nombres.substr(0, 1);
    var pat = req.query.paterno.substr(0, 4);
    var mat = req.query.materno.substr(0, 3);
    var fecha = req.query.fecha;

    var id = nom + pat + mat + fecha;

    request.input("ID", id);

    request.query(
      "SELECT * FROM CCS.dbo.SYS_Candidatos WHERE (SUBSTRING(nombres,1,1) + SUBSTRING(paterno,1,4) + SUBSTRING(materno,1,3) + CONVERT(VARCHAR(10),fecha_nacimiento,103)) = @ID",
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/Candidatos", function(req, res) {
  sql.connect(constants.dbCluster, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(
      "SELECT id, CONVERT(NVARCHAR(10),fecha_reclutamiento,103) as Fecha_Reclutamiento, nombres + ' '+ paterno + ' ' + materno as Candidato, CONVERT(NVARCHAR(10),fecha_nacimiento,103) as Fecha_Nacimiento, DATEDIFF([YEAR],fecha_nacimiento,GETDATE()) as Edad, edo_civil, tel_cel , tel_casa , email FROM CCS.dbo.SYS_Candidatos WHERE status = 0",
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/CandidatosConfirmar", function(req, res) {
  sql.connect(constants.dbCluster, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(
      "SELECT id, CONVERT(NVARCHAR(10),fecha_reclutamiento,103) as Fecha_Reclutamiento, nombres + ' '+ paterno + ' ' + materno as Candidato, CONVERT(NVARCHAR(10),fecha_nacimiento,103) as Fecha_Nacimiento, DATEDIFF([YEAR],fecha_nacimiento,GETDATE()) as Edad, edo_civil, tel_cel , tel_casa , email FROM CCS.dbo.SYS_Candidatos WHERE status = 4",
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/CandidatosAuditoria", function(req, res) {
  sql.connect(constants.dbCluster, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(
      "SELECT id, CONVERT(NVARCHAR(10),fecha_reclutamiento,103) as Fecha_Reclutamiento, nombres + ' '+ paterno + ' ' + materno as Candidato, CONVERT(NVARCHAR(10),fecha_nacimiento,103) as Fecha_Nacimiento, DATEDIFF([YEAR],fecha_nacimiento,GETDATE()) as Edad, edo_civil, tel_cel , tel_casa , email FROM CCS.dbo.SYS_Candidatos WHERE status = 5",
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/Cartera", function(req, res) {
  sql.connect(constants.dbCluster, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(
      "SELECT id, CONVERT(NVARCHAR(10),fecha_reclutamiento,103) as Fecha_Reclutamiento, nombres + ' '+ paterno + ' ' + materno as Candidato, CONVERT(NVARCHAR(10),fecha_nacimiento,103) as Fecha_Nacimiento, DATEDIFF([YEAR],fecha_nacimiento,GETDATE()) as Edad, edo_civil, tel_cel , tel_casa , email FROM CCS.dbo.SYS_Candidatos WHERE status in (1,2)",
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/CandidatosRolePlay", function(req, res) {
  sql.connect(constants.dbCluster, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(
      "SELECT id, nombres,paterno,materno, DATEDIFF([YEAR],fecha_nacimiento,GETDATE()) as Edad, edo_civil, campania, turno FROM CCS.dbo.SYS_Candidatos WHERE status = 3",
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/Candidato/:id", function(req, res) {
  sql.connect(constants.dbCluster, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("ID", req.params.id);
    request.query(
      "SELECT * FROM CCS.dbo.SYS_Candidatos WHERE id= @ID",
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.patch("/Candidato/:id", (req, res) => {
  sql.connect(constants.dbCluster, err => {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("ID", req.params.id);

    request.input("STATUS", req.body.status_entrevista);
    request.input(
      "MOTIVO_RECHAZO",
      req.body.motivo_rechazo === "" ? "NULL" : req.body.motivo_rechazo
    );
    request.input(
      "DETALLE_RECHAZO",
      req.body.motivo2 === "" ? "NULL" : req.body.motivo2
    );
    request.input(
      "CAMPANIA",
      req.body.campania === "" ? "NULL" : req.body.campania
    );
    request.input(
      "TURNO",
      req.body.turno === "" ? "NULL" : req.body.turno.toUpperCase()
    );
    request.input("RECLUTADOR", req.body.id_user.toLowerCase());
    request.input("NOMBRES", req.body.nombres.toUpperCase());
    request.input("PATERNO", req.body.paterno.toUpperCase());
    request.input("MATERNO", req.body.materno.toUpperCase());
    request.input("SEXO", req.body.sexo.toUpperCase());
    request.input("FECHA_NACIMIENTO", req.body.fecha_nacimiento);
    request.input("EDO_NACIMIENTO", req.body.estadoNacimiento.toUpperCase());
    request.input("EDO_CIVIL", req.body.edo_civil.toUpperCase());
    request.input("CURP", req.body.CURP.toUpperCase());
    request.input("RFC", req.body.RFC.toUpperCase());
    request.input("NSS", req.body.NSS.toUpperCase());
    request.input("DEP_ECONOMICOS", req.body.dependientes);
    request.input("ESCOLARIDAD", req.body.escolaridad.toUpperCase());
    request.input("TIPO_VIAL", req.body.tipo_vial.toUpperCase());
    request.input("CALLE", req.body.calle.toUpperCase());
    request.input("EXT", req.body.exterior.toUpperCase());
    request.input("INT", req.body.interior.toUpperCase());
    request.input("ENTRECALLES", req.body.entrecalles.toUpperCase());
    request.input("CP", req.body.cp);
    request.input("COLONIA", req.body.colonia.toUpperCase());
    request.input("DEL_MUN", req.body.municipio.toUpperCase());
    request.input("ESTADO", req.body.estado.toUpperCase());
    request.input("TEL_CEL", req.body.tel_1);
    request.input("TEL_CASA", req.body.tel_2);
    request.input("EMAIL", req.body.email.toLowerCase());

    request.input("TIPEO", req.body.tipeo);
    request.input("ORTOGRAFIA", req.body.ortografia);
    request.input("CONTADOR", 1);

    var query = "";

    if (
      req.body.status_entrevista == 1 ||
      req.body.status_entrevista == 2 ||
      req.body.status_entrevista == 3
    ) {
      query = `UPDATE CCS.dbo.SYS_Candidatos SET 
    status = @STATUS
   ,motivo_rechazo = @MOTIVO_RECHAZO
   ,campania = @CAMPANIA
   ,turno = @TURNO
   ,fecha_entrevista = GETDATE()
   ,reclutador = @RECLUTADOR
   ,nombres = @NOMBRES
   ,paterno = @PATERNO
   ,materno = @MATERNO
   ,sexo = @SEXO
   ,fecha_nacimiento = @FECHA_NACIMIENTO
   ,edo_nacimiento = @EDO_NACIMIENTO
   ,edo_civil = @EDO_CIVIL
   ,CURP = @CURP
   ,RFC = @RFC
   ,NSS = @NSS
   ,dep_economicos = @DEP_ECONOMICOS
   ,escolaridad = @ESCOLARIDAD
   ,tipo_vial = @TIPO_VIAL
   ,calle = @CALLE
   ,ext = @EXT
   ,int = @INT
   ,entrecalles = @ENTRECALLES
   ,cp = @CP
   ,colonia = @COLONIA
   ,del_mun = @DEL_MUN
   ,estado = @ESTADO
   ,tel_cel = @TEL_CEL
   ,tel_casa = @TEL_CASA
   ,email = @EMAIL
   ,detalle_rechazo = @DETALLE_RECHAZO
   ,tipeo = @TIPEO
   ,ortografia = @ORTOGRAFIA
   ,contador = @CONTADOR
   OUTPUT INSERTED.ID WHERE id= @ID`;
    } else if (req.body.status_entrevista == 5) {
      query = `UPDATE CCS.dbo.SYS_Candidatos SET 
      fecha_entrega = GETDATE(),
      status=@STATUS,
      usuario_entrega=@RECLUTADOR
     OUTPUT INSERTED.ID WHERE id= @ID`;
    } else if (req.body.status_entrevista == 6) {
      query = `UPDATE CCS.dbo.SYS_Candidatos SET 
      fecha_auditoria = GETDATE(),
      status=@STATUS,
      usuario_auditoria=@RECLUTADOR
     OUTPUT INSERTED.ID WHERE id= @ID`;
    }

    request.query(query, function(err, recordset) {
      if (err) console.log(err);

      res.send(recordset);
    });
  });
});

router.patch("/CandidatoRolePlay/:id", function(req, res) {
  sql.connect(constants.dbCluster, function(err) {
    if (err) console.log(err);

    var request = new sql.Request();

    request.input("ID", req.params.id);

    request.input("P1", req.body.p1);
    request.input("P2", req.body.p2);
    request.input("P3", req.body.p3);
    request.input("P4", req.body.p4);
    request.input("P5", req.body.p5);
    request.input("P6", req.body.p6);
    request.input("P7", req.body.p7);
    request.input("P8", req.body.p8);
    request.input("P9", req.body.p9);
    request.input("P10", req.body.p10);
    request.input("P11", req.body.p11);

    request.input("ROLEPLAY", req.body.id_user);

    if (req.body.aprueba == 0) {
      request.input("COMENTARIOS", req.body.comentarios);
      request.input("PERFIL", req.body.perfil);
      request.input("STATUS", 0);
    } else {
      request.input("COMENTARIOS", "NULL");
      request.input("PERFIL", "NULL");
      request.input("STATUS", 4);
    }

    request.query(
      `UPDATE CCS.dbo.SYS_Candidatos SET 
       p1 = @P1,
       p2 = @P2,
       p3 = @P3,
       p4 = @P4,
       p5 = @P5,
       p6 = @P6,
       p7 = @P7,
       p8 = @P8,
       p9 = @P9,
       p10 = @P10,
       p11 = @P11,
       roleplay = @ROLEPLAY,
       fecha_roleplay = GETDATE(),
       status=@STATUS,
       comentarios_roleplay=@COMENTARIOS,
       perfil_roleplay=@PERFIL
      OUTPUT INSERTED.ID WHERE id= @ID`,
      function(err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});
module.exports = router;
