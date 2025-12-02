import React, { useEffect, useRef, useState, useContext } from "react";
import API from "../services/api";
import { useSocket } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import MessageInput from "./MessageInput";
import { motion } from "framer-motion";

const ChatWindow = ({ currentUser, peer }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef();

  useEffect(() => {
    if (!peer) return;
    // load history
    (async () => {
      const res = await API.get(`/messages/${peer.id}`);
      setMessages(res.data);
    })();
  }, [peer]);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      // If message payload uses sender/receiver or createdAt adjust as needed
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off("receiveMessage");
  }, [socket]);

  useEffect(()=> bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const sendMessage = async (text) => {
    const payload = { senderId: currentUser.id, receiverId: peer.id, message: text };
    // emit socket realtime
    socket.emit("sendMessage", payload);
    // persist via API fallback
    await API.post("/messages/send", { receiver: peer.id, message: text });
    setMessages(prev => [...prev, { ...payload, createdAt: new Date().toISOString() }]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <div className="font-semibold">{peer.name}</div>
          <div className="text-sm text-gray-500">{peer.email}</div>
        </div>
        <div className="text-sm text-gray-400">Active</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 chat-scroll">
        {messages.map((m, i) => {
          const mine = String(m.sender || m.senderId) === String(currentUser.id);
          return (
            <div key={i} className={`mb-3 flex ${mine ? "justify-end" : "justify-start"}`}>
              <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} className={mine ? "my-msg":"their-msg"}>
                <div className="text-sm">{m.message}</div>
                <div className="text-xs text-gray-300 mt-1">{new Date(m.createdAt || Date.now()).toLocaleTimeString()}</div>
              </motion.div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={sendMessage} />
    </div>
  );
};

export default ChatWindow;
