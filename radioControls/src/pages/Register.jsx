import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, User as UserIcon, Radio, ArrowLeft } from 'lucide-react';
import AuthSplitLayout from '../components/AuthSplitLayout';
import { useAuth } from '../components/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register: authRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Registro Local
    const result = authRegister({ name, email, password });
    
    setTimeout(() => {
      if (result.success) {
        const redirectTo = location.state?.redirectTo;
        navigate('/login', { state: { redirectTo, message: '¡Cuenta creada localmente! Inicia sesión para continuar.' } });
      } else {
        setError(result.message);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <AuthSplitLayout>
      <Link 
        to="/" 
        className="fixed top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md shadow-xl transition-all duration-300 z-50"
      >
        <ArrowLeft className="h-4 w-4" /> Inicio
      </Link>
      <div className="bg-slate-900/40 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/10 shadow-[0_0_50px_-12px_rgba(0,243,255,0.2)]">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="mb-6 p-4 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20">
            <Radio className="h-10 w-10 text-neon-cyan animate-pulse" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white">
            Únete a Nosotros
          </h2>
          <p className="mt-3 text-slate-400 font-medium">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-neon-cyan hover:text-white transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Nombre Completo</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-neon-cyan">
                <UserIcon className="h-5 w-5 text-slate-500 transition-colors" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full rounded-2xl bg-white/5 border-white/10 py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 transition-all duration-300"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Correo Electrónico</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-neon-cyan">
                <Mail className="h-5 w-5 text-slate-500 transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-2xl bg-white/5 border-white/10 py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Contraseña</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 transition-colors group-focus-within:text-neon-cyan">
                <Lock className="h-5 w-5 text-slate-500 transition-colors" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-2xl bg-white/5 border-white/10 py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 transition-all duration-300"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <p className="text-xs font-bold text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-neon-cyan px-4 py-4 text-sm font-black text-slate-950 shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:animate-shimmer" />
              <span className="relative">
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </span>
              {!isLoading && <ArrowRight className="h-5 w-5 relative" />}
            </button>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm font-bold">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-light-accent dark:text-neon-cyan cursor-pointer hover:underline">
              Inicia sesión aquí.
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
};

export default Register;
