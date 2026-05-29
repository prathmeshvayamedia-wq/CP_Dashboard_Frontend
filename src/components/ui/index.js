// src/components/ui/index.js
import { useState, useEffect, useRef } from 'react';

/* ── Button ── */
export function Btn({ children, variant='default', size='md', loading, className='', ...props }) {
  const base = {
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    gap:'6px', fontFamily:'inherit', fontWeight:600,
    borderRadius:'var(--radius-md)', border:'none',
    cursor: props.disabled||loading ? 'not-allowed' : 'pointer',
    transition:'all .15s', whiteSpace:'nowrap', letterSpacing:'-.01em',
  };
  const sizes = {
    sm: { padding:'5px 12px', fontSize:'12px' },
    md: { padding:'9px 18px', fontSize:'13px' },
    lg: { padding:'11px 22px', fontSize:'14px' },
  };
  const variants = {
    default: { background:'#FFFFFF', color:'#1C1028', border:'1px solid #EAE5DD' },
    brand:   { background:'#7B3D6E', color:'#fff', boxShadow:'0 2px 10px rgba(123,61,110,.28)' },
    dark:    { background:'#1C1028', color:'#fff' },
    ghost:   { background:'transparent', color:'#9486A8', border:'1px solid #EAE5DD' },
    danger:  { background:'#FBECE6', color:'#7A2412', border:'1px solid #D9B4A0' },
    success: { background:'#E8F0EB', color:'#24452E', border:'1px solid #BDD4C4' },
  };
  return (
    <button
      style={{ ...base, ...sizes[size], ...variants[variant], opacity: props.disabled||loading ? .6 : 1 }}
      onMouseEnter={e => { if (!props.disabled && !loading) e.currentTarget.style.transform='translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='none'; }}
      {...props}
    >
      {loading && <Spinner size={14} />}
      {children}
    </button>
  );
}

/* ── Spinner ── */
export function Spinner({ size=18, color='currentColor' }) {
  return (
    <span style={{
      display:'inline-block', width:size, height:size, flexShrink:0,
      border:`2px solid ${color}30`, borderTopColor:color,
      borderRadius:'50%', animation:'spin .7s linear infinite',
    }} aria-label="Loading" />
  );
}

/* ── Badge ── */
export function Badge({ tier, children, size='md' }) {
  const cls = `tier-${tier}`;
  const pad = size==='sm' ? '2px 8px' : '3px 10px';
  return (
    <span className={cls} style={{
      display:'inline-flex', alignItems:'center', gap:4,
      fontSize: size==='sm' ? 11 : 12, fontWeight:600,
      padding:pad, borderRadius:20,
    }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:'currentColor', opacity:.7, flexShrink:0 }} />
      {children || tier}
    </span>
  );
}

/* ── Card ── */
export function Card({ children, style={}, hover=false, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background:'#FFFFFF', border:'1px solid #EAE5DD',
        borderRadius:'var(--radius-lg)',
        boxShadow:'0 1px 4px rgba(28,16,40,.05)',
        transition: hover ? 'all .2s' : undefined,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      onMouseEnter={hover ? e => { e.currentTarget.style.boxShadow='0 6px 22px rgba(28,16,40,.10)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='#C4A8FF'; } : undefined}
      onMouseLeave={hover ? e => { e.currentTarget.style.boxShadow='0 1px 4px rgba(28,16,40,.05)'; e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#EAE5DD'; } : undefined}
    >
      {children}
    </div>
  );
}

/* ── Modal ── */
export function Modal({ open, onClose, title, children, width=480 }) {
  useEffect(() => {
    const h = e => { if (e.key==='Escape') onClose(); };
    if (open) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={e => { if (e.target===e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, background:'rgba(28,16,40,.45)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}>
      <div style={{ background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:18, width:'100%', maxWidth:width, padding:28, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(28,16,40,.18)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
          <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:16, fontWeight:700, color:'#1C1028' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'#F5F2EE', border:'1px solid #EAE5DD', width:28, height:28, borderRadius:8, color:'#9486A8', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Input ── */
export function Input({ label, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {label && <label style={{ fontSize:11, fontWeight:700, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.07em' }}>{label}</label>}
      <input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          padding:'10px 12px', fontSize:13,
          background: focused ? 'rgba(123,61,110,.03)' : '#FAFAF8',
          border:`1px solid ${focused ? 'rgba(123,61,110,.5)' : '#EAE5DD'}`,
          borderRadius:9, color:'#1C1028', outline:'none',
          transition:'border .15s', boxSizing:'border-box', width:'100%',
        }}
        {...props}
      />
    </div>
  );
}

/* ── StatCard ── */
export function StatCard({ label, value, sub, accent, dot }) {
  return (
    <div style={{ padding:'14px 16px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:12, boxShadow:'0 1px 4px rgba(28,16,40,.04)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
        {dot && <span style={{ width:6, height:6, borderRadius:'50%', background:accent||'#B0A494', display:'inline-block', flexShrink:0 }} />}
        <span style={{ fontSize:9, fontWeight:800, letterSpacing:'.08em', textTransform:'uppercase', color:'#B0A494' }}>{label}</span>
      </div>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:24, fontWeight:500, lineHeight:1, color:accent||'#1C1028', marginBottom:5 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:'#B0A494' }}>{sub}</div>}
    </div>
  );
}

/* ── Empty ── */
export function Empty({ title, sub, action }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 24px' }}>
      <div style={{ fontSize:40, marginBottom:14 }}>🏗</div>
      <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:17, fontWeight:700, color:'#1C1028', marginBottom:6 }}>{title}</div>
      {sub && <div style={{ fontSize:13, color:'#9486A8', marginBottom:20 }}>{sub}</div>}
      {action}
    </div>
  );
}
