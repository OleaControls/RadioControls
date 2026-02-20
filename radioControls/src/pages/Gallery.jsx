import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Music, Users, Sparkles, Building2, Coffee, Utensils, HeartPulse, Dumbbell, ShoppingBag } from 'lucide-react';
import WaveCursor from '../components/WaveCursor';

const Gallery = () => {
  const categories = [
    { 
      title: "Retail & Almacenes", 
      img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000", 
      span: "md:col-span-2",
      icon: <ShoppingBag className="w-6 h-6" />,
      benefit: "Aumenta la permanencia con ritmos calculados.",
      details: ["Psicología de compra", "Zonificación Pro", "Spots instantáneos"]
    },
    { 
      title: "Fitness & Gyms", 
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000", 
      span: "md:col-span-1",
      icon: <Dumbbell className="w-6 h-6" />,
      benefit: "Motivación máxima con BPMs sincronizados.",
      details: ["Energía constante", "Cero latencia", "Ambiente High-Power"]
    },
    { 
      title: "Alta Gastronomía", 
      img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1000", 
      span: "md:col-span-1",
      icon: <Utensils className="w-6 h-6" />,
      benefit: "Privacidad y atmósferas envolventes.",
      details: ["Volumen inteligente", "Curaduría Jazz/Chill", "Exclusividad sonora"]
    },
    { 
      title: "Centros Comerciales", 
      img: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&q=80&w=1000", 
      span: "md:col-span-2",
      icon: <Building2 className="w-6 h-6" />,
      benefit: "Cobertura total con fidelidad cristalina.",
      details: ["Gestión masiva", "Anuncios de seguridad", "Programación global"]
    },
  ];

  return (
    <div className="pt-40 pb-24 px-4 min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <WaveCursor />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-28">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-black uppercase tracking-[0.3em] mb-8"
          >
            <Sparkles className="w-4 h-4" /> Portafolio de Sectores
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tight leading-tight"
          >
            Experiencias <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 italic pr-4">Sonoras</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            No solo ponemos música; diseñamos la identidad acústica que define a las marcas más importantes del país.
          </motion.p>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {categories.map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`${cat.span} group relative rounded-[48px] overflow-hidden bg-slate-900 border border-white/5 h-[550px] shadow-2xl transition-all duration-700 hover:border-neon-cyan/40`}
            >
              <div className="absolute inset-0">
                <img 
                  src={cat.img} 
                  className="w-full h-full object-cover opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-1000 ease-out" 
                  alt={cat.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent transition-all group-hover:via-slate-950/60" />
              </div>

              <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-end">
                <div className="flex items-center gap-4 mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="p-4 bg-neon-cyan rounded-2xl text-slate-950 shadow-[0_0_25px_rgba(0,243,255,0.4)]">
                    {cat.icon}
                  </div>
                  <div className="h-px w-10 bg-white/20" />
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-6 leading-tight transition-colors group-hover:text-neon-cyan pr-4">
                  {cat.title}
                </h3>
                
                <p className="text-slate-400 text-lg leading-relaxed mb-8 transform opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 font-medium">
                  {cat.benefit}
                </p>

                <div className="space-y-3 transform opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                  {cat.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-neon-cyan/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan" /> {detail}
                    </div>
                  ))}
                </div>

                <div className="w-16 h-2 bg-neon-cyan mt-10 rounded-full transition-all duration-500 group-hover:w-40" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 p-16 rounded-[60px] bg-white/5 border border-white/10 text-center relative overflow-hidden backdrop-blur-xl"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter italic text-white">¿Tu sector no está aquí?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-xl font-medium">Creamos soluciones personalizadas para cualquier espacio que necesite una atmósfera profesional.</p>
          <button className="bg-neon-cyan text-slate-950 px-12 py-6 rounded-2xl font-black text-xl hover:shadow-[0_0_50px_rgba(0,243,255,0.5)] transition-all uppercase hover:scale-105 active:scale-95">Solicitar Consultoría Acústica</button>
        </motion.div>
      </div>
    </div>
  );
};

export default Gallery;