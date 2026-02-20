import React from 'react';
import { Radio } from 'lucide-react';
import WaveCursor from './WaveCursor';
import { useAuth } from './AuthContext';

const AuthSplitLayout = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Clientes';

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Ondas interactivas de fondo */}
      <WaveCursor />
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-screen">
        
        {/* Columna Izquierda (Decorativa) - Oculta en móvil para priorizar el login */}
        <div className="relative hidden h-full flex-col justify-between p-12 text-white md:flex bg-royal-blue/20 backdrop-blur-sm border-r border-white/10">
          <div className="absolute inset-0 bg-grid-white/[0.02] z-0"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                  <Radio className="h-8 w-8 text-neon-cyan" />
                </div>
                <span className="text-2xl font-black tracking-tighter">RadioControls</span>
              </div>
              
              <div className="mt-20">
                <h1 className="text-5xl font-bold tracking-tight leading-tight">
                  Hello, <br />
                  <span className="text-neon-cyan uppercase">{firstName} 👋</span>
                </h1>
                <p className="mt-6 max-w-md text-xl text-blue-100/80 font-light leading-relaxed">
                  Gestiona tu audio, analiza el comportamiento de tus clientes y eleva la experiencia de tu marca a un nuevo nivel.
                </p>
              </div>
            </div>

            <footer className="relative z-10 text-sm text-blue-200/60 font-medium">
              © 2026 RadioControls S.A. de C.V.
            </footer>
          </div>
        </div>

        {/* Columna Derecha (Contenido del Formulario) */}
        <div className="flex items-center justify-center p-6 sm:p-12 relative">
          <div className="w-full max-w-md relative z-10">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthSplitLayout;
