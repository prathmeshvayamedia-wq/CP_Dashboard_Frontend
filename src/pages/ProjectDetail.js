// // src/pages/ProjectDetail.js
// import { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getCPs, getAnalytics, sendBulkMessage, importCSV, runAutomation } from '../services/api';
// import { Card, Badge, Btn, Avatar, ProgressBar, Modal, StatCard, Empty, Spinner } from '../components/ui';
// import toast from 'react-hot-toast';
// import { formatDistanceToNow } from 'date-fns';

// const PERIODS = [
//   { value: 'weekly',  label: 'Week' },
//   { value: 'monthly', label: 'Month' },
//   { value: 'yearly',  label: 'Year' },
// ];

// const TIERS = [
//   { value: '',         label: 'All' },
//   { value: 'active',   label: 'Active' },
//   { value: 'dormant',  label: 'Dormant' },
//   { value: 'inactive', label: 'Inactive' },
// ];

// const TRIGGER_OPTIONS = [
//   { value: 'dormant_support',   label: 'Dormant support message' },
//   { value: 'inactivity_7d',     label: '7-day inactivity reminder' },
//   { value: 'inactivity_14d',    label: '14-day inactivity warning' },
//   { value: 'active_perk',       label: 'Active perk / reward' },
//   { value: 'no_conversation',   label: 'No conversation reminder' },
//   { value: 'manual',            label: 'Custom message' },
// ];

// const tierAccent = {
//   active:   '#5A8A6E',
//   dormant:  '#7B3D6E',
//   inactive: '#C4694A',
// };

// /* ── Inline stat strip card ────────────────────────────────────── */
// function MiniStat({ label, value, accent }) {
//   return (
//     <div style={{
//       padding: '14px 18px',
//       background: '#FFFFFF',
//       border: '1px solid #EAE5DD',
//       borderRadius: 10,
//     }}>
//       <div style={{
//         fontSize: 9, fontWeight: 600, letterSpacing: '.09em',
//         textTransform: 'uppercase', color: '#4A4640', marginBottom: 8,
//         display: 'flex', alignItems: 'center', gap: 6,
//       }}>
//         {accent && (
//           <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, display: 'inline-block' }} />
//         )}
//         {label}
//       </div>
//       <div style={{
//         fontFamily: "'IBM Plex Mono', monospace",
//         fontSize: 22, fontWeight: 500, color: accent || '#E8E4DC',
//       }}>
//         {value}
//       </div>
//     </div>
//   );
// }

