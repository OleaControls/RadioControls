import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Datos iniciales de prueba (puedes editarlos aquí mismo)
const DEFAULT_USERS = [
  {
    id: 'demo-1',
    name: 'Admin Demo',
    email: 'demo@radiocontrols.mx',
    password: 'password123',
    role: 'ADMIN'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [localUsers, setLocalUsers] = useState(() => {
    const saved = localStorage.getItem('local_db_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  // Persistir usuarios locales
  useEffect(() => {
    localStorage.setItem('local_db_users', JSON.stringify(localUsers));
  }, [localUsers]);

  // Cargar sesión al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('active_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setToken('mock-jwt-token-' + parsed.id);
    }
  }, []);

  // Función de Login Local
  const login = (email, password) => {
    const foundUser = localUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setToken('mock-jwt-token-' + foundUser.id);
      localStorage.setItem('active_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, message: 'Credenciales incorrectas' };
  };

  // Función de Registro Local
  const register = (userData) => {
    const exists = localUsers.find(u => u.email === userData.email);
    if (exists) return { success: false, message: 'El correo ya está registrado' };
    
    const newUser = {
      ...userData,
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      role: 'CLIENT'
    };
    
    setLocalUsers(prev => [...prev, newUser]);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('active_user');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
