var router = require('express').Router();

var constants = require('../../../../constants');
var utils = require("../../../../utils.js");
var sql = require('mssql');

var exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: 'Grhzu92E_s3cr3t'
});



router.get('/',function(req, res) {
   res.send('Endpoint Televisa')
})

router.get("/orders/cancel", function (req, res) {
    sql.connect(constants.dbConfig, function (err) {
      if (err) console.log(err);
  
      var request = new sql.Request();
  
    request.input("id",req.query.id);
  
      request.query(
        'exec tbg_television_new.dbo.inhabilita_ordenes @criterio=@id',
        function (err, recordset) {
          if (err) console.log(err);
          res.send(recordset);
        }
      );
    });
  });




module.exports = router;