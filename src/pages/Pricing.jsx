import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, ArrowRight, HelpCircle, TrendingUp, Info, Headphones, Activity, Star } from 'lucide-react';
import WaveCursor from '../components/WaveCursor';
import { useAuth } from '../components/AuthContext';
import { Link } from 'react-router-dom';

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

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePlanSelection = (planId, isContact) => {
    if (isContact) {
      navigate('/contacto');
      return;
    }
    navigate(`/checkout/${planId}`);
  };

  const plans = [
    {
      id: 'basico',
      name: 'Básico',
      price: '539',
      period: '/ mes',
      description: 'Ideal para sucursales individuales que buscan profesionalizar su ambiente.',
      features: [
        'Acceso vía Link Sucursal',
        'Ingeniería de Audio Base',
        'Licencias Musicales',
        'Soporte vía Ticket',
        'Calidad Estándar'
      ],
      cta: 'Empezar Ahora',
      highlight: false,
      accent: 'white/10'
    },
    {
      id: 'profesional',
      name: 'Pro Anual',
      price: '5,390',
      period: '/ año',
      description: 'Nuestra solución más popular. Maximiza tus ventas con ingeniería avanzada.',
      features: [
        'Todo lo del plan Mensual',
        '1 Mes Gratis Incluido',
        'Publicidad Personalizada',
        'Prioridad Técnica 24/7',
        'Calidad Ultra Premium',
        'Instalación Preferente'
      ],
      cta: 'Contratar Anual',
      highlight: true,
      badge: 'Más Elegido',
      accent: 'neon-cyan'
    },
    {
      id: 'corporativo',
      name: 'Corporativo',
      price: 'Custom',
      period: '',
      description: 'Para cadenas con más de 10 sucursales que requieren control total.',
      features: [
        'Todo lo del plan Profesional',
        'Panel Multi-Cuentas Pro',
        'API para Integraciones',
        'Gerente de Cuenta Dedicado',
        'Reportes de Audiencia Pro',
        'SLA Garantizado'
      ],
      cta: 'Contactar Ventas',
      highlight: false,
      accent: 'neon-purple',
      isContact: true
    }
  ];

  return (
    <div className="min-h-screen bg-void text-white selection:bg-neon-cyan/30 overflow-x-hidden relative">
      <Aurora />

      <div className="pt-32 pb-24 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          
          {/* Header */}
          <div className="text-center mb-16 md:mb-24 px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm"
            >
              <Star className="w-3 h-3 text-neon-cyan" />
              <span className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] text-neon-cyan">
                Inversión en Experiencia
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-7xl uppercase leading-tight md:leading-none mb-6 tracking-tight"
            >
              Planes de <span className="text-neon-cyan italic">Alto Impacto</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 max-w-2xl mx-auto text-sm md:text-lg font-light leading-relaxed"
            >
              Ingeniería de audio de elite con soporte técnico especializado 24/7 y resultados sonoros garantizados.
            </motion.p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-6 mb-32 items-stretch px-4 sm:px-0">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative group flex flex-col p-8 md:p-10 glass rounded-[2.5rem] overflow-hidden transition-all duration-500 border ${
                  plan.id === 'basico' ? 'border-neon-green/20 hover:border-neon-green shadow-[0_0_40px_rgba(57,255,20,0.05)] hover:shadow-[0_0_40px_rgba(57,255,20,0.2)]' : 
                  plan.id === 'profesional' ? 'border-neon-cyan/20 hover:border-neon-cyan shadow-[0_0_40px_rgba(0,243,255,0.05)] hover:shadow-[0_0_40px_rgba(0,243,255,0.2)]' : 
                  'border-neon-purple/20 hover:border-neon-purple shadow-[0_0_40px_rgba(188,19,254,0.05)] hover:shadow-[0_0_40px_rgba(188,19,254,0.2)]'
                }`}
              >
                {/* Glow Effect Background */}
                <div className={`absolute -inset-20 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none blur-[100px] ${
                  plan.id === 'basico' ? 'bg-neon-green' : 
                  plan.id === 'profesional' ? 'bg-neon-cyan' : 
                  'bg-neon-purple'
                }`} />
                {plan.badge && (
                  <div className="absolute top-6 right-6 px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full text-[9px] font-heading font-bold uppercase tracking-widest text-neon-cyan">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="font-display text-2xl uppercase tracking-wider mb-4 text-gray-400 group-hover:text-white transition-colors">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    {plan.price !== 'Custom' && <span className="text-lg font-light text-gray-500">$</span>}
                    <span className="text-5xl font-display text-white tracking-tighter">{plan.price}</span>
                    <span className="text-gray-500 font-heading text-[10px] uppercase tracking-widest ml-1">{plan.period}</span>
                  </div>
                  {plan.id === 'profesional' && (
                    <p className="text-neon-cyan text-[9px] font-heading font-bold mt-2 uppercase tracking-widest">
                      1 Mes Gratis Incluido
                    </p>
                  )}
                </div>

                <p className="text-gray-500 text-xs leading-relaxed mb-10 font-light h-12">
                  {plan.description}
                </p>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[11px] font-heading font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-300 transition-colors">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                        plan.id === 'basico' ? 'text-neon-green' : 
                        plan.id === 'profesional' ? 'text-neon-cyan' : 
                        'text-neon-purple'
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan.id, plan.isContact)}
                  className={`w-full py-4 rounded-full font-heading font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                    plan.id === 'basico' ? 'bg-white/5 border border-white/10 text-white hover:bg-neon-green hover:text-void hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]' :
                    plan.id === 'profesional' ? 'bg-neon-cyan text-void hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:scale-[1.02]' :
                    'bg-white/5 border border-white/10 text-white hover:bg-neon-purple hover:text-void hover:shadow-[0_0_20px_rgba(188,19,254,0.4)]'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Support Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-12 md:p-16 glass rounded-[3rem] overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-neon-cyan/5 rounded-full blur-[100px] transition-all group-hover:bg-neon-cyan/10" />
            
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="w-32 h-32 rounded-[2rem] bg-void border border-white/5 flex items-center justify-center shrink-0 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <Headphones className="w-16 h-16 text-neon-cyan" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="font-display text-3xl md:text-5xl uppercase leading-none mb-4 tracking-tight">
                  Soporte <span className="text-neon-cyan italic">Preferencial</span>
                </h2>
                <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-xl">
                  Nuestro equipo de ingenieros de audio monitorea tu señal en tiempo real para garantizar que tu marca nunca deje de sonar.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Info Bar */}
          <div className="mt-24 flex flex-wrap justify-center gap-10 opacity-40 hover:opacity-100 transition-opacity">
            {[
              { icon: TrendingUp, label: "Casos de Éxito" },
              { icon: Info, label: "Auditoría Sonora" },
              { icon: HelpCircle, label: "Preguntas FAQ" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 cursor-pointer group">
                <item.icon className="w-4 h-4 text-neon-cyan" />
                <span className="text-[10px] font-heading font-bold uppercase tracking-[0.3em] group-hover:text-neon-cyan transition-colors">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Pricing;

