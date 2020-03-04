var router = require('express').Router();

var constants = require('../../../constants');
var utils = require("../../../utils.js");

var sql = require("mssql");
var fetch = require("node-fetch");

var exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: 'Grhzu92E_s3cr3t'
});


router.get('/Status_General',jwtMW,function(req, res) {
    var query = "EXECUTE Comercial.dbo.SYS_Status_General @TIPO = " + req.query.tipo;
    utils.executeQuery(res, query);
})

router.get('/Layout_Status',function(req, res) {
    var query = "EXECUTE Comercial.dbo.SYS_Layout_Filtrado @TIPO = " + req.query.tipo + ", @FILTRO = '" + req.query.status + "'";
    utils.executeQuery(res, query);
})

router.post('/Lead_Contactos/',jwtMW,function(req, res) {
	
	var now = new Date();
	var curDate = now.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
	
    var insertNew = "INSERT INTO Comercial.dbo.SYS_Leads_Contactos (id_user, ext,nombre_prospecto,nombre_contacto,telefono,email,categoria,primer_contacto,ultimo_contacto,estado,medio,status_comercial_externo,estaciones,status_gestion,status_venta,fecha_captura, unidad_negocio, costo_hora) " +
                 "OUTPUT Inserted.Id VALUES ('" + req.body.id_user + "','" + req.body.ext + "','" + req.body.nombre_prospecto + "','" + req.body.nombre_contacto + "','" + req.body.telefono + "','" + req.body.email + "','" + req.body.categoria + "','" + req.body.primer_contacto + "','" + curDate + "','" + req.body.estado + "','" + req.body.medio + "','" + req.body.status_comercial_externo + "','" + req.body.estaciones + "','" + req.body.status_gestion + "','" + req.body.status_venta + "','" + curDate + "', '" + req.body.unidad_negocio + "','" + req.body.costo_hora + "')"      
      
	 var id = []
	 
	 
	 
    sql.connect(constants.dbConfig, function (err) {
    
        if (err) console.log(err);

        var request = new sql.Request();
           
        request.query(insertNew, function (err, recordset) {
            
            if (err) console.log(err)

		try {
		
            if (recordset.length == 1) {
			
			res.status(200).json({
                sucess: true,
				inserted: recordset[0].Id,
                err: 'OK'
                });
            //res.send("" + recordset[0].Id + "");
			
			
			const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			}	



			var bodyCuerpo = {
			   'nombre_prospecto' : req.body.nombre_prospecto
			  ,'nombre_contacto': req.body.nombre_contacto
			  ,'telefono': req.body.telefono
			  ,'email': req.body.email
			  ,'categoria': req.body.categoria
			  ,'primer_contacto': req.body.primer_contacto
			  ,'estado' : req.body.estado
			  ,'medio': req.body.medio
			  ,'status_comercial_externo': req.body.status_comercial_externo
			  ,'estaciones':req.body.estaciones
			  ,'status_gestion' : req.body.status_gestion
			  ,'status_venta': req.body.status_venta
			  ,'fecha_base': curDate
			  ,'id_contacto': recordset[0].Id
			  ,'unidad_negocio' : req.body.unidad_negocio
			  ,'costo_hora' : req.body.costo_hora
		  	  ,'id_user' : req.body.id_user
		  	  ,'ext' : req.body.ext
				
			}
	

		
				fetch('https://api.ccscontactcenter.com/v1/comercial/Lead_Historico',{
					headers,
					method: 'POST',
					body: JSON.stringify(bodyCuerpo)
				})
				.then(res => res.text())
				.then(body => console.log(body));

            } else {

                res.status(500).json({
                sucess: false,
                token: null,
                err: 'Error controlado desconocido'
                });

            }
			
		}
		
		catch (error){
			
			res.status(400).json({
                sucess: false,
                err: 'Error en los tipos de datos enviados'
                });
			console.log(error)
		}
            
        });
		
    });
	
})

