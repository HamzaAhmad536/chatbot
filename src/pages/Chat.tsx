import React, { useEffect } from "react";
import Chatbot from "../components/Chatbot";
import { motion } from "framer-motion";

const Chat: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blush via-pink to-lavender flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl px-6 py-10 flex flex-col items-center mt-4"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-pink-700 mb-4 text-center tracking-tight drop-shadow-lg font-serif uppercase">
          Halawa Wax
        </h1>
        <h3 className="text-2xl font-bold text-pink mb-2 text-center">Live Chat</h3>
        <p className="text-lg text-dark mb-6 text-center">Chat instantly with our AI beauty assistant for product advice, bookings, and more.</p>
        <div className="w-full">
          <Chatbot />
        </div>
      </motion.div>
    </div>
  );
};

export default Chat; 