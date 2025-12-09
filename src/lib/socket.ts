import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

export const socket = io(`${SOCKET_URL}/admin`, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};