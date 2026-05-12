import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Award, BarChart2, Activity, Clock } from 'lucide-react';
import axios from 'axios';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { usercontext } from '../appcontext';

export default function Dashboard() {
  const { serviceURL } = useContext(usercontext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`${serviceURL}/dashboard-stats`, {
          withCredentials: true
        });
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, [serviceURL]);

  if (loading) {
    return <div style={{ color: 'var(--neon-blue)', textAlign: 'center', marginTop: '10rem', fontSize: '1.2rem', fontWeight: 'bold' }}>Syncing Neural Link...</div>;
  }

  // Create real data or fallback
  const chartData = [
    { name: 'Prev', score: stats?.latestScore > 10 ? stats.latestScore - 10 : 0 },
    { name: 'Last', score: stats?.latestScore > 5 ? stats.latestScore - 5 : 0 },
    { name: 'Now', score: stats?.latestScore || 0 },
  ];

  const activities = stats?.recentActivities || [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '2rem' }}>
      
      <motion.h1 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="gradient-text" 
        style={{ fontSize: '2.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <LayoutDashboard color="var(--neon-blue)" size={36} /> Intelligence Hub
      </motion.h1>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Latest Synergy Score</h3>
            <Award color="var(--neon-blue)" />
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0', color: 'var(--neon-blue)' }}>
            {stats?.latestScore || 0}%
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>ATS Optimization</h3>
            <TrendingUp color="var(--neon-purple)" />
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0', color: 'var(--neon-purple)' }}>
            {stats?.latestAtsScore || 0}%
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Total Documents Analyzed</h3>
            <BarChart2 color="#ff007f" />
          </div>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', margin: '1rem 0', color: '#ff007f' }}>
            {stats?.totalResumesAnalyzed || 0}
          </div>
        </motion.div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* Trend Graph */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card" style={{ flex: 2 }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--neon-blue)"/> Performance Trend
          </h2>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--neon-blue)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--neon-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: '#fff'}} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: '#fff'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(20,20,25,0.9)', border: '1px solid var(--neon-blue)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: 'var(--neon-blue)' }} 
                />
                <Area type="monotone" dataKey="score" stroke="var(--neon-blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card" style={{ flex: 1, maxHeight: '400px', overflowY: 'auto' }}>
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--neon-purple)"/> Neural Activity Log
          </h2>
          {activities.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No activities logged yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activities.map((act, idx) => {
                const date = new Date(act.timestamp);
                return (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--neon-purple)', boxShadow: '0 0 10px var(--neon-purple)' }}></div>
                      {idx !== activities.length -1 && <div style={{ flex: 1, width: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '5px' }}></div>}
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#fff', fontWeight: '600', fontSize: '0.95rem' }}>{act.activityType.replace('_', ' ')}</p>
                      <p style={{ margin: '0.2rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{act.details}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--neon-blue)' }}>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

      </div>
    </motion.div>
  );
}
