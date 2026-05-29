// src/pages/Messages.js
import { useState, useEffect } from 'react';
import { getProjects, getMessages } from '../services/api';
import { formatDistanceToNow, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_META = {
  sent:      { color:'#3D6B50', bg:'#E8F0EB', label:'Sent'      },
  delivered: { color:'#3D6B50', bg:'#E8F0EB', label:'Delivered' },
  read:      { color:'#7B3D6E', bg:'#F0E8F0', label:'Read'      },
  failed:    { color:'#A8391A', bg:'#FBECE6', label:'Failed'     },
  pending:   { color:'#9C6820', bg:'#F8F0E4', label:'Pending'    },
};

const TRIGGER_LABELS = {
  inactivity_7d:      '⏰ 7-day inactivity',
  inactivity_14d:     '⚠️ 14-day warning',
  inactivity_meeting: '📅 Meeting notice',
  dormant_support:    '🤝 Dormant support',
  active_perk:        '🎁 Active perk',
  no_conversation:    '💬 No conversation',
  performance_drop:   '📉 Performance drop',
  manual:             '✏️ Manual',
  daily_summary:      '📊 Daily summary',
};

export default function Messages() {
  const [projects, setProjects]   = useState([]);
  const [projectId, setProjectId] = useState('');
  const [messages, setMessages]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState('');
  const [page, setPage]           = useState(1);
  const [expanded, setExpanded]   = useState(null);
  const LIMIT = 30;

  useEffect(() => {
    getProjects()
      .then(ps => { setProjects(ps); if (ps[0]) setProjectId(ps[0].id); })
      .catch(() => toast.error('Failed to load projects'));
  }, []);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    getMessages(projectId, { status, page, limit:LIMIT })
      .then(d => { setMessages(d.messages||[]); setTotal(d.total||0); })
      .catch(() => toast.error('Failed to load messages'))
      .finally(() => setLoading(false));
  }, [projectId, status, page]);

  const stats = messages.reduce((acc,m) => { acc[m.status]=(acc[m.status]||0)+1; return acc; }, {});

  return (
    <div style={{ padding:'28px', fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#FAF8F5', minHeight:'100vh' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} .msgrow:hover td{background:#FAF8F5!important}`}</style>

      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:24, fontWeight:800, color:'#1C1028', marginBottom:4 }}>Messages</h1>
        <p style={{ fontSize:13, color:'#9486A8' }}>WhatsApp message history across all channel partners</p>
      </div>

      {/* Stats strip */}
      {messages.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:8, marginBottom:20 }}>
          {Object.entries(STATUS_META).map(([key,meta]) => (
            <div key={key} style={{ padding:'12px 14px', background:'#FFFFFF', border:`1px solid ${meta.bg}`, borderRadius:12, boxShadow:'0 1px 4px rgba(28,16,40,.04)' }}>
              <div style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'.07em', color:'#B0A494', marginBottom:5 }}>{meta.label}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:22, fontWeight:500, color:meta.color }}>{stats[key]||0}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ padding:'12px 16px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:14, marginBottom:14, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center', boxShadow:'0 1px 4px rgba(28,16,40,.04)' }}>
        <select value={projectId} onChange={e => { setProjectId(e.target.value); setPage(1); }}
          style={{ padding:'7px 12px', fontSize:13, background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:8, color:'#1C1028', outline:'none' }}>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {[{ value:'', label:'All' }, ...Object.entries(STATUS_META).map(([v,m]) => ({ value:v, label:m.label }))].map(s => (
            <button key={s.value} onClick={() => { setStatus(s.value); setPage(1); }}
              style={{
                padding:'5px 12px', fontSize:11, fontWeight:700, borderRadius:20, cursor:'pointer', fontFamily:'inherit',
                border:`1px solid ${status===s.value ? (STATUS_META[s.value]?.color||'#7B3D6E') : '#EAE5DD'}`,
                background: status===s.value ? (STATUS_META[s.value]?.bg||'#F0E8F0') : 'transparent',
                color: status===s.value ? (STATUS_META[s.value]?.color||'#7B3D6E') : '#9486A8',
                transition:'all .15s',
              }}>
              {s.label}
            </button>
          ))}
        </div>
        <span style={{ marginLeft:'auto', fontSize:12, color:'#B0A494', fontFamily:"'DM Mono',monospace" }}>{total} messages</span>
      </div>

      {/* Table */}
      <div style={{ background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:16, overflow:'hidden', boxShadow:'0 1px 6px rgba(28,16,40,.05)' }}>
        {loading ? (
          <div style={{ padding:52, display:'flex', justifyContent:'center' }}>
            <span style={{ width:28, height:28, border:'3px solid rgba(123,61,110,.2)', borderTopColor:'#7B3D6E', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />
          </div>
        ) : messages.length===0 ? (
          <div style={{ textAlign:'center', padding:'60px 24px' }}>
            <div style={{ fontSize:40, marginBottom:14 }}>💬</div>
            <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:16, fontWeight:700, color:'#1C1028', marginBottom:8 }}>No messages found</div>
            <div style={{ fontSize:13, color:'#9486A8' }}>Messages appear here after automation runs or you send manually</div>
          </div>
        ) : (
          <>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#FAF8F5', borderBottom:'1px solid #EAE5DD' }}>
                  {['Channel Partner','Type','Preview','Channel','Status','Sent'].map(h => (
                    <th key={h} style={{ padding:'11px 14px', fontSize:10, fontWeight:800, color:'#B0A494', textAlign:'left', textTransform:'uppercase', letterSpacing:'.07em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => {
                  const sm = STATUS_META[m.status]||STATUS_META.pending;
                  const isExpanded = expanded===m.id;
                  return (
                    <>
                      <tr key={m.id} className="msgrow"
                        style={{ borderBottom:'1px solid #F0EBE3', transition:'background .1s', cursor:'pointer' }}
                        onClick={() => setExpanded(isExpanded ? null : m.id)}>
                        <td style={{ padding:'11px 14px' }}>
                          <div style={{ fontSize:13, fontWeight:700, color:'#1C1028' }}>{m.cp?.name||'—'}</div>
                          {m.cp?.whatsapp && <div style={{ fontSize:11, color:'#B0A494' }}>+{m.cp.whatsapp}</div>}
                        </td>
                        <td style={{ padding:'11px 14px' }}>
                          <span style={{ fontSize:11, padding:'3px 10px', background:'#F5F2EE', borderRadius:20, fontWeight:700, color:'#9486A8', whiteSpace:'nowrap' }}>
                            {TRIGGER_LABELS[m.trigger_type]||m.trigger_type||'manual'}
                          </span>
                        </td>
                        <td style={{ padding:'11px 14px', maxWidth:260 }}>
                          <span style={{ fontSize:12, color:'#9486A8', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.message_body}</span>
                        </td>
                        <td style={{ padding:'11px 14px' }}>
                          <span style={{ fontSize:11, color:'#B0A494' }}>📱 {m.channel||'whatsapp'}</span>
                        </td>
                        <td style={{ padding:'11px 14px' }}>
                          <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:sm.bg, color:sm.color }}>● {sm.label}</span>
                        </td>
                        <td style={{ padding:'11px 14px', fontSize:11, color:'#B0A494', whiteSpace:'nowrap' }}>
                          {m.sent_at ? formatDistanceToNow(parseISO(m.sent_at),{addSuffix:true}) : '—'}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${m.id}-exp`} style={{ background:'#FAF8F5', borderBottom:'1px solid #F0EBE3' }}>
                          <td colSpan={6} style={{ padding:'14px 18px' }}>
                            <div style={{ fontSize:12, color:'#4A3D5C', lineHeight:1.7, background:'#FFFFFF', padding:'12px 14px', borderRadius:10, border:'1px solid #EAE5DD', whiteSpace:'pre-wrap' }}>
                              {m.message_body}
                            </div>
                            {m.error_details && (
                              <div style={{ marginTop:8, fontSize:11, color:'#7A2412', background:'#FBECE6', padding:'8px 12px', borderRadius:8, border:'1px solid #D9B4A0' }}>
                                ⚠ Error: {m.error_details}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>

            {total > LIMIT && (
              <div style={{ padding:'12px 16px', borderTop:'1px solid #EAE5DD', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#FAF8F5' }}>
                <span style={{ fontSize:12, color:'#B0A494' }}>Showing {(page-1)*LIMIT+1}–{Math.min(page*LIMIT,total)} of {total}</span>
                <div style={{ display:'flex', gap:6 }}>
                  {[{ label:'← Prev', disabled:page===1, action:()=>setPage(p=>p-1) },
                    { label:'Next →', disabled:page*LIMIT>=total, action:()=>setPage(p=>p+1) }].map(b => (
                    <button key={b.label} disabled={b.disabled} onClick={b.action}
                      style={{ padding:'6px 14px', fontSize:12, fontWeight:600, background:'#FFFFFF', color:b.disabled?'#C8BEAF':'#7B3D6E', border:`1px solid ${b.disabled?'#EAE5DD':'rgba(123,61,110,.25)'}`, borderRadius:8, cursor:b.disabled?'default':'pointer', fontFamily:'inherit', transition:'all .15s' }}>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
