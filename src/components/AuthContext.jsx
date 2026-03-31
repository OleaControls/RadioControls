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
  const [loading, setLoading] = useState(true);

  // Al iniciar, verificar la sesión con el servidor en lugar de confiar en localStorage
  useEffect(() => {
    const restoreSession = async () => {
      // Intentar restaurar desde caché local primero para evitar parpadeo de UI
      const cached = localStorage.getItem('active_user');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          localStorage.removeItem('active_user');
        }
      }

      // Validar que la cookie de sesión sigue siendo válida en el servidor
      try {
        const response = await fetch(`${API_BASE}/auth/me`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await safeJson(response);
          if (data?.user) {
            setUser(data.user);
            localStorage.setItem('active_user', JSON.stringify(data.user));
          } else {
            setUser(null);
            localStorage.removeItem('active_user');
          }
        } else {
          // La cookie expiró o es inválida — limpiar sesión local
          setUser(null);
          localStorage.removeItem('active_user');
        }
      } catch {
        // Sin conexión: mantener el caché local si existe
      }

      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await safeJson(response);
      if (!response.ok) {
        return { success: false, message: data?.message || 'No se pudo iniciar sesión' };
      }

      // El servidor establece la cookie httpOnly — solo guardamos los datos del usuario
      setUser(data.user);
      localStorage.setItem('active_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
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

  const logout = async () => {
    // Notificar al servidor para que limpie la cookie httpOnly
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Si falla la petición, igual limpiamos el estado local
    }
    localStorage.removeItem('active_user');
    setUser(null);
  };

  const value = {
    user,
    token: null, // Mantenido por compatibilidad — el token vive en la cookie httpOnly
    loading,
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
