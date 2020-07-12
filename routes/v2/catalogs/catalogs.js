var router = require("express").Router();
var sql = require("mssql");
var constants = require("../../../constants");
var exjwt = require("express-jwt");

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t",
});

router.get("/clavesEstados/:estado", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("EDO", req.params.estado);
    request.query(
      "SELECT * FROM SQLCLUSTER.CodigosPostales.dbo.Estados WHERE estado = @EDO",
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/codigo_postal/:cp", (req, res) => {
  var cp = req.params.cp;
  sql
    .connect(constants.dbConfig)
    .then(() => {
      var request = new sql.Request();
      request.input("CP", cp + "%");
      request
        .query(
          "SELECT DISTINCT d_codigo as 'CodigoPostal',D_mnpio as 'Municipio',d_estado as 'Estado' ,d_ciudad as 'Ciudad' FROM SQLCLUSTER.CodigosPostales.dbo.CP WHERE d_codigo like @CP"
        )
        .then((result) => {
          return result; // Contiene los ID
        })
        .then(async (cols) => {
          const colPromises = cols.map((CodigoPostal) => {
            const request = new sql.Request();
            request.input("CP", CodigoPostal.CodigoPostal);
            return request.query(
              "SELECT d_codigo as 'CodigoPostal',d_asenta as 'Colonia' FROM SQLCLUSTER.CodigosPostales.dbo.CP WHERE d_codigo = @CP"
            );
          });

          var codigosPostales = cols;
          var coloniasPromise = await Promise.all(colPromises);
          var colonias = [];
          var result = [];

          coloniasPromise.forEach((registro) => {
            for (x = 0; x < registro.length; x++) {
              var test = {
                CodigoPostal: registro[x].CodigoPostal,
                Colonia: registro[x].Colonia,
              };

              colonias.push(test);
            }
          });

          codigosPostales.forEach((codigoPostal) => {
            var current = codigoPostal.CodigoPostal;

            let filtered = colonias.filter(
              (number) => number.CodigoPostal == current
            );

            var coloniasOk = filtered.map((task) => task.Colonia);

            var modelo = [
              {
                Estado: codigoPostal.Estado,
                Municipio: codigoPostal.Municipio,
                Codigo_Postal: codigoPostal.CodigoPostal,
                Ciudad: codigoPostal.Ciudad,
                Colonias: coloniasOk,
              },
            ];

            result.push(modelo);
          });

          return result;
        })
        .then((final) => {
          res.send(final);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/colonia/:estado/:col", (req, res) => {
  var cp = req.params.col;
  var edo = req.params.estado;
  sql
    .connect(constants.dbConfig)
    .then(() => {
      var request = new sql.Request();
      request.input("CP", "%" + cp + "%");
      request.input("EDO", "%" + edo + "%");
      request
        .query(
          "SELECT DISTINCT d_codigo as 'CodigoPostal',D_mnpio as 'Municipio',d_estado as 'Estado' ,d_ciudad as 'Ciudad' FROM SQLCLUSTER.CodigosPostales.dbo.CP WHERE d_asenta like @CP AND d_estado like @EDO"
        )
        .then((result) => {
          return result; // Contiene los ID
        })
        .then(async (cols) => {
          const colPromises = cols.map((CodigoPostal) => {
            const request = new sql.Request();
            request.input("CP", CodigoPostal.CodigoPostal);
            return request.query(
              "SELECT d_codigo as 'CodigoPostal',d_asenta as 'Colonia' FROM SQLCLUSTER.CodigosPostales.dbo.CP WHERE d_codigo = @CP"
            );
          });

          var codigosPostales = cols;
          var coloniasPromise = await Promise.all(colPromises);
          var colonias = [];
          var result = [];

          coloniasPromise.forEach((registro) => {
            for (x = 0; x < registro.length; x++) {
              var test = {
                CodigoPostal: registro[x].CodigoPostal,
                Colonia: registro[x].Colonia,
              };

              colonias.push(test);
            }
          });

          codigosPostales.forEach((codigoPostal) => {
            var current = codigoPostal.CodigoPostal;

            let filtered = colonias.filter(
              (number) => number.CodigoPostal == current
            );

            var coloniasOk = filtered.map((task) => task.Colonia);

            var modelo = [
              {
                Estado: codigoPostal.Estado,
                Municipio: codigoPostal.Municipio,
                Codigo_Postal: codigoPostal.CodigoPostal,
                Ciudad: codigoPostal.Ciudad,
                Colonias: coloniasOk,
              },
            ];

            result.push(modelo);
          });

          return result;
        })
        .then((final) => {
          res.send(final);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/municipios", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("EDO", req.query.estado);
    request.query(
      "SELECT DISTINCT c_mnpio as 'value', D_mnpio as 'label' FROM CodigosPostales.dbo.CP WHERE d_estado = @EDO ORDER BY D_mnpio",
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/colonias", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("EDO", req.query.estado);
    request.input("MUNICIPIO", req.query.municipio);
    request.query(
      "SELECT d_codigo as value,d_asenta as label FROM CodigosPostales.dbo.CP WHERE d_estado = @EDO AND d_mnpio = @MUNICIPIO ORDER BY d_asenta",
      (err, recordset) => {
        if (err) console.log(err);

        res.send(recordset);
      }
    );
  });
});

router.get("/menu", (req, res) => {
  sql.connect(constants.dbCluster, (err) => {
    if (err) console.log(err);

    var request = new sql.Request();
    request.input("ROLE", req.query.role);
    request.input("SU", req.query.su);
    request.query(
      "EXEC CCS.dbo.GET_Menu @ROLE = @ROLE, @SU = @SU",
      (err, recordset) => {
        if (err) console.log(err);

        var menu = [];

        recordset.forEach((item) => {
          var title = {
            title: true,
            name: item.name,
            class: "text-center",
          };

          var singleSection = {
            name: item.name,
            url: item.url,
            icon: item.icon,
          };

          var childrens = [];

          if (item.hasChild === 1) {
            childrens = recordset.filter(
              (itemFiltered) => itemFiltered.parent === item.id
            );
          }

          var childSection = {
            name: item.name,
            url: item.url,
            icon: item.icon,
            children: childrens,
          };

          //console.log(childrens.length >= 1);

          if (item.title === 1) {
            menu.push(title);
          } else if (item.hasChild === 0 && item.parent === 0) {
            menu.push(singleSection);
          } else if (item.hasChild === 1) {
            menu.push(childSection);
          }
        });

        var menuOK = {
          items: menu,
        };
        res.send(menuOK);
      }
    );
  });
});

module.exports = router;
