// // src/pages/CPProfile.js
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getCP, sendMessage, createMeeting } from '../services/api';
// import { Card, Badge, Btn, Avatar, Modal, Empty, Spinner } from '../components/ui';
// import toast from 'react-hot-toast';
// import { format, formatDistanceToNow, parseISO } from 'date-fns';

// const TRIGGER_OPTIONS = [
//   { value: 'dormant_support',    label: 'Dormant support message',   tier: 'dormant' },
//   { value: 'inactivity_7d',      label: '7-day inactivity reminder', tier: 'any' },
//   { value: 'inactivity_14d',     label: '14-day warning',            tier: 'any' },
//   { value: 'inactivity_meeting', label: 'Meeting notification',      tier: 'inactive' },
//   { value: 'active_perk',        label: 'Perk / reward',             tier: 'active' },
//   { value: 'no_conversation',    label: 'No-conversation nudge',     tier: 'any' },
//   { value: 'performance_drop',   label: 'Performance drop alert',    tier: 'any' },
//   { value: 'manual',             label: 'Custom message',            tier: 'any' },
// ];

// const tierAccent = {
//   active:   '#5A8A6E',
//   dormant:  '#7B3D6E',
//   inactive: '#C4694A',
// };

// const MSG_STATUS_COLOR = {
//   sent:      '#5A8A6E',
//   failed:    '#C4694A',
//   pending:   '#7B3D6E',
//   delivered: '#5A8A6E',
//   read:      '#7B3D6E',
// };

// export default function CPProfile() {
//   const { projectId, cpId } = useParams();
//   const navigate = useNavigate();
//   const [cp, setCp]             = useState(null);
//   const [loading, setLoading]   = useState(true);
//   const [msgModal, setMsgModal] = useState(false);
//   const [meetingModal, setMeetingModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => { load(); }, [cpId]);

//   async function load() {
//     try {
//       setLoading(true);
//       const data = await getCP(projectId, cpId);
//       setCp(data);
//     } catch { toast.error('Failed to load CP profile'); }
//     finally { setLoading(false); }
//   }

//   async function handleSendMessage({ triggerType, text }) {
//     try {
//       const payload = triggerType === 'manual' ? { text, triggerType } : { triggerType };
//       await sendMessage(projectId, cpId, payload);
//       toast.success('WhatsApp message sent.');
//       setMsgModal(false);
//       load();
//     } catch (err) { toast.error(err.response?.data?.error || 'Send failed'); }
//   }

//   async function handleCreateMeeting({ scheduledAt, reason }) {
//     try {
//       await createMeeting(projectId, cpId, { scheduled_at: scheduledAt, reason });
//       toast.success('Meeting scheduled. CP notified.');
//       setMeetingModal(false);
//       load();
//     } catch { toast.error('Failed to schedule meeting'); }
//   }

//   if (loading) return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <Spinner size={28} color="#7B3D6E" />
//     </div>
//   );

//   if (!cp) return (
//     <div style={{ padding: 32 }}>
//       <Empty title="CP not found" action={<Btn onClick={() => navigate(-1)}>Go back</Btn>} />
//     </div>
//   );

//   const activity     = cp.cp_activity?.[0] || {};
//   const messages     = cp.messages || [];
//   const meetings     = cp.meetings || [];
//   const tier         = activity.tier || 'inactive';
//   const accent       = tierAccent[tier] || '#8A8680';
//   const inactiveDays = activity.last_active_at
//     ? Math.floor((Date.now() - new Date(activity.last_active_at)) / 86400000)
//     : 999;

//   const tierAction = {
//     active:   { label: 'Send perk reward',     triggerType: 'active_perk' },
//     dormant:  { label: 'Send support message', triggerType: 'dormant_support' },
//     inactive: { label: 'Send warning',         triggerType: 'inactivity_14d' },
//   }[tier] || { label: 'Send message', triggerType: 'manual' };

//   const TABS = [
//     { id: 'overview', label: 'Overview' },
//     { id: 'messages', label: `Messages (${messages.length})` },
//     { id: 'meetings', label: `Meetings (${meetings.length})` },
//   ];

//   const stats = [
//     { label: 'Score',         value: `${activity.score || 0}`, suffix: '/100', accent: activity.score >= 60 ? '#5A8A6E' : activity.score >= 30 ? '#7B3D6E' : '#C4694A' },
//     { label: 'Site visits',   value: activity.site_visits   || 0 },
//     { label: 'Referrals',     value: activity.client_referrals || 0 },
//     { label: 'Deals closed',  value: activity.deals_closed  || 0, accent: '#5A8A6E' },
//     { label: 'Messages sent', value: messages.length         || 0 },
//     { label: 'Meetings',      value: meetings.length         || 0 },
//   ];

//   return (
//     <div style={{ padding: 32, fontFamily: "'DM Sans', sans-serif", maxWidth: 1100 }}>

//       {/* ── Breadcrumb ── */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 12 }}>
//         {[
//           { label: 'Projects', to: '/dashboard' },
//           { label: 'Channel partners', to: `/projects/${projectId}` },
//         ].map((b, i) => (
//           <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <button
//               onClick={() => navigate(b.to)}
//               style={{
//                 background: 'none', border: 'none', color: '#4A4640',
//                 cursor: 'pointer', fontSize: 12, padding: 0,
//                 fontFamily: "'DM Sans', sans-serif",
//                 transition: 'color .15s',
//               }}
//               onMouseEnter={e => e.target.style.color = '#9A9690'}
//               onMouseLeave={e => e.target.style.color = '#4A4640'}
//             >
//               {b.label}
//             </button>
//             <span style={{ color: '#2A2A26' }}>/</span>
//           </span>
//         ))}
//         <span style={{ color: '#A0A09A', fontWeight: 500 }}>{cp.name}</span>
//       </div>

//       {/* ── Profile header ── */}
//       <div style={{
//         padding: '24px 26px',
//         background: '#FFFFFF',
//         border: '1px solid #EAE5DD',
//         borderRadius: 14, marginBottom: 16,
//       }}>
//         <div style={{
//           display: 'flex', alignItems: 'flex-start',
//           justifyContent: 'space-between', flexWrap: 'wrap', gap: 18,
//         }}>
//           {/* Identity */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//             <Avatar name={cp.name} size={52} index={0} />
//             <div>
//               <h2 style={{
//                 fontFamily: "'Syne', sans-serif",
//                 fontSize: 20, fontWeight: 700, letterSpacing: '-.02em',
//                 color: '#F2EEE6', marginBottom: 8,
//               }}>
//                 {cp.name}
//               </h2>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
//                 {/* Tier badge */}
//                 <span style={{
//                   display: 'inline-flex', alignItems: 'center', gap: 5,
//                   padding: '3px 10px', borderRadius: 20,
//                   border: `1px solid ${accent}50`,
//                   background: `${accent}12`,
//                   fontSize: 10, fontWeight: 700,
//                   letterSpacing: '.08em', textTransform: 'uppercase',
//                   color: accent,
//                 }}>
//                   <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent }} />
//                   {tier}
//                 </span>
//                 {cp.area      && <MetaChip label={cp.area} />}
//                 {cp.firm_name && <MetaChip label={cp.firm_name} />}
//                 {cp.whatsapp  && <MetaChip label={`+${cp.whatsapp}`} mono />}
//                 {cp.rera_number && <MetaChip label={cp.rera_number} mono />}
//               </div>
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
//             {tier === 'inactive' && (
//               <button
//                 onClick={() => setMeetingModal(true)}
//                 style={{
//                   padding: '8px 16px', fontSize: 12, fontWeight: 600,
//                   border: '1px solid rgba(248,113,113,.3)',
//                   background: 'rgba(248,113,113,.1)',
//                   color: '#C4694A', borderRadius: 8, cursor: 'pointer',
//                   fontFamily: "'DM Sans', sans-serif",
//                   transition: 'all .15s',
//                 }}
//               >
//                 Schedule meeting
//               </button>
//             )}
//             <button
//               onClick={() => handleSendMessage({ triggerType: tierAction.triggerType })}
//               style={{
//                 padding: '8px 16px', fontSize: 12, fontWeight: 500,
//                 border: '1px solid #D9CAAE',
//                 background: '#F5F2EE',
//                 color: '#C0BCB4', borderRadius: 8, cursor: 'pointer',
//                 fontFamily: "'DM Sans', sans-serif",
//                 transition: 'all .15s',
//               }}
//             >
//               {tierAction.label}
//             </button>
//             <button
//               onClick={() => setMsgModal(true)}
//               style={{
//                 padding: '8px 18px', fontSize: 12, fontWeight: 600,
//                 background: 'linear-gradient(135deg,#7B3D6E,#5C2A52)',
//                 color: '#0D0C09', border: 'none', borderRadius: 8,
//                 cursor: 'pointer', fontFamily: "'Syne', sans-serif",
//                 boxShadow: '0 3px 14px rgba(201,151,61,.2)',
//                 transition: 'transform .15s',
//               }}
//               onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
//               onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
//             >
//               Custom message
//             </button>
//           </div>
//         </div>

//         {/* Inactivity warning */}
//         {inactiveDays >= 7 && (
//           <div style={{
//             marginTop: 18, padding: '11px 16px',
//             background: inactiveDays >= 21
//               ? 'rgba(248,113,113,.08)'
//               : inactiveDays >= 14
//               ? 'rgba(251,146,60,.08)'
//               : 'rgba(201,151,61,.08)',
//             border: `1px solid ${inactiveDays >= 21 ? 'rgba(248,113,113,.2)' : inactiveDays >= 14 ? 'rgba(251,146,60,.2)' : 'rgba(201,151,61,.2)'}`,
//             borderRadius: 8, fontSize: 12, lineHeight: 1.5,
//             color: inactiveDays >= 21 ? '#C4694A' : inactiveDays >= 14 ? '#FB923C' : '#7B3D6E',
//           }}>
//             <strong>{inactiveDays} days inactive</strong>
//             {inactiveDays >= 21
//               ? ' — meeting should be scheduled immediately'
//               : inactiveDays >= 14
//               ? ' — send a strong re-engagement reminder'
//               : ' — send a check-in message'}
//           </div>
//         )}
//       </div>

