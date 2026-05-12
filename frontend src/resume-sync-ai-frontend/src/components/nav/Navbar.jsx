import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react'; // Assuming you're using Lucide icons

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-transparent backdrop-blur-md fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-2xl font-bold text-white">
          ResumeSync-AI
        </Link>
        <div className="flex space-x-4">
          <Link to="/" className="text-white hover:text-blue-400 transition duration-300">Home</Link>
          <Link to="/upload" className="text-white hover:text-blue-400 transition duration-300">Upload</Link>
          <Link to="/analyze" className="text-white hover:text-blue-400 transition duration-300">Analyze</Link>
          <Link to="/interview-prep" className="text-white hover:text-blue-400 transition duration-300">Interview Prep</Link>
          <Link to="/profile" className="text-white hover:text-blue-400 transition duration-300">Profile</Link>
          {isAuthenticated ? (
            <button onClick={logout} className="text-white hover:text-red-400 transition duration-300">Logout</button>
          ) : (
            <Link to="/login" className="text-white hover:text-blue-400 transition duration-300">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;