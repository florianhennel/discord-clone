import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const serverUrl = "https://d1xppr12-3000.euw.devtunnels.ms/";

let socket: Socket | null = null;

export const initSocket = () => {
  
  const authToken = localStorage.getItem("token");

  if (!authToken) {
    const navigate = useNavigate();  
    return navigate('/login');
  }

  socket = io(serverUrl, {
    autoConnect: false,
    auth: { token: authToken },
  });

  socket.onAny((event, ...args) => {
    console.log(`Received event: ${event}`, args);
  });
};

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export default socket;