//       {/* ── Stats row ── */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
//         gap: 10, marginBottom: 18,
//       }}>
//         {stats.map(s => (
//           <div
//             key={s.label}
//             style={{
//               padding: '14px 16px',
//               background: '#FFFFFF',
//               border: '1px solid #EAE5DD',
//               borderRadius: 10,
//             }}
//           >
//             <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.09em', textTransform: 'uppercase', color: '#4A4640', marginBottom: 8 }}>
//               {s.label}
//             </div>
//             <div style={{
//               fontFamily: "'IBM Plex Mono', monospace",
//               fontSize: 22, fontWeight: 500, lineHeight: 1,
//               color: s.accent || '#C0BCB4',
//             }}>
//               {s.value}
//               {s.suffix && <span style={{ fontSize: 11, color: '#3A3A36' }}>{s.suffix}</span>}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Tabs ── */}
//       <div style={{ display: 'flex', gap: 2, marginBottom: 14, padding: '3px', background: '#FFFFFF', borderRadius: 9, width: 'fit-content' }}>
//         {TABS.map(t => (
//           <button
//             key={t.id}
//             onClick={() => setActiveTab(t.id)}
//             style={{
//               padding: '6px 18px', fontSize: 12, fontWeight: 500,
//               border: 'none', borderRadius: 7, cursor: 'pointer',
//               background: activeTab === t.id ? '#D9CAAE' : 'transparent',
//               color: activeTab === t.id ? '#F2EEE6' : '#5A5650',
//               fontFamily: "'DM Sans', sans-serif",
//               transition: 'all .15s',
//             }}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {/* ── Tab: overview ── */}
//       {activeTab === 'overview' && (
//         <div style={{
//           padding: '20px 24px',
//           background: '#FAFAF8',
//           border: '1px solid #EAE5DD',
//           borderRadius: 12,
//         }}>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flexWrap: 'wrap' }}>
//             {[
//               { label: 'Email',       value: cp.email },
//               { label: 'WhatsApp',    value: cp.whatsapp ? `+${cp.whatsapp}` : '—' },
//               { label: 'Firm',        value: cp.firm_name || '—' },
//               { label: 'Area',        value: cp.area || '—' },
//               { label: 'RERA',        value: cp.rera_number || '—' },
//               { label: 'Last active', value: activity.last_active_at
//                 ? formatDistanceToNow(parseISO(activity.last_active_at), { addSuffix: true })
//                 : 'Never' },
//             ].map(field => (
//               <div key={field.label}>
//                 <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#4A4640', marginBottom: 5 }}>
//                   {field.label}
//                 </div>
//                 <div style={{ fontSize: 13, color: '#B0ACA4', fontFamily: field.label === 'WhatsApp' || field.label === 'RERA' ? "'IBM Plex Mono', monospace" : 'inherit' }}>
//                   {field.value || '—'}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ── Tab: messages ── */}
//       {activeTab === 'messages' && (
//         <div style={{ border: '1px solid #EAE5DD', borderRadius: 12, overflow: 'hidden' }}>
//           {messages.length === 0 ? (
//             <Empty title="No messages sent" sub="Messages will appear here after sending." />
//           ) : (
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr style={{ background: '#FFFFFF' }}>
//                   {['Type', 'Preview', 'Status', 'Sent'].map(h => (
//                     <th key={h} style={{
//                       padding: '10px 16px', fontSize: 9, fontWeight: 600,
//                       color: '#4A4640', textAlign: 'left',
//                       textTransform: 'uppercase', letterSpacing: '.09em',
//                       borderBottom: '1px solid #EAE5DD',
//                     }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {messages.map(m => (
//                   <tr key={m.id} style={{ borderBottom: '1px solid #FFFFFF' }}>
//                     <td style={{ padding: '11px 16px' }}>
//                       <span style={{
//                         fontSize: 10, padding: '3px 9px',
//                         background: '#EAE5DD',
//                         border: '1px solid #EAE5DD',
//                         borderRadius: 20, fontWeight: 600, letterSpacing: '.04em',
//                         color: '#8A8680', textTransform: 'uppercase',
//                       }}>
//                         {m.trigger_type || 'manual'}
//                       </span>
//                     </td>
//                     <td style={{ padding: '11px 16px', maxWidth: 260 }}>
//                       <span style={{
//                         fontSize: 12, color: '#5A5650',
//                         display: 'block', overflow: 'hidden',
//                         textOverflow: 'ellipsis', whiteSpace: 'nowrap',
//                       }}>
//                         {m.message_body}
//                       </span>
//                     </td>
//                     <td style={{ padding: '11px 16px' }}>
//                       <span style={{
//                         display: 'inline-flex', alignItems: 'center', gap: 5,
//                         fontSize: 11, fontWeight: 600,
//                         color: MSG_STATUS_COLOR[m.status] || '#8A8680',
//                       }}>
//                         <span style={{ width: 5, height: 5, borderRadius: '50%', background: MSG_STATUS_COLOR[m.status] || '#8A8680' }} />
//                         {m.status}
//                       </span>
//                     </td>
//                     <td style={{ padding: '11px 16px', fontSize: 11, color: '#4A4640', fontFamily: "'IBM Plex Mono', monospace" }}>
//                       {m.sent_at ? formatDistanceToNow(parseISO(m.sent_at), { addSuffix: true }) : '—'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}

//       {/* ── Tab: meetings ── */}
//       {activeTab === 'meetings' && (
//         <div style={{ border: '1px solid #EAE5DD', borderRadius: 12, overflow: 'hidden' }}>
//           <div style={{
//             padding: '14px 20px',
//             borderBottom: '1px solid #EAE5DD',
//             display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//             background: '#FAFAF8',
//           }}>
//             <span style={{ fontSize: 13, fontWeight: 500, color: '#C0BCB4' }}>Scheduled meetings</span>
//             <button
//               onClick={() => setMeetingModal(true)}
//               style={{
//                 padding: '6px 14px', fontSize: 11, fontWeight: 600,
//                 background: 'linear-gradient(135deg,#7B3D6E,#5C2A52)',
//                 color: '#0D0C09', border: 'none', borderRadius: 7,
//                 cursor: 'pointer', fontFamily: "'Syne', sans-serif",
//               }}
//             >
//               + Schedule meeting
//             </button>
//           </div>

//           {meetings.length === 0 ? (
//             <Empty title="No meetings scheduled" sub="Schedule a meeting to follow up with this CP." />
//           ) : (
//             <div>
//               {meetings.map(m => {
//                 const statusAccent = m.status === 'completed' ? '#5A8A6E' : m.status === 'cancelled' ? '#C4694A' : '#7B3D6E';
//                 return (
//                   <div key={m.id} style={{
//                     padding: '16px 20px',
//                     borderBottom: '1px solid #F5F2EE',
//                     display: 'flex', gap: 14, alignItems: 'flex-start',
//                   }}>
//                     <div style={{
//                       width: 36, height: 36, borderRadius: 9, flexShrink: 0,
//                       background: `${statusAccent}12`,
//                       border: `1px solid ${statusAccent}30`,
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     }}>
//                       <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                         <rect x="1" y="3" width="12" height="10" rx="2" stroke={statusAccent} strokeWidth="1.2"/>
//                         <path d="M1 6h12" stroke={statusAccent} strokeWidth="1.2"/>
//                         <path d="M4 1v2M10 1v2" stroke={statusAccent} strokeWidth="1.2" strokeLinecap="round"/>
//                       </svg>
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: 13, fontWeight: 500, color: '#D0CCC4', marginBottom: 3 }}>
//                         {m.scheduled_at ? format(parseISO(m.scheduled_at), 'dd MMM yyyy, h:mm a') : 'TBD'}
//                       </div>
//                       <div style={{ fontSize: 12, color: '#5A5650' }}>{m.reason || 'Follow-up meeting'}</div>
//                       {m.notes && <div style={{ fontSize: 11, color: '#3A3A36', marginTop: 3 }}>{m.notes}</div>}
//                     </div>
//                     <span style={{
//                       fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
//                       border: `1px solid ${statusAccent}40`,
//                       background: `${statusAccent}12`,
//                       color: statusAccent, letterSpacing: '.08em', textTransform: 'uppercase',
//                     }}>
//                       {m.status}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── Modals ── */}
//       <SendMessageModal
//         open={msgModal}
//         onClose={() => setMsgModal(false)}
//         onSend={handleSendMessage}
//         cpName={cp.name}
//         tier={tier}
//       />
//       <ScheduleMeetingModal
//         open={meetingModal}
//         onClose={() => setMeetingModal(false)}
//         onSchedule={handleCreateMeeting}
//         cpName={cp.name}
//       />
//     </div>
//   );
// }

// /* ── Meta chip ─────────────────────────────────────────────────── */
// function MetaChip({ label, mono }) {
//   return (
//     <span style={{
//       fontSize: 12, color: '#6A6660',
//       fontFamily: mono ? "'IBM Plex Mono', monospace" : 'inherit',
//     }}>
//       {label}
//     </span>
//   );
// }

// /* ── Send message modal ────────────────────────────────────────── */
// function SendMessageModal({ open, onClose, onSend, cpName, tier }) {
//   const [triggerType, setTriggerType] = useState('manual');
//   const [text, setText] = useState('');
//   const [sending, setSending] = useState(false);

//   async function handleSend() {
//     setSending(true);
//     await onSend({ triggerType, text: triggerType === 'manual' ? text : undefined });
//     setSending(false);
//     setText('');
//   }

//   return (
//     <Modal open={open} onClose={onClose} title={`Message — ${cpName}`} width={440}>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: "'DM Sans', sans-serif" }}>
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
//               Message
//             </label>
//             <textarea
//               value={text}
//               onChange={e => setText(e.target.value)}
//               placeholder={`Hi ${cpName}, this is…`}
//               rows={5}
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
//             <span style={{ fontSize: 11, color: '#3A3A36', fontFamily: "'IBM Plex Mono', monospace" }}>
//               {text.length} chars
//             </span>
//           </div>
//         )}

//         <div style={{
//           padding: '10px 13px',
//           background: '#FFFFFF',
//           border: '1px solid #EAE5DD',
//           borderRadius: 8, fontSize: 12, color: '#5A5650', lineHeight: 1.5,
//         }}>
//           Will be sent via WhatsApp to {cpName}'s registered number.
//         </div>

//         <div style={{ display: 'flex', gap: 8 }}>
//           <Btn variant="brand" loading={sending} disabled={triggerType === 'manual' && !text.trim()} onClick={handleSend}>
//             Send via WhatsApp
//           </Btn>
//           <Btn onClick={onClose}>Cancel</Btn>
//         </div>
//       </div>
//     </Modal>
//   );
// }

// /* ── Schedule meeting modal ────────────────────────────────────── */
// function ScheduleMeetingModal({ open, onClose, onSchedule, cpName }) {
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   tomorrow.setHours(10, 0, 0, 0);
//   const defaultDt = tomorrow.toISOString().slice(0, 16);

//   const [scheduledAt, setScheduledAt] = useState(defaultDt);
//   const [reason, setReason]           = useState('');
//   const [saving, setSaving]           = useState(false);

//   async function handleSave() {
//     setSaving(true);
//     await onSchedule({ scheduledAt: new Date(scheduledAt).toISOString(), reason });
//     setSaving(false);
//   }

//   const fieldStyle = {
//     padding: '9px 12px', fontSize: 13, borderRadius: 8,
//     border: '1px solid #EAE5DD',
//     background: '#FFFFFF', color: '#E8E4DC', outline: 'none',
//     fontFamily: "'DM Sans', sans-serif",
//     width: '100%', boxSizing: 'border-box',
//     transition: 'border-color .15s',
//   };

//   const labelStyle = {
//     fontSize: 10, fontWeight: 600, letterSpacing: '.08em',
//     textTransform: 'uppercase', color: '#5A5650',
//   };

//   return (
//     <Modal open={open} onClose={onClose} title={`Schedule meeting — ${cpName}`} width={400}>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: "'DM Sans', sans-serif" }}>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//           <label style={labelStyle}>Date &amp; time</label>
//           <input
//             type="datetime-local"
//             value={scheduledAt}
//             onChange={e => setScheduledAt(e.target.value)}
//             style={fieldStyle}
//             onFocus={e => e.target.style.borderColor = 'rgba(201,151,61,.5)'}
//             onBlur={e => e.target.style.borderColor = '#EAE5DD'}
//           />
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//           <label style={labelStyle}>Reason</label>
//           <input
//             type="text" value={reason}
//             onChange={e => setReason(e.target.value)}
//             placeholder="e.g. 21-day inactivity follow-up"
//             style={fieldStyle}
//             onFocus={e => e.target.style.borderColor = 'rgba(201,151,61,.5)'}
//             onBlur={e => e.target.style.borderColor = '#EAE5DD'}
//           />
//         </div>

