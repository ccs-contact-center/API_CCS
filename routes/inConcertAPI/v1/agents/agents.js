var router = require("express").Router();
var sql = require("mssql");
var os = require("os");
var moment = require("moment");
var constants = require("../../../../constants");
var utils = require("../../../../utils.js");
var fetch = require("node-fetch");
var exjwt = require("express-jwt");
var html_tablify = require("html-tablify");

const e = require("express");

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t",
});

const GetAgents = async (url, date) => {
  const interactions = [];

  try {
    let i = 1;
    while (url) {
      const response = await await fetch(url + "/" + i, {
        headers: {
          "x-api-key": "c9a6dae22a293af4ead2a0ef9392e271",
        },
      });

      if ((await response.status) !== 200) {
        throw new Error("HTTP error " + (await response.status));
      }

      const res = await response.json();

      interactions.push(res.items);
      i = i + 1;

      res.items.length === 2000 ? (url = url) : (url = null);
    }
  } catch (e) {
    console.log(e);
  }

  var data = sql
    .connect(constants.dbCluster)
    .then(() => {
      const table = new sql.Table("inConcert.dbo.Agentes");
      table.create = false;

      table.columns.add("Id", sql.VarChar(255), { nullable: true });
     

      interactions[0].forEach((arr) => {
        table.rows.add(
          arr.Id,
          parseDate(arr.StartDate),
        );
      });

      const request = new sql.Request();
      return request.bulk(table);
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });

  var inserted = { inserted: await data };

  return inserted;
};

function parseDate(input) {
  return new Date(
    moment
      .utc(input, "DD/MM/YYYY HH:mm:ss")
      .subtract(5, "hours")
      .format("YYYY-MM-DD HH:mm:ss")
  );
}

router.get("/Insertar", async (req, res) => {
  var x = await GetAgents(
    "https://wscls25.inconcertcc.com/Data/api/ccs/Actors/" +
      moment.utc(new Date(req.query.fecha)).format("YYYY-MM-DD") +
      "/"
  );

  res.send(x);
});

router.get("/AcumuladoresAgentes/:format", (req, res) => {
  let notDate =
    req.query.fecha_ini === undefined || req.query.fecha_fin === undefined;

  let custom = parseInt(req.query.intervalo);

  if (notDate === true && custom === 4) {
    res.status(400).send({
      error: true,
      msg:
        "El tipo 4 'Custom' debe de ir acompañado de los parametros fecha_ini y fecha_fin.",
      ej:
        "",
    });
  } else {
    sql.connect(constants.dbCluster, (err) => {
      if (err) console.log(err);

      var request = new sql.Request();
      request.input("INTERVALO", req.query.intervalo);
      request.input("AGRUPADO", req.query.agrupado);
      request.input("TOTALIZADO", req.query.totalizado);
      request.input("CAMPAIGN", req.query.campaign);
      request.input("SKILL", req.query.skill);
      request.input(
        "FECHA_INI",
        moment(req.query.fecha_ini, "DD/MM/YYYY").format("MM-DD-YYYY")
      );
      request.input(
        "FECHA_FIN",
        moment(req.query.fecha_fin, "DD/MM/YYYY").format("MM-DD-YYYY")
      );
      request.query(
        `EXEC inConcert.dbo.AcumuladoresCampania @INTERVALO = @INTERVALO, @AGRUPADO = @AGRUPADO, @TOTALIZADO=@TOTALIZADO, @CAMPAIGN = @CAMPAIGN,@SKILL = @SKILL,@FECHA_INI = @FECHA_INI,@FECHA_FIN = @FECHA_FIN`,
        (err, recordset) => {
          if (err) console.log(err);

          var style = `<style> table{border:1px solid #1c6ea4;background-color:#eee;width:100%;text-align:center;border-collapse:collapse}table td,table th{border:1px solid #aaa;padding:3px 2px}table tbody td{font-size:13px}table tr:nth-child(even){background:#d0e4f5}table th{background:#1c6ea4;background:-moz-linear-gradient(top,#5592bb 0,#327cad 66%,#1c6ea4 100%);background:-webkit-linear-gradient(top,#5592bb 0,#327cad 66%,#1c6ea4 100%);background:linear-gradient(to bottom,#5592bb 0,#327cad 66%,#1c6ea4 100%);border-bottom:2px solid #444}table th{font-size:15px;font-weight:700;color:#fff;border-left:2px solid #d0e4f5}table th:first-child{border-left:none}</style> `;

          var options = {
            data: recordset,
          };

          var html_data = html_tablify.tablify(options);

          if (recordset.length === 0) {
            res
              .status(404)
              .send({ error: false, msg: "No hay resultados", ej: "empty" });
          } else {
            if (req.params.format === "html") {
              res.send(style + html_data);
            } else if (req.params.format === "json") {
              res.send(recordset);
            } else {
              res.send("Formato no valido, debe ser html o json");
            }
          }
        }
      );
    });
  }
});

router.get("/Test", (req, res) => {
  res.send({ Test: "ok" });
});

module.exports = router;
