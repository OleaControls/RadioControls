import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight, LogOut, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const firstName = user?.name ? user.name.split(' ')[0] : 'Cliente';
  const dashboardPath = user?.role === 'ADMIN' ? '/admin' : '/dashboard';

  const links = [
    { name: 'Inicio', path: '/' },
    {
      name: 'Servicios',
      path: '/servicios',
      sublinks: [{ name: 'Instalación de Audio', path: '/instalacion-audio' }],
    },
    { name: 'Planes', path: '/planes' },
    { name: 'Galería', path: '/galeria' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contacto', path: '/contacto' },
  ];

  /* ─── Scroll listener ─────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 45);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ─── Close on route change ───────────────── */
  useEffect(() => {
    setIsOpen(false);
    setOpenDropdown(null);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigateAndClose = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleMobileDropdown = (name) => {
    setOpenMobileDropdown((prev) => (prev === name ? null : name));
  };

  /* ══════════════════════════════════════════ */
  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-2' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-5">

        {/* ── Pill container ─────────────────── */}
        <div
          className={`flex items-center justify-between px-4 sm:px-5 py-3 rounded-2xl transition-all duration-500 ${
            scrolled
              ? 'bg-[rgba(0,15,45,0.85)] backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]'
              : ''
          }`}
        >
          {/* Logo */}
          <Link to="/" className="relative z-[110] shrink-0">
            <img
              src="/img%20radio%20olea/logosinfondoradioolea.svg"
              alt="RadiOlea Controls"
              className="h-9 sm:h-11 w-auto object-contain transition-all duration-300"
              style={{ filter: scrolled ? 'drop-shadow(0 0 12px rgba(0,243,255,0.25))' : 'none' }}
            />
          </Link>

          {/* ── Desktop center pill nav ────────── */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-0.5 px-2 py-1.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/8">
              {links.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => link.sublinks && setOpenDropdown(link.name)}
                    onMouseLeave={() => link.sublinks && setOpenDropdown(null)}
                  >
                    <Link
                      to={link.path}
                      className={`relative flex items-center gap-1 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-200 ${
                        active
                          ? 'bg-neon-cyan text-royal-blue-dark shadow-[0_0_16px_rgba(0,243,255,0.4)]'
                          : 'text-gray-300 hover:text-white hover:bg-white/6'
                      }`}
                    >
                      {link.name}
                      {link.sublinks && (
                        <ChevronDown
                          size={11}
                          className="transition-transform duration-200"
                          style={{ transform: openDropdown === link.name ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                      )}
                    </Link>

                    <AnimatePresence>
                      {link.sublinks && openDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-[rgba(0,15,45,0.96)] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl overflow-hidden"
                        >
                          {link.sublinks.map((s) => (
                            <Link
                              key={s.name}
                              to={s.path}
                              className="flex items-center gap-2 px-5 py-3 text-[11px] font-bold text-gray-300 hover:text-neon-cyan hover:bg-white/5 uppercase tracking-widest transition-colors"
                            >
                              <ChevronRight size={10} className="text-neon-cyan/40" />
                              {s.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Desktop auth ───────────────────── */}
          <div className="hidden lg:flex items-center gap-2.5 relative z-[110]">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  title="Cerrar Sesión"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 text-gray-400 hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(dashboardPath)}
                  className="flex items-center gap-2 bg-neon-cyan text-royal-blue-dark px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:shadow-[0_0_22px_rgba(0,243,255,0.45)] hover:scale-105 transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  {firstName}
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-neon-cyan text-royal-blue-dark px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:shadow-[0_0_22px_rgba(0,243,255,0.45)] hover:scale-105 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                Portal
              </button>
            )}
          </div>

          {/* ── Mobile hamburger ──────────────── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative z-[110] p-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
            aria-label="Menú"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ══ MOBILE DRAWER ══════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/72 backdrop-blur-sm z-[90] lg:hidden"
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 h-full w-[82%] max-w-xs bg-[#000e2e] border-l border-white/8 z-[100] lg:hidden flex flex-col shadow-[-20px_0_70px_rgba(0,0,0,0.65)]"
            >
              {/* Drawer header with logo */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
                <img
                  src="/img%20radio%20olea/logosinfondoradioolea.svg"
                  alt="RadiOlea Controls"
                  className="h-7 w-auto object-contain"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/5 border border-white/8 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-grow overflow-y-auto px-5 py-6 space-y-1">
                <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.38em] mb-5 px-3">Navegación</p>

                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.055 }}
                  >
                    <div className="flex items-center gap-1">
                      <Link
                        to={link.path}
                        onClick={() => !link.sublinks && setIsOpen(false)}
                        className={`flex-grow px-4 py-3.5 rounded-xl text-sm font-black uppercase tracking-tight transition-all ${
                          location.pathname === link.path
                            ? 'bg-neon-cyan text-royal-blue-dark shadow-[0_0_18px_rgba(0,243,255,0.3)]'
                            : 'text-white hover:bg-white/5'
                        }`}
                      >
                        {link.name}
                      </Link>
                      {link.sublinks && (
                        <button
                          onClick={() => handleMobileDropdown(link.name)}
                          className={`p-3.5 rounded-xl transition-all flex-shrink-0 ${
                            openMobileDropdown === link.name
                              ? 'bg-neon-cyan text-royal-blue-dark'
                              : 'bg-white/5 text-gray-400'
                          }`}
                        >
                          <ChevronDown
                            size={14}
                            className="transition-transform duration-200"
                            style={{ transform: openMobileDropdown === link.name ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {link.sublinks && openMobileDropdown === link.name && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pt-1.5 space-y-1">
                            {link.sublinks.map((s) => (
                              <Link
                                key={s.name}
                                to={s.path}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-tight text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                              >
                                <ChevronRight size={12} className="text-neon-cyan/50" />
                                {s.name}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Auth bottom */}
              <div className="px-5 py-5 border-t border-white/6 space-y-2.5">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => handleNavigateAndClose(dashboardPath)}
                      className="w-full bg-neon-cyan text-royal-blue-dark py-4 rounded-2xl font-black uppercase tracking-[0.18em] text-sm shadow-[0_0_25px_rgba(0,243,255,0.3)]"
                    >
                      Hola, {firstName}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-white/5 border border-white/8 text-gray-300 py-4 rounded-2xl font-black uppercase tracking-[0.18em] text-sm"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigateAndClose('/login')}
                    className="w-full bg-neon-cyan text-royal-blue-dark py-4 rounded-2xl font-black uppercase tracking-[0.18em] text-sm shadow-[0_0_28px_rgba(0,243,255,0.35)]"
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
