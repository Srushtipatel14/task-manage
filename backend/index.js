require("dotenv").config();

const http = require("http");
const { app, setSocket } = require("./src/app");
const connectDB = require("./src/config/dbconn");
const { initSocket } = require("./src/socket/socket");

const PORT = process.env.PORT || 8000;
connectDB();
const server = http.createServer(app);

const io = initSocket(server);
setSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});