var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var compression = require("compression");
var WebSocket = require("ws");

//const PORT = process.env.PORT;
const PORT = 8082;
var app = express();

app.use(compression());

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
//Para correr como modulo
//exports.app = app

app.get("/Socket", function (req, res) {
  res.send("OK");
});

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});

app.use("/v1", require("./routes/v1"));
app.use("/test", require("./routes/test"));
