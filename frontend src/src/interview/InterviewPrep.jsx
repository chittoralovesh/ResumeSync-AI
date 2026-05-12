import React, { useState, useContext, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Zap, Send, Bot, User, PlayCircle, Star } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { usercontext } from '../appcontext';

export default function InterviewPrep() {
  const { serviceURL } = useContext(usercontext);
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleStart = async () => {
    if (!file || !jd) {
      toast.error('Please provide both a resume and a job description to start.');
      return;
    }
    setChatStarted(true);
    setMessages([
      { role: 'ai', content: "Hello! I am your AI Interviewer. I've reviewed your resume and the job description. We can do a mock interview, or you can ask me to help you prepare for specific questions. Are you ready to begin?" }
    ]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const chatHistory = messages.map(m => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.content}`).join('\n');

    try {
      const formData = new FormData();
      formData.append('userMessage', userMsg);
      formData.append('chatHistory', chatHistory);

      const response = await axios.post(`${serviceURL}/interview-chat`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const data = response.data;
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: data.aiResponse,
        feedback: data.feedback,
        score: data.evaluationScore
      }]);

    } catch (err) {
      toast.error('Network error. Failed to get response.');
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I am experiencing network issues. Could you repeat that?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '2rem', height: '85vh', display: 'flex', flexDirection: 'column' }}>
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <MessageSquare color="var(--neon-purple)" size={36} /> AI Mock Interviewer
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Engage in a live conversational mock interview. The AI will evaluate your answers and provide instant feedback.
      </p>

      {!chatStarted ? (
        <motion.div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', flex: 1 }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>1. Upload Resume</label>
            <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} className="glass-input" />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>2. Job Description</label>
            <textarea rows="6" className="glass-input" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the JD here..."></textarea>
          </div>

          <button className="neon-btn neon-btn-purple" onClick={handleStart} style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}>
            <PlayCircle size={20} /> Start Interview Session
          </button>
        </motion.div>
      ) : (
        <motion.div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          
          {/* Chat Header */}
          <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00f3ff', boxShadow: '0 0 10px #00f3ff', animation: 'pulse 2s infinite' }}></div>
              <span style={{ fontWeight: '600', color: '#fff' }}>Interviewer Online</span>
            </div>
            <button className="neon-btn" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }} onClick={() => setChatStarted(false)}>End Session</button>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                key={idx} 
                style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '1rem', alignItems: 'flex-start' }}
              >
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: msg.role === 'ai' ? 'rgba(157, 78, 221, 0.2)' : 'rgba(0, 243, 255, 0.2)',
                  border: `1px solid ${msg.role === 'ai' ? 'var(--neon-purple)' : 'var(--neon-blue)'}`
                }}>
                  {msg.role === 'ai' ? <Bot color="var(--neon-purple)" size={20} /> : <User color="var(--neon-blue)" size={20} />}
                </div>

                <div style={{ 
                  maxWidth: '75%', 
                  background: msg.role === 'ai' ? 'rgba(255,255,255,0.03)' : 'rgba(0, 243, 255, 0.05)',
                  border: msg.role === 'user' ? '1px solid rgba(0,243,255,0.2)' : '1px solid rgba(255,255,255,0.05)',
                  padding: '1rem 1.5rem', borderRadius: '16px', borderTopLeftRadius: msg.role === 'ai' ? 0 : '16px', borderTopRightRadius: msg.role === 'user' ? 0 : '16px',
                  color: 'var(--text-main)', lineHeight: '1.6'
                }}>
                  <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.content}</p>
                  
                  {msg.feedback && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Star color="#f59e0b" size={16} /> 
                        <span style={{ color: '#f59e0b', fontWeight: '600', fontSize: '0.9rem' }}>Evaluation Score: {msg.score}/100</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>{msg.feedback}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(157, 78, 221, 0.2)', border: '1px solid var(--neon-purple)' }}>
                  <Bot color="var(--neon-purple)" size={20} />
                </div>
                <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', borderTopLeftRadius: 0, display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <div className="typing-dot"></div><div className="typing-dot" style={{ animationDelay: '0.2s' }}></div><div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={sendMessage} style={{ padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '1rem' }}>
            <input 
              type="text" 
              className="glass-input" 
              style={{ flex: 1, margin: 0, background: 'rgba(255,255,255,0.05)' }} 
              placeholder="Type your answer or ask a question..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className="neon-btn neon-btn-purple" disabled={isTyping || !inputValue.trim()} style={{ padding: '0 1.5rem' }}>
              <Send size={20} />
            </button>
          </form>

        </motion.div>
      )}

      <style>{`
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        .typing-dot { width: 8px; height: 8px; background: var(--neon-purple); border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
      `}</style>
    </motion.div>
  );
}
