import React, { useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, CheckCircle2, Radio, Headphones } from 'lucide-react';
import WaveCursor from '../components/WaveCursor';
import { useAuth } from '../components/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { apiFetch } from '../utils/apiFetch';

const plansData = {
  basico: {
    name: 'Plan Basico',
    price: '539',
    period: 'mensual',
    features: ['Acceso via Link Sucursal', 'Ingenieria de Audio Base', 'Licencias AMPROFON', 'Soporte via Ticket'],
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
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [branchName, setBranchName] = useState('');
  const [branchSlug, setBranchSlug] = useState('');

  const plan = plansData[planId];
  const stripePromise = useMemo(() => loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''), []);

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
        }),
      }, token);

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.id) {
        setError(data?.message || 'No se pudo iniciar el pago');
        setIsLoading(false);
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        setError('Stripe no esta disponible');
        setIsLoading(false);
        return;
      }

      const result = await stripe.redirectToCheckout({ sessionId: data.id });
      if (result.error) {
        setError(result.error.message || 'No se pudo redirigir a Stripe');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Error de conexion con el servidor');
      setIsLoading(false);
    }
  };

  if (planId === 'corporativo') {
    return (
      <div className="pt-40 pb-24 px-4 min-h-screen bg-slate-950 text-white relative overflow-hidden">
        <WaveCursor />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Plan Corporativo</h2>
            <p className="text-slate-400 mb-8">Este plan se cotiza de forma personalizada. Nuestro equipo te contactara.</p>
            <button
              onClick={() => navigate('/contacto')}
              className="bg-neon-cyan text-slate-950 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
            >
              Ir a Contacto
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="pt-40 pb-24 px-4 min-h-screen bg-slate-950 text-white relative overflow-hidden">
        <WaveCursor />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl text-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Plan no disponible</h2>
            <Link to="/planes" className="text-neon-cyan font-black uppercase tracking-widest text-xs">Volver a Planes</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-24 px-4 min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <WaveCursor />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto relative z-10"
      >
        <Link
          to="/planes"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 font-black uppercase tracking-widest text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Planes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 bg-slate-900/40 border border-white/5 rounded-[48px] p-8 md:p-12 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20">
                <CreditCard className="w-6 h-6 text-neon-cyan" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Datos de la Sucursal</h2>
            </div>

            <form onSubmit={handleCheckout} className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Nombre de la Sucursal</label>
                <input
                  required
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Polanco - Corporativo"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all text-white font-medium placeholder:text-slate-800"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Slug (opcional)</label>
                <input
                  type="text"
                  value={branchSlug}
                  onChange={(e) => setBranchSlug(e.target.value)}
                  placeholder="polanco-corporativo"
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all text-white font-medium placeholder:text-slate-800"
                />
                <p className="text-[10px] text-slate-500 uppercase tracking-widest ml-4">
                  Se usara para el link del receptor.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  <p className="text-xs font-bold text-red-400 text-center">{error}</p>
                </div>
              )}

              <div className="pt-6">
                <button
                  disabled={isLoading}
                  className="w-full py-6 bg-neon-cyan text-slate-950 rounded-[24px] font-black text-xl hover:shadow-[0_0_50px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-3 active:scale-[0.98] uppercase tracking-tighter group disabled:opacity-50"
                >
                  {isLoading ? 'PROCESANDO...' : `PAGAR $${plan.price} MXN`}
                  {!isLoading && <ShieldCheck className="w-6 h-6" />}
                </button>
                <div className="flex items-center justify-center gap-2 mt-6 text-slate-500">
                  <Lock className="w-3 h-3" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pago seguro con Stripe</span>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-900/40 border border-white/5 rounded-[48px] p-10 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 blur-3xl rounded-full -mr-16 -mt-16" />

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-slate-950 rounded-2xl border border-white/5">
                  <Radio className="w-6 h-6 text-neon-cyan" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Resumen del Pedido</p>
                  <h3 className="text-2xl font-black uppercase tracking-tighter">{plan.name}</h3>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-neon-cyan" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="h-px w-full bg-white/5 mb-8" />

              <div className="space-y-4">
                <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  <span>Subtotal</span>
                  <span>${plan.price} MXN</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                  <span>Impuestos (IVA)</span>
                  <span>Incluido</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-white">Total hoy</span>
                  <div className="text-right">
                    <div className="text-3xl font-black text-neon-cyan tracking-tighter">${plan.price}</div>
                    <div className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Precios en Pesos Mexicanos</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-neon-cyan/10 to-blue-600/10 border border-neon-cyan/20 rounded-[40px] p-8 flex gap-6 items-center">
              <div className="shrink-0 p-4 bg-slate-950 rounded-2xl shadow-xl">
                <Headphones className="w-8 h-8 text-neon-cyan" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-neon-cyan tracking-[0.2em] mb-1">Soporte RadiOlea</p>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Equipo de ingenieros de audio disponibles con soporte tecnico especializado 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
