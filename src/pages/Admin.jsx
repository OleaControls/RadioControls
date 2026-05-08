import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Activity, Users, Radio, Settings,
  AlertTriangle, CheckCircle2, Plus, Cpu,
  Eye, LogOut, Mail, Store, LayoutGrid,
  CreditCard, PhoneCall, Search, Trash2,
  Zap, TrendingUp, Clock, Terminal, ShieldAlert,
  User as UserIcon, Menu, X, Radio as RadioIcon,
  DollarSign, Wifi, WifiOff, RefreshCw, ChevronRight,
  Building2, Headphones, Send
} from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/apiFetch';

/* ─── Aurora BG ──────────────────────────────────── */
const Aurora = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="animate-pulse absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[150px] opacity-[0.06]"
      style={{ background: 'radial-gradient(circle, #00f3ff 0%, transparent 70%)', animationDuration: '4s' }} />
    <div className="animate-pulse absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-[0.06]"
      style={{ background: 'radial-gradient(circle, #bc13fe 0%, transparent 70%)', animationDuration: '6s' }} />
  </div>
);

/* ─── Status dot ─────────────────────────────────── */
const Dot = ({ active }) => (
  <span className={`inline-flex w-2 h-2 rounded-full ${active ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-red-400'}`} />
);

/* ─── Stat Card ──────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, color, sub }) => {
  const colors = {
    cyan:   { text: 'text-neon-cyan',   bg: 'bg-neon-cyan/10',   border: 'border-neon-cyan/20'   },
    purple: { text: 'text-neon-purple', bg: 'bg-neon-purple/10', border: 'border-neon-purple/20' },
    green:  { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    amber:  { text: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/20'   },
  };
  const c = colors[color] || colors.cyan;
  return (
    <div className={`glass rounded-[2rem] p-6 border ${c.border} relative overflow-hidden group hover:scale-[1.02] transition-all`}>
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${c.text}`} />
      </div>
      <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">{label}</p>
      <p className={`text-3xl font-display ${c.text}`}>{value}</p>
      {sub && <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-widest font-bold">{sub}</p>}
    </div>
  );
};

/* ─── Section header ─────────────────────────────── */
const SectionHeader = ({ icon: Icon, title, color = 'text-neon-cyan', action }) => (
  <div className="flex items-center justify-between mb-8">
    <h3 className="font-display text-2xl uppercase flex items-center gap-3">
      <Icon className={`w-6 h-6 ${color}`} /> {title}
    </h3>
    {action}
  </div>
);

