import React from 'react';
import { motion } from 'framer-motion';
import { Music, Radio } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <img src="/logo.png" alt="RadiOlea Controls" className="h-24 md:h-40 w-auto mx-auto mb-8 object-contain" />
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
          Música ambiental para cada espacio. Controla la atmósfera de tu entorno con transmisión continua.
        </p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => document.getElementById('player-section').scrollIntoView({ behavior: 'smooth' })}
        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-lg font-semibold shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center gap-2"
      >
        <Music className="w-5 h-5" />
        Start Listening
      </motion.button>

      <div className="absolute bottom-10 animate-bounce">
        <svg 
          className="w-6 h-6 text-gray-500" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
