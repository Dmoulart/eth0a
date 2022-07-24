const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Setup socket.Io
const { Server } = require("socket.io");

app.use(express.static("public"));

// Give access socket io code client side
app.get("/socket.io/socket.io.js", (req, res) => {
  res.sendFile(__dirname + "/node_modules/socket.io/client-dist/socket.io.js");
});

app.get("/", (req, res) => {
  res.status(200).sendFile(__dirname + "/views/index.html");
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const io = new Server(server);

const players = {};

io.on("connection", (socket) => {
  let player;
  console.log("a user connected");

  socket.on("chat:message", ({ username, msg }) => {
    console.log("message: " + msg + " user: " + username);
    io.emit("chat:message", { username, msg });
  });

  socket.on("sync:player", (playerData) => {
    player = playerData;
    players[player.name] = playerData;
  });

  setInterval(() => {
    socket.emit("sync:players", Object.values(players));
  }, 1000 / 60);

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (player) {
      delete players[player.name];
    }
  });
});
