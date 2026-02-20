import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import WaveCursor from '../components/WaveCursor';

const FAQ = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    { 
      q: "¿Cumplen con derechos de autor?", 
      a: "Absolutamente. Nuestras licencias AMPROFON garantizan el cumplimiento legal total. Tu marca operará blindada contra multas por derechos de autor en todo el país.",
      icon: <ShieldCheck className="w-5 h-5 text-neon-cyan" />
    },
    { 
      q: "¿Cómo es la instalación?", 
      a: "Es 100% Cloud. Recibes accesos personalizados por sucursal que funcionan en cualquier navegador. Cero inversión en hardware propietario; solo conecta y suena.",
      icon: <Zap className="w-5 h-5 text-neon-cyan" />
    },
    { 
      q: "¿Puedo programar publicidad?", 
      a: "Sí. El sistema permite inyectar spots institucionales con la frecuencia exacta que necesites, integrándose de forma orgánica con el flujo musical.",
      icon: <MessageCircle className="w-5 h-5 text-neon-cyan" />
    },
    { 
      q: "¿Qué pasa si falla el internet?", 
      a: "Nuestra tecnología Buffer-Pro almacena hasta 15 minutos de audio en caché local, asegurando que la música nunca se detenga ante micro-cortes.",
      icon: <Sparkles className="w-5 h-5 text-neon-cyan" />
    },
    { 
      q: "¿Tienen soporte técnico?", 
      a: "Nuestros ingenieros de audio están monitoreando el sistema 24/7 y disponibles para soporte directo para garantizar la continuidad sonora.",
      icon: <HelpCircle className="w-5 h-5 text-neon-cyan" />
    }
  ];

  return (
    <div className="pt-40 pb-24 px-4 min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <WaveCursor />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-black uppercase tracking-[0.3em] mb-8"
          >
            <HelpCircle className="w-4 h-4" /> Centro de Conocimiento
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tight leading-tight"
          >
            Despeja tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 italic pr-4">Dudas</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Todo lo que necesitas saber sobre legalidad, tecnología y cómo impulsamos tu negocio.
          </motion.p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-[32px] border transition-all duration-700 overflow-hidden ${
                activeFaq === i 
                  ? 'bg-slate-900 border-neon-cyan/30 shadow-[0_0_40px_rgba(0,243,255,0.05)]' 
                  : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.07]'
              }`}
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full p-8 md:p-10 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-6 md:gap-8">
                  <div className={`p-4 rounded-2xl transition-all duration-500 ${activeFaq === i ? 'bg-neon-cyan text-slate-950 scale-110' : 'bg-slate-950 text-neon-cyan border border-white/5'}`}>
                    {faq.icon}
                  </div>
                  <span className={`font-black text-xl md:text-2xl tracking-tighter transition-colors ${activeFaq === i ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {faq.q}
                  </span>
                </div>
                <div className={`shrink-0 ml-4 transition-transform duration-700 ${activeFaq === i ? 'rotate-180 text-neon-cyan' : 'text-slate-600'}`}>
                  <ChevronDown size={28} strokeWidth={3} />
                </div>
              </button>
              
              <AnimatePresence>
                {activeFaq === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }} 
                    className="overflow-hidden"
                  >
                    <div className="px-10 md:px-14 pb-12 md:ml-24 text-slate-400 text-lg md:text-xl leading-relaxed border-t border-white/5 pt-8 font-medium">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-32 p-16 rounded-[60px] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 text-center relative overflow-hidden backdrop-blur-xl"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
          <h2 className="text-3xl md:text-5xl font-black mb-8 uppercase tracking-tighter text-white">¿Aún con dudas?</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-12 text-xl font-medium">Nuestros ingenieros de audio están listos para asesorarte personalmente sin compromiso.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/contacto" className="bg-neon-cyan text-slate-950 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all hover:scale-105">
              Hablar con un Experto
            </Link>
            <a href="#" className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
              WhatsApp Directo
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;