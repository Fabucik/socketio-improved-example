const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket) => {
  socket.on("usercon", (nickname) => {
    io.emit("usercon", socket.id, nickname);
  });
  socket.on('chat message', (nickname, msg) => {
    io.emit("chat message", nickname, msg);
  });
  socket.on("typing", (istyping, nick) => {
    io.emit("typing", istyping, socket.id, nick);
  })
});

server.listen(3000, () => {
  console.log("listening on 3000");
});
