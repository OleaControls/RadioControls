import React from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeProvider';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
};
