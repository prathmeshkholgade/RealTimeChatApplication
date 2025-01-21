import { io } from "socket.io-client";
let socketInstance = null;

export const connectSocket = (id) => {
  socketInstance = io(import.meta.env.VITE_BASE_URL, {
    withCredentials: true,
    query: { projectId: id },
  });

  return socketInstance;
};
export const receiveMessage = (eventName, cb) => {
  socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
  socketInstance.emit(eventName, data);
};
