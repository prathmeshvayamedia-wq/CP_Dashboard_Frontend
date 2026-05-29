// // src/services/api.js
// // DEMO MODE — returns fake data, no backend needed

// const DEMO_PROJECTS = [
//   {
//     id: 'proj-1',
//     name: '31 Floral Drive',
//     location: 'Andheri West, Mumbai',
//     total_units: 300,
//     premium_inventory_count: 40,
//     total_cps: 12,
//     active_count: 4,
//     dormant_count: 5,
//     inactive_count: 3,
//     is_active: true,
//     created_at: new Date().toISOString()
//   },
//   {
//     id: 'proj-2',
//     name: 'Skyline Heights',
//     location: 'Bandra East, Mumbai',
//     total_units: 180,
//     premium_inventory_count: 20,
//     total_cps: 8,
//     active_count: 3,
//     dormant_count: 3,
//     inactive_count: 2,
//     is_active: true,
//     created_at: new Date().toISOString()
//   },
//   {
//     id: 'proj-3',
//     name: 'Green Valley',
//     location: 'Thane West',
//     total_units: 450,
//     premium_inventory_count: 60,
//     total_cps: 20,
//     active_count: 8,
//     dormant_count: 7,
//     inactive_count: 5,
//     is_active: true,
//     created_at: new Date().toISOString()
//   }
// ];

// const DEMO_CPS = [
//   { cp: { id: 'cp-1', name: 'Rahul Mehta',  email: 'rahul@example.com',  whatsapp: '9876543210', area: 'Andheri West', firm_name: 'Mehta Properties', created_at: new Date().toISOString() }, activity: { site_visits: 42, deals_closed: 11, client_referrals: 8, score: 89, tier: 'active',   last_active_at: new Date(Date.now() - 1*86400000).toISOString() } },
//   { cp: { id: 'cp-2', name: 'Priya Sharma', email: 'priya@example.com',  whatsapp: '9876543211', area: 'Bandra',       firm_name: 'Sharma Realty',    created_at: new Date().toISOString() }, activity: { site_visits: 33, deals_closed: 8,  client_referrals: 5, score: 75, tier: 'active',   last_active_at: new Date(Date.now() - 2*86400000).toISOString() } },
//   { cp: { id: 'cp-3', name: 'Vikram Joshi', email: 'vikram@example.com', whatsapp: '9876543212', area: 'Powai',        firm_name: 'Joshi Associates', created_at: new Date().toISOString() }, activity: { site_visits: 38, deals_closed: 10, client_referrals: 7, score: 84, tier: 'active',   last_active_at: new Date(Date.now() - 1*86400000).toISOString() } },
//   { cp: { id: 'cp-4', name: 'Ajay Kapoor',  email: 'ajay@example.com',   whatsapp: '9876543213', area: 'Thane',        firm_name: 'Kapoor Homes',     created_at: new Date().toISOString() }, activity: { site_visits: 18, deals_closed: 3,  client_referrals: 3, score: 47, tier: 'dormant',  last_active_at: new Date(Date.now() - 5*86400000).toISOString() } },
//   { cp: { id: 'cp-5', name: 'Sunita Verma', email: 'sunita@example.com', whatsapp: '9876543214', area: 'Goregaon',     firm_name: 'Verma Estates',    created_at: new Date().toISOString() }, activity: { site_visits: 14, deals_closed: 2,  client_referrals: 2, score: 38, tier: 'dormant',  last_active_at: new Date(Date.now() - 6*86400000).toISOString() } },
//   { cp: { id: 'cp-6', name: 'Anita Desai',  email: 'anita@example.com',  whatsapp: '9876543215', area: 'Malad',        firm_name: 'Desai Properties', created_at: new Date().toISOString() }, activity: { site_visits: 7,  deals_closed: 1,  client_referrals: 1, score: 22, tier: 'dormant',  last_active_at: new Date(Date.now() - 8*86400000).toISOString() } },
//   { cp: { id: 'cp-7', name: 'Deepak Nair',  email: 'deepak@example.com', whatsapp: '9876543216', area: 'Navi Mumbai',  firm_name: 'Nair Realty',      created_at: new Date().toISOString() }, activity: { site_visits: 4,  deals_closed: 0,  client_referrals: 0, score: 10, tier: 'inactive', last_active_at: new Date(Date.now() - 15*86400000).toISOString() } },
//   { cp: { id: 'cp-8', name: 'Rohit Patel',  email: 'rohit@example.com',  whatsapp: '9876543217', area: 'Kurla',        firm_name: 'Patel Properties', created_at: new Date().toISOString() }, activity: { site_visits: 1,  deals_closed: 0,  client_referrals: 0, score: 2,  tier: 'inactive', last_active_at: new Date(Date.now() - 22*86400000).toISOString() } },
//   { cp: { id: 'cp-9', name: 'Meera Pillai', email: 'meera@example.com',  whatsapp: '9876543218', area: 'Dadar',        firm_name: 'Pillai Associates',created_at: new Date().toISOString() }, activity: { site_visits: 0,  deals_closed: 0,  client_referrals: 0, score: 0,  tier: 'inactive', last_active_at: new Date(Date.now() - 30*86400000).toISOString() } },
// ];

