import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import anime from "animejs";


import dayjs from "dayjs";

const socket = io("http://localhost:5000", { autoConnect: false });

export default function ChatPage({ userId }) {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);

    const messageEndRef = useRef(null);

    // Auto Scroll
    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        socket.connect();
        socket.emit("join-user", userId);

        socket.on("online-users", (list) => setUsers(list));

        socket.on("typing", ({ from }) => {
            if (from === selectedUser?._id) {
                setTyping(true);
                setTimeout(() => setTyping(false), 1500);
            }
        });

        socket.on("receive-msg", (msg) => {
            setMessages((prev) => [...prev, msg]);
            animateMessage();
        });

        return () => socket.disconnect();
    }, [selectedUser]);

    // Message Animation using anime.js
    const animateMessage = () => {
        anime({
            targets: ".msg-bubble",
            scale: [0.9, 1],
            opacity: [0, 1],
            duration: 300,
            easing: "easeOutQuad",
        });
    };

    // Fetch chat
    const openChat = async (partner) => {
        setSelectedUser(partner);

        const res = await fetch(`http://localhost:5000/api/chat/messages/${userId}/${partner._id}`);
        const data = await res.json();

        setMessages(data.messages || []);
        setTimeout(animateMessage, 100); 
    };

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        socket.emit("send-msg", {
            from: userId,
            to: selectedUser._id,
            message: newMessage,
            timestamp: new Date(),
        });

        setMessages((prev) => [...prev, {
            from: userId,
            to: selectedUser._id,
            message: newMessage,
            timestamp: new Date(),
            self: true,
        }]);

        setNewMessage("");
        animateMessage();
    };

    const handleTyping = () => {
        socket.emit("typing", { to: selectedUser?._id, from: userId });
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">

            {/* LEFT SIDEBAR (USERS LIST) */}
            <div className="w-1/4 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
                <h2 className="text-xl font-bold mb-4 tracking-wide">Chats</h2>

                {users.map((u) => (
                    <div
                        key={u._id}
                        onClick={() => openChat(u)}
                        className={`p-3 rounded-xl cursor-pointer mb-2 transition-all duration-300 ${
                            selectedUser?._id === u._id ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
                        }`}
                    >
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-sm text-green-300">Online</p>
                    </div>
                ))}
            </div>

            {/* RIGHT CHAT AREA */}
            <div className="w-3/4 flex flex-col">

                {/* Chat Header */}
                {selectedUser && (
                    <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
                        <div>
                            <p className="font-bold">{selectedUser.name}</p>
                            <p className="text-green-400 text-sm">Online</p>
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`msg-bubble max-w-xs p-3 rounded-xl text-white ${
                                msg.from === userId ? "bg-blue-600 ml-auto" : "bg-gray-700"
                            }`}
                        >
                            <p>{msg.message}</p>
                            <p className="text-xs text-gray-300 mt-1">
                                {dayjs(msg.timestamp).format("hh:mm A")}
                            </p>
                        </div>
                    ))}

                    {typing && (
                        <p className="text-gray-400 italic">Typing...</p>
                    )}

                    <div ref={messageEndRef}></div>
                </div>

                {/* Input */}
                {selectedUser && (
                    <div className="p-4 bg-gray-800 flex items-center gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleTyping}
                            className="flex-1 p-3 bg-gray-700 rounded-xl outline-none"
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-blue-600 px-5 py-2 rounded-xl hover:bg-blue-700 transition-all"
                        >
                            Send
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
