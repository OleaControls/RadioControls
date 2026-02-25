import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const API_BASE = '/api';

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Nuevo estado de carga

  // Cargar sesión al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('active_user');
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error("Error recuperando sesión", e);
        localStorage.removeItem('active_user');
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false); // Termina de cargar la sesión
  }, []);

  const persistSession = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem('active_user', JSON.stringify(nextUser));
    localStorage.setItem('auth_token', nextToken);
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await safeJson(response);
      if (!response.ok) {
        return { success: false, message: data?.message || 'No se pudo iniciar sesión' };
      }

      persistSession(data.user, data.token);
      return { success: true, user: data.user, token: data.token };
    } catch {
      return { success: false, message: 'No se pudo conectar con el servidor' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await safeJson(response);
      if (!response.ok) {
        return { success: false, message: data?.message || 'No se pudo crear la cuenta' };
      }

      return { success: true, user: data };
    } catch {
      return { success: false, message: 'No se pudo conectar con el servidor' };
    }
  };

  const updateUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem('active_user', JSON.stringify(nextUser));
  };

  const logout = () => {
    localStorage.removeItem('active_user');
    localStorage.removeItem('auth_token');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading, // Exportamos loading
    login,
    register,
    updateUser,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