// const DEMO_MESSAGES = [
//   { id: 'm-1', trigger_type: 'inactivity_7d',   message_body: 'Hi Deepak, we noticed 15 days of inactivity...', status: 'delivered', sent_at: new Date(Date.now() - 2*3600000).toISOString(),  cp: { name: 'Deepak Nair' } },
//   { id: 'm-2', trigger_type: 'inactivity_14d',  message_body: 'Hi Rohit, it has been 22 days since your last visit...', status: 'sent', sent_at: new Date(Date.now() - 4*3600000).toISOString(), cp: { name: 'Rohit Patel' } },
//   { id: 'm-3', trigger_type: 'dormant_support', message_body: 'Hi Ajay, we are here to support you...', status: 'read',      sent_at: new Date(Date.now() - 1*86400000).toISOString(), cp: { name: 'Ajay Kapoor' } },
//   { id: 'm-4', trigger_type: 'active_perk',     message_body: 'Congratulations Rahul! You are a Star performer...', status: 'read', sent_at: new Date(Date.now() - 1*86400000).toISOString(), cp: { name: 'Rahul Mehta' } },
//   { id: 'm-5', trigger_type: 'manual',          message_body: 'Hi Priya, please check the new inventory list...', status: 'delivered', sent_at: new Date(Date.now() - 2*86400000).toISOString(), cp: { name: 'Priya Sharma' } },
// ];

// const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// // ── Auth ─────────────────────────────────────────────────────
// export const login = async (email, password) => {
//   await delay();
//   if (email === 'admin@yourcompany.com' && password === 'Admin@1234') {
//     return { token: 'demo-token', admin: { id: 'demo-001', name: 'Admin', email, role: 'superadmin' } };
//   }
//   throw { response: { data: { error: 'Invalid credentials' } } };
// };

// // ── Projects ─────────────────────────────────────────────────
// export const getProjects = async () => { await delay(); return DEMO_PROJECTS; };

// export const createProject = async (data) => {
//   await delay();
//   return { ...data, id: 'proj-new-' + Date.now(), total_cps: 0, active_count: 0, dormant_count: 0, inactive_count: 0, is_active: true, created_at: new Date().toISOString() };
// };

// export const updateProject = async (id, data) => { await delay(); return data; };

// export const getTierRules = async () => {
//   await delay();
//   return { active_min_visits: 5, active_min_deals: 1, dormant_min_visits: 1, dormant_min_deals: 0, inactivity_warning_days: 7, inactivity_critical_days: 14, inactivity_meeting_days: 21 };
// };

// export const updateTierRules = async (id, data) => { await delay(); return data; };

// // ── Channel Partners ──────────────────────────────────────────
// export const getCPs = async (projectId, params = {}) => {
//   await delay();
//   let list = [...DEMO_CPS];
//   if (params.tier) list = list.filter(r => r.activity.tier === params.tier);
//   if (params.search) {
//     const q = params.search.toLowerCase();
//     list = list.filter(r => r.cp.name.toLowerCase().includes(q) || r.cp.area.toLowerCase().includes(q));
//   }
//   return { cps: list, total: list.length };
// };

// export const getCP = async (projectId, cpId) => {
//   await delay();
//   const found = DEMO_CPS.find(r => r.cp.id === cpId);
//   if (!found) return null;
//   return {
//     ...found.cp,
//     cp_activity: [found.activity],
//     messages: DEMO_MESSAGES.filter(m => m.cp.name === found.cp.name),
//     meetings: cpId === 'cp-7' ? [{ id: 'meet-1', scheduled_at: new Date(Date.now() + 2*86400000).toISOString(), reason: '21-day inactivity follow-up', status: 'scheduled', notes: '' }] : []
//   };
// };

// export const updateCPActivity = async () => { await delay(); return {}; };

// // ── Messaging ─────────────────────────────────────────────────
// export const sendMessage = async (projectId, cpId, payload) => {
//   await delay(600);
//   return { result: { status: 'sent', messageId: 'msg-' + Date.now() } };
// };

// export const sendBulkMessage = async (projectId, payload) => {
//   await delay(800);
//   return { sent: 5, total: 5 };
// };

// export const getMessages = async () => { await delay(); return { messages: DEMO_MESSAGES, total: DEMO_MESSAGES.length }; };

