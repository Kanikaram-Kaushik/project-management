"use client";

import { useState } from "react";
import { loginUser, registerUser } from "@/app/actions/auth";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    
    if (isLogin) {
      const result = await loginUser(formData);
      if (result?.error) {
        setError(result.error);
      }
    } else {
      const result = await registerUser(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
        setIsLogin(true); // Switch to login after successful registration
        (e.target as HTMLFormElement).reset();
      }
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', padding: '2rem', justifyContent: 'center' }}>
      <div className="card fade-in" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>
          {isLogin ? "Sign In" : "Create Account"}
        </h2>
        
        {error && (
          <div style={{ color: 'var(--error)', backgroundColor: 'rgba(188, 71, 73, 0.1)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ color: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.1)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--foreground)' }}>Full Name</label>
              <input 
                name="name"
                type="text" 
                className="input-field" 
                placeholder="e.g. John Doe" 
                required 
              />
            </div>
          )}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--foreground)' }}>Email</label>
            <input 
              name="email"
              type="email" 
              className="input-field" 
              placeholder="e.g. client@luxe.com" 
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--foreground)' }}>Password</label>
            <input 
              name="password"
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            {isLogin ? "Access Portal" : "Sign Up"}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }} 
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.6, textAlign: 'center' }}>
          <p>Demo Accounts (Password: password):</p>
          <ul style={{ listStyleType: 'none', padding: 0, marginTop: '0.5rem' }}>
            <li>admin@luxe.com</li>
            <li>supervisor@luxe.com</li>
            <li>client@luxe.com</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
