import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CreditCard, Lock, ArrowLeft, CheckCircle2, Sparkles, Radio, Headphones, ArrowRight } from 'lucide-react';
import WaveCursor from '../components/WaveCursor';

const plansData = {
  'basico': {
    name: "Plan Básico",
    price: "539",
    period: "mensual",
    features: ["Acceso vía Link Sucursal", "Ingeniería de Audio Base", "Licencias AMPROFON", "Soporte vía Ticket"]
  },
  'profesional': {
    name: "Plan Profesional",
    price: "5,390",
    period: "anual",
    features: ["Todo lo del plan Mensual", "1 Mes Gratis Incluido", "Publicidad Personalizada", "Prioridad Técnica 24/7", "Calidad Ultra Premium"]
  },
  'corporativo': {
    name: "Plan Corporativo",
    price: "Custom",
    period: "anual",
    features: ["Todo lo del plan Profesional", "Panel Multi-Cuentas Pro", "API para Integraciones", "Gerente de Cuenta Dedicado"]
  }
};

const Checkout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  // Estados para el formulario
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const plan = plansData[planId] || plansData['profesional'];

  // Formateadores
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Solo números
    value = value.substring(0, 16); // Máximo 16 dígitos
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value; // Formato 0000 0000...
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 4);
    if (value.length > 2) {
      value = value.substring(0, 2) + ' / ' + value.substring(2);
    }
    setExpiry(value);
  };

  const handleCvcChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    setCvc(value.substring(0, 3)); // Máximo 3 dígitos
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Generar ID de orden aleatorio
    const newOrderId = 'RC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderId(newOrderId);

    // Simular procesamiento de pago
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
    }, 2000);
  };

  return (
    <div className="pt-40 pb-24 px-4 min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <WaveCursor />
      
      <AnimatePresence mode="wait">
        {showSuccess ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-slate-950"
          >
            {/* Partículas de Fondo Animadas */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                    y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: -100, 
                    opacity: [0, 0.5, 0],
                    rotate: 360
                  }}
                  transition={{ 
                    duration: Math.random() * 5 + 5, 
                    repeat: Infinity, 
                    delay: Math.random() * 5 
                  }}
                  className="absolute w-1 h-1 bg-neon-cyan rounded-full blur-[1px]"
                />
              ))}
            </div>

            {/* Resplandor Central */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/10 rounded-full blur-[160px] animate-pulse pointer-events-none" />

            <div className="max-w-4xl w-full px-6 relative z-10">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  className="w-32 h-32 bg-slate-900 border-2 border-neon-cyan rounded-[40px] flex items-center justify-center mx-auto mb-12 shadow-[0_0_60px_rgba(0,243,255,0.4)] relative group"
                >
                  <div className="absolute inset-0 bg-neon-cyan/20 rounded-[38px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Sparkles className="w-16 h-16 text-neon-cyan" />
                </motion.div>

                <motion.h2 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl md:text-8xl font-black mb-6 uppercase tracking-tight leading-none"
                >
                  Success <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-blue-500 italic pr-8">Confirmed</span>
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-400 text-xl md:text-2xl font-medium tracking-tight max-w-2xl mx-auto"
                >
                  Tu marca acaba de subir de nivel. El motor de ingeniería sonora ya está listo para tus sucursales.
                </motion.p>
              </div>

              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] text-center group hover:border-neon-cyan/30 transition-colors">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Orden ID</p>
                  <p className="text-xl font-black text-white uppercase tracking-tighter">{orderId}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] text-center group hover:border-neon-cyan/30 transition-colors">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Plan Activo</p>
                  <p className="text-xl font-black text-neon-cyan uppercase tracking-tighter">{plan.name}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] text-center group hover:border-neon-cyan/30 transition-colors">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Status</p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
                    <p className="text-xl font-black text-white uppercase tracking-tighter">Verified</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col items-center gap-8"
              >
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="relative px-16 py-6 bg-neon-cyan text-slate-950 rounded-2xl font-black text-xl overflow-hidden group hover:shadow-[0_0_50px_rgba(0,243,255,0.5)] transition-all hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <span className="relative flex items-center gap-3">
                    EXPLORAR DASHBOARD <ArrowRight />
                  </span>
                </button>
                
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
                  Redirigiendo automáticamente en 10 segundos...
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="checkout-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto relative z-10"
          >
            <Link 
              to="/planes" 
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 font-black uppercase tracking-widest text-xs"
            >
              <ArrowLeft className="w-4 h-4" /> Volver a Planes
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Formulario de Pago */}
              <div className="lg:col-span-7 bg-slate-900/40 border border-white/5 rounded-[48px] p-8 md:p-12 backdrop-blur-2xl shadow-2xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20">
                    <CreditCard className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter">Detalles de Pago</h2>
                </div>

                <form onSubmit={handlePayment} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Nombre en la Tarjeta</label>
                    <input 
                      required
                      type="text" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      placeholder="JUAN PÉREZ" 
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all text-white font-medium placeholder:text-slate-800" 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Número de Tarjeta</label>
                    <div className="relative">
                      <input 
                        required
                        type="text" 
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="0000 0000 0000 0000" 
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all text-white font-medium placeholder:text-slate-800" 
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                        <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[8px] font-black italic">VISA</div>
                        <div className="w-8 h-5 bg-slate-800 rounded flex items-center justify-center text-[8px] font-black italic">MC</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Vencimiento</label>
                      <input 
                        required
                        type="text" 
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM / YY" 
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all text-white font-medium placeholder:text-slate-800" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">CVC</label>
                      <input 
                        required
                        type="text" 
                        value={cvc}
                        onChange={handleCvcChange}
                        placeholder="000" 
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-8 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all text-white font-medium placeholder:text-slate-800" 
                      />
                    </div>
                  </div>

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
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Pago encriptado SSL de 256 bits</span>
                    </div>
                  </div>
                </form>
              </div>

              {/* Resumen del Pedido */}
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

                {/* Soporte 24/7 */}
                <div className="bg-gradient-to-br from-neon-cyan/10 to-blue-600/10 border border-neon-cyan/20 rounded-[40px] p-8 flex gap-6 items-center">
                  <div className="shrink-0 p-4 bg-slate-950 rounded-2xl shadow-xl">
                    <Headphones className="w-8 h-8 text-neon-cyan" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-neon-cyan tracking-[0.2em] mb-1">Soporte RadiOlea</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Contamos con un equipo de ingenieros de audio disponibles para ti con soporte técnico especializado 24/7.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
