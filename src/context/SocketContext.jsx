import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const onOnline = (list) => setOnlineUsers(list);
    socket.on("onlineUsers", onOnline);
    socket.on("connect", () => console.log("socket connected", socket.id));
    socket.on("disconnect", () => console.log("socket disconnected"));
    return () => {
      socket.off("onlineUsers", onOnline);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
