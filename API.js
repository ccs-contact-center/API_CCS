var express = require("express");
var bodyParser = require("body-parser");
var exjwt = require("express-jwt");
var path = require("path");
var compression = require("compression");


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

var clients = {};
io.sockets.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("loginUser", (data) => {
    if (clients[data.username]) {
      //Indica que el usuario ya está conectado y no lo registra en la userlist
      socket.emit("msgNotification", {
        type: "danger",
        body: "¡El usuario ya estaba conectado!",
      });
    } else {
      //Registra al usuario en la userlist, le envia la confirmación y a los demas usuarios les notifica
      clients[data.username] = {
        socket: socket.id,
      };
      socket.emit("msgNotification", {
        type: "success",
        body: "¡Correcto!",
      });
      socket.broadcast.emit("msgNotification", {
        type: "info",
        body: data.username + " se conectó",
      });
    }
    console.table(clients);
  });

  //The above code is for the client

  /*
   socket.emit("private-message", {
    "username": $(this).find("input:first").val(),
    "content": $(this).find("textarea").val()
   });
   */

  socket.on("private-message", (data) => {
    if (clients[data.username]) {
      io.sockets.connected[clients[data.username].socket].emit(
        "msgNotification",
        {
          type: "info",
          body: data,
        }
      );
    } else {
      //console.log("User does not exist: " + data.username);
    }
  });

  //Removing the socket on disconnect
  socket.on("disconnect", () => {
    for (var name in clients) {
      if (clients[name].socket === socket.id) {
        delete clients[name];
        break;
      }
    }
    console.log(clients);
  });
});

app.get("/Socket", function (req, res) {
  req.app.io.emit("msgNotification", req.query.msg);
  res.send("OK");
});

app.use("/v1", require("./routes/v1"));
app.use("/test", require("./routes/test"));