// export default function ProjectDetail() {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const [cps, setCps]             = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading]     = useState(true);
//   const [period, setPeriod]       = useState('monthly');
//   const [tier, setTier]           = useState('');
//   const [search, setSearch]       = useState('');
//   const [page, setPage]           = useState(1);
//   const [total, setTotal]         = useState(0);
//   const [bulkModal, setBulkModal] = useState(null);
//   const [running, setRunning]     = useState(false);
//   const LIMIT = 25;

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [cpData, analyticsData] = await Promise.all([
//         getCPs(projectId, { period, tier, search, page, limit: LIMIT }),
//         getAnalytics(projectId, period),
//       ]);
//       setCps(cpData.cps || []);
//       setTotal(cpData.total || 0);
//       setAnalytics(analyticsData);
//     } catch { toast.error('Failed to load data'); }
//     finally { setLoading(false); }
//   }, [projectId, period, tier, search, page]);

//   useEffect(() => { load(); }, [load]);
//   useEffect(() => { setPage(1); }, [search, tier, period]);

//   async function handleRunAutomation() {
//     setRunning(true);
//     try {
//       await runAutomation(projectId);
//       toast.success('Automation complete.');
//       load();
//     } catch { toast.error('Automation failed'); }
//     finally { setRunning(false); }
//   }

//   async function handleBulkSend({ tier: t, triggerType, text }) {
//     try {
//       const result = await sendBulkMessage(projectId, { tier: t, triggerType, text });
//       toast.success(`Sent to ${result.sent} CPs.`);
//       setBulkModal(null);
//     } catch { toast.error('Bulk send failed'); }
//   }

//   return (
//     <div style={{ padding: 32, fontFamily: "'DM Sans', sans-serif" }}>

//       {/* ── Breadcrumb ── */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 12 }}>
//         <button
//           onClick={() => navigate('/dashboard')}
//           style={{
//             background: 'none', border: 'none',
//             color: '#5A5650', cursor: 'pointer',
//             fontFamily: "'DM Sans', sans-serif",
//             fontSize: 12, padding: 0,
//             transition: 'color .15s',
//           }}
//           onMouseEnter={e => e.target.style.color = '#A0A09A'}
//           onMouseLeave={e => e.target.style.color = '#5A5650'}
//         >
//           Projects
//         </button>
//         <span style={{ color: '#3A3A36' }}>/</span>
//         <span style={{ color: '#A0A09A', fontSize: 12 }}>{analytics?.project_name || 'Project'}</span>
//       </div>

//       {/* ── Page header ── */}
//       <div style={{
//         display: 'flex', alignItems: 'flex-start',
//         justifyContent: 'space-between', marginBottom: 24,
//         flexWrap: 'wrap', gap: 12,
//       }}>
//         <div>
//           <h1 style={{
//             fontFamily: "'Syne', sans-serif",
//             fontSize: 24, fontWeight: 700, letterSpacing: '-.02em',
//             color: '#F2EEE6', marginBottom: 4,
//           }}>
//             {analytics?.project_name || 'Project'}
//           </h1>
//           <p style={{ fontSize: 13, color: '#5A5650' }}>
//             <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{total}</span>
//             {' '}channel partners
//             <span style={{ margin: '0 8px', opacity: .4 }}>·</span>
//             {period}
//           </p>
//         </div>
//         <div style={{ display: 'flex', gap: 8 }}>
//           <button
//             onClick={handleRunAutomation}
//             disabled={running}
//             style={{
//               padding: '8px 16px', fontSize: 12, fontWeight: 500,
//               border: '1px solid #D9CAAE',
//               background: '#FFFFFF',
//               color: '#A0A09A', borderRadius: 8, cursor: running ? 'wait' : 'pointer',
//               fontFamily: "'DM Sans', sans-serif",
//               opacity: running ? .6 : 1,
//               transition: 'all .15s',
//             }}
//           >
//             {running ? 'Running…' : '▸ Run automation'}
//           </button>
//           <button
//             onClick={() => setBulkModal('bulk')}
//             style={{
//               padding: '8px 16px', fontSize: 12, fontWeight: 600,
//               background: 'linear-gradient(135deg,#7B3D6E,#5C2A52)',
//               color: '#0D0C09', border: 'none', borderRadius: 8,
//               cursor: 'pointer', fontFamily: "'Syne', sans-serif",
//               boxShadow: '0 3px 14px rgba(201,151,61,.22)',
//               transition: 'transform .15s',
//             }}
//             onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
//             onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
//           >
//             Bulk message
//           </button>
//         </div>
//       </div>

//       {/* ── Analytics strip ── */}
//       {analytics && (
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
//           gap: 10, marginBottom: 22,
//         }}>
//           <MiniStat label="Active"     value={analytics.tier_distribution?.active   || 0} accent="#5A8A6E" />
//           <MiniStat label="Dormant"    value={analytics.tier_distribution?.dormant  || 0} accent="#7B3D6E" />
//           <MiniStat label="Inactive"   value={analytics.tier_distribution?.inactive || 0} accent="#C4694A" />
//           <MiniStat label="Msgs sent"  value={analytics.messages?.by_status?.sent   || 0} />
//           <MiniStat label="Failed"     value={analytics.messages?.by_status?.failed || 0} accent="#C4694A" />
//         </div>
//       )}

//       {/* ── Filters bar ── */}
//       <div style={{
//         padding: '11px 16px',
//         background: '#FFFFFF',
//         border: '1px solid #EAE5DD',
//         borderRadius: 10, marginBottom: 14,
//         display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
//       }}>
//         {/* Search */}
//         <div style={{ position: 'relative', flex: '1 1 200px' }}>
//           <svg
//             width="13" height="13" viewBox="0 0 13 13" fill="none"
//             style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
//           >
//             <circle cx="5.5" cy="5.5" r="4" stroke="rgba(255,255,255,.25)" strokeWidth="1.3"/>
//             <path d="M9 9l2.5 2.5" stroke="rgba(255,255,255,.25)" strokeWidth="1.3" strokeLinecap="round"/>
//           </svg>
//           <input
//             placeholder="Search by name, area, phone…"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             style={{
//               width: '100%', padding: '7px 10px 7px 30px', fontSize: 13,
//               border: '1px solid #EAE5DD',
//               borderRadius: 7,
//               background: '#FFFFFF', color: '#E8E4DC', outline: 'none',
//               fontFamily: "'DM Sans', sans-serif",
//               transition: 'border-color .15s',
//             }}
//             onFocus={e => e.target.style.borderColor = 'rgba(201,151,61,.5)'}
//             onBlur={e => e.target.style.borderColor = '#EAE5DD'}
//           />
//         </div>

//         {/* Period toggle */}
//         <div style={{
//           display: 'flex', background: '#F5F2EE',
//           borderRadius: 7, padding: 3, gap: 2,
//         }}>
//           {PERIODS.map(p => (
//             <button key={p.value} onClick={() => setPeriod(p.value)}
//               style={{
//                 padding: '4px 12px', fontSize: 12, fontWeight: 500,
//                 border: 'none', borderRadius: 5, cursor: 'pointer',
//                 background: period === p.value ? '#D9CAAE' : 'transparent',
//                 color: period === p.value ? '#E8E4DC' : '#5A5650',
//                 fontFamily: "'DM Sans', sans-serif",
//                 transition: 'all .15s',
//               }}
//             >
//               {p.label}
//             </button>
//           ))}
//         </div>

//         {/* Tier pills */}
//         <div style={{ display: 'flex', gap: 4 }}>
//           {TIERS.map(t => (
//             <button key={t.value} onClick={() => setTier(t.value)}
//               style={{
//                 padding: '4px 12px', fontSize: 11, fontWeight: 600,
//                 letterSpacing: '.04em',
//                 border: `1px solid ${tier === t.value
//                   ? (t.value ? tierAccent[t.value] : 'rgba(255,255,255,.3)')
//                   : '#EAE5DD'}`,
//                 borderRadius: 20, cursor: 'pointer',
//                 background: tier === t.value
//                   ? t.value ? `${tierAccent[t.value]}18` : '#EAE5DD'
//                   : 'transparent',
//                 color: tier === t.value
//                   ? t.value ? tierAccent[t.value] : '#E8E4DC'
//                   : '#5A5650',
//                 fontFamily: "'DM Sans', sans-serif",
//                 transition: 'all .15s',
//               }}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>

//         {tier && (
//           <button
//             onClick={() => setBulkModal(tier)}
//             style={{
//               padding: '5px 13px', fontSize: 11, fontWeight: 500,
//               border: '1px solid #EAE5DD',
//               background: '#FFFFFF',
//               color: '#8A8680', borderRadius: 7, cursor: 'pointer',
//               fontFamily: "'DM Sans', sans-serif",
//             }}
//           >
//             Message all {tier}
//           </button>
//         )}
//       </div>

//       {/* ── CP Table ── */}
//       <div style={{
//         border: '1px solid #EAE5DD',
//         borderRadius: 12, overflow: 'hidden',
//         background: '#FAFAF8',
//       }}>
//         {loading ? (
//           <div style={{ padding: 56, display: 'flex', justifyContent: 'center' }}>
//             <Spinner size={26} color="#7B3D6E" />
//           </div>
//         ) : cps.length === 0 ? (
//           <Empty title="No CPs found" sub="Try adjusting your filters or import CPs to get started." />
//         ) : (
//           <>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr style={{ borderBottom: '1px solid #EAE5DD' }}>
//                   {['Channel partner', 'Site visits', 'Deals', 'Score', 'Last active', 'Tier', ''].map(h => (
//                     <th key={h} style={{
//                       padding: '11px 16px', fontSize: 10, fontWeight: 600,
//                       color: '#4A4640', textAlign: 'left',
//                       textTransform: 'uppercase', letterSpacing: '.08em',
//                       background: '#FAFAF8',
//                     }}>
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {cps.map((row, i) => (
//                   <CPRow
//                     key={row.cp?.id}
//                     row={row}
//                     index={i}
//                     projectId={projectId}
//                     onMessage={() => navigate(`/projects/${projectId}/cps/${row.cp?.id}`)}
//                   />
//                 ))}
//               </tbody>
//             </table>

//             {total > LIMIT && (
//               <div style={{
//                 padding: '12px 18px',
//                 borderTop: '1px solid #EAE5DD',
//                 display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               }}>
//                 <span style={{ fontSize: 12, color: '#4A4640', fontFamily: "'IBM Plex Mono', monospace" }}>
//                   {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
//                 </span>
//                 <div style={{ display: 'flex', gap: 6 }}>
//                   {[{ label: '← Prev', disabled: page === 1, fn: () => setPage(p => p - 1) },
//                     { label: 'Next →', disabled: page * LIMIT >= total, fn: () => setPage(p => p + 1) }].map(b => (
//                     <button
//                       key={b.label}
//                       disabled={b.disabled}
//                       onClick={b.fn}
//                       style={{
//                         padding: '5px 12px', fontSize: 12, borderRadius: 7,
//                         border: '1px solid #EAE5DD',
//                         background: 'transparent', color: b.disabled ? '#3A3A36' : '#8A8680',
//                         cursor: b.disabled ? 'default' : 'pointer',
//                         fontFamily: "'DM Sans', sans-serif",
//                       }}
//                     >
//                       {b.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ── Bulk message modal ── */}
//       <BulkMessageModal
//         open={!!bulkModal}
//         tier={bulkModal}
//         onClose={() => setBulkModal(null)}
//         onSend={handleBulkSend}
//       />
//     </div>
//   );
// }

// /* ── CP Table row ──────────────────────────────────────────────── */
// function CPRow({ row, index, projectId, onMessage }) {
//   const navigate = useNavigate();
//   const cp       = row.cp || {};
//   const [hov, setHov] = useState(false);
//   const inactiveDays = row.activity?.last_active_at
//     ? Math.floor((Date.now() - new Date(row.activity.last_active_at)) / 86400000)
//     : null;
//   const score = row.activity?.score || 0;
//   const scoreColor = score >= 60 ? '#5A8A6E' : score >= 30 ? '#7B3D6E' : '#C4694A';

//   return (
//     <tr
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       onClick={() => navigate(`/projects/${projectId}/cps/${cp.id}`)}
//       className="animate-fadeUp"
//       style={{
//         borderBottom: '1px solid #F5F2EE',
//         background: hov ? '#FFFFFF' : 'transparent',
//         cursor: 'pointer', transition: 'background .1s',
//         animationDelay: `${index * 0.03}s`,
//       }}
//     >
//       {/* Name + meta */}
//       <td style={{ padding: '13px 16px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           <Avatar name={cp.name} size={32} index={index} />
//           <div>
//             <div style={{ fontSize: 13, fontWeight: 500, color: '#E8E4DC' }}>{cp.name}</div>
//             <div style={{ fontSize: 11, color: '#4A4640', marginTop: 1 }}>
//               {cp.area}{cp.firm_name ? ` · ${cp.firm_name}` : ''}
//             </div>
//           </div>
//         </div>
//       </td>

//       {/* Site visits */}
//       <td style={{ padding: '13px 16px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <div style={{ flex: 1, maxWidth: 80, height: 3, background: '#EAE5DD', borderRadius: 2 }}>
//             <div style={{
//               height: '100%', borderRadius: 2,
//               background: '#7B3D6E',
//               width: `${Math.min(100, ((row.activity?.site_visits || 0) / 20) * 100)}%`,
//             }} />
//           </div>
//           <span style={{
//             fontSize: 12, color: '#7A7570',
//             fontFamily: "'IBM Plex Mono', monospace",
//           }}>
//             {row.activity?.site_visits || 0}
//           </span>
//         </div>
//       </td>

//       {/* Deals */}
//       <td style={{ padding: '13px 16px' }}>
//         <span style={{
//           fontSize: 13, fontWeight: 600, color: '#E8E4DC',
//           fontFamily: "'IBM Plex Mono', monospace",
//         }}>
//           {row.activity?.deals_closed || 0}
//         </span>
//       </td>

//       {/* Score */}
//       <td style={{ padding: '13px 16px' }}>
//         <span style={{ fontSize: 13, fontWeight: 600, color: scoreColor, fontFamily: "'IBM Plex Mono', monospace" }}>
//           {score}
//         </span>
//         <span style={{ fontSize: 10, color: '#3A3A36' }}>/100</span>
//       </td>

//       {/* Last active */}
//       <td style={{ padding: '13px 16px' }}>
//         {row.activity?.last_active_at ? (
//           <div>
//             <div style={{ fontSize: 12, color: '#8A8680' }}>
//               {formatDistanceToNow(new Date(row.activity.last_active_at), { addSuffix: true })}
//             </div>
//             {inactiveDays !== null && inactiveDays >= 7 && (
//               <div style={{ fontSize: 10, color: '#C4694A', marginTop: 2 }}>
//                 {inactiveDays}d inactive
//               </div>
//             )}
//           </div>
//         ) : (
//           <span style={{ fontSize: 11, color: '#3A3A36' }}>No activity</span>
//         )}
//       </td>

//       {/* Tier badge */}
//       <td style={{ padding: '13px 16px' }}>
//         <TierPill tier={row.activity?.tier || 'inactive'} />
//       </td>

//       {/* Action */}
//       <td style={{ padding: '13px 16px' }} onClick={e => e.stopPropagation()}>
//         <button
//           onClick={onMessage}
//           style={{
//             padding: '5px 13px', fontSize: 11, fontWeight: 600,
//             background: 'linear-gradient(135deg,#7B3D6E,#5C2A52)',
//             color: '#0D0C09', border: 'none', borderRadius: 6,
//             cursor: 'pointer', fontFamily: "'Syne', sans-serif",
//           }}
//         >
//           View →
//         </button>
//       </td>
//     </tr>
//   );
// }

// /* ── Tier pill ─────────────────────────────────────────────────── */
// function TierPill({ tier }) {
//   const accent = tierAccent[tier] || '#8A8680';
//   return (
//     <span style={{
//       display: 'inline-flex', alignItems: 'center', gap: 5,
//       padding: '3px 9px', borderRadius: 20,
//       border: `1px solid ${accent}40`,
//       background: `${accent}12`,
//       fontSize: 10, fontWeight: 600,
//       letterSpacing: '.06em', textTransform: 'uppercase',
//       color: accent,
//       fontFamily: "'DM Sans', sans-serif",
//     }}>
//       <span style={{ width: 4, height: 4, borderRadius: '50%', background: accent, display: 'inline-block' }} />
//       {tier}
//     </span>
//   );
// }

// /* ── Bulk message modal ────────────────────────────────────────── */
// function BulkMessageModal({ open, tier, onClose, onSend }) {
//   const [triggerType, setTriggerType] = useState('dormant_support');
//   const [text, setText] = useState('');
//   const [sending, setSending] = useState(false);

//   async function handleSend() {
//     setSending(true);
//     await onSend({ tier, triggerType, text: triggerType === 'manual' ? text : undefined });
//     setSending(false);
//   }

//   return (
//     <Modal open={open} onClose={onClose} title={`Message ${tier ? `all ${tier} CPs` : 'bulk CPs'}`}>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: "'DM Sans', sans-serif" }}>
//         <div style={{
//           padding: '11px 14px',
//           background: '#FFFFFF',
//           border: '1px solid #EAE5DD',
//           borderRadius: 8, fontSize: 13, color: '#7A7570', lineHeight: 1.55,
//         }}>
//           This will send a WhatsApp message to all <strong style={{ color: '#E8E4DC' }}>{tier}</strong> channel partners in this project.
//         </div>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//           <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#5A5650' }}>
//             Message type
//           </label>
//           <select
//             value={triggerType}
//             onChange={e => setTriggerType(e.target.value)}
//             style={{
//               padding: '9px 12px', fontSize: 13, borderRadius: 8,
//               border: '1px solid #EAE5DD',
//               background: '#FFFFFF', color: '#E8E4DC', outline: 'none',
//               fontFamily: "'DM Sans', sans-serif",
//             }}
//           >
//             {TRIGGER_OPTIONS.map(o => (
//               <option key={o.value} value={o.value}>{o.label}</option>
//             ))}
//           </select>
//         </div>

//         {triggerType === 'manual' && (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//             <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#5A5650' }}>
//               Message text
//             </label>
//             <textarea
//               value={text}
//               onChange={e => setText(e.target.value)}
//               placeholder="Hi {name}, this is…"
//               rows={4}
//               style={{
//                 padding: '9px 12px', fontSize: 13, borderRadius: 8,
//                 border: '1px solid #EAE5DD',
//                 background: '#FFFFFF',
//                 color: '#E8E4DC', outline: 'none', resize: 'vertical', lineHeight: 1.6,
//                 fontFamily: "'DM Sans', sans-serif",
//               }}
//               onFocus={e => e.target.style.borderColor = 'rgba(201,151,61,.5)'}
//               onBlur={e => e.target.style.borderColor = '#EAE5DD'}
//             />
//           </div>
//         )}

//         <div style={{ display: 'flex', gap: 8 }}>
//           <Btn variant="brand" loading={sending} onClick={handleSend}
//             disabled={triggerType === 'manual' && !text.trim()}>
//             Send via WhatsApp
//           </Btn>
//           <Btn onClick={onClose}>Cancel</Btn>
//         </div>
//       </div>
//     </Modal>
//   );
// }














// src/pages/ProjectDetail.js
// import { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getCPs, getAnalytics, sendBulkMessage, runAutomation } from '../services/api';
// import { formatDistanceToNow } from 'date-fns';
// import toast from 'react-hot-toast';

// /* ── Shared primitives ───────────────────────────────────── */
// function GoldBtn({ children, loading, size='md', variant='brand', onClick, type='button', disabled }) {
//   const pad = size==='sm' ? '5px 12px' : '9px 18px';
//   const fs  = size==='sm' ? 11 : 13;
//   const styles = {
//     brand:  { background:'linear-gradient(135deg,#7B3D6E,#5C2A52)', color:'#FFFFFF', boxShadow:'0 2px 10px rgba(123,61,110,.22)' },
//     dark:   { background:'#EAE5DD', color:'#1C1028', border:'1px solid #D9CAAE' },
//     ghost:  { background:'transparent', color:'#B0A494', border:'1px solid #EAE5DD' },
//     danger: { background:'#FBECE6', color:'#D4907A', border:'1px solid rgba(239,68,68,.3)' },
//     active: { background:'#E8F0EB',  color:'#6EA882', border:'1px solid rgba(34,197,94,.3)' },
//   };
//   return (
//     <button type={type} disabled={disabled||loading} onClick={onClick}
//       style={{ padding:pad, fontSize:fs, fontWeight:600, fontFamily:'inherit', borderRadius:8, border:'none', cursor:disabled||loading?'not-allowed':'pointer', display:'inline-flex', alignItems:'center', gap:5, opacity:disabled?.5:1, transition:'all .15s', whiteSpace:'nowrap', ...styles[variant] }}
//       onMouseEnter={e => { if(!disabled&&!loading) e.currentTarget.style.transform='translateY(-1px)'; }}
//       onMouseLeave={e => { e.currentTarget.style.transform='none'; }}>
//       {loading && <span style={{ width:11, height:11, border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />}
//       {children}
//     </button>
//   );
// }

// function TierBadge({ tier }) {
//   const cfg = {
//     active:   { bg:'#E8F0EB',   color:'#6EA882',  dot:'#3D6B50', label:'Active'   },
//     dormant:  { bg:'#F8F0E4',   color:'#D4A84A',  dot:'#9C6820', label:'Dormant'  },
//     inactive: { bg:'#FBECE6',   color:'#D4907A',  dot:'#A8391A', label:'Inactive' },
//   };
//   const c = cfg[tier] || cfg.inactive;
//   return (
//     <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:c.bg, color:c.color }}>
//       <span style={{ width:5, height:5, borderRadius:'50%', background:c.dot, flexShrink:0 }} />
//       {c.label}
//     </span>
//   );
// }

// function Modal({ open, onClose, title, children, width=460 }) {
//   useEffect(() => {
//     const h = e => { if (e.key==='Escape') onClose(); };
//     if (open) document.addEventListener('keydown', h);
//     return () => document.removeEventListener('keydown', h);
//   }, [open, onClose]);
//   if (!open) return null;
//   return (
//     <div onClick={e => { if(e.target===e.currentTarget) onClose(); }}
//       style={{ position:'fixed', inset:0, background:'rgba(28,16,40,.45)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}>
//       <div style={{ background:'#FFFFFF', border:'1px solid #D9CAAE', borderRadius:18, width:'100%', maxWidth:width, padding:28, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(28,16,40,.45)' }}>
//         <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
//           <h3 style={{ fontFamily:'Bricolage Grotesque',sans-serif, fontSize:16, fontWeight:700, color:'#1C1028' }}>{title}</h3>
//           <button onClick={onClose} style={{ background:'#EAE5DD', border:'none', width:28, height:28, borderRadius:8, color:'#B0A494', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }

// const PERIODS = [{ value:'weekly', label:'Week' }, { value:'monthly', label:'Month' }, { value:'yearly', label:'Year' }];
// const TIERS   = [{ value:'', label:'All' }, { value:'active', label:'Active' }, { value:'dormant', label:'Dormant' }, { value:'inactive', label:'Inactive' }];
// const TRIGGERS = [
//   { value:'dormant_support',   label:'🤝 Dormant support'    },
//   { value:'inactivity_7d',     label:'⏰ 7-day reminder'      },
//   { value:'inactivity_14d',    label:'⚠️ 14-day warning'      },
//   { value:'active_perk',       label:'🎁 Active perk'         },
//   { value:'no_conversation',   label:'💬 No conversation'     },
//   { value:'manual',            label:'✏️ Custom message'      },
// ];

// export default function ProjectDetail() {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const [cps, setCps]           = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading]   = useState(true);
//   const [period, setPeriod]     = useState('monthly');
//   const [tier, setTier]         = useState('');
//   const [search, setSearch]     = useState('');
//   const [page, setPage]         = useState(1);
//   const [total, setTotal]       = useState(0);
//   const [bulkModal, setBulkModal] = useState(false);
//   const [running, setRunning]   = useState(false);
//   const LIMIT = 25;

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [cpData, analyticsData] = await Promise.all([
//         getCPs(projectId, { period, tier, search, page, limit:LIMIT }),
//         getAnalytics(projectId, period)
//       ]);
//       setCps(cpData.cps || []);
//       setTotal(cpData.total || 0);
//       setAnalytics(analyticsData);
//     } catch { toast.error('Failed to load'); }
//     finally { setLoading(false); }
//   }, [projectId, period, tier, search, page]);

//   useEffect(() => { load(); }, [load]);
//   useEffect(() => { setPage(1); }, [search, tier, period]);

//   async function handleRun() {
//     setRunning(true);
//     try { await runAutomation(projectId); toast.success('Automation complete!'); load(); }
//     catch { toast.error('Automation failed'); }
//     finally { setRunning(false); }
//   }

//   async function handleBulk({ t, triggerType, text }) {
//     try {
//       const r = await sendBulkMessage(projectId, { tier:t, triggerType, text });
//       toast.success(`Sent to ${r.sent} CPs!`);
//       setBulkModal(false);
//     } catch { toast.error('Failed to send'); }
//   }

//   const tierColor = { active:'#3D6B50', dormant:'#9C6820', inactive:'#A8391A' };

//   return (
//     <div style={{ padding:'28px', fontFamily:"'Plus Jakarta Sans',sans-serif", minHeight:'100vh', background:'#FAF8F5' }}>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .pu{animation:fadeUp .35s ease both} tr.cprow:hover td{background:rgba(245,192,0,.03)!important}`}</style>

//       {/* Breadcrumb */}
//       <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, fontSize:12, color:'#9486A8' }}>
//         <button onClick={() => navigate('/dashboard')} style={{ background:'none', border:'none', color:'#9486A8', cursor:'pointer', fontSize:12, padding:0 }}>Projects</button>
//         <span>/</span>
//         <span style={{ color:'#1C1028', fontWeight:500 }}>{analytics?.project_name || 'Channel Partners'}</span>
//       </div>

//       {/* Page header */}
//       <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
//         <div>
//           <h1 style={{ fontFamily:'Bricolage Grotesque',sans-serif, fontSize:24, fontWeight:700, color:'#1C1028', marginBottom:4, lineHeight:1 }}>Channel Partners</h1>
//           <p style={{ fontSize:13, color:'#9486A8' }}>{total} partners · {period} view</p>
//         </div>
//         <div style={{ display:'flex', gap:8 }}>
//           <GoldBtn variant="dark" loading={running} onClick={handleRun}>{running?'':'▶ Run automation'}</GoldBtn>
//           <GoldBtn onClick={() => setBulkModal(true)}>📨 Bulk message</GoldBtn>
//         </div>
//       </div>

//       {/* Analytics strip */}
//       {analytics && (
//         <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:10, marginBottom:20 }}>
//           {[
//             { label:'Active',    value:analytics.tier_distribution?.active||0,   color:'#3D6B50' },
//             { label:'Dormant',   value:analytics.tier_distribution?.dormant||0,  color:'#9C6820' },
//             { label:'Inactive',  value:analytics.tier_distribution?.inactive||0, color:'#A8391A' },
//             { label:'Msgs sent', value:analytics.messages?.by_status?.sent||0,   color:'#9B5A8E' },
//             { label:'Delivered', value:analytics.messages?.by_status?.delivered||0, color:'#7B3D6E' },
//           ].map((s,i) => (
//             <div key={i} className="pu" style={{ animationDelay:`${i*.04}s`, padding:'14px 16px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:12 }}>
//               <div style={{ fontSize:10, color:'#9486A8', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:6 }}>{s.label}</div>
//               <div style={{ fontSize:22, fontFamily:'Bricolage Grotesque',sans-serif, fontWeight:700, color:s.color }}>{s.value}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Filter bar */}
//       <div style={{ padding:'12px 16px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:14, marginBottom:14, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
//         {/* Search */}
//         <div style={{ position:'relative', flex:'1 1 200px' }}>
//           <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9486A8', fontSize:13 }}>🔍</span>
//           <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, area…"
//             style={{ width:'100%', padding:'7px 10px 7px 30px', fontSize:13, background:'#F5F2EE', border:'1px solid #EAE5DD', borderRadius:8, color:'#1C1028', outline:'none', boxSizing:'border-box' }}
//             onFocus={e => e.target.style.borderColor='rgba(123,61,110,.45)'}
//             onBlur={e => e.target.style.borderColor='#EAE5DD'} />
//         </div>

//         {/* Period */}
//         <div style={{ display:'flex', background:'#F5F2EE', borderRadius:8, padding:3, gap:2 }}>
//           {PERIODS.map(p => (
//             <button key={p.value} onClick={() => setPeriod(p.value)}
//               style={{ padding:'5px 12px', fontSize:12, fontWeight:500, border:'none', borderRadius:6, cursor:'pointer', transition:'all .15s', background:period===p.value?'#7B3D6E':'transparent', color:period===p.value?'#0C0C0A':'#9B9B92', fontFamily:'inherit' }}>
//               {p.label}
//             </button>
//           ))}
//         </div>

//         {/* Tier */}
//         <div style={{ display:'flex', gap:4 }}>
//           {TIERS.map(t => (
//             <button key={t.value} onClick={() => setTier(t.value)}
//               style={{ padding:'5px 12px', fontSize:11, fontWeight:600, borderRadius:20, cursor:'pointer', border:`1px solid ${tier===t.value ? (tierColor[t.value]||'#7B3D6E') : '#EAE5DD'}`, background: tier===t.value ? `${tierColor[t.value]||'#7B3D6E'}22` : 'transparent', color: tier===t.value ? (tierColor[t.value]||'#7B3D6E') : '#9B9B92', fontFamily:'inherit', transition:'all .15s' }}>
//               {t.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Table */}
//       <div style={{ background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:16, overflow:'hidden' }}>
//         {loading ? (
//           <div style={{ padding:48, display:'flex', justifyContent:'center' }}>
//             <span style={{ width:28, height:28, border:'3px solid rgba(123,61,110,.28)', borderTopColor:'#7B3D6E', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />
//           </div>
//         ) : cps.length === 0 ? (
//           <div style={{ textAlign:'center', padding:'52px 24px' }}>
//             <div style={{ fontSize:36, marginBottom:12 }}>👥</div>
//             <div style={{ fontFamily:'Bricolage Grotesque',sans-serif, fontSize:15, fontWeight:600, color:'#1C1028', marginBottom:6 }}>No CPs found</div>
//             <div style={{ fontSize:13, color:'#9486A8' }}>Try adjusting your filters or import CPs</div>
//           </div>
//         ) : (
//           <>
//             <table style={{ width:'100%', borderCollapse:'collapse' }}>
//               <thead>
//                 <tr style={{ borderBottom:'1px solid #EAE5DD', background:'#FAFAF8' }}>
//                   {['Channel Partner','Site Visits','Deals','Score','Last Active','Tier',''].map(h => (
//                     <th key={h} style={{ padding:'11px 14px', fontSize:10, fontWeight:700, color:'#9486A8', textAlign:'left', textTransform:'uppercase', letterSpacing:'.07em' }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {cps.map((row, i) => <CPRow key={row.cp?.id||i} row={row} index={i} projectId={projectId} />)}
//               </tbody>
//             </table>

//             {total > LIMIT && (
//               <div style={{ padding:'12px 16px', borderTop:'1px solid #EAE5DD', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//                 <span style={{ fontSize:12, color:'#9486A8' }}>{(page-1)*LIMIT+1}–{Math.min(page*LIMIT,total)} of {total}</span>
//                 <div style={{ display:'flex', gap:6 }}>
//                   <GoldBtn size="sm" variant="ghost" disabled={page===1} onClick={() => setPage(p=>p-1)}>← Prev</GoldBtn>
//                   <GoldBtn size="sm" variant="ghost" disabled={page*LIMIT>=total} onClick={() => setPage(p=>p+1)}>Next →</GoldBtn>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Bulk modal */}
//       <BulkModal open={bulkModal} tier={tier} onClose={() => setBulkModal(false)} onSend={handleBulk} />
//     </div>
//   );
// }

// /* ── CP Row ───────────────────────────────────────────────── */
// function CPRow({ row, index, projectId }) {
//   const navigate = useNavigate();
//   const cp = row.cp || {};
//   const act = row.activity || {};
//   const inactiveDays = act.last_active_at ? Math.floor((Date.now()-new Date(act.last_active_at))/86400000) : null;
//   const maxVisits = 20;
//   const pct = Math.min(Math.round(((act.site_visits||0)/maxVisits)*100), 100);
//   const tierColor = { active:'#3D6B50', dormant:'#9C6820', inactive:'#A8391A' };

//   return (
//     <tr className="cprow" style={{ borderBottom:'1px solid #FFFFFF', cursor:'pointer', transition:'background .1s' }}
//       onClick={() => navigate(`/projects/${projectId}/cps/${cp.id}`)}>
//       <td style={{ padding:'12px 14px' }}>
//         <div style={{ display:'flex', alignItems:'center', gap:10 }}>
//           <div style={{ width:32, height:32, borderRadius:'50%', background:`${tierColor[act.tier]||'#6B6B64'}22`, color:tierColor[act.tier]||'#9B9B92', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
//             {(cp.name||'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
//           </div>
//           <div>
//             <div style={{ fontSize:13, fontWeight:500, color:'#1C1028' }}>{cp.name}</div>
//             <div style={{ fontSize:11, color:'#9486A8' }}>{cp.area}{cp.firm_name?` · ${cp.firm_name}`:''}</div>
//           </div>
//         </div>
//       </td>
//       <td style={{ padding:'12px 14px' }}>
//         <div style={{ display:'flex', alignItems:'center', gap:8 }}>
//           <div style={{ flex:1, height:5, background:'#EAE5DD', borderRadius:3, overflow:'hidden', maxWidth:70 }}>
//             <div style={{ height:'100%', width:`${pct}%`, background:tierColor[act.tier]||'#6B6B64', borderRadius:3 }} />
//           </div>
//           <span style={{ fontSize:12, color:'#B0A494', minWidth:20 }}>{act.site_visits||0}</span>
//         </div>
//       </td>
//       <td style={{ padding:'12px 14px', fontSize:13, color:'#1C1028', fontWeight:500 }}>{act.deals_closed||0}</td>
//       <td style={{ padding:'12px 14px' }}>
//         <span style={{ fontSize:13, fontWeight:700, color: (act.score||0)>=60?'#3D6B50':(act.score||0)>=30?'#9C6820':'#A8391A' }}>{act.score||0}</span>
//         <span style={{ fontSize:10, color:'#9486A8' }}>/100</span>
//       </td>
//       <td style={{ padding:'12px 14px' }}>
//         {act.last_active_at ? (
//           <div>
//             <div style={{ fontSize:12, color:'#B0A494' }}>{formatDistanceToNow(new Date(act.last_active_at), { addSuffix:true })}</div>
//             {inactiveDays >= 7 && <div style={{ fontSize:10, color:'#A8391A', marginTop:1 }}>⚠ {inactiveDays}d inactive</div>}
//           </div>
//         ) : <span style={{ fontSize:11, color:'#9486A8' }}>No activity</span>}
//       </td>
//       <td style={{ padding:'12px 14px' }}><TierBadge tier={act.tier||'inactive'} /></td>
//       <td style={{ padding:'12px 14px' }} onClick={e => e.stopPropagation()}>
//         <button onClick={() => navigate(`/projects/${projectId}/cps/${cp.id}`)}
//           style={{ padding:'5px 12px', fontSize:11, fontWeight:600, background:'#7B3D6E', color:'#FFFFFF', border:'none', borderRadius:7, cursor:'pointer' }}>
//           View →
//         </button>
//       </td>
//     </tr>
//   );
// }

// /* ── Bulk message modal ───────────────────────────────────── */
// function BulkModal({ open, tier, onClose, onSend }) {
//   const [triggerType, setTriggerType] = useState('dormant_support');
//   const [text, setText] = useState('');
//   const [sending, setSending] = useState(false);

//   async function handleSend() {
//     setSending(true);
//     await onSend({ t: tier, triggerType, text: triggerType==='manual'?text:undefined });
//     setSending(false);
//   }

//   return (
//     <Modal open={open} onClose={onClose} title={`Bulk message${tier ? ` — ${tier} CPs` : ''}`}>
//       <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
//         <div style={{ padding:'10px 13px', background:'rgba(123,61,110,.07)', border:'1px solid rgba(123,61,110,.15)', borderRadius:8, fontSize:12, color:'#D4A84A' }}>
//           📢 Sends WhatsApp to all <strong>{tier||'selected'}</strong> channel partners in this project.
//         </div>
//         <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
//           <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Message type</label>
//           <select value={triggerType} onChange={e => setTriggerType(e.target.value)}
//             style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none' }}>
//             {TRIGGERS.map(o => <option key={o.value} value={o.value} style={{ background:'#1A1A16' }}>{o.label}</option>)}
//           </select>
//         </div>
//         {triggerType === 'manual' && (
//           <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
//             <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Message text</label>
//             <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="Hi {name}, this is…"
//               style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none', resize:'vertical', lineHeight:1.6 }} />
//           </div>
//         )}
//         <div style={{ display:'flex', gap:8 }}>
//           <button disabled={sending||(triggerType==='manual'&&!text.trim())} onClick={handleSend}
//             style={{ padding:'9px 18px', fontSize:13, fontWeight:600, background:'#7B3D6E', color:'#FFFFFF', border:'none', borderRadius:9, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
//             {sending && <span style={{ width:12, height:12, border:'2px solid rgba(0,0,0,.3)', borderTopColor:'#0C0C0A', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />}
//             Send via WhatsApp
//           </button>
//           <button onClick={onClose} style={{ padding:'9px 18px', fontSize:13, fontWeight:500, background:'transparent', color:'#B0A494', border:'1px solid #EAE5DD', borderRadius:9, cursor:'pointer' }}>Cancel</button>
//         </div>
//       </div>
//     </Modal>
//   );
// }

// function TierBadge({ tier }) {
//   const cfg = { active:{bg:'#E8F0EB',color:'#6EA882',dot:'#3D6B50',label:'Active'}, dormant:{bg:'#F8F0E4',color:'#D4A84A',dot:'#9C6820',label:'Dormant'}, inactive:{bg:'#FBECE6',color:'#D4907A',dot:'#A8391A',label:'Inactive'} };
//   const c = cfg[tier]||cfg.inactive;
//   return <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:c.bg, color:c.color }}><span style={{ width:5, height:5, borderRadius:'50%', background:c.dot }} />{c.label}</span>;
// }




































// // src/pages/ProjectDetail.js
// import { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getCPs, getAnalytics, sendBulkMessage, runAutomation } from '../services/api';
// import { formatDistanceToNow } from 'date-fns';
// import toast from 'react-hot-toast';

// /* ── Shared primitives ───────────────────────────────────── */
// function GoldBtn({ children, loading, size='md', variant='brand', onClick, type='button', disabled }) {
//   const pad = size==='sm' ? '5px 12px' : '9px 18px';
//   const fs  = size==='sm' ? 11 : 13;
//   const styles = {
//     brand:  { background:'linear-gradient(135deg,#7B3D6E,#5C2A52)', color:'#FFFFFF', boxShadow:'0 2px 10px rgba(123,61,110,.22)' },
//     dark:   { background:'#EAE5DD', color:'#1C1028', border:'1px solid #D9CAAE' },
//     ghost:  { background:'transparent', color:'#B0A494', border:'1px solid #EAE5DD' },
//     danger: { background:'#FBECE6', color:'#D4907A', border:'1px solid rgba(239,68,68,.3)' },
//     active: { background:'#E8F0EB',  color:'#6EA882', border:'1px solid rgba(34,197,94,.3)' },
//   };
//   return (
//     <button type={type} disabled={disabled||loading} onClick={onClick}
//       style={{ padding:pad, fontSize:fs, fontWeight:600, fontFamily:'inherit', borderRadius:8, border:'none', cursor:disabled||loading?'not-allowed':'pointer', display:'inline-flex', alignItems:'center', gap:5, opacity:disabled?.5:1, transition:'all .15s', whiteSpace:'nowrap', ...styles[variant] }}
//       onMouseEnter={e => { if(!disabled&&!loading) e.currentTarget.style.transform='translateY(-1px)'; }}
//       onMouseLeave={e => { e.currentTarget.style.transform='none'; }}>
//       {loading && <span style={{ width:11, height:11, border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />}
//       {children}
//     </button>
//   );
// }

// function TierBadge({ tier }) {
//   const cfg = {
//     active:   { bg:'#E8F0EB',   color:'#6EA882',  dot:'#3D6B50', label:'Active'   },
//     dormant:  { bg:'#F8F0E4',   color:'#D4A84A',  dot:'#9C6820', label:'Dormant'  },
//     inactive: { bg:'#FBECE6',   color:'#D4907A',  dot:'#A8391A', label:'Inactive' },
//   };
//   const c = cfg[tier] || cfg.inactive;
//   return (
//     <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:c.bg, color:c.color }}>
//       <span style={{ width:5, height:5, borderRadius:'50%', background:c.dot, flexShrink:0 }} />
//       {c.label}
//     </span>
//   );
// }

// function Modal({ open, onClose, title, children, width=460 }) {
//   useEffect(() => {
//     const h = e => { if (e.key==='Escape') onClose(); };
//     if (open) document.addEventListener('keydown', h);
//     return () => document.removeEventListener('keydown', h);
//   }, [open, onClose]);
//   if (!open) return null;
//   return (
//     <div onClick={e => { if(e.target===e.currentTarget) onClose(); }}
//       style={{ position:'fixed', inset:0, background:'rgba(28,16,40,.45)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}>
//       <div style={{ background:'#FFFFFF', border:'1px solid #D9CAAE', borderRadius:18, width:'100%', maxWidth:width, padding:28, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(28,16,40,.45)' }}>
//         <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
//           <h3 style={{ fontFamily:'Bricolage Grotesque',sans-serif, fontSize:16, fontWeight:700, color:'#1C1028' }}>{title}</h3>
//           <button onClick={onClose} style={{ background:'#EAE5DD', border:'none', width:28, height:28, borderRadius:8, color:'#B0A494', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }

// const PERIODS = [{ value:'weekly', label:'Week' }, { value:'monthly', label:'Month' }, { value:'yearly', label:'Year' }];
// const TIERS   = [{ value:'', label:'All' }, { value:'active', label:'Active' }, { value:'dormant', label:'Dormant' }, { value:'inactive', label:'Inactive' }];
// const TRIGGERS = [
//   { value:'dormant_support',   label:'🤝 Dormant support'    },
//   { value:'inactivity_7d',     label:'⏰ 7-day reminder'      },
//   { value:'inactivity_14d',    label:'⚠️ 14-day warning'      },
//   { value:'active_perk',       label:'🎁 Active perk'         },
//   { value:'no_conversation',   label:'💬 No conversation'     },
//   { value:'manual',            label:'✏️ Custom message'      },
// ];

// export default function ProjectDetail() {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const [cps, setCps]           = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading]   = useState(true);
//   const [period, setPeriod]     = useState('monthly');
//   const [tier, setTier]         = useState('');
//   const [search, setSearch]     = useState('');
//   const [page, setPage]         = useState(1);
//   const [total, setTotal]       = useState(0);
//   const [bulkModal, setBulkModal] = useState(false);
//   const [running, setRunning]   = useState(false);
//   const LIMIT = 25;

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [cpData, analyticsData] = await Promise.all([
//         getCPs(projectId, { period, tier, search, page, limit:LIMIT }),
//         getAnalytics(projectId, period)
//       ]);
//       setCps(cpData.cps || []);
//       setTotal(cpData.total || 0);
//       setAnalytics(analyticsData);
//     } catch { toast.error('Failed to load'); }
//     finally { setLoading(false); }
//   }, [projectId, period, tier, search, page]);

//   useEffect(() => { load(); }, [load]);
//   useEffect(() => { setPage(1); }, [search, tier, period]);

//   async function handleRun() {
//     setRunning(true);
//     try { await runAutomation(projectId); toast.success('Automation complete!'); load(); }
//     catch { toast.error('Automation failed'); }
//     finally { setRunning(false); }
//   }

//   async function handleBulk({ t, triggerType, text }) {
//     try {
//       const r = await sendBulkMessage(projectId, { tier:t, triggerType, text });
//       toast.success(`Sent to ${r.sent} CPs!`);
//       setBulkModal(false);
//     } catch { toast.error('Failed to send'); }
//   }

//   const tierColor = { active:'#3D6B50', dormant:'#9C6820', inactive:'#A8391A' };

//   return (
//     <div style={{ padding:'28px', fontFamily:"'Plus Jakarta Sans',sans-serif", minHeight:'100vh', background:'#FAF8F5' }}>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .pu{animation:fadeUp .35s ease both} tr.cprow:hover td{background:rgba(245,192,0,.03)!important}`}</style>

//       {/* Breadcrumb */}
//       <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, fontSize:12, color:'#9486A8' }}>
//         <button onClick={() => navigate('/dashboard')} style={{ background:'none', border:'none', color:'#9486A8', cursor:'pointer', fontSize:12, padding:0 }}>Projects</button>
//         <span>/</span>
//         <span style={{ color:'#1C1028', fontWeight:500 }}>{analytics?.project_name || 'Channel Partners'}</span>
//       </div>

//       {/* Page header */}
//       <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
//         <div>
//           <h1 style={{ fontFamily:'Bricolage Grotesque',sans-serif, fontSize:24, fontWeight:700, color:'#1C1028', marginBottom:4, lineHeight:1 }}>Channel Partners</h1>
//           <p style={{ fontSize:13, color:'#9486A8' }}>{total} partners · {period} view</p>
//         </div>
//         <div style={{ display:'flex', gap:8 }}>
//           <GoldBtn variant="dark" loading={running} onClick={handleRun}>{running?'':'▶ Run automation'}</GoldBtn>
//           <GoldBtn onClick={() => setBulkModal(true)}>📨 Bulk message</GoldBtn>
//         </div>
//       </div>

//       {/* Analytics strip */}
//       {analytics && (
//         <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:10, marginBottom:20 }}>
//           {[
//             { label:'Active',    value:analytics.tier_distribution?.active||0,   color:'#3D6B50' },
//             { label:'Dormant',   value:analytics.tier_distribution?.dormant||0,  color:'#9C6820' },
//             { label:'Inactive',  value:analytics.tier_distribution?.inactive||0, color:'#A8391A' },
//             { label:'Msgs sent', value:analytics.messages?.by_status?.sent||0,   color:'#9B5A8E' },
//             { label:'Delivered', value:analytics.messages?.by_status?.delivered||0, color:'#7B3D6E' },
//           ].map((s,i) => (
//             <div key={i} className="pu" style={{ animationDelay:`${i*.04}s`, padding:'14px 16px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:12 }}>
//               <div style={{ fontSize:10, color:'#9486A8', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:6 }}>{s.label}</div>
//               <div style={{ fontSize:22, fontFamily:'Bricolage Grotesque',sans-serif, fontWeight:700, color:s.color }}>{s.value}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Filter bar */}
//       <div style={{ padding:'12px 16px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:14, marginBottom:14, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
//         {/* Search */}
//         <div style={{ position:'relative', flex:'1 1 200px' }}>
//           <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9486A8', fontSize:13 }}>🔍</span>
//           <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, area…"
//             style={{ width:'100%', padding:'7px 10px 7px 30px', fontSize:13, background:'#F5F2EE', border:'1px solid #EAE5DD', borderRadius:8, color:'#1C1028', outline:'none', boxSizing:'border-box' }}
//             onFocus={e => e.target.style.borderColor='rgba(123,61,110,.45)'}
//             onBlur={e => e.target.style.borderColor='#EAE5DD'} />
//         </div>

//         {/* Period */}
//         <div style={{ display:'flex', background:'#F5F2EE', borderRadius:8, padding:3, gap:2 }}>
//           {PERIODS.map(p => (
//             <button key={p.value} onClick={() => setPeriod(p.value)}
//               style={{ padding:'5px 12px', fontSize:12, fontWeight:500, border:'none', borderRadius:6, cursor:'pointer', transition:'all .15s', background:period===p.value?'#7B3D6E':'transparent', color:period===p.value?'#0C0C0A':'#9B9B92', fontFamily:'inherit' }}>
//               {p.label}
//             </button>
//           ))}
//         </div>

//         {/* Tier */}
//         <div style={{ display:'flex', gap:4 }}>
//           {TIERS.map(t => (
//             <button key={t.value} onClick={() => setTier(t.value)}
//               style={{ padding:'5px 12px', fontSize:11, fontWeight:600, borderRadius:20, cursor:'pointer', border:`1px solid ${tier===t.value ? (tierColor[t.value]||'#7B3D6E') : '#EAE5DD'}`, background: tier===t.value ? `${tierColor[t.value]||'#7B3D6E'}22` : 'transparent', color: tier===t.value ? (tierColor[t.value]||'#7B3D6E') : '#9B9B92', fontFamily:'inherit', transition:'all .15s' }}>
//               {t.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Table */}
//       <div style={{ background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:16, overflow:'hidden' }}>
//         {loading ? (
//           <div style={{ padding:48, display:'flex', justifyContent:'center' }}>
//             <span style={{ width:28, height:28, border:'3px solid rgba(123,61,110,.28)', borderTopColor:'#7B3D6E', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />
//           </div>
//         ) : cps.length === 0 ? (
//           <div style={{ textAlign:'center', padding:'52px 24px' }}>
//             <div style={{ fontSize:36, marginBottom:12 }}>👥</div>
//             <div style={{ fontFamily:'Bricolage Grotesque',sans-serif, fontSize:15, fontWeight:600, color:'#1C1028', marginBottom:6 }}>No CPs found</div>
//             <div style={{ fontSize:13, color:'#9486A8' }}>Try adjusting your filters or import CPs</div>
//           </div>
//         ) : (
//           <>
//             <table style={{ width:'100%', borderCollapse:'collapse' }}>
//               <thead>
//                 <tr style={{ borderBottom:'1px solid #EAE5DD', background:'#FAFAF8' }}>
//                   {['Channel Partner','Site Visits','Deals','Score','Last Active','Tier',''].map(h => (
//                     <th key={h} style={{ padding:'11px 14px', fontSize:10, fontWeight:700, color:'#9486A8', textAlign:'left', textTransform:'uppercase', letterSpacing:'.07em' }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {cps.map((row, i) => <CPRow key={row.cp?.id||i} row={row} index={i} projectId={projectId} />)}
//               </tbody>
//             </table>

//             {total > LIMIT && (
//               <div style={{ padding:'12px 16px', borderTop:'1px solid #EAE5DD', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//                 <span style={{ fontSize:12, color:'#9486A8' }}>{(page-1)*LIMIT+1}–{Math.min(page*LIMIT,total)} of {total}</span>
//                 <div style={{ display:'flex', gap:6 }}>
//                   <GoldBtn size="sm" variant="ghost" disabled={page===1} onClick={() => setPage(p=>p-1)}>← Prev</GoldBtn>
//                   <GoldBtn size="sm" variant="ghost" disabled={page*LIMIT>=total} onClick={() => setPage(p=>p+1)}>Next →</GoldBtn>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Bulk modal */}
//       <BulkModal open={bulkModal} tier={tier} onClose={() => setBulkModal(false)} onSend={handleBulk} />
//     </div>
//   );
// }

// /* ── CP Row ───────────────────────────────────────────────── */
// function CPRow({ row, index, projectId }) {
//   const navigate = useNavigate();
//   const cp = row.cp || {};
//   const act = row.activity || {};
//   const inactiveDays = act.last_active_at ? Math.floor((Date.now()-new Date(act.last_active_at))/86400000) : null;
//   const maxVisits = 20;
//   const pct = Math.min(Math.round(((act.site_visits||0)/maxVisits)*100), 100);
//   const tierColor = { active:'#3D6B50', dormant:'#9C6820', inactive:'#A8391A' };

//   return (
//     <tr className="cprow" style={{ borderBottom:'1px solid #FFFFFF', cursor:'pointer', transition:'background .1s' }}
//       onClick={() => navigate(`/projects/${projectId}/cps/${cp.id}`)}>
//       <td style={{ padding:'12px 14px' }}>
//         <div style={{ display:'flex', alignItems:'center', gap:10 }}>
//           <div style={{ width:32, height:32, borderRadius:'50%', background:`${tierColor[act.tier]||'#6B6B64'}22`, color:tierColor[act.tier]||'#9B9B92', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
//             {(cp.name||'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
//           </div>
//           <div>
//             <div style={{ fontSize:13, fontWeight:500, color:'#1C1028' }}>{cp.name}</div>
//             <div style={{ fontSize:11, color:'#9486A8' }}>{cp.area}{cp.firm_name?` · ${cp.firm_name}`:''}</div>
//           </div>
//         </div>
//       </td>
//       <td style={{ padding:'12px 14px' }}>
//         <div style={{ display:'flex', alignItems:'center', gap:8 }}>
//           <div style={{ flex:1, height:5, background:'#EAE5DD', borderRadius:3, overflow:'hidden', maxWidth:70 }}>
//             <div style={{ height:'100%', width:`${pct}%`, background:tierColor[act.tier]||'#6B6B64', borderRadius:3 }} />
//           </div>
//           <span style={{ fontSize:12, color:'#B0A494', minWidth:20 }}>{act.site_visits||0}</span>
//         </div>
//       </td>
//       <td style={{ padding:'12px 14px', fontSize:13, color:'#1C1028', fontWeight:500 }}>{act.deals_closed||0}</td>
//       <td style={{ padding:'12px 14px' }}>
//         <span style={{ fontSize:13, fontWeight:700, color: (act.score||0)>=60?'#3D6B50':(act.score||0)>=30?'#9C6820':'#A8391A' }}>{act.score||0}</span>
//         <span style={{ fontSize:10, color:'#9486A8' }}>/100</span>
//       </td>
//       <td style={{ padding:'12px 14px' }}>
//         {act.last_active_at ? (
//           <div>
//             <div style={{ fontSize:12, color:'#B0A494' }}>{formatDistanceToNow(new Date(act.last_active_at), { addSuffix:true })}</div>
//             {inactiveDays >= 7 && <div style={{ fontSize:10, color:'#A8391A', marginTop:1 }}>⚠ {inactiveDays}d inactive</div>}
//           </div>
//         ) : <span style={{ fontSize:11, color:'#9486A8' }}>No activity</span>}
//       </td>
//       <td style={{ padding:'12px 14px' }}><TierBadge tier={act.tier||'inactive'} /></td>
//       <td style={{ padding:'12px 14px' }} onClick={e => e.stopPropagation()}>
//         <button onClick={() => navigate(`/projects/${projectId}/cps/${cp.id}`)}
//           style={{ padding:'5px 12px', fontSize:11, fontWeight:600, background:'#7B3D6E', color:'#FFFFFF', border:'none', borderRadius:7, cursor:'pointer' }}>
//           View →
//         </button>
//       </td>
//     </tr>
//   );
// }

// /* ── Bulk message modal ───────────────────────────────────── */
// function BulkModal({ open, tier, onClose, onSend }) {
//   const [triggerType, setTriggerType] = useState('dormant_support');
//   const [text, setText] = useState('');
//   const [sending, setSending] = useState(false);

//   async function handleSend() {
//     setSending(true);
//     await onSend({ t: tier, triggerType, text: triggerType==='manual'?text:undefined });
//     setSending(false);
//   }

//   return (
//     <Modal open={open} onClose={onClose} title={`Bulk message${tier ? ` — ${tier} CPs` : ''}`}>
//       <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
//         <div style={{ padding:'10px 13px', background:'rgba(123,61,110,.07)', border:'1px solid rgba(123,61,110,.15)', borderRadius:8, fontSize:12, color:'#D4A84A' }}>
//           📢 Sends WhatsApp to all <strong>{tier||'selected'}</strong> channel partners in this project.
//         </div>
//         <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
//           <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Message type</label>
//           <select value={triggerType} onChange={e => setTriggerType(e.target.value)}
//             style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none' }}>
//             {TRIGGERS.map(o => <option key={o.value} value={o.value} style={{ background:'#1A1A16' }}>{o.label}</option>)}
//           </select>
//         </div>
//         {triggerType === 'manual' && (
//           <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
//             <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Message text</label>
//             <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="Hi {name}, this is…"
//               style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none', resize:'vertical', lineHeight:1.6 }} />
//           </div>
//         )}
//         <div style={{ display:'flex', gap:8 }}>
//           <button disabled={sending||(triggerType==='manual'&&!text.trim())} onClick={handleSend}
//             style={{ padding:'9px 18px', fontSize:13, fontWeight:600, background:'#7B3D6E', color:'#FFFFFF', border:'none', borderRadius:9, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
//             {sending && <span style={{ width:12, height:12, border:'2px solid rgba(0,0,0,.3)', borderTopColor:'#0C0C0A', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />}
//             Send via WhatsApp
//           </button>
//           <button onClick={onClose} style={{ padding:'9px 18px', fontSize:13, fontWeight:500, background:'transparent', color:'#B0A494', border:'1px solid #EAE5DD', borderRadius:9, cursor:'pointer' }}>Cancel</button>
//         </div>
//       </div>
//     </Modal>
//   );
// }

// // function TierBadge({ tier }) {
// //   const cfg = { active:{bg:'#E8F0EB',color:'#6EA882',dot:'#3D6B50',label:'Active'}, dormant:{bg:'#F8F0E4',color:'#D4A84A',dot:'#9C6820',label:'Dormant'}, inactive:{bg:'#FBECE6',color:'#D4907A',dot:'#A8391A',label:'Inactive'} };
// //   const c = cfg[tier]||cfg.inactive;
// //   return <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:c.bg, color:c.color }}><span style={{ width:5, height:5, borderRadius:'50%', background:c.dot }} />{c.label}</span>;
// // }





























































// // src/pages/ProjectDetail.js
// import { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getCPs, getAnalytics, sendBulkMessage, importCSV, runAutomation } from '../services/api';
// import { Card, Badge, Btn, Avatar, ProgressBar, Modal, StatCard, Empty, Spinner } from '../components/ui';
// import toast from 'react-hot-toast';
// import { formatDistanceToNow } from 'date-fns';

// const PERIODS = [
//   { value: 'weekly',  label: 'Week' },
//   { value: 'monthly', label: 'Month' },
//   { value: 'yearly',  label: 'Year' },
// ];

// const TIERS = [
//   { value: '',         label: 'All' },
//   { value: 'active',   label: 'Active' },
//   { value: 'dormant',  label: 'Dormant' },
//   { value: 'inactive', label: 'Inactive' },
// ];

// const TRIGGER_OPTIONS = [
//   { value: 'dormant_support',   label: 'Dormant support message' },
//   { value: 'inactivity_7d',     label: '7-day inactivity reminder' },
//   { value: 'inactivity_14d',    label: '14-day inactivity warning' },
//   { value: 'active_perk',       label: 'Active perk / reward' },
//   { value: 'no_conversation',   label: 'No conversation reminder' },
//   { value: 'manual',            label: 'Custom message' },
// ];

// const tierAccent = {
//   active:   '#5A8A6E',
//   dormant:  '#7B3D6E',
//   inactive: '#C4694A',
// };

// /* ── Inline stat strip card ────────────────────────────────────── */
// function MiniStat({ label, value, accent }) {
//   return (
//     <div style={{
//       padding: '14px 18px',
//       background: '#FFFFFF',
//       border: '1px solid #EAE5DD',
//       borderRadius: 10,
//     }}>
//       <div style={{
//         fontSize: 9, fontWeight: 600, letterSpacing: '.09em',
//         textTransform: 'uppercase', color: '#4A4640', marginBottom: 8,
//         display: 'flex', alignItems: 'center', gap: 6,
//       }}>
//         {accent && (
//           <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, display: 'inline-block' }} />
//         )}
//         {label}
//       </div>
//       <div style={{
//         fontFamily: "'IBM Plex Mono', monospace",
//         fontSize: 22, fontWeight: 500, color: accent || '#E8E4DC',
//       }}>
//         {value}
//       </div>
//     </div>
//   );
// }

// export default function ProjectDetail() {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const [cps, setCps]             = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading]     = useState(true);
//   const [period, setPeriod]       = useState('monthly');
//   const [tier, setTier]           = useState('');
//   const [search, setSearch]       = useState('');
//   const [page, setPage]           = useState(1);
//   const [total, setTotal]         = useState(0);
//   const [bulkModal, setBulkModal] = useState(null);
//   const [running, setRunning]     = useState(false);
//   const LIMIT = 25;

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [cpData, analyticsData] = await Promise.all([
//         getCPs(projectId, { period, tier, search, page, limit: LIMIT }),
//         getAnalytics(projectId, period),
//       ]);
//       setCps(cpData.cps || []);
//       setTotal(cpData.total || 0);
//       setAnalytics(analyticsData);
//     } catch { toast.error('Failed to load data'); }
//     finally { setLoading(false); }
//   }, [projectId, period, tier, search, page]);

//   useEffect(() => { load(); }, [load]);
//   useEffect(() => { setPage(1); }, [search, tier, period]);

//   async function handleRunAutomation() {
//     setRunning(true);
//     try {
//       await runAutomation(projectId);
//       toast.success('Automation complete.');
//       load();
//     } catch { toast.error('Automation failed'); }
//     finally { setRunning(false); }
//   }

//   async function handleBulkSend({ tier: t, triggerType, text }) {
//     try {
//       const result = await sendBulkMessage(projectId, { tier: t, triggerType, text });
//       toast.success(`Sent to ${result.sent} CPs.`);
//       setBulkModal(null);
//     } catch { toast.error('Bulk send failed'); }
//   }

//   return (
//     <div style={{ padding: 32, fontFamily: "'DM Sans', sans-serif" }}>

//       {/* ── Breadcrumb ── */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 12 }}>
//         <button
//           onClick={() => navigate('/dashboard')}
//           style={{
//             background: 'none', border: 'none',
//             color: '#5A5650', cursor: 'pointer',
//             fontFamily: "'DM Sans', sans-serif",
//             fontSize: 12, padding: 0,
//             transition: 'color .15s',
//           }}
//           onMouseEnter={e => e.target.style.color = '#A0A09A'}
//           onMouseLeave={e => e.target.style.color = '#5A5650'}
//         >
//           Projects
//         </button>
//         <span style={{ color: '#3A3A36' }}>/</span>
//         <span style={{ color: '#A0A09A', fontSize: 12 }}>{analytics?.project_name || 'Project'}</span>
//       </div>

//       {/* ── Page header ── */}
//       <div style={{
//         display: 'flex', alignItems: 'flex-start',
//         justifyContent: 'space-between', marginBottom: 24,
//         flexWrap: 'wrap', gap: 12,
//       }}>
//         <div>
//           <h1 style={{
//             fontFamily: "'Syne', sans-serif",
//             fontSize: 24, fontWeight: 700, letterSpacing: '-.02em',
//             color: '#F2EEE6', marginBottom: 4,
//           }}>
//             {analytics?.project_name || 'Project'}
//           </h1>
//           <p style={{ fontSize: 13, color: '#5A5650' }}>
//             <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{total}</span>
//             {' '}channel partners
//             <span style={{ margin: '0 8px', opacity: .4 }}>·</span>
//             {period}
//           </p>
//         </div>
//         <div style={{ display: 'flex', gap: 8 }}>
//           <button
//             onClick={handleRunAutomation}
//             disabled={running}
//             style={{
//               padding: '8px 16px', fontSize: 12, fontWeight: 500,
//               border: '1px solid #D9CAAE',
//               background: '#FFFFFF',
//               color: '#A0A09A', borderRadius: 8, cursor: running ? 'wait' : 'pointer',
//               fontFamily: "'DM Sans', sans-serif",
//               opacity: running ? .6 : 1,
//               transition: 'all .15s',
//             }}
//           >
//             {running ? 'Running…' : '▸ Run automation'}
//           </button>
//           <button
//             onClick={() => setBulkModal('bulk')}
//             style={{
//               padding: '8px 16px', fontSize: 12, fontWeight: 600,
//               background: 'linear-gradient(135deg,#7B3D6E,#5C2A52)',
//               color: '#0D0C09', border: 'none', borderRadius: 8,
//               cursor: 'pointer', fontFamily: "'Syne', sans-serif",
//               boxShadow: '0 3px 14px rgba(201,151,61,.22)',
//               transition: 'transform .15s',
//             }}
//             onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
//             onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
//           >
//             Bulk message
//           </button>
//         </div>
//       </div>

//       {/* ── Analytics strip ── */}
//       {analytics && (
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
//           gap: 10, marginBottom: 22,
//         }}>
//           <MiniStat label="Active"     value={analytics.tier_distribution?.active   || 0} accent="#5A8A6E" />
//           <MiniStat label="Dormant"    value={analytics.tier_distribution?.dormant  || 0} accent="#7B3D6E" />
//           <MiniStat label="Inactive"   value={analytics.tier_distribution?.inactive || 0} accent="#C4694A" />
//           <MiniStat label="Msgs sent"  value={analytics.messages?.by_status?.sent   || 0} />
//           <MiniStat label="Failed"     value={analytics.messages?.by_status?.failed || 0} accent="#C4694A" />
//         </div>
//       )}

//       {/* ── Filters bar ── */}
//       <div style={{
//         padding: '11px 16px',
//         background: '#FFFFFF',
//         border: '1px solid #EAE5DD',
//         borderRadius: 10, marginBottom: 14,
//         display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
//       }}>
//         {/* Search */}
//         <div style={{ position: 'relative', flex: '1 1 200px' }}>
//           <svg
//             width="13" height="13" viewBox="0 0 13 13" fill="none"
//             style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}
//           >
//             <circle cx="5.5" cy="5.5" r="4" stroke="rgba(255,255,255,.25)" strokeWidth="1.3"/>
//             <path d="M9 9l2.5 2.5" stroke="rgba(255,255,255,.25)" strokeWidth="1.3" strokeLinecap="round"/>
//           </svg>
//           <input
//             placeholder="Search by name, area, phone…"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             style={{
//               width: '100%', padding: '7px 10px 7px 30px', fontSize: 13,
//               border: '1px solid #EAE5DD',
//               borderRadius: 7,
//               background: '#FFFFFF', color: '#E8E4DC', outline: 'none',
//               fontFamily: "'DM Sans', sans-serif",
//               transition: 'border-color .15s',
//             }}
//             onFocus={e => e.target.style.borderColor = 'rgba(201,151,61,.5)'}
//             onBlur={e => e.target.style.borderColor = '#EAE5DD'}
//           />
//         </div>

//         {/* Period toggle */}
//         <div style={{
//           display: 'flex', background: '#F5F2EE',
//           borderRadius: 7, padding: 3, gap: 2,
//         }}>
//           {PERIODS.map(p => (
//             <button key={p.value} onClick={() => setPeriod(p.value)}
//               style={{
//                 padding: '4px 12px', fontSize: 12, fontWeight: 500,
//                 border: 'none', borderRadius: 5, cursor: 'pointer',
//                 background: period === p.value ? '#D9CAAE' : 'transparent',
//                 color: period === p.value ? '#E8E4DC' : '#5A5650',
//                 fontFamily: "'DM Sans', sans-serif",
//                 transition: 'all .15s',
//               }}
//             >
//               {p.label}
//             </button>
//           ))}
//         </div>

//         {/* Tier pills */}
//         <div style={{ display: 'flex', gap: 4 }}>
//           {TIERS.map(t => (
//             <button key={t.value} onClick={() => setTier(t.value)}
//               style={{
//                 padding: '4px 12px', fontSize: 11, fontWeight: 600,
//                 letterSpacing: '.04em',
//                 border: `1px solid ${tier === t.value
//                   ? (t.value ? tierAccent[t.value] : 'rgba(255,255,255,.3)')
//                   : '#EAE5DD'}`,
//                 borderRadius: 20, cursor: 'pointer',
//                 background: tier === t.value
//                   ? t.value ? `${tierAccent[t.value]}18` : '#EAE5DD'
//                   : 'transparent',
//                 color: tier === t.value
//                   ? t.value ? tierAccent[t.value] : '#E8E4DC'
//                   : '#5A5650',
//                 fontFamily: "'DM Sans', sans-serif",
//                 transition: 'all .15s',
//               }}
//             >
//               {t.label}
//             </button>
//           ))}
//         </div>

//         {tier && (
//           <button
//             onClick={() => setBulkModal(tier)}
//             style={{
//               padding: '5px 13px', fontSize: 11, fontWeight: 500,
//               border: '1px solid #EAE5DD',
//               background: '#FFFFFF',
//               color: '#8A8680', borderRadius: 7, cursor: 'pointer',
//               fontFamily: "'DM Sans', sans-serif",
//             }}
//           >
//             Message all {tier}
//           </button>
//         )}
//       </div>

//       {/* ── CP Table ── */}
//       <div style={{
//         border: '1px solid #EAE5DD',
//         borderRadius: 12, overflow: 'hidden',
//         background: '#FAFAF8',
//       }}>
//         {loading ? (
//           <div style={{ padding: 56, display: 'flex', justifyContent: 'center' }}>
//             <Spinner size={26} color="#7B3D6E" />
//           </div>
//         ) : cps.length === 0 ? (
//           <Empty title="No CPs found" sub="Try adjusting your filters or import CPs to get started." />
//         ) : (
//           <>
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr style={{ borderBottom: '1px solid #EAE5DD' }}>
//                   {['Channel partner', 'Site visits', 'Deals', 'Score', 'Last active', 'Tier', ''].map(h => (
//                     <th key={h} style={{
//                       padding: '11px 16px', fontSize: 10, fontWeight: 600,
//                       color: '#4A4640', textAlign: 'left',
//                       textTransform: 'uppercase', letterSpacing: '.08em',
//                       background: '#FAFAF8',
//                     }}>
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {cps.map((row, i) => (
//                   <CPRow
//                     key={row.cp?.id}
//                     row={row}
//                     index={i}
//                     projectId={projectId}
//                     onMessage={() => navigate(`/projects/${projectId}/cps/${row.cp?.id}`)}
//                   />
//                 ))}
//               </tbody>
//             </table>

//             {total > LIMIT && (
//               <div style={{
//                 padding: '12px 18px',
//                 borderTop: '1px solid #EAE5DD',
//                 display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//               }}>
//                 <span style={{ fontSize: 12, color: '#4A4640', fontFamily: "'IBM Plex Mono', monospace" }}>
//                   {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
//                 </span>
//                 <div style={{ display: 'flex', gap: 6 }}>
//                   {[{ label: '← Prev', disabled: page === 1, fn: () => setPage(p => p - 1) },
//                     { label: 'Next →', disabled: page * LIMIT >= total, fn: () => setPage(p => p + 1) }].map(b => (
//                     <button
//                       key={b.label}
//                       disabled={b.disabled}
//                       onClick={b.fn}
//                       style={{
//                         padding: '5px 12px', fontSize: 12, borderRadius: 7,
//                         border: '1px solid #EAE5DD',
//                         background: 'transparent', color: b.disabled ? '#3A3A36' : '#8A8680',
//                         cursor: b.disabled ? 'default' : 'pointer',
//                         fontFamily: "'DM Sans', sans-serif",
//                       }}
//                     >
//                       {b.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* ── Bulk message modal ── */}
//       <BulkMessageModal
//         open={!!bulkModal}
//         tier={bulkModal}
//         onClose={() => setBulkModal(null)}
//         onSend={handleBulkSend}
//       />
//     </div>
//   );
// }

// /* ── CP Table row ──────────────────────────────────────────────── */
// function CPRow({ row, index, projectId, onMessage }) {
//   const navigate = useNavigate();
//   const cp       = row.cp || {};
//   const [hov, setHov] = useState(false);
//   const inactiveDays = row.activity?.last_active_at
//     ? Math.floor((Date.now() - new Date(row.activity.last_active_at)) / 86400000)
//     : null;
//   const score = row.activity?.score || 0;
//   const scoreColor = score >= 60 ? '#5A8A6E' : score >= 30 ? '#7B3D6E' : '#C4694A';

//   return (
//     <tr
//       onMouseEnter={() => setHov(true)}
//       onMouseLeave={() => setHov(false)}
//       onClick={() => navigate(`/projects/${projectId}/cps/${cp.id}`)}
//       className="animate-fadeUp"
//       style={{
//         borderBottom: '1px solid #F5F2EE',
//         background: hov ? '#FFFFFF' : 'transparent',
//         cursor: 'pointer', transition: 'background .1s',
//         animationDelay: `${index * 0.03}s`,
//       }}
//     >
//       {/* Name + meta */}
//       <td style={{ padding: '13px 16px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           <Avatar name={cp.name} size={32} index={index} />
//           <div>
//             <div style={{ fontSize: 13, fontWeight: 500, color: '#E8E4DC' }}>{cp.name}</div>
//             <div style={{ fontSize: 11, color: '#4A4640', marginTop: 1 }}>
//               {cp.area}{cp.firm_name ? ` · ${cp.firm_name}` : ''}
//             </div>
//           </div>
//         </div>
//       </td>

//       {/* Site visits */}
//       <td style={{ padding: '13px 16px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <div style={{ flex: 1, maxWidth: 80, height: 3, background: '#EAE5DD', borderRadius: 2 }}>
//             <div style={{
//               height: '100%', borderRadius: 2,
//               background: '#7B3D6E',
//               width: `${Math.min(100, ((row.activity?.site_visits || 0) / 20) * 100)}%`,
//             }} />
//           </div>
//           <span style={{
//             fontSize: 12, color: '#7A7570',
//             fontFamily: "'IBM Plex Mono', monospace",
//           }}>
//             {row.activity?.site_visits || 0}
//           </span>
//         </div>
//       </td>

//       {/* Deals */}
//       <td style={{ padding: '13px 16px' }}>
//         <span style={{
//           fontSize: 13, fontWeight: 600, color: '#E8E4DC',
//           fontFamily: "'IBM Plex Mono', monospace",
//         }}>
//           {row.activity?.deals_closed || 0}
//         </span>
//       </td>

//       {/* Score */}
//       <td style={{ padding: '13px 16px' }}>
//         <span style={{ fontSize: 13, fontWeight: 600, color: scoreColor, fontFamily: "'IBM Plex Mono', monospace" }}>
//           {score}
//         </span>
//         <span style={{ fontSize: 10, color: '#3A3A36' }}>/100</span>
//       </td>

//       {/* Last active */}
//       <td style={{ padding: '13px 16px' }}>
//         {row.activity?.last_active_at ? (
//           <div>
//             <div style={{ fontSize: 12, color: '#8A8680' }}>
//               {formatDistanceToNow(new Date(row.activity.last_active_at), { addSuffix: true })}
//             </div>
//             {inactiveDays !== null && inactiveDays >= 7 && (
//               <div style={{ fontSize: 10, color: '#C4694A', marginTop: 2 }}>
//                 {inactiveDays}d inactive
//               </div>
//             )}
//           </div>
//         ) : (
//           <span style={{ fontSize: 11, color: '#3A3A36' }}>No activity</span>
//         )}
//       </td>

//       {/* Tier badge */}
//       <td style={{ padding: '13px 16px' }}>
//         <TierPill tier={row.activity?.tier || 'inactive'} />
//       </td>

//       {/* Action */}
//       <td style={{ padding: '13px 16px' }} onClick={e => e.stopPropagation()}>
//         <button
//           onClick={onMessage}
//           style={{
//             padding: '5px 13px', fontSize: 11, fontWeight: 600,
//             background: 'linear-gradient(135deg,#7B3D6E,#5C2A52)',
//             color: '#0D0C09', border: 'none', borderRadius: 6,
//             cursor: 'pointer', fontFamily: "'Syne', sans-serif",
//           }}
//         >
//           View →
//         </button>
//       </td>
//     </tr>
//   );
// }

// /* ── Tier pill ─────────────────────────────────────────────────── */
// function TierPill({ tier }) {
//   const accent = tierAccent[tier] || '#8A8680';
//   return (
//     <span style={{
//       display: 'inline-flex', alignItems: 'center', gap: 5,
//       padding: '3px 9px', borderRadius: 20,
//       border: `1px solid ${accent}40`,
//       background: `${accent}12`,
//       fontSize: 10, fontWeight: 600,
//       letterSpacing: '.06em', textTransform: 'uppercase',
//       color: accent,
//       fontFamily: "'DM Sans', sans-serif",
//     }}>
//       <span style={{ width: 4, height: 4, borderRadius: '50%', background: accent, display: 'inline-block' }} />
//       {tier}
//     </span>
//   );
// }

// /* ── Bulk message modal ────────────────────────────────────────── */
// function BulkMessageModal({ open, tier, onClose, onSend }) {
//   const [triggerType, setTriggerType] = useState('dormant_support');
//   const [text, setText] = useState('');
//   const [sending, setSending] = useState(false);

//   async function handleSend() {
//     setSending(true);
//     await onSend({ tier, triggerType, text: triggerType === 'manual' ? text : undefined });
//     setSending(false);
//   }

//   return (
//     <Modal open={open} onClose={onClose} title={`Message ${tier ? `all ${tier} CPs` : 'bulk CPs'}`}>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: "'DM Sans', sans-serif" }}>
//         <div style={{
//           padding: '11px 14px',
//           background: '#FFFFFF',
//           border: '1px solid #EAE5DD',
//           borderRadius: 8, fontSize: 13, color: '#7A7570', lineHeight: 1.55,
//         }}>
//           This will send a WhatsApp message to all <strong style={{ color: '#E8E4DC' }}>{tier}</strong> channel partners in this project.
//         </div>

//         <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//           <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#5A5650' }}>
//             Message type
//           </label>
//           <select
//             value={triggerType}
//             onChange={e => setTriggerType(e.target.value)}
//             style={{
//               padding: '9px 12px', fontSize: 13, borderRadius: 8,
//               border: '1px solid #EAE5DD',
//               background: '#FFFFFF', color: '#E8E4DC', outline: 'none',
//               fontFamily: "'DM Sans', sans-serif",
//             }}
//           >
//             {TRIGGER_OPTIONS.map(o => (
//               <option key={o.value} value={o.value}>{o.label}</option>
//             ))}
//           </select>
//         </div>

//         {triggerType === 'manual' && (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//             <label style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#5A5650' }}>
//               Message text
//             </label>
//             <textarea
//               value={text}
//               onChange={e => setText(e.target.value)}
//               placeholder="Hi {name}, this is…"
//               rows={4}
//               style={{
//                 padding: '9px 12px', fontSize: 13, borderRadius: 8,
//                 border: '1px solid #EAE5DD',
//                 background: '#FFFFFF',
//                 color: '#E8E4DC', outline: 'none', resize: 'vertical', lineHeight: 1.6,
//                 fontFamily: "'DM Sans', sans-serif",
//               }}
//               onFocus={e => e.target.style.borderColor = 'rgba(201,151,61,.5)'}
//               onBlur={e => e.target.style.borderColor = '#EAE5DD'}
//             />
//           </div>
//         )}

//         <div style={{ display: 'flex', gap: 8 }}>
//           <Btn variant="brand" loading={sending} onClick={handleSend}
//             disabled={triggerType === 'manual' && !text.trim()}>
//             Send via WhatsApp
//           </Btn>
//           <Btn onClick={onClose}>Cancel</Btn>
//         </div>
//       </div>
//     </Modal>
//   );
// }














// src/pages/ProjectDetail.js
// import { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getCPs, getAnalytics, sendBulkMessage, runAutomation } from '../services/api';
// import { formatDistanceToNow } from 'date-fns';
// import toast from 'react-hot-toast';

// /* ── Shared primitives ───────────────────────────────────── */
// function GoldBtn({ children, loading, size='md', variant='brand', onClick, type='button', disabled }) {
//   const pad = size==='sm' ? '5px 12px' : '9px 18px';
//   const fs  = size==='sm' ? 11 : 13;
//   const styles = {
//     brand:  { background:'linear-gradient(135deg,#7B3D6E,#5C2A52)', color:'#FFFFFF', boxShadow:'0 2px 10px rgba(123,61,110,.22)' },
//     dark:   { background:'#EAE5DD', color:'#1C1028', border:'1px solid #D9CAAE' },
//     ghost:  { background:'transparent', color:'#B0A494', border:'1px solid #EAE5DD' },
//     danger: { background:'#FBECE6', color:'#D4907A', border:'1px solid rgba(239,68,68,.3)' },
//     active: { background:'#E8F0EB',  color:'#6EA882', border:'1px solid rgba(34,197,94,.3)' },
//   };
//   return (
//     <button type={type} disabled={disabled||loading} onClick={onClick}
//       style={{ padding:pad, fontSize:fs, fontWeight:600, fontFamily:'inherit', borderRadius:8, border:'none', cursor:disabled||loading?'not-allowed':'pointer', display:'inline-flex', alignItems:'center', gap:5, opacity:disabled?.5:1, transition:'all .15s', whiteSpace:'nowrap', ...styles[variant] }}
//       onMouseEnter={e => { if(!disabled&&!loading) e.currentTarget.style.transform='translateY(-1px)'; }}
//       onMouseLeave={e => { e.currentTarget.style.transform='none'; }}>
//       {loading && <span style={{ width:11, height:11, border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />}
//       {children}
//     </button>
//   );
// }

// function TierBadge({ tier }) {
//   const cfg = {
//     active:   { bg:'#E8F0EB',   color:'#6EA882',  dot:'#3D6B50', label:'Active'   },
//     dormant:  { bg:'#F8F0E4',   color:'#D4A84A',  dot:'#9C6820', label:'Dormant'  },
//     inactive: { bg:'#FBECE6',   color:'#D4907A',  dot:'#A8391A', label:'Inactive' },
//   };
//   const c = cfg[tier] || cfg.inactive;
//   return (
//     <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:c.bg, color:c.color }}>
//       <span style={{ width:5, height:5, borderRadius:'50%', background:c.dot, flexShrink:0 }} />
//       {c.label}
//     </span>
//   );
// }

// function Modal({ open, onClose, title, children, width=460 }) {
//   useEffect(() => {
//     const h = e => { if (e.key==='Escape') onClose(); };
//     if (open) document.addEventListener('keydown', h);
//     return () => document.removeEventListener('keydown', h);
//   }, [open, onClose]);
//   if (!open) return null;
//   return (
//     <div onClick={e => { if(e.target===e.currentTarget) onClose(); }}
//       style={{ position:'fixed', inset:0, background:'rgba(28,16,40,.45)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}>
//       <div style={{ background:'#FFFFFF', border:'1px solid #D9CAAE', borderRadius:18, width:'100%', maxWidth:width, padding:28, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(28,16,40,.45)' }}>
//         <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
//           <h3 style={{ fontFamily:"'Bricolage Grotesque', sans-serif", fontSize:16, fontWeight:700, color:'#1C1028' }}>{title}</h3>
//           <button onClick={onClose} style={{ background:'#EAE5DD', border:'none', width:28, height:28, borderRadius:8, color:'#B0A494', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }

// const PERIODS = [{ value:'weekly', label:'Week' }, { value:'monthly', label:'Month' }, { value:'yearly', label:'Year' }];
// const TIERS   = [{ value:'', label:'All' }, { value:'active', label:'Active' }, { value:'dormant', label:'Dormant' }, { value:'inactive', label:'Inactive' }];
// const TRIGGERS = [
//   { value:'dormant_support',   label:'🤝 Dormant support'    },
//   { value:'inactivity_7d',     label:'⏰ 7-day reminder'      },
//   { value:'inactivity_14d',    label:'⚠️ 14-day warning'      },
//   { value:'active_perk',       label:'🎁 Active perk'         },
//   { value:'no_conversation',   label:'💬 No conversation'     },
//   { value:'manual',            label:'✏️ Custom message'      },
// ];

// export default function ProjectDetail() {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const [cps, setCps]           = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const [loading, setLoading]   = useState(true);
//   const [period, setPeriod]     = useState('monthly');
//   const [tier, setTier]         = useState('');
//   const [search, setSearch]     = useState('');
//   const [page, setPage]         = useState(1);
//   const [total, setTotal]       = useState(0);
//   const [bulkModal, setBulkModal] = useState(false);
//   const [running, setRunning]   = useState(false);
//   const LIMIT = 25;

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [cpData, analyticsData] = await Promise.all([
//         getCPs(projectId, { period, tier, search, page, limit:LIMIT }),
//         getAnalytics(projectId, period)
//       ]);
//       setCps(cpData.cps || []);
//       setTotal(cpData.total || 0);
//       setAnalytics(analyticsData);
//     } catch { toast.error('Failed to load'); }
//     finally { setLoading(false); }
//   }, [projectId, period, tier, search, page]);

//   useEffect(() => { load(); }, [load]);
//   useEffect(() => { setPage(1); }, [search, tier, period]);

//   async function handleRun() {
//     setRunning(true);
//     try { await runAutomation(projectId); toast.success('Automation complete!'); load(); }
//     catch { toast.error('Automation failed'); }
//     finally { setRunning(false); }
//   }

//   async function handleBulk({ t, triggerType, text }) {
//     try {
//       const r = await sendBulkMessage(projectId, { tier:t, triggerType, text });
//       toast.success(`Sent to ${r.sent} CPs!`);
//       setBulkModal(false);
//     } catch { toast.error('Failed to send'); }
//   }

//   const tierColor = { active:'#3D6B50', dormant:'#9C6820', inactive:'#A8391A' };

//   return (
//     <div style={{ padding:'28px', fontFamily:"'Plus Jakarta Sans',sans-serif", minHeight:'100vh', background:'#FAF8F5' }}>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .pu{animation:fadeUp .35s ease both} tr.cprow:hover td{background:rgba(245,192,0,.03)!important}`}</style>

//       {/* Breadcrumb */}
//       <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, fontSize:12, color:'#9486A8' }}>
//         <button onClick={() => navigate('/dashboard')} style={{ background:'none', border:'none', color:'#9486A8', cursor:'pointer', fontSize:12, padding:0 }}>Projects</button>
//         <span>/</span>
//         <span style={{ color:'#1C1028', fontWeight:500 }}>{analytics?.project_name || 'Channel Partners'}</span>
//       </div>

//       {/* Page header */}
//       <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
//         <div>
//           <h1 style={{ fontFamily:"'Bricolage Grotesque', sans-serif", fontSize:24, fontWeight:700, color:'#1C1028', marginBottom:4, lineHeight:1 }}>Channel Partners</h1>
//           <p style={{ fontSize:13, color:'#9486A8' }}>{total} partners · {period} view</p>
//         </div>
//         <div style={{ display:'flex', gap:8 }}>
//           <GoldBtn variant="dark" loading={running} onClick={handleRun}>{running?'':'▶ Run automation'}</GoldBtn>
//           <GoldBtn onClick={() => setBulkModal(true)}>📨 Bulk message</GoldBtn>
//         </div>
//       </div>

//       {/* Analytics strip */}
//       {analytics && (
//         <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:10, marginBottom:20 }}>
//           {[
//             { label:'Active',    value:analytics.tier_distribution?.active||0,   color:'#3D6B50' },
//             { label:'Dormant',   value:analytics.tier_distribution?.dormant||0,  color:'#9C6820' },
//             { label:'Inactive',  value:analytics.tier_distribution?.inactive||0, color:'#A8391A' },
//             { label:'Msgs sent', value:analytics.messages?.by_status?.sent||0,   color:'#9B5A8E' },
//             { label:'Delivered', value:analytics.messages?.by_status?.delivered||0, color:'#7B3D6E' },
//           ].map((s,i) => (
//             <div key={i} className="pu" style={{ animationDelay:`${i*.04}s`, padding:'14px 16px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:12 }}>
//               <div style={{ fontSize:10, color:'#9486A8', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:6 }}>{s.label}</div>
//               <div style={{ fontSize:22, fontFamily:"'Bricolage Grotesque', sans-serif", fontWeight:700, color:s.color }}>{s.value}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Filter bar */}
//       <div style={{ padding:'12px 16px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:14, marginBottom:14, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
//         {/* Search */}
//         <div style={{ position:'relative', flex:'1 1 200px' }}>
//           <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9486A8', fontSize:13 }}>🔍</span>
//           <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, area…"
//             style={{ width:'100%', padding:'7px 10px 7px 30px', fontSize:13, background:'#F5F2EE', border:'1px solid #EAE5DD', borderRadius:8, color:'#1C1028', outline:'none', boxSizing:'border-box' }}
//             onFocus={e => e.target.style.borderColor='rgba(123,61,110,.45)'}
//             onBlur={e => e.target.style.borderColor='#EAE5DD'} />
//         </div>

//         {/* Period */}
//         <div style={{ display:'flex', background:'#F5F2EE', borderRadius:8, padding:3, gap:2 }}>
//           {PERIODS.map(p => (
//             <button key={p.value} onClick={() => setPeriod(p.value)}
//               style={{ padding:'5px 12px', fontSize:12, fontWeight:500, border:'none', borderRadius:6, cursor:'pointer', transition:'all .15s', background:period===p.value?'#7B3D6E':'transparent', color:period===p.value?'#0C0C0A':'#9B9B92', fontFamily:'inherit' }}>
//               {p.label}
//             </button>
//           ))}
//         </div>

//         {/* Tier */}
//         <div style={{ display:'flex', gap:4 }}>
//           {TIERS.map(t => (
//             <button key={t.value} onClick={() => setTier(t.value)}
//               style={{ padding:'5px 12px', fontSize:11, fontWeight:600, borderRadius:20, cursor:'pointer', border:`1px solid ${tier===t.value ? (tierColor[t.value]||'#7B3D6E') : '#EAE5DD'}`, background: tier===t.value ? `${tierColor[t.value]||'#7B3D6E'}22` : 'transparent', color: tier===t.value ? (tierColor[t.value]||'#7B3D6E') : '#9B9B92', fontFamily:'inherit', transition:'all .15s' }}>
//               {t.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Table */}
//       <div style={{ background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:16, overflow:'hidden' }}>
//         {loading ? (
//           <div style={{ padding:48, display:'flex', justifyContent:'center' }}>
//             <span style={{ width:28, height:28, border:'3px solid rgba(123,61,110,.28)', borderTopColor:'#7B3D6E', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />
//           </div>
//         ) : cps.length === 0 ? (
//           <div style={{ textAlign:'center', padding:'52px 24px' }}>
//             <div style={{ fontSize:36, marginBottom:12 }}>👥</div>
//             <div style={{ fontFamily:"'Bricolage Grotesque', sans-serif", fontSize:15, fontWeight:600, color:'#1C1028', marginBottom:6 }}>No CPs found</div>
//             <div style={{ fontSize:13, color:'#9486A8' }}>Try adjusting your filters or import CPs</div>
//           </div>
//         ) : (
//           <>
//             <table style={{ width:'100%', borderCollapse:'collapse' }}>
//               <thead>
//                 <tr style={{ borderBottom:'1px solid #EAE5DD', background:'#FAFAF8' }}>
//                   {['Channel Partner','Site Visits','Deals','Score','Last Active','Tier',''].map(h => (
//                     <th key={h} style={{ padding:'11px 14px', fontSize:10, fontWeight:700, color:'#9486A8', textAlign:'left', textTransform:'uppercase', letterSpacing:'.07em' }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {cps.map((row, i) => <CPRow key={row.cp?.id||i} row={row} index={i} projectId={projectId} />)}
//               </tbody>
//             </table>

//             {total > LIMIT && (
//               <div style={{ padding:'12px 16px', borderTop:'1px solid #EAE5DD', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
//                 <span style={{ fontSize:12, color:'#9486A8' }}>{(page-1)*LIMIT+1}–{Math.min(page*LIMIT,total)} of {total}</span>
//                 <div style={{ display:'flex', gap:6 }}>
//                   <GoldBtn size="sm" variant="ghost" disabled={page===1} onClick={() => setPage(p=>p-1)}>← Prev</GoldBtn>
//                   <GoldBtn size="sm" variant="ghost" disabled={page*LIMIT>=total} onClick={() => setPage(p=>p+1)}>Next →</GoldBtn>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Bulk modal */}
//       <BulkModal open={bulkModal} tier={tier} onClose={() => setBulkModal(false)} onSend={handleBulk} />
//     </div>
//   );
// }

// /* ── CP Row ───────────────────────────────────────────────── */
// function CPRow({ row, index, projectId }) {
//   const navigate = useNavigate();
//   const cp = row.cp || {};
//   const act = row.activity || {};
//   const inactiveDays = act.last_active_at ? Math.floor((Date.now()-new Date(act.last_active_at))/86400000) : null;
//   const maxVisits = 20;
//   const pct = Math.min(Math.round(((act.site_visits||0)/maxVisits)*100), 100);
//   const tierColor = { active:'#3D6B50', dormant:'#9C6820', inactive:'#A8391A' };

//   return (
//     <tr className="cprow" style={{ borderBottom:'1px solid #FFFFFF', cursor:'pointer', transition:'background .1s' }}
//       onClick={() => navigate(`/projects/${projectId}/cps/${cp.id}`)}>
//       <td style={{ padding:'12px 14px' }}>
//         <div style={{ display:'flex', alignItems:'center', gap:10 }}>
//           <div style={{ width:32, height:32, borderRadius:'50%', background:`${tierColor[act.tier]||'#6B6B64'}22`, color:tierColor[act.tier]||'#9B9B92', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
//             {(cp.name||'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
//           </div>
//           <div>
//             <div style={{ fontSize:13, fontWeight:500, color:'#1C1028' }}>{cp.name}</div>
//             <div style={{ fontSize:11, color:'#9486A8' }}>{cp.area}{cp.firm_name?` · ${cp.firm_name}`:''}</div>
//           </div>
//         </div>
//       </td>
//       <td style={{ padding:'12px 14px' }}>
//         <div style={{ display:'flex', alignItems:'center', gap:8 }}>
//           <div style={{ flex:1, height:5, background:'#EAE5DD', borderRadius:3, overflow:'hidden', maxWidth:70 }}>
//             <div style={{ height:'100%', width:`${pct}%`, background:tierColor[act.tier]||'#6B6B64', borderRadius:3 }} />
//           </div>
//           <span style={{ fontSize:12, color:'#B0A494', minWidth:20 }}>{act.site_visits||0}</span>
//         </div>
//       </td>
//       <td style={{ padding:'12px 14px', fontSize:13, color:'#1C1028', fontWeight:500 }}>{act.deals_closed||0}</td>
//       <td style={{ padding:'12px 14px' }}>
//         <span style={{ fontSize:13, fontWeight:700, color: (act.score||0)>=60?'#3D6B50':(act.score||0)>=30?'#9C6820':'#A8391A' }}>{act.score||0}</span>
//         <span style={{ fontSize:10, color:'#9486A8' }}>/100</span>
//       </td>
//       <td style={{ padding:'12px 14px' }}>
//         {act.last_active_at ? (
//           <div>
//             <div style={{ fontSize:12, color:'#B0A494' }}>{formatDistanceToNow(new Date(act.last_active_at), { addSuffix:true })}</div>
//             {inactiveDays >= 7 && <div style={{ fontSize:10, color:'#A8391A', marginTop:1 }}>⚠ {inactiveDays}d inactive</div>}
//           </div>
//         ) : <span style={{ fontSize:11, color:'#9486A8' }}>No activity</span>}
//       </td>
//       <td style={{ padding:'12px 14px' }}><TierBadge tier={act.tier||'inactive'} /></td>
//       <td style={{ padding:'12px 14px' }} onClick={e => e.stopPropagation()}>
//         <button onClick={() => navigate(`/projects/${projectId}/cps/${cp.id}`)}
//           style={{ padding:'5px 12px', fontSize:11, fontWeight:600, background:'#7B3D6E', color:'#FFFFFF', border:'none', borderRadius:7, cursor:'pointer' }}>
//           View →
//         </button>
//       </td>
//     </tr>
//   );
// }

// /* ── Bulk message modal ───────────────────────────────────── */
// function BulkModal({ open, tier, onClose, onSend }) {
//   const [triggerType, setTriggerType] = useState('dormant_support');
//   const [text, setText] = useState('');
//   const [sending, setSending] = useState(false);

//   async function handleSend() {
//     setSending(true);
//     await onSend({ t: tier, triggerType, text: triggerType==='manual'?text:undefined });
//     setSending(false);
//   }

//   return (
//     <Modal open={open} onClose={onClose} title={`Bulk message${tier ? ` — ${tier} CPs` : ''}`}>
//       <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
//         <div style={{ padding:'10px 13px', background:'rgba(123,61,110,.07)', border:'1px solid rgba(123,61,110,.15)', borderRadius:8, fontSize:12, color:'#D4A84A' }}>
//           📢 Sends WhatsApp to all <strong>{tier||'selected'}</strong> channel partners in this project.
//         </div>
//         <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
//           <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Message type</label>
//           <select value={triggerType} onChange={e => setTriggerType(e.target.value)}
//             style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none' }}>
//             {TRIGGERS.map(o => <option key={o.value} value={o.value} style={{ background:'#1A1A16' }}>{o.label}</option>)}
//           </select>
//         </div>
//         {triggerType === 'manual' && (
//           <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
//             <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Message text</label>
//             <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="Hi {name}, this is…"
//               style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none', resize:'vertical', lineHeight:1.6 }} />
//           </div>
//         )}
//         <div style={{ display:'flex', gap:8 }}>
//           <button disabled={sending||(triggerType==='manual'&&!text.trim())} onClick={handleSend}
//             style={{ padding:'9px 18px', fontSize:13, fontWeight:600, background:'#7B3D6E', color:'#FFFFFF', border:'none', borderRadius:9, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
//             {sending && <span style={{ width:12, height:12, border:'2px solid rgba(0,0,0,.3)', borderTopColor:'#0C0C0A', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />}
//             Send via WhatsApp
//           </button>
//           <button onClick={onClose} style={{ padding:'9px 18px', fontSize:13, fontWeight:500, background:'transparent', color:'#B0A494', border:'1px solid #EAE5DD', borderRadius:9, cursor:'pointer' }}>Cancel</button>
//         </div>
//       </div>
//     </Modal>
//   );
// }

// function TierBadge({ tier }) {
//   const cfg = { active:{bg:'#E8F0EB',color:'#6EA882',dot:'#3D6B50',label:'Active'}, dormant:{bg:'#F8F0E4',color:'#D4A84A',dot:'#9C6820',label:'Dormant'}, inactive:{bg:'#FBECE6',color:'#D4907A',dot:'#A8391A',label:'Inactive'} };
//   const c = cfg[tier]||cfg.inactive;
//   return <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:c.bg, color:c.color }}><span style={{ width:5, height:5, borderRadius:'50%', background:c.dot }} />{c.label}</span>;
// }




































// src/pages/ProjectDetail.js
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCPs, getAnalytics, sendBulkMessage, runAutomation } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

/* ── Shared primitives ───────────────────────────────────── */
function GoldBtn({ children, loading, size='md', variant='brand', onClick, type='button', disabled }) {
  const pad = size==='sm' ? '5px 12px' : '9px 18px';
  const fs  = size==='sm' ? 11 : 13;
  const styles = {
    brand:  { background:'linear-gradient(135deg,#7B3D6E,#5C2A52)', color:'#FFFFFF', boxShadow:'0 2px 10px rgba(123,61,110,.22)' },
    dark:   { background:'#EAE5DD', color:'#1C1028', border:'1px solid #D9CAAE' },
    ghost:  { background:'transparent', color:'#B0A494', border:'1px solid #EAE5DD' },
    danger: { background:'#FBECE6', color:'#D4907A', border:'1px solid rgba(239,68,68,.3)' },
    active: { background:'#E8F0EB',  color:'#6EA882', border:'1px solid rgba(34,197,94,.3)' },
  };
  return (
    <button type={type} disabled={disabled||loading} onClick={onClick}
      style={{ padding:pad, fontSize:fs, fontWeight:600, fontFamily:'inherit', borderRadius:8, border:'none', cursor:disabled||loading?'not-allowed':'pointer', display:'inline-flex', alignItems:'center', gap:5, opacity:disabled?.5:1, transition:'all .15s', whiteSpace:'nowrap', ...styles[variant] }}
      onMouseEnter={e => { if(!disabled&&!loading) e.currentTarget.style.transform='translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='none'; }}>
      {loading && <span style={{ width:11, height:11, border:'2px solid currentColor', borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />}
      {children}
    </button>
  );
}

function TierBadge({ tier }) {
  const cfg = {
    active:   { bg:'#E8F0EB',   color:'#6EA882',  dot:'#3D6B50', label:'Active'   },
    dormant:  { bg:'#F8F0E4',   color:'#D4A84A',  dot:'#9C6820', label:'Dormant'  },
    inactive: { bg:'#FBECE6',   color:'#D4907A',  dot:'#A8391A', label:'Inactive' },
  };
  const c = cfg[tier] || cfg.inactive;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:c.bg, color:c.color }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:c.dot, flexShrink:0 }} />
      {c.label}
    </span>
  );
}

function Modal({ open, onClose, title, children, width=460 }) {
  useEffect(() => {
    const h = e => { if (e.key==='Escape') onClose(); };
    if (open) document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onClick={e => { if(e.target===e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, background:'rgba(28,16,40,.45)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:16 }}>
      <div style={{ background:'#FFFFFF', border:'1px solid #D9CAAE', borderRadius:18, width:'100%', maxWidth:width, padding:28, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(28,16,40,.45)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
          <h3 style={{ fontFamily:"'Bricolage Grotesque', sans-serif", fontSize:16, fontWeight:700, color:'#1C1028' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'#EAE5DD', border:'none', width:28, height:28, borderRadius:8, color:'#B0A494', cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const PERIODS = [{ value:'weekly', label:'Week' }, { value:'monthly', label:'Month' }, { value:'yearly', label:'Year' }];
const TIERS   = [{ value:'', label:'All' }, { value:'active', label:'Active' }, { value:'dormant', label:'Dormant' }, { value:'inactive', label:'Inactive' }];
const TRIGGERS = [
  { value:'dormant_support',   label:'🤝 Dormant support'    },
  { value:'inactivity_7d',     label:'⏰ 7-day reminder'      },
  { value:'inactivity_14d',    label:'⚠️ 14-day warning'      },
  { value:'active_perk',       label:'🎁 Active perk'         },
  { value:'no_conversation',   label:'💬 No conversation'     },
  { value:'manual',            label:'✏️ Custom message'      },
];

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [cps, setCps]           = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [period, setPeriod]     = useState('monthly');
  const [tier, setTier]         = useState('');
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [bulkModal, setBulkModal] = useState(false);
  const [running, setRunning]   = useState(false);
  const LIMIT = 25;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [cpData, analyticsData] = await Promise.all([
        getCPs(projectId, { period, tier, search, page, limit:LIMIT }),
        getAnalytics(projectId, period)
      ]);
      setCps(cpData.cps || []);
      setTotal(cpData.total || 0);
      setAnalytics(analyticsData);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  }, [projectId, period, tier, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, tier, period]);

  async function handleRun() {
    setRunning(true);
    try { await runAutomation(projectId); toast.success('Automation complete!'); load(); }
    catch { toast.error('Automation failed'); }
    finally { setRunning(false); }
  }

  async function handleBulk({ t, triggerType, text }) {
    try {
      const r = await sendBulkMessage(projectId, { tier:t, triggerType, text });
      toast.success(`Sent to ${r.sent} CPs!`);
      setBulkModal(false);
    } catch { toast.error('Failed to send'); }
  }

  const tierColor = { active:'#3D6B50', dormant:'#9C6820', inactive:'#A8391A' };

  return (
    <div style={{ padding:'28px', fontFamily:"'Plus Jakarta Sans',sans-serif", minHeight:'100vh', background:'#FAF8F5' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .pu{animation:fadeUp .35s ease both} tr.cprow:hover td{background:rgba(245,192,0,.03)!important}`}</style>

      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, fontSize:12, color:'#9486A8' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background:'none', border:'none', color:'#9486A8', cursor:'pointer', fontSize:12, padding:0 }}>Projects</button>
        <span>/</span>
        <span style={{ color:'#1C1028', fontWeight:500 }}>{analytics?.project_name || 'Channel Partners'}</span>
      </div>

      {/* Page header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontFamily:"'Bricolage Grotesque', sans-serif", fontSize:24, fontWeight:700, color:'#1C1028', marginBottom:4, lineHeight:1 }}>Channel Partners</h1>
          <p style={{ fontSize:13, color:'#9486A8' }}>{total} partners · {period} view</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <GoldBtn variant="dark" loading={running} onClick={handleRun}>{running?'':'▶ Run automation'}</GoldBtn>
          <GoldBtn onClick={() => setBulkModal(true)}>📨 Bulk message</GoldBtn>
        </div>
      </div>

      {/* Analytics strip */}
      {analytics && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:10, marginBottom:20 }}>
          {[
            { label:'Active',    value:analytics.tier_distribution?.active||0,   color:'#3D6B50' },
            { label:'Dormant',   value:analytics.tier_distribution?.dormant||0,  color:'#9C6820' },
            { label:'Inactive',  value:analytics.tier_distribution?.inactive||0, color:'#A8391A' },
            { label:'Msgs sent', value:analytics.messages?.by_status?.sent||0,   color:'#9B5A8E' },
            { label:'Delivered', value:analytics.messages?.by_status?.delivered||0, color:'#7B3D6E' },
          ].map((s,i) => (
            <div key={i} className="pu" style={{ animationDelay:`${i*.04}s`, padding:'14px 16px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:12 }}>
              <div style={{ fontSize:10, color:'#9486A8', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:6 }}>{s.label}</div>
              <div style={{ fontSize:22, fontFamily:"'Bricolage Grotesque', sans-serif", fontWeight:700, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ padding:'12px 16px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:14, marginBottom:14, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
        {/* Search */}
        <div style={{ position:'relative', flex:'1 1 200px' }}>
          <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#9486A8', fontSize:13 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, area…"
            style={{ width:'100%', padding:'7px 10px 7px 30px', fontSize:13, background:'#F5F2EE', border:'1px solid #EAE5DD', borderRadius:8, color:'#1C1028', outline:'none', boxSizing:'border-box' }}
            onFocus={e => e.target.style.borderColor='rgba(123,61,110,.45)'}
            onBlur={e => e.target.style.borderColor='#EAE5DD'} />
        </div>

        {/* Period */}
        <div style={{ display:'flex', background:'#F5F2EE', borderRadius:8, padding:3, gap:2 }}>
          {PERIODS.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              style={{ padding:'5px 12px', fontSize:12, fontWeight:500, border:'none', borderRadius:6, cursor:'pointer', transition:'all .15s', background:period===p.value?'#7B3D6E':'transparent', color:period===p.value?'#0C0C0A':'#9B9B92', fontFamily:'inherit' }}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Tier */}
        <div style={{ display:'flex', gap:4 }}>
          {TIERS.map(t => (
            <button key={t.value} onClick={() => setTier(t.value)}
              style={{ padding:'5px 12px', fontSize:11, fontWeight:600, borderRadius:20, cursor:'pointer', border:`1px solid ${tier===t.value ? (tierColor[t.value]||'#7B3D6E') : '#EAE5DD'}`, background: tier===t.value ? `${tierColor[t.value]||'#7B3D6E'}22` : 'transparent', color: tier===t.value ? (tierColor[t.value]||'#7B3D6E') : '#9B9B92', fontFamily:'inherit', transition:'all .15s' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:16, overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:48, display:'flex', justifyContent:'center' }}>
            <span style={{ width:28, height:28, border:'3px solid rgba(123,61,110,.28)', borderTopColor:'#7B3D6E', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />
          </div>
        ) : cps.length === 0 ? (
          <div style={{ textAlign:'center', padding:'52px 24px' }}>
            <div style={{ fontSize:36, marginBottom:12 }}>👥</div>
            <div style={{ fontFamily:"'Bricolage Grotesque', sans-serif", fontSize:15, fontWeight:600, color:'#1C1028', marginBottom:6 }}>No CPs found</div>
            <div style={{ fontSize:13, color:'#9486A8' }}>Try adjusting your filters or import CPs</div>
          </div>
        ) : (
          <>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid #EAE5DD', background:'#FAFAF8' }}>
                  {['Channel Partner','Site Visits','Deals','Score','Last Active','Tier',''].map(h => (
                    <th key={h} style={{ padding:'11px 14px', fontSize:10, fontWeight:700, color:'#9486A8', textAlign:'left', textTransform:'uppercase', letterSpacing:'.07em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cps.map((row, i) => <CPRow key={row.cp?.id||i} row={row} index={i} projectId={projectId} />)}
              </tbody>
            </table>

            {total > LIMIT && (
              <div style={{ padding:'12px 16px', borderTop:'1px solid #EAE5DD', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:12, color:'#9486A8' }}>{(page-1)*LIMIT+1}–{Math.min(page*LIMIT,total)} of {total}</span>
                <div style={{ display:'flex', gap:6 }}>
                  <GoldBtn size="sm" variant="ghost" disabled={page===1} onClick={() => setPage(p=>p-1)}>← Prev</GoldBtn>
                  <GoldBtn size="sm" variant="ghost" disabled={page*LIMIT>=total} onClick={() => setPage(p=>p+1)}>Next →</GoldBtn>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bulk modal */}
      <BulkModal open={bulkModal} tier={tier} onClose={() => setBulkModal(false)} onSend={handleBulk} />
    </div>
  );
}

/* ── CP Row ───────────────────────────────────────────────── */
function CPRow({ row, index, projectId }) {
  const navigate = useNavigate();
  const cp = row.cp || {};
  const act = row.activity || {};
  const inactiveDays = act.last_active_at ? Math.floor((Date.now()-new Date(act.last_active_at))/86400000) : null;
  const maxVisits = 20;
  const pct = Math.min(Math.round(((act.site_visits||0)/maxVisits)*100), 100);
  const tierColor = { active:'#3D6B50', dormant:'#9C6820', inactive:'#A8391A' };

  return (
    <tr className="cprow" style={{ borderBottom:'1px solid #FFFFFF', cursor:'pointer', transition:'background .1s' }}
      onClick={() => navigate(`/projects/${projectId}/cps/${cp.id}`)}>
      <td style={{ padding:'12px 14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', background:`${tierColor[act.tier]||'#6B6B64'}22`, color:tierColor[act.tier]||'#9B9B92', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
            {(cp.name||'').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:500, color:'#1C1028' }}>{cp.name}</div>
            <div style={{ fontSize:11, color:'#9486A8' }}>{cp.area}{cp.firm_name?` · ${cp.firm_name}`:''}</div>
          </div>
        </div>
      </td>
      <td style={{ padding:'12px 14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ flex:1, height:5, background:'#EAE5DD', borderRadius:3, overflow:'hidden', maxWidth:70 }}>
            <div style={{ height:'100%', width:`${pct}%`, background:tierColor[act.tier]||'#6B6B64', borderRadius:3 }} />
          </div>
          <span style={{ fontSize:12, color:'#B0A494', minWidth:20 }}>{act.site_visits||0}</span>
        </div>
      </td>
      <td style={{ padding:'12px 14px', fontSize:13, color:'#1C1028', fontWeight:500 }}>{act.deals_closed||0}</td>
      <td style={{ padding:'12px 14px' }}>
        <span style={{ fontSize:13, fontWeight:700, color: (act.score||0)>=60?'#3D6B50':(act.score||0)>=30?'#9C6820':'#A8391A' }}>{act.score||0}</span>
        <span style={{ fontSize:10, color:'#9486A8' }}>/100</span>
      </td>
      <td style={{ padding:'12px 14px' }}>
        {act.last_active_at ? (
          <div>
            <div style={{ fontSize:12, color:'#B0A494' }}>{formatDistanceToNow(new Date(act.last_active_at), { addSuffix:true })}</div>
            {inactiveDays >= 7 && <div style={{ fontSize:10, color:'#A8391A', marginTop:1 }}>⚠ {inactiveDays}d inactive</div>}
          </div>
        ) : <span style={{ fontSize:11, color:'#9486A8' }}>No activity</span>}
      </td>
      <td style={{ padding:'12px 14px' }}><TierBadge tier={act.tier||'inactive'} /></td>
      <td style={{ padding:'12px 14px' }} onClick={e => e.stopPropagation()}>
        <button onClick={() => navigate(`/projects/${projectId}/cps/${cp.id}`)}
          style={{ padding:'5px 12px', fontSize:11, fontWeight:600, background:'#7B3D6E', color:'#FFFFFF', border:'none', borderRadius:7, cursor:'pointer' }}>
          View →
        </button>
      </td>
    </tr>
  );
}

/* ── Bulk message modal ───────────────────────────────────── */
function BulkModal({ open, tier, onClose, onSend }) {
  const [triggerType, setTriggerType] = useState('dormant_support');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSend() {
    setSending(true);
    await onSend({ t: tier, triggerType, text: triggerType==='manual'?text:undefined });
    setSending(false);
  }

  return (
    <Modal open={open} onClose={onClose} title={`Bulk message${tier ? ` — ${tier} CPs` : ''}`}>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ padding:'10px 13px', background:'rgba(123,61,110,.07)', border:'1px solid rgba(123,61,110,.15)', borderRadius:8, fontSize:12, color:'#D4A84A' }}>
          📢 Sends WhatsApp to all <strong>{tier||'selected'}</strong> channel partners in this project.
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Message type</label>
          <select value={triggerType} onChange={e => setTriggerType(e.target.value)}
            style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none' }}>
            {TRIGGERS.map(o => <option key={o.value} value={o.value} style={{ background:'#1A1A16' }}>{o.label}</option>)}
          </select>
        </div>
        {triggerType === 'manual' && (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Message text</label>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="Hi {name}, this is…"
              style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none', resize:'vertical', lineHeight:1.6 }} />
          </div>
        )}
        <div style={{ display:'flex', gap:8 }}>
          <button disabled={sending||(triggerType==='manual'&&!text.trim())} onClick={handleSend}
            style={{ padding:'9px 18px', fontSize:13, fontWeight:600, background:'#7B3D6E', color:'#FFFFFF', border:'none', borderRadius:9, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            {sending && <span style={{ width:12, height:12, border:'2px solid rgba(0,0,0,.3)', borderTopColor:'#0C0C0A', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />}
            Send via WhatsApp
          </button>
          <button onClick={onClose} style={{ padding:'9px 18px', fontSize:13, fontWeight:500, background:'transparent', color:'#B0A494', border:'1px solid #EAE5DD', borderRadius:9, cursor:'pointer' }}>Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// function TierBadge({ tier }) {
//   const cfg = { active:{bg:'#E8F0EB',color:'#6EA882',dot:'#3D6B50',label:'Active'}, dormant:{bg:'#F8F0E4',color:'#D4A84A',dot:'#9C6820',label:'Dormant'}, inactive:{bg:'#FBECE6',color:'#D4907A',dot:'#A8391A',label:'Inactive'} };
//   const c = cfg[tier]||cfg.inactive;
//   return <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:c.bg, color:c.color }}><span style={{ width:5, height:5, borderRadius:'50%', background:c.dot }} />{c.label}</span>;
// }