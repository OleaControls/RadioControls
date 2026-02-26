import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Activity, Server, Users, Radio, Link2, Settings,
  AlertTriangle, CheckCircle2, Wrench, Plus, Cpu, Network,
  BarChart3, Eye, Globe, LogOut, Mail, Store, Sparkles, LayoutGrid,
  CreditCard, PhoneCall, Gift
} from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/apiFetch';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  // Estados para activación manual
  const [manualData, setManualData] = useState({
    userEmail: '',
    branchName: '',
    stationId: '',
    plan: 'MONTHLY',
    customAmount: '',
    customUnit: 'MINUTES'
  });
  const [stations, setStations] = useState([]);
  const [isActivating, setIsActivating] = useState(false);
  const [activationStatus, setActivationStatus] = useState(null);
  const [quickUrls, setQuickUrls] = useState({});
  const [isLinking, setIsLinking] = useState({});

  // Estados para Compensaciones (Bonificaciones)
  const [compData, setCompData] = useState({
    branchId: '',
    amount: '',
    unit: 'DAYS',
    reason: ''
  });
  const [isCompensating, setIsCompensating] = useState(false);
  const [compStatus, setCompStatus] = useState(null);

  // Estados para creación de usuarios
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CLIENT'
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userCreateStatus, setUserCreateStatus] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Datos Reales de Admin
  const [allUsers, setAllUsers] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Estados para Incidentes
  const [incidents, setIncidents] = useState([]);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!token) return;
      setIsLoadingData(true);
      setIsLoadingIncidents(true);
      try {
        const [uRes, bRes, sRes, iRes] = await Promise.all([
          apiFetch('/api/admin/users', {}, token),
          apiFetch('/api/admin/branches', {}, token),
          apiFetch('/api/stations', {}, token),
          apiFetch('/api/incidents', {}, token)
        ]);
        
        if (uRes.ok) setAllUsers(await uRes.json());
        if (bRes.ok) setAllBranches(await bRes.json());
        if (sRes.ok) setStations(await sRes.json());
        if (iRes.ok) setIncidents(await iRes.json());
      } catch (err) {
        console.error("Error cargando datos de admin:", err);
      } finally {
        setIsLoadingData(false);
        setIsLoadingIncidents(false);
      }
    };

    if (token) loadData();
  }, [token]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await apiFetch(`/api/incidents/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      }, token);
      
      if (response.ok) {
        setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
      }
    } catch (err) {
      console.error("Error actualizando incidente:", err);
    }
  };

  useEffect(() => {
    const loadStations = async () => {
      try {
        const response = await apiFetch('/api/stations', {}, token);
        const data = await response.json().catch(() => []);
        if (response.ok) setStations(data);
      } catch (err) {
        console.error("Error cargando estaciones:", err);
      }
    };
    if (activeTab === 'activations' && stations.length === 0) loadStations();
  }, [activeTab, token, stations.length]);

  const handleManualActivation = async (e) => {
    e.preventDefault();
    setIsActivating(true);
    setActivationStatus(null);
    try {
      const response = await apiFetch('/api/branches/admin-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualData),
      }, token);
      
      const data = await response.json().catch(() => null);
      if (response.ok) {
        setActivationStatus({ success: true, message: "Sucursal activada correctamente" });
        setManualData({ 
          userEmail: '', 
          branchName: '', 
          stationId: '', 
          plan: 'MONTHLY',
          customAmount: '',
          customUnit: 'MINUTES'
        });
        // Recargar sucursales para ver la nueva
        const bRes = await apiFetch('/api/admin/branches', {}, token);
        if (bRes.ok) setAllBranches(await bRes.json());
      } else {
        setActivationStatus({ success: false, message: data?.message || "Error al activar" });
      }
    } catch (err) {
      setActivationStatus({ success: false, message: "Error de conexión" });
    } finally {
      setIsActivating(false);
    }
  };

  const handleAssignStation = async (branchId, stationId) => {
    try {
      const res = await apiFetch('/api/admin/assign-station', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branchId, stationId })
      }, token);
      
      if (res.ok) {
        const data = await res.json();
        setAllBranches(prev => prev.map(b => b.id === branchId ? data.branch : b));
        alert("Estación (Stream) asignada correctamente");
      }
    } catch (err) {
      alert("Error al asignar estación");
    }
  };

  const handleQuickStationCreate = async (branchId, url) => {
    if (!url) return;
    setIsLinking(prev => ({ ...prev, [branchId]: true }));
    try {
      const res = await apiFetch('/api/admin/assign-custom-url', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branchId, streamingUrl: url })
      }, token);
      
      if (res.ok) {
        const data = await res.json();
        // 1. Actualizar la sucursal en la lista local
        setAllBranches(prev => prev.map(b => b.id === branchId ? data.branch : b));
        // 2. Limpiar el input
        setQuickUrls(prev => ({ ...prev, [branchId]: '' }));
        // 3. Recargar estaciones para que la nueva aparezca en los selects
        const sRes = await apiFetch('/api/stations', {}, token);
        if (sRes.ok) setStations(await sRes.json());
        
        alert("Streaming vinculado correctamente");
      } else {
        const errData = await res.json();
        alert(errData.message || "Error al vincular");
      }
    } catch (err) {
      alert("Error de conexión");
    } finally {
      setIsLinking(prev => ({ ...prev, [branchId]: false }));
    }
  };

  const handleAdminCreateUser = async (e) => {
    e.preventDefault();
    setIsCreatingUser(true);
    setUserCreateStatus(null);
    try {
      const response = await apiFetch('/api/auth/admin-create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }, token);
      
      const data = await response.json().catch(() => null);
      if (response.ok) {
        setUserCreateStatus({ success: true, message: "Usuario creado exitosamente" });
        setUserData({ name: '', email: '', password: '', role: 'CLIENT' });
        // Recargar usuarios
        const uRes = await apiFetch('/api/admin/users', {}, token);
        if (uRes.ok) setAllUsers(await uRes.json());
      } else {
        setUserCreateStatus({ success: false, message: data?.message || "Error al crear" });
      }
    } catch (err) {
      setUserCreateStatus({ success: false, message: "Error de conexión" });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleCompensate = async (e) => {
    e.preventDefault();
    if (!compData.branchId) return;
    setIsCompensating(true);
    setCompStatus(null);
    try {
      const response = await apiFetch('/api/admin/compensate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(compData),
      }, token);
      
      const data = await response.json().catch(() => null);
      if (response.ok) {
        setCompStatus({ success: true, message: "Bonificación aplicada correctamente" });
        setCompData({ branchId: '', amount: '', unit: 'DAYS', reason: '' });
        // Recargar sucursales para ver la nueva fecha
        const bRes = await apiFetch('/api/admin/branches', {}, token);
        if (bRes.ok) setAllBranches(await bRes.json());
      } else {
        setCompStatus({ success: false, message: data?.message || "Error al aplicar" });
      }
    } catch (err) {
      setCompStatus({ success: false, message: "Error de conexión" });
    } finally {
      setIsCompensating(false);
    }
  };

  const tabs = useMemo(() => ([
    { id: 'overview', label: 'Resumen', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'users', label: 'Usuarios', icon: <Users className="w-5 h-5 text-neon-purple" /> },
    { id: 'branches_mgmt', label: 'Sucursales', icon: <Store className="w-5 h-5 text-neon-green" /> },
    { id: 'activations', label: 'Activaciones', icon: <Sparkles className="w-5 h-5 text-neon-cyan" /> },
    { id: 'compensations', label: 'Bonos / Regalos', icon: <Gift className="w-5 h-5 text-amber-400" /> },
    { id: 'incidents', label: 'Incidentes', icon: <AlertTriangle className="w-5 h-5" /> },
  ]), []);

  const stats = useMemo(() => {
    const activeBranches = allBranches.filter(b => b.status === 'Online').length;
    const totalBranches = allBranches.length;
    const streamHealth = totalBranches > 0 ? Math.round((activeBranches / totalBranches) * 100) : 100;
    const activeClients = allUsers.filter(u => u.role === 'CLIENT').length;
    const criticalAlerts = incidents.filter(i => i.status !== 'RESOLVED').length;

    return [
      { label: 'Sucursales Activas', value: totalBranches, trend: '+8%', icon: <Radio className="text-neon-cyan" /> },
      { label: 'Streams Saludables', value: `${streamHealth}%`, trend: 'Estable', icon: <Activity className="text-neon-green" /> },
      { label: 'Clientes Activos', value: activeClients, trend: '+4', icon: <Users className="text-neon-purple" /> },
      { label: 'Alertas Criticas', value: criticalAlerts, trend: criticalAlerts > 0 ? '+1' : 'Estable', icon: <AlertTriangle className="text-amber-400" /> },
    ];
  }, [allBranches, allUsers, incidents]);

  const recentStreams = useMemo(() => {
    return allBranches
      .filter(b => b.station)
      .slice(0, 3)
      .map(b => ({
        id: b.id.slice(-5).toUpperCase(),
        name: b.name,
        station: b.station.name,
        status: b.status === 'Online' ? 'Ok' : 'Offline',
        latency: b.status === 'Online' ? '42ms' : 'N/A'
      }));
  }, [allBranches]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] bg-slate-900/80 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Admin" className="h-8 w-auto object-contain" />
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white bg-white/5 rounded-xl border border-white/10"
        >
          {isMobileMenuOpen ? <Plus className="w-6 h-6 rotate-45" /> : <LayoutGrid className="w-6 h-6 text-neon-cyan" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-[150] bg-slate-950 p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Admin" className="h-10 w-auto object-contain" />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-xl"><Plus className="w-6 h-6 rotate-45" /></button>
            </div>

            <nav className="flex-grow space-y-4">
              {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-neon-cyan text-slate-950' : 'text-slate-400 bg-white/5'}`}
                >
                  {tab.icon}
                  <span className="font-black text-sm uppercase tracking-widest">{tab.label}</span>
                </button>
              ))}
            </nav>

            <button onClick={handleLogout} className="mt-auto w-full flex items-center justify-center gap-4 p-5 text-red-400 bg-red-500/10 rounded-2xl font-bold uppercase tracking-widest">
              <LogOut className="w-5 h-5" /> Salir
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex">
        <aside className="w-72 bg-slate-900/50 border-r border-white/5 p-8 hidden lg:flex flex-col sticky top-0 h-screen">
          <div className="flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="Admin" className="h-14 w-auto object-contain" />
          </div>

          <div className="mb-8">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 ml-2">Sesion</p>
            <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4">
              <p className="text-sm font-black uppercase tracking-tighter">{user?.name || 'Administrador'}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.email || 'admin@radiocontrols.mx'}</p>
              <span className="inline-flex mt-3 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-neon-cyan/10 text-neon-cyan">
                {user?.role || 'ADMIN'}
              </span>
            </div>
          </div>

          <nav className="flex-grow space-y-3">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-4">Panel</p>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'bg-neon-cyan text-slate-950 shadow-xl' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                {tab.icon}
                <span className="font-bold text-sm uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-8 border-t border-white/5">
            <button className="w-full flex items-center gap-4 px-5 py-4 text-slate-300 hover:bg-white/5 rounded-2xl transition-all font-bold text-sm uppercase tracking-widest">
              <Wrench className="w-5 h-5" /> Mantenimiento
            </button>
            <button onClick={handleLogout} className="mt-3 w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold text-sm uppercase tracking-widest">
              <LogOut className="w-5 h-5" /> Salir
            </button>
          </div>
        </aside>

        <main className="flex-grow p-6 lg:p-12 pt-24 lg:pt-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">Panel Admin</h1>
              <p className="text-slate-500 font-medium">Control total de streams, clientes y operacion.</p>
            </motion.div>
            <div className="flex gap-3">
              <button className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10">Ver Logs</button>
              <button className="bg-neon-cyan text-slate-950 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-[0_0_25px_rgba(0,243,255,0.4)]">
                <Plus className="w-4 h-4" /> Nuevo Cliente
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {stats.map((st, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[28px] backdrop-blur-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-950 rounded-xl border border-white/5">{st.icon}</div>
                  <span className="text-[10px] font-black text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded-lg uppercase tracking-widest">{st.trend}</span>
                </div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{st.label}</p>
                <p className="text-3xl font-black text-white">{st.value}</p>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                  {/* Resumen de Suscripciones Real */}
                  <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-neon-cyan" /> Estado de Suscripciones
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-950 border border-white/5 p-5 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Activas</p>
                        <p className="text-2xl font-black text-emerald-400">{allBranches.filter(b => b.subscriptionStatus === 'ACTIVE').length}</p>
                        <p className="text-slate-500 text-[9px] uppercase font-bold">Generando ingresos</p>
                      </div>
                      <div className="bg-slate-950 border border-white/5 p-5 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pendientes / Past Due</p>
                        <p className="text-2xl font-black text-amber-400">{allBranches.filter(b => b.subscriptionStatus === 'PAST_DUE' || b.subscriptionStatus === 'INCOMPLETE').length}</p>
                        <p className="text-slate-500 text-[9px] uppercase font-bold">Requieren atención</p>
                      </div>
                      <div className="bg-slate-950 border border-white/5 p-5 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Renovables</p>
                        <p className="text-2xl font-black text-red-400">{allBranches.filter(b => b.subscriptionStatus === 'CANCELED').length}</p>
                        <p className="text-slate-500 text-[9px] uppercase font-bold">Finalizan este periodo</p>
                      </div>
                    </div>
                  </div>

                  {/* Streams Recientes */}
                  <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                      <Server className="w-6 h-6 text-neon-cyan" /> Operación de Streams
                    </h3>
                    <div className="space-y-4">
                      {recentStreams.length === 0 ? (
                        <p className="text-center text-slate-500 py-4 font-bold uppercase text-xs tracking-widest">No hay sucursales configuradas.</p>
                      ) : (
                        recentStreams.map((s) => (
                          <div key={s.id} className="flex items-center justify-between p-4 bg-slate-950/60 border border-white/5 rounded-2xl">
                            <div>
                              <p className="font-black uppercase tracking-tighter">{s.name}</p>
                              <p className="text-xs text-slate-500 uppercase tracking-widest">{s.station}</p>
                            </div>
                            <div className="flex items-center gap-6">
                              <span className="text-xs text-slate-400">{s.latency}</span>
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${s.status === 'Ok' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                                {s.status}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Métricas de Negocio */}
                <div className="space-y-8">
                  <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                      <BarChart3 className="w-6 h-6 text-neon-purple" /> Distribución de Planes
                    </h3>
                    <div className="space-y-6">
                      {[
                        { label: 'Profesional (Anual)', count: allBranches.filter(b => b.plan === 'YEARLY').length, color: 'bg-neon-cyan' },
                        { label: 'Básico (Mensual)', count: allBranches.filter(b => b.plan === 'MONTHLY').length, color: 'bg-neon-purple' },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                            <span>{item.label}</span>
                            <span className="text-white">{item.count}</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.color}`} 
                              style={{ width: allBranches.length > 0 ? `${(item.count / allBranches.length) * 100}%` : '0%' }} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-950/20 to-slate-900/50 border border-emerald-900/30 p-8 rounded-[32px]">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-4 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-emerald-400" /> Ingresos Estimados
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Valor de Cartera</p>
                        <p className="text-3xl font-black text-white">
                          ${(
                            allBranches.filter(b => b.subscriptionStatus === 'ACTIVE' && b.plan === 'YEARLY').length * 5390 +
                            allBranches.filter(b => b.subscriptionStatus === 'ACTIVE' && b.plan === 'MONTHLY').length * 539
                          ).toLocaleString('es-MX')} MXN
                        </p>
                      </div>
                      <p className="text-[9px] text-slate-500 uppercase font-bold italic">
                        * Cálculo basado en suscripciones activas actuales.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'activations' && (
              <motion.div key="activations" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-2 flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-neon-cyan" /> Activación Manual
                      </h3>
                      <p className="text-slate-500 font-medium italic">Activa sucursales para clientes que pagaron vía transferencia.</p>
                    </div>
                  </div>

                  <form onSubmit={handleManualActivation} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email del Cliente</label>
                        <div className="relative group">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-neon-cyan transition-colors" />
                          <input 
                            type="email" 
                            placeholder="cliente@ejemplo.com"
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none"
                            value={manualData.userEmail}
                            onChange={(e) => setManualData({...manualData, userEmail: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Nombre de la Sucursal</label>
                        <div className="relative group">
                          <Store className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-neon-cyan transition-colors" />
                          <input 
                            type="text" 
                            placeholder="Ej: Polanco - Corporativo"
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none"
                            value={manualData.branchName}
                            onChange={(e) => setManualData({...manualData, branchName: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Estación Existente (Opcional)</label>
                        <select 
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none appearance-none"
                          value={manualData.stationId}
                          onChange={(e) => setManualData({...manualData, stationId: e.target.value})}
                        >
                          <option value="">Ninguna - Usar URL personalizada ↓</option>
                          {stations.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">URL de Streaming (Si es nueva)</label>
                        <div className="relative group">
                          <Radio className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-neon-cyan transition-colors" />
                          <input 
                            type="text" 
                            placeholder="https://servidor.com/stream"
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 pl-16 pr-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none"
                            value={manualData.streamingUrl || ''}
                            onChange={(e) => setManualData({...manualData, streamingUrl: e.target.value})}
                          />
                        </div>
                        <p className="text-[9px] text-slate-600 ml-4 italic">* Deja vacío si aún no tienes el link de audio.</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Paquete / Plan</label>
                        <select 
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none appearance-none"
                          value={manualData.plan}
                          onChange={(e) => setManualData({...manualData, plan: e.target.value})}
                          required
                        >
                          <option value="MONTHLY">Básico Mensual</option>
                          <option value="YEARLY">Profesional Anual</option>
                          <option value="CUSTOM">Personalizado (Pruebas)</option>
                        </select>
                      </div>

                      {manualData.plan === 'CUSTOM' && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Cantidad</label>
                            <input 
                              type="number" 
                              className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none"
                              value={manualData.customAmount}
                              onChange={(e) => setManualData({...manualData, customAmount: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Unidad</label>
                            <select 
                              className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none appearance-none"
                              value={manualData.customUnit}
                              onChange={(e) => setManualData({...manualData, customUnit: e.target.value})}
                              required
                            >
                              <option value="MINUTES">Minutos</option>
                              <option value="HOURS">Horas</option>
                              <option value="DAYS">Días</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2 pt-4">
                      {activationStatus && (
                        <div className={`mb-6 p-4 rounded-2xl text-xs font-black uppercase tracking-widest border ${activationStatus.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                          {activationStatus.message}
                        </div>
                      )}
                      <button 
                        type="submit"
                        disabled={isActivating}
                        className="w-full bg-neon-cyan text-slate-950 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-neon-cyan/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {isActivating ? 'Activando...' : 'Confirmar y Activar Sucursal'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'streams' && (
              <motion.div key="streams" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                      <Radio className="w-6 h-6 text-neon-cyan" /> Gestion de Streams
                    </h3>
                    <button className="bg-neon-cyan text-slate-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Agregar</button>
                  </div>
                  <div className="space-y-4">
                    {streams.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-4 bg-slate-950/60 border border-white/5 rounded-2xl">
                        <div>
                          <p className="font-black uppercase tracking-tighter">{s.name}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-widest">{s.station}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Eye className="w-3 h-3" /> Ver
                          </button>
                          <button className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Link2 className="w-3 h-3" /> Copiar
                          </button>
                          <button className="bg-white/5 border border-white/10 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Settings className="w-3 h-3" /> Ajustar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-8">
                {/* Formulario de Creación (Ya existente) */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 backdrop-blur-xl">
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <Plus className="w-6 h-6 text-neon-cyan" /> Crear Nuevo Usuario
                  </h3>
                  <form onSubmit={handleAdminCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Nombre</label>
                      <input 
                        type="text" 
                        placeholder="Nombre completo"
                        className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-neon-cyan/50 focus:outline-none"
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Email</label>
                      <input 
                        type="email" 
                        placeholder="correo@ejemplo.com"
                        className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-neon-cyan/50 focus:outline-none"
                        value={userData.email}
                        onChange={(e) => setUserData({...userData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Contraseña</label>
                      <input 
                        type="password" 
                        placeholder="Contraseña"
                        className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-neon-cyan/50 focus:outline-none"
                        value={userData.password}
                        onChange={(e) => setUserData({...userData, password: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Rol</label>
                      <select 
                        className="w-full bg-slate-950 border border-white/5 rounded-xl py-3 px-4 text-white text-sm focus:border-neon-cyan/50 focus:outline-none appearance-none"
                        value={userData.role}
                        onChange={(e) => setUserData({...userData, role: e.target.value})}
                        required
                      >
                        <option value="CLIENT">Cliente</option>
                        <option value="ADMIN">Administrador</option>
                        <option value="STAFF">Staff / Soporte</option>
                      </select>
                    </div>
                    <div className="lg:col-span-4 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                      {userCreateStatus && (
                        <span className={`text-[10px] font-black uppercase tracking-widest ${userCreateStatus.success ? 'text-emerald-400' : 'text-red-400'}`}>
                          {userCreateStatus.message}
                        </span>
                      )}
                      <button 
                        type="submit"
                        disabled={isCreatingUser}
                        className="w-full md:w-auto bg-neon-cyan text-slate-950 px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all disabled:opacity-50"
                      >
                        {isCreatingUser ? 'Creando...' : 'Crear Usuario'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Lista de Usuarios REALES */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                    <Users className="w-6 h-6 text-neon-cyan" /> Usuarios Registrados en el Sistema
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allUsers.map((u) => (
                      <div key={u.id} className="p-6 bg-slate-950/60 border border-white/5 rounded-3xl hover:border-white/10 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-black text-white uppercase tracking-tighter text-lg">{u.name}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{u.email}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-cyan/20 text-neon-cyan'}`}>
                            {u.role}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                           <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sucursales: <span className="text-white">{u._count?.branches || 0}</span></div>
                           <span className={`w-2 h-2 rounded-full ${u.isVerified ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'branches_mgmt' && (
              <motion.div key="branches_mgmt" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-8">
                <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <Store className="w-6 h-6 text-neon-green" /> Control Global de Sucursales
                  </h3>
                  
                  <div className="space-y-6">
                    {allBranches.map((b) => (
                      <div key={b.id} className="p-8 bg-slate-950/60 border border-white/5 rounded-[40px] hover:border-white/10 transition-all">
                        {/* Header de la Sucursal */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 pb-6 border-b border-white/5">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-black text-white uppercase tracking-tighter text-2xl">{b.name}</p>
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${b.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                {b.subscriptionStatus || 'SIN PLAN'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <span>Dueño: <span className="text-slate-300">{b.owner?.name} ({b.owner?.companyName || 'N/A'})</span></span>
                              <span>Slug: <span className="text-neon-cyan">{b.slug}</span></span>
                              <span>Estado: <span className={b.status === 'Online' ? 'text-emerald-400' : 'text-amber-400'}>{b.status}</span></span>
                            </div>
                          </div>
                          <button 
                            className="flex items-center gap-2 px-6 py-3 bg-neon-cyan text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-neon-cyan/20 transition-all"
                            onClick={() => window.open(`/player/${b.slug}`, '_blank')}
                          >
                            <Link2 className="w-4 h-4" /> Abrir Player
                          </button>
                        </div>

                        {/* Perfil de Contenido (Psicodemografía) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                          <div className="bg-white/5 p-6 rounded-[24px]">
                            <p className="text-[10px] font-black text-neon-cyan uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Users className="w-3 h-3" /> Perfil de Audiencia
                            </p>
                            <p className="text-xs text-slate-300 italic leading-relaxed">
                              {b.targetAudience || "El cliente aún no ha definido su audiencia."}
                            </p>
                          </div>
                          <div className="bg-white/5 p-6 rounded-[24px]">
                            <p className="text-[10px] font-black text-neon-purple uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Sparkles className="w-3 h-3" /> Atmósfera y Anuncios
                            </p>
                            <p className="text-xs text-slate-300 italic leading-relaxed">
                              {b.adRequirements || "Sin requerimientos de anuncios registrados."}
                            </p>
                          </div>
                        </div>

                        {/* Gestión de Streaming */}
                        <div className="bg-slate-900/40 p-6 rounded-[32px] border border-white/5">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 ml-2">Configuración de Audio (Streaming)</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Opción 1: Elegir Estación Existente */}
                            <div className="space-y-3">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-2">Asignar Estación Existente</label>
                              <select 
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-4 text-xs font-black uppercase tracking-widest text-white focus:border-neon-cyan/50 focus:outline-none appearance-none cursor-pointer"
                                value={b.stationId || ''}
                                onChange={(e) => handleAssignStation(b.id, e.target.value)}
                              >
                                <option value="">Sin Estación</option>
                                {stations.map(s => (
                                  <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                              </select>
                            </div>

                            {/* Opción 2: Pegar URL Directa */}
                            <div className="space-y-3">
                              <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-2">Vincular Nueva URL de Streaming</label>
                              <div className="flex gap-2">
                                <input 
                                  type="text"
                                  placeholder="https://..."
                                  className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-4 text-xs text-white focus:border-neon-cyan/50 focus:outline-none"
                                  value={quickUrls[b.id] || ''}
                                  onChange={(e) => setQuickUrls({...quickUrls, [b.id]: e.target.value})}
                                />
                                <button 
                                  className="px-6 bg-white/10 hover:bg-white text-white hover:text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                                  onClick={() => handleQuickStationCreate(b.id, quickUrls[b.id])}
                                  disabled={isLinking[b.id] || !quickUrls[b.id]}
                                >
                                  {isLinking[b.id] ? 'Vinculando...' : 'Vincular'}
                                </button>
                              </div>
                            </div>
                          </div>
                          {b.station && (
                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                Audio Actual: <span className="text-white ml-2">{b.station.name}</span> 
                                <span className="text-slate-600 ml-2 italic">({b.station.streamUrl})</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'compensations' && (
              <motion.div key="compensations" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
                  <div className="mb-10">
                    <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-2 flex items-center gap-3">
                      <Gift className="w-8 h-8 text-amber-400" /> Bonificaciones y Regalos
                    </h3>
                    <p className="text-slate-500 font-medium italic">Regala tiempo extra o compensa a tus clientes por incidencias técnicas.</p>
                  </div>

                  <form onSubmit={handleCompensate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Seleccionar Sucursal</label>
                        <select 
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none appearance-none"
                          value={compData.branchId}
                          onChange={(e) => setCompData({...compData, branchId: e.target.value})}
                          required
                        >
                          <option value="">¿A quién bonificamos?</option>
                          {allBranches.map(b => (
                            <option key={b.id} value={b.id}>{b.name} ({b.owner?.name})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Cantidad</label>
                          <input 
                            type="number" 
                            placeholder="Ej: 5"
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none"
                            value={compData.amount}
                            onChange={(e) => setCompData({...compData, amount: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Unidad</label>
                          <select 
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none appearance-none"
                            value={compData.unit}
                            onChange={(e) => setCompData({...compData, unit: e.target.value})}
                            required
                          >
                            <option value="MINUTES">Minutos</option>
                            <option value="HOURS">Horas</option>
                            <option value="DAYS">Días</option>
                            <option value="MONTHS">Meses</option>
                            <option value="YEARS">Años</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Motivo / Razón</label>
                        <textarea 
                          rows="5"
                          placeholder="Ej: Compensación por caída de servidor de 2 horas."
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none resize-none"
                          value={compData.reason}
                          onChange={(e) => setCompData({...compData, reason: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                      {compStatus && (
                        <div className={`mb-6 p-4 rounded-2xl text-xs font-black uppercase tracking-widest border ${compStatus.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}>
                          {compStatus.message}
                        </div>
                      )}
                      <button 
                        type="submit"
                        disabled={isCompensating || !compData.branchId}
                        className="w-full bg-amber-500 text-slate-950 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        {isCompensating ? 'Procesando...' : 'Aplicar Regalo / Bonificación'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'incidents' && (
              <motion.div key="incidents" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-8">
                <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-amber-400" /> Reportes de Clientes
                    </h3>
                    <div className="px-4 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                      {incidents.filter(i => i.status !== 'RESOLVED').length} Pendientes
                    </div>
                  </div>

                  <div className="space-y-4">
                    {isLoadingIncidents ? (
                      <p className="text-center text-slate-500 py-10 font-bold uppercase text-xs tracking-widest animate-pulse">Cargando reportes...</p>
                    ) : incidents.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                        <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
                        <p className="font-black uppercase text-xs tracking-[0.2em]">Todo bajo control. Sin incidentes.</p>
                      </div>
                    ) : incidents.map((inc) => (
                      <div key={inc.id} className="p-6 bg-slate-950/60 border border-white/5 rounded-[32px] hover:border-white/10 transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                          <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-black text-white uppercase tracking-tighter text-lg">{inc.title}</p>
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                inc.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' : 
                                inc.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400' : 
                                'bg-emerald-500/10 text-emerald-400'
                              }`}>
                                {inc.status === 'PENDING' ? 'Pendiente' : inc.status === 'IN_PROGRESS' ? 'En revisión' : 'Resuelto'}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                              <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {inc.user?.name} ({inc.user?.companyName || 'Sin Empresa'})</span>
                              <span className="flex items-center gap-1.5"><Store className="w-3 h-3" /> Sucursal: {inc.branch?.name || 'General'}</span>
                              <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-neon-cyan" /> {inc.user?.email}</span>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed bg-white/5 p-4 rounded-2xl italic">
                              "{inc.description}"
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Cambiar Estado</p>
                            <select 
                              className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white focus:border-neon-cyan/50 focus:outline-none appearance-none cursor-pointer"
                              value={inc.status}
                              onChange={(e) => handleUpdateStatus(inc.id, e.target.value)}
                            >
                              <option value="PENDING">Marcar Pendiente</option>
                              <option value="IN_PROGRESS">En Revisión</option>
                              <option value="RESOLVED">Resuelto</option>
                            </select>
                            <a 
                              href={`https://wa.me/${inc.user?.phoneNumber?.replace(/\D/g, '') || ''}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
                            >
                              <PhoneCall className="w-3 h-3" /> Contactar WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                      <Settings className="w-6 h-6 text-neon-cyan" /> Ajustes Operativos
                    </h3>
                    <div className="space-y-4 text-sm text-slate-400">
                      <div className="flex justify-between"><span>Modo Mantenimiento</span><span className="text-amber-300">Desactivado</span></div>
                      <div className="flex justify-between"><span>Rotacion de Logs</span><span className="text-emerald-300">Activa</span></div>
                      <div className="flex justify-between"><span>Backups</span><span className="text-emerald-300">Ultimo: hoy</span></div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-950/20 to-purple-950/20 border border-cyan-900/30 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                      <Activity className="w-6 h-6 text-neon-cyan" /> Observabilidad
                    </h3>
                    <p className="text-slate-400 text-sm mb-6">Monitorea eventos y desempeno por nodo en tiempo real.</p>
                    <button className="bg-neon-cyan text-slate-950 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest">Abrir Observabilidad</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Admin;
