var router = require("express").Router();
var sql = require("mssql");
var os = require("os");
var moment = require("moment");
var constants = require("../../../../constants");
var utils = require("../../../../utils.js");
var fetch = require("node-fetch");
var exjwt = require("express-jwt");

const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t",
});

setInterval(async () => {
  if (
    (os.hostname() === "MacBook-Air.local" || os.hostname() === "CCS-NODE1") &&
    moment().format("hh:mm:ss") === "00:05:00"
  ) {
    console.log(moment().format() + " Llegó la hora");
    var maxdate = await getMaxDate();
    if (
      moment().subtract(1, "days").format("YYYY-MM-DD") ===
      moment.utc(maxdate[0].MAX_DATE).format("YYYY-MM-DD")
    ) {
      console.log("Ya se había registrado el dia anterior");
    } else {
      var fecha_ini = moment()
        .subtract(1, "days")
        .format("YYYY-MM-DDT00:00:00");
      var fecha_fin = moment().format("YYYY-MM-DDT00:00:00");
      var url =
        "https://www.zopim.com/api/v2/chats/search?q=timestamp:[" +
        fecha_ini +
        " TO " +
        fecha_fin +
        "] AND type:chat";
      var x = await updateChats(
        url,
        moment().subtract(1, "days").format("YYYY-MM-DD")
      );
    }
  }
}, 1000);

const getMaxDate = async () => {
  try {
    await sql.connect(constants.dbCluster);
    var record = await new sql.Request().query(
      "SELECT MAX(CONVERT(DATE,timestamp)) as MAX_DATE FROM Ezetera.dbo.Chats"
    );

    return record;
  } catch (err) {
    console.log(err);
  }
};

const getExistDate = async (date) => {
  var query =
    "SELECT COUNT(*) as REGISTERS FROM Ezetera.dbo.Chats WHERE timestamp BETWEEN '" +
    moment.utc(new Date(date)).format() +
    "' AND '" +
    moment.utc(new Date(date)).add(1, "days").format() +
    "'";

  try {
    await sql.connect(constants.dbCluster);
    var record = await new sql.Request().query(query);

    return record;
  } catch (err) {
    console.log(err);
  }
};

const getChatStatus = async (tipo, totalizado) => {
  var query =
    "SET DATEFORMAT dmy EXEC Ezetera.dbo.REP_WEB_REST_Chat_Dashboard @TIPO = " +
    tipo +
    ",@TOTALIZADO = " +
    totalizado;

  try {
    await sql.connect(constants.dbCluster);
    var record = await new sql.Request().query(query);

    return record;
  } catch (err) {
    console.log(err);
  }
};

const deleteToday = async () => {
  var query =
    " DELETE FROM Ezetera.dbo.Chats OUTPUT Deleted.* WHERE timestamp BETWEEN '" +
    moment().format("YYYY-MM-DD 00:00:00") +
    "' AND '" +
    moment().add(1, "days").format("YYYY-MM-DD 00:00:00") +
    "'";

  try {
    await sql.connect(constants.dbCluster);
    var record = await new sql.Request().query(query);
    return record;
  } catch (err) {
    console.log(err);
  }
};

