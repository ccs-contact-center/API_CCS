var router = require("express").Router();
var sql = require("mssql");
var constants = require("../../../constants");
var exjwt = require("express-jwt");

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t",
});

userExist = async (user) => {
  try {
    let pool = await sql.connect(constants.dbCluster);
    let result = await pool
      .request()
      .input("ID_CCS", user)
      .query(
        "SELECT COUNT(*) as Exist FROM CCS.dbo.SYS_Usuarios2 WHERE id_ccs = @ID_CCS"
      );
    if (result[0].Exist == 0) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};

nameExist = async (nombre, paterno, materno, fnac) => {
  try {
    let pool = await sql.connect(constants.dbCluster);
    let result = await pool
      .request()
      .input(
        "ID_CCS",
        nombre.trim() + " " + paterno.trim() + " " + materno.trim() + " " + fnac
      )
      .query(
        "SELECT COUNT(*) as Exist FROM CCS.dbo.SYS_Usuarios2 WHERE nombres + ' ' + paterno + ' ' + materno + ' '+ CONVERT(NVARCHAR(10),fecha_nacimiento,101) = @ID_CCS"
      );
    if (result[0].Exist == 0) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};

sumString = (str) => {
  return str
    .toLowerCase()
    .split("")
    .reduce((acc, curr) => acc + curr.charCodeAt(0) - 96, 0);
};

router.post("/Candidatos", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
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
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.post("/Usuario", async (req, res) => {
  var idusuario = await userExist(
    req.body.id_ccs + sumString(req.body.materno)
  );
  var nombreusuario = await nameExist(
    req.body.nombres,
    req.body.paterno,
    req.body.materno,
    req.body.fecha_nacimiento
  );

  if (nombreusuario === true && idusuario === true) {
    res.send([
      {
        id: 0,
        id_ccs:
          "El agente ya se encontraba dado de alta, por favor reportalo a Reclutamiento (El agente no se liberó a capacitación)",
      },
    ]);
  } else {
    sql.connect(constants.dbCluster, (err) => {
      if (err) console.log(err);

      var request = new sql.Request();

      request.input("SU", req.body.su);
      request.input("EMPLEADO_SIM", req.body.empleado_sim);
      request.input("ID_CCS", req.body.id_ccs + sumString(req.body.materno));
      request.input("PASS_CCS", req.body.pass_ccs);
      request.input("ID_CANDIDATO", req.body.id_candidato);
      request.input("STATUS", req.body.status);
      request.input("STATUS_ANTERIOR", req.body.status_anterior);
      request.input("ULTIMO_MOVIMIENTO", req.body.ultimo_movimiento);
      request.input("USER_ULTIMO_MOVIMIENTO", req.body.user_ultimo_movimiento);
      request.input("ULTIMO_INGRESO", req.body.ultimo_ingreso);
      request.input("ROLE", req.body.role);
      request.input("ADIC_VIEWS", req.body.adic_views);
      request.input("MODO", req.body.modo);
      request.input("CENTRO", req.body.centro);
      request.input("CAMPANIA", req.body.campania);
      request.input("AREA", req.body.area);
      request.input("PUESTO", req.body.puesto);
      request.input("JEFE_DIRECTO", req.body.jefe_directo);
      request.input("ANALISTA", req.body.analista);
      request.input("INSTRUCTOR", req.body.instructor);
      request.input("FECHA_CAPACITACION", req.body.fecha_capacitacion);
      request.input("FECHA_PREINGRESO", req.body.fecha_preingreso);
      request.input("FECHA_ALTA", req.body.fecha_alta);
      request.input("FECHA_SERVICIO", req.body.fecha_servicio);
      request.input("ENTRADA", req.body.entrada);
      request.input("SALIDA", req.body.salida);
      request.input("NOMBRES", req.body.nombres);
      request.input("PATERNO", req.body.paterno);
      request.input("MATERNO", req.body.materno);
      request.input("EMAIL", req.body.email);
      request.input("EMAIL_CCS", req.body.email_ccs);
      request.input("SEXO", req.body.sexo);
      request.input("FECHA_NACIMIENTO", req.body.fecha_nacimiento);
      request.input("EDO_NACIMIENTO", req.body.edo_nacimiento);
      request.input("EDO_CIVIL", req.body.edo_civil);
      request.input("CURP", req.body.CURP);
      request.input("RFC", req.body.RFC);
      request.input("NSS", req.body.NSS);
      request.input("DEP_ECONOMICOS", req.body.dep_economicos);
      request.input("ESCOLARIDAD", req.body.escolaridad);
      request.input("TIPO_VIAL", req.body.tipo_vial);
      request.input("CALLE", req.body.calle);
      request.input("EXT", req.body.ext);
      request.input("INT", req.body.int);
      request.input("ENTRECALLES", req.body.entrecalles);
      request.input("CP", req.body.cp);
      request.input("COLONIA", req.body.colonia);
      request.input("DEL_MUN", req.body.del_mun);
      request.input("ESTADO", req.body.estado);
      request.input("TEL_1", req.body.tel_1);
      request.input("TEL_2", req.body.tel_2);
      request.input("FECHA_BAJA", req.body.fecha_baja);
      request.input("MOTIVO_BAJA", req.body.motivo_baja);
      request.input("COMENTARIOS_BAJA", req.body.comentarios_baja);
      request.input("BLACKLISTED", req.body.blacklisted);

      request.query(
        `INSERT INTO CCS.dbo.SYS_Usuarios2 (
           su
          ,empleado_sim
          ,id_ccs
          ,pass_ccs
          ,id_candidato
          ,status
          ,status_anterior
          ,ultimo_movimiento
          ,user_ultimo_movimiento
          ,ultimo_ingreso
          ,role
          ,adic_views
          ,modo
          ,centro
          ,campania
          ,area
          ,puesto
          ,jefe_directo
          ,analista
          ,instructor
          ,fecha_capacitacion
          ,fecha_preingreso
          ,fecha_alta
          ,fecha_servicio
          ,entrada
          ,salida
          ,nombres
          ,paterno
          ,materno
          ,email
          ,email_ccs
          ,sexo
          ,fecha_nacimiento
          ,edo_nacimiento
          ,edo_civil
          ,CURP
          ,RFC
          ,NSS
          ,dep_economicos
          ,escolaridad
          ,tipo_vial
          ,calle
          ,ext
          ,int
          ,entrecalles
          ,cp
          ,colonia
          ,del_mun
          ,estado
          ,tel_cel
          ,tel_casa
          ,fecha_baja
          ,motivo_baja
          ,comentrios_baja
          ,blacklisted
          ) OUTPUT INSERTED.id, INSERTED.id_ccs VALUES (
             @SU
            ,@EMPLEADO_SIM
            ,@ID_CCS
            ,@PASS_CCS
            ,@ID_CANDIDATO
            ,@STATUS
            ,@STATUS_ANTERIOR
            ,@ULTIMO_MOVIMIENTO
            ,@USER_ULTIMO_MOVIMIENTO
            ,@ULTIMO_INGRESO
            ,@ROLE
            ,@ADIC_VIEWS
            ,@MODO
            ,@CENTRO
            ,@CAMPANIA
            ,@AREA
            ,@PUESTO
            ,@JEFE_DIRECTO
            ,@ANALISTA
            ,@INSTRUCTOR
            ,@FECHA_CAPACITACION
            ,@FECHA_PREINGRESO
            ,@FECHA_ALTA
            ,@FECHA_SERVICIO
            ,@ENTRADA
            ,@SALIDA
            ,@NOMBRES
            ,@PATERNO
            ,@MATERNO
            ,@EMAIL
            ,@EMAIL_CCS
            ,@SEXO
            ,@FECHA_NACIMIENTO
            ,@EDO_NACIMIENTO
            ,@EDO_CIVIL
            ,@CURP
            ,@RFC
            ,@NSS
            ,@DEP_ECONOMICOS
            ,@ESCOLARIDAD
            ,@TIPO_VIAL
            ,@CALLE
            ,@EXT
            ,@INT
            ,@ENTRECALLES
            ,@CP
            ,@COLONIA
            ,@DEL_MUN
            ,@ESTADO
            ,@TEL_1
            ,@TEL_2
            ,@FECHA_BAJA
            ,@MOTIVO_BAJA
            ,@COMENTARIOS_BAJA
            ,@BLACKLISTED)`,
        (err, recordset) => {
          if (err) console.log(err);

          res.send(recordset);
        }
      );
    });
  }
});

router.get("/CandidatoValidacion", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
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
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/Candidatos", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(
      "SELECT id, CONVERT(NVARCHAR(10),fecha_reclutamiento,103) as Fecha_Reclutamiento, nombres + ' '+ paterno + ' ' + materno as Candidato, CONVERT(NVARCHAR(10),fecha_nacimiento,103) as Fecha_Nacimiento, DATEDIFF([YEAR],fecha_nacimiento,GETDATE()) as Edad, edo_civil, tel_cel , tel_casa , email FROM CCS.dbo.SYS_Candidatos WHERE status = 0",
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/CandidatosConfirmar", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(
      "SELECT id, CONVERT(NVARCHAR(10),fecha_reclutamiento,103) as Fecha_Reclutamiento, nombres + ' '+ paterno + ' ' + materno as Candidato, CONVERT(NVARCHAR(10),fecha_nacimiento,103) as Fecha_Nacimiento, DATEDIFF([YEAR],fecha_nacimiento,GETDATE()) as Edad, edo_civil, tel_cel , tel_casa , email FROM CCS.dbo.SYS_Candidatos WHERE status = 4",
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/CandidatosAuditoria", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(
      "SELECT id, CONVERT(NVARCHAR(10),fecha_reclutamiento,103) as Fecha_Reclutamiento, nombres + ' '+ paterno + ' ' + materno as Candidato, CONVERT(NVARCHAR(10),fecha_nacimiento,103) as Fecha_Nacimiento, DATEDIFF([YEAR],fecha_nacimiento,GETDATE()) as Edad, edo_civil, tel_cel , tel_casa , email FROM CCS.dbo.SYS_Candidatos WHERE status = 5",
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/Cartera", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(
      "SELECT id, CONVERT(NVARCHAR(10),fecha_reclutamiento,103) as Fecha_Reclutamiento, nombres + ' '+ paterno + ' ' + materno as Candidato, CONVERT(NVARCHAR(10),fecha_nacimiento,103) as Fecha_Nacimiento, DATEDIFF([YEAR],fecha_nacimiento,GETDATE()) as Edad, edo_civil, tel_cel , tel_casa , email FROM CCS.dbo.SYS_Candidatos WHERE status in (1,2)",
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/CandidatosRolePlay", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();

    request.query(
      "SELECT id, nombres,paterno,materno, DATEDIFF([YEAR],fecha_nacimiento,GETDATE()) as Edad, edo_civil, campania, turno FROM CCS.dbo.SYS_Candidatos WHERE status = 3",
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/Candidato/:id", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("ID", req.params.id);
    request.query(
      "SELECT * FROM CCS.dbo.SYS_Candidatos WHERE id= @ID",
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.patch("/Candidato/:id", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
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

    request.query(query, (err, recordset) => {
      if (err) console.log(err);

      res.send(recordset);
    });
  });
});

router.patch("/CandidatoRolePlay/:id", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
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
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

module.exports = router;
