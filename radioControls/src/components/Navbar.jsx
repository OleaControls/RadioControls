import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Radio, Menu, X, Search, User, ChevronRight, Headphones, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const firstName = user?.name ? user.name.split(' ')[0] : 'Cliente';

  const links = [
    { name: 'Inicio', path: '/' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Planes', path: '/planes' },
    { name: 'Galería', path: '/galeria' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contacto', path: '/contacto' },
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleNavigateAndClose = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative flex items-center justify-between px-6 py-3">
          
          <Link to="/" className="flex items-center gap-2 md:gap-3 group relative z-[110] shrink">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-light-accent dark:bg-dark-accent rounded-lg md:rounded-xl shadow-[0_0_20px_rgba(0,35,102,0.2)] dark:shadow-[0_0_20px_rgba(0,243,255,0.3)] shrink-0"
            >
                <Radio className="text-white dark:text-dark-background w-5 h-5 md:w-5 md:h-5" />
            </motion.div>
            <div className="flex flex-col min-w-0">
              <span className="font-black text-base md:text-lg tracking-tighter uppercase leading-none text-light-text dark:text-dark-text">
                RadiOlea<span className="text-light-accent dark:text-dark-accent italic">Controls</span>
              </span>
              <span className="hidden md:block text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-[0.2em] uppercase leading-none mt-1">
                Audio Intelligence
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-black uppercase tracking-widest transition-all hover:text-light-accent dark:hover:text-dark-accent group ${
                  location.pathname === link.path ? 'text-light-accent dark:text-dark-accent' : 'text-gray-500 dark:text-gray-300'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-glow"
                    className="absolute inset-0 bg-light-accent/5 dark:bg-dark-accent/5 rounded-lg border-b-2 border-light-accent/50 dark:border-dark-accent/50"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4 relative z-[110]">
            {isAuthenticated ? (
              <>
                <button 
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 hover:border-red-500/50 dark:hover:border-red-500/50 transition-all"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 bg-light-accent dark:bg-dark-accent text-white dark:text-dark-background px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,35,102,0.4)] dark:hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-105 transition-all"
                >
                  <User className="w-4 h-4" />
                  {firstName}
                </button>
              </>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-light-accent dark:bg-dark-accent text-white dark:text-dark-background px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,35,102,0.4)] dark:hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-105 transition-all"
              >
                <User className="w-4 h-4" />
                Portal
              </button>
            )}
          </div>

          {/* Mobile Menu & Action Buttons */}
          <div className="lg:hidden flex items-center gap-2 relative z-[110] shrink-0">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-light-accent dark:bg-dark-accent text-white dark:text-dark-background' : 'text-light-text dark:text-white bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'}`}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Side Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-light-background dark:bg-royal-blue-dark border-l border-black/10 dark:border-white/10 z-[100] lg:hidden flex flex-col p-8 pt-24 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col space-y-2">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 ml-4">Navegación</p>
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between p-4 rounded-2xl text-xl font-black uppercase tracking-tighter transition-all ${
                        location.pathname === link.path 
                          ? 'bg-light-accent dark:bg-dark-accent text-white dark:text-dark-background' 
                          : 'text-light-text dark:text-white hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {link.name}
                      <ChevronRight size={20} className={location.pathname === link.path ? 'opacity-100' : 'opacity-20'} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto space-y-4">
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={() => handleNavigateAndClose('/dashboard')}
                      className="w-full bg-light-accent dark:bg-dark-accent text-white dark:text-dark-background py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl"
                    >
                      HOLA, {firstName}
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full bg-black/5 dark:bg-white/5 text-light-text dark:text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleNavigateAndClose('/login')}
                    className="w-full bg-light-text dark:bg-white text-light-background dark:text-dark-background py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl"
                  >
                    Portal Clientes
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;