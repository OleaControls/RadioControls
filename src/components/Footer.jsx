import React from 'react';
import { Twitter, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, ArrowRight, Activity, Youtube, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SOCIAL = [
  { icon: Twitter, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Youtube, href: "#" }
];

const LINKS = {
  servicios: [
    { name: 'Streaming Hi-Fi', path: '/servicios' },
    { name: 'Instalación Pro', path: '/instalacion-audio' },
    { name: 'Licencias Legales', path: '/faq' },
    { name: 'Publicidad Sonora', path: '/servicios' },
    { name: 'Panel de Control', path: '/dashboard' },
  ],
  empresa: [
    { name: 'Nuestra Historia', path: '/' },
    { name: 'Planes y Precios', path: '/planes' },
    { name: 'Galería de Éxito', path: '/galeria' },
    { name: 'Centro de Ayuda', path: '/faq' },
    { name: 'Contacto', path: '/contacto' },
  ]
};

const Footer = () => {
  return (
    <footer className="relative bg-void pt-32 pb-12 overflow-hidden border-t border-white/5">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30vw] h-[30vw] bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Quick Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-start">
          <div className="lg:col-span-6">
            <h2 className="font-display text-5xl md:text-7xl uppercase leading-none mb-6 tracking-tighter">
              Activa tu <br /> <span className="text-neon-purple italic">asesoría ahora</span>
            </h2>
            <p className="text-gray-400 max-w-md text-lg font-light leading-relaxed">
              Hagamos el mejor equipo para elevar tu marca y clientes y tus ventas.
            </p>
          </div>
          <div className="lg:col-span-6">
            <form className="space-y-4">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-neon-cyan transition-colors text-sm font-heading tracking-widest placeholder:text-gray-600"
                />
              </div>
              <div className="relative">
                <textarea 
                  rows="3"
                  placeholder="¿En qué podemos ayudarte?" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-neon-cyan transition-colors text-sm font-heading tracking-widest placeholder:text-gray-600 resize-none"
                ></textarea>
              </div>
              <button className="w-full sm:w-auto bg-white text-void px-10 py-4 rounded-full font-heading font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neon-cyan hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all">
                Enviar Mensaje <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="relative">
                <img 
                  src="/img radio lea/logosinfondoradiolea.svg" 
                  alt="Radiolea Logo" 
                  className="h-10 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                />
                <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-3xl uppercase tracking-tighter text-white group-hover:text-neon-cyan transition-colors">Radiolea</span>
                <span className="text-[8px] font-heading font-black uppercase tracking-[0.4em] text-gray-500">Controls</span>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              Líderes en ingeniería sonora y streaming comercial en México. 
              Creamos atmósferas que conectan marcas con personas a través de la excelencia auditiva.
            </p>
            <div className="flex gap-4">
              {SOCIAL.map((item, i) => (
                <a 
                  key={i} 
                  href={item.href} 
                  className="w-10 h-10 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all hover:-translate-y-1"
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-heading font-black text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">Soluciones</h4>
              <ul className="space-y-4">
                {LINKS.servicios.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-neon-cyan text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-0 h-px bg-neon-cyan group-hover:w-3 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-black text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">Compañía</h4>
              <ul className="space-y-4">
                {LINKS.empresa.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-0 h-px bg-white group-hover:w-3 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-black text-[10px] uppercase tracking-[0.4em] text-white/40 mb-8">Headquarters</h4>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <MapPin className="text-neon-cyan shrink-0" size={18} />
                <p className="text-sm text-gray-400 leading-relaxed">
                  Av. Homero 1425-105, <br />
                  Polanco, CDMX, 11560
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <Phone className="text-neon-cyan shrink-0" size={18} />
                <a href="tel:5579192845" className="text-sm text-gray-400 hover:text-white transition-colors">
                  55 7919 2845
                </a>
              </div>
              <div className="flex gap-4 items-center">
                <Mail className="text-neon-cyan shrink-0" size={18} />
                <a href="mailto:hola@radiocontrols.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                  hola@radiocontrols.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-[10px] font-heading font-bold uppercase tracking-widest text-gray-600">
            <span>© 2026 Radiolea Controls</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>CDMX, México</span>
          </div>
          
          <div className="flex gap-8">
            {['Privacidad', 'Términos', 'Cookies'].map((item) => (
              <a key={item} href="#" className="text-[10px] font-heading font-bold uppercase tracking-widest text-gray-600 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02]">
            <Globe size={10} className="text-neon-cyan" />
            <span className="text-[9px] font-heading font-bold uppercase tracking-widest text-gray-500">Español (MX)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

