import React, { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { usercontext } from "../appcontext";
import { useNavigate, Link } from "react-router-dom";
import GoogleButton from "../googlebtn.jsx";
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [islogin, setislogin] = useState(true);
    const { backendURL, setisprevious, setusername, setislogged, islogged } = useContext(usercontext);
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [confirmpassword, setconfirmpassword] = useState("");
    const [isloading, setisloading] = useState(false);
    const [isemailverified, setemailverified] = useState(false);
    const [otp, setotp] = useState(["", "", "", "", "", ""]);
    const [showpass, setshowpass] = useState(false);
    const [showconfirmpass, setshowconfirmpass] = useState(false);

    useEffect(() => {
        if (islogged) {
            navigate("/dashboard");
        }
    }, [islogged, navigate]);

    function validateEmail(email) {
        const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailregex.test(email);
    }

    const submit = (event) => {
        event.preventDefault();
        if (!islogin) {
            if (name.trim() === "") return toast.warn("Username must not be empty");
            if (email.trim() === "") return toast.warn("Email must not be empty");
            if (!validateEmail(email.trim())) return toast.warn("Invalid Email");
            if (password.length < 6) return toast.warn("Password must have at least 6 characters");
            if (password !== confirmpassword) return toast.warn("Passwords don't match");
            
            setisloading(true);
            fetch(`${backendURL}/verifyEmail`, {
                method: "post", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: name.trim(), email: email.trim() })
            })
            .then(async response => {
                const message = await response.text();
                if (response.ok) {
                    toast.success(message);
                    setemailverified(true);
                    setisloading(false);
                } else {
                    toast.error(message);
                    setisloading(false);
                }
            });
        } else {
            if (email.trim() === "") return toast.warn("Email must not be empty");
            if (!validateEmail(email.trim())) return toast.warn("Invalid Email");
            if (password.length < 6) return toast.warn("Password must have at least 6 characters");
            
            setisloading(true);
            fetch(`${backendURL}/login`, {
                method: "post", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password: password }), credentials: 'include'
            })
            .then(response => {
                if (response.ok) {
                    setemail("");
                    setpassword("");
                    setisloading(false);
                    setshowpass(false);
                    toast.success("Successfully logged in");
                    return response.json();
                } else {
                    setisloading(false);
                    toast.error("Invalid credentials");
                    return null;
                }
            })
            .then(data => {
                if (data) {
                    setislogged(true);
                    setusername(data.username);
                    setisprevious(data.isPrevious);
                    navigate("/dashboard");
                }
            })
            .catch(error => {
                toast.error("Login Failed");
                setisloading(false);
            });
        }
    };

    function switchmth() {
        setname("");
        setemail("");
        setpassword("");
        setshowpass(false);
        setshowconfirmpass(false);
        setconfirmpassword("");
        setislogin(!islogin);
    }

    const handleInput = (index, event) => {
        if (index < 5 && event.target.value !== "" && event.target.value.replace(/\D/, "") !== "") {
            document.getElementById(`otp-${index + 1}`).focus();
        }
        if (event.target.value.replace(/\D/, "") !== "") {
            var tem = [...otp];
            tem[index] = event.target.value;
            setotp(tem);
        }
        if (event.target.value.replace(/\D/, "") === "") {
            event.target.value = "";
        }
    };

    const handlebck = (index, event) => {
        if (event.key === "Backspace") {
            if (index > 0) {
                event.target.value = "";
                document.getElementById(`otp-${index - 1}`).focus();
                event.preventDefault();
            }
            var tem = [...otp];
            tem[index] = "";
            event.target.value = "";
            setotp(tem);
        } else {
            if (event.target.value.length === 1 && index < 5 && event.target.value.replace(/\D/, "") !== "") {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const verifyprocess = () => {
        var enteredOtp = otp.join("");
        if (enteredOtp.length < 6) return toast.error("Fill all fields");
        
        setisloading(true);
        fetch(`${backendURL}/register`, {
            method: "post",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "username": name.trim(), "email": email.trim(), "password": password, "verifyotp": enteredOtp })
        })
        .then(response => {
            if (response.ok) {
                setotp(["", "", "", "", "", ""]);
                setname("");
                setemail("");
                setpassword("");
                toast.success("Account created successfully");
                setisloading(false);
                setemailverified(false);
                setshowpass(false);
                setshowconfirmpass(false);
                setconfirmpassword("");
                setislogin(true);
            } else {
                setotp(["", "", "", "", "", ""]);
                toast.error("Invalid OTP");
                setisloading(false);
            }
        })
        .catch(error => { toast.error("Net error"); setisloading(false); });
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', position: 'relative' }}>
            <div className="animated-bg"><div className="gradient-mesh"></div></div>
            
            {/* Top Nav (Optional, for returning Home) */}
            <nav style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '2rem', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
                <h1 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ResumeSync-AI</h1>
                <Link to="/" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 'bold', padding: '0.5rem 1.5rem', border: '1px solid var(--glass-border)', borderRadius: '20px', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)' }}>Home</Link>
            </nav>

            <AnimatePresence mode="wait">
                {!isemailverified ? (
                    <motion.div 
                        key="login"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem', zIndex: 5 }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: '#fff' }}>
                                {islogin ? "Let's get you hired" : "Create Account"}
                            </h2>
                            <p style={{ color: 'var(--text-muted)' }}>
                                {islogin ? "Access your personalized dashboard." : "Initialize your profile to optimize your career."}
                            </p>
                        </div>

                        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {!islogin && (
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input 
                                        type="text" value={name} onChange={(e) => setname(e.target.value)} 
                                        placeholder="Username" maxLength={20} className="glass-input" 
                                        style={{ paddingLeft: '3rem' }} 
                                    />
                                </div>
                            )}

                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type="email" value={email} onChange={(e) => setemail(e.target.value)} 
                                    placeholder="Email Address" className="glass-input" 
                                    style={{ paddingLeft: '3rem' }} 
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input 
                                    type={showpass ? "text" : "password"} value={password} onChange={(e) => setpassword(e.target.value)} 
                                    placeholder="Password" className="glass-input" 
                                    style={{ paddingLeft: '3rem', paddingRight: '3rem' }} 
                                />
                                <div 
                                    onClick={() => setshowpass(!showpass)} 
                                    style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}
                                >
                                    {showpass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>

                            {!islogin && (
                                <div style={{ position: 'relative' }}>
                                    <ShieldCheck size={18} style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input 
                                        type={showconfirmpass ? "text" : "password"} value={confirmpassword} onChange={(e) => setconfirmpassword(e.target.value)} 
                                        placeholder="Confirm Password" className="glass-input" 
                                        style={{ paddingLeft: '3rem', paddingRight: '3rem' }} 
                                    />
                                    <div 
                                        onClick={() => setshowconfirmpass(!showconfirmpass)} 
                                        style={{ position: 'absolute', top: '50%', right: '1rem', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}
                                    >
                                        {showconfirmpass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </div>
                                </div>
                            )}

                            {islogin && (
                                <div style={{ textAlign: 'right' }}>
                                    <Link to="/forgotpassword" style={{ color: 'var(--neon-blue)', fontSize: '0.9rem', textDecoration: 'none' }}>Forgot password?</Link>
                                </div>
                            )}

                            <button type="submit" className="neon-btn" disabled={isloading} style={{ width: '100%', marginTop: '0.5rem', padding: '1rem', fontSize: '1rem' }}>
                                {isloading ? "Processing..." : islogin ? "Log In" : "Create Entity"}
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                            <p style={{ fontSize: '0.9rem' }}>
                                {islogin ? "New here? " : "Profile exists? "}
                                <span onClick={switchmth} style={{ color: 'var(--neon-purple)', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {islogin ? "Initialize Here" : "Authenticate Here"}
                                </span>
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                            <span style={{ padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>OR</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <GoogleButton />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="verify"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '3rem', textAlign: 'center', zIndex: 5 }}
                    >
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0, 243, 255, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem' }}>
                            <ShieldCheck color="var(--neon-blue)" size={30} />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1rem', color: '#fff' }}>Verification Protocol</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
                            Transmit the 6-digit verification code sent to your communication channel.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                            {otp.map((value, index) => (
                                <input 
                                    key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength={1} value={value} 
                                    autoComplete="off" placeholder="-" 
                                    onChange={(e) => handleInput(index, e)} onKeyDown={(e) => handlebck(index, e)}
                                    style={{ 
                                        width: '45px', height: '55px', fontSize: '1.5rem', textAlign: 'center', 
                                        background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', 
                                        color: '#fff', borderRadius: '8px', outline: 'none' 
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--neon-blue)'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                                />
                            ))}
                        </div>

                        <button className="neon-btn neon-btn-purple" disabled={isloading} onClick={verifyprocess} style={{ width: '100%', padding: '1rem' }}>
                            {isloading ? "Verifying..." : "Confirm Protocol"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}