import React from 'react';
import Hero from '../components/hero/Hero';
import AnimatedBackground from '../animations/AnimatedBackground';
import { motion } from 'framer-motion';

const Landing = () => {
  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Hero />
        <div className="flex flex-col items-center justify-center text-center py-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome to ResumeSync-AI
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Your AI-powered assistant for crafting the perfect resume.
          </p>
          <a href="/login" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            Get Started
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;