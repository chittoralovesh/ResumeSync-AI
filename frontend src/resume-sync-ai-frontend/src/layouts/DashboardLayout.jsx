import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/nav/Navbar';
import { AnimatedBackground } from '../animations/AnimatedBackground';

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;