import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Trash2, Award, Shield, Zap } from 'lucide-react';
import { usercontext } from '../appcontext';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Profile() {
  const { setisauthenticated, serviceURL, username } = useContext(usercontext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`${serviceURL}/dashboard-stats`, {
          withCredentials: true
        });
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      }
    };
    fetchDashboardStats();
  }, [serviceURL]);

  const handleLogout = async () => {
    try {
      await axios.post(`${serviceURL}/logout`, {}, { withCredentials: true });
      setisauthenticated(false);
      window.location.href = "/";
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await axios.post(`${serviceURL}/deleteAccount`, {}, { withCredentials: true });
        setisauthenticated(false);
        window.location.href = "/";
      } catch (err) {
        toast.error('Delete account failed');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Profile Info */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
          style={{ flex: '1 1 300px', textAlign: 'center' }}
        >
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))', margin: '0 auto 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 20px rgba(0,243,255,0.4)' }}>
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: '#000' }}>
              {username ? username[0].toUpperCase() : <User size={40} color="#000" />}
            </span>
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{username || 'Neural User'}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Premium SaaS Member</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="neon-btn neon-btn-purple" onClick={handleLogout} style={{ width: '100%', padding: '1rem' }}>
              <LogOut size={18} /> Disconnect Session
            </button>
            
            <button className="neon-btn" style={{ borderColor: 'rgba(255, 77, 77, 0.5)', color: '#ff4d4d', padding: '1rem' }} onClick={handleDelete}>
              <Trash2 size={18} /> Purge Account Data
            </button>
          </div>
        </motion.div>

        {/* Stats & Badges */}
        <div style={{ flex: '2 1 500px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={24} color="var(--neon-blue)" /> Career Statistics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total Analyzed</h3>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--neon-blue)' }}>{stats?.totalResumesAnalyzed || 0}</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>High Score</h3>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--neon-purple)' }}>{stats?.latestScore || 0}%</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Activities Logged</h3>
                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff007f' }}>{stats?.recentActivities?.length || 0}</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={24} color="var(--neon-purple)" /> Earned Badges
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: stats?.latestScore > 70 ? 1 : 0.3 }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0, 243, 255, 0.1)', border: '2px solid var(--neon-blue)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Award color="var(--neon-blue)" size={30} />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Top Applicant</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', opacity: stats?.totalResumesAnalyzed > 2 ? 1 : 0.3 }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(157, 78, 221, 0.1)', border: '2px solid var(--neon-purple)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Zap color="var(--neon-purple)" size={30} />
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Power User</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}
