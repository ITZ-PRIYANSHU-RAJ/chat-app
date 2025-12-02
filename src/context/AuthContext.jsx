import React, { createContext, useEffect, useState } from "react";
import { socket } from "../socket";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("chat_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("chat_access") || null);

  useEffect(() => {
    if (user && token) {
      socket.auth = { userId: user.id };
      socket.connect();
      socket.emit("addUser", user.id);
    } else {
      if (socket.connected) socket.disconnect();
    }
    // cleanup on unmount
    return () => {
      if (socket.connected) socket.disconnect();
    };
  }, [user, token]);

  const login = ({ user: u, accessToken, refreshToken }) => {
    localStorage.setItem("chat_user", JSON.stringify(u));
    localStorage.setItem("chat_access", accessToken);
    localStorage.setItem("chat_refresh", refreshToken);
    setUser(u);
    setToken(accessToken);
  };

  const logout = async () => {
    const refresh = localStorage.getItem("chat_refresh");
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refresh })
      });
    } catch (e) {
      // ignore network errors
    }
    localStorage.removeItem("chat_user");
    localStorage.removeItem("chat_access");
    localStorage.removeItem("chat_refresh");
    setUser(null);
    setToken(null);
    if (socket.connected) socket.disconnect();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
