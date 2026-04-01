import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, ShieldCheck, MessageSquare, ArrowRight, 
  Activity, Headphones, Layers, Globe, 
  Cpu, Gauge, Database
} from 'lucide-react';
import WaveCursor from '../components/WaveCursor';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Headphones,
    title: "Ingeniería Acústica",
    tag: "Studio Grade",
    description: "Diseñamos atmósferas sonoras que influyen en el comportamiento de compra mediante frecuencias psicoacústicas optimizadas para cada sector comercial.",
    accent: "neon-cyan",
    img: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800"
  },
  {
    icon: ShieldCheck,
    title: "Cumplimiento Legal",
    tag: "Certificado",
    description: "Gestión total de licencias (SACM, SOMEXFON). Protegemos tu marca con certificaciones vigentes y blindaje jurídico contra multas por derechos de autor.",
    accent: "neon-purple",
    img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"
  },
  {
    icon: MessageSquare,
    title: "Voz & Spots",
    tag: "Ventas",
    description: "Inserción inteligente de publicidad propia. Convierte tu música ambiental en un canal de ventas directo con locución profesional integrada y programada.",
    accent: "neon-green",
    img: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800"
  },
  {
    icon: Layers,
    title: "Control Cloud",
    tag: "Escalable",
    description: "Administra miles de sucursales en tiempo real desde un solo panel centralizado con tecnología de baja latencia y alta disponibilidad global.",
    accent: "white",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
  },
];

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

const Services = () => {
  return (
    <div className="min-h-screen bg-void text-white selection:bg-neon-cyan/30 overflow-x-hidden relative">
      <Aurora />

      <div className="pt-40 pb-24 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          
          {/* ─── Hero Header ────────────────── */}
          <div className="max-w-4xl mb-24 md:mb-32">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
              <Activity className="w-4 h-4 text-neon-cyan animate-pulse" />
              <span className="text-[10px] font-heading font-black uppercase tracking-[0.4em] text-neon-cyan">
                Expertise en Audio Digital
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl md:text-8xl uppercase leading-[0.9] mb-10 tracking-tighter"
            >
              Soluciones de <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple animate-gradient bg-[length:200%_auto]">
                Ingeniería Sonora
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl text-lg md:text-xl font-light leading-relaxed border-l-2 border-neon-cyan pl-8"
            >
              Elevamos la experiencia sensorial de tu marca a través de tecnología propietaria y curaduría inteligente. No solo transmitimos música, diseñamos identidades.
            </motion.p>
          </div>

          {/* ─── Main Services Grid ────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-40">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex flex-col h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden border border-white/5 bg-black/40 shadow-2xl transition-all duration-700 hover:border-white/20"
              >
                {/* Background Image with Parallax-ish feel */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={service.img} 
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 ease-out" 
                    alt={service.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-10 md:p-16 h-full flex flex-col justify-end">
                  <div className="mb-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-black/60 border border-white/10 text-${service.accent} mb-6 shadow-2xl`}>
                      <service.icon size={32} />
                    </div>
                    <span className={`text-[10px] font-heading font-black uppercase tracking-[0.4em] text-${service.accent} mb-4 block`}>
                      {service.tag}
                    </span>
                    <h3 className="font-display text-4xl md:text-5xl uppercase mb-6 tracking-tight leading-none text-white">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-sm font-light">
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <Link 
                      to="/contacto" 
                      className={`px-8 py-3 rounded-full bg-white text-void font-heading font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform`}
                    >
                      Solicitar Información <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>



          {/* ─── CTA Section ────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 md:p-32 rounded-[4rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 overflow-hidden text-center"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-neon-cyan/5 rounded-full blur-[150px] animate-pulse" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="font-display text-5xl md:text-8xl uppercase leading-none mb-10 tracking-tighter">
                Diseñemos <br /> tu <span className="text-neon-cyan italic">Soundtrack</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl mb-12 font-light leading-relaxed">
                Nuestros ingenieros están listos para realizar una auditoría sonora gratuita de tu espacio comercial.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/contacto" className="px-12 py-5 bg-neon-cyan text-void rounded-full font-heading font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(0,243,255,0.3)]">
                  Contactar con Experto
                </Link>
                <Link to="/planes" className="px-12 py-5 border border-white/10 rounded-full font-heading font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all backdrop-blur-sm">
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
