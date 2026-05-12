import React from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', width: '100vw', minHeight: '100vh', overflowX: 'hidden' }}>
      <Sidebar />
      <div style={{ 
        flex: 1, 
        marginLeft: '250px', 
        padding: '2rem', 
        position: 'relative',
        minHeight: '100vh'
      }}>
        {/* Global Animated Background for Dashboard */}
        <div className="animated-bg" style={{ zIndex: -1 }}>
          <div className="gradient-mesh"></div>
        </div>
        
        {/* Main Content Area */}
        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