//         <div style={{
//           padding: '10px 13px',
//           background: 'rgba(201,151,61,.07)',
//           border: '1px solid rgba(201,151,61,.2)',
//           borderRadius: 8, fontSize: 12, color: '#7B3D6E', lineHeight: 1.55,
//         }}>
//           {cpName} will be notified automatically via WhatsApp when this meeting is scheduled.
//         </div>

//         <div style={{ display: 'flex', gap: 8 }}>
//           <Btn variant="brand" loading={saving} onClick={handleSave}>Schedule &amp; notify</Btn>
//           <Btn onClick={onClose}>Cancel</Btn>
//         </div>
//       </div>
//     </Modal>
//   );
// }
















































// // src/pages/CPProfile.js
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getCP, sendMessage, createMeeting } from '../services/api';
// import { formatDistanceToNow, format, parseISO } from 'date-fns';
// import toast from 'react-hot-toast';

// function GoldBtn({ children, loading, size='md', variant='brand', onClick, type='button', disabled }) {
//   const pad = size==='sm'?'5px 12px':'9px 18px', fs=size==='sm'?11:13;
//   const s={ brand:{background:'linear-gradient(135deg,#7B3D6E,#5C2A52)',color:'#FFFFFF',boxShadow:'0 2px 10px rgba(123,61,110,.22)'}, dark:{background:'#EAE5DD',color:'#1C1028',border:'1px solid #D9CAAE'}, ghost:{background:'transparent',color:'#B0A494',border:'1px solid #EAE5DD'}, danger:{background:'#FBECE6',color:'#D4907A',border:'1px solid rgba(239,68,68,.3)'} };
//   return <button type={type} disabled={disabled||loading} onClick={onClick} style={{ padding:pad,fontSize:fs,fontWeight:600,fontFamily:'inherit',borderRadius:8,border:'none',cursor:disabled||loading?'not-allowed':'pointer',display:'inline-flex',alignItems:'center',gap:5,opacity:disabled?.5:1,transition:'all .15s',whiteSpace:'nowrap',...s[variant] }} onMouseEnter={e=>{if(!disabled&&!loading)e.currentTarget.style.transform='translateY(-1px)'}} onMouseLeave={e=>{e.currentTarget.style.transform='none'}}>{loading&&<span style={{width:11,height:11,border:'2px solid currentColor',borderTopColor:'transparent',borderRadius:'50%',display:'inline-block',animation:'spin .7s linear infinite'}}/>}{children}</button>;
// }

// function Modal({ open, onClose, title, children, width=440 }) {
//   useEffect(()=>{const h=e=>{if(e.key==='Escape')onClose()};if(open)document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h)},[open,onClose]);
//   if(!open) return null;
//   return <div onClick={e=>{if(e.target===e.currentTarget)onClose()}} style={{position:'fixed',inset:0,background:'rgba(28,16,40,.45)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16}}><div style={{background:'#FFFFFF',border:'1px solid #D9CAAE',borderRadius:18,width:'100%',maxWidth:width,padding:28,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(28,16,40,.45)'}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}><h3 style={{fontFamily:'Bricolage Grotesque',sans-serif,fontSize:16,fontWeight:700,color:'#1C1028'}}>{title}</h3><button onClick={onClose} style={{background:'#EAE5DD',border:'none',width:28,height:28,borderRadius:8,color:'#B0A494',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>×</button></div>{children}</div></div>;
// }

// const TRIGGERS = [
//   { value:'dormant_support',    label:'🤝 Dormant support message'  },
//   { value:'inactivity_7d',      label:'⏰ 7-day inactivity reminder' },
//   { value:'inactivity_14d',     label:'⚠️ 14-day warning'            },
//   { value:'inactivity_meeting', label:'📅 Meeting notification'      },
//   { value:'active_perk',        label:'🎁 Perk / reward'             },
//   { value:'no_conversation',    label:'💬 No conversation nudge'     },
//   { value:'performance_drop',   label:'📉 Performance drop alert'    },
//   { value:'manual',             label:'✏️ Custom message'            },
// ];

// const MSG_STATUS = { sent:'#3D6B50', delivered:'#3D6B50', read:'#7B3D6E', failed:'#A8391A', pending:'#9C6820' };

// export default function CPProfile() {
//   const { projectId, cpId } = useParams();
//   const navigate = useNavigate();
//   const [cp, setCp]           = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [tab, setTab]         = useState('overview');
//   const [msgModal, setMsgModal]     = useState(false);
//   const [meetModal, setMeetModal]   = useState(false);

//   useEffect(() => { load(); }, [cpId]);

//   async function load() {
//     try { setLoading(true); setCp(await getCP(projectId, cpId)); }
//     catch { toast.error('Failed to load CP'); }
//     finally { setLoading(false); }
//   }

//   async function handleSend({ triggerType, text }) {
//     try {
//       await sendMessage(projectId, cpId, triggerType==='manual' ? { text, triggerType } : { triggerType });
//       toast.success('Message sent via WhatsApp!');
//       setMsgModal(false); load();
//     } catch(err) { toast.error(err.response?.data?.error || 'Send failed'); }
//   }

//   async function handleMeeting({ scheduledAt, reason }) {
//     try {
//       await createMeeting(projectId, cpId, { scheduled_at:scheduledAt, reason });
//       toast.success('Meeting scheduled! CP notified.');
//       setMeetModal(false); load();
//     } catch { toast.error('Failed to schedule'); }
//   }

//   if (loading) return (
//     <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#FAF8F5' }}>
//       <span style={{ width:32, height:32, border:'3px solid rgba(123,61,110,.28)', borderTopColor:'#7B3D6E', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//     </div>
//   );

//   if (!cp) return (
//     <div style={{ padding:28, textAlign:'center', color:'#1C1028' }}>
//       <div style={{ fontSize:36, marginBottom:12 }}>❓</div>
//       <div>CP not found</div>
//       <button onClick={() => navigate(-1)} style={{ marginTop:16, padding:'8px 16px', background:'#7B3D6E', color:'#FFFFFF', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 }}>← Go back</button>
//     </div>
//   );

//   const act = cp.cp_activity?.[0] || {};
//   const msgs = cp.messages || [];
//   const meets = cp.meetings || [];
//   const tier = act.tier || 'inactive';
//   const inactiveDays = act.last_active_at ? Math.floor((Date.now()-new Date(act.last_active_at))/86400000) : 999;
//   const tierColor = { active:'#3D6B50', dormant:'#9C6820', inactive:'#A8391A' };
//   const tierCfg = {
//     active:   { bg:'#E8F0EB',  color:'#6EA882',  label:'Active',   action:'🎁 Send perk reward',     trigger:'active_perk' },
//     dormant:  { bg:'#F8F0E4',  color:'#D4A84A',  label:'Dormant',  action:'🤝 Send support message', trigger:'dormant_support' },
//     inactive: { bg:'#FBECE6',  color:'#D4907A',  label:'Inactive', action:'🚨 Send warning',         trigger:'inactivity_14d' },
//   }[tier] || {};