const updateChats = async (url, date) => {
  const chatList = [];
  const chatData = [];
  while (url) {
    const response = await await fetch(url, {
      headers: {
        Authorization:
          "Basic bHVpcy5iYWxsaW5lc0BlemV0ZXJhLmNvbTplemV0ZXJhMjAyMA==",
      },
    });

    if (!(await response.ok)) {
      throw new Error("HTTP error " + (await response.status));
    }

    const { results, next_url } = await response.json();

    chatList.push(...results);

    url = next_url;
  }

  if (chatList.length === 0) {
    var registers = await getExistDate(date);
    if (registers[0].REGISTERS >= 1) {
      console.log("Ya registrado");
    } else {
      try {
        await sql.connect(constants.dbCluster);
        var record = await new sql.Request().query(
          "INSERT INTO Ezetera.dbo.Chats (timestamp, msg_visitor,received) OUTPUT Inserted.*  VALUES ('" +
            date +
            "',1,2)"
        );

        return record;
      } catch (err) {
        console.log(err);
      }
    }
  } else {
    for (var i = 0, len = chatList.length; i < len; i++) {
      var chatDetails = await await fetch(chatList[i].url, {
        headers: {
          Authorization:
            "Basic bHVpcy5iYWxsaW5lc0BlemV0ZXJhLmNvbTplemV0ZXJhMjAyMA==",
        },
      });

      var chatParsed = await chatDetails.json();

      var toPush = {
        id_chat: chatParsed.id,
        timestamp: moment(new Date(chatParsed.timestamp)).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        duration: chatParsed.duration,
        response_time_first: chatParsed.response_time.first,
        response_time_avg: chatParsed.response_time.avg,
        response_time_max: chatParsed.response_time.max,
        name: chatParsed.visitor.name,
        phone: chatParsed.visitor.phone,
        email: chatParsed.visitor.email,
        msg_visitor: chatParsed.count.visitor,
        msg_agent: chatParsed.count.agent,
        agent: chatParsed.agent_names[0],
        agent_id: chatParsed.agent_ids[0],
        rating: chatParsed.rating,
        colege: chatParsed.departament_name,
        missed: chatParsed.missed === true ? 1 : 0,
        received: 1,
      };

      chatData.push(toPush);
    }

    var data = sql
      .connect(constants.dbCluster)
      .then(() => {
        const table = new sql.Table("Ezetera.dbo.Chats");
        table.create = false;
        table.columns.add("id_chat", sql.VarChar(255), { nullable: true });
        table.columns.add("timestamp", sql.VarChar(255), { nullable: true });
        table.columns.add("duration", sql.Int, { nullable: true });
        table.columns.add("response_time_first", sql.Int, { nullable: true });
        table.columns.add("response_time_avg", sql.Int, { nullable: true });
        table.columns.add("response_time_max", sql.Int, { nullable: true });
        table.columns.add("name", sql.VarChar(255), { nullable: true });
        table.columns.add("phone", sql.VarChar(255), { nullable: true });
        table.columns.add("email", sql.VarChar(255), { nullable: true });
        table.columns.add("msg_visitor", sql.Int, { nullable: true });
        table.columns.add("msg_agent", sql.Int, { nullable: true });
        table.columns.add("agent", sql.VarChar(255), { nullable: true });
        table.columns.add("agent_id", sql.VarChar(255), { nullable: true });
        table.columns.add("rating", sql.VarChar(255), { nullable: true });
        table.columns.add("colege", sql.VarChar(255), { nullable: true });
        table.columns.add("missed", sql.Int, { nullable: true });
        table.columns.add("received", sql.Int, { nullable: true });

        chatData.forEach((arr) => {
          table.rows.add(
            arr.id_chat,
            arr.timestamp,
            arr.duration,
            arr.response_time_first,
            arr.response_time_avg,
            arr.response_time_max,
            arr.name,
            arr.phone,
            arr.email,
            arr.msg_visitor,
            arr.msg_agent,
            arr.agent,
            arr.agent_id,
            arr.rating,
            arr.colege,
            arr.missed,
            arr.received
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
  }
};

router.get("/UpdateChats", async (req, res) => {
  var x = await updateChats(
    "https://www.zopim.com/api/v2/chats/search?q=timestamp:[" +
      moment.utc(new Date(req.query.fecha)).format() +
      " TO " +
      moment.utc(new Date(req.query.fecha)).add(1, "days").format() +
      "] AND type:chat",
    moment.utc(new Date(req.query.fecha)).format()
  );

  res.send(x);
});

router.get("/ChatStatus", async (req, res) => {
  if (req.query.tipo == 0 || req.query.tipo == 1) {
    var deletedFirst = await deleteToday();

    var inserted = await updateChats(
      "https://www.zopim.com/api/v2/chats/search?q=timestamp:[" +
        moment().format("YYYY-MM-DDT00:00:00Z") +
        " TO " +
        moment().add(1, "days").format("YYYY-MM-DDT00:00:00Z") +
        "] AND type:chat",
      moment().format("YYYY-MM-DD 00:00:00")
    );

    var results = await getChatStatus(req.query.tipo, req.query.totalizado);

    var deletedLast = await deleteToday();

    res.send(results);
  } else {
    var results = await getChatStatus(req.query.tipo, req.query.totalizado);
    res.send(results);
  }
});
router.get("/Top10Tipificaciones", (req, res) => {
  var procedure =
    "EXEC [CCS].[dbo].[REP_WEB_REST_Ezetera_TOP_10] @TIPO = " +
    req.query.tipo +
    ", @COLEGIO = '" +
    req.query.colegio +
    "'";
  utils.executeQuery(res, procedure);
});

router.get("/colegios", (req, res) => {
  var procedure =
    "SELECT colegio as value, colegio as label FROM Ezetera_in.dbo.colegios";
  utils.executeQuery(res, procedure);
});

module.exports = router;
