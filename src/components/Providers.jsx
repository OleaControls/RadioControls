import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wifi, Speaker, Radio, Settings, Zap, ArrowRight } from 'lucide-react';

const devices = [
  { 
    id: 1,
    name: 'RC-Streamer Pro', 
    icon: <Cpu />, 
    tag: 'Best Seller',
    features: ['Procesador 4-Core', 'DAC 24-bit/192kHz', 'Salida Óptica'],
    description: 'El corazón de tu sistema. Decodificación de audio de alta fidelidad con buffer inteligente para reproducción ininterrumpida.' 
  },
  { 
    id: 2,
    name: 'Zone Controller X', 
    icon: <Settings />, 
    tag: 'Multi-Zona',
    features: ['Control de 4 Zonas', 'Balance Automático', 'App Control'],
    description: 'Gestiona el volumen y la música de hasta 4 áreas diferentes desde un solo dispositivo centralizado.' 
  },
  { 
    id: 3,
    name: 'OmniSpeaker 360', 
    icon: <Speaker />, 
    tag: 'Inalámbrico',
    features: ['Sonido 360°', 'Batería 12h', 'Resistente IP67'],
    description: 'Altavoz ambiental de dispersión total. Ideal para exteriores o espacios donde el cableado es difícil.' 
  },
  { 
    id: 4,
    name: 'Connect Hub V2', 
    icon: <Wifi />, 
    tag: 'Network',
    features: ['WiFi 6E', 'Puerto Gigabit', 'Baja Latencia'],
    description: 'Garantiza que la música nunca se detenga. Conexión redundante y priorización de tráfico de audio.' 
  },
  { 
    id: 5,
    name: 'AmpBooster 500W', 
    icon: <Zap />, 
    tag: 'Potencia',
    features: ['500 Watts RMS', 'Clase D Eficiente', 'Sin Calentamiento'],
    description: 'Potencia pura para grandes superficies comerciales. Sonido claro y fuerte sin distorsión.' 
  },
  { 
    id: 6,
    name: 'Touch Panel Wall', 
    icon: <Radio />, 
    tag: 'Interfaz',
    features: ['Pantalla 7" HD', 'Táctil Capacitivo', 'PoE'],
    description: 'Control elegante empotrado en pared. Permite al personal cambiar el ambiente con un solo toque.' 
  },
];

const Providers = () => {
  return (
    <section className="min-h-screen py-24 px-4 bg-black relative z-10 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_10%,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center mb-20 max-w-3xl"
      >
        <span className="text-cyan-400 font-mono text-sm tracking-widest uppercase mb-4 block">Hardware Premium</span>
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white tracking-tight">
          Nuestros Dispositivos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Ambientales</span>
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Equipamiento diseñado específicamente para uso continuo en retail y hospitalidad. 
          Robustez, calidad de audio y conectividad inigualable.
        </p>
      </motion.div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -10 }}
            className="group relative bg-gray-900 border border-gray-800 rounded-3xl p-1 overflow-hidden hover:border-cyan-500/50 transition-colors duration-500"
          >
            {/* Inner Card */}
            <div className="bg-black/50 backdrop-blur-xl rounded-[20px] p-8 h-full flex flex-col relative z-10">
              
              {/* Header Icon & Tag */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500 text-cyan-400 shadow-lg shadow-black/50 group-hover:shadow-cyan-500/20">
                  {React.cloneElement(device.icon, { className: "w-7 h-7" })}
                </div>
                <span className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-xs font-mono text-gray-300 group-hover:border-cyan-500/30 transition-colors">
                  {device.tag}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {device.name}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                {device.description}
              </p>

              {/* Features List */}
              <div className="space-y-3 border-t border-gray-800 pt-6 mb-6">
                {device.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Action */}
              <button className="w-full py-3 rounded-xl border border-gray-700 text-white font-medium hover:bg-white hover:text-black hover:border-white transition-all duration-300 flex items-center justify-center gap-2 group/btn">
                Ver Especificaciones
                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Providers;