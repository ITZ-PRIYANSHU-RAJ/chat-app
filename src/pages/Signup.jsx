import React, { useState, useEffect } from "react";
import API from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { motion } from "framer-motion";
import anime from "animejs";

export default function Signup() {

  useEffect(() => {
    anime({
      targets: ".signup-box",
      scale: [0.9, 1],
      opacity: [0, 1],
      duration: 600,
      easing: "easeOutQuad",
    });
  }, []);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password)
      return setError("All fields are required");

    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout title="Create Account 💫">
      {/* Animated Box */}
      <div className="signup-box">
        <form onSubmit={submit} className="space-y-5">
          {error && (
            <p className="bg-red-500/80 text-white p-3 rounded-lg text-sm text-center">
              {error}
            </p>
          )}

          <motion.input
            whileFocus={{ scale: 1.03 }}
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <motion.input
            whileFocus={{ scale: 1.03 }}
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <motion.input
            whileFocus={{ scale: 1.03 }}
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="w-full p-3 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg"
          >
            Sign Up
          </motion.button>

          <p className="text-center text-white/90">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-white underline">
              Login
            </Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  );
}
