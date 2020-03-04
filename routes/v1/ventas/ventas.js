var router = require("express").Router();
var utils = require("../../../utils.js");
var os = require('os')
var sql = require("mssql");
var moment = require("moment");
var constants = require("../../../constants");
var exjwt = require("express-jwt");
var apicache = require("apicache");
var cache = apicache.middleware;

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t"
});

const dbCluster = {
  user: "sa",
  password: "Grhzu92E_db",
  server: "10.0.0.152",
  database: "CodigosPostales",
  connectionTimeout: 800000,
  requestTimeout: 800000
};

router.get('/', cache('5 minutes'), function (req, res) {


  res.send('Respuesta desde ' + os.hostname())

})


router.post("/CondeNast", function (req, res) {
  sql.connect(constants.db40, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();
    var fecha_pedido = "";

    if (req.body.fecha_pedido === "") {
      fecha_pedido = "NULL";
    } else {
      fecha_pedido = "CONVERT(DATETIME,'" + req.body.fecha_pedido + "',103)";
      console.log(fecha_pedido)
    }


    request.input("G_fecha_pedido", req.body.fecha_pedido);
    request.input("G_id_venta", req.body.id_venta);
    request.input("G_nombre_cliente", req.body.nombre_cliente.toUpperCase());
    request.input("G_monto_venta", req.body.monto_venta.toUpperCase());
    request.input("G_medio_venta", req.body.medio_venta.toUpperCase());
    request.input("G_forma_pago", req.body.forma_pago.toUpperCase());
    request.input("G_nombre_agente", req.body.nombre_agente.toUpperCase());
    request.input("ID_Mitrol", req.body.id_mitrol.toUpperCase());
    request.input("Tipo_llamada", req.body.tipo_llamada.toUpperCase());
    request.input("Revista", req.body.revista.toUpperCase());
    request.input("Primer_intento_pago", req.body.intento_pago.toUpperCase());
    request.input("Terminacion_tarjeta", req.body.terminacion_tarjeta);
    request.input("Banco_emisor_tarjeta", req.body.banco_tarjeta.toUpperCase());
    request.input("Vinculo_comprobante", req.body.comprobante_pago.toUpperCase());
    request.input("Obsequio", req.body.obsequio.toUpperCase());

    request.query(
      "INSERT INTO [Ventas_Bitacora].[dbo].[Bitacora_Ventas] ([G_Fecha de pedido],G_id_Venta,[G_Nombre de cliente],[G_Monto de venta],[G_Medio de venta],[G_Forma de pago],G_Nombre_agente,CN_id_mitrol,[CN_Tipo de llamada],CN_Revista,[CN_primer intento_pago],[CN_terminacion de tarjeta],[CN_banco emisor de tarjeta],[CN_vinculo comprobante_pago],CN_Obsequio) OUTPUT INSERTED.id VALUES (@G_fecha_pedido,@G_id_venta,@G_nombre_cliente,@G_monto_venta,@G_medio_venta,@G_forma_pago,@G_nombre_agente,@ID_Mitrol,@Tipo_llamada,@Revista,@Primer_intento_pago,@Terminacion_tarjeta,@Banco_emisor_tarjeta,@Vinculo_comprobante,@Obsequio)",

      function (err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.post("/MensFashion", function (req, res) {
  sql.connect(constants.db40, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();
    var fecha_pedido = "";

    if (req.body.fecha_pedido === "") {
      fecha_pedido = "NULL";
    } else {
      fecha_pedido = "CONVERT(DATETIME,'" + req.body.fecha_pedido + "',103)";
      console.log(fecha_pedido)
    }

    var fecha_aprobacion = "";

    if (req.body.fecha_aprobacion === "") {
      fecha_aprobacion = "NULL";
    } else {
      fecha_aprobacion = "CONVERT(DATETIME,'" + req.body.fecha_aprobacion + "',103)";
      console.log(fecha_aprobacion)
    }

    request.input("G_fecha_pedido", req.body.fecha_pedido);
    request.input("G_id_venta", req.body.id_venta);
    request.input("G_nombre_cliente", req.body.nombre_cliente.toUpperCase());
    request.input("G_monto_venta", req.body.monto_venta.toUpperCase());
    request.input("G_medio_venta", req.body.medio_venta.toUpperCase());
    request.input("G_forma_pago", req.body.forma_pago.toUpperCase());
    request.input("G_nombre_agente", req.body.nombre_agente.toUpperCase());
    request.input("Fecha_aprobacion", req.body.fecha_aprobacion);
    request.input("MF_status", req.body.status.toUpperCase());
    request.input("Procedencia", req.body.procedencia.toUpperCase());
    request.input("Status_magento", req.body.status_magento.toUpperCase());
    request.input("Status_real", req.body.status_real.toUpperCase());


    request.query(
      "INSERT INTO [Ventas_Bitacora].[dbo].[Bitacora_Ventas] ([G_Fecha de pedido],G_id_Venta,[G_Nombre de cliente],[G_Monto de venta],[G_Medio de venta],[G_Forma de pago],G_Nombre_agente,[MF_fecha_aprobacion],[MF_Status],[MF_procedencia],[MF_Status magento],[MF_Status real]) OUTPUT INSERTED.id VALUES (@G_fecha_pedido,@G_id_venta,@G_nombre_cliente,@G_monto_venta,@G_medio_venta,@G_forma_pago,@G_nombre_agente,@Fecha_aprobacion,@MF_status,@Procedencia,@Status_magento,@Status_real)",

      function (err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});


router.post("/VickyForm", function (req, res) {
  sql.connect(constants.db40, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();
    var fecha_pedido = "";

    if (req.body.fecha_pedido === "") {
      fecha_pedido = "NULL";
    } else {
      fecha_pedido = "CONVERT(DATETIME,'" + req.body.fecha_pedido + "',103)";
      console.log(fecha_pedido)
    }


    request.input("G_fecha_pedido", req.body.fecha_pedido.toUpperCase());
    request.input("G_id_venta", req.body.id_venta);
    request.input("G_nombre_cliente", req.body.nombre_cliente.toUpperCase());
    request.input("G_monto_venta", req.body.monto_venta.toUpperCase());
    request.input("G_medio_venta", req.body.medio_venta.toUpperCase());
    request.input("G_forma_pago", req.body.forma_pago.toUpperCase());
    request.input("G_nombre_agente", req.body.nombre_agente.toUpperCase());
    request.input("VF_pieza", req.body.vf_pieza);
    request.input("VF_telefono", req.body.vf_telefono);
    request.input("VF_correo", req.body.vf_correo.toUpperCase());
    request.input("VF_direccion", req.body.vf_direccion.toUpperCase());
    request.input("VF_referencias", req.body.vf_referencias.toUpperCase());
    request.input("envio_tienda_dom", req.body.tienda_dom.toUpperCase());
    request.input("tipo_cliente", req.body.tipo_cliente.toUpperCase());


    request.query(
      "INSERT INTO [Ventas_Bitacora].[dbo].[Bitacora_Ventas] ([G_Fecha de pedido],G_id_Venta,[G_Nombre de cliente],[G_Monto de venta],[G_Medio de venta],[G_Forma de pago],G_Nombre_agente,VF_Pieza,VF_telefono,VF_Correo,VF_Direccion,[VF_Referencias],[VF_envio tienda_domicilio],[VF_tipo de cliente]) OUTPUT INSERTED.id VALUES (@G_fecha_pedido,@G_id_venta,@G_nombre_cliente,@G_monto_venta,@G_medio_venta,@G_forma_pago,@G_nombre_agente,@VF_pieza,@VF_telefono,@VF_correo,@VF_direccion,@VF_referencias,@envio_tienda_dom,@tipo_cliente)",

      function (err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.post("/CCS_Leads", function (req, res) {
  sql.connect(constants.db40, function (err) {
    if (err) console.log(err);

    var request = new sql.Request();
    var fecha_pedido = "";

    if (req.body.fecha_pedido === "") {
      fecha_pedido = "NULL";
    } else {
      fecha_pedido = "CONVERT(DATETIME,'" + req.body.fecha_pedido + "',103)";
      console.log(fecha_pedido)
    }

    var fecha_cita = "";

    if (req.body.fecha_cita === "") {
      fecha_cita = "NULL";
    } else {
      fecha_cita = "CONVERT(DATETIME,'" + req.body.fecha_cita + "',103)";
      console.log(fecha_pedido)
    }





    request.input("G_fecha_pedido", req.body.fecha_pedido.toUpperCase());
    request.input("G_id_venta", req.body.id_venta);
    request.input("G_nombre_cliente", req.body.nombre_cliente.toUpperCase());
    request.input("G_monto_venta", req.body.monto_venta.toUpperCase());
    request.input("G_medio_venta", req.body.medio_venta.toUpperCase());
    request.input("G_forma_pago", req.body.forma_pago.toUpperCase());
    request.input("G_nombre_agente", req.body.nombre_agente.toUpperCase());
    request.input("CL_Tipo_venta", req.body.tipo_venta.toUpperCase());
    request.input("CL_Zona", req.body.cl_zona.toUpperCase());
    request.input("CL_origen_prospecto", req.body.origen_prospecto.toUpperCase());
    request.input("CL_num_empleados", req.body.num_empleados.toUpperCase());
    request.input("CL_num_vehiculos", req.body.num_vehiculos);
    request.input("CL_fecha_cita", req.body.fecha_cita.toUpperCase());
    request.input("Status_cita_edenred", req.body.cl_status_cita.toUpperCase());
    request.input("Comentarios_edenred", req.body.comentarios_edenred.toUpperCase());


    request.query(
      "INSERT INTO [Ventas_Bitacora].[dbo].[Bitacora_Ventas] ([G_Fecha de pedido],G_id_Venta,[G_Nombre de cliente],[G_Monto de venta],[G_Medio de venta],[G_Forma de pago],G_Nombre_agente,[CL_tipo venta],[CL_Zona],[CL_origen prospecto],[CL_num empleados],[CL_num vehiculos],[CL_fecha de cita],[CL_status cita edenred],[CL_comentarios edenred]) OUTPUT INSERTED.id VALUES (@G_fecha_pedido,@G_id_venta,@G_nombre_cliente,@G_monto_venta,@G_medio_venta,@G_forma_pago,@G_nombre_agente,@CL_Tipo_venta,@CL_Zona,@CL_origen_prospecto,@CL_num_empleados,@CL_num_vehiculos,@CL_fecha_cita,@Status_cita_edenred, @Comentarios_edenred)",

      function (err, recordset) {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});





module.exports = router;
