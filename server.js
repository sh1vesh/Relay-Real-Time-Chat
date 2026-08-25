const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const rooms = { general: [], development: [], college: [], random: [] };
const users = new Map();

function systemMessage(text) {
  return { id: `system-${Date.now()}-${Math.random()}`, type: "system", username: "Relay", text, timestamp: new Date().toISOString() };
}
function userList(room) {
  return [...users.values()].filter(u => u.room === room).map(u => ({ id: u.id, username: u.username }));
}
function roomStats() {
  return Object.keys(rooms).reduce((acc, room) => { acc[room] = userList(room).length; return acc; }, {});
}
function emitRoomState(room) {
  io.to(room).emit("room-users", userList(room));
  io.emit("room-stats", roomStats());
}

io.on("connection", socket => {
  socket.emit("room-stats", roomStats());

  socket.on("join-room", ({ username, room }) => {
    const cleanUsername = String(username || "").trim().slice(0, 24);
    const cleanRoom = rooms[room] ? room : "general";
    if (!cleanUsername) return;

    const previous = users.get(socket.id);
    if (previous) {
      socket.leave(previous.room);
      socket.to(previous.room).emit("message", systemMessage(`${previous.username} left the room.`));
      emitRoomState(previous.room);
    }

    const user = { id: socket.id, username: cleanUsername, room: cleanRoom };
    users.set(socket.id, user);
    socket.join(cleanRoom);
    socket.emit("joined-room", user);
    socket.emit("message-history", rooms[cleanRoom]);
    socket.to(cleanRoom).emit("message", systemMessage(`${cleanUsername} joined the room.`));
    emitRoomState(cleanRoom);
  });

  socket.on("send-message", text => {
    const user = users.get(socket.id);
    if (!user) return;
    const cleanText = String(text || "").trim().slice(0, 1000);
    if (!cleanText) return;
    const message = { id: `${socket.id}-${Date.now()}`, type: "user", username: user.username, text: cleanText, timestamp: new Date().toISOString() };
    rooms[user.room].push(message);
    if (rooms[user.room].length > 100) rooms[user.room] = rooms[user.room].slice(-100);
    io.to(user.room).emit("message", message);
  });

  socket.on("typing-start", () => {
    const user = users.get(socket.id);
    if (user) socket.to(user.room).emit("typing", { id: socket.id, username: user.username, typing: true });
  });
  socket.on("typing-stop", () => {
    const user = users.get(socket.id);
    if (user) socket.to(user.room).emit("typing", { id: socket.id, username: user.username, typing: false });
  });
  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (!user) return;
    users.delete(socket.id);
    socket.to(user.room).emit("message", systemMessage(`${user.username} went offline.`));
    emitRoomState(user.room);
  });
});

server.listen(PORT, () => console.log(`Relay running on http://localhost:${PORT}`));
