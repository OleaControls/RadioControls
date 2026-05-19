import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck, MessageSquare, ArrowRight,
  Activity, Headphones, Layers, ArrowUpRight, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

const services = [
  {
    icon: Headphones,
    num: '01',
    title: 'Diseño del Sistema de Sonido',
    tag: 'Lo Fundamental',
    description: 'Si ya tienen un sistema, lo optimizamos para sacarle el máximo provecho, o bien podemos diseñar uno impactante desde cero.',
    accent: 'cyan',
    hex: '#00f3ff',
    glow: 'rgba(0,243,255,0.12)',
  },
  {
    icon: ShieldCheck,
    num: '02',
    title: 'Creación de la Banda Sonora de tu Marca',
    tag: 'A la Medida',
    description: 'Música curada especial para tu marca, tus horarios, tus promociones. Gestión total de licencias en todo México e inserción de publicidad propia.',
    description2: 'Convierte tu música ambiental en un canal de ventas directo con locución profesional integrada y programada.',
    accent: 'purple',
    hex: '#bc13fe',
    glow: 'rgba(188,19,254,0.12)',
  },
  {
    icon: MessageSquare,
    num: '03',
    title: 'Implementación de la Estrategia',
    tag: 'Instalación y Capacitación',
    description: 'Solo con nosotros obtienes 3 años de garantía. O si cuentas con tu propio personal, los capacitamos y supervisamos para instalar con el estándar que esperas.',
    accent: 'green',
    hex: '#39ff14',
    glow: 'rgba(57,255,20,0.12)',
  },
  {
    icon: Layers,
    num: '04',
    title: 'Asesoría Post-Proyecto',
    tag: 'Siempre Acompañado',
    description: 'Ya funcionando, estaremos contigo. Cada mes nos reuniremos para orientar y asesorarte para que tomes las mejores decisiones e impulsemos tus ventas.',
    accent: 'white',
    hex: '#ffffff',
    glow: 'rgba(255,255,255,0.06)',
  },
];

/* ── Decorative abstract shape per card ──────────── */
const AbstractShape = ({ hex, num }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
    {/* Big ghost number */}
    <span
      className="absolute -right-6 -bottom-8 font-display text-[10rem] md:text-[14rem] font-black leading-none opacity-[0.06]"
      style={{ color: hex }}
    >
      {num}
    </span>
    {/* Geometric ring */}
    <div
      className="absolute -top-16 -right-16 w-64 h-64 rounded-full border opacity-[0.07]"
      style={{ borderColor: hex }}
    />
    <div
      className="absolute -top-8 -right-8 w-40 h-40 rounded-full border opacity-[0.05]"
      style={{ borderColor: hex }}
    />
    {/* Corner glow */}
    <div
      className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-20"
      style={{ background: `radial-gradient(circle, ${hex} 0%, transparent 70%)` }}
    />
  </div>
);

/* ── Service card ─────────────────────────────────── */
const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-[1.75rem] border border-white/[0.07] bg-white/[0.02] overflow-hidden transition-all duration-500 hover:border-white/15 hover:bg-white/[0.04]"
      style={{ boxShadow: `0 0 0 0 ${service.hex}` }}
    >
      <AbstractShape hex={service.hex} num={service.num} />

      <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
        {/* Top row: step + tag */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span
              className="font-heading font-black text-[10px] uppercase tracking-[0.5em]"
              style={{ color: service.hex }}
            >
              {service.num}
            </span>
            <span
              className="w-8 h-px opacity-40"
              style={{ background: service.hex }}
            />
          </div>
          <span className="font-heading text-[8px] uppercase tracking-[0.35em] text-white/25 border border-white/10 px-3 py-1 rounded-full">
            {service.tag}
          </span>
        </div>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-7 border border-white/10 bg-black/40 backdrop-blur-sm transition-transform duration-500 group-hover:scale-105"
          style={{ boxShadow: `0 0 24px ${service.glow}` }}
        >
          <Icon size={24} style={{ color: service.hex }} />
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase leading-[0.95] tracking-tight text-white mb-5">
          {service.title}
        </h3>

        {/* Divider */}
        <div className="h-px w-10 mb-5 opacity-60" style={{ background: service.hex }} />

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed font-light mb-3 flex-1">
          {service.description}
        </p>
        {service.description2 && (
          <p className="text-gray-600 text-sm leading-relaxed font-light mb-6">
            {service.description2}
          </p>
        )}

        {/* CTA link */}
        <Link
          to="/contacto"
          className="inline-flex items-center gap-2 mt-6 self-start group/btn"
        >
          <span
            className="font-heading font-black text-[9px] uppercase tracking-widest transition-colors duration-300"
            style={{ color: service.hex }}
          >
            Solicitar Información
          </span>
          <ArrowUpRight
            size={12}
            style={{ color: service.hex }}
            className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          />
        </Link>
      </div>
    </motion.div>
  );
};

