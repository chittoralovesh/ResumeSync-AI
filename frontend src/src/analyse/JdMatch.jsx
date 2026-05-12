import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { usercontext } from "../appcontext";
import { motion } from 'framer-motion';
import { Target, FileText, CheckCircle, AlertTriangle, Briefcase } from 'lucide-react';
import { Heat } from "@alptugidin/react-circular-progress-bar";

export default function JdMatch() {
    const { serviceURL } = useContext(usercontext);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const validateFile = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
            toast.error("Please upload a resume in PDF or DOCX format.");
            event.target.value = "";
            setFileName("");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("File is too large. Max 2MB.");
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

    const handleMatch = (event) => {
        event.preventDefault();
        const uploadform = document.getElementById("jd-match-form");
        const formdata = new FormData(uploadform);

        if (formdata.get("jobDescription").trim() === "") {
            toast.warn("Job Description must not be empty");
            return;
        }
        if (!formdata.get("file") || !formdata.get("file").name) {
            toast.warn("Please upload your resume");
            return;
        }

        setLoading(true);
        fetch(`${serviceURL}/jd-match`, { method: "post", body: formdata, credentials: "include" })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to match JD");
                }
            })
            .then(data => {
                setResult(data);
                toast.success("Analysis Complete!");
            })
            .catch(error => {
                toast.error("Network error or analysis failed.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '2rem' }}>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Target color="var(--neon-blue)" size={36} /> JD Match Analysis
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Compare your resume against a specific job description to find keyword matches and missing skills.
            </p>

            {!result ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <form id="jd-match-form" encType="multipart/form-data" onSubmit={handleMatch}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>1. Upload Resume</label>
                            <label htmlFor="jd-resume" style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                padding: '2rem', border: '2px dashed rgba(0,243,255,0.3)', borderRadius: '16px',
                                cursor: 'pointer', background: 'rgba(0,0,0,0.2)', transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--neon-blue)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(0,243,255,0.3)'}
                            >
                                {fileName ? (
                                    <FileText color="var(--neon-blue)" size={36} style={{ marginBottom: '0.5rem' }} />
                                ) : (
                                    <FileText color="var(--text-muted)" size={36} style={{ marginBottom: '0.5rem' }} />
                                )}
                                <p style={{ color: '#fff', fontWeight: '600', marginBottom: 0 }}>
                                    {fileName ? fileName : 'Select PDF or DOCX'}
                                </p>
                            </label>
                            <input type="file" name="file" onChange={validateFile} id="jd-resume" hidden accept=".pdf,.doc,.docx" />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.8rem', fontWeight: '600' }}>2. Paste Job Description</label>
                            <textarea 
                                name="jobDescription" 
                                rows="8" 
                                className="glass-input" 
                                placeholder="Paste the full job description here..."
                            ></textarea>
                        </div>

                        <button type="submit" className="neon-btn" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
                            {loading ? "Analyzing Match... Please wait" : "Compare with JD"}
                        </button>
                    </form>
                </motion.div>
            ) : (
                <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '3rem' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ width: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '150px', height: '150px' }}>
                                <Heat
                                    progress={result.matchScore || 0}
                                    range={{ from: 0, to: 100 }}
                                    showValue={true}
                                    revertBackground={true}
                                    text={'Overall Match'}
                                    sx={{
                                        barWidth: 7, bgColor: 'rgba(255, 255, 255, 0.05)', bgStrokeColor: 'rgba(0,243,255,0.2)',
                                        valueSize: 18, textSize: 10, valueWeight: 'bold', textWeight: '600',
                                        textColor: '#94a3b8', valueColor: '#00f0ff', loadingTime: 1500, strokeLinecap: 'round'
                                    }}
                                />
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card" style={{ width: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '150px', height: '150px' }}>
                                <Heat
                                    progress={result.atsScore || 0}
                                    range={{ from: 0, to: 100 }}
                                    showValue={true}
                                    revertBackground={true}
                                    text={'ATS Friendliness'}
                                    sx={{
                                        barWidth: 7, bgColor: 'rgba(255, 255, 255, 0.05)', bgStrokeColor: 'rgba(157, 78, 221, 0.2)',
                                        valueSize: 18, textSize: 10, valueWeight: 'bold', textWeight: '600',
                                        textColor: '#94a3b8', valueColor: 'var(--neon-purple)', loadingTime: 1500, strokeLinecap: 'round'
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {result.aiSummary && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card" style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>Executive Summary</h2>
                            <p style={{ color: 'var(--text-main)', lineHeight: '1.6' }}>{result.aiSummary}</p>
                        </motion.div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                        {/* Matched Skills */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card" style={{ borderColor: 'rgba(0, 243, 255, 0.3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <CheckCircle color="var(--neon-blue)" />
                                <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#fff' }}>Matched Skills</h2>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                {(result.matchedSkills || []).map((skill, i) => (
                                    <span key={i} style={{ background: 'rgba(0, 243, 255, 0.1)', color: 'var(--neon-blue)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
                                        {skill}
                                    </span>
                                ))}
                                {(!result.matchedSkills || result.matchedSkills.length === 0) && <p style={{ color: 'var(--text-muted)' }}>No direct skill matches found.</p>}
                            </div>
                        </motion.div>

                        {/* Missing Skills */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card" style={{ borderColor: 'rgba(255, 77, 77, 0.3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <AlertTriangle color="#ff4d4d" />
                                <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#fff' }}>Missing Keywords</h2>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                {(result.missingSkills || result.missingKeywords || []).map((skill, i) => (
                                    <span key={i} style={{ background: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid rgba(255, 77, 77, 0.2)' }}>
                                        {skill}
                                    </span>
                                ))}
                                {(!(result.missingSkills || result.missingKeywords) || (result.missingSkills || result.missingKeywords).length === 0) && <p style={{ color: 'var(--text-muted)' }}>No critical missing keywords.</p>}
                            </div>
                        </motion.div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button className="neon-btn" onClick={() => setResult(null)}>Analyze Another JD</button>
                    </div>
                </div>
            )}
        </motion.div>
    );
}