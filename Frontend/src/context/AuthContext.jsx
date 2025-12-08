import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {name, role, avatar, token}
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('authUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // DIRECT BACKEND URL - Bypassing Vite Proxy to avoid configuration issues
  const apiBase = 'http://localhost:8000/api/v1/users';

  const login = async (email, password) => {
    try {
      const res = await fetch(`${apiBase}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      const resText = await res.text();
      let data;
      try {
        data = JSON.parse(resText);
      } catch (e) {
        console.error("Failed to parse login response:", resText);
        throw new Error("Server Error: Received HTML instead of JSON. Check backend logs.");
      }

      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      const authData = {
        name: data.data?.user?.name || email.split('@')[0],
        role: data.data?.user?.role || 'user',
        avatar: data.data?.user?.avatar || '/default-avatar.png',
        token: data.data?.accesstoken,
      };
      
      setUser(authData);
      localStorage.setItem('authUser', JSON.stringify(authData));
      toast.success(`Welcome back, ${authData.name}!`);
      setShowLogin(false);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const register = async (formPayload) => {
    // formPayload can be { name, email, password, phone, role, avatar... }
    try {
      const res = await fetch(`${apiBase}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formPayload),
        credentials: 'include',
      });

      const resText = await res.text();
      let data;
      try {
        data = JSON.parse(resText);
      } catch (e) {
        console.error("Failed to parse register response:", resText);
        throw new Error("Server Error: Received HTML instead of JSON. Check backend logs.");
      }

      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      const authData = {
        name: data.data?.name || formPayload.name,
        role: data.data?.role || formPayload.role,
        avatar: data.data?.avatar || '/default-avatar.png',
        token: data.data?.accesstoken, // Note: Register might not return token depending on backend logic
      };
      
      // If backend doesn't auto-login on register, we might just toast success
      // But typically we want to set user state if token is returned
      if (authData.token) {
          setUser(authData);
          localStorage.setItem('authUser', JSON.stringify(authData));
      }

      toast.success('Account created! Please Login.');
      setShowRegister(false);
      setShowLogin(true); // Switch to login screen
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${apiBase}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('authUser');
    toast.info('You have logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        showLogin,
        setShowLogin,
        showRegister,
        setShowRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
