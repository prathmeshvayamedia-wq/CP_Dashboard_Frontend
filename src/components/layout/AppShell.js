// src/components/layout/AppShell.js
import Sidebar from './Sidebar';

export default function AppShell({ children }) {
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#FAF8F5' }}>
      <Sidebar />
      <main style={{ flex:1, minWidth:0, overflowY:'auto' }}>
        {children}
      </main>
    </div>
  );
}
