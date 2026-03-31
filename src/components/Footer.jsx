import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SOCIAL = [Twitter, Facebook, Instagram, Linkedin];

const SERVICES = [
  'Streaming de Audio',
  'Instalación Profesional',
  'Licencias Musicales',
  'Publicidad Sonora',
  'Panel de Control',
];

const COMPANY = [
  ['Inicio',   '/'],
  ['Planes',   '/planes'],
  ['Galería',  '/galeria'],
  ['FAQ',      '/faq'],
  ['Contacto', '/contacto'],
];

const FooterLink = ({ href, to, children }) => {
  const cls =
    'group flex items-center gap-0 text-gray-500 text-sm hover:text-neon-cyan transition-colors duration-200';
  const inner = (
    <>
      <span className="inline-block w-0 group-hover:w-3 h-px bg-neon-cyan transition-all duration-300 mr-0 group-hover:mr-1.5" />
      {children}
    </>
  );
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return <a href={href || '#'} className={cls}>{inner}</a>;
};

const Footer = () => (
  <footer className="relative bg-black overflow-hidden">

    {/* ── Top wave SVG ─────────────────────── */}
    <div className="absolute top-0 left-0 w-full leading-none overflow-hidden">
      <svg
        viewBox="0 0 1440 90"
        className="w-full"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <path
          d="M0,45 C240,90 480,0 720,45 C960,90 1200,10 1440,45 L1440,0 L0,0 Z"
          fill="#001a4d"
        />
      </svg>
    </div>

    {/* ── Neon top glow ───────────────────── */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-48 bg-neon-cyan/5 rounded-full blur-[90px] pointer-events-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10 relative z-10">

      {/* ── Main grid ───────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">

        {/* Brand */}
        <div className="space-y-5 sm:col-span-2 lg:col-span-1">
          <img
            src="/img%20radio%20olea/logosinfondoradioolea.svg"
            alt="RadiOlea Controls"
            className="h-10 w-auto object-contain"
          />
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Transformando espacios comerciales a través del poder del sonido.
            Audio ambiental premium para marcas líderes en México.
          </p>
          <div className="flex gap-2.5 pt-1">
            {SOCIAL.map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -3, scale: 1.12 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 text-gray-500 hover:text-neon-cyan hover:border-neon-cyan/30 hover:bg-neon-cyan/5 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Servicios */}
        <div>
          <h4 className="text-white text-[10px] font-black uppercase tracking-[0.28em] mb-5">Servicios</h4>
          <ul className="space-y-3">
            {SERVICES.map((s) => (
              <li key={s}><FooterLink>{s}</FooterLink></li>
            ))}
          </ul>
        </div>

        {/* Empresa */}
        <div>
          <h4 className="text-white text-[10px] font-black uppercase tracking-[0.28em] mb-5">Empresa</h4>
          <ul className="space-y-3">
            {COMPANY.map(([name, path]) => (
              <li key={name}><FooterLink to={path}>{name}</FooterLink></li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-white text-[10px] font-black uppercase tracking-[0.28em] mb-5">Contacto</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-gray-500 text-sm">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-700" />
              <span>Av. Homero 1425-105, Polanco, CDMX, México</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 shrink-0 text-gray-700" />
              <a href="tel:5579192845" className="text-gray-500 hover:text-neon-cyan transition-colors">
                55 7919 2845
              </a>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 shrink-0 text-gray-700" />
              <a href="mailto:hola@radiocontrols.com" className="text-gray-500 hover:text-neon-cyan transition-colors">
                hola@radiocontrols.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────── */}
      <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} RadioControls S.A. de C.V. Todos los derechos reservados.
        </p>
        <div className="flex gap-6 text-xs text-gray-600">
          {['Privacidad', 'Términos', 'Sitemap'].map((item) => (
            <a key={item} href="#" className="hover:text-gray-400 transition-colors">
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
