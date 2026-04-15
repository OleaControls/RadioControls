import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, X, ChevronRight, LogOut, User, 
  Activity, Home, Zap, PhoneCall, LayoutDashboard 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const firstName = user?.name ? user.name.split(' ')[0] : 'Portal';
  const dashboardPath = user?.role === 'ADMIN' ? '/admin' : '/dashboard';

  const links = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Servicios', path: '/servicios', icon: Activity },
    { name: 'Planes', path: '/planes', icon: Zap },
    { name: 'Contacto', path: '/contacto', icon: PhoneCall },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ─── TOP BAR (Logo Only on Mobile) ────────────────── */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-4 py-4 md:py-6 pointer-events-none">
        <div className="max-w-6xl mx-auto flex justify-between items-center pointer-events-auto">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`flex items-center px-5 py-2 rounded-full transition-all duration-500 ${
              scrolled 
                ? 'bg-void/80 backdrop-blur-2xl border border-white/10 shadow-2xl' 
                : 'bg-white/5 backdrop-blur-md border border-white/5'
            }`}
          >
            <Link to="/" className="flex items-center gap-3 group relative">
              <img 
                src="/img radio lea/logosinfondoradiolea.svg" 
                alt="Radiolea Logo" 
                className="h-7 md:h-9 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]"
              />
              <div className="flex flex-col leading-none">
                <span className="font-display text-sm md:text-lg uppercase tracking-tight text-white">Radiolea</span>
                <span className="hidden xs:block text-[6px] md:text-[7px] font-heading font-black uppercase tracking-[0.4em] text-gray-500">Controls</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Nav Items (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/5">
            {links.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className={`px-5 py-2 rounded-full text-[9px] font-heading font-bold uppercase tracking-[0.25em] transition-all relative ${
                  location.pathname === link.path ? 'text-neon-cyan bg-white/5' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-white/5 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* User Action (Desktop Only) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to={dashboardPath} className="bg-white text-void px-5 py-2 rounded-full text-[9px] font-heading font-black uppercase tracking-widest hover:bg-neon-cyan transition-all">
                  <User size={10} />
                  {firstName}
                </Link>
                <button onClick={() => logout()} className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 transition-colors">
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-neon-cyan text-void px-6 py-2.5 rounded-full text-[9px] font-heading font-black uppercase tracking-widest hover:shadow-[0_0_25px_rgba(0,243,255,0.4)]">
                Acceso
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── MOBILE BOTTOM DOCK (The "Better" Design) ────────── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[100] md:hidden">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-void/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name}
                to={link.path}
                className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl transition-all relative flex-1 ${
                  isActive ? 'text-neon-cyan' : 'text-gray-500'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[8px] font-heading font-bold uppercase tracking-widest mt-1.5 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="bottom-active"
                    className="absolute -bottom-1 w-1 h-1 bg-neon-cyan rounded-full shadow-[0_0_10px_#00f3ff]"
                  />
                )}
              </Link>
            );
          })}
          
          <div className="w-px h-8 bg-white/10 mx-1" />

          {/* User/Portal Toggle in Dock */}
          <Link 
            to={isAuthenticated ? dashboardPath : "/login"}
            className={`flex flex-col items-center justify-center py-3 px-1 rounded-2xl transition-all flex-1 ${
              location.pathname.includes('/dashboard') || location.pathname === '/login' ? 'text-neon-purple' : 'text-gray-500'
            }`}
          >
            {isAuthenticated ? <LayoutDashboard size={20} /> : <User size={20} />}
            <span className="text-[8px] font-heading font-bold uppercase tracking-widest mt-1.5 opacity-50">
              {isAuthenticated ? 'Portal' : 'Acceso'}
            </span>
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;

