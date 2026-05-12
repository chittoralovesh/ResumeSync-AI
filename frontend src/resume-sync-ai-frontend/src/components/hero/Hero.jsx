import React from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../../hooks/useCursor';
import './Hero.css'; // Assuming you have a CSS file for additional styling

const Hero = () => {
  const { cursorType, setCursorType } = useCursor();

  return (
    <section className="relative flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-blue-500 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Animated Background Component */}
        <AnimatedBackground />
      </div>
      <div className="relative z-10 text-center">
        <motion.h1
          className="text-6xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Transform Your Career with AI
        </motion.h1>
        <motion.p
          className="text-xl text-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Get personalized resume insights and interview preparation tools.
        </motion.p>
        <motion.button
          className="bg-white text-purple-600 font-semibold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          onMouseEnter={() => setCursorType('hover')}
          onMouseLeave={() => setCursorType('default')}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Get Started
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;