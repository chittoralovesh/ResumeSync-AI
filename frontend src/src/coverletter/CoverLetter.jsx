import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FileSignature, Send, Copy, FileText } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { usercontext } from '../appcontext';

export default function CoverLetter() {
  const { serviceURL } = useContext(usercontext);
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!file || !jd) {
      toast.error('Please provide both a resume and a job description.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jd);

    try {
      const response = await axios.post(`${serviceURL}/cover-letter`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setResult(response.data);
      toast.success('Cover letter generated!');
    } catch (err) {
      toast.error('Failed to generate cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.coverLetterContent);
    toast.success('Copied to clipboard!');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '2rem' }}>
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileSignature color="var(--neon-blue)" size={36} /> AI Cover Letter
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Instantly generate a highly-tailored, professional cover letter based on your resume and target role.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem', transition: 'all 0.5s ease' }}>
        
        {/* INPUT FORM */}
        <motion.div layout className="glass-card" style={{ height: 'fit-content' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>1. Upload Resume</label>
            <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} className="glass-input" />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>2. Job Description</label>
            <textarea rows="8" className="glass-input" value={jd} onChange={(e) => setJd(e.target.value)}></textarea>
          </div>

          <button className="neon-btn" onClick={handleGenerate} disabled={loading} style={{ width: '100%', padding: '1rem' }}>
            {loading ? 'Drafting... Please wait' : <><Send size={18} /> Generate Cover Letter</>}
          </button>
        </motion.div>

        {/* OUTPUT PREVIEW */}
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{ 
              background: '#ffffff', // Document style
              color: '#333', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              position: 'relative'
            }}
          >
            {/* Toolbar */}
            <div style={{ 
              position: 'absolute', top: '-1rem', right: '-1rem', 
              background: 'rgba(20,20,25,0.9)', backdropFilter: 'blur(10px)',
              padding: '0.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', gap: '0.5rem'
            }}>
              <button 
                onClick={copyToClipboard}
                style={{ 
                  background: 'none', border: 'none', color: 'var(--neon-blue)', 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                  padding: '0.5rem', fontWeight: 'bold'
                }}
              >
                <Copy size={16} /> Copy Text
              </button>
            </div>

            <div style={{ borderBottom: '2px solid #eaeaea', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText color="#666" />
                <span style={{ fontWeight: 'bold', color: '#666' }}>Cover Letter Draft</span>
              </div>
              <span style={{ background: '#f0f0f0', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', color: '#666' }}>
                Tone: {result.tone}
              </span>
            </div>

            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontFamily: 'Georgia, serif', fontSize: '1.05rem', color: '#222' }}>
              {result.coverLetterContent}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
