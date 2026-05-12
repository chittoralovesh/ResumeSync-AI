import React, { useState, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileSignature, CheckCircle, Download, FileText } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { usercontext } from '../appcontext';
import html2pdf from 'html2pdf.js';

export default function OptimizeResume() {
  const { serviceURL } = useContext(usercontext);
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const resumeRef = useRef();

  const handleOptimize = async () => {
    if (!file || !jd) {
      toast.error('Please provide both a resume and a job description.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobDescription', jd);

    try {
      const response = await axios.post(`${serviceURL}/optimize-resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setResult(response.data);
      toast.success('Resume rewritten successfully!');
    } catch (err) {
      toast.error('Optimization failed.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = resumeRef.current;
    const opt = {
      margin:       0.5,
      filename:     'Optimized_Resume.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '2rem' }}>
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileSignature color="var(--neon-blue)" size={36} /> AI Resume Writer
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        We don't just tweak keywords. Our AI completely rewrites your summary, projects, and experience using the STAR method.
      </p>

      {!result ? (
        <motion.div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>1. Upload Current Resume</label>
            <input type="file" accept=".pdf,.docx" onChange={(e) => setFile(e.target.files[0])} className="glass-input" />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>2. Target Job Description</label>
            <textarea rows="6" className="glass-input" value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste JD here..."></textarea>
          </div>

          <button className="neon-btn" onClick={handleOptimize} disabled={loading} style={{ width: '100%', padding: '1rem' }}>
            {loading ? 'Rewriting Resume... Please wait' : 'Generate Optimized Resume'}
          </button>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          
          {/* Analysis Sidebar */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card">
              <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Added ATS Keywords</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(result.addedKeywords || []).map((kw, i) => (
                  <span key={i} style={{ background: 'rgba(0, 243, 255, 0.1)', color: 'var(--neon-blue)', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
                    {kw}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card">
              <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Overall Strategy</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{result.overallImprovementAdvice}</p>
            </motion.div>

            <button className="neon-btn neon-btn-purple" onClick={downloadPDF} style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Download size={20} /> Download PDF
            </button>
            <button className="neon-btn" onClick={() => setResult(null)} style={{ width: '100%', padding: '1rem' }}>
              Rewrite Another Resume
            </button>
          </div>

          {/* Resume Preview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ flex: '2 1 600px', background: '#fff', color: '#000', borderRadius: '8px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            
            <div ref={resumeRef} style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #333', paddingBottom: '1rem' }}>
                <h1 style={{ margin: 0, fontSize: '24px', textTransform: 'uppercase', color: '#111' }}>[YOUR NAME HERE]</h1>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#444' }}>Email | Phone | LinkedIn | Portfolio</p>
              </div>

              {result.optimizedSummary && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '16px', textTransform: 'uppercase', color: '#222', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '8px' }}>Professional Summary</h2>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: '#333' }}>{result.optimizedSummary}</p>
                </div>
              )}

              {result.optimizedExperience && result.optimizedExperience.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '16px', textTransform: 'uppercase', color: '#222', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '12px' }}>Professional Experience</h2>
                  {result.optimizedExperience.map((exp, i) => (
                    <div key={i} style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{exp.title}</span>
                        <span style={{ fontSize: '13px', fontStyle: 'italic' }}>{exp.company}</span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {(exp.optimizedBullets || []).map((bullet, j) => (
                          <li key={j} style={{ fontSize: '13px', lineHeight: '1.5', color: '#333', marginBottom: '4px' }}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {result.optimizedProjects && result.optimizedProjects.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '16px', textTransform: 'uppercase', color: '#222', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '12px' }}>Technical Projects</h2>
                  {result.optimizedProjects.map((proj, i) => (
                    <div key={i} style={{ marginBottom: '1rem' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{proj.name}</div>
                      <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {(proj.optimizedBullets || []).map((bullet, j) => (
                          <li key={j} style={{ fontSize: '13px', lineHeight: '1.5', color: '#333', marginBottom: '4px' }}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '11px', color: '#888' }}>
                *This template was automatically generated and formatted for ATS compliance by ResumeSync-AI.*
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
