import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, ArrowRight, HelpCircle, TrendingUp, Info, Headphones, Activity, Star, Radio, ShieldCheck, Clock, Music2, Users } from 'lucide-react';
import WaveCursor from '../components/WaveCursor';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';

/* ─── Pulsating Background Decor ────────────────── */
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

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePlanSelection = (planId, isContact) => {
    if (isContact) {
      navigate('/contacto');
      return;
    }
    navigate(`/checkout/${planId}`);
  };

  const plans = [
    {
      id: 'basico',
      name: 'Básico',
      price: '539',
      period: '/ mes',
      description: 'Ideal para sucursales individuales que buscan profesionalizar su ambiente.',
      features: [
        'Acceso vía Link Sucursal',
        'Ingeniería de Audio Base',
        'Soporte vía Ticket',
        'Calidad Estándar'
      ],
      cta: 'Empezar Ahora',
      highlight: false,
      accent: 'white/10'
    },
    {
      id: 'profesional',
      name: 'Pro Anual',
      price: '5,390',
      period: '/ año',
      description: 'Nuestra solución más popular. Maximiza tus ventas con ingeniería avanzada.',
      features: [
        'Todo lo del plan Mensual',
        '1 Mes Gratis Incluido',
        'Publicidad Personalizada',
        'Prioridad Técnica 24/7',
        'Calidad Ultra Premium',
        'Instalación Preferente'
      ],
      cta: 'Contratar Anual',
      highlight: true,
      badge: 'Más Elegido',
      accent: 'neon-cyan'
    },
    {
      id: 'corporativo',
      name: 'Corporativo',
      price: 'Custom',
      period: '',
      description: 'Para cadenas con más de 10 sucursales que requieren control total.',
      features: [
        'Todo lo del plan Profesional',
        'Panel Multi-Cuentas Pro',
        'API para Integraciones',
        'Gerente de Cuenta Dedicado',
        'Reportes de Audiencia Pro',
        'SLA Garantizado'
      ],
      cta: 'Contactar Ventas',
      highlight: false,
      accent: 'neon-purple',
      isContact: true
    }
  ];

  return (
    <div className="min-h-screen bg-void text-white selection:bg-neon-cyan/30 overflow-x-hidden relative">
      <Aurora />

      <div className="pt-32 pb-24 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          
          {/* Header */}
          <div className="text-center mb-16 md:mb-24 px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm"
            >
              <Star className="w-3 h-3 text-neon-cyan" />
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-neon-cyan">
                Sonido ambiental Funcional único en México
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl uppercase leading-tight mb-6 tracking-tight"
            >
              Vivirás el estándar más alto en música para empresas,{' '}
              <span className="text-neon-cyan italic">respaldado por una atención al cliente inigualable.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg font-light leading-relaxed"
            >
              Obtienes servicio profesional, música curada de la mano con tu depto de mercadotecnia/ventas, alineamos tu visión comercial, cada mes nos reunimos para calibrar métricas.
            </motion.p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-6 mb-32 items-stretch px-4 sm:px-0">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative group flex flex-col p-8 md:p-10 glass rounded-[2.5rem] overflow-hidden transition-all duration-500 border ${
                  plan.id === 'basico' ? 'border-neon-green/20 hover:border-neon-green shadow-[0_0_40px_rgba(57,255,20,0.05)] hover:shadow-[0_0_40px_rgba(57,255,20,0.2)]' : 
                  plan.id === 'profesional' ? 'border-neon-cyan/20 hover:border-neon-cyan shadow-[0_0_40px_rgba(0,243,255,0.05)] hover:shadow-[0_0_40px_rgba(0,243,255,0.2)]' : 
                  'border-neon-purple/20 hover:border-neon-purple shadow-[0_0_40px_rgba(188,19,254,0.05)] hover:shadow-[0_0_40px_rgba(188,19,254,0.2)]'
                }`}
              >
                {/* Glow Effect Background */}
                <div className={`absolute -inset-20 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none blur-[100px] ${
                  plan.id === 'basico' ? 'bg-neon-green' : 
                  plan.id === 'profesional' ? 'bg-neon-cyan' : 
                  'bg-neon-purple'
                }`} />
                {plan.badge && (
                  <div className="absolute top-6 right-6 px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full text-[9px] font-heading font-bold uppercase tracking-widest text-neon-cyan">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="font-display text-2xl uppercase tracking-wider mb-4 text-gray-400 group-hover:text-white transition-colors">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    {plan.price !== 'Custom' && <span className="text-lg font-light text-gray-500">$</span>}
                    <span className="text-5xl font-display text-white tracking-tighter">{plan.price}</span>
                    <span className="text-gray-500 font-heading text-[10px] uppercase tracking-widest ml-1">{plan.period}</span>
                  </div>
                  {plan.id === 'profesional' && (
                    <p className="text-neon-cyan text-[9px] font-heading font-bold mt-2 uppercase tracking-widest">
                      1 Mes Gratis Incluido
                    </p>
                  )}
                </div>

                <p className="text-gray-500 text-xs leading-relaxed mb-10 font-light h-12">
                  {plan.description}
                </p>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[11px] font-heading font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-300 transition-colors">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                        plan.id === 'basico' ? 'text-neon-green' : 
                        plan.id === 'profesional' ? 'text-neon-cyan' : 
                        'text-neon-purple'
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan.id, plan.isContact)}
                  className={`w-full py-4 rounded-full font-heading font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                    plan.id === 'basico' ? 'bg-white/5 border border-white/10 text-white hover:bg-neon-green hover:text-void hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]' :
                    plan.id === 'profesional' ? 'bg-neon-cyan text-void hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:scale-[1.02]' :
                    'bg-white/5 border border-white/10 text-white hover:bg-neon-purple hover:text-void hover:shadow-[0_0_20px_rgba(188,19,254,0.4)]'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Support Highlight — Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] border border-white/[0.07] group"
          >
            {/* BG layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff07] via-void to-[#bc13fe07]" />
            <div className="absolute -top-20 -right-20 w-[420px] h-[420px] bg-neon-cyan/10 rounded-full blur-[140px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 grid md:grid-cols-[1fr_280px] items-stretch">
              {/* ── Left: Content ── */}
              <div className="p-10 md:p-14 flex flex-col justify-center">
                {/* Live badge */}
                <div className="flex items-center gap-2 mb-6 w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan" />
                  </span>
                  <span className="text-[9px] font-heading font-bold uppercase tracking-[0.3em] text-neon-cyan">Activo 24/7 · 12 hrs al día</span>
                </div>

                <h2 className="font-display text-3xl md:text-4xl uppercase leading-none mb-5 tracking-tight">
                  Soporte <span className="text-neon-cyan italic">Preferencial</span>
                </h2>

                <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-2xl mb-10">
                  Haz tuya la banda sonora perfecta con nuestro servicio de música para negocios en streaming, con licencia completa y sonido claro como el agua. Nosotros lo configuramos a la medida, tienes el control del audio, mensajes publicitarios y asistencia las 12 horas del día, los 7 días de la semana: todo ello diseñado específicamente para espacios comerciales.
                </p>

                {/* Feature badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: ShieldCheck, label: 'Licencias completas incluidas' },
                    { icon: Music2, label: 'Streaming con sonido nítido' },
                    { icon: Users, label: 'Alineado con mercadotecnia' },
                    { icon: Clock, label: 'Asistencia 12 hrs · 7 días' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 hover:border-neon-cyan/20 transition-colors">
                      <Icon className="w-4 h-4 text-neon-cyan shrink-0" />
                      <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-gray-300">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right: Visual panel ── */}
              <div className="hidden md:flex flex-col items-center justify-center gap-8 p-10 border-l border-white/[0.05]">
                {/* Icon glow card */}
                <div className="relative">
                  <div className="absolute inset-0 bg-neon-cyan/20 rounded-[2rem] blur-2xl scale-110" />
                  <div className="relative w-28 h-28 rounded-[2rem] bg-void border border-neon-cyan/30 flex items-center justify-center shadow-[0_0_50px_rgba(0,243,255,0.2)] group-hover:shadow-[0_0_60px_rgba(0,243,255,0.35)] transition-shadow duration-700">
                    <Headphones className="w-14 h-14 text-neon-cyan" />
                  </div>
                </div>

                {/* Stat pills */}
                <div className="flex flex-col gap-2 w-full">
                  {[
                    { value: '99.9%', label: 'Uptime' },
                    { value: '12 hrs', label: 'Soporte diario' },
                    { value: '7 días', label: 'Disponibilidad' },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-[9px] font-heading font-bold uppercase tracking-widest text-gray-500">{label}</span>
                      <span className="text-xs font-display text-neon-cyan">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Info Bar */}
          <div className="mt-24 flex flex-wrap justify-center gap-10 opacity-40 hover:opacity-100 transition-opacity">
            {[
              { icon: TrendingUp, label: "Casos de Éxito" },
              { icon: Info, label: "Auditoría Sonora" },
              { icon: HelpCircle, label: "Preguntas FAQ" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 cursor-pointer group">
                <item.icon className="w-4 h-4 text-neon-cyan" />
                <span className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] group-hover:text-neon-cyan transition-colors">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Pricing;

