import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ArrowRight, Star, ShieldCheck, Clock,
  Music2, Users, Headphones, TrendingUp, Info, HelpCircle,
  Store, Hotel, Dumbbell, UtensilsCrossed, ShoppingBag,
  Zap, Wifi, Megaphone, LayoutDashboard, Volume2, Calendar
} from 'lucide-react';
import { useAuth } from '../components/AuthContext';

/* ─── Aurora ─────────────────────────────────────── */
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

/* ─── Categories data ─────────────────────────────── */
const categories = [
  {
    id: 'plazas',
    label: 'Plazas Comerciales',
    shortLabel: 'Plazas',
    icon: Store,
    color: 'cyan',
    accent: '#00f3ff',
    description: 'Ambientes sonoros para locales en centros comerciales con alto tráfico de compradores.',
    monthly: {
      id: 'plazas-mensual',
      price: '899',
      features: [
        'Streaming Hi-Fi 320kbps',
        'Playlists por horario comercial',
        'Publicidad de temporada',
        'Monitoreo remoto básico',
        'Soporte vía ticket',
        'Acceso vía Link Sucursal',
      ],
    },
    annual: {
      id: 'plazas-anual',
      price: '8,990',
      savings: '1,798',
      features: [
        'Todo lo del plan Mensual',
        '2 Meses Gratis Incluidos',
        'Publicidad personalizada mensual',
        'Panel multi-zona completo',
        'Monitoreo en tiempo real',
        'Soporte prioritario 12 hrs / 7 días',
        'Instalación técnica preferente',
        'Reunión mensual de métricas',
      ],
    },
  },
  {
    id: 'hoteles',
    label: 'Hoteles',
    shortLabel: 'Hoteles',
    icon: Hotel,
    color: 'purple',
    accent: '#bc13fe',
    description: 'Experiencia sonora para lobby, restaurante, spa y áreas comunes del hotel.',
    monthly: {
      id: 'hoteles-mensual',
      price: '799',
      features: [
        'Streaming Hi-Fi 320kbps',
        'Zonas diferenciadas (lobby, spa, bar)',
        'Playlists por hora del día',
        'Spots de servicios internos',
        'Monitoreo remoto básico',
        'Soporte vía ticket',
      ],
    },
    annual: {
      id: 'hoteles-anual',
      price: '7,990',
      savings: '1,598',
      features: [
        'Todo lo del plan Mensual',
        '2 Meses Gratis Incluidos',
        'Hasta 5 zonas de audio',
        'Publicidad de paquetes y eventos',
        'Monitoreo en tiempo real',
        'Soporte prioritario 12 hrs / 7 días',
        'Instalación técnica preferente',
        'Reunión mensual de métricas',
      ],
    },
  },
  {
    id: 'gimnasios',
    label: 'Gimnasios',
    shortLabel: 'Gimnasios',
    icon: Dumbbell,
    color: 'green',
    accent: '#39ff14',
    description: 'Energía y ritmo para salas de cardio, pesas, clases grupales y recepción.',
    monthly: {
      id: 'gimnasios-mensual',
      price: '649',
      features: [
        'Streaming Hi-Fi 320kbps',
        'Playlists BPM por zona',
        'Diferenciación sala / recepción',
        'Spots de membresías y promos',
        'Monitoreo remoto básico',
        'Soporte vía ticket',
      ],
    },
    annual: {
      id: 'gimnasios-anual',
      price: '6,490',
      savings: '1,298',
      features: [
        'Todo lo del plan Mensual',
        '2 Meses Gratis Incluidos',
        'Zonas múltiples ilimitadas',
        'Campañas de inscripción automáticas',
        'Monitoreo en tiempo real',
        'Soporte prioritario 12 hrs / 7 días',
        'Instalación técnica preferente',
        'Reunión mensual de métricas',
      ],
    },
  },
  {
    id: 'restaurantes',
    label: 'Restaurantes',
    shortLabel: 'Restaurantes',
    icon: UtensilsCrossed,
    color: 'cyan',
    accent: '#00f3ff',
    description: 'Ambiente sonoro que alarga la estancia, aumenta el ticket promedio y refuerza tu marca.',
    monthly: {
      id: 'restaurantes-mensual',
      price: '539',
      features: [
        'Streaming Hi-Fi 320kbps',
        'Playlists por servicio (desayuno/comida/cena)',
        'Spots del menú del día',
        'Control de volumen remoto',
        'Monitoreo remoto básico',
        'Soporte vía ticket',
      ],
    },
    annual: {
      id: 'restaurantes-anual',
      price: '5,390',
      savings: '1,078',
      features: [
        'Todo lo del plan Mensual',
        '2 Meses Gratis Incluidos',
        'Publicidad de eventos especiales',
        'Zonas terraza / interior',
        'Monitoreo en tiempo real',
        'Soporte prioritario 12 hrs / 7 días',
        'Instalación técnica preferente',
        'Reunión mensual de métricas',
      ],
    },
  },
  {
    id: 'boutiques',
    label: 'Boutiques',
    shortLabel: 'Boutiques',
    icon: ShoppingBag,
    color: 'purple',
    accent: '#bc13fe',
    description: 'Música cuidada al detalle para tiendas de moda, accesorios y lifestyle que construyen identidad de marca.',
    monthly: {
      id: 'boutiques-mensual',
      price: '459',
      features: [
        'Streaming Hi-Fi 320kbps',
        'Playlists alineadas a tu marca',
        'Spots de colección y temporada',
        'Control de volumen remoto',
        'Monitoreo remoto básico',
        'Soporte vía ticket',
      ],
    },
    annual: {
      id: 'boutiques-anual',
      price: '4,590',
      savings: '918',
      features: [
        'Todo lo del plan Mensual',
        '2 Meses Gratis Incluidos',
        'Identidad sonora de marca',
        'Campañas de temporada auto-programadas',
        'Monitoreo en tiempo real',
        'Soporte prioritario 12 hrs / 7 días',
        'Instalación técnica preferente',
        'Reunión mensual de métricas',
      ],
    },
  },
];

