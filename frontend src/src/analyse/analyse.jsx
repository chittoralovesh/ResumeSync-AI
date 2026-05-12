import React, { useContext, useEffect, useState } from "react";
import { usercontext } from "../appcontext";
import { useNavigate } from "react-router-dom";
import { Heat } from "@alptugidin/react-circular-progress-bar";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Lightbulb, Briefcase, FileSearch } from 'lucide-react';

export default function Analyse() {
    const navigate = useNavigate();
    const [score, setscore] = useState(0);
    const [atsscore, setatsscore] = useState(0);
    const [pros, setpros] = useState([]);
    const [cons, setcons] = useState([]);
    const [sug, setsug] = useState([]);
    const [jobs, setjobs] = useState([]);
    const { serviceURL } = useContext(usercontext);
    const [isfetched, setisfetched] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetch(`${serviceURL}/lastReport`, { credentials: "include" })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Failed to fetch report");
                }
            })
            .then(data => {
                if (data != null) {
                    setscore(data.score || 0);
                    setatsscore(data.atsoptimizationscore || 0);
                    setpros(data.pros || []);
                    setcons(data.cons || []);
                    setsug(data.suggestions || []);
                    setjobs(data.jobs || []);
                    setisfetched(true);
                }
            })
            .catch(error => {
                console.error(error);
                setError(true);
            });
    }, [serviceURL]);

    if (error) {
        return (
            <div style={{ textAlign: 'center', marginTop: '5rem' }}>
                <h2 style={{ color: '#ff4d4d' }}>Error retrieving your report.</h2>
                <button className="neon-btn" onClick={() => navigate("/uploaddoc")} style={{ marginTop: '1rem' }}>Try Again</button>
            </div>
        );
    }

    if (!isfetched) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <FileSearch color="var(--neon-blue)" size={64} style={{ animation: 'pulse 2s infinite', marginBottom: '1rem' }} />
                <h2 className="gradient-text">Generating Report...</h2>
                <style>{`@keyframes pulse { 0% { opacity: 0.5; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; transform: scale(0.9); } }`}</style>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '2rem' }}>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Analysis Report</h1>

            {/* Score Section */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '3rem' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ width: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '150px', height: '150px' }}>
                        <Heat
                            progress={score}
                            range={{ from: 0, to: 100 }}
                            showValue={true}
                            revertBackground={true}
                            text={'Overall Synergy'}
                            sx={{
                                barWidth: 7, bgColor: 'rgba(255, 255, 255, 0.05)', bgStrokeColor: 'rgba(0,243,255,0.2)',
                                valueSize: 18, textSize: 10, valueWeight: 'bold', textWeight: '600',
                                textColor: '#94a3b8', valueColor: '#00f0ff', loadingTime: 1500, strokeLinecap: 'round'
                            }}
                        />
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card" style={{ width: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '150px', height: '150px' }}>
                        <Heat
                            progress={atsscore}
                            range={{ from: 0, to: 100 }}
                            showValue={true}
                            revertBackground={true}
                            text={'ATS Compatibility'}
                            sx={{
                                barWidth: 7, bgColor: 'rgba(255, 255, 255, 0.05)', bgStrokeColor: 'rgba(157, 78, 221, 0.2)',
                                valueSize: 18, textSize: 10, valueWeight: 'bold', textWeight: '600',
                                textColor: '#94a3b8', valueColor: 'var(--neon-purple)', loadingTime: 1500, strokeLinecap: 'round'
                            }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Review Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                {/* Pros */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card" style={{ borderColor: 'rgba(0, 243, 255, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <CheckCircle color="var(--neon-blue)" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#fff' }}>Strengths</h2>
                    </div>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {pros.length > 0 ? pros.map((item, index) => (
                            <li key={index} style={{ marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative', color: 'var(--text-main)' }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--neon-blue)' }}>•</span>
                                {item}
                            </li>
                        )) : <li style={{ color: 'var(--text-muted)' }}>No notable strengths detected.</li>}
                    </ul>
                </motion.div>

                {/* Cons */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card" style={{ borderColor: 'rgba(255, 77, 77, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <XCircle color="#ff4d4d" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#fff' }}>Optimization Targets</h2>
                    </div>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {cons.length > 0 ? cons.map((item, index) => (
                            <li key={index} style={{ marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative', color: 'var(--text-main)' }}>
                                <span style={{ position: 'absolute', left: 0, color: '#ff4d4d' }}>•</span>
                                {item}
                            </li>
                        )) : <li style={{ color: 'var(--text-muted)' }}>No optimization targets found.</li>}
                    </ul>
                </motion.div>

                {/* Suggestions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card" style={{ borderColor: 'rgba(157, 78, 221, 0.3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <Lightbulb color="var(--neon-purple)" />
                        <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#fff' }}>Suggestions</h2>
                    </div>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {sug.length > 0 ? sug.map((item, index) => (
                            <li key={index} style={{ marginBottom: '1rem', paddingLeft: '1.5rem', position: 'relative', color: 'var(--text-main)' }}>
                                <span style={{ position: 'absolute', left: 0, color: 'var(--neon-purple)' }}>•</span>
                                {item}
                            </li>
                        )) : <li style={{ color: 'var(--text-muted)' }}>No suggestions available.</li>}
                    </ul>
                </motion.div>
            </div>

            {/* Jobs Section */}
            {jobs.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#fff' }}>
                        <Briefcase color="var(--neon-blue)" /> Recommended Jobs
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {jobs.map((item, index) => (
                            <div key={index} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ color: 'var(--neon-blue)', marginBottom: '0.5rem' }}>{item.title}</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    <span>🏢 {item.company?.display_name?.trim() || "Unknown Company"}</span>
                                    <span>📍 {item.location?.display_name?.trim() || "Remote"}</span>
                                </div>
                                <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5', flex: 1, marginBottom: '1.5rem' }}>
                                    {item.description ? (item.description.substring(0, 150) + "...") : "No description provided."}
                                </p>
                                <a href={item.redirect_url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                    <button className="neon-btn" style={{ width: '100%', padding: '0.8rem' }}>View Application</button>
                                </a>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}