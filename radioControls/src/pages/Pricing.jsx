import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap, Star, ShieldCheck, ArrowRight, HelpCircle, TrendingUp, Info, Sparkles, Headphones } from 'lucide-react';
import WaveCursor from '../components/WaveCursor';
import { useAuth } from '../components/AuthContext';

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handlePlanSelection = (planId) => {
    if (isAuthenticated) {
      navigate(`/checkout/${planId}`);
    } else {
      // Redirigir a registro, pero guardando la intención de compra
      navigate('/register', { state: { redirectTo: `/checkout/${planId}` } });
    }
  };

  const plans = [
    {
      id: 'basico',
      name: "Básico",
      price: "539",
      period: "/ mes",
      description: "Ideal para sucursales individuales que buscan profesionalizar su ambiente.",
      features: [
        "Acceso vía Link Sucursal",
        "Ingeniería de Audio Base",
        "Licencias AMPROFON",
        "Soporte vía Ticket",
        "Calidad Estándar"
      ],
      cta: "EMPEZAR AHORA",
      highlight: false,
      color: "from-slate-800 to-slate-900"
    },
    {
      id: 'profesional',
      name: "Profesional Anual",
      price: "5,390",
      period: "/ año",
      description: "Nuestra solución más popular. Maximiza tus ventas con ingeniería avanzada.",
      features: [
        "Todo lo del plan Mensual",
        "1 Mes Gratis Incluido",
        "Publicidad Personalizada",
        "Prioridad Técnica 24/7",
        "Calidad Ultra Premium",
        "Instalación Preferente"
      ],
      cta: "CONTRATAR ANUAL",
      highlight: true,
      badge: "EL MÁS ELEGIDO",
      color: "from-royal-blue to-royal-blue-dark"
    },
    {
      id: 'corporativo',
      name: "Corporativo",
      price: "Custom",
      period: "",
      description: "Para cadenas con más de 10 sucursales que requieren control total.",
      features: [
        "Todo lo del plan Profesional",
        "Panel Multi-Cuentas Pro",
        "API para Integraciones",
        "Gerente de Cuenta Dedicado",
        "Reportes de Audiencia Pro",
        "SLA Garantizado"
      ],
      cta: "CONTACTAR VENTAS",
      highlight: false,
      color: "from-purple-900/50 to-black"
    }
  ];

  return (
    <div className="pt-40 pb-24 px-4 min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <WaveCursor />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-black uppercase tracking-[0.3em] mb-8"
          >
            <Zap className="w-4 h-4" /> Inversión en Experiencia
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-8 tracking-tight uppercase leading-tight"
          >
            Planes de <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 italic pr-4">Alto Impacto</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Ingeniería de audio de élite con soporte técnico especializado 24/7 y resultados sonoros garantizados.
          </motion.p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              whileHover={{ y: -5 }}
              className={`relative rounded-[32px] p-0.5 ${plan.highlight ? 'bg-gradient-to-b from-neon-cyan to-neon-purple shadow-[0_0_40px_rgba(0,243,255,0.2)]' : 'bg-white/10'}`}
            >
              {plan.badge && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-neon-cyan to-neon-purple text-slate-950 px-6 py-2 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(0,243,255,0.4)] z-50 whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <div className={`rounded-[30px] p-8 h-full flex flex-col bg-gradient-to-b ${plan.color} backdrop-blur-xl relative overflow-hidden`}>

                <div className="mb-6 relative z-10">
                  <h3 className="text-xl font-black text-white uppercase mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    {plan.price !== "Custom" && <span className="text-lg font-bold text-gray-400">$</span>}
                    <span className="text-4xl md:text-5xl font-black text-white">{plan.price}</span>
                    <span className="text-gray-500 font-bold ml-1 text-sm">{plan.period}</span>
                  </div>
                  {plan.period === "/ año" && (
                    <p className="text-neon-cyan text-[10px] font-black mt-2 uppercase tracking-widest animate-pulse">¡1 Mes Gratis Incluido!</p>
                  )}
                </div>

                <p className="text-gray-400 text-xs mb-8 leading-relaxed font-medium relative z-10">
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8 flex-grow relative z-10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[11px] font-bold uppercase tracking-wider text-gray-300">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-neon-cyan' : 'text-gray-500'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handlePlanSelection(plan.id)}
                  className={`w-full py-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 group relative z-10 uppercase tracking-widest ${
                  plan.highlight 
                  ? 'bg-neon-cyan text-slate-950 hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]' 
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-slate-950'
                }`}>
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-1 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-[60px]"
        >
          <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[59px] p-12 md:p-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-neon-cyan/10" />
            
            <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
            <div className="w-40 h-40 bg-slate-950 rounded-[48px] flex items-center justify-center shrink-0 border border-white/5 shadow-2xl">
                <Headphones className="w-20 h-20 text-neon-cyan group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-none">Soporte <span className="text-neon-cyan italic">Elite 24/7</span></h2>
                <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-medium">
                  Nuestro equipo de ingenieros de audio monitorea tu señal en tiempo real para garantizar que tu marca nunca deje de sonar. Atención prioritaria inmediata.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Links */}
        <div className="mt-28 flex flex-wrap justify-center gap-12 border-t border-white/5 pt-16">
          <div className="flex items-center gap-3 text-slate-500 group cursor-pointer hover:text-white transition-all">
            <TrendingUp className="w-6 h-6 text-neon-cyan" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Casos de Éxito</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 group cursor-pointer hover:text-white transition-all">
            <Info className="w-6 h-6 text-neon-cyan" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Auditoría Sonora</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 group cursor-pointer hover:text-white transition-all">
            <HelpCircle className="w-6 h-6 text-neon-cyan" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Preguntas FAQ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;