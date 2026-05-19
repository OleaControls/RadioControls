import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Zap, MessageCircle, Sparkles, HelpCircle,
  ArrowRight, Activity, XCircle, CheckCircle2, ChevronDown,
  FileText, TrendingUp, Mic2, Wallet, Package, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* ─── Aurora ─────────────────────────────────────── */
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

const platforms = [
  { name: 'Spotify',     legal: false },
  { name: 'Youtube',     legal: false },
  { name: 'Apple Music', legal: false },
  { name: 'Radiolea',    legal: true  },
];

const categories = [
  {
    label: 'Servicio y Contratos',
    color: 'text-neon-cyan',
    icon: Package,
    items: [
      {
        q: '¿Cuál es su recomendación para adquirir el servicio?',
        a: 'Nuestra recomendación es adquirir tu sistema de sonido — lo diseñamos para durar, y así pagas solamente la mensualidad más baja. Si lo prefieres, puedes arrendar el equipo completo incluyendo la música, con el beneficio de que tu contrato te respalda por todo el tiempo que dure. Al final del contrato, tú decides si adquieres el equipo a un precio preferencial muy bajo. Si decides extender tu contrato de arrendamiento, actualizamos las bocinas (una bocina dura en promedio 10 años según la calidad de sus componentes).',
      },
      {
        q: '¿Hay periodo de prueba?',
        a: 'Sí. A partir de 10 sucursales montamos un demo completo: equipos de sonido, música y asesorías. Si no aumentan tus ventas mínimo un 15%, retiramos el equipo y no pagas ni un solo peso.',
      },
      {
        q: '¿Cuáles son sus formas de pago?',
        a: 'Aceptamos todas las formas de pago: transferencia bancaria, efectivo, cheque y tarjeta de crédito. El periodo a facturar puede ser anual, semestral, trimestral, bimestral o mensual — varía según el acuerdo al que lleguemos.',
      },
      {
        q: '¿Ofrecen garantía?',
        a: 'Ofrecemos garantía en los equipos de acuerdo al tiempo que indique el fabricante. Aplica cuando es por falla del equipo por defectos de fábrica, siempre y cuando no haya sido manipulado por personal ajeno a RadioleaControls ni dañado por algún factor externo o terceros.',
      },
      {
        q: '¿Cómo es la instalación?',
        a: 'Es 100% Cloud. Recibes accesos personalizados por sucursal que funcionan en cualquier navegador. Cero inversión en hardware propietario; solo conecta y suena.',
      },
    ],
  },
  {
    label: 'Música y Resultados',
    color: 'text-neon-purple',
    icon: TrendingUp,
    items: [
      {
        q: '¿Cómo mejora las ventas RadioleaControls?',
        a: 'Creamos un canal de música específico y psicodemográficamente diseñado. Diseñamos una atmósfera auditiva única seleccionando la música adecuada a tus clientes y a tu marca, sumado a un sistema de sonido ambiental que saca el máximo partido a tu lista de canciones personalizada. Además agregamos spots publicitarios que animan y fomentan la compra inmediata, e integramos mensajes diseñados científicamente que aumentan la felicidad.',
      },
      {
        q: '¿Por qué contratar a RadioleaControls?',
        a: 'Tenemos 15 años de experiencia en sonido ambiental. Diseñamos sistemas sonoros comerciales usando bases científicas y estándares de ingeniería. Nuestros servicios son profesionales — siempre estaremos junto a ti. Incluyen servicio técnico post-venta, garantías de fábrica, garantía de mano de obra por 3 años y cobertura de pagos de derechos de autor y difusión pública.',
      },
      {
        q: '¿Qué pasa si falla el internet?',
        a: 'Nuestra tecnología Buffer-Pro almacena hasta 15 minutos de audio en caché local, asegurando que la música nunca se detenga ante micro-cortes.',
      },
    ],
  },
  {
    label: 'Publicidad y Spots',
    color: 'text-neon-cyan',
    icon: Mic2,
    items: [
      {
        q: '¿Cómo funciona el servicio de anuncios o spots publicitarios?',
        a: 'Administramos y/o creamos tus spots de audio para que se transmitan dentro de tu negocio, los cuales se pueden alternar con la música de tu tienda. Te asesoramos para que obtengas la alternativa más adecuada para tu marca.',
      },
      {
        q: '¿Cuántos mensajes publicitarios incluyen en el precio mensual?',
        a: 'Ocho diferentes: uno para sábados, otro para domingos, otro de lunes a jueves, otro para viernes — y los otros 4 para promociones y/o mensajes especiales que tú nos indiques.',
      },
      {
        q: '¿Puedo reproducir o incluir mis propios spots?',
        a: 'Sí, puedes proporcionarnos tu publicidad para que nosotros la ingresemos a tu canal de música.',
      },
    ],
  },
  {
    label: 'Derechos de Autor',
    color: 'text-neon-purple',
    icon: ShieldCheck,
    items: [
      {
        q: '¿Mi nuevo canal de música ya viene con los derechos incluidos?',
        a: 'Con nosotros obtienes licencia autorizada para el uso legal de obras artísticas musicales de autores nacionales y/o internacionales para la ejecución pública en cualquier establecimiento (aplican restricciones en hoteles, bares, centros nocturnos y restaurantes). Todo establecimiento que haga uso de música en espacios públicos tiene la obligación de pagar derechos a SACM, ANDI y SOMEXFÓN. Nuestra responsabilidad es informarte sobre lo que estás obligado a pagar; tú decides si los pagas directamente ante cada asociación o a través de RadioleaControls.',
      },
      {
        q: '¿Qué pasa si no pago los derechos?',
        a: 'Como empresa tienes la obligación de realizar este pago. De lo contrario corres el riesgo de que algún gestor o asociación te lo requiera legalmente.',
      },
      {
        q: '¿Por qué pagar derechos de autor?',
        a: 'Para que la música sea utilizada de forma legal, ya que puede haber un lucro indirecto — por ejemplo, un bar que vende más cuando hay música que cuando no la hay.',
      },
      {
        q: '¿Entregan algún documento que ampare que estoy pagando los derechos?',
        a: 'Sí. Se hace un contrato que respalda que estás pagando los derechos a las sociedades correspondientes.',
      },
    ],
  },
];