router.put('/Lead_Contactos/',jwtMW,function(req, res) {
	
	var now = new Date();
	var curDate = now.toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })
	
    var insertNew = "UPDATE Comercial.dbo.SYS_Leads_Contactos SET id_user = '" + req.body.id_user + "', ext = '" + req.body.ext + "', costo_hora ='" + req.body.costo_hora + "', unidad_negocio ='" + req.body.unidad_negocio + "', nombre_contacto ='" + req.body.nombre_contacto + "', telefono ='" + req.body.telefono + "', email = '" + req.body.email + "', categoria = '" + req.body.categoria + "', ultimo_contacto='" + curDate + "', estado= '" + req.body.estado + "', status_comercial_externo='" +req.body.status_comercial_externo + "', status_gestion='" + req.body.status_gestion + "', status_venta='" + req.body.status_venta + "' OUTPUT Inserted.Id WHERE id = " + req.body.id
	
	
	console.log(insertNew)
	 
    sql.connect(constants.dbConfig, function (err) {
    
        if (err) console.log(err);

        var request = new sql.Request();
           
        request.query(insertNew, function (err, recordset) {
            
            if (err) console.log(err)

            if (recordset.length == 1) {
			
            res.status(200).json({
                sucess: true,
				updated: recordset[0].Id,
                err: 'OK'
                });
			
			
			const headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			}	

			var bodyCuerpo = {
			   'nombre_prospecto' : req.body.nombre_prospecto
			  ,'nombre_contacto': req.body.nombre_contacto
			  ,'telefono': req.body.telefono
			  ,'email': req.body.email
			  ,'categoria': req.body.categoria
			  ,'primer_contacto': req.body.primer_contacto
			  ,'estado' : req.body.estado
			  ,'medio': req.body.medio
			  ,'status_comercial_externo': req.body.status_comercial_externo
			  ,'estaciones':req.body.estaciones
			  ,'status_gestion': req.body.status_gestion
			  ,'status_venta': req.body.status_venta
			  ,'fecha_base': curDate
			  ,'id_contacto': recordset[0].Id
			  ,'unidad_negocio':req.body.unidad_negocio
			  ,'costo_hora' : req.body.costo_hora
			  ,'id_user' : req.body.id_user
			  ,'ext' : req.body.ext
				
			}
	

		
				fetch('https://api.ccscontactcenter.com/v1/comercial/Lead_Historico',{
					headers,
					method: 'POST',
					body: JSON.stringify(bodyCuerpo)
				})
				.then(res => res.text())
				.then(body => console.log(body));

            } else {

                res.status(401).json({
                sucess: false,
                token: null,
                err: 'Username or password is incorrect'
                });

            }
            
        });
		
    });
	
})

router.get('/Lead_Contactos/',jwtMW,function(req, res) {
    var query = "SELECT id ,nombre_prospecto ,nombre_contacto ,telefono ,ext ,email ,categoria ,fecha_captura ,primer_contacto ,ultimo_contacto ,estado ,medio ,status_comercial_externo ,estaciones ,status_gestion ,CASE WHEN status_gestion = 'Primer Contacto' THEN '20%' WHEN status_gestion = 'Envio de Propuesta' THEN '40%' WHEN status_gestion = 'Rebote de Propuesta' THEN '60%' WHEN status_gestion = 'Por Firmar' THEN '80%' WHEN status_gestion = 'Cerrada' THEN '100%' END as Avance ,status_venta ,unidad_negocio ,costo_hora ,id_user FROM Comercial.dbo.SYS_Leads_Contactos";
    utils.executeQuery(res, query);
})

router.get('/Lead_Contactos/:id/',jwtMW,function(req, res) {
    var query = "SELECT * FROM Comercial.dbo.SYS_Leads_Contactos WHERE id=" + req.params.id;
    utils.executeQuery(res, query);
})

router.post('/Lead_Historico/',function(req, res) {
	
    var insertNew = "INSERT INTO Comercial.dbo.SYS_Leads_Historico (id_user, ext,nombre_prospecto,nombre_contacto,telefono,email,categoria,primer_contacto,estado,medio,status_comercial_externo,estaciones,status_gestion,status_venta,fecha_base,id_contacto, unidad_negocio,costo_hora) " +
					"OUTPUT Inserted.Id VALUES ('" + req.body.id_user + "','" + req.body.ext + "','" + req.body.nombre_prospecto + "','" + req.body.nombre_contacto + "','" + req.body.telefono + "','" + req.body.email + "','" + req.body.categoria + "','" + req.body.primer_contacto + "','" + req.body.estado + "','" + req.body.medio + "','" + req.body.status_comercial_externo + "','" + req.body.estaciones + "','" + req.body.status_gestion + "','" + req.body.status_venta +  "','" + req.body.fecha_base + "','" + req.body.id_contacto + "','" + req.body.unidad_negocio + "','" + req.body.costo_hora + "')"
    utils.executeQuery(res, insertNew);
})




module.exports = router;