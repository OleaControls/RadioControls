import React from 'react';
import { motion } from 'framer-motion';

const Aurora = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="animate-pulse absolute top-[20%] left-[-5%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-20"
      style={{ background: 'radial-gradient(circle, #00f3ff 0%, transparent 70%)', animationDuration: '3s' }} />
    <div className="animate-pulse absolute top-[15%] right-[-5%] w-[35vw] h-[35vw] rounded-full blur-[120px] opacity-15"
      style={{ background: 'radial-gradient(circle, #bc13fe 0%, transparent 70%)', animationDuration: '4s' }} />
    <div className="animate-pulse absolute bottom-[10%] left-[30%] w-[25vw] h-[25vw] rounded-full blur-[120px] opacity-10"
      style={{ background: 'radial-gradient(circle, #ffd700 0%, transparent 70%)', animationDuration: '6s' }} />
  </div>
);

/* ── SVG Illustrations ── */

const IconWallSpeakers = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="6" y="14" width="28" height="50" rx="3" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.05" />
    <circle cx="20" cy="35" r="9" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1" />
    <circle cx="20" cy="35" r="4" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.3" />
    <circle cx="20" cy="35" r="1.5" fill={color} />
    <circle cx="20" cy="52" r="4" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.15" />
    <circle cx="20" cy="52" r="1.5" fill={color} fillOpacity="0.6" />
    <rect x="46" y="14" width="28" height="50" rx="3" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.05" />
    <circle cx="60" cy="35" r="9" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1" />
    <circle cx="60" cy="35" r="4" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.3" />
    <circle cx="60" cy="35" r="1.5" fill={color} />
    <circle cx="60" cy="52" r="4" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.15" />
    <circle cx="60" cy="52" r="1.5" fill={color} fillOpacity="0.6" />
    <path d="M36 30 Q40 35 36 42" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
    <path d="M44 30 Q40 35 44 42" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
  </svg>
);

const IconCeilingSpeaker = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="8" y="8" width="64" height="64" rx="4" stroke={color} strokeWidth="0.8" opacity="0.15" />
    {[
      [22, 26], [40, 26], [58, 26],
      [22, 54], [40, 54], [58, 54],
    ].map(([cx, cy], i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r="9" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.06" />
        <circle cx={cx} cy={cy} r="5" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.15" />
        <circle cx={cx} cy={cy} r="2" fill={color} fillOpacity="0.7" />
      </g>
    ))}
  </svg>
);

const IconTrio = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="10" y="52" width="60" height="20" rx="3" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.05" />
    <circle cx="40" cy="62" r="8" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.1" />
    <circle cx="40" cy="62" r="3" fill={color} fillOpacity="0.5" />
    <rect x="14" y="30" width="52" height="16" rx="2" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.06" />
    <circle cx="28" cy="38" r="4" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.15" />
    <circle cx="28" cy="38" r="1.5" fill={color} fillOpacity="0.7" />
    <rect x="36" y="34" width="24" height="2.5" rx="1.25" fill={color} fillOpacity="0.3" />
    <rect x="36" y="38.5" width="16" height="2.5" rx="1.25" fill={color} fillOpacity="0.2" />
    <rect x="18" y="8" width="44" height="18" rx="3" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.05" />
    <circle cx="40" cy="17" r="7" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.1" />
    <circle cx="40" cy="17" r="3" fill={color} fillOpacity="0.4" />
    <circle cx="40" cy="17" r="1" fill={color} />
  </svg>
);

const IconWave = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="8" y="12" width="32" height="56" rx="4" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.05" />
    <circle cx="24" cy="37" r="12" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.08" />
    <circle cx="24" cy="37" r="6" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.2" />
    <circle cx="24" cy="37" r="2.5" fill={color} fillOpacity="0.7" />
    <circle cx="24" cy="55" r="5" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.1" />
    <circle cx="24" cy="55" r="2" fill={color} fillOpacity="0.5" />
    <path d="M46 28 Q53 37 46 46" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M54 22 Q63 37 54 52" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
    <path d="M62 16 Q73 37 62 58" stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.3" />
  </svg>
);

const IconFire = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {[
      [16, 18], [52, 18],
      [16, 52], [52, 52],
    ].map(([cx, cy], i) => (
      <g key={i}>
        <rect x={cx - 10} y={cy - 10} width="20" height="24" rx="2.5" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.05" />
        <circle cx={cx} cy={cy + 2} r="7" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.1" />
        <circle cx={cx} cy={cy + 2} r="3" fill={color} fillOpacity="0.4" />
        <circle cx={cx} cy={cy + 2} r="1" fill={color} />
      </g>
    ))}
    <path d="M34 34 L46 46" stroke={color} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
    <path d="M46 34 L34 46" stroke={color} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
    <circle cx="40" cy="40" r="4" fill={color} fillOpacity="0.2" />
    <circle cx="40" cy="40" r="1.5" fill={color} fillOpacity="0.8" />
  </svg>
);

