const setupCanvas = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.getElementById("game").appendChild(canvas);
  return { canvas, ctx };
};

const getUsername = () => localStorage.getItem("eth0a_username");

const { canvas, ctx } = setupCanvas();

const socket = io();

// other players
let players = [];

const player = {
  name: getUsername(),
  x: canvas.width / 2,
  y: canvas.height / 2,
  vel: {
    x: 0,
    y: 0,
  },
  color: ["red", "green", "blue", "yellow"][Math.floor(Math.random() * 4)],
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const entities = [...players, player];
  entities.forEach((entity) => {
    ctx.fillStyle = entity.color;
    ctx.fillRect(entity.x, entity.y, 40, 40);
    ctx.fillText(entity.name, entity.x, entity.y);
  });
};

const setupInputListeners = () => {
  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowLeft":
        player.vel = { x: -5, y: 0 };
        break;
      case "ArrowUp":
        player.vel = { x: 0, y: -5 };
        break;
      case "ArrowRight":
        player.vel = { x: 5, y: 0 };
        break;
      case "ArrowDown":
        player.vel = { x: 0, y: 5 };
        break;
    }
  });
};

const movePlayer = (player) => {
  player.x = player.x + player.vel.x;
  player.y = player.y + player.vel.y;
  // decelerate
  player.vel.x = player.vel.x * 0.9;
  player.vel.y = player.vel.y * 0.9;
};

socket.on("sync:players", (entities) => {
  console.log("sync players");
  console.log(players);
  players = entities.filter((entity) => entity.name !== player.name);
});

setupInputListeners();

(function loop() {
  socket.emit("sync:player", player);
  draw();
  [...players, player].forEach(movePlayer);
  requestAnimationFrame(loop);
})();
