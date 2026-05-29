// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('admin');
    if (saved) setAdmin(JSON.parse(saved));
    setLoading(false);
  }, []);

  const signIn = (token, adminData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(adminData));
    // localStorage.clear();
    // location.reload();
    setAdmin(adminData);
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);














// src/context/AuthContext.js
// import { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(null);

// // ── DEMO ADMIN — bypasses login for UI preview ──
// const DEMO_ADMIN = {
//   id: 'demo-001',
//   name: 'Admin',
//   email: 'admin@yourcompany.com',
//   role: 'superadmin'
// };








// export function AuthProvider({ children }) {
//   const [admin, setAdmin]     = useState(DEMO_ADMIN); // auto logged in
//   const [loading, setLoading] = useState(false);      // skip loading

//   const signIn = (token, adminData) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('admin', JSON.stringify(adminData));
//     setAdmin(adminData);
//   };

//   const signOut = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('admin');
//     setAdmin(null);
//   };

//   return (
//     <AuthContext.Provider value={{ admin, loading, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);