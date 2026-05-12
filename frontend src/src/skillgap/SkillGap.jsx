import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, AlertTriangle, BookOpen, Award } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { usercontext } from '../appcontext';

export default function SkillGap() {
  const { serviceURL } = useContext(usercontext);
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!file || !jd) {
      toast.error('Please provide both a resume and a job description.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jd);

    try {
      const response = await axios.post(`${serviceURL}/skill-gap`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setResult(response.data);
      toast.success('Skill gap analyzed!');
    } catch (err) {
      toast.error('Failed to analyze skill gap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '2rem' }}>
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Target color="var(--neon-blue)" size={36} /> Skill Gap Analysis
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Discover exactly what you're missing to land this role, complete with a personalized learning roadmap.
      </p>

      {!result ? (
        <motion.div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>Upload Resume</label>
            <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} className="glass-input" />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>Job Description</label>
            <textarea rows="6" className="glass-input" value={jd} onChange={(e) => setJd(e.target.value)}></textarea>
          </div>

          <button className="neon-btn" onClick={handleAnalyze} disabled={loading} style={{ width: '100%', padding: '1rem' }}>
            {loading ? 'Analyzing Gap... Please wait' : <><Compass size={18} /> Analyze Skill Gap</>}
          </button>
        </motion.div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            
            {/* MISSING SKILLS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card" style={{ borderColor: 'rgba(255, 77, 77, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <AlertTriangle color="#ff4d4d" />
                <h3 style={{ color: '#fff', margin: 0 }}>Missing Critical Skills</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                {result.missingCriticalSkills?.map((skill, i) => (
                  <span key={i} style={{ background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid rgba(255, 77, 77, 0.2)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* CERTIFICATIONS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card" style={{ borderColor: 'rgba(157, 78, 221, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <Award color="var(--neon-purple)" />
                <h3 style={{ color: '#fff', margin: 0 }}>Suggested Certifications</h3>
              </div>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {result.suggestedCertifications?.map((cert, i) => (
                  <li key={i} style={{ marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative', color: 'var(--text-muted)' }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--neon-purple)' }}>•</span>
                    {cert}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* ROADMAP */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neon-blue)', marginBottom: '1.5rem' }}>
              <BookOpen /> Personalized Learning Roadmap
            </h2>
            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              {/* Timeline Line */}
              <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, var(--neon-blue), var(--neon-purple))' }}></div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {result.learningRoadmap?.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + (idx * 0.1) }}
                    key={idx} style={{ position: 'relative' }}
                  >
                    {/* Timeline Dot */}
                    <div style={{ position: 'absolute', left: '-2rem', top: '5px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--bg-color)', border: '4px solid var(--neon-blue)', zIndex: 2 }}></div>
                    
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                        <h3 style={{ color: '#fff', margin: 0 }}>{item.skill}</h3>
                        <span style={{ background: 'rgba(0, 243, 255, 0.1)', color: 'var(--neon-blue)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                          ⏱️ {item.estimatedTimeToLearn}
                        </span>
                      </div>
                      
                      <div>
                        <h4 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Recommended Resources</h4>
                        <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-main)' }}>
                          {item.recommendedResources?.map((res, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{res}</li>)}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <button className="neon-btn" onClick={() => setResult(null)}>Analyze Another Role</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
