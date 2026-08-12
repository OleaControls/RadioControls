import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ArrowRight, Star, ShieldCheck, Clock,
  Music2, Users, Headphones, TrendingUp, Info, HelpCircle,
  Store, Hotel, Dumbbell, UtensilsCrossed, ShoppingBag,
  Heart, TreePine, Sparkles, Phone, Gift,
} from 'lucide-react';

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
    id: 'tiendas',
    label: 'Tiendas Departamentales',
    shortLabel: 'Tiendas',
    icon: Store,
    color: 'cyan',
    description: 'Ambiente sonoro para tiendas departamentales con alto flujo de clientes y variedad de secciones.',
    plans: [
      {
        id: 'tiendas-pequena',
        label: 'Hasta 200 m²',
        annual: '25,329.16',
        monthly: '2,448.50',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
      {
        id: 'tiendas-grande',
        label: 'Más de 200 m²',
        annual: '40,869.16',
        monthly: '3,950.69',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
    ],
  },
  {
    id: 'boutiques',
    label: 'Boutiques',
    shortLabel: 'Boutiques',
    icon: ShoppingBag,
    color: 'purple',
    description: 'Música cuidada al detalle para tiendas de moda, accesorios y lifestyle que construyen identidad de marca.',
    plans: [
      {
        id: 'boutiques-plan',
        label: 'Hasta 40 m²',
        annual: '19,467.47',
        monthly: '1,881.89',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
    ],
  },
  {
    id: 'restaurantes',
    label: 'Restaurantes',
    shortLabel: 'Restaurantes',
    icon: UtensilsCrossed,
    color: 'cyan',
    description: 'Ambiente sonoro que alarga la estancia, aumenta el ticket promedio y refuerza tu marca.',
    plans: [
      {
        id: 'restaurantes-pequeno',
        label: '1 a 20 mesas',
        annual: '25,947.65',
        monthly: '2,508.33',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
      {
        id: 'restaurantes-grande',
        label: '41 mesas o más',
        annual: '42,109.25',
        monthly: '4,070.62',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
    ],
  },
  {
    id: 'fondas',
    label: 'Fondas',
    shortLabel: 'Fondas',
    icon: UtensilsCrossed,
    color: 'green',
    description: 'Ambiente sonoro acogedor y animado para fondas y comedores populares.',
    plans: [
      {
        id: 'fondas-plan',
        label: 'Plan Fondas',
        annual: '17,376.82',
        monthly: '1,679.79',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
    ],
  },
  {
    id: 'gimnasios',
    label: 'Gimnasios',
    shortLabel: 'Gimnasios',
    icon: Dumbbell,
    color: 'green',
    description: 'Energía y ritmo para salas de cardio, pesas, clases grupales y recepción.',
    plans: [
      {
        id: 'gimnasios-pequeno',
        label: '1 a 70 alumnos',
        annual: '20,560.46',
        monthly: '1,987.57',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
      {
        id: 'gimnasios-grande',
        label: 'Más de 70 alumnos',
        annual: '31,378.37',
        monthly: '3,033.32',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
    ],
  },
  {
    id: 'hospitales',
    label: 'Hospitales',
    shortLabel: 'Hospitales',
    icon: Heart,
    color: 'cyan',
    description: 'Ambiente sonoro reconfortante para hospitales y clínicas que mejora la experiencia del paciente.',
    plans: [
      {
        id: 'hospitales-pequeno',
        label: 'Hasta 50 habitaciones',
        annual: '28,411.26',
        monthly: '2,746.44',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
      {
        id: 'hospitales-grande',
        label: 'Más de 50 habitaciones',
        annual: '46,980.53',
        monthly: '4,541.48',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
    ],
  },
  {
    id: 'hoteles',
    label: 'Hoteles',
    shortLabel: 'Hoteles',
    icon: Hotel,
    color: 'purple',
    description: 'Experiencia sonora para lobby, restaurante, spa y áreas comunes del hotel.',
    plans: [
      {
        id: 'hoteles-1',
        label: '1 Estrella',
        annual: '17,376.83',
        monthly: '1,679.79',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
      {
        id: 'hoteles-2',
        label: '2 Estrellas',
        annual: '21,042.20',
        monthly: '2,448.50',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
      {
        id: 'hoteles-5',
        label: '5 Estrellas',
        annual: '119,873.49',
        monthly: '11,587.83',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
    ],
  },
  {
    id: 'salones',
    label: 'Salones de Fiestas',
    shortLabel: 'Salones',
    icon: Sparkles,
    color: 'purple',
    description: 'Ambiente festivo y entretenido para salones de fiestas infantiles y eventos especiales.',
    plans: [
      {
        id: 'salones-plan',
        label: 'Salón Infantil',
        annual: '23,212.62',
        monthly: '2,091.68',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
    ],
  },
  {
    id: 'jardines',
    label: 'Jardines de Eventos',
    shortLabel: 'Jardines',
    icon: TreePine,
    color: 'green',
    description: 'Sonido de calidad para jardines y espacios al aire libre para eventos y celebraciones.',
    plans: [
      {
        id: 'jardines-pequeno',
        label: 'Hasta 200 personas',
        annual: '30,727.76',
        monthly: '2,818.18',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
      {
        id: 'jardines-grande',
        label: 'Más de 200 personas',
        annual: '50,039.84',
        monthly: '4,684.96',
        features: [
          'Streaming Hi-Fi 320kbps',
          'Playlists por horario comercial',
          '8 spots mensuales',
          'Monitoreo en tiempo real',
          'Soporte prioritario 12 hrs / 7 días',
        ],
      },
    ],
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
    glow:        'bg-neon-green',
    badge:       'bg-neon-green/10 border-neon-green/20 text-neon-green',
  },
};

/* ─── Plan Card ───────────────────────────────────── */
const PlanCard = ({ plan, color, onContact }) => {
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

      {/* Plan label */}
      <div className="mb-6">
        <span className={`text-[9px] font-heading font-black uppercase tracking-[0.4em] ${c.text}`}>
          {plan.label}
        </span>

        {/* Annual price */}
        <div className="flex items-baseline gap-1 mt-3">
          <span className="text-lg font-light text-gray-500">$</span>
          <span className="text-5xl font-display text-white tracking-tighter">{plan.annual}</span>
          <span className="text-gray-500 font-heading text-[10px] uppercase tracking-widest ml-1">/ año</span>
        </div>

        {/* Monthly equivalent */}
        <p className={`text-[10px] font-heading font-bold mt-2 uppercase tracking-widest ${c.text}`}>
          ó ${plan.monthly} / mes
        </p>

        {/* Promo: 2 meses gratis al pagar el año */}
        <div className={`flex items-center gap-3 mt-5 rounded-2xl px-4 py-3 border ${c.bg} ${c.border}`}>
          <Gift className={`w-4 h-4 shrink-0 ${c.text}`} />
          <div className="leading-tight">
            <p className={`text-[11px] font-heading font-black uppercase tracking-[0.15em] ${c.text}`}>
              2 meses gratis
            </p>
            <p className="text-[9px] font-heading font-bold uppercase tracking-[0.2em] text-gray-500 mt-0.5">
              De servicio al pagar el año
            </p>
          </div>
        </div>
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
        onClick={onContact}
        className={`w-full py-4 rounded-full font-heading font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-transparent hover:scale-[1.02] ${c.btn}`}
      >
        <Phone className="w-4 h-4" />
        Contactar
      </button>
    </motion.div>
  );
};

/* ─── Main Component ──────────────────────────────── */
const Pricing = () => {
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);

  const cat = categories[activeIdx];
  const c   = colorMap[cat.color];

  const handleContact = () => {
    navigate('/contacto');
  };

  const gridCols = cat.plans.length === 1
    ? 'grid-cols-1 max-w-sm'
    : cat.plans.length === 2
    ? 'grid-cols-1 md:grid-cols-2 max-w-3xl'
    : 'grid-cols-1 md:grid-cols-3 max-w-5xl';

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
              Elige tu categoría, conoce el precio de tu plan y contáctanos para comenzar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2.5 mt-6 px-5 py-3 rounded-full bg-neon-green/10 border border-neon-green/25"
            >
              <Gift className="w-4 h-4 text-neon-green shrink-0" />
              <span className="text-[11px] sm:text-xs font-heading font-bold uppercase tracking-[0.2em] text-neon-green">
                2 meses gratis de servicio al pagar el año
              </span>
            </motion.div>
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
              className={`grid ${gridCols} gap-6 md:gap-8 mb-20 mx-auto`}
            >
              {cat.plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  color={cat.color}
                  onContact={handleContact}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── Contact CTA ─────────────────────────────── */}
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
                ¿Más de 10 sucursales?{' '}
                <span className="text-neon-purple italic">Hablemos.</span>
              </h3>
              <p className="text-gray-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
                Planes personalizados, panel multi-cuentas, gerente de cuenta dedicado y SLA garantizado.
              </p>
              <button
                onClick={() => navigate('/contacto')}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-heading font-black text-xs uppercase tracking-widest bg-white/5 border border-neon-purple/30 text-white hover:bg-neon-purple hover:text-void hover:shadow-[0_0_30px_rgba(188,19,254,0.4)] transition-all"
              >
                <Phone className="w-4 h-4" />
                Contactar Ventas
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
