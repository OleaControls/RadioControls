import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Radio } from 'lucide-react';

const AccessDenied = () => {
  const location = useLocation();
  const from = location.state?.from;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="relative w-full max-w-2xl rounded-[36px] border border-white/10 bg-slate-900/50 backdrop-blur-xl p-10 shadow-[0_0_60px_-20px_rgba(0,243,255,0.3)]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(0,243,255,0.08),transparent_55%)] rounded-[36px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-neon-cyan text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(0,243,255,0.4)]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-neon-cyan font-black">Acceso</p>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Acceso Denegado</h1>
            </div>
          </div>

          <p className="text-slate-400 font-medium mb-6">
            Tu cuenta no tiene permisos para ver esta seccion.
          </p>
          {from && (
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-8">
              Ruta solicitada: {from}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <Home className="w-4 h-4" /> Ir al Inicio
            </Link>
            <Link
              to="/dashboard"
              className="flex-1 flex items-center justify-center gap-2 bg-neon-cyan text-slate-950 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all"
            >
              <Radio className="w-4 h-4" /> Ir al Panel
            </Link>
            <Link
              to="/login"
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Iniciar Sesion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