// // ── Meetings ──────────────────────────────────────────────────
// export const createMeeting = async (projectId, cpId, data) => {
//   await delay();
//   return { ...data, id: 'meet-' + Date.now(), status: 'scheduled' };
// };

// export const updateMeeting = async (id, data) => { await delay(); return data; };

// // ── Analytics ─────────────────────────────────────────────────
// export const getAnalytics = async () => {
//   await delay();
//   return {
//     tier_distribution: { active: 4, dormant: 3, inactive: 2 },
//     total_cps: 9,
//     messages: { by_type: { inactivity_7d: 3, dormant_support: 2, active_perk: 1 }, by_status: { sent: 4, delivered: 3, read: 2, failed: 0 }, total: 9 },
//     daily_summaries: [],
//     top_performers: DEMO_CPS.slice(0, 3).map(r => ({ score: r.activity.score, tier: r.activity.tier, cp: { name: r.cp.name, area: r.cp.area } }))
//   };
// };

// export const getSummaries = async () => { await delay(); return []; };

// // ── Import ────────────────────────────────────────────────────
// export const importCSV = async () => {
//   await delay(1000);
//   return { import: { success: 9, failed: 0, total: 9, errors: [] } };
// };

// // ── Automation ────────────────────────────────────────────────
// export const runAutomation = async () => {
//   await delay(1500);
//   return { result: { summary: { active_count: 4, dormant_count: 3, inactive_count: 2 } } };
// };







































// src/services/api.js
// All backend API calls. Change BASE_URL to your deployed backend.

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT on every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// // Auto-logout on 401
// api.interceptors.response.use(
//   r => r,
//   err => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem('token');
//       localStorage.removeItem('admin');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

// Auto-logout on 401 (disabled for demo mode)
api.interceptors.response.use(
  r => r,
  err => {
    // ignore auth errors in demo mode
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────
export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then(r => r.data);

// ── Projects ─────────────────────────────────────────────────
export const getProjects = () =>
  api.get('/projects').then(r => r.data.projects);

export const createProject = (data) =>
  api.post('/projects', data).then(r => r.data.project);

export const updateProject = (id, data) =>
  api.patch(`/projects/${id}`, data).then(r => r.data.project);

export const getTierRules = (projectId) =>
  api.get(`/projects/${projectId}/tier-rules`).then(r => r.data.rules);

export const updateTierRules = (projectId, data) =>
  api.patch(`/projects/${projectId}/tier-rules`, data).then(r => r.data.rules);

// ── Channel Partners ──────────────────────────────────────────
export const getCPs = (projectId, params = {}) =>
  api.get(`/projects/${projectId}/cps`, { params }).then(r => r.data);

export const getCP = (projectId, cpId) =>
  api.get(`/projects/${projectId}/cps/${cpId}`).then(r => r.data.cp);

export const updateCPActivity = (projectId, cpId, data, period = 'monthly') =>
  api.patch(`/projects/${projectId}/cps/${cpId}/activity`, data, { params: { period } }).then(r => r.data);

// ── Messaging ─────────────────────────────────────────────────
export const sendMessage = (projectId, cpId, payload) =>
  api.post(`/projects/${projectId}/cps/${cpId}/message`, payload).then(r => r.data);

export const sendBulkMessage = (projectId, payload) =>
  api.post(`/projects/${projectId}/message-bulk`, payload).then(r => r.data);

export const getMessages = (projectId, params = {}) =>
  api.get(`/projects/${projectId}/messages`, { params }).then(r => r.data);

// ── Meetings ──────────────────────────────────────────────────
export const createMeeting = (projectId, cpId, data) =>
  api.post(`/projects/${projectId}/cps/${cpId}/meetings`, data).then(r => r.data.meeting);

export const updateMeeting = (meetingId, data) =>
  api.patch(`/meetings/${meetingId}`, data).then(r => r.data.meeting);

// ── Analytics ─────────────────────────────────────────────────
export const getAnalytics = (projectId, period = 'monthly') =>
  api.get(`/projects/${projectId}/analytics`, { params: { period } }).then(r => r.data);

export const getSummaries = (projectId) =>
  api.get(`/projects/${projectId}/summaries`).then(r => r.data.summaries);

// ── Import ────────────────────────────────────────────────────
export const importCSV = (projectId, file, periodType = 'monthly') => {
  const form = new FormData();
  form.append('file', file);
  form.append('period_type', periodType);
  return api.post(`/projects/${projectId}/import`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(r => r.data);
};

// ── Automation ────────────────────────────────────────────────
export const runAutomation = (projectId) =>
  api.post(`/projects/${projectId}/run-automation`).then(r => r.data);