/* ─── Color maps ──────────────────────────────────── */
const colorMap = {
  cyan: {
    text:        'text-neon-cyan',
    border:      'border-neon-cyan/30',
    borderHover: 'hover:border-neon-cyan',
    bg:          'bg-neon-cyan/10',
    shadow:      'shadow-[0_0_40px_rgba(0,243,255,0.15)]',
    shadowHover: 'hover:shadow-[0_0_50px_rgba(0,243,255,0.25)]',
    btn:         'bg-neon-cyan text-void hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]',
    btnOutline:  'border-neon-cyan/30 hover:bg-neon-cyan hover:text-void',
    glow:        'bg-neon-cyan',
    badge:       'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan',
  },
  purple: {
    text:        'text-neon-purple',
    border:      'border-neon-purple/30',
    borderHover: 'hover:border-neon-purple',
    bg:          'bg-neon-purple/10',
    shadow:      'shadow-[0_0_40px_rgba(188,19,254,0.15)]',
    shadowHover: 'hover:shadow-[0_0_50px_rgba(188,19,254,0.25)]',
    btn:         'bg-neon-purple text-void hover:shadow-[0_0_30px_rgba(188,19,254,0.4)]',
    btnOutline:  'border-neon-purple/30 hover:bg-neon-purple hover:text-void',
    glow:        'bg-neon-purple',
    badge:       'bg-neon-purple/10 border-neon-purple/20 text-neon-purple',
  },
  green: {
    text:        'text-neon-green',
    border:      'border-neon-green/30',
    borderHover: 'hover:border-neon-green',
    bg:          'bg-neon-green/10',
    shadow:      'shadow-[0_0_40px_rgba(57,255,20,0.15)]',
    shadowHover: 'hover:shadow-[0_0_50px_rgba(57,255,20,0.25)]',
    btn:         'bg-neon-green text-void hover:shadow-[0_0_30px_rgba(57,255,20,0.4)]',
    btnOutline:  'border-neon-green/30 hover:bg-neon-green hover:text-void',
    glow:        'bg-neon-green',
    badge:       'bg-neon-green/10 border-neon-green/20 text-neon-green',
  },
};

