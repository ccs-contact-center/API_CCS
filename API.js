var express = require("express");
var app = express();
var expressWs = require("express-ws");
var bodyParser = require("body-parser");
var path = require("path");
var WebSocket = require("ws");

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

expressWs(server);

class Clients {
  constructor() {
    this.clientList = {};
    this.saveClient = this.saveClient.bind(this);
  }
  saveClient(username, client) {
    this.clientList[username] = client;
  }

  removeClient(username) {
    delete this.clientList[username];
  }
}

const clients = new Clients();

const wss = new WebSocket.Server({ server });

wss.on("connection", (client) => {
  client.on("message", (msg) => {
    //const parsedMsg = JSON.parse(msg);
    clients.saveClient(msg, client);
    console.log(clients.clientList);
    clients.clientList["icontrerasg"].send("Lo lograste, gilipollas!");
  });

  client.on("close", function () {
    clients.removeClient("icontrerasg")
    console.log(clients.clientList);
  });
});

/*wss.on("connection", function connection(ws, req) {
  ws.on("message", function incoming(message) {
    console.log(message);
  });

  ws.on("close", function () {
    console.log("Goodbye, Mr Server");
  });
});*/

app.get("/Socket/Clientes", function (req, res) {
  res.send("OK");
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
