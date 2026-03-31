import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Zap, Activity, ChevronRight,
  Shield, Headphones, LayoutDashboard,
  Clock, Wrench, Lock, Play, CheckCircle2,
  Star, Quote, Music, Wifi, PhoneCall,
  TrendingUp, Users, MapPin,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import WaveCursor from '../components/WaveCursor';
import UniversalPlayer from '../components/UniversalPlayer';

/* ─── Animated counter ───────────────────────────── */
const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let t0 = null;
    const step = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

/* ─── Stat counter card ──────────────────────────── */
const StatItem = ({ value, suffix, label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const count = useCounter(value, 2000, inView);
  return (
    <div ref={ref} className="flex flex-col items-center gap-2 py-2 px-4">
      <span className="font-display text-4xl sm:text-5xl text-white tabular-nums leading-none tracking-wide">
        {count}<span className="text-neon-cyan">{suffix}</span>
      </span>
      <span className="font-heading text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500 text-center">
        {label}
      </span>
    </div>
  );
};

/* ─── Features bento data ────────────────────────── */
const FEATURES = [
  { icon: Headphones,      title: 'Streaming Hi-Fi',         desc: 'Audio 320 kbps DAC 24-bit. Tu marca suena diferente desde el primer segundo en cada sucursal.',  accent: 'cyan',   large: true  },
  { icon: Shield,          title: 'Licencias Incluidas',     desc: 'SACM, SOMEXFON y más. Opera sin preocupaciones legales.',                                         accent: 'purple', large: false },
  { icon: LayoutDashboard, title: 'Panel de Control',        desc: 'Gestiona todas tus sucursales en tiempo real.',                                                    accent: 'cyan',   large: false },
  { icon: Clock,           title: 'Soporte 24/7',            desc: 'Equipo técnico disponible toda la semana, sin excepción.',                                         accent: 'purple', large: false },
  { icon: Wrench,          title: 'Instalación Pro',         desc: 'Técnicos certificados en tu establecimiento. Nosotros configuramos todo.',                         accent: 'cyan',   large: true  },
  { icon: Lock,            title: '100% Legal',              desc: 'Cumplimiento total con la ley de derechos de autor en México.',                                    accent: 'purple', large: false },
];

/* ─── Testimonials ───────────────────────────────── */
const TESTIMONIALS = [
  {
    quote: 'Desde que instalamos RadiOlea Controls, nuestros clientes tardan más en irse. El ambiente sonoro es increíble y 100% legal.',
    name: 'María González',
    role: 'Dueña · Farmacia San Ángel, CDMX',
    rating: 5,
  },
  {
    quote: 'Manejamos 12 restaurantes y el panel de control nos permite cambiar el ambiente de cada uno en segundos. Servicio impecable.',
    name: 'Carlos Mendoza',
    role: 'Director Ops · Grupo Gastronómico MX',
    rating: 5,
  },
  {
    quote: 'La instalación fue en 2 horas y llevan 8 meses sin una sola falla. Eso es lo que necesitaba para mi boutique.',
    name: 'Ana Lucía Torres',
    role: 'Gerente · Boutique Éclat, Polanco',
    rating: 5,
  },
];

/* ─── How it works ───────────────────────────────── */
const STEPS = [
  { n: '01', icon: PhoneCall,   title: 'Nos contactas',     desc: 'Cuéntanos sobre tu negocio. Te asignamos un consultor en menos de 24 horas.' },
  { n: '02', icon: Wrench,      title: 'Instalamos',        desc: 'Técnico certificado en tu local. Configuramos todo el equipo y el streaming.' },
  { n: '03', icon: Music,       title: 'Tu negocio suena',  desc: 'Streaming continuo, 24/7, controlado desde tu panel. Sin interrupciones.' },
];

/* ─── Quick access ───────────────────────────────── */
const QUICK = [
  { title: 'Nuestros Servicios', desc: 'Ingeniería, licencias y publicidad estratégica.',  path: '/servicios', Icon: Zap      },
  { title: 'Galería de Éxito',   desc: 'Mira cómo lucen los espacios RadiOleaControls.',   path: '/galeria',   Icon: Activity },
  { title: 'Ayuda / FAQ',        desc: 'Resolvemos todas tus dudas legales y técnicas.',   path: '/faq',       Icon: ArrowRight},
];

/* ─── Aurora blob ────────────────────────────────── */
const Aurora = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="animate-aurora-1 absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(0,243,255,0.12) 0%, transparent 70%)' }} />
    <div className="animate-aurora-2 absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(188,19,254,0.10) 0%, transparent 70%)' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(0,35,102,0.3) 0%, transparent 70%)' }} />
  </div>
);