const FAQ = () => {
  const [active, setActive] = useState({ cat: null, item: null });

  const toggle = (catIdx, itemIdx) => {
    if (active.cat === catIdx && active.item === itemIdx) {
      setActive({ cat: null, item: null });
    } else {
      setActive({ cat: catIdx, item: itemIdx });
    }
  };

  return (
    <div className="min-h-screen bg-void text-white selection:bg-neon-cyan/30 overflow-x-hidden relative">
      <Aurora />

      <div className="pt-32 pb-24 px-4 relative z-10">
        <div className="container mx-auto max-w-4xl">

          {/* ══ HEADER ═══════════════════════════════ */}
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm"
            >
              <Activity className="w-3 h-3 text-neon-cyan" />
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-neon-cyan">
                Centro de Conocimiento
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-5xl md:text-7xl uppercase leading-none mb-6 tracking-tight"
            >
              Preguntas <span className="text-neon-cyan italic">Frecuentes</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed"
            >
              Todo lo que necesitas saber sobre legalidad, tecnología y cómo impulsamos tu negocio.
            </motion.p>
          </div>

          {/* ══ COMPARATIVA LEGAL ════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-[2rem] md:rounded-[3rem] p-6 sm:p-10 md:p-14 mb-10 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />
            <span className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] text-neon-cyan mb-4 block">
              Legal y Confiable
            </span>
            <h2 className="font-display text-3xl md:text-4xl uppercase leading-tight mb-3 tracking-tight">
              Música para comercios <span className="text-neon-cyan italic">responsables</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto mb-12">
              Tu ambiente musical, siempre respaldado y en cumplimiento con <span className="text-white font-semibold">Radiolea.</span>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platforms.map((p) => (
                <motion.div
                  key={p.name}
                  whileHover={{ y: -4 }}
                  className={`rounded-[1.5rem] p-6 flex flex-col items-center gap-4 border transition-all duration-300 ${
                    p.legal
                      ? 'bg-neon-cyan/5 border-neon-cyan/30 shadow-[0_0_30px_rgba(0,243,255,0.08)]'
                      : 'bg-white/[0.02] border-white/[0.06]'
                  }`}
                >
                  {p.legal
                    ? <CheckCircle2 className="w-10 h-10 text-neon-cyan" />
                    : <XCircle className="w-10 h-10 text-red-500/70" />
                  }
                  <p className="font-display text-lg uppercase tracking-tight">{p.name}</p>
                  <p className={`text-[10px] font-heading font-bold uppercase tracking-widest ${
                    p.legal ? 'text-neon-cyan' : 'text-red-500/60'
                  }`}>
                    {p.legal ? 'Legal para uso comercial' : 'No legal para uso comercial'}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ══ ACCORDION POR CATEGORÍAS ═════════════ */}
          <div className="space-y-8">
            {categories.map((cat, catIdx) => {
              const CatIcon = cat.icon;
              return (
                <motion.div
                  key={catIdx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.08 }}
                >
                  {/* Categoría header */}
                  <div className="flex items-center gap-3 mb-3 px-2">
                    <div className={`w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${cat.color}`}>
                      <CatIcon size={14} />
                    </div>
                    <span className={`text-[10px] font-heading font-bold uppercase tracking-[0.3em] ${cat.color}`}>
                      {cat.label}
                    </span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>

                  {/* Items del accordion */}
                  <div className="space-y-2">
                    {cat.items.map((faq, itemIdx) => {
                      const isOpen = active.cat === catIdx && active.item === itemIdx;
                      return (
                        <div
                          key={itemIdx}
                          className={`rounded-[1.25rem] border transition-all duration-300 ${
                            isOpen
                              ? 'bg-white/[0.05] border-white/15'
                              : 'bg-white/[0.02] border-white/[0.07] hover:border-white/15 hover:bg-white/[0.04]'
                          }`}
                        >
                          <button
                            onClick={() => toggle(catIdx, itemIdx)}
                            className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 group"
                          >
                            <span className={`font-heading font-semibold text-sm md:text-base leading-snug transition-colors ${
                              isOpen ? 'text-white' : 'text-gray-300 group-hover:text-white'
                            }`}>
                              {faq.q}
                            </span>
                            <ChevronDown
                              size={16}
                              className={`shrink-0 transition-all duration-300 ${
                                isOpen ? `rotate-180 ${cat.color}` : 'text-gray-600 group-hover:text-gray-400'
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 border-t border-white/5 pt-4">
                                  <p className="text-gray-400 text-sm font-light leading-relaxed">
                                    {faq.a}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ══ CTA ══════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-8 sm:p-12 md:p-24 rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 overflow-hidden text-center mt-16"
          >
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-neon-cyan/5 rounded-full blur-[150px] animate-pulse" />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-display text-4xl md:text-6xl uppercase leading-none mb-6 tracking-tighter">
                ¿Aún con <span className="text-neon-cyan italic">dudas?</span>
              </h2>
              <p className="text-gray-400 text-base md:text-lg mb-10 font-light leading-relaxed">
                Nuestros ingenieros de audio están listos para asesorarte personalmente sin compromiso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contacto"
                  className="inline-flex items-center gap-3 bg-white text-void px-10 py-5 rounded-full font-heading font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                >
                  Contactar ahora <ArrowRight size={16} />
                </Link>
                <Link
                  to="/planes"
                  className="px-10 py-5 border border-white/10 rounded-full font-heading font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all backdrop-blur-sm"
                >
                  Explorar Planes
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default FAQ;
