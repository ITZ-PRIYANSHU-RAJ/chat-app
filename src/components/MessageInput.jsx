import React, { useState } from "react";
import { motion } from "framer-motion";

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <form onSubmit={submit} className="p-4 border-t flex items-center gap-2">
      <input
        value={text}
        onChange={e=>setText(e.target.value)}
        placeholder="Say something..."
        className="flex-1 p-3 rounded-full border focus:outline-none"
      />
      <motion.button whileTap={{ scale: 0.95 }} className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Send</motion.button>
    </form>
  );
};

export default MessageInput;
