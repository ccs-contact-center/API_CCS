var express = require("express");
var bodyParser = require("body-parser");
var exjwt = require("express-jwt");
var path = require("path");
var convert = require("xml-js");

var fetch = require("node-fetch");
//var compression = require("compression");
var socketIo = require("socket.io");

//const PORT = process.env.PORT;
const PORT = 8082;
var app = express();

//app.use(compression());

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
const io = socketIo(server, {
  perMessageDeflate: false,
  pingInterval: "2000",
  pingTimeout: "10000",
}); // < Interesting!

app.io = io;

var clients = {};
io.sockets.on("connection", (socket) => {
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

  socket.on("browserRefresh", (data) => {
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
    }
    console.table(clients);
  });

  socket.on("logoutUser", (data) => {
    if (clients[data.username]) {
      for (var name in clients) {
        if (clients[name].socket === socket.id) {
          delete clients[name];
          break;
        }
      }
      socket.broadcast.emit("msgNotification", {
        type: "info",
        body: data.username + " se desconectó",
      });
    } else {
      socket.emit("msgNotification", {
        type: "success",
        body: "Nada!",
      });
    }
    console.table(clients);
  });

  socket.on("disconnect", (data) => {
    var name = null;
    for (name in clients) {
      if (clients[name].socket === socket.id) {
        delete clients[name];
        break;
      }
    }

    setTimeout(() => {
      var result = clients[name];

      if (result !== undefined) {
      } else {
        socket.broadcast.emit("msgNotification", {
          type: "info",
          body: name + " se desconectó",
        });
      }
    }, 10000);

    console.table(clients);
  });

  // clean up when a user leaves, and broadcast it to other users

  //The above code is for the client
  /*
   socket.emit("private-message", {
    "username": $(this).find("input:first").val(),
    "content": $(this).find("textarea").val()
   });
  
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
  }); */
});

app.get("/Socket/Clientes", function (req, res) {
  res.send(clients);
});

app.get("/Socket/Clientes/:username", function (req, res) {
  var result = clients[req.params.username];

  if (result !== undefined) {
    res.send({ logged: true });
  } else {
    res.send({ logged: false });
  }
});

getMitrol = async (wsParameter) => {
  const response = await await fetch(
    "http://10.0.3.94/reportes/ws.asmx/MitrolWS_UserPass?Username=icontreras&Password=icontreras&wsParameter=" +
      encodeURIComponent(wsParameter)
  );
  var token = await response.text();

  return token;
};

app.get("/Mitrol", async (req, res) => {

  var wsParameter = `
      store=REP_RDL_EficienciaCampania05101520##
      idPermiso=REPORTES_Campañas_Eficiencia+de+Campaña+05-10-15-20##
      Version=17##
      col=##ssss
      Idioma=es##
      SizeWeb=300##
      SizePrint=29.7||21||cm##
      Orientacion=H##
      Ocultar=4||##
      OrderBy=NombreCampania#A||##
      UserId=5325##
      PEXT_Query=##
      PEXT_TipoSalidaRep=0##
      PEXT_WS=1||##
      RDLC_RowsByPage=-1##
      PEXT_MaxRow=15000##
      RDLC_FormInt=0##
      RDLC_Culture=es-AR##
      RDLC_strDateFormat=dd/MM/yyyy##
      PEXT_FechaRango=-2##
      PEXT_idEmpresa=1007||##
      PEXT_idCamp=-1##
      RDLC_PorInt=1##
      RDLC_AgrupadoPor=1##
      HIDD_fromExecuteSQL=##
      brw=Chrome##
      brwver=81##`;

  var aber = await getMitrol(wsParameter);
  var result = convert.xml2json(aber, { compact: true });
  var json = JSON.parse(result);



  res.send(json.DataSet["diffgr:diffgram"].NewDataSet.Table1);
});

app.use("/v1", require("./routes/v1"));
app.use("/test", require("./routes/test"));
