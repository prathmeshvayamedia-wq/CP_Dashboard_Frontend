// src/components/layout/Sidebar.js
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = [
  { to: '/dashboard', icon: '⊞', label: 'Projects'  },
  { to: '/messages',  icon: '✉', label: 'Messages'  },
  { to: '/settings',  icon: '⚙', label: 'Settings'  },
];

export default function Sidebar() {
  const { admin, signOut } = useAuth();
  const navigate = useNavigate();
  const initials = admin?.name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'A';

  return (
    <aside style={{
      width: 232, flexShrink: 0,
      background: '#FFFFFF',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
      borderRight: '1px solid #EAE5DD',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {/* Logo */}
      <div style={{ padding:'22px 18px 16px', borderBottom:'1px solid #EAE5DD' }}>
        <div style={{ display:'flex', alignItems:'center', gap:11 }}>
          <div style={{
            width:36, height:36, background:'#7B3D6E',
            borderRadius:10, display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:18, flexShrink:0,
            boxShadow:'0 4px 14px rgba(123,61,110,.28)',
          }}>🏗</div>
          <div>
            <div style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontWeight:800, fontSize:15, color:'#1C1028', lineHeight:1.1 }}>PropEdge</div>
            <div style={{ fontSize:9, color:'#7B3D6E', letterSpacing:'.1em', textTransform:'uppercase', marginTop:2, fontWeight:700 }}>CP Manager</div>
          </div>
        </div>
      </div>

      {/* Nav section label */}
      <div style={{ padding:'16px 18px 6px' }}>
        <span style={{ fontSize:9, fontWeight:800, color:'#C8BEAF', textTransform:'uppercase', letterSpacing:'.12em' }}>Navigation</span>
      </div>

      {/* Nav items */}
      <nav style={{ flex:1, padding:'0 10px', display:'flex', flexDirection:'column', gap:2 }}>
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap:10,
              padding: '9px 12px', borderRadius:10, textDecoration:'none',
              fontSize:13, fontWeight: isActive ? 700 : 500,
              color: isActive ? '#7B3D6E' : '#9486A8',
              background: isActive ? '#F0E8F0' : 'transparent',
              transition:'all .15s',
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.style.background.includes('F0E8F0')) {
                e.currentTarget.style.background = '#F5F2EE';
                e.currentTarget.style.color = '#7B3D6E';
              }
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.style.background.includes('F0E8F0')) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#9486A8';
              }
            }}
          >
            <span style={{ fontSize:16, width:18, textAlign:'center', flexShrink:0 }}>{n.icon}</span>
            {n.label}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div style={{ height:1, background:'#EAE5DD', margin:'0 14px' }} />

      {/* Admin footer */}
      <div style={{ padding:'12px 12px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#F5F2EE', borderRadius:12, marginBottom:8, border:'1px solid #EAE5DD' }}>
          <div style={{
            width:32, height:32, borderRadius:'50%',
            background:'#7B3D6E',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:12, fontWeight:700, color:'#fff', flexShrink:0,
          }}>{initials}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#1C1028', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{admin?.name}</div>
            <div style={{ fontSize:9, color:'#B0A494', textTransform:'uppercase', letterSpacing:'.06em', marginTop:1 }}>Administrator</div>
          </div>
        </div>
        <button
          onClick={() => { signOut(); navigate('/login'); }}
          style={{
            width:'100%', padding:'7px', fontSize:12, fontWeight:600,
            background:'transparent', color:'#B0A494',
            border:'1px solid #EAE5DD', borderRadius:9,
            cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
          }}
          onMouseEnter={e => { e.target.style.color='#A8391A'; e.target.style.borderColor='#D9B4A0'; e.target.style.background='#FBECE6'; }}
          onMouseLeave={e => { e.target.style.color='#B0A494'; e.target.style.borderColor='#EAE5DD'; e.target.style.background='transparent'; }}
        >Sign out</button>
      </div>
    </aside>
  );
}