/* ══════════════════════════════════════════════════ */
const LandingPage = () => {
  return (
    <div className="bg-void min-h-screen text-white overflow-x-hidden font-body">
      <WaveCursor />

      {/* ══ HERO ════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-4 z-10">
        <Aurora />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          {/* Live pill */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2 bg-neon-cyan/8 border border-neon-cyan/25 px-5 py-2.5 rounded-full mb-10 cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan" />
            </span>
            <span className="font-heading text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em]">
              Audio Ambiental Premium
            </span>
          </motion.div>

          {/* Logo */}
          <motion.img
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            src="/img%20radio%20olea/logosinfondoradioolea.svg"
            alt="RadiOlea Controls"
            className="h-16 md:h-24 w-auto mx-auto object-contain mb-8"
            style={{ filter: 'drop-shadow(0 0 40px rgba(0,243,255,0.4))' }}
          />

          {/* Headline — Bebas Neue */}
          <h1 className="font-display leading-[0.88] mb-4 uppercase">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="block text-[14vw] sm:text-[10vw] md:text-[8rem] lg:text-[9rem] text-white"
            >
              Transforma tu
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="block text-[14vw] sm:text-[10vw] md:text-[8rem] lg:text-[9rem] italic"
              style={{
                background: 'linear-gradient(90deg, #00f3ff 0%, #bc13fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Experiencia
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-body text-base md:text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Creamos el ambiente sonoro perfecto para que tus ventas crezcan exponencialmente con tecnología de streaming de alta fidelidad.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
          >
            <Link
              to="/planes"
              className="group relative bg-neon-cyan text-void px-8 py-4 rounded-2xl font-heading font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-[0_0_60px_rgba(0,243,255,0.5)] hover:scale-[1.04] overflow-hidden cursor-pointer"
              style={{ minHeight: '52px' }}
            >
              <span className="relative z-10">CONTRATAR AHORA</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 -translate-x-full skew-x-[-12deg] group-hover:translate-x-full transition-transform duration-600" />
            </Link>
            <Link
              to="/contacto"
              className="glass px-8 py-4 rounded-2xl font-heading font-semibold text-sm uppercase tracking-widest hover:bg-white/8 transition-all duration-300 cursor-pointer"
              style={{ minHeight: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              SOLICITAR COTIZACIÓN
            </Link>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-3 mb-14"
          >
            {['+500 sucursales activas', '98% satisfacción', '15 ciudades en México', 'Sin contrato mínimo'].map((b, i) => (
              <span key={i} className="glass px-4 py-2 rounded-full text-[11px] font-heading font-semibold text-gray-300 cursor-default">
                {b}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="w-full max-w-4xl mx-auto relative z-10"
        >
          <div className="glass rounded-3xl overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5 py-6">
              <StatItem value={500} suffix="+" label="Sucursales activas"     />
              <StatItem value={15}  suffix="+" label="Ciudades"               />
              <StatItem value={8}   suffix=""  label="Años de experiencia"    />
              <StatItem value={99}  suffix="%" label="Uptime garantizado"     />
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* ══ MARQUEE TRUST STRIP ═════════════════════ */}
      <div className="relative z-10 overflow-hidden border-y border-white/5 py-4 bg-white/2">
        <div className="flex animate-marquee gap-16 whitespace-nowrap w-max">
          {[...Array(2)].map((_, rep) =>
            ['Streaming 320kbps', 'DAC 24-Bit', 'Cloud Low Latency', 'Buffer Pro', 'SACM Certificado', 'SOMEXFON', 'Soporte 24/7', 'Instalación Profesional', '99% Uptime', 'Sin Contratos'].map((item, i) => (
              <span key={`${rep}-${i}`} className="font-heading text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 flex items-center gap-4">
                <span className="w-1 h-1 rounded-full bg-neon-cyan/60 flex-shrink-0" />
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ══ DEMO PLAYER ═════════════════════════════ */}
      <section id="demo" className="py-24 md:py-32 px-4 relative z-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(ellipse, rgba(0,243,255,0.3) 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-4xl mx-auto flex flex-col items-center relative z-10">
          <div className="text-center mb-14 space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 border border-neon-cyan/20 bg-neon-cyan/5 px-4 py-2 rounded-full"
            >
              <Activity size={11} className="text-neon-cyan animate-pulse" />
              <span className="font-heading text-neon-cyan text-[10px] font-bold uppercase tracking-[0.22em]">Ingeniería Sonora Pro</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display text-5xl md:text-7xl uppercase tracking-wide"
            >
              Escucha tu{' '}
              <span className="text-neon-cyan italic" style={{ WebkitTextStroke: '0px' }}>
                Próxima Venta
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-gray-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed"
            >
              Prueba nuestro motor de ambiente inteligente. Sonido puro, legal y diseñado para convertir visitantes en clientes.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <UniversalPlayer streamUrl="https://c44.radioboss.fm:8054/stream" stationName="Demo: Tu tienda habla" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="mt-12 flex flex-wrap justify-center gap-8"
          >
            {[['Mastering','Digital Pro'],['Sync','Cloud Low Latency'],['Audio','320 kbps Hi-Fi'],['Network','Buffer Pro']].map(([l, v]) => (
              <div key={l} className="flex flex-col items-center gap-1 text-center">
                <span className="font-heading text-[8px] font-black uppercase tracking-[0.28em] text-gray-600">{l}</span>
                <span className="font-body text-xs font-semibold text-gray-300">{v}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ════════════════════════════ */}
      <section className="py-24 md:py-32 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="font-heading text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
              El proceso
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display text-5xl md:text-7xl uppercase tracking-wide">
              Así de <span className="text-neon-cyan">fácil</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-12 left-[22%] right-[22%] h-px bg-gradient-to-r from-neon-cyan/20 via-neon-purple/20 to-neon-cyan/20" />

            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="group relative glass rounded-3xl p-8 text-center hover:border-neon-cyan/20 transition-all duration-500 cursor-default"
                >
                  {/* Step number */}
                  <div className="relative mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-2xl border border-neon-cyan/20 bg-neon-cyan/5 group-hover:bg-neon-cyan/10 transition-colors" />
                    <Icon className="w-7 h-7 text-neon-cyan relative z-10" />
                    <span className="font-display absolute -top-2 -right-3 text-neon-cyan/30 text-2xl leading-none">{s.n}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg uppercase tracking-tight text-white mb-3">{s.title}</h3>
                  <p className="font-body text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ BENTO FEATURES ══════════════════════════ */}
      <section className="py-24 md:py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="font-heading text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
              Plataforma completa
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display text-5xl md:text-7xl uppercase tracking-wide">
              Todo lo que <span className="text-neon-cyan">necesitas</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              const isCyan = f.accent === 'cyan';
              const hex = isCyan ? '#00f3ff' : '#bc13fe';
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ borderColor: `${hex}44`, boxShadow: `0 0 45px -12px ${hex}33` }}
                  className={`group relative glass rounded-3xl p-8 overflow-hidden transition-all duration-500 cursor-default ${f.large ? 'lg:col-span-2' : ''}`}
                >
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `${hex}0f` }} />

                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500"
                    style={{ background: `${hex}15`, borderColor: `${hex}28`, color: hex }}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="font-heading font-bold text-xl uppercase tracking-tight mb-3 group-hover:text-white transition-colors">
                    {f.title}
                  </h3>
                  <p className="font-body text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                    {f.desc}
                  </p>

                  <div className="mt-7 flex items-center gap-1.5 text-[9px] font-heading font-bold uppercase tracking-[0.3em] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" style={{ color: hex }}>
                    Saber más <ChevronRight size={11} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════ */}
      <section className="py-24 md:py-32 px-4 relative z-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="font-heading text-neon-purple text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
              Lo que dicen nuestros clientes
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-display text-5xl md:text-7xl uppercase tracking-wide">
              Resultados <span className="text-neon-purple">reales</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group glass rounded-3xl p-8 flex flex-col gap-5 hover:border-neon-purple/20 transition-all duration-500 cursor-default"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative flex-grow">
                  <Quote className="w-6 h-6 text-neon-purple/30 mb-3" />
                  <p className="font-body text-sm text-gray-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-neon-purple/30 to-neon-cyan/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="font-heading font-bold text-sm text-white">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-white">{t.name}</p>
                    <p className="font-body text-[10px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ QUICK ACCESS ════════════════════════════ */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {QUICK.map(({ title, desc, path, Icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={path} className="group relative glass rounded-[32px] p-9 flex flex-col h-full transition-all duration-500 hover:border-neon-cyan/25 hover:shadow-[0_0_55px_-14px_rgba(0,243,255,0.18)] overflow-hidden cursor-pointer" style={{ minHeight: '240px' }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-all duration-700"
                  style={{ background: 'rgba(0,243,255,0.04)' }} />

                <div className="mb-6 p-3.5 rounded-2xl border border-white/8 w-fit text-neon-cyan group-hover:border-neon-cyan/30 group-hover:shadow-[0_0_20px_rgba(0,243,255,0.15)] transition-all duration-500 bg-neon-cyan/5 cursor-pointer"
                  style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="font-heading font-bold text-lg md:text-xl uppercase tracking-tight mb-3 group-hover:text-white transition-colors flex-shrink-0">
                  {title}
                </h3>
                <p className="font-body text-sm text-gray-500 leading-relaxed mb-7 group-hover:text-gray-400 transition-colors flex-grow">
                  {desc}
                </p>

                <div className="flex items-center gap-2 text-neon-cyan font-heading text-[9px] font-bold uppercase tracking-[0.32em] opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  Explorar <ChevronRight size={11} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════ */}
      <section className="py-24 md:py-32 px-4 relative z-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-40"
            style={{ background: 'linear-gradient(135deg, rgba(0,35,102,0.6) 0%, rgba(0,0,0,0) 50%, rgba(188,19,254,0.15) 100%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px]"
            style={{ background: 'radial-gradient(ellipse, rgba(0,243,255,0.12) 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-heading text-neon-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            ¿Listo para transformar tu negocio?
          </motion.p>

          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-6xl md:text-8xl lg:text-9xl uppercase tracking-wide leading-[0.88] mb-6">
            <span className="text-white">Tu negocio</span>
            <br />
            <span className="text-neon-cyan animate-gradient bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan bg-[length:200%_auto]"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              merece sonar
            </span>
            <br />
            <span className="text-white">mejor.</span>
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-body text-base text-gray-400 mb-12 max-w-lg mx-auto leading-relaxed">
            Únete a más de 500 sucursales en México que ya transformaron su experiencia sonora con RadiOlea Controls.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/planes"
              className="group relative bg-neon-cyan text-void px-10 py-5 rounded-2xl font-heading font-bold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-[0_0_70px_rgba(0,243,255,0.5)] hover:scale-[1.04] overflow-hidden cursor-pointer"
              style={{ minHeight: '56px' }}>
              <span className="relative z-10">Ver Planes y Precios</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 -translate-x-full skew-x-[-12deg] group-hover:translate-x-full transition-transform duration-600" />
            </Link>
            <Link to="/contacto"
              className="glass px-10 py-5 rounded-2xl font-heading font-semibold text-sm uppercase tracking-widest hover:bg-white/8 transition-all duration-300 flex items-center justify-center cursor-pointer"
              style={{ minHeight: '56px' }}>
              Contactar un asesor
            </Link>
          </motion.div>

          {/* Trust micro-copy */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              [CheckCircle2, 'Sin contrato mínimo'],
              [CheckCircle2, 'Instalación gratuita'],
              [CheckCircle2, 'Soporte 24/7'],
            ].map(([Icon, text], i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-500 font-heading font-semibold">
                <Icon className="w-3.5 h-3.5 text-neon-cyan" />
                {text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
