import React from 'react';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { Zap, ShieldCheck, MessageSquare, TrendingUp, ArrowRight, Radio, Sparkles } from 'lucide-react';
import WaveCursor from '../components/WaveCursor';
=======
import { Zap, ShieldCheck, MessageSquare, TrendingUp, ArrowRight, Radio } from 'lucide-react';
>>>>>>> upstream/main

const services = [
  {
    icon: <Zap />,
    title: "Psicología del Sonido",
<<<<<<< HEAD
    tag: "Ingeniería",
    description: "Diseñamos atmósferas que influyen en el comportamiento de compra y mejoran el rendimiento laboral mediante frecuencias optimizadas.",
    imageUrl: "https://images.unsplash.com/photo-1514525253361-bee8718a7439?auto=format&fit=crop&q=80&w=1000",
=======
    description: "Ingeniería de audio para crear listas de reproducción que influyen positivamente en el comportamiento de compra y mejoran el ambiente laboral.",
>>>>>>> upstream/main
  },
  {
    icon: <ShieldCheck />,
    title: "AMPROFON Legal",
<<<<<<< HEAD
    tag: "Legalidad",
    description: "Gestión absoluta de licencias de autor. Protegemos tu marca contra multas y auditorías con certificaciones vigentes.",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000",
  },
  {
    icon: <MessageSquare />,
    title: "Publicidad Local",
    tag: "Marketing",
    description: "Inserción orgánica de spots y avisos. Convierte tu música ambiental en un potente canal de ventas directo al oído de tu cliente.",
    imageUrl: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=1000",
  },
  {
    icon: <TrendingUp />,
    title: "Control Cloud",
    tag: "Tecnología",
    description: "Administración centralizada global. Gestiona miles de sucursales en tiempo real desde una interfaz intuitiva y potente.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
=======
    description: "Gestión integral de licencias de derechos de autor. Protegemos tu marca contra multas y problemas legales relacionados con la música.",
  },
  {
    icon: <MessageSquare />,
    title: "Publicidad Localizada",
    description: "Integramos tus mensajes promocionales y anuncios de forma orgánica en el flujo musical de cada sucursal para un marketing efectivo.",
  },
  {
    icon: <TrendingUp />,
    title: "Control Centralizado",
    description: "Administra todas tus tiendas desde un solo panel. Asigna diferentes géneros o mensajes según la zona geográfica o el horario.",
>>>>>>> upstream/main
  },
];

const Services = () => {
<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      <WaveCursor />
=======
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-royal-blue-dark text-white overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] z-0"></div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-royal-blue-dark bg-[radial-gradient(#00f3ff33_1px,transparent_1px)] [background-size:16px_16px]"></div>
>>>>>>> upstream/main
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(0,243,255,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="pt-40 pb-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
<<<<<<< HEAD
          {/* Header */}
          <div className="text-center mb-28">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-black uppercase tracking-[0.3em] mb-8"
            >
              <Sparkles className="w-4 h-4" /> Soluciones de Elite
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black mb-8 tracking-tight uppercase leading-tight"
            >
              Audio <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-500 italic pr-4">Intelligence</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed"
            >
              No somos un reproductor de música. Somos la plataforma de ingeniería acústica que define la experiencia de tu marca.
            </motion.p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-slate-900/40 backdrop-blur-xl rounded-[40px] border border-white/5 overflow-hidden transition-all duration-500 hover:border-neon-cyan/30 hover:shadow-[0_0_50px_-12px_rgba(0,243,255,0.2)]"
              >
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={service.imageUrl} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 bg-neon-cyan text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {service.tag}
                    </span>
                  </div>
                </div>

                <div className="p-10 -mt-12 relative z-10">
                  <div className="w-20 h-20 flex items-center justify-center bg-slate-950 rounded-3xl mb-8 border border-white/10 text-neon-cyan group-hover:border-neon-cyan/50 group-hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all duration-500 group-hover:-rotate-6">
                    {React.cloneElement(service.icon, { className: 'w-10 h-10' })}
                  </div>
                  <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter text-white group-hover:text-neon-cyan transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8 font-medium">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center gap-3 text-neon-cyan font-black text-xs uppercase tracking-[0.2em] cursor-pointer group/link">
                    Explorar Tecnología 
                    <ArrowRight className="w-5 h-5 transition-transform group-hover/link:translate-x-2" />
                  </div>
=======
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-bold text-neon-cyan uppercase tracking-[0.3em] mb-4">Soluciones Integrales</h2>
            <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
              Nuestros <span className="text-neon-cyan italic">Servicios</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Tecnología sonora de vanguardia diseñada para transformar y maximizar el potencial de tu espacio comercial.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative flex flex-col bg-royal-blue/80 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-neon-cyan/50 hover:shadow-2xl hover:shadow-neon-cyan/10"
              >
                <div className="p-8 flex-grow">
                  <div className="w-16 h-16 flex items-center justify-center bg-royal-blue-dark rounded-2xl mb-6 border-2 border-neon-cyan/50 text-neon-cyan group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                    {React.cloneElement(service.icon, { className: 'w-8 h-8' })}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{service.description}</p>
                </div>
                <div className="px-8 py-4 bg-royal-blue-dark/50 text-neon-cyan flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">Saber más</span>
                  <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
>>>>>>> upstream/main
                </div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
<<<<<<< HEAD
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 p-1 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-[50px]"
          >
            <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[49px] p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-3xl rounded-full -mr-32 -mt-32" />
              
              <Radio className="w-16 h-16 text-neon-cyan mx-auto mb-8 animate-pulse" />
              <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter">
                ¿Tu marca tiene <span className="italic">voz propia?</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
                Únete a las empresas que ya están facturando más gracias a una estrategia de audio profesional.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="px-12 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest hover:bg-neon-cyan transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,243,255,0.4)]">
                  Comenzar Ahora
                </button>
                <button className="px-12 py-5 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest border border-white/10 hover:bg-white/5 transition-all">
                  Ver Demo Live
                </button>
=======
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-24 text-center"
          >
            <div className="inline-block bg-royal-blue/80 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-neon-cyan to-neon-purple rounded-2xl shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                  <Radio className="w-10 h-10 text-royal-blue-dark" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">¿Listo para transformar tu negocio?</h3>
                  <p className="text-gray-400 mb-6 max-w-md">Descubre cómo nuestra tecnología de audio puede impulsar tus ventas y mejorar la experiencia de tus clientes.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-neon-cyan text-royal-blue-dark px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all"
                  >
                    Contactar a un experto
                  </motion.button>
                </div>
>>>>>>> upstream/main
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Services;