/* ─── Plan Card ───────────────────────────────────── */
const PlanCard = ({ plan, type, color, onSelect, isAnnual }) => {
  const c = colorMap[color];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      className={`relative group flex flex-col p-8 md:p-10 glass rounded-[2.5rem] overflow-hidden transition-all duration-500 border ${c.border} ${c.borderHover} ${c.shadow} ${c.shadowHover}`}
    >
      {/* Glow bg */}
      <div className={`absolute -inset-20 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none blur-[100px] ${c.glow}`} />

      {/* Badge */}
      {isAnnual && (
        <div className={`absolute top-6 right-6 px-3 py-1 rounded-full border text-[9px] font-heading font-bold uppercase tracking-widest ${c.badge}`}>
          Más Elegido
        </div>
      )}

      {/* Type label */}
      <div className="mb-6">
        <span className={`text-[9px] font-heading font-black uppercase tracking-[0.4em] ${c.text}`}>
          {isAnnual ? 'Plan Anual' : 'Plan Mensual'}
        </span>
        <div className="flex items-baseline gap-1 mt-3">
          <span className="text-lg font-light text-gray-500">$</span>
          <span className="text-5xl font-display text-white tracking-tighter">{plan.price}</span>
          <span className="text-gray-500 font-heading text-[10px] uppercase tracking-widest ml-1">
            {isAnnual ? '/ año' : '/ mes'}
          </span>
        </div>
        {isAnnual && (
          <p className={`text-[10px] font-heading font-bold mt-2 uppercase tracking-widest ${c.text}`}>
            Ahorras ${plan.savings} · 2 meses gratis
          </p>
        )}
        {!isAnnual && (
          <p className="text-gray-600 text-[10px] font-heading mt-2 uppercase tracking-widest">
            Sin anualidad · Cancela cuando quieras
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3.5 mb-10 flex-grow">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-[11px] font-heading font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-300 transition-colors">
            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${c.text}`} />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan.id)}
        className={`w-full py-4 rounded-full font-heading font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border ${
          isAnnual
            ? `${c.btn} border-transparent hover:scale-[1.02]`
            : `bg-white/5 text-white ${c.btnOutline}`
        }`}
      >
        {isAnnual ? 'Contratar Anual' : 'Empezar Mensual'}
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

/* ─── Main Component ──────────────────────────────── */
const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeIdx, setActiveIdx] = useState(0);

  const cat = categories[activeIdx];
  const c   = colorMap[cat.color];

  const handleSelect = (planId) => {
    navigate(`/checkout/${planId}`);
  };

  return (
    <div className="min-h-screen bg-void text-white selection:bg-neon-cyan/30 overflow-x-hidden relative">
      <Aurora />

      <div className="pt-32 pb-24 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">

          {/* ── Header ─────────────────────────────────── */}
          <div className="text-center mb-16 md:mb-20 px-4">
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
              Planes diseñados para{' '}
              <span className="text-neon-cyan italic">cada tipo de negocio</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed"
            >
              Elige tu categoría, selecciona mensual o anual y empieza a transformar la experiencia de tu cliente.
            </motion.p>
          </div>

          {/* ── Category Tabs ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              const isActive = i === activeIdx;
              const cm = colorMap[cat.color];
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveIdx(i)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border font-heading font-bold text-xs uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? `${cm.bg} ${cm.border} ${cm.text} shadow-[0_0_20px_rgba(0,0,0,0.3)]`
                      : 'bg-white/[0.03] border-white/10 text-gray-500 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? cm.text : 'text-gray-600'}`} />
                  <span className="hidden sm:inline">{cat.shortLabel}</span>
                </button>
              );
            })}
          </motion.div>

          {/* ── Category Description ─────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={cat.id + '-desc'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 mb-3">
                {React.createElement(cat.icon, { className: `w-5 h-5 ${c.text}` })}
                <h2 className={`font-display text-2xl md:text-3xl uppercase tracking-tight ${c.text}`}>
                  {cat.label}
                </h2>
              </div>
              <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">{cat.description}</p>
            </motion.div>
          </AnimatePresence>

          {/* ── Plan Cards ──────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={cat.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20 max-w-3xl mx-auto"
            >
              <PlanCard
                plan={cat.monthly}
                type="monthly"
                color={cat.color}
                onSelect={handleSelect}
                isAnnual={false}
              />
              <PlanCard
                plan={cat.annual}
                type="annual"
                color={cat.color}
                onSelect={handleSelect}
                isAnnual={true}
              />
            </motion.div>
          </AnimatePresence>

          {/* ── Contact CTA for Corporativo ─────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-[2.5rem] p-8 md:p-12 text-center mb-16 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/[0.06] rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/[0.04] rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <span className="text-[9px] font-heading font-black uppercase tracking-[0.45em] text-neon-purple">
                Cadenas y Corporativos
              </span>
              <h3 className="font-display text-2xl md:text-4xl uppercase mt-2 mb-4 leading-none">
                Más de 10 sucursales?{' '}
                <span className="text-neon-purple italic">Hablemos.</span>
              </h3>
              <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
                Planes personalizados, panel multi-cuentas, API de integración, gerente de cuenta dedicado y SLA garantizado.
              </p>
              <button
                onClick={() => navigate('/contacto')}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-heading font-black text-xs uppercase tracking-widest bg-white/5 border border-neon-purple/30 text-white hover:bg-neon-purple hover:text-void hover:shadow-[0_0_30px_rgba(188,19,254,0.4)] transition-all"
              >
                Contactar Ventas <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* ── Support Highlight ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[3rem] border border-white/[0.07] group mb-20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f3ff07] via-void to-[#bc13fe07]" />
            <div className="absolute -top-20 -right-20 w-[420px] h-[420px] bg-neon-cyan/10 rounded-full blur-[140px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            <div className="relative z-10 grid md:grid-cols-[1fr_280px] items-stretch">
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-6 w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan" />
                  </span>
                  <span className="text-[9px] font-heading font-bold uppercase tracking-[0.3em] text-neon-cyan">
                    Activo 24/7 · 12 hrs al día
                  </span>
                </div>

                <h2 className="font-display text-3xl md:text-4xl uppercase leading-none mb-5 tracking-tight">
                  Soporte <span className="text-neon-cyan italic">Preferencial</span>
                </h2>

                <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed max-w-2xl mb-10">
                  Música configurada a la medida, con licencia completa y sonido premium. Control del audio, mensajes publicitarios y asistencia 12 horas al día, los 7 días de la semana — diseñado específicamente para espacios comerciales.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: ShieldCheck, label: 'Soluciones rápidas y eficientes' },
                    { icon: Music2,      label: 'Streaming con sonido nítido' },
                    { icon: Users,       label: 'Alineado con mercadotecnia' },
                    { icon: Clock,       label: 'Asistencia 12 hrs · 7 días' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl px-4 py-3 hover:border-neon-cyan/20 transition-colors">
                      <Icon className="w-4 h-4 text-neon-cyan shrink-0" />
                      <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-gray-300">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden md:flex flex-col items-center justify-center gap-8 p-10 border-l border-white/[0.05]">
                <div className="relative">
                  <div className="absolute inset-0 bg-neon-cyan/20 rounded-[2rem] blur-2xl scale-110" />
                  <div className="relative w-28 h-28 rounded-[2rem] bg-void border border-neon-cyan/30 flex items-center justify-center shadow-[0_0_50px_rgba(0,243,255,0.2)] group-hover:shadow-[0_0_60px_rgba(0,243,255,0.35)] transition-shadow duration-700">
                    <Headphones className="w-14 h-14 text-neon-cyan" />
                  </div>
                </div>
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

          {/* ── Bottom info bar ─────────────────────────── */}
          <div className="flex flex-wrap justify-center gap-10 opacity-40 hover:opacity-100 transition-opacity">
            {[
              { icon: TrendingUp, label: 'Casos de Éxito' },
              { icon: Info,       label: 'Auditoría Sonora' },
              { icon: HelpCircle, label: 'Preguntas FAQ' },
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
