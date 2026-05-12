import React, { useContext, useEffect, useState } from "react";
import { usercontext } from "../appcontext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSearch, Target, MessageSquare, TrendingUp, FileSignature,
  Sparkles, ArrowRight, User, LogOut, Trash2, Rocket, Brain,
  ChevronRight, Zap
} from 'lucide-react';

/* ── Logo SVG mark ── */
const LogoMark = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hexG" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00f3ff" />
        <stop offset="1" stopColor="#9d4edd" />
      </linearGradient>
    </defs>
    {/* Hexagon */}
    <path d="M20 1.5L36.5 11V29L20 38.5L3.5 29V11L20 1.5Z"
      fill="url(#hexG)" fillOpacity="0.12" stroke="url(#hexG)" strokeWidth="1.2" />
    {/* Spokes */}
    <line x1="20" y1="20" x2="20" y2="9.5"  stroke="rgba(0,243,255,0.45)" strokeWidth="0.9" />
    <line x1="20" y1="20" x2="29" y2="14.75" stroke="rgba(0,243,255,0.45)" strokeWidth="0.9" />
    <line x1="20" y1="20" x2="29" y2="25.25" stroke="rgba(157,78,221,0.45)" strokeWidth="0.9" />
    <line x1="20" y1="20" x2="20" y2="30.5"  stroke="rgba(157,78,221,0.45)" strokeWidth="0.9" />
    <line x1="20" y1="20" x2="11" y2="25.25" stroke="rgba(0,243,255,0.45)" strokeWidth="0.9" />
    <line x1="20" y1="20" x2="11" y2="14.75" stroke="rgba(0,243,255,0.45)" strokeWidth="0.9" />
    {/* Outer nodes */}
    <circle cx="20"  cy="9.5"  r="1.6" fill="#9d4edd" />
    <circle cx="29"  cy="14.75" r="1.6" fill="#00f3ff" />
    <circle cx="29"  cy="25.25" r="1.6" fill="#9d4edd" />
    <circle cx="20"  cy="30.5" r="1.6" fill="#00f3ff" />
    <circle cx="11"  cy="25.25" r="1.6" fill="#9d4edd" />
    <circle cx="11"  cy="14.75" r="1.6" fill="#00f3ff" />
    {/* Center node */}
    <circle cx="20" cy="20" r="3" fill="#00f3ff" />
    <circle cx="20" cy="20" r="5" fill="rgba(0,243,255,0.15)" />
  </svg>
);

