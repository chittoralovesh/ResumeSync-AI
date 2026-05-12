import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { usercontext } from "../appcontext";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function Uploadpage() {
    const { serviceURL } = useContext(usercontext);
    const navigate = useNavigate();
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
            toast.error("Please upload a resume in PDF or DOCX format.");
            event.target.value = "";
            setFileName("");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("File is too large. Please upload a file smaller than 2MB.");
            event.target.value = "";
            setFileName("");
            return;
        }

        let str = file.name;
        if (str.length > 25) {
            str = str.substring(0, 15) + "..." + str.substring(str.length - 7);
        }
        setFileName(str);
    };

    const analysedoc = (event) => {
        event.preventDefault();
        const uploadform = document.getElementById("upform");
        const formdata = new FormData(uploadform);

        if (formdata.get("roles").trim() === "") {
            toast.warn("Target Job Title must not be empty");
            return;
        }
        if (!formdata.get("file") || !formdata.get("file").name) {
            toast.warn("Please upload your resume");
            return;
        }

        setLoading(true);
        fetch(`${serviceURL}/extract`, { method: "post", body: formdata, credentials: "include" })
            .then(response => {
                if (response.ok) {
                    uploadform.reset();
                    setFileName("");
                    setLoading(false);
                    navigate("/analysereport");
                } else {
                    uploadform.reset();
                    setFileName("");
                    setLoading(false);
                    toast.error("Analysis failed. Please try again with a valid resume.");
                }
            })
            .catch(error => {
                setLoading(false);
                toast.error("Network error. Could not connect to servers.");
            });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '2rem' }}>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UploadCloud color="var(--neon-blue)" size={36} /> Upload Resume
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Provide your resume and target role to generate a comprehensive ATS score and review.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                
                {/* Upload Form */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                    <form id="upform" encType="multipart/form-data" onSubmit={analysedoc}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>Target Job Title</label>
                            <input 
                                type="text" 
                                name="roles" 
                                className="glass-input" 
                                placeholder="e.g. Senior Software Engineer" 
                                autoComplete="off" 
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>Upload Document</label>
                            
                            <label htmlFor="resume" style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                padding: '3rem 2rem', border: '2px dashed rgba(0,243,255,0.3)', borderRadius: '16px',
                                cursor: 'pointer', background: 'rgba(0,0,0,0.2)', transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--neon-blue)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(0,243,255,0.3)'}
                            >
                                {fileName ? (
                                    <FileText color="var(--neon-blue)" size={48} style={{ marginBottom: '1rem' }} />
                                ) : (
                                    <UploadCloud color="var(--text-muted)" size={48} style={{ marginBottom: '1rem' }} />
                                )}
                                
                                <p style={{ color: '#fff', fontWeight: '600', marginBottom: '0.5rem' }}>
                                    {fileName ? fileName : 'Click to select resume'}
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    PDF or DOCX (Max 2MB)
                                </p>
                            </label>
                            <input type="file" name="file" onChange={validate} id="resume" hidden accept=".pdf,.doc,.docx" />
                        </div>

                        <button type="submit" className="neon-btn" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
                            {loading ? "Analyzing..." : "Analyze Resume"}
                        </button>
                    </form>
                </motion.div>

                {/* Guidelines */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card" style={{ height: 'fit-content' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <AlertCircle color="var(--neon-purple)" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Upload Guidelines</h2>
                    </div>
                    
                    <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                            <CheckCircle color="var(--neon-blue)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '0.2rem' }}>File Format</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>Please upload your resume in standard PDF or Microsoft Word (DOC/DOCX) format.</p>
                            </div>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                            <CheckCircle color="var(--neon-blue)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '0.2rem' }}>File Size</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>Ensure the file size does not exceed 2MB to guarantee fast processing.</p>
                            </div>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                            <CheckCircle color="var(--neon-blue)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '0.2rem' }}>Language</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>The AI currently evaluates resumes accurately only in English.</p>
                            </div>
                        </li>
                    </ul>
                </motion.div>

            </div>
        </motion.div>
    );
}