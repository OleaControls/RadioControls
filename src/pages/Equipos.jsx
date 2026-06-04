import React from 'react';
import { motion } from 'framer-motion';
import { Speaker, Zap, Star, Clock, ShieldCheck, Headphones } from 'lucide-react';

const Aurora = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="animate-pulse absolute top-[20%] left-[-5%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-20"
      style={{ background: 'radial-gradient(circle, #00f3ff 0%, transparent 70%)', animationDuration: '3s' }} />
    <div className="animate-pulse absolute top-[15%] right-[-5%] w-[35vw] h-[35vw] rounded-full blur-[120px] opacity-15"
      style={{ background: 'radial-gradient(circle, #bc13fe 0%, transparent 70%)', animationDuration: '4s' }} />
  </div>
);

const packages = [
  {
    id: 'basico',
    name: 'Paquete Básico',
    description: 'Ideal para negocios pequeños que buscan una solución de audio de calidad.',
    color: 'cyan',
    icon: Speaker,
    features: [
      '2 bocinas de techo',
      'Amplificador 2 canales',
      'Instalación incluida',
      'Garantía 1 año',
      'Soporte técnico básico',
    ],
  },
  {
    id: 'profesional',
    name: 'Paquete Profesional',
    description: 'Perfecto para restaurantes, tiendas y espacios medianos con múltiples zonas.',
    color: 'purple',
    icon: Headphones,
    features: [
      '6 bocinas de techo',
      'Amplificador 4 canales',
      'Control de zonas',
      'Instalación incluida',
      'Garantía 2 años',
      'Soporte técnico prioritario',
    ],
  },
  {
    id: 'premium',
    name: 'Paquete Premium',
    description: 'Solución completa para hoteles, hospitales y grandes superficies comerciales.',
    color: 'green',
    icon: Star,
    features: [
      '12 bocinas de techo',
      'Amplificador multicanal',
      'Panel de control multi-zona',
      'Cableado profesional',
      'Instalación incluida',
      'Garantía 3 años',
      'Soporte VIP 12 hrs / 7 días',
    ],
  },
];

const colorMap = {
  cyan: {
    text: 'text-neon-cyan',
    border: 'border-neon-cyan/30',
    borderHover: 'hover:border-neon-cyan',
    bg: 'bg-neon-cyan/10',
    shadow: 'shadow-[0_0_40px_rgba(0,243,255,0.15)]',
    glow: 'bg-neon-cyan',
    badge: 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan',
  },
  purple: {
    text: 'text-neon-purple',
    border: 'border-neon-purple/30',
    borderHover: 'hover:border-neon-purple',
    bg: 'bg-neon-purple/10',
    shadow: 'shadow-[0_0_40px_rgba(188,19,254,0.15)]',
    glow: 'bg-neon-purple',
    badge: 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple',
  },
  green: {
    text: 'text-neon-green',
    border: 'border-neon-green/30',
    borderHover: 'hover:border-neon-green',
    bg: 'bg-neon-green/10',
    shadow: 'shadow-[0_0_40px_rgba(57,255,20,0.15)]',
    glow: 'bg-neon-green',
    badge: 'bg-neon-green/10 border-neon-green/30 text-neon-green',
  },
};

const Equipos = () => {
  return (
    <div className="min-h-screen bg-void text-white overflow-x-hidden relative">
      <Aurora />

      <div className="pt-32 pb-24 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">

          {/* Header */}
          <div className="text-center mb-16 px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-6"
            >
              <Clock className="w-3.5 h-3.5 text-neon-cyan" />
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-neon-cyan">
                Próximamente disponible
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl uppercase leading-tight mb-6 tracking-tight"
            >
              Equipos de{' '}
              <span className="text-neon-cyan italic">Sonido</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed"
            >
              Próximamente podrás adquirir nuestros paquetes de equipos de sonido profesional para tu negocio. Equipos de alta calidad con instalación incluida.
            </motion.p>
          </div>

          {/* Package Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {packages.map((pkg, i) => {
              const c = colorMap[pkg.color];
              const Icon = pkg.icon;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.3 }}
                  className={`relative group flex flex-col p-8 glass rounded-[2.5rem] overflow-hidden border ${c.border} ${c.shadow}`}
                >
                  {/* Próximamente overlay */}
                  <div className="absolute inset-0 bg-void/60 backdrop-blur-[2px] rounded-[2.5rem] z-10 flex items-center justify-center">
                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full border ${c.badge} shadow-lg`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-heading font-black uppercase tracking-[0.3em]">
                        Próximamente
                      </span>
                    </div>
                  </div>

                  {/* Glow bg */}
                  <div className={`absolute -inset-20 opacity-5 pointer-events-none blur-[100px] ${c.glow}`} />

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center mb-6`}>
                    <Icon className={`w-6 h-6 ${c.text}`} />
                  </div>

                  {/* Name */}
                  <span className={`text-[9px] font-heading font-black uppercase tracking-[0.4em] ${c.text} mb-2`}>
                    {pkg.name}
                  </span>

                  {/* Price placeholder */}
                  <div className="flex items-baseline gap-1 mt-3 mb-2">
                    <span className="text-lg font-light text-gray-600">$</span>
                    <span className="text-4xl font-display text-gray-600 tracking-tighter">- - -</span>
                  </div>
                  <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-gray-600 mb-6">
                    Precio por anunciar
                  </p>

                  {/* Description */}
                  <p className="text-gray-500 text-xs leading-relaxed mb-6">{pkg.description}</p>

                  {/* Features */}
                  <ul className="space-y-3 flex-grow">
                    {pkg.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-3 text-[11px] font-heading font-bold uppercase tracking-widest text-gray-600">
                        <ShieldCheck className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${c.text} opacity-50`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-16"
          >
            <p className="text-gray-500 text-sm">
              ¿Interesado en nuestros equipos?{' '}
              <a href="/contacto" className="text-neon-cyan hover:underline">
                Contáctanos
              </a>{' '}
              y te avisamos cuando estén disponibles.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Equipos;