/* ── Main page ────────────────────────────────────── */
const Services = () => {
  return (
    <div className="min-h-screen bg-void text-white selection:bg-neon-cyan/30 overflow-x-hidden relative">
      <Aurora />

      <div className="relative z-10 px-5 md:px-10 lg:px-16 pt-36 pb-28">
        <div className="max-w-7xl mx-auto">

          {/* ── HERO ── */}
          <div className="mb-20 md:mb-28">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              <Activity className="w-3 h-3 text-neon-cyan animate-pulse" />
              <span className="text-[9px] font-heading font-black uppercase tracking-[0.5em] text-neon-cyan">
                La manera más fácil de aumentar tus ventas
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-7xl md:text-[8.5rem] uppercase leading-[0.88] tracking-tighter mb-8"
            >
              Elige el<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple animate-gradient bg-[length:200%_auto]">
                Camino
              </span>
              <br />
              <span className="text-white/15">Adecuado</span>
            </motion.h1>

            {/* Sub row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12"
            >
              <p className="text-gray-500 max-w-xs text-sm font-light leading-relaxed border-l-2 border-neon-cyan pl-4">
                Cuatro pasos para transformar el sonido de tu negocio en una herramienta de ventas.
              </p>

              {/* Step index pills */}
              <div className="flex gap-2 flex-wrap">
                {services.map((s) => (
                  <div
                    key={s.num}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]"
                  >
                    <span
                      className="font-heading font-black text-[9px]"
                      style={{ color: s.hex }}
                    >
                      {s.num}
                    </span>
                    <ChevronRight size={9} className="text-white/20" />
                    <span className="font-heading text-[8px] text-white/30 uppercase tracking-wider hidden sm:block">
                      {s.tag}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── SERVICES GRID ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-24">
            {services.map((service, i) => (
              <ServiceCard key={i} service={service} index={i} />
            ))}
          </div>

          {/* ── DIVIDER ── */}
          <div className="w-full h-px bg-white/[0.06] mb-24" />

          {/* ── CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[2rem] border border-white/[0.08] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0,243,255,0.03) 0%, rgba(0,0,0,0) 50%, rgba(188,19,254,0.03) 100%)',
            }}
          >
            {/* Ghost word */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span className="font-display text-[18vw] uppercase font-black leading-none opacity-[0.025] text-white whitespace-nowrap">
                RADIOLEA
              </span>
            </div>

            {/* Ambient glow center */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full blur-[100px] opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, #00f3ff 0%, transparent 60%)' }}
            />

            <div className="relative z-10 px-8 py-16 sm:px-14 sm:py-20 md:px-20 md:py-28 text-center">
              <span className="inline-block font-heading text-[9px] font-black uppercase tracking-[0.6em] text-neon-cyan mb-5">
                ¿Listo para empezar?
              </span>

              <h2 className="font-display text-4xl sm:text-6xl md:text-7xl uppercase leading-[0.9] tracking-tighter mb-6">
                Diseñemos<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">
                  Tu Sonido
                </span>
              </h2>

              <p className="text-gray-500 text-sm md:text-base mb-2 font-light leading-relaxed max-w-lg mx-auto">
                Nuestro sonido ambiental es una herramienta estratégica de comportamiento.
              </p>
              <p className="text-gray-600 text-sm mb-10 font-light leading-relaxed max-w-md mx-auto">
                Los negocios que más lo aprovechan son los que dependen de tiempo de permanencia, estado emocional y decisión de compra.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contacto"
                  className="group/cta inline-flex items-center justify-center gap-2 px-10 py-4 bg-neon-cyan text-void rounded-full font-heading font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_50px_rgba(0,243,255,0.2)]"
                >
                  Contactar con Experto
                  <ArrowRight size={13} className="transition-transform duration-300 group-hover/cta:translate-x-1" />
                </Link>
                <Link
                  to="/planes"
                  className="px-10 py-4 border border-white/10 rounded-full font-heading font-black text-[10px] uppercase tracking-widest hover:bg-white/5 hover:border-white/25 transition-all text-white/50 hover:text-white"
                >
                  Explorar Planes
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Services;