const IconProSpeaker = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="16" y="8" width="48" height="64" rx="5" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.05" />
    <circle cx="40" cy="35" r="18" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.07" />
    <circle cx="40" cy="35" r="11" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.12" />
    <circle cx="40" cy="35" r="5" stroke={color} strokeWidth="1" fill={color} fillOpacity="0.3" />
    <circle cx="40" cy="35" r="2" fill={color} fillOpacity="0.8" />
    <circle cx="40" cy="60" r="6" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.15" />
    <circle cx="40" cy="60" r="2.5" fill={color} fillOpacity="0.5" />
    <rect x="22" y="13" width="8" height="3" rx="1.5" fill={color} fillOpacity="0.3" />
    <rect x="50" y="13" width="8" height="3" rx="1.5" fill={color} fillOpacity="0.3" />
  </svg>
);

const IconDynamic = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="22" y="16" width="36" height="48" rx="4" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.05" />
    <circle cx="40" cy="38" r="14" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.08" />
    <circle cx="40" cy="38" r="7" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.2" />
    <circle cx="40" cy="38" r="3" fill={color} fillOpacity="0.65" />
    <circle cx="40" cy="56" r="5" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.15" />
    <circle cx="40" cy="56" r="2" fill={color} fillOpacity="0.5" />
    <path d="M10 20 L18 28" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M10 38 L18 38" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M10 56 L18 48" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M70 20 L62 28" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M70 38 L62 38" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M70 56 L62 48" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
  </svg>
);

const IconExplode = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="40" cy="40" r="35" stroke={color} strokeWidth="0.7" opacity="0.18" />
    <circle cx="40" cy="40" r="27" stroke={color} strokeWidth="0.9" opacity="0.32" />
    <circle cx="40" cy="40" r="19" stroke={color} strokeWidth="1.2" opacity="0.5" />
    <circle cx="40" cy="40" r="12" stroke={color} strokeWidth="1.5" opacity="0.72" fill={color} fillOpacity="0.07" />
    <circle cx="40" cy="40" r="6" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.2" />
    <circle cx="40" cy="40" r="2.5" fill={color} fillOpacity="0.9" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 40 + Math.cos(rad) * 13;
      const y1 = 40 + Math.sin(rad) * 13;
      const x2 = 40 + Math.cos(rad) * 35;
      const y2 = 40 + Math.sin(rad) * 35;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.7" opacity="0.35" />;
    })}
  </svg>
);

const IconCrown = ({ color }) => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M10 54 L10 28 L26 44 L40 10 L54 44 L70 28 L70 54 Z"
      stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1" strokeLinejoin="round" />
    <rect x="8" y="54" width="64" height="10" rx="2.5" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.15" />
    <circle cx="40" cy="30" r="4.5" fill={color} fillOpacity="0.75" />
    <circle cx="18" cy="47" r="3" fill={color} fillOpacity="0.55" />
    <circle cx="62" cy="47" r="3" fill={color} fillOpacity="0.55" />
    <circle cx="40" cy="67" r="2" fill={color} fillOpacity="0.8" />
    <circle cx="26" cy="67" r="1.5" fill={color} fillOpacity="0.5" />
    <circle cx="54" cy="67" r="1.5" fill={color} fillOpacity="0.5" />
  </svg>
);

/* ── Package Data ── */

