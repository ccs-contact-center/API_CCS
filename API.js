var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var log4js = require("log4js");
var os = require("os");

log4js.configure({
  appenders: {
    log: {
      type: "file",
      filename: "logs/CCS_" + os.hostname() + ".log",
      maxLogSize: 10485760,
      backups: 3,
      compress: false,
    },
  },
  categories: { default: { appenders: ["log"], level: "info" } },
});
const logger = log4js.getLogger("CCS");
var WebSocket = require("ws");
var Clients = require("./routes/socket/clients");
const clients = new Clients();

const PORT = process.env.PORT;
//const PORT = 8082;

//Enabling CORS on API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-type,Authorization, id_ccs"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, PUT, GET, OPTIONS,PATCH, DELETE"
  );
  next();
});

app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static("C:/iisnode"));

app.use(express.json({ limit: "50mb" }));

//Used to parse json bodys from requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*app.use((req, res, next) => {
  var datetime = new Date();
  var logEntry = {
    date: datetime,
    user: req.get("id_ccs"),
    ip: req.ip,
    route: req.url,
    method: req.method,
    payload: req.body,
  };

  logger.info(JSON.stringify(logEntry));

  next();
});
*/

//Para correr como standalone server

const server = app.listen(PORT, function () {
  var port = server.address().port;
  console.log("Up & Running on port " + port);
});

const wss = new WebSocket.Server({ server, perMessageDeflate: false });

app.wss = wss;
app.logger = logger;

function heartbeat() {
  this.isAlive = true;
}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(() => {});
  });
}, 30000);

wss.on("connection", (client) => {
  client.isAlive = true;
  client.on("pong", heartbeat);
  client.on("message", (msg) => {
    const data = JSON.parse(msg);

    switch (data.type) {
      case "login":
        clients.saveClient(data.data.username, client);
        var sData = {
          type: "selfLogin",
          data: {
            body: "¡Bienvenido, " + data.data.username + "!",
          },
        };
        clients.clientList[data.data.username].send(JSON.stringify(sData));
        wss.clients.forEach(function each(user) {
          if (user !== client && user.readyState === WebSocket.OPEN) {
            var sData = {
              type: "login",
              data: {
                body: data.data.username + " se conectó",
              },
            };
            user.send(JSON.stringify(sData));
          }
        });
        break;
      case "logout":
        clients.removeClient(data.data.username);
        if (data.data.username === undefined) {
        } else {
          wss.clients.forEach(function each(user) {
            if (user !== client && user.readyState === WebSocket.OPEN) {
              var sData = {
                type: "login",
                data: {
                  body: data.data.username + " se desconectó",
                },
              };
              user.send(JSON.stringify(sData));
            }
          });
        }
        break;
      case "browserRefresh":
        if (clients.isLoggedIn(data.data.username) === true) {
          clients.stopRemove();
          clients.updateClient(data.data.username, client);
        }
        break;
      default:
        console.log(data);
        break;
    }
  });

  client.on("close", function () {
    var user = clients.searchUserByConn(clients.clientList, client);
    clients.requestRemove(user);
    setTimeout(() => {
      if (user === undefined || clients.isLoggedIn(user) === true) {
      } else {
        clearInterval(interval);
        wss.clients.forEach(function each(id) {
          if (id !== client && id.readyState === WebSocket.OPEN) {
            var sData = {
              type: "login",
              data: {
                body: user + " se desconectó",
              },
            };
            id.send(JSON.stringify(sData));
          }
        });
      }
    }, 5000);
  });
});

app.get("/Socket/Data", async (req, res) => {
  req.app.wss.clients.forEach(function each(user) {
    if (user.readyState === WebSocket.OPEN) {
      var sData = {
        type: "login",
        data: {
          body: "se envio un mensaje",
        },
      };
      user.send(JSON.stringify(sData));
    }
  });

  res.send("Mensaje Enviado");
});

app.get("/Socket/Clientes", function (req, res) {
  res.send(Object.keys(clients.clientList));
});

app.delete("/Socket/Clientes/:username", function (req, res) {
  try {
    var sData = {
      type: "forceLogout",
      data: {
        body: "¡Se ha forzado remotamente el logout!",
      },
    };
    clients.clientList[req.params.username].send(JSON.stringify(sData));
    res.send(Object.keys(clients.clientList));
  } catch (e) {
    res.send(e);
  }
});

app.get("/Socket/Clientes/:username", function (req, res) {
  var result = clients.clientList[req.params.username];

  if (result !== undefined) {
    res.send({ logged: true });
  } else {
    res.send({ logged: false });
  }
});

app.use("/v1", require("./routes/v1"));
app.use("/v2", require("./routes/v2"));
app.use("/inConcertAPI", require("./routes/inConcertAPI"));
app.use("/test", require("./routes/test"));
