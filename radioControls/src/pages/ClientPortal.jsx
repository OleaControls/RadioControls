import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Link2, Play, Plus, Search, LogOut, LayoutGrid, 
  Settings, Shield, CreditCard, BarChart3, User as UserIcon, 
  Download, Calendar, Clock, Radio, Sparkles, ChevronRight, Activity,
  LifeBuoy, MessageSquare, PhoneCall, Mail, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { apiFetch } from '../utils/apiFetch';

const ClientPortal = () => {
  const navigate = useNavigate();
  const { user, token, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('branches');
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [branches, setBranches] = useState([]);
  const [branchesError, setBranchesError] = useState('');
  const [planSelections, setPlanSelections] = useState({});
  const [planLoading, setPlanLoading] = useState({});
  const [cancelModal, setCancelModal] = useState({ open: false, branchId: null, branchName: '' });

  const firstName = user?.name ? user.name.split(' ')[0] : 'Cliente';
  const userRole = user?.role || 'CLIENT';
  const isVerified = user?.isVerified ?? true; // Default to true if field not present for now

  const availableTabs = [
    { id: 'branches', label: 'Sucursales', icon: <LayoutGrid className="w-5 h-5" />, roles: ['ADMIN', 'CLIENT', 'STAFF'] },
    { id: 'billing', label: 'Planes y Pagos', icon: <CreditCard className="w-5 h-5" />, roles: ['ADMIN', 'CLIENT'] },
    { id: 'support', label: 'Soporte', icon: <LifeBuoy className="w-5 h-5" />, roles: ['ADMIN', 'CLIENT', 'STAFF'] },
    { id: 'profile', label: 'Mi Perfil', icon: <UserIcon className="w-5 h-5" />, roles: ['ADMIN', 'CLIENT'] },
  ];

  const visibleTabs = availableTabs.filter((tab) => tab.roles.includes(userRole));

  useEffect(() => {
    if (!visibleTabs.find((tab) => tab.id === activeTab)) {
      setActiveTab(visibleTabs[0]?.id || 'branches');
    }
  }, [activeTab, visibleTabs]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!user?.email) {
      setVerifyStatus('error');
      return;
    }
    setIsVerifying(true);
    setVerifyStatus(null);
    
    try {
      const response = await apiFetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, code: verificationCode }),
      }, token);
      
      if (response.ok) {
        setVerifyStatus('success');
        updateUser({ ...user, isVerified: true });
      } else {
        setVerifyStatus('error');
      }
    } catch (err) {
      setVerifyStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const demoBranches = [
    { id: 'demo-1', name: 'Polanco - Corporativo', station: 'Vibe Retail Pro', slug: 'polanco-corp', status: 'Online', listeners: 142, plan: 'YEARLY', subscriptionStatus: 'ACTIVE' },
    { id: 'demo-2', name: 'Santa Fe - Departamental', station: 'Morning Chill', slug: 'santa-fe', status: 'Offline', listeners: 0, plan: 'MONTHLY', subscriptionStatus: 'PAST_DUE' },
    { id: 'demo-3', name: 'Centro - Outlet', station: 'Pop Energy', slug: 'centro-outlet', status: 'Online', listeners: 89, plan: null, subscriptionStatus: null },
  ];

  const invoices = [
    { id: 'INV-001', date: '15 Feb 2026', amount: '$5,390.00', status: 'Pagado' },
    { id: 'INV-002', date: '15 Feb 2025', amount: '$5,390.00', status: 'Pagado' },
  ];

  useEffect(() => {
    const loadBranches = async () => {
      if (!user?.id) {
        setBranches(demoBranches);
        return;
      }
      try {
        const response = await apiFetch(`/api/branches?ownerId=${encodeURIComponent(user.id)}`, {}, token);
        const data = await response.json().catch(() => null);
        if (!response.ok || !Array.isArray(data)) {
          setBranchesError(data?.message || 'No se pudieron cargar sucursales');
          setBranches(demoBranches);
          return;
        }
        const mapped = data.map((branch) => ({
          id: branch.id,
          name: branch.name,
          station: branch.station?.name || 'Sin estacion',
          slug: branch.slug,
          status: branch.status || 'Offline',
          listeners: 0,
          plan: branch.plan || null,
          subscriptionStatus: branch.subscriptionStatus || null,
          stripeSubscriptionId: branch.stripeSubscriptionId || null,
          currentPeriodEnd: branch.currentPeriodEnd || null,
        }));
        setBranches(mapped);
      } catch (err) {
        setBranchesError('No se pudieron cargar sucursales');
        setBranches(demoBranches);
      }
    };

    loadBranches();
  }, [user?.id]);

  const planLabel = useMemo(() => ({
    MONTHLY: 'Basico Mensual',
    YEARLY: 'Profesional Anual',
  }), []);

  const statusLabel = useMemo(() => ({
    ACTIVE: 'Activo',
    CANCELED: 'Cancelado',
    PAST_DUE: 'Past Due',
    INCOMPLETE: 'Pendiente',
  }), []);

  const formatDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const planKeyFromType = (planType) => {
    if (planType === 'MONTHLY') return 'basico';
    if (planType === 'YEARLY') return 'profesional';
    return null;
  };

  const handlePlanSelection = (branchId, value) => {
    setPlanSelections((prev) => ({ ...prev, [branchId]: value }));
  };

  const handleUpgrade = async (branchId) => {
    const selected = planSelections[branchId];
    if (!selected) return;
    setPlanLoading((prev) => ({ ...prev, [branchId]: 'upgrade' }));
    try {
      const response = await apiFetch('/api/stripe/update-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branchId, planId: selected }),
      }, token);
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || 'No se pudo actualizar el plan');
      }
      setBranches((prev) =>
        prev.map((b) =>
          b.id === branchId
            ? { ...b, plan: data.branch?.plan || b.plan, subscriptionStatus: data.branch?.subscriptionStatus || b.subscriptionStatus }
            : b
        )
      );
    } catch (err) {
      setBranchesError(err.message || 'No se pudo actualizar el plan');
    } finally {
      setPlanLoading((prev) => ({ ...prev, [branchId]: null }));
    }
  };

  const openCancelModal = (branchId, branchName) => {
    setCancelModal({ open: true, branchId, branchName });
  };

  const closeCancelModal = () => {
    setCancelModal({ open: false, branchId: null, branchName: '' });
  };

  const handleCancel = async (branchId) => {
    setPlanLoading((prev) => ({ ...prev, [branchId]: 'cancel' }));
    try {
      const response = await apiFetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branchId }),
      }, token);
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || 'No se pudo cancelar el plan');
      }
      setBranches((prev) =>
        prev.map((b) =>
          b.id === branchId
            ? { ...b, subscriptionStatus: data.branch?.subscriptionStatus || 'CANCELED' }
            : b
        )
      );
    } catch (err) {
      setBranchesError(err.message || 'No se pudo cancelar el plan');
    } finally {
      setPlanLoading((prev) => ({ ...prev, [branchId]: null }));
      closeCancelModal();
    }
  };

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
          
          {visibleTabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === tab.id ? 'bg-neon-cyan text-slate-950 shadow-xl' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              {tab.icon}
              <span className="font-bold text-sm uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-3">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-4">Links Rapidos</p>
          <Link to="/planes" className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
            <CreditCard className="w-4 h-4" /> Ver Planes
          </Link>
          <Link to="/contacto" className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
            <MessageSquare className="w-4 h-4" /> Contacto
          </Link>
          <Link to="/faq" className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl text-slate-400 hover:bg-white/5 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
            <LifeBuoy className="w-4 h-4" /> FAQ
          </Link>
        </div>

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
        
        {/* Banner de Verificación */}
        {!isVerified && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-12 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-[32px] p-8 backdrop-blur-xl flex flex-col md:flex-row items-center gap-8">
              <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-500">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="flex-grow text-center md:text-left">
                <h4 className="text-xl font-black uppercase tracking-tighter mb-1">Confirma tu Cuenta</h4>
                <p className="text-amber-200/60 font-medium">Hemos enviado un código de 6 dígitos a tu correo. Ingrésalo para activar todas las funciones.</p>
              </div>
              <form onSubmit={handleVerify} className="flex gap-2 w-full md:w-auto">
                <input 
                  type="text" 
                  maxLength="6"
                  placeholder="000000"
                  className="bg-slate-950 border border-amber-500/30 rounded-xl px-4 py-3 text-center font-black tracking-[0.5em] w-32 focus:outline-none focus:border-amber-500"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <button 
                  disabled={isVerifying}
                  className="bg-amber-500 text-slate-950 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isVerifying ? '...' : 'VERIFICAR'}
                </button>
              </form>
              {verifyStatus === 'success' && <CheckCircle2 className="text-green-500 w-6 h-6" />}
              {verifyStatus === 'error' && <AlertTriangle className="text-red-500 w-6 h-6" />}
            </div>
          </motion.div>
        )}

        {/* Header Superior */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter uppercase">Hola, <span className="text-neon-cyan italic">{firstName}</span> 👋</h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-slate-300">
                Rol: {userRole}
              </span>
            </div>
            <p className="text-slate-500 font-medium text-lg">Panel de Control RadiOleaControls.</p>
          </motion.div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={() => navigate('/planes')}
              className="flex-1 md:flex-none bg-neon-cyan text-slate-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-2xl shadow-neon-cyan/20"
            >
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

              {branchesError && (
                <div className="mb-8 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-amber-200 text-xs font-black uppercase tracking-widest">
                  {branchesError} (mostrando datos demo)
                </div>
              )}

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

                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">
                        Plan: {branch.plan ? (planLabel[branch.plan] || branch.plan) : 'Sin plan'}
                      </span>
                      {branch.subscriptionStatus && (
                        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">
                          Estado: {statusLabel[branch.subscriptionStatus] || branch.subscriptionStatus}
                        </span>
                      )}
                      {branch.currentPeriodEnd && (
                        <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">
                          Renueva: {formatDate(branch.currentPeriodEnd) || 'N/A'}
                        </span>
                      )}
                      <AnimatePresence>
                        {branch.subscriptionStatus === 'PAST_DUE' && (
                          <motion.span
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-[10px] font-black uppercase tracking-widest text-red-300"
                          >
                            Pago atrasado
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <button className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all group/link">
                        <Link2 className="w-4 h-4 text-slate-500 group-hover/link:text-neon-cyan" /> Copiar Link Receptor
                      </button>
                      <button className="w-full flex items-center justify-center gap-3 py-4 bg-neon-cyan text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all">
                        <Play className="w-4 h-4 fill-current" /> Abrir Sistema
                      </button>
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <select
                            value={planSelections[branch.id] || ''}
                            onChange={(e) => handlePlanSelection(branch.id, e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 text-xs font-black uppercase tracking-widest text-white"
                          >
                            <option value="">Actualizar plan</option>
                            <option value="basico">Basico Mensual</option>
                            <option value="profesional">Profesional Anual</option>
                          </select>
                          <button
                            onClick={() => handleUpgrade(branch.id)}
                            disabled={
                              !planSelections[branch.id] ||
                              planLoading[branch.id] ||
                              planSelections[branch.id] === planKeyFromType(branch.plan)
                            }
                            className="px-4 py-3 rounded-xl bg-neon-cyan text-slate-950 text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                          >
                            {planLoading[branch.id] === 'upgrade' ? '...' : 'Actualizar'}
                          </button>
                        </div>
                        <button
                          onClick={() => openCancelModal(branch.id, branch.name)}
                          disabled={planLoading[branch.id]}
                          className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 disabled:opacity-50"
                        >
                          {planLoading[branch.id] === 'cancel' ? 'Cancelando...' : 'Cancelar plan'}
                        </button>
                      </div>
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'support' && (
            <motion.div 
              key="support"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
                  <MessageSquare className="w-12 h-12 text-neon-cyan mb-8" />
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Soporte <span className="text-neon-cyan italic">Técnico</span></h3>
                  <p className="text-slate-500 font-medium mb-8">¿Tienes problemas con el streaming o tus sucursales? Nuestro equipo técnico está listo para ayudarte.</p>
                  <div className="space-y-4">
                    <a href="https://wa.me/TUNUMERO" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                       <PhoneCall className="w-5 h-5 text-neon-cyan" />
                       <span className="font-bold uppercase text-xs tracking-widest">WhatsApp Directo</span>
                    </a>
                    <a href="mailto:soporte@radioleacontrols.com" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
                       <Mail className="w-5 h-5 text-neon-cyan" />
                       <span className="font-bold uppercase text-xs tracking-widest">Email de Soporte</span>
                    </a>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
                  <Settings className="w-12 h-12 text-neon-purple mb-8" />
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Asesoría <span className="text-neon-purple italic">Comercial</span></h3>
                  <p className="text-slate-500 font-medium mb-8">¿Deseas escalar tu plan o necesitas una solución personalizada para nuevos hoteles o restaurantes?</p>
                  <button className="w-full py-5 bg-neon-purple/20 border border-neon-purple/30 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-neon-purple/30 transition-all text-white">
                    Agendar Consultoría
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
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

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Empresa</p>
                     <p className="bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold">{user?.companyName || 'No especificada'}</p>
                   </div>
                   <div className="space-y-2">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Miembro desde</p>
                     <p className="bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold">2026</p>
                   </div>
                 </div>

                 <form className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Nombre Completo</label>
                       <input disabled type="text" value={user?.name || ''} className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold opacity-50" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Principal</label>
                       <input disabled type="text" value={user?.email || ''} className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold opacity-50" />
                     </div>
                   </div>
                   <button className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-slate-400">
                     Solicitar Cambio de Datos
                   </button>
                 </form>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {cancelModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={closeCancelModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-lg rounded-[32px] border border-white/10 bg-slate-900/70 backdrop-blur-2xl p-8 shadow-[0_0_60px_-20px_rgba(0,243,255,0.25)]"
            >
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-red-300 mb-3">Cancelar plan</div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">Confirmar cancelacion</h3>
              <p className="text-slate-400 text-sm mb-6">
                Vas a cancelar el plan de la sucursal <span className="text-white font-black">{cancelModal.branchName}</span>.
                La musica podria detenerse al finalizar el periodo activo.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closeCancelModal}
                  className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all"
                >
                  Volver
                </button>
                <button
                  onClick={() => handleCancel(cancelModal.branchId)}
                  disabled={planLoading[cancelModal.branchId]}
                  className="flex-1 px-4 py-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-xs font-black uppercase tracking-widest text-red-200 hover:bg-red-500/30 transition-all disabled:opacity-60"
                >
                  {planLoading[cancelModal.branchId] === 'cancel' ? 'Cancelando...' : 'Confirmar cancelacion'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientPortal;