/* ── Feature data ── */
const FEATURES = [
  {
    icon: <FileSearch size={22} />,
    title: 'ATS Resume Scan',
    desc: 'AI scores your resume against ATS systems and delivers precise improvement actions.',
    color: '#00f3ff',
    label: 'Core',
  },
  {
    icon: <Target size={22} />,
    title: 'JD Match Analysis',
    desc: 'Deep comparison of your resume vs any job description with a granular match score.',
    color: '#9d4edd',
    label: 'Smart',
  },
  {
    icon: <MessageSquare size={22} />,
    title: 'Mock Interview AI',
    desc: 'Practice with an AI interviewer that evaluates your answers in real time.',
    color: '#00d084',
    label: 'Live',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Skill Gap Map',
    desc: 'Uncover missing skills and get a personalized learning roadmap to close gaps.',
    color: '#ff6b35',
    label: 'Roadmap',
  },
  {
    icon: <FileSignature size={22} />,
    title: 'Cover Letters',
    desc: 'AI-tailored, role-specific cover letters generated in seconds.',
    color: '#ffd700',
    label: 'AI',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const {
    islogged, username, isprevious, serviceURL,
    setusername, setislogged, setisprevious,
  } = useContext(usercontext);

  const [isshow, setshow] = useState(false);
  const [isloading, setisloading] = useState(false);
  const [delloading, setdelloading] = useState(false);

  useEffect(() => {
    const fn = (e) => { if (!e.target.closest('#menu-container')) setshow(false); };
    window.addEventListener('click', fn);
    return () => window.removeEventListener('click', fn);
  }, []);

  const logout = () => {
    setisloading(true);
    fetch(`${serviceURL}/logout`, { method: 'post', credentials: 'include' })
      .then(r => {
        if (r.ok) {
          setusername(''); setislogged(false); setisprevious(false);
          toast.success('Successfully Logged Out');
          navigate('/login');
        } else toast.error('Unauthorized access');
        setisloading(false);
      })
      .catch(() => { toast.error('Logout failed'); setisloading(false); });
  };

  const delaccount = () => {
    setdelloading(true);
    fetch(`${serviceURL}/deleteAccount`, { method: 'post', credentials: 'include' })
      .then(r => {
        if (r.ok) {
          setislogged(false); setusername(''); setisprevious(false);
          document.getElementById('confirmdivdel').style.display = 'none';
          navigate('/login');
          toast.success('Account Deleted Successfully');
        } else toast.error("Couldn't delete account.");
        setdelloading(false);
      })
      .catch(() => { toast.error('Network Error'); setdelloading(false); });
  };

  const upnavigate = () => navigate(islogged ? '/uploaddoc' : '/login');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        padding: '1.4rem 3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 50,
        position: 'relative',
        borderBottom: '1px solid rgba(255,255,255,0.045)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}>
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <LogoMark size={38} />
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fff',
            lineHeight: 1,
          }}>
            Resume<span style={{ color: '#00f3ff' }}>Sync</span>
            <sup style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.6rem',
              fontWeight: 700,
              color: '#9d4edd',
              letterSpacing: '0.06em',
              marginLeft: '2px',
              verticalAlign: 'super',
            }}>AI</sup>
          </span>
        </motion.div>

        {/* Auth area */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {!islogged ? (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="neon-btn" style={{ padding: '0.6rem 1.6rem', fontSize: '0.875rem' }}>
                Log In <ChevronRight size={15} />
              </button>
            </Link>
          ) : (
            <div id="menu-container" style={{ position: 'relative' }}>
              <div
                onClick={() => setshow(!isshow)}
                style={{
                  width: 42, height: 42,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f3ff22, #9d4edd22)',
                  border: '1.5px solid rgba(0,243,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800, fontSize: '1.1rem',
                  color: '#00f3ff',
                  boxShadow: '0 0 18px rgba(0,243,255,0.2)',
                  transition: 'all 0.25s ease',
                }}
              >
                {username ? username[0].toUpperCase() : <User size={18} />}
              </div>

              <AnimatePresence>
                {isshow && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="glass-card"
                    style={{ position: 'absolute', top: 54, right: 0, width: 230, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 200 }}
                  >
                    <div style={{ textAlign: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#00f3ff' }}>{username}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Signed in</p>
                    </div>
                    <button onClick={() => navigate('/dashboard')} className="neon-btn" style={{ fontSize: '0.85rem', padding: '0.55rem', width: '100%' }}>
                      Dashboard
                    </button>
                    <button onClick={logout} disabled={isloading} className="neon-btn" style={{ fontSize: '0.85rem', padding: '0.55rem', width: '100%', borderColor: 'var(--text-muted)', color: 'var(--text-muted)' }}>
                      <LogOut size={14} /> Log Out
                    </button>
                    <button
                      onClick={() => document.getElementById('confirmdivdel').style.display = 'flex'}
                      className="neon-btn"
                      style={{ fontSize: '0.85rem', padding: '0.55rem', width: '100%', borderColor: '#ff4d4d', color: '#ff4d4d' }}
                    >
                      <Trash2 size={14} /> Delete Account
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(4rem,10vh,7rem) 2rem 3rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
      }}>

        {/* Decorative floating orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }}>
          <div style={{
            position: 'absolute', width: 600, height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,243,255,0.055) 0%, transparent 65%)',
            top: '-10%', right: '-8%',
            filter: 'blur(60px)',
            animation: 'orbFloat1 16s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute', width: 700, height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(157,78,221,0.05) 0%, transparent 65%)',
            bottom: '-15%', left: '-10%',
            filter: 'blur(80px)',
            animation: 'orbFloat2 20s ease-in-out infinite',
          }} />
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(0,243,255,0.07)',
            border: '1px solid rgba(0,243,255,0.22)',
            borderRadius: 30,
            padding: '0.42rem 1.1rem',
            fontSize: '0.8rem',
            color: '#00f3ff',
            fontWeight: 600,
            letterSpacing: '0.04em',
            marginBottom: '2.2rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Sparkles size={12} />
          Designed for the next generation of careers
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(3rem, 7.5vw, 6rem)',
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: '-0.035em',
            marginBottom: '1.5rem',
            color: '#f0f2f8',
          }}
        >
          Your AI-Powered<br />
          <span style={{
            background: 'linear-gradient(90deg, #00f3ff 0%, #9d4edd 55%, #b060ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Career Accelerator
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.22rem)',
            color: 'var(--text-muted)',
            maxWidth: 580,
            lineHeight: 1.7,
            marginBottom: '2.8rem',
            fontWeight: 400,
          }}
        >
          Upload your resume and let our advanced AI optimize your profile,
          match job descriptions, close skill gaps, and prep you for interviews
          — all in one place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button
            onClick={upnavigate}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
              padding: '0.95rem 2.4rem',
              borderRadius: 40,
              border: 'none',
              background: 'linear-gradient(135deg, #00f3ff, #7b2ff7)',
              color: '#fff',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              letterSpacing: '0.01em',
              boxShadow: '0 0 40px rgba(0,243,255,0.3), 0 4px 24px rgba(0,0,0,0.4)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='scale(1.05) translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 60px rgba(0,243,255,0.45), 0 8px 32px rgba(0,0,0,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='scale(1) translateY(0)'; e.currentTarget.style.boxShadow='0 0 40px rgba(0,243,255,0.3), 0 4px 24px rgba(0,0,0,0.4)'; }}
          >
            <Rocket size={18} /> Get Started Free
          </button>

          {isprevious && (
            <button
              onClick={() => navigate('/dashboard')}
              className="neon-btn neon-btn-purple"
              style={{ padding: '0.95rem 2.2rem', fontSize: '1rem' }}
            >
              View Dashboard <ArrowRight size={17} />
            </button>
          )}
        </motion.div>

        {/* Trust pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38 }}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2.4rem' }}
        >
          {['ATS Scoring', 'JD Matching', 'Live Mock Interviews', 'Skill Roadmap', 'Cover Letters'].map((t, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 20,
              padding: '0.3rem 0.85rem',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.02em',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: i % 2 === 0 ? '#00f3ff' : '#9d4edd', display: 'inline-block' }} />
              {t}
            </span>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section style={{
        padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,5rem)',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <p style={{ fontSize: '0.78rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#00f3ff', fontWeight: 700, marginBottom: '0.5rem' }}>
            Everything You Need
          </p>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Five AI Tools, One Platform
          </h2>
        </motion.div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.1rem',
        }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 + i * 0.07, duration: 0.45 }}
              onClick={upnavigate}
              style={{
                background: 'rgba(255,255,255,0.025)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.065)',
                borderRadius: 20,
                padding: '1.5rem',
                cursor: 'pointer',
                borderLeft: `2.5px solid ${f.color}`,
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-7px)';
                e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.45), 0 0 28px ${f.color}18`;
                e.currentTarget.style.borderColor = f.color;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.065)';
                e.currentTarget.style.borderLeftColor = f.color;
              }}
            >
              {/* Icon */}
              <div style={{
                width: 46, height: 46,
                borderRadius: 13,
                background: `${f.color}18`,
                border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
                color: f.color,
                boxShadow: `0 0 16px ${f.color}18`,
              }}>
                {f.icon}
              </div>

              {/* Label badge */}
              <span style={{
                display: 'inline-block',
                background: `${f.color}12`,
                color: f.color,
                border: `1px solid ${f.color}28`,
                borderRadius: 20,
                padding: '0.12rem 0.55rem',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                marginBottom: '0.7rem',
              }}>
                {f.label}
              </span>

              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.97rem', fontWeight: 700, marginBottom: '0.45rem', color: '#f0f2f8' }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.55 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: '3rem',
            padding: '1.75rem 2.5rem',
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(0,243,255,0.07), rgba(157,78,221,0.07))',
            border: '1px solid rgba(0,243,255,0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.35rem' }}>
              Ready to elevate your career?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Upload your resume and get your first AI analysis in under 30 seconds.
            </p>
          </div>
          <button
            onClick={upnavigate}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.85rem 2rem',
              borderRadius: 30,
              border: 'none',
              background: 'linear-gradient(135deg, #00f3ff, #9d4edd)',
              color: '#fff',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700, fontSize: '0.93rem',
              cursor: 'pointer',
              boxShadow: '0 0 30px rgba(0,243,255,0.25)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.boxShadow='0 0 50px rgba(0,243,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 0 30px rgba(0,243,255,0.25)'; }}
          >
            <Zap size={16} /> Start Now <ArrowRight size={15} />
          </button>
        </motion.div>

        {/* Footer strip */}
        <div style={{ textAlign: 'center', padding: '2.5rem 0 0.5rem', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
          Built by Anshika Jain · ResumeSync{' '}
          <span style={{ color: '#9d4edd', fontWeight: 700 }}>AI</span>
          {' '}· {new Date().getFullYear()}
        </div>
      </section>

      {/* ── DELETE CONFIRMATION MODAL ── */}
      <div
        id="confirmdivdel"
        style={{
          display: 'none', position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.82)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card"
          style={{ maxWidth: 460, width: '90%', textAlign: 'center', borderColor: 'rgba(255,77,77,0.28)' }}
        >
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}>
            <Trash2 color="#ff4d4d" size={26} />
          </div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.7rem', marginBottom: '0.85rem' }}>
            Delete Account?
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.9rem' }}>
            This is permanent and irreversible. All your resumes, analyses, and data will be erased.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem' }}>
            <button
              className="neon-btn"
              style={{ flex: 1, borderColor: 'rgba(255,255,255,0.15)', color: 'var(--text-muted)' }}
              onClick={() => document.getElementById('confirmdivdel').style.display = 'none'}
            >
              Cancel
            </button>
            <button
              className="neon-btn"
              style={{ flex: 1, borderColor: '#ff4d4d', color: '#ff4d4d' }}
              onClick={delaccount}
              disabled={delloading}
            >
              {delloading ? 'Deleting…' : 'Confirm Delete'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
