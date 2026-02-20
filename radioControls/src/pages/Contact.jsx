import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import WaveCursor from '../components/WaveCursor';

const Contact = () => {
  return (
    <div className="pt-40 pb-24 px-4 min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <WaveCursor />
      
      {/* Decorative Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-black uppercase tracking-[0.3em] mb-8"
          >
            <Sparkles className="w-4 h-4" /> Ingeniería de Contacto
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black mb-8 tracking-tight uppercase leading-tight"
          >
            Hablemos de <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 italic pr-4">tu Éxito</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Nuestros ingenieros están listos para transformar tu espacio. Respuesta garantizada en tiempo récord.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Info Cards */}
          <div className="lg:col-span-5 space-y-8">
            {[
              { 
                icon: <Mail className="w-7 h-7" />, 
                label: "Email Corporativo", 
                value: "hola@radiocontrols.mx",
                color: "text-neon-cyan"
              },
              { 
                icon: <Phone className="w-7 h-7" />, 
                label: "Línea Directa / WhatsApp", 
                value: "+52 (55) 1234-5678",
                color: "text-neon-green"
              },
              { 
                icon: <MapPin className="w-7 h-7" />, 
                label: "Sede Central", 
                value: "Polanco, CDMX, México",
                color: "text-neon-purple"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/50 border border-white/5 rounded-[32px] p-8 flex items-center gap-8 group transition-all hover:border-neon-cyan/30 hover:bg-slate-900/80 backdrop-blur-xl"
              >
                <div className={`p-5 rounded-2xl bg-slate-950 ${item.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2">{item.label}</p>
                  <p className="text-xl font-black text-white">{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Support Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-neon-cyan/20 to-blue-600/20 border border-neon-cyan/30 rounded-[40px] p-10 mt-12 backdrop-blur-2xl"
            >
              <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tighter">
                <Clock className="w-6 h-6 text-neon-cyan" /> Soporte Elite 24/7
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed mb-8 font-medium">
                Nuestros clientes activos cuentan con una línea prioritaria de ingeniería para ajustes en tiempo real.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-800" />
                  ))}
                </div>
                <p className="text-xs font-black text-neon-cyan uppercase tracking-widest">Ingenieros Activos</p>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-slate-900/40 border border-white/5 rounded-[50px] p-10 md:p-16 backdrop-blur-2xl shadow-2xl relative"
          >
            <form className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Nombre Completo</label>
                  <input 
                    type="text" 
                    placeholder="Juan Pérez" 
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl py-6 px-8 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all text-white font-medium placeholder:text-slate-700" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Empresa</label>
                  <input 
                    type="text" 
                    placeholder="Marca / Negocio" 
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl py-6 px-8 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all text-white font-medium placeholder:text-slate-700" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Correo Corporativo</label>
                <input 
                  type="email" 
                  placeholder="juan@empresa.mx" 
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl py-6 px-8 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all text-white font-medium placeholder:text-slate-700" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase text-slate-500 ml-4 tracking-widest">Proyecto / Mensaje</label>
                <textarea 
                  placeholder="Cuéntanos sobre tu visión sonora..." 
                  rows="4" 
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl py-6 px-8 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 transition-all text-white font-medium placeholder:text-slate-700 resize-none"
                ></textarea>
              </div>

              <button className="w-full py-6 bg-neon-cyan text-slate-950 rounded-2xl font-black text-xl hover:shadow-[0_0_50px_rgba(0,243,255,0.4)] transition-all flex items-center justify-center gap-4 active:scale-95 uppercase tracking-tighter group">
                Enviar Solicitud
                <Send className="w-6 h-6 transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;