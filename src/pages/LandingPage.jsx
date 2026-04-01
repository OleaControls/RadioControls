import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Zap, Activity, ChevronRight,
  Shield, Headphones, LayoutDashboard,
  Clock, Wrench, Lock, Play, CheckCircle2,
  Star, Quote, Music, Wifi, PhoneCall,
  TrendingUp, Users, MapPin, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroWaves from '../components/HeroWaves';
import UniversalPlayer from '../components/UniversalPlayer';
import PhotoCarousel from '../components/PhotoCarousel';

/* ─── Optimized Aurora ───────────────────────────── */
const Aurora = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {/* Left Cyan Glow - Smaller and Pulsating */}
    <div className="animate-pulse absolute top-[20%] left-[-5%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-20"
      style={{ background: 'radial-gradient(circle, #00f3ff 0%, transparent 70%)', animationDuration: '3s' }} />
    
    {/* Right Purple Glow - Smaller and Pulsating */}
    <div className="animate-pulse absolute top-[15%] right-[-5%] w-[35vw] h-[35vw] rounded-full blur-[120px] opacity-15"
      style={{ background: 'radial-gradient(circle, #bc13fe 0%, transparent 70%)', animationDuration: '4s' }} />
      
    {/* Minimal side accents with fast flicker */}
    <div className="animate-pulse absolute top-1/2 left-0 w-[20vw] h-[20vw] rounded-full blur-[80px] opacity-10 bg-neon-cyan" 
      style={{ animationDuration: '1.5s' }} />
    <div className="animate-pulse absolute top-1/3 right-0 w-[15vw] h-[15vw] rounded-full blur-[80px] opacity-10 bg-neon-purple" 
      style={{ animationDuration: '2s' }} />
  </div>
);

