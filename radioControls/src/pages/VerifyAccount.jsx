import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Radio, ArrowLeft } from 'lucide-react';
import AuthSplitLayout from '../components/AuthSplitLayout';
import { useAuth } from '../components/AuthContext';
import { apiFetch } from '../utils/apiFetch';

const VerifyAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token, updateUser } = useAuth();
  
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  // Usar el email del estado de navegación o del usuario logueado
  const email = location.state?.email || user?.email;

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('No se encontró un correo asociado. Inicia sesión primero.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const response = await apiFetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      }, token);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message || 'El código es incorrecto o ha expirado.');
        setStatus('error');
        return;
      }

      setStatus('success');
      
      // Actualizar el estado local si el usuario está logueado
      if (user) {
        updateUser({ ...user, isVerified: true });
      }

      setTimeout(() => {
        navigate(user ? '/dashboard' : '/login', { 
          state: { message: '¡Cuenta verificada exitosamente!' } 
        });
      }, 1500);
    } catch (err) {
      setError('Error de conexión con el servidor.');
      setStatus('error');
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !email || isResending) return;
    
    setIsResending(true);
    setError('');
    
    try {
      const response = await apiFetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }, token);

      if (response.ok) {
        setResendTimer(60); // 60 segundos de espera
        setStatus('idle');
      } else {
        const data = await response.json().catch(() => null);
        setError(data?.message || 'No se pudo reenviar el código.');
      }
    } catch (err) {
      setError('Error de conexión.');
    } finally {
      setIsResending(false);
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
          <div className="mb-6 p-4 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20">
            <ShieldCheck className="h-10 w-10 text-neon-cyan" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white">
            Verifica tu Cuenta
          </h2>
          <p className="mt-3 text-slate-400 font-medium">
            Ingresa el código de 6 dígitos que enviamos a <br />
            <span className="text-white font-bold">{email || 'tu correo'}</span>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-center block w-full mb-4">Código de Verificación</label>
            <div className="flex justify-center">
              <input
                type="text"
                maxLength="6"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full max-w-[240px] bg-slate-950 border-2 border-white/10 rounded-2xl py-5 text-center text-3xl font-black tracking-[0.5em] text-neon-cyan focus:border-neon-cyan/50 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {status === 'success' && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
              <p className="text-xs font-bold text-emerald-300 text-center">
                ¡Verificación exitosa! Redirigiendo...
              </p>
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
              disabled={status === 'loading' || code.length !== 6}
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-neon-cyan px-4 py-4 text-sm font-black text-slate-950 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:animate-shimmer" />
              <span className="relative">
                {status === 'loading' ? 'Verificando...' : 'Verificar Cuenta'}
              </span>
              {status !== 'loading' && <ArrowRight className="h-5 w-5 relative" />}
            </button>
          </div>
        </form>

        <div className="mt-10 text-center space-y-4">
          <p className="text-gray-500 text-sm font-bold">
            ¿No recibiste el código?{' '}
            <button 
              onClick={handleResend}
              disabled={resendTimer > 0 || isResending}
              className="text-neon-cyan hover:underline transition-colors disabled:text-slate-600 disabled:no-underline"
            >
              {resendTimer > 0 ? `Reenviar en ${resendTimer}s` : (isResending ? 'Enviando...' : 'Reenviar código')}
            </button>
          </p>
          <Link to="/login" className="inline-block text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  );
};

export default VerifyAccount;
