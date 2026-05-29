// src/pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';

export default function Login() {
  const { signIn }  = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ email:'', password:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, admin } = await login(form.email, form.password);
      signIn(token, admin);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  const features = [
    { icon:'⚡', label:'Instant alerts',     desc:'WhatsApp fires the moment a CP goes inactive' },
    { icon:'🎯', label:'Three-tier system',  desc:'Active, Dormant, Inactive — automated treatment' },
    { icon:'📊', label:'Live analytics',     desc:'Real-time CP performance across all projects' },
    { icon:'📅', label:'Auto meetings',      desc:'21-day inactivity triggers meeting scheduling' },
  ];

  const inputStyle = (field) => ({
    width:'100%', padding:'12px 14px', fontSize:13,
    background: focused===field ? 'rgba(123,61,110,.03)' : '#FAFAF8',
    border:`1px solid ${focused===field ? 'rgba(123,61,110,.5)' : '#EAE5DD'}`,
    borderRadius:10, color:'#1C1028', outline:'none',
    transition:'all .2s', boxSizing:'border-box',
  });

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'#FAF8F5', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

      {/* LEFT — form */}
      <div style={{ width:480, flexShrink:0, display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 52px', borderRight:'1px solid #EAE5DD', background:'#FFFFFF' }}>

        {/* Logo */}
        <div style={{ marginBottom:44 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, background:'#7B3D6E', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0, boxShadow:'0 4px 18px rgba(123,61,110,.28)' }}>🏗</div>
            <div>
              <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:800, fontSize:17, color:'#1C1028', lineHeight:1 }}>PropEdge</div>
              <div style={{ fontSize:9, color:'#7B3D6E', letterSpacing:'.12em', textTransform:'uppercase', marginTop:2, fontWeight:700 }}>CP Manager</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, fontWeight:800, color:'#1C1028', lineHeight:1.2, marginBottom:8 }}>
            Welcome back,<br />Admin
          </h1>
          <p style={{ fontSize:13, color:'#9486A8', lineHeight:1.6 }}>Sign in to manage your channel partners and projects.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#9486A8', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:7 }}>Email</label>
            <input
              type="email" required autoFocus
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email:e.target.value }))}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused('')}
              placeholder="admin@yourcompany.com"
              style={inputStyle('email')}
            />
          </div>

          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#9486A8', letterSpacing:'.07em', textTransform:'uppercase', marginBottom:7 }}>Password</label>
            <input
              type="password" required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password:e.target.value }))}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused('')}
              placeholder="••••••••"
              style={inputStyle('password')}
            />
          </div>

          {error && (
            <div style={{ padding:'10px 14px', background:'#FBECE6', border:'1px solid #D9B4A0', borderRadius:9, fontSize:13, color:'#7A2412', marginBottom:16 }}>
              ⚠ {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{
              width:'100%', padding:'12px', fontSize:14, fontWeight:700,
              background:'#7B3D6E', color:'#fff', border:'none', borderRadius:10,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow:'0 4px 18px rgba(123,61,110,.28)',
              opacity: loading ? .7 : 1, transition:'all .2s',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            }}
            onMouseEnter={e => { if (!loading) e.target.style.background='#6A3260'; }}
            onMouseLeave={e => { e.target.style.background='#7B3D6E'; }}
          >
            {loading && <span style={{ width:15, height:15, border:'2px solid rgba(255,255,255,.4)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />}
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      {/* RIGHT — features */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'48px 52px' }}>
        <div style={{ marginBottom:48 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#7B3D6E', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>What's inside</div>
          <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:32, fontWeight:800, color:'#1C1028', lineHeight:1.2, marginBottom:10 }}>
            Your channel partners,<br />fully automated.
          </h2>
          <p style={{ fontSize:14, color:'#9486A8', lineHeight:1.7, maxWidth:420 }}>
            PropEdge tracks every CP's activity, auto-tiers them by performance, and fires WhatsApp messages before deals go cold.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {features.map((f,i) => (
            <div key={i} style={{ padding:'18px 20px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:14, boxShadow:'0 1px 6px rgba(28,16,40,.05)' }}>
              <div style={{ fontSize:22, marginBottom:10 }}>{f.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#1C1028', marginBottom:4 }}>{f.label}</div>
              <div style={{ fontSize:12, color:'#9486A8', lineHeight:1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop:32, padding:'16px 20px', background:'#F0E8F0', border:'1px solid rgba(123,61,110,.2)', borderRadius:12, display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontSize:20 }}>🏗</span>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'#5C2A52', marginBottom:2 }}>PropEdge by Vaya Media</div>
            <div style={{ fontSize:11, color:'#9B5A8E' }}>Built for Indian real estate developers. Secure, fast, mobile-ready.</div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}
