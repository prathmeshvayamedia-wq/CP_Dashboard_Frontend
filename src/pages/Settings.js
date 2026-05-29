// src/pages/Settings.js
import { useState, useEffect } from 'react';
import { getProjects, getTierRules, updateTierRules } from '../services/api';
import toast from 'react-hot-toast';

function Field({ label, hint, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <label style={{ fontSize:11, fontWeight:700, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.07em' }}>{label}</label>
        {hint && <span style={{ fontSize:10, color:'#C8BEAF' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function NumInput({ value, onChange, min=0, suffix }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
      <input
        type="number" min={min} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width:'100%', padding:'10px 12px', paddingRight: suffix ? 42 : 12,
          fontSize:15, fontWeight:700,
          background: focused ? 'rgba(123,61,110,.04)' : '#FAFAF8',
          border:`1px solid ${focused ? 'rgba(123,61,110,.5)' : '#EAE5DD'}`,
          borderRadius:10, color:'#1C1028', outline:'none',
          transition:'all .15s', boxSizing:'border-box',
          fontFamily:"'DM Mono',monospace",
        }}
      />
      {suffix && <span style={{ position:'absolute', right:12, fontSize:11, color:'#B0A494', pointerEvents:'none' }}>{suffix}</span>}
    </div>
  );
}

function RuleCard({ accent, icon, title, desc, children }) {
  return (
    <div style={{
      background:'#FFFFFF', border:'1px solid #EAE5DD',
      borderLeft:`3px solid ${accent}`,
      borderRadius:16, padding:'22px 24px', marginBottom:14,
      boxShadow:'0 1px 6px rgba(28,16,40,.05)',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
        <span style={{ fontSize:18 }}>{icon}</span>
        <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:14, fontWeight:700, color:'#1C1028' }}>{title}</h3>
      </div>
      <p style={{ fontSize:12, color:'#9486A8', marginBottom:18, lineHeight:1.6 }}>{desc}</p>
      {children}
    </div>
  );
}

export default function Settings() {
  const [projects, setProjects]   = useState([]);
  const [projectId, setProjectId] = useState('');
  const [rules, setRules]         = useState(null);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);

  useEffect(() => {
    getProjects()
      .then(ps => { setProjects(ps); if (ps[0]) setProjectId(ps[0].id); })
      .catch(() => toast.error('Failed to load projects'));
  }, []);

  useEffect(() => {
    if (!projectId) return;
    setRules(null);
    getTierRules(projectId)
      .then(setRules)
      .catch(() => {
        setRules({ active_min_visits:5, active_min_deals:1, dormant_min_visits:1, dormant_min_deals:0, inactivity_warning_days:7, inactivity_critical_days:14, inactivity_meeting_days:21 });
      });
  }, [projectId]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateTierRules(projectId, rules);
      toast.success('Rules saved!');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  }

  const upd = (key) => (e) => setRules(r => ({ ...r, [key]: Number(e.target.value) }));

  return (
    <div style={{ padding:'28px', fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#FAF8F5', minHeight:'100vh' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:24, fontWeight:800, color:'#1C1028', marginBottom:4 }}>Settings</h1>
        <p style={{ fontSize:13, color:'#9486A8' }}>Configure tier rules and automation thresholds per project</p>
      </div>

      {/* Project selector */}
      <div style={{ padding:'14px 18px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:14, marginBottom:24, display:'flex', alignItems:'center', gap:14, boxShadow:'0 1px 4px rgba(28,16,40,.04)' }}>
        <span style={{ fontSize:12, fontWeight:700, color:'#B0A494', textTransform:'uppercase', letterSpacing:'.07em' }}>Project</span>
        <select value={projectId} onChange={e => setProjectId(e.target.value)}
          style={{ flex:1, padding:'8px 12px', fontSize:13, fontWeight:600, background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:9, color:'#1C1028', outline:'none' }}>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {!rules ? (
        <div style={{ display:'flex', justifyContent:'center', paddingTop:40 }}>
          <span style={{ width:28, height:28, border:'3px solid rgba(123,61,110,.2)', borderTopColor:'#7B3D6E', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />
        </div>
      ) : (
        <form onSubmit={handleSave}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
            <div style={{ paddingRight:14 }}>

              <RuleCard accent="#3D6B50" icon="✅" title="Active tier thresholds"
                desc="CPs meeting these minimums in the current period are classified as Active.">
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <Field label="Min site visits"><NumInput value={rules.active_min_visits} onChange={upd('active_min_visits')} min={0} /></Field>
                  <Field label="Min deals closed"><NumInput value={rules.active_min_deals} onChange={upd('active_min_deals')} min={0} /></Field>
                </div>
              </RuleCard>

              <RuleCard accent="#9C6820" icon="💤" title="Dormant tier thresholds"
                desc="CPs below Active but meeting these minimums are classified as Dormant.">
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <Field label="Min site visits"><NumInput value={rules.dormant_min_visits} onChange={upd('dormant_min_visits')} min={0} /></Field>
                  <Field label="Min deals closed"><NumInput value={rules.dormant_min_deals} onChange={upd('dormant_min_deals')} min={0} /></Field>
                </div>
              </RuleCard>

            </div>
            <div style={{ paddingLeft:14 }}>

              <RuleCard accent="#A8391A" icon="⏰" title="Inactivity thresholds"
                desc="Days without activity that trigger escalating WhatsApp messages and meeting scheduling.">
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <Field label="Warning message" hint="days inactive">
                    <NumInput value={rules.inactivity_warning_days} onChange={upd('inactivity_warning_days')} min={1} suffix="days" />
                  </Field>
                  <Field label="Critical warning" hint="days inactive">
                    <NumInput value={rules.inactivity_critical_days} onChange={upd('inactivity_critical_days')} min={1} suffix="days" />
                  </Field>
                  <Field label="Schedule meeting" hint="days inactive">
                    <NumInput value={rules.inactivity_meeting_days} onChange={upd('inactivity_meeting_days')} min={1} suffix="days" />
                  </Field>
                </div>
              </RuleCard>

              {/* Info card */}
              <div style={{ padding:'16px 18px', background:'#F0E8F0', border:'1px solid rgba(123,61,110,.2)', borderRadius:14, marginBottom:14 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#5C2A52', marginBottom:6 }}>📋 How tiers work</div>
                <ul style={{ fontSize:12, color:'#7B3D6E', lineHeight:1.7, paddingLeft:16 }}>
                  <li>Automation runs daily or on-demand</li>
                  <li>Each CP is scored and re-tiered automatically</li>
                  <li>WhatsApp messages fire based on tier + inactivity</li>
                  <li>Changes apply from the next automation run</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Save button */}
          <div style={{ display:'flex', alignItems:'center', gap:12, paddingTop:8 }}>
            <button type="submit" disabled={saving}
              style={{
                padding:'10px 24px', fontSize:13, fontWeight:700,
                background:'#7B3D6E', color:'#fff', border:'none', borderRadius:10,
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow:'0 2px 12px rgba(123,61,110,.28)',
                opacity: saving ? .7 : 1, transition:'all .15s',
                display:'flex', alignItems:'center', gap:8, fontFamily:'inherit',
              }}>
              {saving && <span style={{ width:13, height:13, border:'2px solid rgba(255,255,255,.4)', borderTopColor:'#fff', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />}
              {saving ? 'Saving…' : 'Save rules'}
            </button>
            {saved && <span style={{ fontSize:13, color:'#3D6B50', fontWeight:700 }}>✓ Saved successfully</span>}
          </div>
        </form>
      )}
    </div>
  );
}
