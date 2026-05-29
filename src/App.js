// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell     from './components/layout/AppShell';
import Login        from './pages/Login';
import Dashboard    from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import CPProfile    from './pages/CPProfile';
import Messages     from './pages/Messages';
import Settings     from './pages/Settings';
import { Spinner }  from './components/ui';
import './index.css';

function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#FAF8F5' }}>
      <Spinner size={32} color="#7B3D6E" />
    </div>
  );
  return admin ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><AppShell><Dashboard /></AppShell></ProtectedRoute>
      } />
      <Route path="/projects/:projectId" element={
        <ProtectedRoute><AppShell><ProjectDetail /></AppShell></ProtectedRoute>
      } />
      <Route path="/projects/:projectId/cps/:cpId" element={
        <ProtectedRoute><AppShell><CPProfile /></AppShell></ProtectedRoute>
      } />
      <Route path="/messages" element={
        <ProtectedRoute><AppShell><Messages /></AppShell></ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute><AppShell><Settings /></AppShell></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 13,
              borderRadius: 10,
              background: '#FFFFFF',
              color: '#1C1028',
              border: '1px solid #EAE5DD',
              boxShadow: '0 4px 14px rgba(28,16,40,.10)',
            },
            success: { iconTheme: { primary: '#3D6B50', secondary: '#E8F0EB' } },
            error:   { iconTheme: { primary: '#A8391A', secondary: '#FBECE6' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
