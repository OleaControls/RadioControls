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

    try {
      const result = await authRegister({ name, email, password });

      if (result.success) {
        navigate('/verify', { 
          state: { 
            email,
            message: '¡Cuenta creada! Por favor, ingresa el código de 6 dígitos enviado a tu correo.' 
          } 
        });
      } else {
        setError(result.message || 'Error al crear la cuenta');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
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
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="mb-8">
            <img src="/img%20radio%20lea/logosinfondoradiolea.svg" alt="Radiolea Controls" className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]" />
          </div>
          <h2 className="font-display text-4xl uppercase tracking-tight text-white mb-3">
            Crear <span className="text-neon-purple italic">Cuenta</span>
          </h2>
          <p className="text-gray-500 text-sm font-light">
            ¿Ya eres parte de la red?{' '}
            <Link to="/login" className="text-white hover:text-neon-purple transition-colors font-bold underline decoration-neon-purple/30">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Identidad de Marca</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within/input:text-neon-purple transition-colors">
                <UserIcon className="h-5 w-5" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre o Razón Social"
                className="w-full rounded-2xl bg-white/[0.03] border border-white/5 py-4 pl-14 pr-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-neon-purple/50 focus:bg-white/[0.05] transition-all duration-300 font-light"
                required
              />
            </div>
          </div>
          
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Correo Corporativo</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within/input:text-neon-purple transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tuempresa.com"
                className="w-full rounded-2xl bg-white/[0.03] border border-white/5 py-4 pl-14 pr-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-neon-purple/50 focus:bg-white/[0.05] transition-all duration-300 font-light"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-[10px] font-heading font-black uppercase tracking-[0.2em] text-gray-500 ml-4">Clave de Seguridad</label>
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-600 group-focus-within/input:text-neon-purple transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-2xl bg-white/[0.03] border border-white/5 py-4 pl-14 pr-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-neon-purple/50 focus:bg-white/[0.05] transition-all duration-300 font-light"
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
              className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white text-void px-6 py-5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-neon-purple hover:text-white hover:shadow-[0_0_30px_rgba(188,19,254,0.4)] active:scale-95 disabled:opacity-50"
            >
              <span className="relative z-10">
                {isLoading ? 'Creando Acceso...' : 'Generar Cuenta'}
              </span>
              {!isLoading && <ArrowRight className="h-4 w-4 relative z-10" />}
            </button>
          </div>
        </form>
      </div>
    </AuthSplitLayout>
  );
};

export default Register;
