import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Music, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "Retail Premium",
    desc: "Aumenta el tiempo de permanencia con ritmos psicodinámicos.",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600",
    color: "neon-cyan"
  },
  {
    id: 2,
    title: "Fitness & Energy",
    desc: "Motivación máxima con BPMs sincronizados al entrenamiento.",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1600",
    color: "neon-purple"
  },
  {
    id: 3,
    title: "Gastronomía Pro",
    desc: "Privacidad y atmósferas envolventes con curaduría inteligente.",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1600",
    color: "neon-green"
  },
  {
    id: 4,
    title: "Zen & Yoga",
    desc: "Frecuencias delta y alfa para una conexión profunda cuerpo-mente.",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1600",
    color: "white"
  }
];

const PhotoCarousel = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.8 }
      }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 }
      }
    })
  };

  return (
    <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={SLIDES[index].img} 
              alt={SLIDES[index].title} 
              className="w-full h-full object-cover"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 md:p-24 pb-32 sm:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 text-${SLIDES[index].color}`} />
                <span className={`text-[8px] sm:text-[10px] font-heading font-black uppercase tracking-[0.4em] text-${SLIDES[index].color}`}>
                  Experiencia {SLIDES[index].title}
                </span>
              </div>
              
              <h3 className="font-display text-4xl sm:text-5xl md:text-7xl uppercase leading-none mb-4 sm:mb-6 tracking-tighter">
                Diseñamos <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${SLIDES[index].id === 1 ? 'from-neon-cyan to-blue-500' : SLIDES[index].id === 2 ? 'from-neon-purple to-pink-500' : SLIDES[index].id === 3 ? 'from-neon-green to-emerald-500' : 'from-white to-gray-500'}`}>
                  Atmósferas Únicas
                </span>
              </h3>
              
              <p className="text-gray-300 text-sm sm:text-lg md:text-xl font-light leading-relaxed mb-8 sm:mb-10 max-w-lg">
                {SLIDES[index].desc}
              </p>

              <div className="flex items-center gap-4 sm:gap-6">
                <div className="flex -space-x-2 sm:-space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-void overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Client" />
                    </div>
                  ))}
                </div>
                <span className="text-[8px] sm:text-[10px] font-heading font-bold uppercase tracking-widest text-gray-500">
                  +500 Marcas
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-10 right-8 sm:right-12 flex gap-3 sm:gap-4 z-10">
        <button 
          onClick={prev}
          className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-void transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={next}
          className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-void transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-10 left-8 sm:left-12 flex gap-1.5 sm:gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1);
              setIndex(i);
            }}
            className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ${index === i ? 'w-8 sm:w-12 bg-white' : 'w-2 sm:w-4 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoCarousel;
