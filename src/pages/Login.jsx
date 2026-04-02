import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Radio, ArrowLeft } from 'lucide-react';
import AuthSplitLayout from '../components/AuthSplitLayout';
import { useAuth } from '../components/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await authLogin(email, password);
    if (result.success) {
      const role = result.user?.role;
      const defaultPath = role === 'ADMIN' ? '/admin' : '/dashboard';
      const redirectTo = location.state?.redirectTo || defaultPath;
      navigate(redirectTo);
    } else {
      setError(result.message || 'No se pudo iniciar sesión');
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <Link 
        to="/" 
        className="fixed top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md shadow-xl transition-all duration-300 z-50"
      >
        <ArrowLeft className="h-4 w-4" /> Inicio
      </Link>
      <div className="glass rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group border-white/5 hover:border-white/10 transition-all duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="mb-8">
            <img src="/img%20radio%20olea/logosinfondoradioolea.svg" alt="RadiOlea Controls" className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]" />
          </div>
          <h2 className="font-display text-4xl uppercase tracking-tight text-white mb-3">
            Inicia <span className="text-neon-cyan italic">Sesión</span>
          </h2>
          {location.state?.message && (
            <p className="mb-4 text-neon-cyan font-bold text-[10px] uppercase tracking-widest bg-neon-cyan/5 p-3 rounded-xl border border-neon-cyan/10 w-full">
              {location.state.message}
            </p>
          )}
          <p className="text-gray-500 text-sm font-light">
            ¿Nuevo en RadioOlea?{' '}
            <Link to="/register" className="text-white hover:text-neon-cyan transition-colors font-bold underline decoration-neon-cyan/30">
              Crea tu cuenta
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Canal de Acceso</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within/input:text-neon-cyan transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@empresa.com"
                className="w-full rounded-2xl bg-white/[0.03] border border-white/5 py-4 pl-14 pr-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-neon-cyan/50 focus:bg-white/[0.05] transition-all duration-300 font-light"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-4">
              <label htmlFor="password" className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500">Clave Encriptada</label>
              <Link to="/forgot-password" size="sm" className="text-[9px] font-bold uppercase text-gray-600 hover:text-neon-cyan transition-colors tracking-widest">¿Olvidaste?</Link>
            </div>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within/input:text-neon-cyan transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-2xl bg-white/[0.03] border border-white/5 py-4 pl-14 pr-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-neon-cyan/50 focus:bg-white/[0.05] transition-all duration-300 font-light"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-400 text-center">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white text-void px-6 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-neon-cyan hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] active:scale-95 disabled:opacity-50"
            >
              <span className="relative z-10">
                {isLoading ? 'Autenticando...' : 'Entrar al Portal'}
              </span>
              {!isLoading && <ArrowRight className="h-4 w-4 relative z-10" />}
            </button>
          </div>
        </form>
      </div>
    </AuthSplitLayout>
  );
};

export default Login;
