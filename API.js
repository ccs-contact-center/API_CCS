var express = require("express");
var bodyParser = require("body-parser");
var exjwt = require("express-jwt");
var path = require("path");
var compression = require("compression");
const socketIo = require("socket.io");

const PORT = process.env.PORT;
//const PORT = 8082;
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

//app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.static("C:/iisnode"));

app.use(express.json({ limit: "50mb" }));
//app.use(express.urlencoded({limit: '50mb'}));
//Used to parse json bodys from requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Instantiating the express-jwt middleware
const jwtMW = exjwt({
  secret: "Grhzu92E_s3cr3t",
});

//Para correr como standalone server

const server = app.listen(PORT, function () {
  var port = server.address().port;
  //console.clear()
  console.log("Up & Running on port " + port);
});

//Para correr como modulo
//exports.app = app
const io = socketIo(server); // < Interesting!


app.io = io;

/*io.on("connection", function (socket) {
  console.log(`client: ${socket.id}`);
  socket.emit("server/random", Math.random());
  //enviando numero aleatorio cada dos segundo al cliente
  setInterval(() => {
    socket.emit("server/random", Math.random());
  }, 2000);
  //recibiendo el numero aleatorio del cliente
  socket.on("client/random", (num) => {
    console.log(num);
  });
});*/

app.get("/Socket", function (req, res) {
  req.app.io.emit("server/random", req.query.msg);
  res.send("OK");
});

app.use("/v1", require("./routes/v1"));
app.use("/test", require("./routes/test"));
