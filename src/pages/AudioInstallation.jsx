import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ShoppingBag, Radio, ShieldAlert } from 'lucide-react';
import WaveCursor from '../components/WaveCursor';

const AudioInstallation = () => {
  const services = [
    {
      title: "Venta de Equipos",
      desc: "Equipos de sonido ambiental de alta fidelidad para todo tipo de espacios comerciales y residenciales.",
      icon: <ShoppingBag className="w-8 h-8" />,
      items: ["Parlantes de Techo y Pared", "Amplificadores Profesionales", "Sistemas de Control de Zonas", "Accesorios Premium"]
    },
    {
      title: "Instalación Profesional",
      desc: "Ingeniería acústica aplicada para garantizar la mejor cobertura sonora en su establecimiento.",
      icon: <Radio className="w-8 h-8" />,
      items: ["Cableado Estructurado", "Calibración de Audio", "Configuración de Zonas", "Pruebas de Rendimiento"]
    },
    {
      title: "Mantenimiento",
      desc: "Aseguramos que su sistema de sonido funcione siempre al 100% con planes preventivos.",
      icon: <ShieldAlert className="w-8 h-8" />,
      items: ["Limpieza de Equipos", "Revisión de Conexiones", "Actualización de Sistemas", "Soporte Técnico 24/7"]
    }
  ];

  return (
    <div className="bg-royal-blue-dark min-h-screen text-white overflow-hidden">
      <WaveCursor />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-cyan/5 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-royal-blue/10 blur-[120px] rounded-full -ml-64 -mb-64" />

      {/* Hero Section */}
      <section className="relative pt-48 pb-20 px-4 text-center z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-5xl mx-auto"
        >
          <span className="bg-neon-cyan/10 border border-neon-cyan/20 px-4 py-2 rounded-full text-neon-cyan text-[10px] font-black tracking-[0.3em] uppercase mb-8 inline-block shadow-[0_0_20px_rgba(0,243,255,0.1)]">
            Ingeniería & Sonido Ambiental
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tighter uppercase">
            Instalación de <br/> <span className="text-neon-cyan italic">Sistemas de Audio</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Desde el mantenimiento preventivo hasta la venta e instalación completa de equipos de sonido ambiental para casas, hoteles y restaurantes.
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[40px] hover:border-neon-cyan/30 transition-all duration-500"
            >
              <div className="mb-8 p-4 bg-royal-blue-dark border border-white/5 w-fit rounded-2xl text-neon-cyan group-hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all">
                {service.icon}
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter italic">{service.title}</h3>
              <p className="text-gray-400 text-sm mb-8 font-medium leading-relaxed">
                {service.desc}
              </p>
              <ul className="space-y-3">
                {service.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs font-bold text-gray-300">
                    <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cable Alert Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 p-12 md:p-20 rounded-[50px] text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-red-500/10" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-8 animate-pulse" />
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                ¿La calidad de audio <span className="text-red-500 italic">ya no es la misma?</span>
              </h2>
              <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8">
                Alerta de Mantenimiento
              </div>
              <p className="text-lg md:text-xl text-gray-300 font-medium leading-relaxed mb-10">
                ¿Sabías que el cable de audio tiene una <span className="text-white font-bold underline decoration-red-500">vida útil de 10 años</span>? El desgaste interno puede reducir drásticamente la fidelidad y potencia de tus parlantes.
              </p>
              <p className="text-gray-400 font-bold italic mb-0">
                Si sientes que la calidad es mala o hay ruidos extraños, es momento de renovar.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA / Contact */}
      <section className="py-32 px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-12">
            ¿Listo para elevar <br/> tu <span className="text-neon-cyan">Ambiente Sonoro?</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="https://wa.me/TUNUMERO" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto bg-neon-cyan text-royal-blue-dark px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:shadow-[0_0_40px_rgba(0,243,255,0.6)] transition-all flex items-center justify-center gap-3 hover:scale-105"
            >
              Contactar por WhatsApp <Phone className="w-5 h-5" />
            </a>
            <a 
              href="mailto:TUEMAIL" 
              className="w-full sm:w-auto bg-white/5 backdrop-blur-md border border-white/10 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              Enviar Email <Mail className="w-5 h-5" />
            </a>
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-40">
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Hoteles</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Restaurantes</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Gimnasios</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Residencias</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AudioInstallation;
