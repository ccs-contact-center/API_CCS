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
  socket.broadcast.emit("msgNotification", socket.id + " se conectó");
  socket.on("connect", (reason) => {
    //io.emit("msgNotification", socket.id + " se conectó");
  });
  socket.on("disconnect", (reason) => {
    socket.broadcast.emit("msgNotification", socket.id + " se desconectó");
    //io.emit("msgNotification", socket.id + " se desconectó");
  });
});
*/

let connectedUserMap = new Map();

io.on("connection", function (socket) {
  let connectedUserId = socket.id;
  //console.log("conected", connectedUserMap);
  //add property value when assigning user to map
  connectedUserMap.set(socket.id, { status: "online", name: null });

  socket.on("recieveUserName", function (data) {
    //find user by there socket in the map the update name property of value

    var users = [];
    connectedUserMap.forEach((test) => {
      users.push(test.name);
    });

    //var difficult_tasks = users.filter((task) => task === data.name);

    //console.log(difficult_tasks.length);

    let user = connectedUserMap.get(connectedUserId);
    user.name = data.name;

    
    socket.emit("msgNotification", "Correcto");
    socket.broadcast.emit("msgNotification", user.name + " se conectó");

    console.log("conected", connectedUserMap);
  });

  socket.on("disconnect", function () {
    //get access to the user currently being used via map.
    let user = connectedUserMap.get(connectedUserId);
    user.status = "offline";
    connectedUserMap.delete(connectedUserId);
    //console.log("disconected", connectedUserMap);
  });
});

app.get("/Socket", function (req, res) {
  req.app.io.emit("msgNotification", req.query.msg);
  res.send("OK");
});

app.use("/v1", require("./routes/v1"));
app.use("/test", require("./routes/test"));
