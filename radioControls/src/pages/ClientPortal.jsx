import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Link2, Play, Plus, Search, LogOut, LayoutGrid, 
  Settings, Shield, CreditCard, BarChart3, User as UserIcon, 
  Download, Calendar, Clock, Radio, Sparkles, ChevronRight, Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

const ClientPortal = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('branches');
  const [searchTerm, setSearchTerm] = useState('');

  const firstName = user?.name ? user.name.split(' ')[0] : 'Cliente';
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const branches = [
    { id: 1, name: 'Polanco - Corporativo', station: 'Vibe Retail Pro', slug: 'polanco-corp', status: 'Online', listeners: 142 },
    { id: 2, name: 'Santa Fe - Departamental', station: 'Morning Chill', slug: 'santa-fe', status: 'Offline', listeners: 0 },
    { id: 3, name: 'Centro - Outlet', station: 'Pop Energy', slug: 'centro-outlet', status: 'Online', listeners: 89 },
  ];

  const invoices = [
    { id: 'INV-001', date: '15 Feb 2026', amount: '$5,390.00', status: 'Pagado' },
    { id: 'INV-002', date: '15 Feb 2025', amount: '$5,390.00', status: 'Pagado' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans selection:bg-neon-cyan selection:text-slate-950">
      
      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-slate-900/50 border-r border-white/5 p-8 hidden lg:flex flex-col backdrop-blur-3xl sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 group cursor-pointer">
          <div className="w-12 h-12 bg-neon-cyan rounded-2xl flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(0,243,255,0.3)] group-hover:rotate-12 transition-transform duration-500">
            <Radio className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter uppercase leading-none">RadiOlea</span>
            <span className="text-[10px] font-black text-neon-cyan/60 tracking-[0.3em] uppercase mt-1">Controls</span>
          </div>
        </div>

        <nav className="flex-grow space-y-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-4">Menú Principal</p>
          
          <button 
            onClick={() => setActiveTab('branches')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === 'branches' ? 'bg-neon-cyan text-slate-950 shadow-xl' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutGrid className="w-5 h-5" /> 
            <span className="font-bold text-sm uppercase tracking-widest">Sucursales</span>
          </button>

          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === 'analytics' ? 'bg-neon-cyan text-slate-950 shadow-xl' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <BarChart3 className="w-5 h-5" /> 
            <span className="font-bold text-sm uppercase tracking-widest">Analíticas</span>
          </button>

          <button 
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === 'billing' ? 'bg-neon-cyan text-slate-950 shadow-xl' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <CreditCard className="w-5 h-5" /> 
            <span className="font-bold text-sm uppercase tracking-widest">Facturación</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === 'profile' ? 'bg-neon-cyan text-slate-950 shadow-xl' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <UserIcon className="w-5 h-5" /> 
            <span className="font-bold text-sm uppercase tracking-widest">Mi Perfil</span>
          </button>
        </nav>

        <div className="pt-8 border-t border-white/5">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group font-bold text-sm uppercase tracking-widest"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> 
            Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 lg:p-12 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(0,243,255,0.03),transparent_40%)]">
        
        {/* Header Superior */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter uppercase">Hola, <span className="text-neon-cyan italic">{firstName}</span> 👋</h1>
            <p className="text-slate-500 font-medium text-lg">Tu ecosistema de audio está operando al 98% de eficiencia.</p>
          </motion.div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" /> Config
            </button>
            <button className="flex-1 md:flex-none bg-neon-cyan text-slate-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-neon-cyan/20">
              <Plus className="w-5 h-5" /> NUEVA SUCURSAL
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'branches' && (
            <motion.div 
              key="branches"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                  { label: "Oyentes Totales", val: "231", icon: <Activity className="text-neon-cyan" />, trend: "+12%" },
                  { label: "Sucursales Online", val: "2/3", icon: <Store className="text-neon-green" />, trend: "Estable" },
                  { label: "Próxima Factura", val: "15 Mar", icon: <Calendar className="text-neon-purple" />, trend: "$5,390" },
                ].map((st, i) => (
                  <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[32px] backdrop-blur-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-slate-950 rounded-xl border border-white/5">{st.icon}</div>
                      <span className="text-[10px] font-black text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded-lg uppercase tracking-widest">{st.trend}</span>
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{st.label}</p>
                    <p className="text-3xl font-black text-white">{st.val}</p>
                  </div>
                ))}
              </div>

              {/* Barra de Búsqueda */}
              <div className="relative mb-10 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 w-5 h-5 group-focus-within:text-neon-cyan transition-colors" />
                <input 
                  type="text" 
                  placeholder="BUSCAR SUCURSAL POR NOMBRE O ID..." 
                  className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-5 pl-16 pr-8 focus:outline-none focus:border-neon-cyan/40 transition-all placeholder:text-slate-700 font-bold text-sm tracking-widest uppercase"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Grid de Sucursales */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {branches.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())).map(branch => (
                  <motion.div 
                    key={branch.id}
                    whileHover={{ y: -5 }}
                    className="bg-slate-900/30 border border-white/5 p-8 rounded-[40px] group backdrop-blur-sm hover:border-neon-cyan/30 transition-all duration-500"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className={`p-4 rounded-2xl ${branch.status === 'Online' ? 'bg-neon-cyan/10 border border-neon-cyan/20' : 'bg-slate-950 border border-white/5'}`}>
                        <Store className={`w-7 h-7 ${branch.status === 'Online' ? 'text-neon-cyan' : 'text-slate-600'}`} />
                      </div>
                      <div className={`flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${branch.status === 'Online' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-red-500/10 text-red-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${branch.status === 'Online' ? 'bg-neon-cyan animate-pulse' : 'bg-red-500'}`} />
                        {branch.status}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black mb-2 group-hover:text-neon-cyan transition-colors uppercase tracking-tighter">{branch.name}</h3>
                    <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">
                       <span className="flex items-center gap-1.5"><Radio className="w-3 h-3 text-neon-cyan" /> {branch.station}</span>
                       <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> {branch.listeners} Oyentes</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <button className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all group/link">
                        <Link2 className="w-4 h-4 text-slate-500 group-hover/link:text-neon-cyan" /> Copiar Link Receptor
                      </button>
                      <button className="w-full flex items-center justify-center gap-3 py-4 bg-neon-cyan text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all">
                        <Play className="w-4 h-4 fill-current" /> Abrir Sistema
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div 
              key="billing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Card de Plan Activo */}
              <div className="bg-gradient-to-br from-royal-blue to-slate-900 border border-white/10 rounded-[48px] p-10 md:p-14 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/5 blur-[100px] rounded-full -mr-48 -mt-48" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="px-4 py-1.5 bg-neon-cyan text-slate-950 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                      Suscripción Activa
                    </div>
                    <Sparkles className="text-neon-cyan w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter uppercase leading-none">Plan Profesional <br /><span className="text-neon-cyan italic">Anual</span></h3>
                  <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mb-12">Disfrutando de ingeniería de audio premium, publicidad ilimitada y soporte prioritario 24/7.</p>
                  
                  <div className="flex flex-wrap gap-12">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Próxima Renovación</p>
                      <p className="text-2xl font-black text-white uppercase">15 de Febrero, 2027</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Monto Estimado</p>
                      <p className="text-2xl font-black text-white uppercase">$5,390.00 MXN</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historial de Facturas */}
              <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 backdrop-blur-xl">
                <h4 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                  <Clock className="text-neon-cyan w-6 h-6" /> Historial de Facturación
                </h4>
                <div className="space-y-4">
                  {invoices.map((inv, i) => (
                    <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-slate-950 border border-white/5 rounded-3xl hover:border-white/20 transition-all group">
                      <div className="flex items-center gap-6 mb-4 md:mb-0">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-neon-cyan transition-colors">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-white uppercase tracking-tighter">{inv.id}</p>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{inv.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 w-full md:w-auto justify-between">
                        <span className="text-xl font-black text-white">{inv.amount}</span>
                        <span className="px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {inv.status}
                        </span>
                        <button className="p-3 bg-white/5 hover:bg-neon-cyan hover:text-slate-950 rounded-xl transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <BarChart3 className="w-20 h-20 text-neon-cyan/20 mx-auto mb-8" />
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Procesando Datos en Tiempo Real</h3>
              <p className="text-slate-500 max-w-md mx-auto text-lg font-medium">Estamos recolectando las métricas de tus sucursales. Las gráficas de audiencia y conversión estarán listas en breve.</p>
              <div className="mt-12 flex justify-center gap-4">
                 {[1,2,3,4].map(i => <div key={i} className="w-3 h-12 bg-neon-cyan/10 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
               <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
                 <div className="flex items-center gap-6 mb-12">
                   <div className="w-24 h-24 bg-gradient-to-br from-neon-cyan to-blue-600 rounded-[32px] flex items-center justify-center text-slate-950 text-4xl font-black shadow-2xl">
                     {firstName[0]}
                   </div>
                   <div>
                     <h3 className="text-3xl font-black uppercase tracking-tighter mb-1">{user?.name || 'Usuario'}</h3>
                     <p className="text-neon-cyan font-bold text-sm tracking-widest uppercase">{user?.role || 'CLIENTE ELITE'}</p>
                   </div>
                 </div>

                 <form className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Nombre Completo</label>
                       <input disabled type="text" value={user?.name || ''} className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold opacity-50 cursor-not-allowed" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email</label>
                       <input disabled type="text" value={user?.email || ''} className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold opacity-50 cursor-not-allowed" />
                     </div>
                   </div>
                   <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-slate-400">
                     Cambiar Contraseña
                   </button>
                 </form>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ClientPortal;
