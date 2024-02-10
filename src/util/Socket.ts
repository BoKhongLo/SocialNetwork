import { io } from "socket.io-client";

export function getSocketIO (accessToken : string) {
    const socket = io("http://103.155.161.116:3434", {
        transportOptions: {
          polling: {
            extraHeaders: { Authorization: `Bearer ${accessToken}` }
          }
        }
      })
    return socket;
};