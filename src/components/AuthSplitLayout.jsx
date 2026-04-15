import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';

/* ─── Pulsating Background Decor ────────────────── */
const Aurora = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="animate-pulse absolute top-[20%] left-[-5%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-20"
      style={{ background: 'radial-gradient(circle, #00f3ff 0%, transparent 70%)', animationDuration: '3s' }} />
    <div className="animate-pulse absolute bottom-[15%] right-[-5%] w-[35vw] h-[35vw] rounded-full blur-[120px] opacity-15"
      style={{ background: 'radial-gradient(circle, #bc13fe 0%, transparent 70%)', animationDuration: '4s' }} />
    <div className="animate-pulse absolute top-1/2 left-0 w-[20vw] h-[20vw] rounded-full blur-[80px] opacity-10 bg-neon-cyan" 
      style={{ animationDuration: '1.5s' }} />
    <div className="animate-pulse absolute top-1/3 right-0 w-[15vw] h-[15vw] rounded-full blur-[80px] opacity-10 bg-neon-purple" 
      style={{ animationDuration: '2s' }} />
  </div>
);

const AuthSplitLayout = ({ children }) => {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Expertos';

  return (
    <div className="min-h-screen bg-void text-white relative overflow-hidden flex items-center justify-center">
      <Aurora />
      
      <div className="container max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[85vh] relative z-10 px-4">
        
        {/* Left Column: Premium Brand Messaging */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-center p-12 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-12">
              <img src="/img%20radio%20lea/logosinfondoradiolea.svg" alt="Radiolea Logo" className="h-12 w-auto drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]" />
              <div className="h-8 w-px bg-white/10" />
              <span className="font-display text-2xl uppercase tracking-tighter">Radiolea</span>
            </div>

            <h1 className="font-display text-6xl uppercase leading-[0.9] mb-8 tracking-tighter">
              Bienvenido, <br />
              <span className="text-neon-cyan italic">{firstName}</span>
            </h1>
            
            <p className="text-gray-400 text-lg font-light leading-relaxed mb-12 border-l-2 border-neon-purple pl-8">
              Tu portal de inteligencia sonora está listo. Gestiona tus sucursales y optimiza la atmósfera de tu negocio en tiempo real.
            </p>

            <div className="flex items-center gap-4 opacity-30">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-void bg-gray-800" />
                ))}
              </div>
              <p className="text-[9px] font-heading font-black uppercase tracking-[0.3em]">Red RadioleaControls</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Dynamic Form Container */}
        <div className="lg:col-span-7 flex items-center justify-center lg:p-12 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default AuthSplitLayout;
