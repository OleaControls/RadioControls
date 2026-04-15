import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Radio, ArrowLeft } from 'lucide-react';
import AuthSplitLayout from '../components/AuthSplitLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');
  const [resetPath, setResetPath] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    setResetPath('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.message || 'No se pudo enviar el enlace');
        setStatus('error');
        return;
      }
      if (data?.resetPath) {
        setResetPath(data.resetPath);
      }
      setStatus('success');
    } catch (err) {
      setError('Error de conexión con el servidor');
      setStatus('error');
    }
  };

  return (
    <AuthSplitLayout>
      <Link 
        to="/" 
        className="fixed top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md shadow-xl transition-all duration-300 z-50"
      >
        <ArrowLeft className="h-4 w-4" /> Inicio
      </Link>
      <div className="bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_-12px_rgba(0,243,255,0.2)]">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="mb-6">
            <img src="/img%20radio%20lea/logosinfondoradiolea.svg" alt="Radiolea Controls" className="h-16 w-auto object-contain" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white">
            Recuperar Contraseña
          </h2>
          <p className="mt-3 text-slate-400 font-medium">
            Te enviaremos un enlace para restablecer tu acceso.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Correo Electrónico</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-neon-cyan">
                <Mail className="h-5 w-5 text-slate-500 transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-2xl bg-white/5 border-white/10 py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 transition-all duration-300"
                required
              />
            </div>
          </div>

          {status === 'success' && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
              <p className="text-xs font-bold text-emerald-300 text-center">
                Si el correo existe, recibirás un enlace de recuperación.
              </p>
            </div>
          )}
          {resetPath && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-[10px] font-bold text-slate-300 text-center uppercase tracking-widest mb-2">
                En desarrollo (enlace directo)
              </p>
              <div className="text-center">
                <Link to={resetPath} className="text-neon-cyan hover:text-white transition-colors text-sm font-bold">
                  Abrir enlace de recuperación
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-xs font-bold text-red-400 text-center">{error}</p>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-neon-cyan px-4 py-4 text-sm font-black text-slate-950 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:animate-shimmer" />
              <span className="relative">
                {status === 'loading' ? 'Enviando...' : 'Enviar Enlace'}
              </span>
              {status !== 'loading' && <ArrowRight className="h-5 w-5 relative" />}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm font-bold">
            ¿Recordaste tu contraseña?{' '}
            <Link to="/login" className="text-neon-cyan hover:text-white transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
};

export default ForgotPassword;
