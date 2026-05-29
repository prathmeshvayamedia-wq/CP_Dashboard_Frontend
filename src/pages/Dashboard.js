// src/pages/Dashboard.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProjects, createProject, importCSV, runAutomation } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

/* ── Button ── */
function PBtn({ children, loading, size='md', variant='brand', onClick, type='button', disabled }) {
  const pad = size==='sm' ? '6px 13px' : '10px 20px';
  const fs  = size==='sm' ? 11 : 13;
  const S = {
    brand:  { background:'#7B3D6E', color:'#fff', boxShadow:'0 2px 12px rgba(123,61,110,.28)', border:'none' },
    dark:   { background:'#F5F2EE', color:'#1C1028', border:'1px solid #EAE5DD' },
    ghost:  { background:'transparent', color:'#9486A8', border:'1px solid #EAE5DD' },
    danger: { background:'#FBECE6', color:'#7A2412', border:'1px solid #D9B4A0' },
    green:  { background:'#E8F0EB', color:'#24452E', border:'1px solid #BDD4C4' },
    amber:  { background:'#F8F0E4', color:'#6B4412', border:'1px solid #D9C09A' },
  };
  return (
    <button type={type} disabled={disabled||loading} onClick={onClick}
      style={{ padding:pad, fontSize:fs, fontWeight:700, fontFamily:'inherit', borderRadius:9, cursor:disabled||loading?'not-allowed':'pointer', display:'inline-flex', alignItems:'center', gap:6, opacity:disabled?.5:1, transition:'all .15s', whiteSpace:'nowrap', ...S[variant] }}
      onMouseEnter={e => { if (!disabled&&!loading) e.currentTarget.style.transform='translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='none'; }}>
      {loading && <span style={{ width:11, height:11, border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />}
      {children}
    </button>
  );
}

/* ── Modal ── */
function Modal({ open, onClose, title, children, width=460 }) {
  useEffect(() => {
    const h = e => { if (e.key==='Escape') onClose(); };
    if (open) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={e => { if (e.target===e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, background:'rgba(28,16,40,.45)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}>
      <div style={{ background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:18, width:'100%', maxWidth:width, padding:28, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(28,16,40,.16)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
          <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:16, fontWeight:700, color:'#1C1028' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'#F5F2EE', border:'1px solid #EAE5DD', width:28, height:28, borderRadius:8, color:'#9486A8', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontSize:11, fontWeight:700, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.07em' }}>{label}</label>
      {children}
    </div>
  );
}

function Inp(props) {
  const [focused, setFocused] = useState(false);
  return (
    <input onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ padding:'10px 12px', fontSize:13, background:focused?'rgba(123,61,110,.03)':'#FAFAF8', border:`1px solid ${focused?'rgba(123,61,110,.5)':'#EAE5DD'}`, borderRadius:9, color:'#1C1028', outline:'none', transition:'border .15s', boxSizing:'border-box', width:'100%' }}
      {...props} />
  );
}

/* ── MAIN DASHBOARD ── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [projects, setProjects]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(null);
  const [importing, setImporting]   = useState(false);
  const [running, setRunning]       = useState(null);
  const [form, setForm] = useState({ name:'', location:'', total_units:'', premium_inventory_count:'' });

  useEffect(() => { load(); }, []);

  async function load() {
    try { setLoading(true); setProjects(await getProjects()); }
    catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const p = await createProject({ name:form.name, location:form.location, total_units:Number(form.total_units)||0, premium_inventory_count:Number(form.premium_inventory_count)||0 });
      setProjects(ps => [{ ...p, total_cps:0, active_count:0, dormant_count:0, inactive_count:0 }, ...ps]);
      setShowCreate(false);
      setForm({ name:'', location:'', total_units:'', premium_inventory_count:'' });
      toast.success('Project created!');
    } catch(err) { toast.error(err.response?.data?.error || 'Failed to create project'); }
  }

  async function handleImport(projectId, file) {
    setImporting(true);
    try {
      const r = await importCSV(projectId, file);
      toast.success(`Imported ${r.import.success} CPs!`);
      if (r.import.failed > 0) toast.error(`${r.import.failed} rows failed`);
      setShowImport(null); load();
    } catch(err) { toast.error(err.response?.data?.error || 'Import failed'); }
    finally { setImporting(false); }
  }

  async function handleRun(projectId, e) {
    e.stopPropagation();
    setRunning(projectId);
    try { await runAutomation(projectId); toast.success('Automation complete!'); load(); }
    catch { toast.error('Automation failed'); }
    finally { setRunning(null); }
  }

  const totalCPs = projects.reduce((s,p) => s+(p.total_cps||0), 0);
  const active   = projects.reduce((s,p) => s+(p.active_count||0), 0);
  const dormant  = projects.reduce((s,p) => s+(p.dormant_count||0), 0);
  const inactive = projects.reduce((s,p) => s+(p.inactive_count||0), 0);

  /* ── donut arc helper ── */
  const total312 = active + dormant + inactive || 1;
  const circumference = 2 * Math.PI * 26; // r=26
  const activeArc  = (active  / total312) * circumference;
  const dormantArc = (dormant / total312) * circumference;
  const inactiveArc= (inactive/ total312) * circumference;

  return (
    <div style={{ padding:'28px', fontFamily:"'Plus Jakarta Sans',sans-serif", minHeight:'100vh', background:'#FAF8F5' }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
        .pu{animation:fadeUp .38s ease both}
        .stagger>*:nth-child(1){animation-delay:.04s}
        .stagger>*:nth-child(2){animation-delay:.08s}
        .stagger>*:nth-child(3){animation-delay:.12s}
        .stagger>*:nth-child(4){animation-delay:.16s}
        .stagger>*:nth-child(5){animation-delay:.20s}
        .stagger>*:nth-child(6){animation-delay:.24s}
        .pcard:hover{border-color:#C4A8C4!important;transform:translateY(-3px)!important;box-shadow:0 10px 32px rgba(28,16,40,.11)!important}
        .qaBtn:hover{transform:translateY(-1px);opacity:.9}
        .niBtn:hover{background:#FAF8F5!important}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:16 }}>
        <div>
          <div style={{ fontSize:10, color:'#B0A494', letterSpacing:'.1em', textTransform:'uppercase', fontWeight:700, marginBottom:5, fontFamily:"'DM Mono',monospace" }}>
            {format(new Date(), 'EEEE, d MMMM yyyy')}
          </div>
          <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:28, fontWeight:800, color:'#1C1028', marginBottom:3, lineHeight:1 }}>Dashboard</h1>
          <p style={{ fontSize:13, color:'#9486A8' }}>
            Good {new Date().getHours()<12?'morning':'afternoon'}, {admin?.name?.split(' ')[0]} · {projects.length} {projects.length===1?'project':'projects'} active
          </p>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div style={{ fontSize:11, color:'#3D6B50', fontFamily:"'DM Mono',monospace", padding:'6px 12px', background:'#E8F0EB', border:'1px solid #BDD4C4', borderRadius:20, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:7, height:7, background:'#3D6B50', borderRadius:'50%', display:'inline-block' }} />Live
          </div>
          <PBtn onClick={() => setShowCreate(true)}>+ New Project</PBtn>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      {!loading && projects.length > 0 && (
        <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:24 }}>
          {[
            { label:'Total CPs', value:totalCPs, color:'#7B3D6E', sub:'↑ across all projects' },
            { label:'Active',    value:active,   color:'#3D6B50', sub:'47% of total', accent:'#E8F0EB', border:'#BDD4C4', dot:true },
            { label:'Dormant',   value:dormant,  color:'#9C6820', sub:'need attention', accent:'#F8F0E4', border:'#D9C09A', dot:true },
            { label:'Inactive',  value:inactive, color:'#A8391A', sub:'↑ flagged', accent:'#FBECE6', border:'#D9B4A0', dot:true },
            { label:'Projects',  value:projects.length, color:'#7B3D6E', sub:'Pune · Mumbai' },
          ].map((s,i) => (
            <div key={i} className="pu" style={{ animationDelay:`${i*.05}s`, padding:'14px 16px', background:'#FFFFFF', border:`1px solid ${s.border||'#EAE5DD'}`, borderRadius:13, boxShadow:'0 1px 4px rgba(28,16,40,.04)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                {s.dot && <span style={{ width:6, height:6, borderRadius:'50%', background:s.color, flexShrink:0 }} />}
                <span style={{ fontSize:9, fontWeight:800, letterSpacing:'.08em', textTransform:'uppercase', color:'#B0A494' }}>{s.label}</span>
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:26, fontWeight:500, color:s.color, lineHeight:1, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:10, color:'#C8BEAF' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── TWO-COLUMN CONTENT AREA ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:16 }}>

        {/* ── LEFT: PROJECT CARDS ── */}
        <div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'.1em', color:'#B0A494' }}>Active Projects</span>
            <span style={{ fontSize:11, color:'#7B3D6E', fontWeight:700, cursor:'pointer' }} onClick={() => {}}>View all →</span>
          </div>

          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ height:240, borderRadius:16, background:'#FFFFFF', border:'1px solid #EAE5DD', animation:'pulse 1.5s ease infinite' }} />)}
            </div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign:'center', padding:'80px 24px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:16 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🏗</div>
              <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:18, fontWeight:700, color:'#1C1028', marginBottom:8 }}>No projects yet</div>
              <div style={{ fontSize:13, color:'#9486A8', marginBottom:24 }}>Create your first project to start managing channel partners</div>
              <PBtn onClick={() => setShowCreate(true)}>Create first project</PBtn>
            </div>
          ) : (
            <div className="stagger" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
              {projects.map((p,i) => (
                <ProjectCard
                  key={p.id} project={p} index={i}
                  onOpen={() => navigate(`/projects/${p.id}`)}
                  onImport={e => { e.stopPropagation(); setShowImport(p.id); }}
                  onRun={e => handleRun(p.id, e)}
                  running={running===p.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

          {/* CP Distribution donut */}
          <div style={{ background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:14, padding:'16px 18px', boxShadow:'0 1px 6px rgba(28,16,40,.05)' }}>
            <div style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'.1em', color:'#B0A494', marginBottom:14, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              CP Distribution
              <span style={{ background:'#F0E8F0', color:'#7B3D6E', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:10, border:'1px solid rgba(123,61,110,.15)' }}>{totalCPs} total</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <svg width="76" height="76" viewBox="0 0 76 76" style={{ flexShrink:0 }}>
                <circle cx="38" cy="38" r="26" fill="none" stroke="#F0EBE3" strokeWidth="10"/>
                <circle cx="38" cy="38" r="26" fill="none" stroke="#3D6B50" strokeWidth="10"
                  strokeDasharray={`${activeArc} ${circumference}`} strokeDashoffset={circumference*0.25} transform="rotate(-90 38 38)"/>
                <circle cx="38" cy="38" r="26" fill="none" stroke="#9C6820" strokeWidth="10"
                  strokeDasharray={`${dormantArc} ${circumference}`} strokeDashoffset={-(activeArc - circumference*0.25)} transform="rotate(-90 38 38)"/>
                <circle cx="38" cy="38" r="26" fill="none" stroke="#A8391A" strokeWidth="10"
                  strokeDasharray={`${inactiveArc} ${circumference}`} strokeDashoffset={-(activeArc + dormantArc - circumference*0.25)} transform="rotate(-90 38 38)"/>
                <text x="38" y="43" textAnchor="middle" fill="#7B3D6E" fontSize="11" fontWeight="700" fontFamily="'DM Mono',monospace">{totalCPs}</text>
              </svg>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { label:'Active',   val:active,   color:'#3D6B50' },
                  { label:'Dormant',  val:dormant,  color:'#9C6820' },
                  { label:'Inactive', val:inactive, color:'#A8391A' },
                ].map(d => (
                  <div key={d.label} style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <span style={{ width:8, height:8, background:d.color, borderRadius:2, flexShrink:0 }} />
                    <span style={{ fontSize:11, color:'#6B5F7A', flex:1 }}>{d.label}</span>
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, fontWeight:500, color:d.color }}>{d.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:14, padding:'16px 18px', boxShadow:'0 1px 6px rgba(28,16,40,.05)' }}>
            <div style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'.1em', color:'#B0A494', marginBottom:12 }}>Quick Actions</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[
                { icon:'📨', label:'Bulk Message', bg:'#F0E8F0', color:'#7B3D6E', border:'rgba(123,61,110,.2)' },
                { icon:'▶',  label:'Run Auto',     bg:'#E8F0EB', color:'#24452E', border:'#BDD4C4' },
                { icon:'🚨', label:'Alert Inactive',bg:'#FBECE6', color:'#7A2412', border:'#D9B4A0' },
                { icon:'⬆',  label:'Import CSV',   bg:'#F0E8F0', color:'#5C2A52', border:'rgba(123,61,110,.15)' },
              ].map(a => (
                <button key={a.label} className="qaBtn"
                  style={{ padding:'10px 10px', background:a.bg, border:`1px solid ${a.border}`, borderRadius:10, cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:'inherit', color:a.color, display:'flex', alignItems:'center', gap:6, transition:'all .15s' }}>
                  <span style={{ fontSize:14 }}>{a.icon}</span>{a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:14, padding:'16px 18px', flex:1, boxShadow:'0 1px 6px rgba(28,16,40,.05)' }}>
            <div style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'.1em', color:'#B0A494', marginBottom:14, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              Recent Activity
              <span style={{ background:'#E8F0EB', color:'#3D6B50', fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:10, border:'1px solid #BDD4C4' }}>Live</span>
            </div>
            {[
              { dot:'#A8391A', text:<>Rahul Mehta flagged <strong style={{color:'#A8391A'}}>inactive</strong> — 22 days silent</>, time:'2m' },
              { dot:'#3D6B50', text:<>Priya Sharma closed deal <strong style={{color:'#3D6B50'}}>+1 unit</strong></>,             time:'14m' },
              { dot:'#9C6820', text:<>WhatsApp sent to <strong style={{color:'#9C6820'}}>12 dormant</strong> CPs</>,              time:'1h' },
              { dot:'#3D6B50', text:<>Amit Joshi re-activated — site visit booked</>,                                             time:'3h' },
              { dot:'#9C6820', text:<>Montaire Atrium — <strong style={{color:'#9C6820'}}>8 CPs</strong> imported via CSV</>,     time:'5h' },
            ].map((a,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:9, paddingBottom: i<4?10:0, marginBottom: i<4?10:0, borderBottom: i<4?'1px solid #F0EBE3':'none' }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:a.dot, flexShrink:0, marginTop:4 }} />
                <span style={{ fontSize:12, color:'#6B5F7A', flex:1, lineHeight:1.5 }}>{a.text}</span>
                <span style={{ fontSize:9, color:'#C8BEAF', fontFamily:"'DM Mono',monospace", flexShrink:0, marginTop:3 }}>{a.time}</span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── CREATE MODAL ── */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create new project">
        <form onSubmit={handleCreate} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Field label="Project name *"><Inp required placeholder="e.g. Regency Astra" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} /></Field>
          <Field label="Location"><Inp placeholder="e.g. Hadapsar, Pune" value={form.location} onChange={e => setForm(f=>({...f,location:e.target.value}))} /></Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <Field label="Total units"><Inp type="number" placeholder="300" value={form.total_units} onChange={e => setForm(f=>({...f,total_units:e.target.value}))} /></Field>
            <Field label="Premium units"><Inp type="number" placeholder="40" value={form.premium_inventory_count} onChange={e => setForm(f=>({...f,premium_inventory_count:e.target.value}))} /></Field>
          </div>
          <div style={{ display:'flex', gap:8, paddingTop:4 }}>
            <PBtn type="submit">Create project</PBtn>
            <PBtn variant="ghost" onClick={() => setShowCreate(false)}>Cancel</PBtn>
          </div>
        </form>
      </Modal>

      {/* ── IMPORT MODAL ── */}
      <Modal open={!!showImport} onClose={() => setShowImport(null)} title="Import channel partners">
        <ImportModal onImport={f => handleImport(showImport, f)} loading={importing} />
      </Modal>
    </div>
  );
}

/* ── PROJECT CARD ── */
function ProjectCard({ project:p, index, onOpen, onImport, onRun, running }) {
  return (
    <div className="pcard pu"
      onClick={onOpen}
      style={{
        animationDelay:`${index*.07}s`,
        background:'#FFFFFF', border:'1px solid #EAE5DD',
        borderRadius:16, overflow:'hidden', cursor:'pointer',
        transition:'all .22s', boxShadow:'0 1px 6px rgba(28,16,40,.05)',
      }}
    >
      {/* Head */}
      <div style={{ padding:'18px 20px 14px', borderBottom:'1px solid #F0EBE3' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ flex:1 }}>
            <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:15, fontWeight:800, color:'#1C1028', marginBottom:3, lineHeight:1.2 }}>{p.name}</h3>
            {p.location && <div style={{ fontSize:11, color:'#B0A494' }}>📍 {p.location}</div>}
          </div>
          <div style={{ background:'#F0E8F0', color:'#7B3D6E', fontSize:11, fontWeight:700, padding:'4px 11px', borderRadius:20, flexShrink:0, marginLeft:12, border:'1px solid rgba(123,61,110,.2)', fontFamily:"'DM Mono',monospace" }}>
            {p.total_cps||0} CPs
          </div>
        </div>
        {/* Bar */}
        {((p.active_count||0)+(p.dormant_count||0)+(p.inactive_count||0)) > 0 && (
          <div>
            <div style={{ display:'flex', height:5, borderRadius:4, overflow:'hidden', gap:2, marginBottom:8 }}>
              {(p.active_count||0)>0  && <div style={{ flex:p.active_count,  background:'#3D6B50', borderRadius:2 }} />}
              {(p.dormant_count||0)>0 && <div style={{ flex:p.dormant_count, background:'#9C6820', borderRadius:2 }} />}
              {(p.inactive_count||0)>0&& <div style={{ flex:p.inactive_count,background:'#A8391A', borderRadius:2 }} />}
            </div>
            <div style={{ display:'flex', gap:12, fontSize:10 }}>
              <span style={{ color:'#3D6B50', fontWeight:600 }}>● {p.active_count||0} active</span>
              <span style={{ color:'#9C6820', fontWeight:600 }}>● {p.dormant_count||0} dormant</span>
              <span style={{ color:'#A8391A', fontWeight:600 }}>● {p.inactive_count||0} inactive</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderBottom:'1px solid #F0EBE3' }}>
        {[
          { label:'Active',   val:p.active_count||0,   color:'#3D6B50' },
          { label:'Dormant',  val:p.dormant_count||0,  color:'#9C6820' },
          { label:'Inactive', val:p.inactive_count||0, color:'#A8391A' },
        ].map((s,i) => (
          <div key={i} style={{ textAlign:'center', padding:'10px 4px', borderRight:i<2?'1px solid #F0EBE3':'none' }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:20, fontWeight:500, color:s.color, lineHeight:1, marginBottom:3 }}>{s.val}</div>
            <div style={{ fontSize:9, color:'#B0A494', textTransform:'uppercase', letterSpacing:'.05em', fontWeight:700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ padding:'10px 14px', display:'flex', gap:6, background:'#FAF8F5' }} onClick={e => e.stopPropagation()}>
        <button className="niBtn" onClick={onImport}
          style={{ padding:'6px 12px', fontSize:11, fontWeight:600, background:'#FFFFFF', color:'#B0A494', border:'1px solid #EAE5DD', borderRadius:8, cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}>
          ⬆ Import
        </button>
        <button className="niBtn" onClick={onRun} disabled={running}
          style={{ padding:'6px 12px', fontSize:11, fontWeight:600, background:'#FFFFFF', color:'#B0A494', border:'1px solid #EAE5DD', borderRadius:8, cursor:'pointer', fontFamily:'inherit', transition:'all .15s', display:'flex', alignItems:'center', gap:5 }}>
          {running ? <span style={{ width:10, height:10, border:'2px solid #9486A8', borderTopColor:'transparent', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }} /> : '▶'} Automate
        </button>
        <button onClick={onOpen}
          style={{ padding:'6px 14px', fontSize:11, fontWeight:700, background:'#7B3D6E', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontFamily:'inherit', marginLeft:'auto', boxShadow:'0 2px 8px rgba(123,61,110,.25)' }}>
          View CPs →
        </button>
      </div>
    </div>
  );
}

/* ── IMPORT MODAL ── */
function ImportModal({ onImport, loading }) {
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  return (
    <div>
      <p style={{ fontSize:13, color:'#9486A8', marginBottom:16, lineHeight:1.6 }}>Upload a CSV with CP data. Columns: name, whatsapp, email, area, site_visits, deals_closed, last_active_at.</p>
      <a href="data:text/csv;charset=utf-8,name,email,whatsapp,firm_name,area,site_visits,client_referrals,deals_closed,last_active_at%0ARahul Mehta,rahul@example.com,9876543210,Mehta Properties,Andheri West,12,3,1,2025-05-20" download="cp_template.csv"
        style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 12px', background:'#F0E8F0', border:'1px solid rgba(123,61,110,.2)', borderRadius:8, fontSize:12, color:'#7B3D6E', marginBottom:16, textDecoration:'none', fontWeight:600 }}>
        ⬇ Download template
      </a>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); const f=e.dataTransfer.files[0]; if(f) setFile(f); }}
        onClick={() => document.getElementById('csv-inp-db').click()}
        style={{ border:`2px dashed ${drag?'#7B3D6E':'#EAE5DD'}`, borderRadius:12, padding:'32px 20px', textAlign:'center', background:drag?'rgba(123,61,110,.04)':'#FAFAF8', cursor:'pointer', marginBottom:14, transition:'all .15s' }}>
        <input id="csv-inp-db" type="file" accept=".csv" hidden onChange={e => setFile(e.target.files[0])} />
        <div style={{ fontSize:28, marginBottom:8 }}>📄</div>
        {file ? (
          <>
            <div style={{ fontSize:13, fontWeight:700, color:'#1C1028', marginBottom:3 }}>{file.name}</div>
            <div style={{ fontSize:11, color:'#9486A8' }}>{(file.size/1024).toFixed(1)} KB</div>
          </>
        ) : (
          <>
            <div style={{ fontSize:13, fontWeight:600, color:'#9486A8', marginBottom:4 }}>Drop CSV here or click to browse</div>
            <div style={{ fontSize:11, color:'#C8BEAF' }}>Max 10MB · .csv only</div>
          </>
        )}
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <PBtn loading={loading} disabled={!file||loading} onClick={() => onImport(file)}>Import CPs</PBtn>
        <PBtn variant="ghost" onClick={() => setFile(null)}>Clear</PBtn>
      </div>
    </div>
  );
}
