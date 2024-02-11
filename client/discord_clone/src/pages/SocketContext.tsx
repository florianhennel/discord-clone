// SocketContext.tsx
import React, { createContext, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const serverUrl = "https://jh4pgfv0-3000.euw.devtunnels.ms"; // Replace with your Socket.io server URL
  const socket = io(serverUrl, {
    autoConnect: false,
  });

  useEffect(() => {
    // Check if the user is already authenticated (e.g., token exists in local storage)
    const authToken = localStorage.getItem("token");

    if (authToken) {
      // Initialize the socket with the token
      socket.auth = { token: authToken };
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = (): Socket | null => {
  return useContext(SocketContext);
};
