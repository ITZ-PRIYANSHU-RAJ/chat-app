import React, { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { motion } from "framer-motion";

import anime from "animejs";



export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password)
      return setError("All fields are required");

    try {
      const res = await API.post("/auth/login", form);
      login({
        user: res.data.user,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken
      });
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  useEffect(() => {
    anime({
        targets: ".login-box",
        translateY: [-50, 0],
        opacity: [0, 1],
        duration: 600,
        easing: "easeOutExpo"
    });
}, []);

  return (
    <AuthLayout title="Welcome Back ✨">
      <form onSubmit={submit} className="space-y-5">

        {error && (
          <p className="bg-red-500/80 text-white p-3 rounded-lg text-sm text-center">
            {error}
          </p>
        )}

        <motion.input
          whileFocus={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200 }}
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <motion.input
          whileFocus={{ scale: 1.03 }}
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-full p-3 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg"
        >
          Login
        </motion.button>

        <p className="text-center text-white/90">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-white underline">
            Sign Up
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}