//   return (
//     <div style={{ padding:'28px', fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#FAF8F5', minHeight:'100vh' }}>
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .pu{animation:fadeUp .35s ease both}`}</style>

//       {/* Breadcrumb */}
//       <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, fontSize:12, color:'#9486A8' }}>
//         <button onClick={() => navigate('/dashboard')} style={{ background:'none', border:'none', color:'#9486A8', cursor:'pointer', fontSize:12, padding:0 }}>Projects</button>
//         <span>/</span>
//         <button onClick={() => navigate(`/projects/${projectId}`)} style={{ background:'none', border:'none', color:'#9486A8', cursor:'pointer', fontSize:12, padding:0 }}>Partners</button>
//         <span>/</span>
//         <span style={{ color:'#1C1028', fontWeight:500 }}>{cp.name}</span>
//       </div>

//       {/* Hero card */}
//       <div className="pu" style={{ background:'linear-gradient(135deg, #1A1A14 0%, #0F0F0D 100%)', border:'1px solid #EAE5DD', borderRadius:20, padding:'24px 28px', marginBottom:16, position:'relative', overflow:'hidden' }}>
//         {/* Glow */}
//         <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, background:`radial-gradient(circle, ${tierColor[tier]}18 0%, transparent 70%)`, pointerEvents:'none' }} />

//         <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16, position:'relative' }}>
//           <div style={{ display:'flex', alignItems:'center', gap:16 }}>
//             <div style={{ width:56, height:56, borderRadius:16, background:`${tierColor[tier]}22`, color:tierColor[tier], display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, flexShrink:0, border:`1px solid ${tierColor[tier]}44` }}>
//               {cp.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
//             </div>
//             <div>
//               <h2 style={{ fontFamily:'Bricolage Grotesque',sans-serif, fontSize:20, fontWeight:700, color:'#1C1028', marginBottom:6, lineHeight:1 }}>{cp.name}</h2>
//               <div style={{ display:'flex', flexWrap:'wrap', gap:8, alignItems:'center' }}>
//                 <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:tierCfg.bg, color:tierCfg.color }}>
//                   <span style={{ width:5, height:5, borderRadius:'50%', background:tierColor[tier] }} />{tierCfg.label}
//                 </span>
//                 {cp.area      && <span style={{ fontSize:12, color:'#9486A8' }}>📍 {cp.area}</span>}
//                 {cp.firm_name && <span style={{ fontSize:12, color:'#9486A8' }}>🏢 {cp.firm_name}</span>}
//                 {cp.whatsapp  && <span style={{ fontSize:12, color:'#9486A8' }}>📱 +{cp.whatsapp}</span>}
//                 {cp.rera_number && <span style={{ fontSize:12, color:'#9486A8' }}>🪪 {cp.rera_number}</span>}
//               </div>
//             </div>
//           </div>
//           <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
//             {tier === 'inactive' && <GoldBtn variant="danger" size="sm" onClick={() => setMeetModal(true)}>📅 Schedule meeting</GoldBtn>}
//             <GoldBtn variant="dark" size="sm" onClick={() => handleSend({ triggerType:tierCfg.trigger })}>{tierCfg.action}</GoldBtn>
//             <GoldBtn size="sm" onClick={() => setMsgModal(true)}>📨 Send message</GoldBtn>
//           </div>
//         </div>

//         {/* Inactivity banner */}
//         {inactiveDays >= 7 && (
//           <div style={{ marginTop:16, padding:'10px 14px', background: inactiveDays>=21?'#FBECE6':inactiveDays>=14?'#F8F0E4':'#F8F0E4', border:`1px solid ${inactiveDays>=21?'rgba(239,68,68,.3)':'rgba(234,179,8,.25)'}`, borderRadius:10, fontSize:13, color:inactiveDays>=21?'#D4907A':'#D4A84A', display:'flex', alignItems:'center', gap:8 }}>
//             <span>{inactiveDays>=21?'⛔':inactiveDays>=14?'⚠️':'⏰'}</span>
//             {inactiveDays>=21 ? `${inactiveDays} days inactive — schedule a meeting immediately`
//               : inactiveDays>=14 ? `${inactiveDays} days inactive — send a strong reminder`
//               : `${inactiveDays} days inactive — send a check-in`}
//           </div>
//         )}
//       </div>

//       {/* Score + stats */}
//       <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:10, marginBottom:16 }}>
//         {[
//           { label:'Score',        value:`${act.score||0}/100`, color:(act.score||0)>=60?'#3D6B50':(act.score||0)>=30?'#9C6820':'#A8391A' },
//           { label:'Site visits',  value:act.site_visits||0 },
//           { label:'Referrals',    value:act.client_referrals||0 },
//           { label:'Deals closed', value:act.deals_closed||0, color:'#3D6B50' },
//           { label:'Messages',     value:msgs.length },
//           { label:'Meetings',     value:meets.length },
//         ].map((s,i) => (
//           <div key={i} className="pu" style={{ animationDelay:`${i*.04}s`, padding:'14px 16px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:12 }}>
//             <div style={{ fontSize:10, color:'#9486A8', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:6 }}>{s.label}</div>
//             <div style={{ fontSize:22, fontFamily:'Bricolage Grotesque',sans-serif, fontWeight:700, color:s.color||'#fff' }}>{s.value}</div>
//           </div>
//         ))}
//       </div>

//       {/* Tabs */}
//       <div style={{ display:'flex', borderBottom:'1px solid #EAE5DD', marginBottom:16, gap:2 }}>
//         {['overview','messages','meetings'].map(t => (
//           <button key={t} onClick={() => setTab(t)}
//             style={{ padding:'8px 16px', fontSize:13, fontWeight:500, border:'none', background:'transparent', cursor:'pointer', fontFamily:'inherit', color:tab===t?'#fff':'#6B6B64', borderBottom:`2px solid ${tab===t?'#7B3D6E':'transparent'}`, marginBottom:-1, textTransform:'capitalize', transition:'all .15s' }}>
//             {t}
//           </button>
//         ))}
//       </div>

//       {/* Tab: overview */}
//       {tab === 'overview' && (
//         <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
//           <div style={{ background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:16, padding:'20px 22px' }}>
//             <h3 style={{ fontFamily:'Bricolage Grotesque',sans-serif, fontSize:14, fontWeight:600, color:'#1C1028', marginBottom:18 }}>Activity breakdown</h3>
//             {[
//               { label:'Site visits',       val:act.site_visits||0,       max:20, color:'#7B3D6E' },
//               { label:'Client referrals',  val:act.client_referrals||0,  max:10, color:'#7B3D6E' },
//               { label:'Deals closed',      val:act.deals_closed||0,      max:8,  color:'#3D6B50' },
//             ].map(m => (
//               <div key={m.label} style={{ marginBottom:16 }}>
//                 <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
//                   <span style={{ fontSize:12, color:'#B0A494' }}>{m.label}</span>
//                   <span style={{ fontSize:12, fontWeight:600, color:'#1C1028' }}>{m.val}/{m.max}</span>
//                 </div>
//                 <div style={{ height:7, background:'#EAE5DD', borderRadius:4, overflow:'hidden' }}>
//                   <div style={{ height:'100%', width:`${Math.min((m.val/m.max)*100,100)}%`, background:m.color, borderRadius:4, transition:'width .6s ease' }} />
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div style={{ background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:16, padding:'20px 22px' }}>
//             <h3 style={{ fontFamily:'Bricolage Grotesque',sans-serif, fontSize:14, fontWeight:600, color:'#1C1028', marginBottom:18 }}>Activity timeline</h3>
//             {[
//               { label:'Last active',        val:act.last_active_at },
//               { label:'Last site visit',    val:act.last_visit_at },
//               { label:'Last conversation',  val:act.last_conversation_at },
//               { label:'CP added',           val:cp.created_at },
//             ].map(t => (
//               <div key={t.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #F5F2EE' }}>
//                 <span style={{ fontSize:12, color:'#9486A8' }}>{t.label}</span>
//                 <span style={{ fontSize:12, fontWeight:500, color:t.val?'#fff':'#6B6B64' }}>
//                   {t.val ? formatDistanceToNow(parseISO(t.val), { addSuffix:true }) : 'Never'}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Tab: messages */}
//       {tab === 'messages' && (
//         <div style={{ background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:16, overflow:'hidden' }}>
//           {msgs.length === 0 ? (
//             <div style={{ textAlign:'center', padding:'52px 24px' }}>
//               <div style={{ fontSize:32, marginBottom:12 }}>💬</div>
//               <div style={{ fontFamily:'Bricolage Grotesque',sans-serif, fontSize:15, fontWeight:600, color:'#1C1028', marginBottom:6 }}>No messages yet</div>
//               <div style={{ fontSize:13, color:'#9486A8', marginBottom:16 }}>Send the first message using the button above</div>
//               <GoldBtn size="sm" onClick={() => setMsgModal(true)}>Send message</GoldBtn>
//             </div>
//           ) : (
//             <table style={{ width:'100%', borderCollapse:'collapse' }}>
//               <thead><tr style={{ background:'#FAFAF8', borderBottom:'1px solid #EAE5DD' }}>
//                 {['Type','Message','Status','Sent'].map(h => <th key={h} style={{ padding:'10px 14px', fontSize:10, fontWeight:700, color:'#9486A8', textAlign:'left', textTransform:'uppercase', letterSpacing:'.07em' }}>{h}</th>)}
//               </tr></thead>
//               <tbody>
//                 {msgs.map(m => (
//                   <tr key={m.id} style={{ borderBottom:'1px solid #FFFFFF' }}>
//                     <td style={{ padding:'10px 14px' }}><span style={{ fontSize:11, padding:'2px 9px', background:'#EAE5DD', borderRadius:20, fontWeight:600, color:'#B0A494' }}>{m.trigger_type||'manual'}</span></td>
//                     <td style={{ padding:'10px 14px', maxWidth:280 }}><span style={{ fontSize:12, color:'#9486A8', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.message_body}</span></td>
//                     <td style={{ padding:'10px 14px' }}><span style={{ fontSize:11, fontWeight:700, color:MSG_STATUS[m.status]||'#9B9B92' }}>● {m.status}</span></td>
//                     <td style={{ padding:'10px 14px', fontSize:11, color:'#9486A8' }}>{m.sent_at?formatDistanceToNow(parseISO(m.sent_at),{addSuffix:true}):'—'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}

//       {/* Tab: meetings */}
//       {tab === 'meetings' && (
//         <div style={{ background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:16, overflow:'hidden' }}>
//           <div style={{ padding:'14px 20px', borderBottom:'1px solid #EAE5DD', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
//             <span style={{ fontSize:13, fontWeight:600, color:'#1C1028' }}>Meetings</span>
//             <GoldBtn size="sm" onClick={() => setMeetModal(true)}>+ Schedule</GoldBtn>
//           </div>
//           {meets.length === 0 ? (
//             <div style={{ textAlign:'center', padding:'52px 24px' }}>
//               <div style={{ fontSize:32, marginBottom:12 }}>📅</div>
//               <div style={{ fontFamily:'Bricolage Grotesque',sans-serif, fontSize:15, fontWeight:600, color:'#1C1028', marginBottom:6 }}>No meetings scheduled</div>
//               <div style={{ fontSize:13, color:'#9486A8', marginBottom:16 }}>Schedule a follow-up meeting with this CP</div>
//               <GoldBtn size="sm" onClick={() => setMeetModal(true)}>Schedule meeting</GoldBtn>
//             </div>
//           ) : meets.map(m => (
//             <div key={m.id} style={{ padding:'16px 20px', borderBottom:'1px solid #FFFFFF', display:'flex', gap:14, alignItems:'flex-start' }}>
//               <div style={{ width:40, height:40, borderRadius:12, background:m.status==='completed'?'#E8F0EB':m.status==='cancelled'?'#FBECE6':'#F8F0E4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
//                 {m.status==='completed'?'✅':m.status==='cancelled'?'❌':'📅'}
//               </div>
//               <div style={{ flex:1 }}>
//                 <div style={{ fontSize:13, fontWeight:600, color:'#1C1028', marginBottom:3 }}>{m.scheduled_at?format(parseISO(m.scheduled_at),'dd MMM yyyy, h:mm a'):'TBD'}</div>
//                 <div style={{ fontSize:12, color:'#9486A8' }}>{m.reason||'Follow-up meeting'}</div>
//                 {m.notes && <div style={{ fontSize:11, color:'#9486A8', marginTop:4 }}>{m.notes}</div>}
//               </div>
//               <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:m.status==='completed'?'#E8F0EB':m.status==='cancelled'?'#FBECE6':'#F8F0E4', color:m.status==='completed'?'#6EA882':m.status==='cancelled'?'#D4907A':'#D4A84A' }}>{m.status}</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Send message modal */}
//       <Modal open={msgModal} onClose={() => setMsgModal(false)} title={`Message — ${cp.name}`}>
//         <SendMsgForm cpName={cp.name} onSend={handleSend} onClose={() => setMsgModal(false)} />
//       </Modal>

//       {/* Schedule meeting modal */}
//       <Modal open={meetModal} onClose={() => setMeetModal(false)} title={`Schedule meeting — ${cp.name}`}>
//         <MeetingForm cpName={cp.name} onSchedule={handleMeeting} onClose={() => setMeetModal(false)} />
//       </Modal>
//     </div>
//   );
// }

// function SendMsgForm({ cpName, onSend, onClose }) {
//   const [triggerType, setTriggerType] = useState('manual');
//   const [text, setText] = useState('');
//   const [sending, setSending] = useState(false);

//   async function handle() {
//     setSending(true);
//     await onSend({ triggerType, text: triggerType==='manual'?text:undefined });
//     setSending(false);
//   }

//   return (
//     <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
//       <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
//         <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Message type</label>
//         <select value={triggerType} onChange={e => setTriggerType(e.target.value)}
//           style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none' }}>
//           {TRIGGERS.map(o => <option key={o.value} value={o.value} style={{ background:'#1A1A16' }}>{o.label}</option>)}
//         </select>
//       </div>
//       {triggerType === 'manual' && (
//         <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
//           <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Message</label>
//           <textarea value={text} onChange={e => setText(e.target.value)} rows={5} placeholder={`Hi ${cpName}, this is…`}
//             style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none', resize:'vertical', lineHeight:1.6 }}
//             onFocus={e => e.target.style.borderColor='rgba(123,61,110,.45)'}
//             onBlur={e => e.target.style.borderColor='#D9CAAE'} />
//           <span style={{ fontSize:11, color:'#9486A8' }}>{text.length} characters</span>
//         </div>
//       )}
//       <div style={{ padding:'10px 12px', background:'rgba(123,61,110,.07)', border:'1px solid rgba(123,61,110,.12)', borderRadius:8, fontSize:12, color:'#D4A84A' }}>
//         📱 Sends to {cpName}'s WhatsApp number
//       </div>
//       <div style={{ display:'flex', gap:8 }}>
//         <GoldBtn loading={sending} disabled={triggerType==='manual'&&!text.trim()} onClick={handle}>Send via WhatsApp</GoldBtn>
//         <GoldBtn variant="ghost" onClick={onClose}>Cancel</GoldBtn>
//       </div>
//     </div>
//   );
// }

// function MeetingForm({ cpName, onSchedule, onClose }) {
//   const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1); tomorrow.setHours(10,0,0,0);
//   const [scheduledAt, setScheduledAt] = useState(tomorrow.toISOString().slice(0,16));
//   const [reason, setReason] = useState('');
//   const [saving, setSaving] = useState(false);

//   async function handle() {
//     setSaving(true);
//     await onSchedule({ scheduledAt: new Date(scheduledAt).toISOString(), reason });
//     setSaving(false);
//   }

//   return (
//     <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
//       <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
//         <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Date & time</label>
//         <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
//           style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none' }}
//           onFocus={e => e.target.style.borderColor='rgba(123,61,110,.45)'}
//           onBlur={e => e.target.style.borderColor='#D9CAAE'} />
//       </div>
//       <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
//         <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Reason</label>
//         <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. 21-day inactivity follow-up"
//           style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none' }}
//           onFocus={e => e.target.style.borderColor='rgba(123,61,110,.45)'}
//           onBlur={e => e.target.style.borderColor='#D9CAAE'} />
//       </div>
//       <div style={{ padding:'10px 12px', background:'rgba(123,61,110,.07)', border:'1px solid rgba(123,61,110,.12)', borderRadius:8, fontSize:12, color:'#D4A84A' }}>
//         📱 {cpName} will be notified via WhatsApp when you schedule this.
//       </div>
//       <div style={{ display:'flex', gap:8 }}>
//         <GoldBtn loading={saving} onClick={handle}>Schedule & notify</GoldBtn>
//         <GoldBtn variant="ghost" onClick={onClose}>Cancel</GoldBtn>
//       </div>
//     </div>
//   );
// }





























// // src/pages/CPProfile.js
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getCP, sendMessage, createMeeting } from '../services/api';
// import { Card, Badge, Btn, Avatar, Modal, Empty, Spinner } from '../components/ui';
// import toast from 'react-hot-toast';
// import { format, formatDistanceToNow, parseISO } from 'date-fns';

// const TRIGGER_OPTIONS = [
//   { value: 'dormant_support',    label: 'Dormant support message',   tier: 'dormant' },
//   { value: 'inactivity_7d',      label: '7-day inactivity reminder', tier: 'any' },
//   { value: 'inactivity_14d',     label: '14-day warning',            tier: 'any' },
//   { value: 'inactivity_meeting', label: 'Meeting notification',      tier: 'inactive' },
//   { value: 'active_perk',        label: 'Perk / reward',             tier: 'active' },
//   { value: 'no_conversation',    label: 'No-conversation nudge',     tier: 'any' },
//   { value: 'performance_drop',   label: 'Performance drop alert',    tier: 'any' },
//   { value: 'manual',             label: 'Custom message',            tier: 'any' },
// ];

// const tierAccent = {
//   active:   '#5A8A6E',
//   dormant:  '#7B3D6E',
//   inactive: '#C4694A',
// };

// const MSG_STATUS_COLOR = {
//   sent:      '#5A8A6E',
//   failed:    '#C4694A',
//   pending:   '#7B3D6E',
//   delivered: '#5A8A6E',
//   read:      '#7B3D6E',
// };

// export default function CPProfile() {
//   const { projectId, cpId } = useParams();
//   const navigate = useNavigate();
//   const [cp, setCp]             = useState(null);
//   const [loading, setLoading]   = useState(true);
//   const [msgModal, setMsgModal] = useState(false);
//   const [meetingModal, setMeetingModal] = useState(false);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => { load(); }, [cpId]);

//   async function load() {
//     try {
//       setLoading(true);
//       const data = await getCP(projectId, cpId);
//       setCp(data);
//     } catch { toast.error('Failed to load CP profile'); }
//     finally { setLoading(false); }
//   }

//   async function handleSendMessage({ triggerType, text }) {
//     try {
//       const payload = triggerType === 'manual' ? { text, triggerType } : { triggerType };
//       await sendMessage(projectId, cpId, payload);
//       toast.success('WhatsApp message sent.');
//       setMsgModal(false);
//       load();
//     } catch (err) { toast.error(err.response?.data?.error || 'Send failed'); }
//   }

//   async function handleCreateMeeting({ scheduledAt, reason }) {
//     try {
//       await createMeeting(projectId, cpId, { scheduled_at: scheduledAt, reason });
//       toast.success('Meeting scheduled. CP notified.');
//       setMeetingModal(false);
//       load();
//     } catch { toast.error('Failed to schedule meeting'); }
//   }

//   if (loading) return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <Spinner size={28} color="#7B3D6E" />
//     </div>
//   );

//   if (!cp) return (
//     <div style={{ padding: 32 }}>
//       <Empty title="CP not found" action={<Btn onClick={() => navigate(-1)}>Go back</Btn>} />
//     </div>
//   );

//   const activity     = cp.cp_activity?.[0] || {};
//   const messages     = cp.messages || [];
//   const meetings     = cp.meetings || [];
//   const tier         = activity.tier || 'inactive';
//   const accent       = tierAccent[tier] || '#8A8680';
//   const inactiveDays = activity.last_active_at
//     ? Math.floor((Date.now() - new Date(activity.last_active_at)) / 86400000)
//     : 999;

//   const tierAction = {
//     active:   { label: 'Send perk reward',     triggerType: 'active_perk' },
//     dormant:  { label: 'Send support message', triggerType: 'dormant_support' },
//     inactive: { label: 'Send warning',         triggerType: 'inactivity_14d' },
//   }[tier] || { label: 'Send message', triggerType: 'manual' };

//   const TABS = [
//     { id: 'overview', label: 'Overview' },
//     { id: 'messages', label: `Messages (${messages.length})` },
//     { id: 'meetings', label: `Meetings (${meetings.length})` },
//   ];

//   const stats = [
//     { label: 'Score',         value: `${activity.score || 0}`, suffix: '/100', accent: activity.score >= 60 ? '#5A8A6E' : activity.score >= 30 ? '#7B3D6E' : '#C4694A' },
//     { label: 'Site visits',   value: activity.site_visits   || 0 },
//     { label: 'Referrals',     value: activity.client_referrals || 0 },
//     { label: 'Deals closed',  value: activity.deals_closed  || 0, accent: '#5A8A6E' },
//     { label: 'Messages sent', value: messages.length         || 0 },
//     { label: 'Meetings',      value: meetings.length         || 0 },
//   ];

//   return (
//     <div style={{ padding: 32, fontFamily: "'DM Sans', sans-serif", maxWidth: 1100 }}>

//       {/* ── Breadcrumb ── */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, fontSize: 12 }}>
//         {[
//           { label: 'Projects', to: '/dashboard' },
//           { label: 'Channel partners', to: `/projects/${projectId}` },
//         ].map((b, i) => (
//           <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <button
//               onClick={() => navigate(b.to)}
//               style={{
//                 background: 'none', border: 'none', color: '#4A4640',
//                 cursor: 'pointer', fontSize: 12, padding: 0,
//                 fontFamily: "'DM Sans', sans-serif",
//                 transition: 'color .15s',
//               }}
//               onMouseEnter={e => e.target.style.color = '#9A9690'}
//               onMouseLeave={e => e.target.style.color = '#4A4640'}
//             >
//               {b.label}
//             </button>
//             <span style={{ color: '#2A2A26' }}>/</span>
//           </span>
//         ))}
//         <span style={{ color: '#A0A09A', fontWeight: 500 }}>{cp.name}</span>
//       </div>

//       {/* ── Profile header ── */}
//       <div style={{
//         padding: '24px 26px',
//         background: '#FFFFFF',
//         border: '1px solid #EAE5DD',
//         borderRadius: 14, marginBottom: 16,
//       }}>
//         <div style={{
//           display: 'flex', alignItems: 'flex-start',
//           justifyContent: 'space-between', flexWrap: 'wrap', gap: 18,
//         }}>
//           {/* Identity */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//             <Avatar name={cp.name} size={52} index={0} />
//             <div>
//               <h2 style={{
//                 fontFamily: "'Syne', sans-serif",
//                 fontSize: 20, fontWeight: 700, letterSpacing: '-.02em',
//                 color: '#F2EEE6', marginBottom: 8,
//               }}>
//                 {cp.name}
//               </h2>
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
//                 {/* Tier badge */}
//                 <span style={{
//                   display: 'inline-flex', alignItems: 'center', gap: 5,
//                   padding: '3px 10px', borderRadius: 20,
//                   border: `1px solid ${accent}50`,
//                   background: `${accent}12`,
//                   fontSize: 10, fontWeight: 700,
//                   letterSpacing: '.08em', textTransform: 'uppercase',
//                   color: accent,
//                 }}>
//                   <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent }} />
//                   {tier}
//                 </span>
//                 {cp.area      && <MetaChip label={cp.area} />}
//                 {cp.firm_name && <MetaChip label={cp.firm_name} />}
//                 {cp.whatsapp  && <MetaChip label={`+${cp.whatsapp}`} mono />}
//                 {cp.rera_number && <MetaChip label={cp.rera_number} mono />}
//               </div>
//             </div>
//           </div>

//           {/* Action buttons */}
//           <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
//             {tier === 'inactive' && (
//               <button
//                 onClick={() => setMeetingModal(true)}
//                 style={{
//                   padding: '8px 16px', fontSize: 12, fontWeight: 600,
//                   border: '1px solid rgba(248,113,113,.3)',
//                   background: 'rgba(248,113,113,.1)',
//                   color: '#C4694A', borderRadius: 8, cursor: 'pointer',
//                   fontFamily: "'DM Sans', sans-serif",
//                   transition: 'all .15s',
//                 }}
//               >
//                 Schedule meeting
//               </button>
//             )}
//             <button
//               onClick={() => handleSendMessage({ triggerType: tierAction.triggerType })}
//               style={{
//                 padding: '8px 16px', fontSize: 12, fontWeight: 500,
//                 border: '1px solid #D9CAAE',
//                 background: '#F5F2EE',
//                 color: '#C0BCB4', borderRadius: 8, cursor: 'pointer',
//                 fontFamily: "'DM Sans', sans-serif",
//                 transition: 'all .15s',
//               }}
//             >
//               {tierAction.label}
//             </button>
//             <button
//               onClick={() => setMsgModal(true)}
//               style={{
//                 padding: '8px 18px', fontSize: 12, fontWeight: 600,
//                 background: 'linear-gradient(135deg,#7B3D6E,#5C2A52)',
//                 color: '#0D0C09', border: 'none', borderRadius: 8,
//                 cursor: 'pointer', fontFamily: "'Syne', sans-serif",
//                 boxShadow: '0 3px 14px rgba(201,151,61,.2)',
//                 transition: 'transform .15s',
//               }}
//               onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
//               onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
//             >
//               Custom message
//             </button>
//           </div>
//         </div>

//         {/* Inactivity warning */}
//         {inactiveDays >= 7 && (
//           <div style={{
//             marginTop: 18, padding: '11px 16px',
//             background: inactiveDays >= 21
//               ? 'rgba(248,113,113,.08)'
//               : inactiveDays >= 14
//               ? 'rgba(251,146,60,.08)'
//               : 'rgba(201,151,61,.08)',
//             border: `1px solid ${inactiveDays >= 21 ? 'rgba(248,113,113,.2)' : inactiveDays >= 14 ? 'rgba(251,146,60,.2)' : 'rgba(201,151,61,.2)'}`,
//             borderRadius: 8, fontSize: 12, lineHeight: 1.5,
//             color: inactiveDays >= 21 ? '#C4694A' : inactiveDays >= 14 ? '#FB923C' : '#7B3D6E',
//           }}>
//             <strong>{inactiveDays} days inactive</strong>
//             {inactiveDays >= 21
//               ? ' — meeting should be scheduled immediately'
//               : inactiveDays >= 14
//               ? ' — send a strong re-engagement reminder'
//               : ' — send a check-in message'}
//           </div>
//         )}
//       </div>

//       {/* ── Stats row ── */}
//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
//         gap: 10, marginBottom: 18,
//       }}>
//         {stats.map(s => (
//           <div
//             key={s.label}
//             style={{
//               padding: '14px 16px',
//               background: '#FFFFFF',
//               border: '1px solid #EAE5DD',
//               borderRadius: 10,
//             }}
//           >
//             <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.09em', textTransform: 'uppercase', color: '#4A4640', marginBottom: 8 }}>
//               {s.label}
//             </div>
//             <div style={{
//               fontFamily: "'IBM Plex Mono', monospace",
//               fontSize: 22, fontWeight: 500, lineHeight: 1,
//               color: s.accent || '#C0BCB4',
//             }}>
//               {s.value}
//               {s.suffix && <span style={{ fontSize: 11, color: '#3A3A36' }}>{s.suffix}</span>}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ── Tabs ── */}
//       <div style={{ display: 'flex', gap: 2, marginBottom: 14, padding: '3px', background: '#FFFFFF', borderRadius: 9, width: 'fit-content' }}>
//         {TABS.map(t => (
//           <button
//             key={t.id}
//             onClick={() => setActiveTab(t.id)}
//             style={{
//               padding: '6px 18px', fontSize: 12, fontWeight: 500,
//               border: 'none', borderRadius: 7, cursor: 'pointer',
//               background: activeTab === t.id ? '#D9CAAE' : 'transparent',
//               color: activeTab === t.id ? '#F2EEE6' : '#5A5650',
//               fontFamily: "'DM Sans', sans-serif",
//               transition: 'all .15s',
//             }}
//           >
//             {t.label}
//           </button>
//         ))}
//       </div>

//       {/* ── Tab: overview ── */}
//       {activeTab === 'overview' && (
//         <div style={{
//           padding: '20px 24px',
//           background: '#FAFAF8',
//           border: '1px solid #EAE5DD',
//           borderRadius: 12,
//         }}>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flexWrap: 'wrap' }}>
//             {[
//               { label: 'Email',       value: cp.email },
//               { label: 'WhatsApp',    value: cp.whatsapp ? `+${cp.whatsapp}` : '—' },
//               { label: 'Firm',        value: cp.firm_name || '—' },
//               { label: 'Area',        value: cp.area || '—' },
//               { label: 'RERA',        value: cp.rera_number || '—' },
//               { label: 'Last active', value: activity.last_active_at
//                 ? formatDistanceToNow(parseISO(activity.last_active_at), { addSuffix: true })
//                 : 'Never' },
//             ].map(field => (
//               <div key={field.label}>
//                 <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: '#4A4640', marginBottom: 5 }}>
//                   {field.label}
//                 </div>
//                 <div style={{ fontSize: 13, color: '#B0ACA4', fontFamily: field.label === 'WhatsApp' || field.label === 'RERA' ? "'IBM Plex Mono', monospace" : 'inherit' }}>
//                   {field.value || '—'}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ── Tab: messages ── */}
//       {activeTab === 'messages' && (
//         <div style={{ border: '1px solid #EAE5DD', borderRadius: 12, overflow: 'hidden' }}>
//           {messages.length === 0 ? (
//             <Empty title="No messages sent" sub="Messages will appear here after sending." />
//           ) : (
//             <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//               <thead>
//                 <tr style={{ background: '#FFFFFF' }}>
//                   {['Type', 'Preview', 'Status', 'Sent'].map(h => (
//                     <th key={h} style={{
//                       padding: '10px 16px', fontSize: 9, fontWeight: 600,
//                       color: '#4A4640', textAlign: 'left',
//                       textTransform: 'uppercase', letterSpacing: '.09em',
//                       borderBottom: '1px solid #EAE5DD',
//                     }}>{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {messages.map(m => (
//                   <tr key={m.id} style={{ borderBottom: '1px solid #FFFFFF' }}>
//                     <td style={{ padding: '11px 16px' }}>
//                       <span style={{
//                         fontSize: 10, padding: '3px 9px',
//                         background: '#EAE5DD',
//                         border: '1px solid #EAE5DD',
//                         borderRadius: 20, fontWeight: 600, letterSpacing: '.04em',
//                         color: '#8A8680', textTransform: 'uppercase',
//                       }}>
//                         {m.trigger_type || 'manual'}
//                       </span>
//                     </td>
//                     <td style={{ padding: '11px 16px', maxWidth: 260 }}>
//                       <span style={{
//                         fontSize: 12, color: '#5A5650',
//                         display: 'block', overflow: 'hidden',
//                         textOverflow: 'ellipsis', whiteSpace: 'nowrap',
//                       }}>
//                         {m.message_body}
//                       </span>
//                     </td>
//                     <td style={{ padding: '11px 16px' }}>
//                       <span style={{
//                         display: 'inline-flex', alignItems: 'center', gap: 5,
//                         fontSize: 11, fontWeight: 600,
//                         color: MSG_STATUS_COLOR[m.status] || '#8A8680',
//                       }}>
//                         <span style={{ width: 5, height: 5, borderRadius: '50%', background: MSG_STATUS_COLOR[m.status] || '#8A8680' }} />
//                         {m.status}
//                       </span>
//                     </td>
//                     <td style={{ padding: '11px 16px', fontSize: 11, color: '#4A4640', fontFamily: "'IBM Plex Mono', monospace" }}>
//                       {m.sent_at ? formatDistanceToNow(parseISO(m.sent_at), { addSuffix: true }) : '—'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}

//       {/* ── Tab: meetings ── */}
//       {activeTab === 'meetings' && (
//         <div style={{ border: '1px solid #EAE5DD', borderRadius: 12, overflow: 'hidden' }}>
//           <div style={{
//             padding: '14px 20px',
//             borderBottom: '1px solid #EAE5DD',
//             display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//             background: '#FAFAF8',
//           }}>
//             <span style={{ fontSize: 13, fontWeight: 500, color: '#C0BCB4' }}>Scheduled meetings</span>
//             <button
//               onClick={() => setMeetingModal(true)}
//               style={{
//                 padding: '6px 14px', fontSize: 11, fontWeight: 600,
//                 background: 'linear-gradient(135deg,#7B3D6E,#5C2A52)',
//                 color: '#0D0C09', border: 'none', borderRadius: 7,
//                 cursor: 'pointer', fontFamily: "'Syne', sans-serif",
//               }}
//             >
//               + Schedule meeting
//             </button>
//           </div>

//           {meetings.length === 0 ? (
//             <Empty title="No meetings scheduled" sub="Schedule a meeting to follow up with this CP." />
//           ) : (
//             <div>
//               {meetings.map(m => {
//                 const statusAccent = m.status === 'completed' ? '#5A8A6E' : m.status === 'cancelled' ? '#C4694A' : '#7B3D6E';
//                 return (
//                   <div key={m.id} style={{
//                     padding: '16px 20px',
//                     borderBottom: '1px solid #F5F2EE',
//                     display: 'flex', gap: 14, alignItems: 'flex-start',
//                   }}>
//                     <div style={{
//                       width: 36, height: 36, borderRadius: 9, flexShrink: 0,
//                       background: `${statusAccent}12`,
//                       border: `1px solid ${statusAccent}30`,
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     }}>
//                       <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                         <rect x="1" y="3" width="12" height="10" rx="2" stroke={statusAccent} strokeWidth="1.2"/>
//                         <path d="M1 6h12" stroke={statusAccent} strokeWidth="1.2"/>
//                         <path d="M4 1v2M10 1v2" stroke={statusAccent} strokeWidth="1.2" strokeLinecap="round"/>
//                       </svg>
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div style={{ fontSize: 13, fontWeight: 500, color: '#D0CCC4', marginBottom: 3 }}>
//                         {m.scheduled_at ? format(parseISO(m.scheduled_at), 'dd MMM yyyy, h:mm a') : 'TBD'}
//                       </div>
//                       <div style={{ fontSize: 12, color: '#5A5650' }}>{m.reason || 'Follow-up meeting'}</div>
//                       {m.notes && <div style={{ fontSize: 11, color: '#3A3A36', marginTop: 3 }}>{m.notes}</div>}
//                     </div>
//                     <span style={{
//                       fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
//                       border: `1px solid ${statusAccent}40`,
//                       background: `${statusAccent}12`,
//                       color: statusAccent, letterSpacing: '.08em', textTransform: 'uppercase',
//                     }}>
//                       {m.status}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ── Modals ── */}
//       <SendMessageModal
//         open={msgModal}
//         onClose={() => setMsgModal(false)}
//         onSend={handleSendMessage}
//         cpName={cp.name}
//         tier={tier}
//       />
//       <ScheduleMeetingModal
//         open={meetingModal}
//         onClose={() => setMeetingModal(false)}
//         onSchedule={handleCreateMeeting}
//         cpName={cp.name}
//       />
//     </div>
//   );
// }

// /* ── Meta chip ─────────────────────────────────────────────────── */
// function MetaChip({ label, mono }) {
//   return (
//     <span style={{
//       fontSize: 12, color: '#6A6660',
//       fontFamily: mono ? "'IBM Plex Mono', monospace" : 'inherit',
//     }}>
//       {label}
//     </span>
//   );
// }

// /* ── Send message modal ────────────────────────────────────────── */
// function SendMessageModal({ open, onClose, onSend, cpName, tier }) {
//   const [triggerType, setTriggerType] = useState('manual');
//   const [text, setText] = useState('');
//   const [sending, setSending] = useState(false);

//   async function handleSend() {
//     setSending(true);
//     await onSend({ triggerType, text: triggerType === 'manual' ? text : undefined });
//     setSending(false);
//     setText('');
//   }

//   return (
//     <Modal open={open} onClose={onClose} title={`Message — ${cpName}`} width={440}>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: "'DM Sans', sans-serif" }}>
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
//               Message
//             </label>
//             <textarea
//               value={text}
//               onChange={e => setText(e.target.value)}
//               placeholder={`Hi ${cpName}, this is…`}
//               rows={5}
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
//             <span style={{ fontSize: 11, color: '#3A3A36', fontFamily: "'IBM Plex Mono', monospace" }}>
//               {text.length} chars
//             </span>
//           </div>
//         )}

//         <div style={{
//           padding: '10px 13px',
//           background: '#FFFFFF',
//           border: '1px solid #EAE5DD',
//           borderRadius: 8, fontSize: 12, color: '#5A5650', lineHeight: 1.5,
//         }}>
//           Will be sent via WhatsApp to {cpName}'s registered number.
//         </div>

//         <div style={{ display: 'flex', gap: 8 }}>
//           <Btn variant="brand" loading={sending} disabled={triggerType === 'manual' && !text.trim()} onClick={handleSend}>
//             Send via WhatsApp
//           </Btn>
//           <Btn onClick={onClose}>Cancel</Btn>
//         </div>
//       </div>
//     </Modal>
//   );
// }

// /* ── Schedule meeting modal ────────────────────────────────────── */
// function ScheduleMeetingModal({ open, onClose, onSchedule, cpName }) {
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   tomorrow.setHours(10, 0, 0, 0);
//   const defaultDt = tomorrow.toISOString().slice(0, 16);

//   const [scheduledAt, setScheduledAt] = useState(defaultDt);
//   const [reason, setReason]           = useState('');
//   const [saving, setSaving]           = useState(false);

//   async function handleSave() {
//     setSaving(true);
//     await onSchedule({ scheduledAt: new Date(scheduledAt).toISOString(), reason });
//     setSaving(false);
//   }

//   const fieldStyle = {
//     padding: '9px 12px', fontSize: 13, borderRadius: 8,
//     border: '1px solid #EAE5DD',
//     background: '#FFFFFF', color: '#E8E4DC', outline: 'none',
//     fontFamily: "'DM Sans', sans-serif",
//     width: '100%', boxSizing: 'border-box',
//     transition: 'border-color .15s',
//   };

//   const labelStyle = {
//     fontSize: 10, fontWeight: 600, letterSpacing: '.08em',
//     textTransform: 'uppercase', color: '#5A5650',
//   };

//   return (
//     <Modal open={open} onClose={onClose} title={`Schedule meeting — ${cpName}`} width={400}>
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontFamily: "'DM Sans', sans-serif" }}>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//           <label style={labelStyle}>Date &amp; time</label>
//           <input
//             type="datetime-local"
//             value={scheduledAt}
//             onChange={e => setScheduledAt(e.target.value)}
//             style={fieldStyle}
//             onFocus={e => e.target.style.borderColor = 'rgba(201,151,61,.5)'}
//             onBlur={e => e.target.style.borderColor = '#EAE5DD'}
//           />
//         </div>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//           <label style={labelStyle}>Reason</label>
//           <input
//             type="text" value={reason}
//             onChange={e => setReason(e.target.value)}
//             placeholder="e.g. 21-day inactivity follow-up"
//             style={fieldStyle}
//             onFocus={e => e.target.style.borderColor = 'rgba(201,151,61,.5)'}
//             onBlur={e => e.target.style.borderColor = '#EAE5DD'}
//           />
//         </div>

//         <div style={{
//           padding: '10px 13px',
//           background: 'rgba(201,151,61,.07)',
//           border: '1px solid rgba(201,151,61,.2)',
//           borderRadius: 8, fontSize: 12, color: '#7B3D6E', lineHeight: 1.55,
//         }}>
//           {cpName} will be notified automatically via WhatsApp when this meeting is scheduled.
//         </div>

//         <div style={{ display: 'flex', gap: 8 }}>
//           <Btn variant="brand" loading={saving} onClick={handleSave}>Schedule &amp; notify</Btn>
//           <Btn onClick={onClose}>Cancel</Btn>
//         </div>
//       </div>
//     </Modal>
//   );
// }
















































// src/pages/CPProfile.js
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCP, sendMessage, createMeeting } from '../services/api';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

function GoldBtn({ children, loading, size='md', variant='brand', onClick, type='button', disabled }) {
  const pad = size==='sm'?'5px 12px':'9px 18px', fs=size==='sm'?11:13;
  const s={ brand:{background:'linear-gradient(135deg,#7B3D6E,#5C2A52)',color:'#FFFFFF',boxShadow:'0 2px 10px rgba(123,61,110,.22)'}, dark:{background:'#EAE5DD',color:'#1C1028',border:'1px solid #D9CAAE'}, ghost:{background:'transparent',color:'#B0A494',border:'1px solid #EAE5DD'}, danger:{background:'#FBECE6',color:'#D4907A',border:'1px solid rgba(239,68,68,.3)'} };
  return <button type={type} disabled={disabled||loading} onClick={onClick} style={{ padding:pad,fontSize:fs,fontWeight:600,fontFamily:'inherit',borderRadius:8,border:'none',cursor:disabled||loading?'not-allowed':'pointer',display:'inline-flex',alignItems:'center',gap:5,opacity:disabled?.5:1,transition:'all .15s',whiteSpace:'nowrap',...s[variant] }} onMouseEnter={e=>{if(!disabled&&!loading)e.currentTarget.style.transform='translateY(-1px)'}} onMouseLeave={e=>{e.currentTarget.style.transform='none'}}>{loading&&<span style={{width:11,height:11,border:'2px solid currentColor',borderTopColor:'transparent',borderRadius:'50%',display:'inline-block',animation:'spin .7s linear infinite'}}/>}{children}</button>;
}

function Modal({ open, onClose, title, children, width=440 }) {
  useEffect(()=>{const h=e=>{if(e.key==='Escape')onClose()};if(open)document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h)},[open,onClose]);
  if(!open) return null;
  return <div onClick={e=>{if(e.target===e.currentTarget)onClose()}} style={{position:'fixed',inset:0,background:'rgba(28,16,40,.45)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16}}><div style={{background:'#FFFFFF',border:'1px solid #D9CAAE',borderRadius:18,width:'100%',maxWidth:width,padding:28,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 24px 80px rgba(28,16,40,.45)'}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}><h3 style={{fontFamily:"'Bricolage Grotesque', sans-serif",fontSize:16,fontWeight:700,color:'#1C1028'}}>{title}</h3><button onClick={onClose} style={{background:'#EAE5DD',border:'none',width:28,height:28,borderRadius:8,color:'#B0A494',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>×</button></div>{children}</div></div>;
}

const TRIGGERS = [
  { value:'dormant_support',    label:'🤝 Dormant support message'  },
  { value:'inactivity_7d',      label:'⏰ 7-day inactivity reminder' },
  { value:'inactivity_14d',     label:'⚠️ 14-day warning'            },
  { value:'inactivity_meeting', label:'📅 Meeting notification'      },
  { value:'active_perk',        label:'🎁 Perk / reward'             },
  { value:'no_conversation',    label:'💬 No conversation nudge'     },
  { value:'performance_drop',   label:'📉 Performance drop alert'    },
  { value:'manual',             label:'✏️ Custom message'            },
];

const MSG_STATUS = { sent:'#3D6B50', delivered:'#3D6B50', read:'#7B3D6E', failed:'#A8391A', pending:'#9C6820' };

export default function CPProfile() {
  const { projectId, cpId } = useParams();
  const navigate = useNavigate();
  const [cp, setCp]           = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('overview');
  const [msgModal, setMsgModal]     = useState(false);
  const [meetModal, setMeetModal]   = useState(false);

  useEffect(() => { load(); }, [cpId]);

  async function load() {
    try { setLoading(true); setCp(await getCP(projectId, cpId)); }
    catch { toast.error('Failed to load CP'); }
    finally { setLoading(false); }
  }

  async function handleSend({ triggerType, text }) {
    try {
      await sendMessage(projectId, cpId, triggerType==='manual' ? { text, triggerType } : { triggerType });
      toast.success('Message sent via WhatsApp!');
      setMsgModal(false); load();
    } catch(err) { toast.error(err.response?.data?.error || 'Send failed'); }
  }

  async function handleMeeting({ scheduledAt, reason }) {
    try {
      await createMeeting(projectId, cpId, { scheduled_at:scheduledAt, reason });
      toast.success('Meeting scheduled! CP notified.');
      setMeetModal(false); load();
    } catch { toast.error('Failed to schedule'); }
  }

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#FAF8F5' }}>
      <span style={{ width:32, height:32, border:'3px solid rgba(123,61,110,.28)', borderTopColor:'#7B3D6E', borderRadius:'50%', display:'inline-block', animation:'spin .7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!cp) return (
    <div style={{ padding:28, textAlign:'center', color:'#1C1028' }}>
      <div style={{ fontSize:36, marginBottom:12 }}>❓</div>
      <div>CP not found</div>
      <button onClick={() => navigate(-1)} style={{ marginTop:16, padding:'8px 16px', background:'#7B3D6E', color:'#FFFFFF', border:'none', borderRadius:8, cursor:'pointer', fontWeight:600 }}>← Go back</button>
    </div>
  );

  const act = cp.cp_activity?.[0] || {};
  const msgs = cp.messages || [];
  const meets = cp.meetings || [];
  const tier = act.tier || 'inactive';
  const inactiveDays = act.last_active_at ? Math.floor((Date.now()-new Date(act.last_active_at))/86400000) : 999;
  const tierColor = { active:'#3D6B50', dormant:'#9C6820', inactive:'#A8391A' };
  const tierCfg = {
    active:   { bg:'#E8F0EB',  color:'#6EA882',  label:'Active',   action:'🎁 Send perk reward',     trigger:'active_perk' },
    dormant:  { bg:'#F8F0E4',  color:'#D4A84A',  label:'Dormant',  action:'🤝 Send support message', trigger:'dormant_support' },
    inactive: { bg:'#FBECE6',  color:'#D4907A',  label:'Inactive', action:'🚨 Send warning',         trigger:'inactivity_14d' },
  }[tier] || {};

  return (
    <div style={{ padding:'28px', fontFamily:"'Plus Jakarta Sans',sans-serif", background:'#FAF8F5', minHeight:'100vh' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .pu{animation:fadeUp .35s ease both}`}</style>

      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20, fontSize:12, color:'#9486A8' }}>
        <button onClick={() => navigate('/dashboard')} style={{ background:'none', border:'none', color:'#9486A8', cursor:'pointer', fontSize:12, padding:0 }}>Projects</button>
        <span>/</span>
        <button onClick={() => navigate(`/projects/${projectId}`)} style={{ background:'none', border:'none', color:'#9486A8', cursor:'pointer', fontSize:12, padding:0 }}>Partners</button>
        <span>/</span>
        <span style={{ color:'#1C1028', fontWeight:500 }}>{cp.name}</span>
      </div>

      {/* Hero card */}
      <div className="pu" style={{ background:'white', border:'1px solid #EAE5DD', borderRadius:20, padding:'24px 28px', marginBottom:16, position:'relative', overflow:'hidden' }}>
        {/* Glow */}
        <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, background:`radial-gradient(circle, ${tierColor[tier]}18 0%, transparent 70%)`, pointerEvents:'none' }} />

        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16, position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:56, height:56, borderRadius:16, background:`${tierColor[tier]}22`, color:tierColor[tier], display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, flexShrink:0, border:`1px solid ${tierColor[tier]}44` }}>
              {cp.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontFamily:"'Bricolage Grotesque', sans-serif", fontSize:20, fontWeight:700, color:'#1C1028', marginBottom:6, lineHeight:1 }}>{cp.name}</h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, alignItems:'center' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:tierCfg.bg, color:tierCfg.color }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:tierColor[tier] }} />{tierCfg.label}
                </span>
                {cp.area      && <span style={{ fontSize:12, color:'#9486A8' }}>📍 {cp.area}</span>}
                {cp.firm_name && <span style={{ fontSize:12, color:'#9486A8' }}>🏢 {cp.firm_name}</span>}
                {cp.whatsapp  && <span style={{ fontSize:12, color:'#9486A8' }}>📱 +{cp.whatsapp}</span>}
                {cp.rera_number && <span style={{ fontSize:12, color:'#9486A8' }}>🪪 {cp.rera_number}</span>}
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {tier === 'inactive' && <GoldBtn variant="danger" size="sm" onClick={() => setMeetModal(true)}>📅 Schedule meeting</GoldBtn>}
            <GoldBtn variant="dark" size="sm" onClick={() => handleSend({ triggerType:tierCfg.trigger })}>{tierCfg.action}</GoldBtn>
            <GoldBtn size="sm" onClick={() => setMsgModal(true)}>📨 Send message</GoldBtn>
          </div>
        </div>

        {/* Inactivity banner */}
        {inactiveDays >= 7 && (
          <div style={{ marginTop:16, padding:'10px 14px', background: inactiveDays>=21?'#FBECE6':inactiveDays>=14?'#F8F0E4':'#F8F0E4', border:`1px solid ${inactiveDays>=21?'rgba(239,68,68,.3)':'rgba(234,179,8,.25)'}`, borderRadius:10, fontSize:13, color:inactiveDays>=21?'#D4907A':'#D4A84A', display:'flex', alignItems:'center', gap:8 }}>
            <span>{inactiveDays>=21?'⛔':inactiveDays>=14?'⚠️':'⏰'}</span>
            {inactiveDays>=21 ? `${inactiveDays} days inactive — schedule a meeting immediately`
              : inactiveDays>=14 ? `${inactiveDays} days inactive — send a strong reminder`
              : `${inactiveDays} days inactive — send a check-in`}
          </div>
        )}
      </div>

      {/* Score + stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', gap:10, marginBottom:16 }}>
        {[
          { label:'Score',        value:`${act.score||0}/100`, color:(act.score||0)>=60?'#3D6B50':(act.score||0)>=30?'#9C6820':'#A8391A' },
          { label:'Site visits',  value:act.site_visits||0 },
          { label:'Referrals',    value:act.client_referrals||0 },
          { label:'Deals closed', value:act.deals_closed||0, color:'#3D6B50' },
          { label:'Messages',     value:msgs.length },
          { label:'Meetings',     value:meets.length },
        ].map((s,i) => (
          <div key={i} className="pu" style={{ animationDelay:`${i*.04}s`, padding:'14px 16px', background:'#FFFFFF', border:'1px solid #EAE5DD', borderRadius:12 }}>
            <div style={{ fontSize:10, color:'#9486A8', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:6 }}>{s.label}</div>
            <div style={{ fontSize:22, fontFamily:"'Bricolage Grotesque', sans-serif", fontWeight:700, color:s.color||'#fff' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'1px solid #EAE5DD', marginBottom:16, gap:2 }}>
        {['overview','messages','meetings'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:'8px 16px', fontSize:13, fontWeight:500, border:'none', background:'transparent', cursor:'pointer', fontFamily:'inherit', color:tab===t?'#fff':'#6B6B64', borderBottom:`2px solid ${tab===t?'#7B3D6E':'transparent'}`, marginBottom:-1, textTransform:'capitalize', transition:'all .15s' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab: overview */}
      {tab === 'overview' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <div style={{ background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:16, padding:'20px 22px' }}>
            <h3 style={{ fontFamily:"'Bricolage Grotesque', sans-serif", fontSize:14, fontWeight:600, color:'#1C1028', marginBottom:18 }}>Activity breakdown</h3>
            {[
              { label:'Site visits',       val:act.site_visits||0,       max:20, color:'#7B3D6E' },
              { label:'Client referrals',  val:act.client_referrals||0,  max:10, color:'#7B3D6E' },
              { label:'Deals closed',      val:act.deals_closed||0,      max:8,  color:'#3D6B50' },
            ].map(m => (
              <div key={m.label} style={{ marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:12, color:'#B0A494' }}>{m.label}</span>
                  <span style={{ fontSize:12, fontWeight:600, color:'#1C1028' }}>{m.val}/{m.max}</span>
                </div>
                <div style={{ height:7, background:'#EAE5DD', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.min((m.val/m.max)*100,100)}%`, background:m.color, borderRadius:4, transition:'width .6s ease' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:16, padding:'20px 22px' }}>
            <h3 style={{ fontFamily:"'Bricolage Grotesque', sans-serif", fontSize:14, fontWeight:600, color:'#1C1028', marginBottom:18 }}>Activity timeline</h3>
            {[
              { label:'Last active',        val:act.last_active_at },
              { label:'Last site visit',    val:act.last_visit_at },
              { label:'Last conversation',  val:act.last_conversation_at },
              { label:'CP added',           val:cp.created_at },
            ].map(t => (
              <div key={t.label} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #F5F2EE' }}>
                <span style={{ fontSize:12, color:'#9486A8' }}>{t.label}</span>
                <span style={{ fontSize:12, fontWeight:500, color:t.val?'#fff':'#6B6B64' }}>
                  {t.val ? formatDistanceToNow(parseISO(t.val), { addSuffix:true }) : 'Never'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: messages */}
      {tab === 'messages' && (
        <div style={{ background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:16, overflow:'hidden' }}>
          {msgs.length === 0 ? (
            <div style={{ textAlign:'center', padding:'52px 24px' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>💬</div>
              <div style={{ fontFamily:"'Bricolage Grotesque', sans-serif", fontSize:15, fontWeight:600, color:'#1C1028', marginBottom:6 }}>No messages yet</div>
              <div style={{ fontSize:13, color:'#9486A8', marginBottom:16 }}>Send the first message using the button above</div>
              <GoldBtn size="sm" onClick={() => setMsgModal(true)}>Send message</GoldBtn>
            </div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr style={{ background:'#FAFAF8', borderBottom:'1px solid #EAE5DD' }}>
                {['Type','Message','Status','Sent'].map(h => <th key={h} style={{ padding:'10px 14px', fontSize:10, fontWeight:700, color:'#9486A8', textAlign:'left', textTransform:'uppercase', letterSpacing:'.07em' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {msgs.map(m => (
                  <tr key={m.id} style={{ borderBottom:'1px solid #FFFFFF' }}>
                    <td style={{ padding:'10px 14px' }}><span style={{ fontSize:11, padding:'2px 9px', background:'#EAE5DD', borderRadius:20, fontWeight:600, color:'#B0A494' }}>{m.trigger_type||'manual'}</span></td>
                    <td style={{ padding:'10px 14px', maxWidth:280 }}><span style={{ fontSize:12, color:'#9486A8', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.message_body}</span></td>
                    <td style={{ padding:'10px 14px' }}><span style={{ fontSize:11, fontWeight:700, color:MSG_STATUS[m.status]||'#9B9B92' }}>● {m.status}</span></td>
                    <td style={{ padding:'10px 14px', fontSize:11, color:'#9486A8' }}>{m.sent_at?formatDistanceToNow(parseISO(m.sent_at),{addSuffix:true}):'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab: meetings */}
      {tab === 'meetings' && (
        <div style={{ background:'#FAFAF8', border:'1px solid #EAE5DD', borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #EAE5DD', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, fontWeight:600, color:'#1C1028' }}>Meetings</span>
            <GoldBtn size="sm" onClick={() => setMeetModal(true)}>+ Schedule</GoldBtn>
          </div>
          {meets.length === 0 ? (
            <div style={{ textAlign:'center', padding:'52px 24px' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>📅</div>
              <div style={{ fontFamily:"'Bricolage Grotesque', sans-serif", fontSize:15, fontWeight:600, color:'#1C1028', marginBottom:6 }}>No meetings scheduled</div>
              <div style={{ fontSize:13, color:'#9486A8', marginBottom:16 }}>Schedule a follow-up meeting with this CP</div>
              <GoldBtn size="sm" onClick={() => setMeetModal(true)}>Schedule meeting</GoldBtn>
            </div>
          ) : meets.map(m => (
            <div key={m.id} style={{ padding:'16px 20px', borderBottom:'1px solid #FFFFFF', display:'flex', gap:14, alignItems:'flex-start' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:m.status==='completed'?'#E8F0EB':m.status==='cancelled'?'#FBECE6':'#F8F0E4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                {m.status==='completed'?'✅':m.status==='cancelled'?'❌':'📅'}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#1C1028', marginBottom:3 }}>{m.scheduled_at?format(parseISO(m.scheduled_at),'dd MMM yyyy, h:mm a'):'TBD'}</div>
                <div style={{ fontSize:12, color:'#9486A8' }}>{m.reason||'Follow-up meeting'}</div>
                {m.notes && <div style={{ fontSize:11, color:'#9486A8', marginTop:4 }}>{m.notes}</div>}
              </div>
              <span style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:m.status==='completed'?'#E8F0EB':m.status==='cancelled'?'#FBECE6':'#F8F0E4', color:m.status==='completed'?'#6EA882':m.status==='cancelled'?'#D4907A':'#D4A84A' }}>{m.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Send message modal */}
      <Modal open={msgModal} onClose={() => setMsgModal(false)} title={`Message — ${cp.name}`}>
        <SendMsgForm cpName={cp.name} onSend={handleSend} onClose={() => setMsgModal(false)} />
      </Modal>

      {/* Schedule meeting modal */}
      <Modal open={meetModal} onClose={() => setMeetModal(false)} title={`Schedule meeting — ${cp.name}`}>
        <MeetingForm cpName={cp.name} onSchedule={handleMeeting} onClose={() => setMeetModal(false)} />
      </Modal>
    </div>
  );
}

function SendMsgForm({ cpName, onSend, onClose }) {
  const [triggerType, setTriggerType] = useState('manual');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  async function handle() {
    setSending(true);
    await onSend({ triggerType, text: triggerType==='manual'?text:undefined });
    setSending(false);
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Message type</label>
        <select value={triggerType} onChange={e => setTriggerType(e.target.value)}
          style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none' }}>
          {TRIGGERS.map(o => <option key={o.value} value={o.value} style={{ background:'#1A1A16' }}>{o.label}</option>)}
        </select>
      </div>
      {triggerType === 'manual' && (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Message</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={5} placeholder={`Hi ${cpName}, this is…`}
            style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none', resize:'vertical', lineHeight:1.6 }}
            onFocus={e => e.target.style.borderColor='rgba(123,61,110,.45)'}
            onBlur={e => e.target.style.borderColor='#D9CAAE'} />
          <span style={{ fontSize:11, color:'#9486A8' }}>{text.length} characters</span>
        </div>
      )}
      <div style={{ padding:'10px 12px', background:'rgba(123,61,110,.07)', border:'1px solid rgba(123,61,110,.12)', borderRadius:8, fontSize:12, color:'#D4A84A' }}>
        📱 Sends to {cpName}'s WhatsApp number
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <GoldBtn loading={sending} disabled={triggerType==='manual'&&!text.trim()} onClick={handle}>Send via WhatsApp</GoldBtn>
        <GoldBtn variant="ghost" onClick={onClose}>Cancel</GoldBtn>
      </div>
    </div>
  );
}

function MeetingForm({ cpName, onSchedule, onClose }) {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1); tomorrow.setHours(10,0,0,0);
  const [scheduledAt, setScheduledAt] = useState(tomorrow.toISOString().slice(0,16));
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  async function handle() {
    setSaving(true);
    await onSchedule({ scheduledAt: new Date(scheduledAt).toISOString(), reason });
    setSaving(false);
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Date & time</label>
        <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)}
          style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none' }}
          onFocus={e => e.target.style.borderColor='rgba(123,61,110,.45)'}
          onBlur={e => e.target.style.borderColor='#D9CAAE'} />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <label style={{ fontSize:11, fontWeight:600, color:'#9486A8', textTransform:'uppercase', letterSpacing:'.06em' }}>Reason</label>
        <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. 21-day inactivity follow-up"
          style={{ padding:'9px 12px', fontSize:13, background:'#F5F2EE', border:'1px solid #D9CAAE', borderRadius:9, color:'#1C1028', outline:'none' }}
          onFocus={e => e.target.style.borderColor='rgba(123,61,110,.45)'}
          onBlur={e => e.target.style.borderColor='#D9CAAE'} />
      </div>
      <div style={{ padding:'10px 12px', background:'rgba(123,61,110,.07)', border:'1px solid rgba(123,61,110,.12)', borderRadius:8, fontSize:12, color:'#D4A84A' }}>
        📱 {cpName} will be notified via WhatsApp when you schedule this.
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <GoldBtn loading={saving} onClick={handle}>Schedule & notify</GoldBtn>
        <GoldBtn variant="ghost" onClick={onClose}>Cancel</GoldBtn>
      </div>
    </div>
  );
}