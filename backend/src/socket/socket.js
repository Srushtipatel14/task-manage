// src/socket/socket.js

const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("New socket connected");

    socket.on("join", (userId) => {
      console.log("JOIN EVENT USER:", userId);

      if (userId) {
        socket.join(userId.toString());
        console.log("User joined room:", userId);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = { initSocket, getIO };