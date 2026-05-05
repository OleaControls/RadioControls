import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, CheckCircle2, Headphones, RefreshCw, UserPlus, Store, Zap } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { apiFetch } from '../utils/apiFetch';

const Aurora = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="animate-pulse absolute top-[20%] left-[-5%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-20"
      style={{ background: 'radial-gradient(circle, #00f3ff 0%, transparent 70%)', animationDuration: '3s' }} />
    <div className="animate-pulse absolute top-[15%] right-[-5%] w-[35vw] h-[35vw] rounded-full blur-[120px] opacity-15"
      style={{ background: 'radial-gradient(circle, #bc13fe 0%, transparent 70%)', animationDuration: '4s' }} />
    <div className="animate-pulse absolute top-1/2 left-0 w-[20vw] h-[20vw] rounded-full blur-[80px] opacity-10 bg-neon-cyan"
      style={{ animationDuration: '1.5s' }} />
    <div className="animate-pulse absolute top-1/3 right-0 w-[15vw] h-[15vw] rounded-full blur-[80px] opacity-10 bg-neon-purple"
      style={{ animationDuration: '2s' }} />
  </div>
);

const plansData = {
  basico: {
    name: 'Plan Basico',
    price: '539',
    period: 'mensual',
    features: ['Acceso via Link Sucursal', 'Ingenieria de Audio Base', 'Soporte via Ticket'],
  },
  profesional: {
    name: 'Plan Profesional',
    price: '5,390',
    period: 'anual',
    features: ['Todo lo del plan Mensual', '1 Mes Gratis Incluido', 'Publicidad Personalizada', 'Prioridad Tecnica 24/7', 'Calidad Ultra Premium'],
  },
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const Checkout = () => {
  const { planId } = useParams();
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get('branchId');

  const navigate = useNavigate();
  const { user, token, login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [branchName, setBranchName] = useState('');
  const [branchSlug, setBranchSlug] = useState('');
  const [isRenewal, setIsRenewal] = useState(false);

  // Pasos del Checkout: 'account' (si no logueado), 'branch'
  const [currentStep, setCurrentStep] = useState(user ? 'branch' : 'account');

  // Estados para Registro (Paso 1)
  const [regData, setRegData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (user && currentStep === 'account') {
      setCurrentStep('branch');
    }
  }, [user, currentStep]);

  useEffect(() => {
    const fetchBranchData = async () => {
      if (!branchId || !token) return;
      try {
        const response = await apiFetch(`/api/branches/get-stream?branchId=${branchId}`, {}, token);
        const data = await response.json();
        if (response.ok) {
          setBranchName(data.branchName || '');
          setBranchSlug(data.slug || '');
          setIsRenewal(true);
        }
      } catch (err) {
        console.error("Error al cargar datos de sucursal:", err);
      }
    };
    fetchBranchData();
  }, [branchId, token]);

  const plan = plansData[planId];
  const stripePromise = useMemo(() => loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''), []);

  const handleRegisterNext = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Registrar usuario
      const regRes = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
      });

      const regDataRes = await regRes.json();
      if (!regRes.ok) {
        throw new Error(regDataRes.message || 'Error al crear cuenta');
      }

      // 2. Iniciar sesión automáticamente
      const loginResult = await authLogin(regData.email, regData.password);
      if (!loginResult.success) {
        throw new Error('Cuenta creada, pero no se pudo iniciar sesión. Por favor inicia sesión manualmente.');
      }

      setCurrentStep('branch');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (!plan) {
      setError('Plan no disponible');
      return;
    }
    if (!branchName.trim()) {
      setError('Ingresa el nombre de la sucursal');
      return;
    }
    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      setError('Falta configurar Stripe en el frontend');
      return;
    }

    const safeSlug = branchSlug.trim() ? slugify(branchSlug) : slugify(branchName);

    setIsLoading(true);
    try {
      const response = await apiFetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          branchName: branchName.trim(),
          branchSlug: safeSlug,
          userId: user?.id,
          email: user?.email,
          branchId: branchId || null,
        }),
      }, token);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.message || 'Error en el servidor al procesar el pago');
        setIsLoading(false);
        return;
      }

      if (!data?.url) {
        setError('No se pudo obtener la URL de pago de Stripe');
        setIsLoading(false);
        return;
      }

      // Redirigir directamente a la URL de Stripe Checkout
      window.location.href = data.url;

    } catch (err) {
      console.error("DETALLE ERROR CHECKOUT:", err);
      setError('Error de conexión con el servidor o Stripe');
      setIsLoading(false);
    }
  };

  if (planId === 'corporativo') {
    return (
      <div className="pt-40 pb-24 px-4 min-h-screen bg-void text-white relative overflow-hidden">
        <Aurora />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="relative bg-slate-900/60 border border-white/10 rounded-3xl p-10 backdrop-blur-2xl text-center shadow-2xl overflow-hidden">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-cyan/5 via-transparent to-purple-600/5 pointer-events-none" />
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Plan Corporativo</h2>
            <p className="text-slate-400 mb-8">Este plan se cotiza de forma personalizada. Nuestro equipo te contactara.</p>
            <button
              onClick={() => navigate('/contacto')}
              className="relative overflow-hidden bg-neon-cyan text-slate-950 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all duration-300 group"
            >
              <span className="relative z-10">Ir a Contacto</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="pt-40 pb-24 px-4 min-h-screen bg-void text-white relative overflow-hidden">
        <Aurora />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-10 backdrop-blur-2xl text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Plan no disponible</h2>
            <Link to="/planes" className="text-neon-cyan font-black uppercase tracking-widest text-xs hover:text-white transition-colors">Volver a Planes</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-24 px-4 min-h-screen bg-void text-white relative overflow-hidden">
      <Aurora />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <Link
          to="/planes"
          className="inline-flex items-center gap-2.5 mb-12 px-5 py-2.5 rounded-xl border border-white/8 bg-white/4 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 text-slate-400 hover:text-neon-cyan transition-all duration-300 font-black uppercase tracking-widest text-[10px] group backdrop-blur-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" />
          Volver a Planes
        </Link>

        {/* ── Step Indicator — circles with numbers ── */}
        <div className="flex items-center gap-3 mb-14 max-w-xs">
          {/* Step 1 */}
          <div className={`relative flex items-center justify-center w-9 h-9 rounded-full border-2 font-black text-sm transition-all duration-500 shrink-0 ${
            currentStep === 'account'
              ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.4)]'
              : 'border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan/50'
          }`}>
            {currentStep !== 'account' ? <CheckCircle2 className="w-4 h-4 text-neon-cyan" /> : '1'}
          </div>
          {/* Connector */}
          <div className="flex-1 h-px relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 rounded-full" />
            <div className={`absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan to-indigo-500 rounded-full transition-all duration-700 ${currentStep === 'branch' ? 'w-full' : 'w-0'}`} />
          </div>
          {/* Step 2 */}
          <div className={`flex items-center justify-center w-9 h-9 rounded-full border-2 font-black text-sm transition-all duration-500 shrink-0 ${
            currentStep === 'branch'
              ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.4)]'
              : 'border-white/15 bg-white/5 text-slate-600'
          }`}>
            2
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            {currentStep === 'account' ? 'Tu Cuenta' : 'Sucursal'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── Main Form Card ── */}
          <div className="lg:col-span-7 relative">
            {/* Animated border glow */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-neon-cyan/20 via-indigo-500/10 to-purple-600/15 blur-sm pointer-events-none" />
            <div className="relative bg-slate-900/70 border border-white/8 rounded-3xl p-8 md:p-12 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Inner shimmer top line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
              {/* Subtle inner glow top-right */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/4 blur-3xl rounded-full pointer-events-none -mr-32 -mt-32" />

              <AnimatePresence mode="wait">
                {currentStep === 'account' ? (
                  <motion.div
                    key="step-account"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="flex items-center gap-4 mb-10">
                      <div className="p-3 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20 shadow-[0_0_20px_rgba(0,243,255,0.15)]">
                        <UserPlus className="w-6 h-6 text-neon-cyan" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-neon-cyan tracking-[0.3em]">Paso 1 de 2</span>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Crea tu Cuenta</h2>
                      </div>
                    </div>

                    <form onSubmit={handleRegisterNext} className="space-y-7">
                      {/* Input: Nombre */}
                      <div className="group space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest transition-colors duration-300 group-focus-within:text-neon-cyan">Nombre Completo</label>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            value={regData.name}
                            onChange={(e) => setRegData({...regData, name: e.target.value})}
                            placeholder="Juan Pérez"
                            className="w-full bg-slate-950/80 border-0 border-b-2 border-white/10 rounded-t-lg py-4 px-4 focus:outline-none focus:border-neon-cyan transition-all duration-300 text-white placeholder:text-slate-700 focus:shadow-[0_4px_20px_-4px_rgba(0,243,255,0.2)]"
                          />
                          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-neon-cyan to-indigo-500 transition-all duration-500 group-focus-within:w-full rounded-full" />
                        </div>
                      </div>

                      {/* Input: Email */}
                      <div className="group space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest transition-colors duration-300 group-focus-within:text-neon-cyan">Correo Electrónico</label>
                        <div className="relative">
                          <input
                            required
                            type="email"
                            value={regData.email}
                            onChange={(e) => setRegData({...regData, email: e.target.value})}
                            placeholder="tu@email.com"
                            className="w-full bg-slate-950/80 border-0 border-b-2 border-white/10 rounded-t-lg py-4 px-4 focus:outline-none focus:border-neon-cyan transition-all duration-300 text-white placeholder:text-slate-700 focus:shadow-[0_4px_20px_-4px_rgba(0,243,255,0.2)]"
                          />
                          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-neon-cyan to-indigo-500 transition-all duration-500 group-focus-within:w-full rounded-full" />
                        </div>
                      </div>

                      {/* Input: Contraseña */}
                      <div className="group space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest transition-colors duration-300 group-focus-within:text-neon-cyan">Contraseña</label>
                        <div className="relative">
                          <input
                            required
                            type="password"
                            value={regData.password}
                            onChange={(e) => setRegData({...regData, password: e.target.value})}
                            placeholder="••••••••"
                            className="w-full bg-slate-950/80 border-0 border-b-2 border-white/10 rounded-t-lg py-4 px-4 focus:outline-none focus:border-neon-cyan transition-all duration-300 text-white placeholder:text-slate-700 focus:shadow-[0_4px_20px_-4px_rgba(0,243,255,0.2)]"
                          />
                          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-neon-cyan to-indigo-500 transition-all duration-500 group-focus-within:w-full rounded-full" />
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-xs font-bold text-red-400 text-center flex items-center justify-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                          {error}
                        </div>
                      )}

                      <div className="pt-4">
                        {/* CTA button with shimmer */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="relative w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-950 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,243,255,0.4)] active:scale-[0.98]"
                          style={{ background: 'linear-gradient(135deg, #00f3ff 0%, #6366f1 100%)' }}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-3">
                            {isLoading ? 'CREANDO CUENTA...' : 'SIGUIENTE: DATOS SUCURSAL'}
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </span>
                          {/* Shimmer overlay */}
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                        </button>
                        <p className="mt-6 text-center text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                          ¿Ya tienes cuenta? <Link to="/login" className="text-neon-cyan font-black hover:text-white transition-colors">Inicia Sesión</Link>
                        </p>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-branch"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20 shadow-[0_0_20px_rgba(0,243,255,0.15)]">
                          {isRenewal ? <RefreshCw className="w-6 h-6 text-neon-cyan animate-spin-slow" /> : <Store className="w-6 h-6 text-neon-cyan" />}
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase text-neon-cyan tracking-[0.3em]">{user ? 'Configuración' : 'Paso 2 de 2'}</span>
                          <h2 className="text-3xl font-black uppercase tracking-tighter">
                            {isRenewal ? 'Renovación de Sucursal' : 'Datos de la Sucursal'}
                          </h2>
                        </div>
                      </div>
                      {isRenewal && (
                        <span className="px-4 py-1.5 rounded-full bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,243,255,0.15)]">
                          MODO RENOVACIÓN
                        </span>
                      )}
                    </div>

                    <form onSubmit={handleCheckout} className="space-y-8">
                      {/* Input: Nombre Sucursal */}
                      <div className="group space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest transition-colors duration-300 group-focus-within:text-neon-cyan">Nombre de la Sucursal</label>
                        <div className="relative">
                          <input
                            required
                            type="text"
                            value={branchName}
                            onChange={(e) => setBranchName(e.target.value)}
                            disabled={isRenewal}
                            placeholder="Polanco - Corporativo"
                            className={`w-full bg-slate-950/80 border-0 border-b-2 border-white/10 rounded-t-lg py-4 px-4 focus:outline-none focus:border-neon-cyan transition-all duration-300 text-white font-medium placeholder:text-slate-700 focus:shadow-[0_4px_20px_-4px_rgba(0,243,255,0.2)] ${isRenewal ? 'opacity-50 cursor-not-allowed' : ''}`}
                          />
                          {!isRenewal && <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-neon-cyan to-indigo-500 transition-all duration-500 group-focus-within:w-full rounded-full" />}
                        </div>
                      </div>

                      {/* Input: Slug */}
                      <div className="group space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest transition-colors duration-300 group-focus-within:text-neon-cyan">Slug (opcional)</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={branchSlug}
                            onChange={(e) => setBranchSlug(e.target.value)}
                            disabled={isRenewal}
                            placeholder="polanco-corporativo"
                            className={`w-full bg-slate-950/80 border-0 border-b-2 border-white/10 rounded-t-lg py-4 px-4 focus:outline-none focus:border-neon-cyan transition-all duration-300 text-white font-medium placeholder:text-slate-700 focus:shadow-[0_4px_20px_-4px_rgba(0,243,255,0.2)] ${isRenewal ? 'opacity-50 cursor-not-allowed' : ''}`}
                          />
                          {!isRenewal && <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-neon-cyan to-indigo-500 transition-all duration-500 group-focus-within:w-full rounded-full" />}
                        </div>
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest">
                          {isRenewal ? 'El enlace de tu receptor no cambiará.' : 'Se usara para el link del receptor.'}
                        </p>
                      </div>

                      {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs font-bold text-red-400 text-center flex items-center justify-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                          {error}
                        </div>
                      )}

                      <div className="pt-6 space-y-4">
                        {/* CTA PAY button */}
                        <button
                          disabled={isLoading}
                          className="relative w-full py-6 rounded-2xl font-black text-xl uppercase tracking-tighter text-slate-950 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_0_60px_rgba(0,243,255,0.5)] active:scale-[0.98]"
                          style={{ background: 'linear-gradient(135deg, #00f3ff 0%, #6366f1 60%, #7c3aed 100%)' }}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-3">
                            {isLoading ? 'PROCESANDO...' : `PAGAR $${plan.price} MXN`}
                            {!isLoading && <ShieldCheck className="w-6 h-6" />}
                          </span>
                          {/* Shimmer */}
                          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                        </button>

                        {/* Stripe security badge */}
                        <div className="flex items-center justify-center gap-3 py-3 px-6 rounded-xl bg-slate-950/60 border border-white/5">
                          <Lock className="w-3 h-3 text-neon-cyan/70" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Pago 256-bit seguro con</span>
                          <div className="flex items-center gap-1 text-slate-400">
                            <CreditCard className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Stripe</span>
                          </div>
                          <ShieldCheck className="w-3 h-3 text-neon-cyan/70" />
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Bottom shimmer line */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            </div>
          </div>

          {/* ── Right Panel ── */}
          <div className="lg:col-span-5 space-y-6">

            {/* Order Summary Card — animated gradient border */}
            <div className="relative group">
              {/* Outer gradient border */}
              <div
                className="absolute -inset-[1.5px] rounded-3xl pointer-events-none animate-gradient"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,243,255,0.5), rgba(99,102,241,0.4), rgba(124,58,237,0.5), rgba(0,243,255,0.5))',
                  backgroundSize: '300% 300%',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: '1.5px',
                }}
              />
              <div className="relative bg-slate-900/80 rounded-3xl p-8 md:p-10 backdrop-blur-2xl overflow-hidden shadow-2xl">
                {/* Inner top line */}
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
                {/* Glow blob */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-neon-cyan/6 blur-3xl rounded-full -mr-24 -mt-24 pointer-events-none" />

                <div className="flex items-center gap-4 mb-8">
                  <img src="/img%20radio%20lea/logosinfondoradiolea.svg" alt="Radiolea Controls" className="h-10 w-auto object-contain" />
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Resumen del Pedido</p>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">{plan.name}</h3>
                  </div>
                </div>

                <div className="space-y-3.5 mb-10">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400 group/feat hover:text-white transition-colors duration-200">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center group-hover/feat:bg-neon-cyan/20 transition-colors duration-200">
                        <CheckCircle2 className="w-3 h-3 text-neon-cyan" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent mb-8" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    <span>Subtotal</span>
                    <span>${plan.price} MXN</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    <span>Impuestos (IVA)</span>
                    <span>Incluido</span>
                  </div>
                  <div className="flex justify-between items-end pt-5 border-t border-white/5">
                    <span className="text-sm font-black uppercase tracking-[0.15em] text-slate-300">Total hoy</span>
                    <div className="text-right">
                      <div
                        className="text-4xl font-black tracking-tighter"
                        style={{
                          background: 'linear-gradient(135deg, #00f3ff, #6366f1)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: 'drop-shadow(0 0 20px rgba(0,243,255,0.4))',
                        }}
                      >
                        ${plan.price}
                      </div>
                      <div className="text-[8px] font-black uppercase text-slate-600 tracking-widest">Pesos Mexicanos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="relative overflow-hidden rounded-3xl p-0.5"
              style={{ background: 'linear-gradient(135deg, rgba(0,243,255,0.25), rgba(99,102,241,0.2), rgba(124,58,237,0.25))' }}>
              <div className="relative bg-slate-900/90 rounded-[22px] p-7 flex gap-5 items-center overflow-hidden backdrop-blur-xl">
                {/* Glow behind headphones */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-neon-cyan/8 to-transparent pointer-events-none" />
                <div className="shrink-0 relative">
                  <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full" />
                  <div className="relative p-4 bg-slate-950 rounded-2xl border border-neon-cyan/20 shadow-[0_0_25px_rgba(0,243,255,0.2)]">
                    <Headphones className="w-7 h-7 text-neon-cyan" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-3 h-3 text-neon-cyan" />
                    <p className="text-[10px] font-black uppercase text-neon-cyan tracking-[0.2em]">Soporte Radiolea</p>
                  </div>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    Ingenieros de audio especializados disponibles con soporte tecnico 24/7.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
