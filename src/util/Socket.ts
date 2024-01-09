import { io } from "socket.io-client";

export function getSocketIO (accessToken : string) {
    const socket = io("http://103.144.87.14:3434", {
        transportOptions: {
          polling: {
            extraHeaders: { Authorization: `Bearer ${accessToken}` }
          }
        }
      })
    return socket;
};