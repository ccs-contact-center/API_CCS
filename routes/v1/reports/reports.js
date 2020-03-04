var router = require('express').Router();

var parser = require('xml2json-light');
var sql = require("mssql");
var moment = require("moment");
var constants = require('../../../constants');
var utils = require("../../../utils.js");

var exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: 'Grhzu92E_s3cr3t'
});



router.get('/',jwtMW,function(req, res) {

  var query = "SELECT id,path,name FROM [SQLCLUSTER].[ReportesCCS].[dbo].[SYS_Reports] WHERE campaign =" + req.query.campaign;

  utils.executeQuery(res, query);
})


router.get('/Params',jwtMW,function(req, res) {
	
  var query = "SELECT Parameter FROM [SQLCLUSTER].[SSRS].[dbo].[Catalog] where Path = '" + req.query.path + "'"

console.log(query)
  	sql.connect(constants.dbConfig, function(err) {
		if (err) {
			console.log(moment().format('lll') + ' - ' + query)
			console.log("Error while connecting database :- " + err)
			res.send(err)
		} else {
			let request = new sql.Request();
      request.query(query, function(err, resp) { // Changed res to resp
      	if (err) {
      		console.log(moment().format('lll') + ' - ' + query)
      		console.log("Error while querying database :- " + err)
      		res.send(err)
      	} else {
          res.send(parser.xml2json(resp[0].Parameter)) // res.send is not a function
          console.log(moment().format('lll') + ' - ' + query)
      }
  })
  }
})

})

router.get('/ParamsList',jwtMW,function(req, res) {
	
  var query = "EXEC [CCS].[dbo].[GET_Catalogo_Parametros] @PARAMETRO='" + req.query.Parametro + "'"

utils.executeQuery(res, query);
 

})

module.exports = router;