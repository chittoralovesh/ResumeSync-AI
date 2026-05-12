import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, Target, FileSignature, User, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard',       icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Optimize Resume', icon: <FileText size={20} />,        path: '/optimize-resume' },
    { name: 'Interview Prep',  icon: <MessageSquare size={20} />,   path: '/interview-prep' },
    { name: 'Interview Guide', icon: <BookOpen size={20} />,        path: '/interview-guide' },
    { name: 'Skill Gap',       icon: <Target size={20} />,          path: '/skill-gap' },
    { name: 'Cover Letter',    icon: <FileSignature size={20} />,   path: '/cover-letter' },
    { name: 'Profile',         icon: <User size={20} />,            path: '/profile' }
  ];

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      style={{
        width: '250px',
        height: '100vh',
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'fixed',
        left: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem 1rem',
        zIndex: 100
      }}
    >
      <h2 style={{ 
        background: 'linear-gradient(90deg, #00f3ff, #9d4edd)', 
        WebkitBackgroundClip: 'text', 
        WebkitTextFillColor: 'transparent',
        marginBottom: '3rem',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        ResumeSync-AI
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item, index) => (
          <NavLink 
            key={index}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              color: isActive ? '#fff' : 'var(--text-muted)',
              background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              border: isActive ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
              transition: 'all 0.3s ease',
              fontWeight: isActive ? '600' : '400',
              boxShadow: isActive ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none'
            })}
            className="sidebar-link"
          >
            <span style={{ color: 'inherit' }}>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </motion.div>
  );
}
