import React from 'react';
import { Radio, Twitter, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-900 pt-16 pb-8 relative z-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 group cursor-pointer">
                <div className="p-2 bg-gray-900 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
                    <Radio className="text-cyan-400 w-6 h-6" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  RadioControls
                </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transformando espacios comerciales a través del poder del sonido. Soluciones de audio ambiental premium para marcas líderes.
            </p>
            <div className="flex gap-4 pt-2">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
                <motion.a 
                  key={i}
                  href="#"
                  whileHover={{ y: -3, color: '#22d3ee' }}
                  className="text-gray-500 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:pl-10">
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explorar</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Inicio', 'Catálogo', 'Empresas', 'Tecnología', 'Casos de Éxito'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-2 h-px bg-cyan-400 transition-all duration-300"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contacto</h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                <span>Av. Homero 1425 - 105, Polanco, Polanco II Secc,<br/>Miguel Hidalgo, 11540 CDMX, México</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600 shrink-0" />
                <span>55 7919 2845</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600 shrink-0" />
                <span>hola@radiocontrols.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} RadioControls S.A. de C.V. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400 transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Mapa del Sitio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