/* ─── Animated Counter Component ────────────────── */
const Counter = ({ value, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = parseInt(value);
      const duration = 2000;
      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [inView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const LandingPage = () => {
  return (
    <div className="bg-void min-h-screen text-white selection:bg-neon-cyan/30">
      
      {/* ══ HERO SECTION ════════════════════════════ */}
      <section className="relative min-h-[95vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
        <Aurora />
        <HeroWaves />
        
        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          {/* Logo Principal RadioOlea */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <img 
              src="/img radio olea/logosinfondoradioolea.svg" 
              alt="RadioOleaControls Logo" 
              className="h-20 md:h-24 mx-auto drop-shadow-[0_0_35px_rgba(0,243,255,0.4)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-neon-cyan text-center">
              RadioOleaControls • Audio Intelligence
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl leading-[1.1] md:leading-[0.9] uppercase mb-8 tracking-tight"
          >
            Sonido que <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple animate-gradient bg-[length:200%_auto]">
              Vende Más.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl mx-auto text-gray-400 text-sm md:text-lg font-light mb-10 md:mb-12 leading-relaxed px-4"
          >
            Elevamos la experiencia sensorial de tu negocio con tecnología de streaming legal y curaduría musical inteligente.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <Link to="/planes" className="group relative overflow-hidden bg-white text-void px-10 py-4 rounded-full font-heading font-bold text-sm uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              <span className="relative z-10">Comenzar Ahora</span>
              <div className="absolute inset-0 bg-neon-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link to="/contacto" className="px-10 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-all font-heading text-sm uppercase tracking-widest backdrop-blur-sm">
              Solicitar Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ TRUST LOGO MARQUEE ═════════════════════ */}
      <section className="relative z-10 py-20 overflow-hidden">
        <div className="container mx-auto px-4 mb-12">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center gap-6 opacity-20"
          >
            <div className="h-px flex-grow bg-gradient-to-r from-transparent to-white" />
            <span className="text-[9px] font-heading font-black uppercase tracking-[0.6em] whitespace-nowrap text-white">
              Propulsado por Tecnología RadiOleaControls
            </span>
            <div className="h-px flex-grow bg-gradient-to-l from-transparent to-white" />
          </motion.div>
        </div>

        <div className="relative flex items-center">
          {/* Gradient Masks for smooth fade */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-void to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-void to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee gap-16 md:gap-32 whitespace-nowrap items-center py-4">
            {[...Array(4)].map((_, rep) => (
              <React.Fragment key={rep}>
                <img 
                  src="/img radio olea/logosinfondoradioolea.svg" 
                  className="h-8 md:h-11 opacity-20 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer" 
                  alt="RadioOlea Icon" 
                />
                <img 
                  src="/img radio olea/Lema radioleacontrols-271025.svg" 
                  className="h-6 md:h-9 opacity-20 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer" 
                  alt="RadioOlea Lema" 
                />
                <img 
                  src="/img radio olea/nombre radioleacontrols.svg" 
                  className="h-5 md:h-8 opacity-20 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer" 
                  alt="RadioOlea Name" 
                />
                <img 
                  src="/img radio olea/Logo y sitio-radioleacontrols-2026.svg" 
                  className="h-8 md:h-11 opacity-20 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer" 
                  alt="RadioOlea Full Logo" 
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS STRIP ═════════════════════════════ */}
      <section className="py-20 border-b border-white/5">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v: "500", s: "+", l: "Sucursales" },
            { v: "15", s: "+", l: "Ciudades" },
            { v: "99", s: "%", l: "Uptime" },
            { v: "24", s: "/7", l: "Soporte" }
          ].map((st, i) => (
            <div key={i} className="text-center group">
              <p className="font-display text-5xl text-white group-hover:text-neon-cyan transition-colors">
                <Counter value={st.v} suffix={st.s} />
              </p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.3em] mt-1">{st.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ BENTO FEATURES ══════════════════════════ */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center md:text-left">
            <h2 className="font-display text-4xl md:text-6xl uppercase leading-none mb-4">
              Ingeniería <span className="text-neon-purple italic">Sonora</span>
            </h2>
            <p className="text-gray-500 max-w-md text-sm">Tecnología de punta para el ambiente más exigente de RadioOleaControls.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Main feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-8 p-10 glass rounded-[2.5rem] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8">
                <Headphones className="w-12 h-12 text-neon-cyan opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-display text-4xl mb-4">Streaming Hi-Fi Sin Cortes</h3>
              <p className="text-gray-400 max-w-sm text-sm">Audio 320kbps con tecnología de buffer predictivo que garantiza música infinita incluso con fallas de internet.</p>
              <div className="mt-8 flex gap-2">
                <span className="px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-[10px] font-bold uppercase tracking-widest">320 KBPS</span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-widest">DAC 24-BIT</span>
              </div>
            </motion.div>

            {/* Small feature */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-4 p-10 glass rounded-[2.5rem] bg-gradient-to-br from-neon-purple/20 to-transparent"
            >
              <Shield className="w-8 h-8 text-neon-purple mb-6" />
              <h3 className="font-heading font-bold text-xl mb-2 italic">100% Legal</h3>
              <p className="text-xs text-gray-500 leading-relaxed text-left">Gestión total de licencias (SACM, SOMEXFON). RadioOleaControls protege tu marca.</p>
            </motion.div>

            {/* Another row */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-4 p-10 glass rounded-[2.5rem]"
            >
              <LayoutDashboard className="w-8 h-8 text-white/50 mb-6" />
              <h3 className="font-heading font-bold text-xl mb-2">Multi-Zona</h3>
              <p className="text-xs text-gray-500 leading-relaxed text-left">Controla diferentes atmósferas en cada sucursal desde un solo panel inteligente.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="md:col-span-8 p-10 glass rounded-[2.5rem] bg-gradient-to-r from-void to-white/[0.03] flex flex-col md:flex-row items-center gap-10"
            >
              <div className="flex-1 text-left">
                <h3 className="font-display text-3xl mb-4">Instalación <br /> Express</h3>
                <p className="text-gray-400 text-sm">Técnicos certificados RadioOlea listos para activar tu sistema en tiempo récord.</p>
              </div>
              <div className="w-32 h-32 rounded-3xl bg-neon-cyan/5 border border-neon-cyan/20 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                <Wrench className="w-12 h-12 text-neon-cyan" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ PHOTO CAROUSEL SECTION ══════════════════ */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="font-display text-5xl md:text-7xl uppercase leading-none mb-6">
              Atmósferas en <span className="text-neon-cyan italic">Acción</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-base">Descubre cómo RadioOleaControls transforma espacios comerciales reales a través del audio inteligente.</p>
          </div>
          
          <PhotoCarousel />
        </div>
      </section>

      {/* ══ DEMO SECTION ════════════════════════════ */}
      <section className="py-32 bg-white/[0.01]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto glass p-1 md:p-2 rounded-[3rem] shadow-2xl overflow-hidden">
            <UniversalPlayer streamUrl="https://c44.radioboss.fm:8054/stream" stationName="RadioOlea Live Demo" />
          </div>
          <p className="mt-8 text-[10px] font-heading font-bold uppercase tracking-[0.4em] text-gray-600">Mastering Digital en Tiempo Real</p>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════ */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-left">
            <h2 className="font-display text-5xl md:text-7xl leading-none uppercase">
              La Voz <br /> del <span className="text-neon-cyan">Éxito</span>
            </h2>
            <p className="text-gray-400 max-w-xs text-xs mb-4">Empresas que ya transformaron su atmósfera con RadioOleaControls.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { q: "Nuestros clientes pasan 15% más tiempo en tienda.", n: "María G.", r: "Retailer" },
              { q: "El soporte técnico es impecable, siempre están ahí.", n: "Carlos M.", r: "Restaurateur" },
              { q: "La mejor inversión en branding auditivo que hemos hecho.", n: "Ana L.", r: "Boutique" }
            ].map((t, i) => (
              <motion.div key={i} className="p-8 glass rounded-3xl border-l-4 border-neon-cyan text-left">
                <Quote className="w-8 h-8 text-white/10 mb-6" />
                <p className="text-lg font-light mb-8 italic">"{t.q}"</p>
                <div>
                  <p className="font-heading font-bold uppercase text-xs tracking-widest">{t.n}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{t.r}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════ */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-neon-cyan/5 rounded-full blur-[150px]" />
        <div className="container mx-auto text-center relative z-10">
          <h2 className="font-display text-5xl md:text-8xl leading-none uppercase mb-10 tracking-tight">
            RadioOleaControls <br /> suenen <br /> <span className="text-neon-cyan italic">Mejor</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/contacto" className="inline-flex items-center gap-4 bg-white text-void px-10 py-5 rounded-full font-heading font-black text-base uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              Contactar ahora <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-10 border-t border-white/5 text-center">
        <p className="text-[10px] font-heading font-bold uppercase tracking-[0.5em] text-gray-700">© 2026 RadioOleaControls • Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default LandingPage;
