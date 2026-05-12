import React, { useState, useContext, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Upload, ChevronDown, ChevronUp, Send, Bot, User,
  Sparkles, BookOpen, Code2, Users, Lightbulb, FileText,
  MessageCircle, Zap, Star
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { usercontext } from '../appcontext';

const CHAT_SUGGESTIONS = [
  'What is overfitting in ML?',
  'Explain React hooks',
  'What is DB normalization?',
  'Explain SOLID principles',
  'Difference between SQL and NoSQL',
  'What is Big O notation?',
];

const DIFFICULTY_CONFIG = {
  beginner: { label: 'Beginner', color: '#00d084', glow: 'rgba(0,208,132,0.3)' },
  medium:   { label: 'Medium',   color: '#00f3ff', glow: 'rgba(0,243,255,0.3)' },
  hard:     { label: 'Hard',     color: '#ff4757', glow: 'rgba(255,71,87,0.3)'  },
};

const TABS = [
  { id: 'hr',        label: 'HR Questions',   icon: <Users   size={15} />, color: '#00f3ff', key: 'hrQuestions'        },
  { id: 'technical', label: 'Technical',      icon: <Code2   size={15} />, color: '#9d4edd', key: 'technicalQuestions' },
  { id: 'project',   label: 'Project-Based',  icon: <BookOpen size={15} />, color: '#ff6b35', key: 'projectQuestions'  },
];

export default function InterviewGuide() {
  const { serviceURL } = useContext(usercontext);

  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [activeTab, setActiveTab] = useState('hr');
  const [expanded, setExpanded] = useState({});

  const [chatMessages, setChatMessages] = useState([{
    role: 'ai',
    content: "Hi! I'm your AI Interview Coach. Ask me anything about interview prep, technical concepts, or career advice — like ChatGPT, but specialized for interviews.",
  }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) { toast.error('Max file size is 2MB'); return; }
    setFile(f);
    toast.success(`Resume ready: ${f.name}`);
  };

  const handleGenerate = async () => {
    if (!jd.trim()) { toast.error('Please provide a job description'); return; }
    setLoading(true);
    setQuestions(null);
    setExpanded({});
    try {
      const fd = new FormData();
      if (file) fd.append('file', file);
      fd.append('jobDescription', jd);
      fd.append('difficulty', difficulty);
      const { data } = await axios.post(`${serviceURL}/interview-guide`, fd, { withCredentials: true });
      setQuestions(data);
      setActiveTab('hr');
      toast.success('Interview guide generated!');
    } catch {
      toast.error('Failed to generate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  const handleChat = async (msg) => {
    const message = (msg || chatInput).trim();
    if (!message) return;
    setChatInput('');
    setChatMessages(p => [...p, { role: 'user', content: message }]);
    setChatLoading(true);
    try {
      const fd = new FormData();
      fd.append('userMessage', message);
      const { data } = await axios.post(`${serviceURL}/ai-chat`, fd, { withCredentials: true });
      setChatMessages(p => [...p, { role: 'ai', content: data.response || 'No response received.' }]);
    } catch {
      setChatMessages(p => [...p, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const activeTabMeta = TABS.find(t => t.id === activeTab);
  const activeColor   = activeTabMeta?.color || '#00f3ff';
  const activeQList   = questions?.[activeTabMeta?.key] || [];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '2.5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: 52, height: 52,
            background: 'linear-gradient(135deg, #00f3ff, #9d4edd)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(0,243,255,0.35)',
          }}>
            <Brain size={26} color="#fff" />
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
            Interview Guide
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Upload your resume + JD → get calibrated questions with ideal answers &amp; tips
        </p>
      </motion.div>

      {/* ── Input Card ── */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

          {/* File Upload */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Resume (optional)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${file ? '#00f3ff' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 14,
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'center',
                background: file ? 'rgba(0,243,255,0.04)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.3s ease',
                minHeight: 120,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {file ? (
                <>
                  <FileText size={26} color="#00f3ff" />
                  <p style={{ color: '#00f3ff', fontSize: '0.82rem', fontWeight: 600, wordBreak: 'break-all', margin: 0 }}>{file.name}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  >Remove</button>
                </>
              ) : (
                <>
                  <Upload size={26} color="var(--text-muted)" />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Upload Resume</p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', margin: 0 }}>PDF / DOCX · Max 2MB</p>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf,.docx" onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          {/* Job Description */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Job Description *
            </label>
            <textarea
              className="glass-input"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full job description here…"
              style={{ minHeight: 120, resize: 'vertical', fontFamily: 'inherit', fontSize: '0.875rem', lineHeight: 1.6 }}
            />
          </div>
        </div>

        {/* Difficulty Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Difficulty Level
          </label>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setDifficulty(key)}
                style={{
                  padding: '0.55rem 1.5rem',
                  borderRadius: 30,
                  border: `1px solid ${difficulty === key ? cfg.color : 'rgba(255,255,255,0.1)'}`,
                  background: difficulty === key ? `${cfg.color}1A` : 'transparent',
                  color: difficulty === key ? cfg.color : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: difficulty === key ? 700 : 400,
                  transition: 'all 0.25s ease',
                  boxShadow: difficulty === key ? `0 0 18px ${cfg.glow}` : 'none',
                  fontSize: '0.875rem',
                }}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          className="neon-btn"
          onClick={handleGenerate}
          disabled={loading}
          style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 700 }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center' }}>
              <span className="spin-ring" />
              Generating Questions…
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'center' }}>
              <Sparkles size={20} /> Generate Interview Guide
            </span>
          )}
        </button>
      </motion.div>

      {/* ── Questions Section ── */}
      <AnimatePresence>
        {questions && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ marginBottom: '2rem' }}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {TABS.map(tab => {
                const count = questions?.[tab.key]?.length;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.55rem 1.25rem',
                      borderRadius: 30,
                      border: `1px solid ${isActive ? tab.color : 'rgba(255,255,255,0.1)'}`,
                      background: isActive ? `${tab.color}1A` : 'rgba(255,255,255,0.02)',
                      color: isActive ? tab.color : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontWeight: isActive ? 700 : 400,
                      transition: 'all 0.25s ease',
                      boxShadow: isActive ? `0 0 20px ${tab.color}30` : 'none',
                      fontSize: '0.875rem',
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                    {count > 0 && (
                      <span style={{
                        background: `${tab.color}25`,
                        color: tab.color,
                        borderRadius: 20,
                        padding: '0.1rem 0.55rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}>{count}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Question Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
              >
                {activeQList.map((q, i) => {
                  const key = `${activeTab}-${i}`;
                  const isOpen = !!expanded[key];
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="glass-card"
                      onClick={() => toggle(key)}
                      style={{
                        padding: '1.125rem 1.375rem',
                        borderLeft: `3px solid ${activeColor}`,
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, alignItems: 'flex-start' }}>
                          <span style={{
                            background: `${activeColor}1A`,
                            color: activeColor,
                            borderRadius: 8,
                            padding: '0.2rem 0.55rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            flexShrink: 0,
                            marginTop: '0.15rem',
                          }}>Q{i + 1}</span>
                          <p style={{ fontWeight: 600, fontSize: '0.93rem', lineHeight: 1.55, margin: 0 }}>{q.question}</p>
                        </div>
                        <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '0.1rem' }}>
                          {isOpen ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                        </span>
                      </div>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden' }}
                          >
                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

                              {/* Ideal Answer */}
                              <div style={{ marginBottom: q.tips ? '0.875rem' : 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
                                  <Lightbulb size={13} color={activeColor} />
                                  <span style={{ color: activeColor, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    Ideal Answer
                                  </span>
                                </div>
                                <p style={{
                                  color: 'var(--text-main)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0,
                                  background: `${activeColor}08`, padding: '0.75rem 1rem', borderRadius: 10,
                                }}>
                                  {q.idealAnswer}
                                </p>
                              </div>

                              {/* Tips */}
                              {q.tips && (
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.45rem' }}>
                                    <Star size={13} color="#ffd700" />
                                    <span style={{ color: '#ffd700', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                      Pro Tips
                                    </span>
                                  </div>
                                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
                                    {q.tips}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AI Chat Q&A ── */}
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {/* Chat Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.875rem',
          marginBottom: '1.25rem', paddingBottom: '1rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            width: 42, height: 42,
            background: 'linear-gradient(135deg, #9d4edd, #00f3ff)',
            borderRadius: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 18px rgba(157,78,221,0.4)',
            flexShrink: 0,
          }}>
            <MessageCircle size={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.97rem', margin: 0 }}>AI Interview Coach</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0 }}>Unlimited Q&amp;A · Answers like ChatGPT</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d084', boxShadow: '0 0 8px #00d084' }} />
            <span style={{ fontSize: '0.72rem', color: '#00d084', fontWeight: 600 }}>Online</span>
          </div>
        </div>

        {/* Messages */}
        <div style={{ height: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem', paddingRight: '0.25rem' }}>
          {chatMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: '0.625rem', alignItems: 'flex-start' }}
            >
              {msg.role === 'ai' && (
                <div style={{
                  width: 32, height: 32, flexShrink: 0,
                  background: 'linear-gradient(135deg, #9d4edd, #00f3ff)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={15} color="#fff" />
                </div>
              )}
              <div style={{
                maxWidth: '76%',
                padding: '0.8rem 1.1rem',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, rgba(0,243,255,0.12), rgba(157,78,221,0.12))'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${msg.role === 'user' ? 'rgba(0,243,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                fontSize: '0.875rem',
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: 32, height: 32, flexShrink: 0,
                  background: 'rgba(0,243,255,0.15)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={15} color="#00f3ff" />
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing indicator */}
          {chatLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg, #9d4edd, #00f3ff)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={15} color="#fff" />
              </div>
              <div style={{
                display: 'flex', gap: 5, alignItems: 'center',
                padding: '0.8rem 1.1rem',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '18px 18px 18px 4px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                {[0, 1, 2].map(d => (
                  <div key={d} style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#9d4edd',
                    animation: 'typingBounce 1.2s ease infinite',
                    animationDelay: `${d * 0.18}s`,
                  }} />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestions (visible only initially) */}
        {chatMessages.length === 1 && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>Try asking:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {CHAT_SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleChat(s)}
                  style={{
                    padding: '0.38rem 0.85rem',
                    borderRadius: 20,
                    border: '1px solid rgba(157,78,221,0.28)',
                    background: 'rgba(157,78,221,0.06)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#9d4edd'; e.currentTarget.style.color = '#9d4edd'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(157,78,221,0.28)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleChat(); }} style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            className="glass-input"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask anything: What is overfitting? Explain React hooks…"
            disabled={chatLoading}
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            disabled={chatLoading || !chatInput.trim()}
            style={{
              padding: '0.875rem 1.2rem',
              borderRadius: 13,
              border: 'none',
              background: chatLoading || !chatInput.trim()
                ? 'rgba(255,255,255,0.08)'
                : 'linear-gradient(135deg, #00f3ff, #9d4edd)',
              color: '#fff',
              cursor: chatLoading || !chatInput.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.25s ease',
              flexShrink: 0,
              boxShadow: chatLoading || !chatInput.trim() ? 'none' : '0 0 18px rgba(0,243,255,0.3)',
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
