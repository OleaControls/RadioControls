import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe, ShieldCheck, Sparkles, Activity } from 'lucide-react';
import WaveCursor from '../components/WaveCursor';

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

const Contact = () => {
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // 'sending' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setStatus(data.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-void text-white selection:bg-neon-cyan/30 overflow-x-hidden relative">
      <Aurora />

      <div className="pt-32 pb-24 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          
          {/* Header */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm"
            >
              <Activity className="w-3 h-3 text-neon-cyan" />
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-neon-cyan">
                estamos para servir
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-5xl md:text-7xl uppercase leading-none mb-6 tracking-tight"
            >
              AUMENTEMOS YA <span className="text-neon-cyan italic">TUS VENTAS</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed"
            >
              Transformemos tu espacio en un lugar motivador de compra.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              {[
                { 
                  icon: Mail, 
                  label: "Conozcamos tu proyecto",
                  value: "sistemas@radioleacontrols.com",
                  accent: "text-neon-cyan"
                },
                { 
                  icon: MessageCircle, 
                  label: "Línea Directa", 
                  value: "55 7919 2845",
                  links: [
                    { label: "WhatsApp", url: "https://wa.me/525579192845" },
                    { label: "Telegram", url: "https://t.me/525579192845" }
                  ],
                  accent: "text-white"
                },
                { 
                  icon: MapPin, 
                  label: "Sede Central", 
                  value: "Polanco, CDMX, México",
                  accent: "text-neon-purple"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-5 sm:p-8 glass rounded-[2rem] flex items-center gap-4 sm:gap-6 transition-all hover:border-white/20"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${item.accent} group-hover:scale-110 transition-transform`}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <p className="text-[9px] font-heading font-bold uppercase text-gray-500 tracking-[0.3em] mb-1">{item.label}</p>
                    {item.links ? (
                      <div className="flex gap-4">
                        {item.links.map((link, lIdx) => (
                          <a 
                            key={lIdx} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-display uppercase tracking-wider text-white hover:text-neon-cyan transition-colors border-b border-white/10 pb-1"
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-lg font-display uppercase tracking-wider text-white">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Support Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative p-10 glass rounded-[2.5rem] bg-gradient-to-br from-neon-cyan/5 to-transparent border-neon-cyan/20 overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-display text-2xl uppercase text-white mb-4 flex items-center gap-3 tracking-wider">
                  <Clock className="w-5 h-5 text-neon-cyan" /> Elevemos tu Marca
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-8 font-light">
                  Auténtica experiencia musical que se siente - Si prefieres hablar con alguien, solo mándanos tus datos solicitando una reunión en línea para conocer tu proyecto, retos y darte las opciones de éxito.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-void bg-gray-800" />
                    ))}
                  </div>
                  <p className="text-[10px] font-heading font-bold text-neon-cyan uppercase tracking-widest leading-tight">
                    El éxito es siempre trabajo en equipo - hagamos un gran equipo.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-[80px] pointer-events-none" />
              
              <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-heading font-bold uppercase text-gray-500 ml-4 tracking-widest">Nombre</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-neon-cyan transition-all text-sm font-light placeholder:text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-heading font-bold uppercase text-gray-500 ml-4 tracking-widest">Empresa</label>
                    <input
                      type="text"
                      placeholder="Negocio"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-neon-cyan transition-all text-sm font-light placeholder:text-gray-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-bold uppercase text-gray-500 ml-4 tracking-widest">Email Corporativo</label>
                  <input
                    type="email"
                    placeholder="ejemplo@marca.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-neon-cyan transition-all text-sm font-light placeholder:text-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-heading font-bold uppercase text-gray-500 ml-4 tracking-widest">Mensaje</label>
                  <textarea
                    placeholder="Cuéntanos sobre tu visión sonora..."
                    rows="4"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-neon-cyan transition-all text-sm font-light placeholder:text-gray-700 resize-none"
                  ></textarea>
                </div>

                {status === 'success' && (
                  <p className="text-neon-cyan text-sm text-center font-heading font-bold uppercase tracking-widest">¡Mensaje enviado! Te contactaremos pronto.</p>
                )}
                {status === 'error' && (
                  <p className="text-red-400 text-sm text-center font-heading font-bold uppercase tracking-widest">Error al enviar. Intenta de nuevo.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending' || status === 'success'}
                  className="w-full py-5 bg-white text-void rounded-full font-heading font-black text-sm uppercase tracking-[0.2em] hover:bg-neon-cyan hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Enviando...' : 'Enviar Solicitud'}
                  <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;