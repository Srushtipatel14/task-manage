import { io } from "socket.io-client";
import Cookies from "js-cookie";

const user = JSON.parse(Cookies.get("logged_user") || "{}");

export const socket = io("http://localhost:8000", {
  autoConnect: true,
  withCredentials: true,
  auth: {
    userId: user.id,
  },
});