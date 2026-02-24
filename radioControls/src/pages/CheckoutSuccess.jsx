import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import WaveCursor from '../components/WaveCursor';
import { useAuth } from '../components/AuthContext';
import { apiFetch } from '../utils/apiFetch';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('error');
      setError('No se encontro la sesion de pago');
      return;
    }

    const confirm = async () => {
      try {
        const response = await apiFetch(`/api/stripe/confirm-session?session_id=${encodeURIComponent(sessionId)}`, {}, token);
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          setStatus('error');
          setError(data?.message || 'No se pudo confirmar el pago');
          return;
        }
        setResult(data);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError('Error de conexion con el servidor');
      }
    };

    confirm();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex items-center justify-center px-6">
      <WaveCursor />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/10 rounded-full blur-[160px] animate-pulse pointer-events-none" />

      {status === 'loading' && (
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500 font-black mb-4">Verificando</div>
          <div className="text-2xl font-black uppercase tracking-tighter">Confirmando tu pago...</div>
        </div>
      )}

      {status === 'error' && (
        <div className="max-w-2xl w-full bg-slate-900/50 border border-white/10 rounded-[36px] p-10 backdrop-blur-xl text-center">
          <div className="text-red-400 text-xs uppercase tracking-[0.3em] font-black mb-4">Error</div>
          <div className="text-2xl font-black uppercase tracking-tighter mb-4">No se pudo confirmar</div>
          <p className="text-slate-400 mb-8">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-neon-cyan text-slate-950 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
          >
            Ir al Panel
          </button>
        </div>
      )}

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full relative z-10"
        >
          <div className="text-center mb-12">
            <div className="w-28 h-28 bg-slate-900 border-2 border-neon-cyan rounded-[36px] flex items-center justify-center mx-auto mb-10 shadow-[0_0_60px_rgba(0,243,255,0.4)]">
              <Sparkles className="w-14 h-14 text-neon-cyan" />
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tight leading-none">
              Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-blue-500 italic pr-4">Confirmed</span>
            </h2>
            <p className="text-slate-400 text-xl font-medium">
              Tu sucursal ya tiene un plan activo. En breve podras administrar el reproductor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[28px] text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Sucursal</p>
              <p className="text-lg font-black uppercase tracking-tighter">{result?.branch?.name || 'Sucursal'}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-[28px] text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Slug</p>
              <p className="text-lg font-black uppercase tracking-tighter">{result?.branch?.slug || '-'}</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-[28px] text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Status</p>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan" />
                <p className="text-lg font-black uppercase tracking-tighter">{result?.status || 'ACTIVE'}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="relative px-16 py-6 bg-neon-cyan text-slate-950 rounded-2xl font-black text-xl overflow-hidden group hover:shadow-[0_0_50px_rgba(0,243,255,0.5)] transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="relative flex items-center gap-3">
                IR AL DASHBOARD <ArrowRight />
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CheckoutSuccess;
