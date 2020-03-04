var sql = require("mssql");
var constants = require('./constants');
var moment = require("moment");

module.exports = {
	
 executeQuery: function(res, query) {
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
          res.send(resp) // res.send is not a function
          console.log(moment().format('lll') + ' - ' + query)
      }
  })
  }
})
return res.body
},

 executeProcedure: function(res, procedure) {

       sql.connect(constants.dbConfig)
       .then(function(connection){

        new sql.Request(connection)
        .execute(procedure).then(function(recordsets) {
            console.log(moment().format('lll') + ' - ' + procedure)
            res.send(recordsets)
        }).catch(function(err) {
            console.log(moment().format('lll') + ' - ' + procedure)
            console.log("Error while querying database :- " + err)
            res.send(err)
        });


       })
       .catch(function(err){
          console.log(moment().format('lll') + ' - ' + procedure)
          console.log("Error while connecting database :- " + err)
          res.send(err)
       })

},

 executeAsync: function(res, procedure){
       sql.connect(constants.dbConfig)
       .then(function(){

        new sql.Request()
        .execute(procedure).then(function(recordsets) {
            console.log(moment().format('lll') + ' - ' + procedure)
            res.send(recordsets)
        }).catch(function(err) {
            console.log(moment().format('lll') + ' - ' + procedure)
            console.log("Error while querying database :- " + err)
            res.send(err)
        });


       })
       .catch(function(err){
          console.log(moment().format('lll') + ' - ' + procedure)
          console.log("Error while connecting database :- " + err)
          res.send(err)
       })

}


}