/* ─── Empty State ────────────────────────────────── */
const Empty = ({ icon: Icon, label }) => (
  <div className="py-20 text-center flex flex-col items-center gap-4 opacity-30">
    <Icon size={48} />
    <p className="font-black uppercase text-[10px] tracking-[0.3em]">{label}</p>
  </div>
);

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
const Admin = () => {
  const [activeTab, setActiveTab]   = useState('overview');
  const [sidebarOpen, setSidebar]   = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers]       = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [stations, setStations]       = useState([]);
  const [incidents, setIncidents]     = useState([]);
  const [auditLogs, setAuditLogs]     = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [refreshing, setRefreshing]   = useState(false);

  const [clock, setClock] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const [manualData, setManualData] = useState({
    userEmail: '', branchName: '', stationId: '',
    plan: 'MONTHLY', customAmount: '', customUnit: 'MINUTES'
  });
  const [activationMsg, setActivationMsg] = useState('');

  /* ── Load ── */
  useEffect(() => {
    if (isAuthenticated) loadInitialData();
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [uRes, bRes, sRes, iRes] = await Promise.all([
        apiFetch('/api/admin/users'),
        apiFetch('/api/admin/branches'),
        apiFetch('/api/stations'),
        apiFetch('/api/incidents'),
      ]);
      if (uRes.ok)  setAllUsers(   await uRes.json().then(d => Array.isArray(d) ? d : []));
      if (bRes.ok)  setAllBranches(await bRes.json().then(d => Array.isArray(d) ? d : []));
      if (sRes.ok)  setStations(   await sRes.json().then(d => Array.isArray(d) ? d : []));
      if (iRes.ok)  setIncidents(  await iRes.json().then(d => Array.isArray(d) ? d : []));
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const fetchAuditLogs = async () => {
    const res = await apiFetch('/api/admin/audit-logs');
    if (res.ok) setAuditLogs(await res.json().then(d => Array.isArray(d) ? d : []));
  };

  const fetchHealth = async () => {
    const res = await apiFetch('/api/admin/health');
    if (res.ok) setSystemHealth(await res.json());
  };

  useEffect(() => {
    if (activeTab === 'audit')    fetchAuditLogs();
    if (activeTab === 'settings') fetchHealth();
  }, [activeTab]);

  /* ── Actions ── */
  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Eliminar este usuario y todas sus sucursales?')) return;
    const res = await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) setAllUsers(p => p.filter(u => u.id !== id));
  };

  const handleDeleteStation = async (id) => {
    if (!window.confirm('¿Eliminar esta estación master?')) return;
    const res = await apiFetch(`/api/admin/stations/${id}`, { method: 'DELETE' });
    if (res.ok) setStations(p => p.filter(s => s.id !== id));
  };

  const handleManualActivation = async (e) => {
    e.preventDefault();
    setActivationMsg('');
    const res = await apiFetch('/api/branches/admin-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(manualData),
    });
    if (res.ok) {
      setActivationMsg('success');
      setManualData({ userEmail: '', branchName: '', stationId: '', plan: 'MONTHLY', customAmount: '', customUnit: 'MINUTES' });
      loadInitialData();
    } else {
      const data = await res.json();
      setActivationMsg(data.message || 'Error al activar');
    }
  };

  const handleAssignStation = async (branchId, stationId) => {
    const res = await apiFetch('/api/admin/assign-station', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ branchId, stationId }),
    });
    if (res.ok) loadInitialData();
  };

  const handleUpdateIncident = async (id, status) => {
    const res = await apiFetch(`/api/incidents/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setIncidents(p => p.map(i => i.id === id ? { ...i, status } : i));
  };

  /* ── Stats ── */
  const stats = useMemo(() => {
    const clients     = allUsers.filter(u => u.role === 'CLIENT').length;
    const activeSubs  = allBranches.filter(b => b.subscriptionStatus === 'ACTIVE').length;
    const pendingTix  = incidents.filter(i => i.status !== 'RESOLVED').length;
    const income      = allBranches.filter(b => b.subscriptionStatus === 'ACTIVE')
                          .reduce((acc, b) => acc + (b.plan === 'YEARLY' ? 5390 : 539), 0);
    return { clients, activeSubs, pendingTix, stationsCount: stations.length, income };
  }, [allUsers, allBranches, incidents, stations]);

  const healthPct = useMemo(() => {
    if (!allBranches.length) return 0;
    return Math.round((allBranches.filter(b => b.subscriptionStatus === 'ACTIVE').length / allBranches.length) * 100);
  }, [allBranches]);

  /* ── Filters ── */
  const filteredUsers    = allUsers.filter(u =>
    (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredBranches = allBranches.filter(b =>
    (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.owner?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── Tabs config ── */
  const tabs = [
    { id: 'overview',      label: 'Dashboard',    icon: LayoutGrid   },
    { id: 'users',         label: 'Usuarios',     icon: Users        },
    { id: 'branches_mgmt', label: 'Sucursales',   icon: Store        },
    { id: 'activation',    label: 'Activación',   icon: Plus         },
    { id: 'stations',      label: 'Estaciones',   icon: RadioIcon    },
    { id: 'incidents',     label: 'Soporte',      icon: AlertTriangle},
    { id: 'audit',         label: 'Auditoría',    icon: ShieldCheck  },
    { id: 'settings',      label: 'Sistema',      icon: Settings     },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  const goTab = (id) => {
    setActiveTab(id);
    setSearchQuery('');
    setSidebar(false);
  };

  /* ─── INPUT STYLE ────────────────────────────── */
  const inp = 'w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-neon-cyan transition-all text-white placeholder:text-gray-600';
  const sel = `${inp} appearance-none cursor-pointer`;

  /* ══════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════ */
  return (
    <div className="h-screen bg-void text-white selection:bg-neon-cyan/30 flex overflow-hidden relative">
      <Aurora />

      {/* ─── Mobile overlay ──────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebar(false)} />
      )}

      {/* ════════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════════ */}
      <aside className={`fixed lg:relative top-0 left-0 h-full w-72 flex flex-col bg-black/60 border-r border-white/[0.06] backdrop-blur-2xl z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/img%20radio%20lea/logosinfondoradiolea.svg" alt="Admin" className="h-9 w-auto" />
            <div>
              <p className="font-display text-sm uppercase tracking-tighter text-white">Admin</p>
              <p className="text-[9px] text-neon-cyan font-bold uppercase tracking-[0.3em]">Panel Central</p>
            </div>
          </div>
          <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setSidebar(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Admin info */}
        <div className="mx-6 mb-6 p-4 rounded-2xl bg-neon-cyan/5 border border-neon-cyan/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-neon-cyan" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrador'}</p>
              <p className="text-[9px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-grow px-4 space-y-1 overflow-y-auto">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            const badge = id === 'incidents' ? incidents.filter(i => i.status !== 'RESOLVED').length : null;
            return (
              <button
                key={id}
                onClick={() => goTab(id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl transition-all text-left ${
                  isActive
                    ? 'bg-neon-cyan text-void font-black shadow-[0_0_20px_rgba(0,243,255,0.2)]'
                    : 'text-gray-500 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] uppercase tracking-widest font-bold">{label}</span>
                </span>
                {badge > 0 && (
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${isActive ? 'bg-void/20' : 'bg-amber-400/20 text-amber-400'}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-white/[0.06]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut size={16} />
            <span className="text-[11px] uppercase tracking-widest font-black">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════ */}
      <main className="flex-grow overflow-y-auto h-screen relative">
        {/* ══ TOP BAR ══════════════════════════════════ */}
        <header className="sticky top-0 z-40 bg-void/90 backdrop-blur-2xl border-b border-white/[0.06]">
          <div className="flex items-center justify-between gap-4 px-6 py-3">

            {/* LEFT — Hamburger + Breadcrumb */}
            <div className="flex items-center gap-4 min-w-0">
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all shrink-0"
                onClick={() => setSidebar(true)}
              >
                <Menu size={17} />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="/img%20radio%20lea/logosinfondoradiolea.svg"
                  alt="logo"
                  className="h-6 w-auto opacity-40 hidden lg:block shrink-0"
                />
                <span className="text-gray-700 text-sm hidden lg:block">/</span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-2.5 min-w-0"
                  >
                    {React.createElement(
                      tabs.find(t => t.id === activeTab)?.icon || LayoutGrid,
                      { className: 'w-4 h-4 text-neon-cyan shrink-0' }
                    )}
                    <span className="font-display text-lg uppercase tracking-tighter leading-none truncate">
                      {tabs.find(t => t.id === activeTab)?.label}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT — Search · Clock · Tickets · Refresh · User */}
            <div className="flex items-center gap-2 shrink-0">

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar…"
                  className="bg-white/[0.04] border border-white/[0.08] rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:border-neon-cyan/50 focus:bg-white/[0.06] transition-all w-44 placeholder:text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-5 bg-white/10" />

              {/* Live clock */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <Clock className="w-3 h-3 text-gray-600" />
                <span className="text-[10px] font-mono text-gray-500 tracking-widest">{clock}</span>
              </div>

              {/* Pending tickets badge */}
              {stats.pendingTix > 0 && (
                <button
                  onClick={() => goTab('incidents')}
                  className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 hover:bg-amber-400/20 transition-all"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Tickets</span>
                  <span className="text-[10px] font-black bg-amber-400 text-void rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {stats.pendingTix}
                  </span>
                </button>
              )}

              {/* Refresh */}
              <button
                onClick={handleRefresh}
                title="Refrescar datos"
                className={`w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.08] text-gray-500 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all ${refreshing ? 'animate-spin' : ''}`}
              >
                <RefreshCw size={14} />
              </button>

              {/* User chip */}
              <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08] ml-1">
                <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-neon-cyan" />
                </div>
                <div className="hidden xl:block">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{user?.name?.split(' ')[0] || 'Admin'}</p>
                  <p className="text-[8px] text-gray-600 uppercase tracking-[0.2em]">Administrador</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent" />
        </header>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto relative z-10 space-y-8">

          {/* ── Stats Bar (always visible) ── */}
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
            <StatCard label="Clientes"      value={stats.clients}       icon={Users}        color="purple" />
            <StatCard label="Suscripciones" value={stats.activeSubs}    icon={CreditCard}   color="cyan"   sub={`${healthPct}% activas`} />
            <StatCard label="Tickets"       value={stats.pendingTix}    icon={AlertTriangle} color="amber" sub="sin resolver" />
            <StatCard label="Estaciones"    value={stats.stationsCount} icon={RadioIcon}    color="green"  />
            <StatCard
              label="Ingreso est."
              value={`$${stats.income.toLocaleString()}`}
              icon={DollarSign}
              color="green"
              sub="MXN / mes"
            />
          </div>

          {/* ── Tab Content ── */}
          <AnimatePresence mode="wait">

            {/* ════ OVERVIEW ════ */}
            {activeTab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Income */}
                  <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/5 rounded-full blur-[80px]" />
                    <SectionHeader icon={TrendingUp} title="Finanzas" color="text-emerald-400" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-emerald-400/5 border border-emerald-400/10 rounded-[1.5rem] p-6">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Ingreso Mensual Est.</p>
                        <p className="text-4xl font-display text-emerald-400">${stats.income.toLocaleString()}</p>
                        <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-widest">MXN / mes</p>
                      </div>
                      <div className="bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-6">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Salud de Cartera</p>
                        <p className="text-4xl font-display text-white">{healthPct}%</p>
                        <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-widest">suscripciones activas</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="glass rounded-[2.5rem] p-8">
                    <SectionHeader icon={Zap} title="Accesos Rápidos" color="text-amber-400" />
                    <div className="space-y-3">
                      {[
                        { label: 'Tickets Pendientes', count: stats.pendingTix,    tab: 'incidents', color: 'amber' },
                        { label: 'Activar Sucursal',   count: null,                tab: 'activation',color: 'cyan'  },
                        { label: 'Auditoría de Red',   count: null,                tab: 'audit',     color: 'purple'},
                      ].map(({ label, count, tab, color }) => {
                        const colors = {
                          amber:  'bg-amber-400/10 border-amber-400/20 text-amber-400 hover:bg-amber-400/20',
                          cyan:   'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/20',
                          purple: 'bg-neon-purple/10 border-neon-purple/20 text-neon-purple hover:bg-neon-purple/20',
                        };
                        return (
                          <button key={tab} onClick={() => goTab(tab)}
                            className={`w-full p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all ${colors[color]}`}>
                            {label}
                            {count != null ? <span className="text-sm font-display">{count}</span> : <ChevronRight size={14} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recent branches */}
                <div className="glass rounded-[2.5rem] p-8">
                  <SectionHeader icon={Store} title="Sucursales Recientes" />
                  <div className="space-y-3">
                    {allBranches.slice(0, 5).map(b => (
                      <div key={b.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                          <Dot active={b.subscriptionStatus === 'ACTIVE'} />
                          <span className="text-sm font-heading font-bold text-white">{b.name}</span>
                          <span className="text-[9px] text-gray-600 uppercase tracking-widest hidden md:block">{b.owner?.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">{b.plan}</span>
                          <button onClick={() => window.open(`/player/${b.slug}`, '_blank')}
                            className="p-2 rounded-lg bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-all">
                            <Headphones size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {allBranches.length === 0 && <Empty icon={Store} label="Sin sucursales registradas" />}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════ USUARIOS ════ */}
            {activeTab === 'users' && (
              <motion.div key="us" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-4 md:hidden">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input type="text" placeholder="Buscar usuario..." className={`${inp} pl-11`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredUsers.length === 0
                    ? <div className="col-span-full"><Empty icon={Users} label="No se encontraron usuarios" /></div>
                    : filteredUsers.map(u => (
                      <div key={u.id} className="glass rounded-[2rem] p-6 border border-white/5 hover:border-white/15 transition-all group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-5">
                            <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-neon-purple" />
                            </div>
                            <button onClick={() => handleDeleteUser(u.id)}
                              className="p-2 text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="font-display text-lg uppercase truncate text-white">{u.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono mb-5 truncate">{u.email}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <span className="text-[9px] text-gray-500 uppercase font-black tracking-widest">
                              {u._count?.branches || 0} sucursal{u._count?.branches !== 1 ? 'es' : ''}
                            </span>
                            <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20' : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'}`}>
                              {u.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </motion.div>
            )}

            {/* ════ SUCURSALES ════ */}
            {activeTab === 'branches_mgmt' && (
              <motion.div key="br" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="mb-4 md:hidden">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input type="text" placeholder="Buscar sucursal..." className={`${inp} pl-11`} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                </div>
                {filteredBranches.length === 0
                  ? <Empty icon={Store} label="No se encontraron sucursales" />
                  : filteredBranches.map(b => (
                    <div key={b.id} className="glass rounded-[2.5rem] p-6 md:p-8 border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex flex-col lg:flex-row gap-6 lg:items-start justify-between">
                        {/* Info */}
                        <div className="flex-grow space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <Dot active={b.subscriptionStatus === 'ACTIVE'} />
                            <h3 className="font-display text-xl uppercase tracking-tight">{b.name}</h3>
                            <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full border ${b.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
                              {b.subscriptionStatus}
                            </span>
                            <span className="text-[8px] font-black uppercase px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400">
                              {b.plan}
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                            Cliente: <span className="text-white">{b.owner?.name}</span>
                            <span className="mx-2 opacity-30">|</span>
                            <span>{b.owner?.email}</span>
                          </p>
                          <div className="bg-black/40 rounded-2xl border border-white/5 px-4 py-3 flex items-center gap-3">
                            <Wifi className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                            <span className="text-[10px] font-mono text-neon-cyan truncate">
                              {b.station?.streamUrl || 'Sin estación asignada'}
                            </span>
                          </div>
                        </div>
                        {/* Controls */}
                        <div className="flex flex-col gap-3 lg:min-w-[220px]">
                          <select
                            className={sel}
                            value={b.stationId || ''}
                            onChange={e => handleAssignStation(b.id, e.target.value)}
                          >
                            <option value="">Asignar estación…</option>
                            {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                          <button
                            onClick={() => window.open(`/player/${b.slug}`, '_blank')}
                            className="w-full py-3 rounded-2xl bg-neon-cyan text-void text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                          >
                            <Headphones size={14} /> Abrir Player
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </motion.div>
            )}

            {/* ════ ACTIVACIÓN MANUAL ════ */}
            {activeTab === 'activation' && (
              <motion.div key="ac" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
                <div className="glass rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-[80px] rounded-full pointer-events-none" />
                  <div className="relative z-10">
                    <SectionHeader icon={Plus} title="Activación Manual de Sucursal" />
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                      Crea y activa una sucursal directamente para un cliente existente. Útil para altas manuales o migraciones.
                    </p>

                    <form onSubmit={handleManualActivation} className="space-y-5">
                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Email del cliente *</label>
                        <input
                          type="email"
                          placeholder="cliente@ejemplo.com"
                          className={inp}
                          required
                          value={manualData.userEmail}
                          onChange={e => setManualData(p => ({ ...p, userEmail: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Nombre de la sucursal *</label>
                        <input
                          type="text"
                          placeholder="Ej: Sucursal Centro CDMX"
                          className={inp}
                          required
                          value={manualData.branchName}
                          onChange={e => setManualData(p => ({ ...p, branchName: e.target.value }))}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Plan</label>
                          <select className={sel} value={manualData.plan} onChange={e => setManualData(p => ({ ...p, plan: e.target.value }))}>
                            <option value="MONTHLY">Mensual</option>
                            <option value="YEARLY">Anual</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Estación Master</label>
                          <select className={sel} value={manualData.stationId} onChange={e => setManualData(p => ({ ...p, stationId: e.target.value }))}>
                            <option value="">Sin asignar</option>
                            {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Duración (opcional)</label>
                          <input
                            type="number"
                            placeholder="Ej: 30"
                            className={inp}
                            value={manualData.customAmount}
                            onChange={e => setManualData(p => ({ ...p, customAmount: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Unidad</label>
                          <select className={sel} value={manualData.customUnit} onChange={e => setManualData(p => ({ ...p, customUnit: e.target.value }))}>
                            <option value="MINUTES">Minutos</option>
                            <option value="HOURS">Horas</option>
                            <option value="DAYS">Días</option>
                          </select>
                        </div>
                      </div>

                      {/* Status message */}
                      {activationMsg && (
                        <div className={`rounded-2xl px-5 py-4 text-sm font-bold flex items-center gap-3 ${activationMsg === 'success' ? 'bg-emerald-400/10 border border-emerald-400/20 text-emerald-400' : 'bg-red-400/10 border border-red-400/20 text-red-400'}`}>
                          {activationMsg === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                          {activationMsg === 'success' ? 'Sucursal activada correctamente' : activationMsg}
                        </div>
                      )}

                      <button type="submit"
                        className="w-full py-4 rounded-2xl bg-neon-cyan text-void font-black uppercase text-sm tracking-widest hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all flex items-center justify-center gap-2">
                        <Send size={16} /> Activar Sucursal
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════ ESTACIONES ════ */}
            {activeTab === 'stations' && (
              <motion.div key="st" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Add form */}
                <div className="glass rounded-[2.5rem] p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-neon-green/5 blur-[80px] rounded-full" />
                  <div className="relative z-10">
                    <SectionHeader icon={Plus} title="Registrar Nuevo Master" color="text-neon-green" />
                    <form className="flex flex-col md:flex-row gap-4" onSubmit={async (e) => {
                      e.preventDefault();
                      const name = e.target.sname.value;
                      const streamUrl = e.target.url.value;
                      const res = await apiFetch('/api/stations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, streamUrl }),
                      });
                      if (res.ok) { loadInitialData(); e.target.reset(); }
                    }}>
                      <input name="sname" placeholder="Nombre descriptivo" className={inp} required />
                      <input name="url" placeholder="URL del stream (Icecast / HLS)" className={inp} required />
                      <button type="submit"
                        className="shrink-0 bg-neon-green text-void px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all">
                        Añadir
                      </button>
                    </form>
                  </div>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stations.length === 0
                    ? <div className="col-span-full"><Empty icon={RadioIcon} label="Sin estaciones registradas" /></div>
                    : stations.map(s => (
                      <div key={s.id} className="glass rounded-[2rem] p-6 border border-white/5 flex items-center justify-between gap-4 group hover:border-neon-green/20 transition-all">
                        <div className="min-w-0 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center shrink-0">
                            <RadioIcon className="w-4 h-4 text-neon-green" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-base uppercase truncate text-white">{s.name}</p>
                            <p className="text-[9px] font-mono text-gray-500 truncate">{s.streamUrl}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteStation(s.id)}
                          className="p-2.5 text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  }
                </div>
              </motion.div>
            )}

            {/* ════ SOPORTE ════ */}
            {activeTab === 'incidents' && (
              <motion.div key="in" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-display text-2xl uppercase">
                    Tickets de <span className="text-amber-400 italic">Soporte</span>
                  </h3>
                  <div className="px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[9px] font-black uppercase tracking-widest">
                    {stats.pendingTix} activos
                  </div>
                </div>

                {incidents.length === 0
                  ? (
                    <div className="glass rounded-[3rem] p-20 text-center opacity-30 flex flex-col items-center gap-4">
                      <CheckCircle2 size={60} />
                      <p className="font-display text-xl uppercase">Todo Resuelto</p>
                    </div>
                  )
                  : incidents.map(inc => (
                    <div key={inc.id} className="glass rounded-[2.5rem] p-6 md:p-8 border border-white/5 hover:border-white/10 transition-all">
                      <div className="flex flex-col lg:flex-row gap-6 justify-between">
                        <div className="flex-grow space-y-4">
                          {/* Title row */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              inc.status === 'PENDING'     ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_#fbbf24]' :
                              inc.status === 'IN_PROGRESS' ? 'bg-blue-400  shadow-[0_0_8px_#60a5fa]' :
                              'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                            }`} />
                            <h4 className="font-display text-xl uppercase">{inc.title}</h4>
                            <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full border ${
                              inc.status === 'PENDING'     ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' :
                              inc.status === 'IN_PROGRESS' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' :
                              'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                            }`}>
                              {inc.status === 'PENDING' ? 'Pendiente' : inc.status === 'IN_PROGRESS' ? 'En proceso' : 'Resuelto'}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-400 font-light italic bg-white/[0.02] border border-white/5 rounded-2xl p-5 leading-relaxed">
                            "{inc.description}"
                          </p>

                          {/* Client info */}
                          <div className="flex gap-6 text-[9px] font-black uppercase text-gray-600 tracking-widest flex-wrap">
                            <span className="flex items-center gap-2"><UserIcon size={11} /> {inc.user?.name}</span>
                            <span className="flex items-center gap-2"><Mail size={11} /> {inc.user?.email}</span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="lg:w-52 flex flex-col gap-3">
                          <select
                            className={sel}
                            value={inc.status}
                            onChange={e => handleUpdateIncident(inc.id, e.target.value)}
                          >
                            <option value="PENDING">Pendiente</option>
                            <option value="IN_PROGRESS">En Proceso</option>
                            <option value="RESOLVED">Resuelto</option>
                          </select>
                          <a
                            href={`https://wa.me/${(inc.user?.phoneNumber || '').replace(/\D/g, '')}`}
                            target="_blank" rel="noreferrer"
                            className="w-full py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
                          >
                            <PhoneCall size={13} /> WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </motion.div>
            )}

            {/* ════ AUDITORÍA ════ */}
            {activeTab === 'audit' && (
              <motion.div key="au" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="glass rounded-[2.5rem] p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-[100px] rounded-full" />
                  <SectionHeader icon={ShieldCheck} title="Bitácora Técnica" />
                  <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-2">
                    {auditLogs.length === 0
                      ? <Empty icon={Terminal} label="Sin registros de actividad" />
                      : auditLogs.map(l => (
                        <div key={l.id} className="flex items-center justify-between gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-black/60 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 flex items-center justify-center shrink-0">
                              <Terminal className="w-3.5 h-3.5 text-neon-cyan" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase text-white tracking-widest">{l.action}</p>
                              <p className="text-[9px] text-gray-500 font-mono">
                                {l.adminName} · {new Date(l.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-[8px] font-mono text-gray-600 bg-white/5 px-3 py-2 rounded-xl max-w-[200px] truncate border border-white/5 shrink-0 hidden md:block">
                            {JSON.stringify(l.details)}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════ SISTEMA ════ */}
            {activeTab === 'settings' && (
              <motion.div key="se" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Health */}
                <div className="glass rounded-[2.5rem] p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-neon-cyan/5 blur-[80px] rounded-full" />
                  <div className="relative z-10">
                    <SectionHeader icon={Cpu} title="Recursos del Servidor" />
                    {systemHealth ? (
                      <div className="space-y-0">
                        {[
                          { label: 'Estado Servidor',  val: systemHealth.status,   ok: true  },
                          { label: 'Base de Datos',    val: systemHealth.database, ok: true  },
                          { label: 'Tiempo Activo',    val: `${Math.floor(systemHealth.uptime / 3600)}h ${Math.floor((systemHealth.uptime % 3600) / 60)}m`, ok: true },
                          { label: 'Memoria Heap',     val: systemHealth.memory?.heapUsed, ok: null },
                        ].map(({ label, val, ok }) => (
                          <div key={label} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">{label}</span>
                            <span className={`text-[10px] font-mono font-bold ${ok === true ? 'text-emerald-400' : ok === false ? 'text-red-400' : 'text-neon-cyan'}`}>
                              {val}
                            </span>
                          </div>
                        ))}
                        <button onClick={fetchHealth}
                          className="w-full mt-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-void transition-all flex items-center justify-center gap-2">
                          <RefreshCw size={13} /> Refrescar Telemetría
                        </button>
                      </div>
                    ) : (
                      <div className="py-10 text-center animate-pulse text-gray-600 text-[10px] tracking-[0.3em] uppercase font-black">
                        Conectando con servidor…
                      </div>
                    )}
                  </div>
                </div>

                {/* Security */}
                <div className="glass rounded-[2.5rem] p-8 bg-gradient-to-br from-neon-cyan/5 to-transparent border-neon-cyan/10 flex flex-col justify-between">
                  <div>
                    <SectionHeader icon={ShieldAlert} title="Seguridad Operativa" />
                    <p className="text-gray-400 text-sm font-light leading-relaxed mb-6">
                      Este nodo de administración está protegido con cookies httpOnly. Cada cambio en la infraestructura de audio queda registrado permanentemente en la bitácora.
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: 'Autenticación', val: 'Cookie httpOnly', ok: true },
                        { label: 'Sesión',        val: 'JWT Seguro',      ok: true },
                        { label: 'Registros',     val: 'Auditoría activa', ok: true },
                      ].map(({ label, val }) => (
                        <div key={label} className="flex justify-between py-3 border-b border-white/5 last:border-0">
                          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">{label}</span>
                          <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 size={11} /> {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => goTab('audit')}
                    className="w-full mt-8 py-4 rounded-full bg-white text-void font-black uppercase text-xs tracking-[0.3em] hover:bg-neon-cyan transition-all shadow-xl">
                    Ver Auditoría Maestra
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Admin;
