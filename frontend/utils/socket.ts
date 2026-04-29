import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket && typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("logged_user") || "{}");

    socket = io("http://localhost:8000", {
      autoConnect: true,
      withCredentials: true,
      auth: {
        userId: user?.id,
      },
    });
  }

  return socket;
};