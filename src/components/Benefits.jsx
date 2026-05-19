import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Megaphone, HardDrive, Wifi,
  ListMusic, UploadCloud, Volume2, RefreshCw,
  Clock, Calendar, Tag, Zap,
  CheckCircle2, XCircle, MonitorSmartphone,
  Radio, Activity, AlertTriangle
} from 'lucide-react';

/* ─── Fade-up variant ─────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

/* ─── Sub-feature pill ────────────────────────────── */
const Pill = ({ icon: Icon, label, color = 'cyan' }) => {
  const colors = {
    cyan:   'bg-neon-cyan/10   text-neon-cyan   border-neon-cyan/20',
    purple: 'bg-neon-purple/10 text-neon-purple border-neon-purple/20',
    green:  'bg-neon-green/10  text-neon-green  border-neon-green/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-heading font-bold uppercase tracking-widest ${colors[color]}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

/* ─── Competitor row ──────────────────────────────── */
const CompRow = ({ label, them, us }) => (
  <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center py-3 border-b border-white/5 last:border-0">
    <span className="text-xs text-gray-400 font-heading">{label}</span>
    <span className="flex items-center gap-1.5 text-[11px] text-red-400 font-bold uppercase tracking-wider">
      <XCircle className="w-3.5 h-3.5" /> {them}
    </span>
    <span className="flex items-center gap-1.5 text-[11px] text-neon-cyan font-bold uppercase tracking-wider">
      <CheckCircle2 className="w-3.5 h-3.5" /> {us}
    </span>
  </div>
);

/* ─── Main component ──────────────────────────────── */
const Benefits = () => {
  return (
    <section className="py-28 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-neon-cyan/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[40vh] bg-neon-purple/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10">

        {/* ── Section Header ────────────────────────────── */}
        <motion.div {...fadeUp()} className="text-center mb-20">
          <span className="text-[10px] font-heading font-black uppercase tracking-[0.45em] text-neon-cyan">
            Ventajas Exclusivas
          </span>
          <h2 className="font-display text-4xl md:text-6xl uppercase leading-none mt-3 mb-4">
            Más Beneficios con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple animate-gradient bg-[length:200%_auto]">
              RadioleaControls
            </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            Ustedes pueden administrarlo o nosotros lo gestionamos por usted.
          </p>
        </motion.div>

        {/* ── Bento Grid ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

          {/* 1 ─ Control Centralizado (wide) */}
          <motion.div
            {...fadeUp(0.1)}
            whileHover={{ y: -6 }}
            className="md:col-span-7 glass rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
            <div className="absolute top-6 right-6">
              <Building2 className="w-14 h-14 text-neon-cyan opacity-10 group-hover:opacity-30 transition-opacity duration-500" />
            </div>
            <div className="relative z-10">
              <div className="w-11 h-11 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mb-5">
                <Building2 className="w-5 h-5 text-neon-cyan" />
              </div>
              <span className="text-[9px] font-heading font-black uppercase tracking-[0.4em] text-neon-cyan">01</span>
              <h3 className="font-display text-2xl md:text-3xl mt-2 mb-4 leading-snug">
                Control Centralizado de<br />
                <span className="text-neon-cyan">Múltiples Sucursales</span>
              </h3>
              <p className="text-gray-400 text-sm mb-6 max-w-sm leading-relaxed">
                Administre tiendas, restaurantes, oficinas, gimnasios u hoteles desde una sola plataforma inteligente.
              </p>
              <div className="flex flex-wrap gap-2">
                <Pill icon={ListMusic}    label="Cambiar 50 playlists"  color="cyan"   />
                <Pill icon={UploadCloud}  label="Promos automáticas"    color="cyan"   />
                <Pill icon={Volume2}      label="Volumen remoto"         color="cyan"   />
                <Pill icon={RefreshCw}    label="Reinicio sin salir"     color="cyan"   />
              </div>
            </div>
          </motion.div>

          {/* 2 ─ Publicidad Programada (narrow) */}
          <motion.div
            {...fadeUp(0.2)}
            whileHover={{ y: -6 }}
            className="md:col-span-5 glass rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group bg-gradient-to-br from-neon-purple/10 to-transparent"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
            <div className="relative z-10 text-left">
              <div className="w-11 h-11 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center mb-5">
                <Megaphone className="w-5 h-5 text-neon-purple" />
              </div>
              <span className="text-[9px] font-heading font-black uppercase tracking-[0.4em] text-neon-purple">02</span>
              <h3 className="font-display text-2xl mt-2 mb-4 leading-snug">
                Publicidad Programada<br />
                <span className="text-neon-purple">Automática</span>
              </h3>
              <div className="space-y-2.5 mt-5">
                {[
                  { icon: Clock,    label: 'Programar spots',              color: 'text-neon-purple' },
                  { icon: Radio,    label: 'Anuncios cada X tiempo',       color: 'text-neon-purple' },
                  { icon: Tag,      label: 'Promociones por horario',      color: 'text-neon-purple' },
                  { icon: Calendar, label: 'Automatizar campañas',         color: 'text-neon-purple' },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
                    <span className="text-xs text-gray-300 font-heading">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 3 ─ Hardware Robusto (narrow) */}
          <motion.div
            {...fadeUp(0.3)}
            whileHover={{ y: -6 }}
            className="md:col-span-5 glass rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
            <div className="relative z-10 text-left">
              <div className="w-11 h-11 rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mb-5">
                <HardDrive className="w-5 h-5 text-neon-green" />
              </div>
              <span className="text-[9px] font-heading font-black uppercase tracking-[0.4em] text-neon-green">03</span>
              <h3 className="font-display text-2xl mt-2 mb-4 leading-snug">
                Hardware Robusto<br />
                <span className="text-neon-green">Diseñado para Durar</span>
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Equipos industriales con garantía de 3 años. Sin PCs improvisadas, sin Android TV, sin soluciones hechizas.
              </p>
              <div className="mt-6 flex gap-2">
                <Pill icon={Zap}        label="Alta Estabilidad"   color="green" />
                <Pill icon={CheckCircle2} label="3 Años garantía"  color="green" />
              </div>
            </div>
          </motion.div>

          {/* 4 ─ Monitoreo Remoto (wide) */}
          <motion.div
            {...fadeUp(0.35)}
            whileHover={{ y: -6 }}
            className="md:col-span-7 glass rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-neon-cyan/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
            <div className="absolute bottom-6 right-6">
              <Activity className="w-20 h-20 text-neon-cyan opacity-5 group-hover:opacity-20 transition-opacity duration-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                  <Wifi className="w-5 h-5 text-neon-cyan" />
                </div>
                <span className="flex h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
              </div>
              <span className="text-[9px] font-heading font-black uppercase tracking-[0.4em] text-neon-cyan">04</span>
              <h3 className="font-display text-2xl md:text-3xl mt-2 mb-4 leading-snug">
                Monitoreo Remoto<br />
                <span className="text-neon-cyan">en Tiempo Real</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { icon: MonitorSmartphone, label: 'Sucursal online/offline' },
                  { icon: Radio,             label: 'Audio en reproducción'   },
                  { icon: Volume2,           label: 'Volumen actual'          },
                  { icon: Activity,          label: 'Estado del dispositivo'  },
                  { icon: AlertTriangle,     label: 'Fallos y desconexiones'  },
                  { icon: Wifi,              label: 'Señal de red'            },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5 bg-white/[0.03] border border-white/5 rounded-2xl px-3 py-2.5">
                    <Icon className="w-3.5 h-3.5 text-neon-cyan flex-shrink-0" />
                    <span className="text-[11px] text-gray-300 font-heading leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Differentiator vs Competencia ─────────────── */}
        <motion.div {...fadeUp(0.4)} className="mt-8">
          <div className="glass rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/[0.06] rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                <div>
                  <span className="text-[9px] font-heading font-black uppercase tracking-[0.45em] text-neon-purple">
                    Diferenciador Clave
                  </span>
                  <h3 className="font-display text-2xl md:text-4xl mt-2 uppercase leading-none">
                    Nosotros vs{' '}
                    <span className="text-neon-purple italic">Competencia Local</span>
                  </h3>
                </div>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed md:text-right">
                  La mayoría de empresas de audio ambiental en México operan con soluciones precarias.
                </p>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 pb-2 mb-1">
                <span className="text-[9px] font-heading font-black uppercase tracking-[0.35em] text-gray-600">Aspecto</span>
                <span className="text-[9px] font-heading font-black uppercase tracking-[0.35em] text-red-500 text-right">Competencia</span>
                <span className="text-[9px] font-heading font-black uppercase tracking-[0.35em] text-neon-cyan text-right">Radiolea</span>
              </div>

              <div className="space-y-0">
                <CompRow label="Equipos"           them="Hechizos / improvisados"  us="Hardware Empresarial" />
                <CompRow label="Dispositivos"      them="PCs viejas / Android TV"  us="Hardware dedicado"   />
                <CompRow label="Streaming"         them="Spotify normal"            us="Plataforma propia"   />
                <CompRow label="Estabilidad"       them="Muy baja"                  us="99% uptime"          />
                <CompRow label="Monitoreo"         them="Sin visibilidad"           us="Tiempo real"         />
                <CompRow label="Publicidad"        them="Manual / inexistente"      us="Automática"          />
                <CompRow label="Gestión masiva"    them="Sucursal por sucursal"     us="Centralizada"        />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Benefits;
