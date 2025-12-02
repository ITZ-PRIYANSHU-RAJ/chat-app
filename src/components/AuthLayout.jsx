import React from "react";
import { motion } from "framer-motion";

export default function AuthLayout({ children, title }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/20"
      >
        <h1 className="text-4xl font-semibold text-center text-white mb-8 drop-shadow-md">
          {title}
        </h1>

        {children}
      </motion.div>
    </div>
  );
}
