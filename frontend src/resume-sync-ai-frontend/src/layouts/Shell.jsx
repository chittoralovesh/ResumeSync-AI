import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/nav/Navbar';
import AnimatedBackground from '../animations/AnimatedBackground';

const Shell = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Shell;