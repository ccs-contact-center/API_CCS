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
  
    request.input("nombre", req.body.nombre);
    request.input("paterno", req.body.paterno);
    request.input("materno", req.body.materno);
    request.query(
      `INSERT INTO [PruebaCurso].[dbo].[encuesta] (
        pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, pregunta6,  nombres, paterno, materno
        ) 
       OUTPUT INSERTED.id VALUES (
          @pregunta1, @pregunta2,  @pregunta3,  @pregunta4,  @pregunta5,  @pregunta6,   @nombre, @paterno, @materno
            )`,
      (err, recordset) => {
        if (err) console.log(err);
        res.send(recordset);
      }
    );
  });
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
  
     request.input("nombre", req.body.nombre);
     request.input("paterno", req.body.paterno);
     request.input("materno", req.body.materno);
     request.query(
       `INSERT INTO [PruebaCurso].[dbo].[encuesta] (
         pregunta1, pregunta2, pregunta3, pregunta4, pregunta5, pregunta6,  nombres, paterno, materno
         ) 
        OUTPUT INSERTED.id VALUES (
           @pregunta1, @pregunta2,  @pregunta3,  @pregunta4,  @pregunta5,  @pregunta6,   @nombre, @paterno, @materno
             )`,
       (err, recordset) => {
         if (err) console.log(err);
         res.send(recordset);
       }
     );
   });
 });

router.post("/formEtiquetaActividad2", (req, res) => {
  sql.connect(constants.db40, (err) => {
    if (err) console.log(err);
    var request = new sql.Request();

    request.input("acierto1", req.body.acierto1);
    request.input("acierto2", req.body.acierto2);
    request.input("acierto3", req.body.acierto3);
    request.input("acierto4", req.body.acierto4);
    request.input("acierto5", req.body.acierto5);
    request.input("acierto6", req.body.acierto6);
    request.input("acierto7", req.body.acierto7);
    request.input("acierto8", req.body.acierto8);
    request.input("acierto9", req.body.acierto9);
    request.input("acierto10", req.body.acierto10);
    request.input("nombres", req.body.nombres);
    request.input("paterno", req.body.paterno);
    request.input("materno", req.body.materno);
    request.query(
      `INSERT INTO [PruebaCurso].[dbo].[aciertos] (
        acierto1, acierto2, acierto3, acierto4, acierto5, 
        acierto6, acierto7, acierto8, acierto9, acierto10, 
        nombres, paterno, materno
        ) 
        
       OUTPUT INSERTED.id VALUES (
          @acierto1, @acierto2,  @acierto3,  @acierto4,  @acierto5, 
          @acierto6, @acierto7,  @acierto8,  @acierto9,  @acierto10,   
          @nombres, @paterno, @materno
            )`,
      (err, recordset) => {
        if (err) console.log(err);
        res.send(recordset);
        
      }
    );
  });
});


// router.post("/actividad1C", (req, res) => {
//   sql.connect(constants.db40, (err) => {
//     if (err) console.log(err);
//     var request = new sql.Request();
//     request.input("Cosina", req.body.Cosina);
//     request.input("Cacerola", req.body.Cacerola);
//     request.input("Abesedario", req.body.Abesedario);
//     request.input("Bronseado", req.body.Bronseado);
//     request.input("Funcionario", req.body.Funcionario);
//     request.input("Diferencias", req.body.Diferencias);
//     request.input("Canselar", req.body.Canselar);
//     request.input("Desición", req.body.Desición);
//     request.input("Conferencia", req.body.Conferencia);
//     request.input("nombres", req.body.nombres);
//     request.input("paterno", req.body.paterno);
//     request.input("materno", req.body.materno);
//     request.query(
//       `INSERT INTO [PruebaCurso].[dbo].[usoC] (
//         Cosina, Cacerola, Abesedario, Bronseado, Funcionario, 
//         Diferencias, Canselar, Desición, Conferencia, 
//         nombres, paterno, materno
//         ) 
//        OUTPUT INSERTED.id VALUES (
//           @Cosina, @Cacerola,  @Abesedario,  @Bronseado,  @Funcionario, 
//           @Diferencias, @Canselar,  @Desición,  @Conferencia,   
//           @nombres, @paterno, @materno
//             )`,
//       (err, recordset) => {
//         if (err) console.log(err);
//         res.send(recordset);
//       }
//     );
//   });
// });

router.post("/actividad1C", (req, res) => {
  sql.connect(constants.db40, (err) => {
    if (err) console.log(err);
    var request = new sql.Request();
    request.input("curso", req.body.curso);
    request.input("fecha", req.body.fecha);
    request.input("id_ccs", req.body.id_ccs);
    request.input("formaulario", req.body.formaulario);

    request.query(
      `INSERT INTO [cursos].[dbo].[curso] (
       
        curso, fecha, id_ccs,
        formaulario
        ) 
       OUTPUT INSERTED.id VALUES (
         
          @curso, @fecha, @id_ccs,
          @formaulario[]
            )`,
      (err, recordset) => {
        if (err) console.log(err);
        res.send(recordset);
      }
    );
  });
});



router.post("/actividad2C", (req, res) => {
  sql.connect(constants.db40, (err) => {
    if (err) console.log(err);
    var request = new sql.Request();
    request.input("cir1", req.body.cir1);
    request.input("cir2", req.body.cir2);
    request.input("cir3", req.body.cir3);
  
    request.input("ducir1", req.body.ducir1);
    request.input("ducir2", req.body.ducir2);
    request.input("ducir3", req.body.ducir3);
  
    request.input("ancia1", req.body.ancia1);
    request.input("ancia2", req.body.ancia2);
    request.input("ancia3", req.body.ancia3);
  
    request.input("ancio1", req.body.ancio1);
    request.input("ancio2", req.body.ancio2);
    request.input("ancio3", req.body.ancio3);
  
    request.input("nombres", req.body.nombres);
    request.input("paterno", req.body.paterno);
    request.input("materno", req.body.materno);
    request.query(
      `INSERT INTO [PruebaCurso].[dbo].[usoC3] (
        cir1, cir2, cir3,
        ducir1, ducir2, ducir3,
        ancia1, ancia2, ancia3,
        ancio1, ancio2, ancio3,
        nombres, paterno, materno
        ) 
       OUTPUT INSERTED.id VALUES (
          @cir1, @cir2,  @cir3, 
          @ducir1, @ducir2,  @ducir3, 
          @ancia1, @ancia2,  @ancia3, 
          @ancio1, @ancio2,  @ancio3,   
          @nombres, @paterno, @materno
            )`,
      (err, recordset) => {
        if (err) console.log(err);
        res.send(recordset);
      }
    );
  });
});





module.exports = router;
