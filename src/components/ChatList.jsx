import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";

const ChatList = ({ onSelect, selected }) => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data.filter(u => u.id !== user.id));
      } catch (e) { console.error(e); }
    })();
  }, [user]);

  return (
    <div className="p-3 space-y-2">
      {users.map(u => (
        <motion.div
          key={u.id}
          onClick={() => onSelect(u)}
          whileHover={{ scale: 1.02 }}
          className={`p-3 rounded-lg cursor-pointer ${selected?.id===u.id ? "bg-purple-50" : "hover:bg-gray-50"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-xs text-gray-500">{u.email}</div>
            </div>
            <div className="text-xs text-gray-400">online</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ChatList;