const packages = [
  {
    id: 'solo-bafle',
    name: 'Solo Bafle',
    subtitle: 'AudioPack Pro S4',
    components: ['4 Bafles de pared', 'White Bose'],
    price: 28400,
    color: '#00f3ff',
    tier: 1,
    Icon: IconWallSpeakers,
  },
  {
    id: 'plafon-pro',
    name: 'Plafón Pro',
    subtitle: 'AudioPack Pro C6',
    components: ['6 Bafles de plafón', 'White Bose'],
    price: 31500,
    color: '#38bdf8',
    tier: 2,
    Icon: IconCeilingSpeaker,
  },
  {
    id: 'sonrie',
    name: 'SONRÍE',
    subtitle: 'Sonovides Asaji',
    components: ['Amplificador Asaji', 'Subwoofer Speakercraft'],
    price: 44818,
    color: '#facc15',
    tier: 3,
    Icon: IconTrio,
  },
  {
    id: 'vibra',
    name: 'VIBRA',
    subtitle: 'Bafle Fonestar',
    components: ['Amplificador Bose', 'Subwoofer Speakercraft'],
    price: 50595,
    color: '#fb923c',
    tier: 4,
    Icon: IconWave,
  },
  {
    id: 'enciende',
    name: 'ENCIENDE',
    subtitle: '4 Bafles O66',
    components: ['Amplificador Bose Pro', 'Subwoofer Speakercraft'],
    price: 55117,
    color: '#f97316',
    tier: 5,
    Icon: IconFire,
  },
  {
    id: 'impulsa',
    name: 'IMPULSA',
    subtitle: 'Bafles JBL Pro',
    components: ['Amplificador Bose', 'Subwoofer JBL'],
    price: 59231,
    color: '#bc13fe',
    tier: 6,
    Icon: IconProSpeaker,
  },
  {
    id: 'dinamiza',
    name: 'DINAMIZA',
    subtitle: 'Bafle Tru',
    components: ['Amplificador Bose', 'Subwoofer TruAudio'],
    price: 69383,
    color: '#a78bfa',
    tier: 7,
    Icon: IconDynamic,
  },
  {
    id: 'explota',
    name: 'EXPLOTA',
    subtitle: 'Bafles Bose DM3SE',
    components: ['Amplificador Bose', 'Subwoofer JBL'],
    price: 81970,
    color: '#f43f5e',
    tier: 8,
    Icon: IconExplode,
  },
  {
    id: 'hiper',
    name: 'HIPER EXPERIENCIA',
    subtitle: 'Sistema Completo Bose Pro',
    components: ['Bafles Bose Pro', 'Amplificador Bose Pro', 'Subwoofer Bose Pro'],
    price: 94460,
    color: '#ffd700',
    tier: 9,
    isElite: true,
    Icon: IconCrown,
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(price);

const PackageCard = ({ pkg, index }) => {
  const { name, subtitle, components, price, color, tier, isElite, Icon } = pkg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.07 * index + 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group relative flex flex-col rounded-3xl overflow-hidden cursor-default"
      style={{
        background: `linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.25) 100%)`,
        border: `1px solid ${color}28`,
        boxShadow: `0 1px 0 ${color}10 inset`,
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}60`;
        e.currentTarget.style.boxShadow = `0 0 40px ${color}20, 0 20px 60px rgba(0,0,0,0.5), 0 1px 0 ${color}20 inset`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${color}28`;
        e.currentTarget.style.boxShadow = `0 1px 0 ${color}10 inset`;
      }}
    >
      {/* Top edge glow */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />

      {/* Ambient glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% -10%, ${color}0d 0%, transparent 65%)`,
          transition: 'opacity 0.5s ease',
        }} />

      {/* Elite gold shimmer */}
      {isElite && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ background: `linear-gradient(135deg, ${color}00 30%, ${color} 50%, ${color}00 70%)` }} />
        </div>
      )}

      <div className="relative z-10 p-6 flex flex-col h-full">

        {/* Tier label + illustration row */}
        <div className="flex items-start justify-between mb-5">
          {/* SVG Icon Container */}
          <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: `${color}0d`,
              border: `1px solid ${color}22`,
              boxShadow: `0 0 20px ${color}10`,
            }}>
            <div className="w-11 h-11">
              <Icon color={color} />
            </div>
          </div>

          {/* Tier badge */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-[8px] font-heading font-black uppercase tracking-[0.35em] text-gray-600">
              Nivel
            </span>
            <span className="font-display text-4xl font-bold leading-none tabular-nums"
              style={{ color: `${color}40` }}>
              {String(tier).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Name */}
        <div className="mb-1">
          <h3 className="font-display font-bold uppercase tracking-tight leading-none text-white"
            style={{ fontSize: isElite ? '1.35rem' : '1.1rem' }}>
            {name}
          </h3>
        </div>

        {/* Subtitle */}
        <p className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] mb-4"
          style={{ color: `${color}90` }}>
          {subtitle}
        </p>

        {/* Components */}
        <ul className="flex-grow space-y-1.5 mb-5">
          {components.map((c, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full shrink-0" style={{ background: color, opacity: 0.7 }} />
              <span className="text-[11px] font-heading text-gray-400 leading-snug">{c}</span>
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="pt-4" style={{ borderTop: `1px solid ${color}15` }}>
          <p className="text-[9px] font-heading font-black uppercase tracking-[0.35em] text-gray-600 mb-1">
            Precio
          </p>
          <p className="font-display font-bold leading-none tracking-tight"
            style={{
              fontSize: isElite ? '1.65rem' : '1.4rem',
              color,
              textShadow: `0 0 24px ${color}50`,
            }}>
            {formatPrice(price)}
          </p>
          <p className="text-[9px] font-heading font-bold uppercase tracking-[0.3em] text-gray-700 mt-1">
            MXN · IVA incluido
          </p>
        </div>

      </div>
    </motion.div>
  );
};

const Equipos = () => (
  <div className="min-h-screen bg-void text-white overflow-x-hidden relative">
    <Aurora />

    <div className="pt-32 pb-24 px-4 relative z-10">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <div className="text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-neon-cyan">
              Paquetes disponibles
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl uppercase leading-tight mb-6 tracking-tight"
          >
            Equipos de{' '}
            <span className="text-neon-cyan italic">Sonido</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed"
          >
            Paquetes de audio profesional con equipos de las mejores marcas del mercado.
            Instalación incluida y soporte técnico especializado.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 text-sm">
            ¿Listo para transformar el sonido de tu negocio?{' '}
            <a href="/contacto" className="text-neon-cyan hover:underline transition-colors duration-200">
              Contáctanos
            </a>{' '}
            y diseñamos la solución ideal para ti.
          </p>
        </motion.div>

      </div>
    </div>
  </div>
);

export default Equipos;
