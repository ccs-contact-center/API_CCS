var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var WebSocket = require("ws");
var Clients = require("./routes/socket/clients");
const clients = new Clients();

const PORT = process.env.PORT;
//const PORT = 8082;

//Enabling CORS on API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
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

//Para correr como standalone server

const server = app.listen(PORT, function () {
  var port = server.address().port;
  console.log("Up & Running on port " + port);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (client) => {
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
      if (user === undefined) {
      } else {
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

app.get("/Socket/Clientes", function (req, res) {
  res.send(clients.clientListShort);
});

app.get("/Socket/Clientes/:username", function (req, res) {
  var result = clients[req.params.username];

  if (result !== undefined) {
    res.send({ logged: true });
  } else {
    res.send({ logged: false });
  }
});

app.use("/v1", require("./routes/v1"));
app.use("/test", require("./routes/test"));
