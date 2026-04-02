import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Activity, Server, Users, Radio, Settings,
  AlertTriangle, CheckCircle2, Plus, Cpu, Network,
  Eye, Globe, LogOut, Mail, Store, LayoutGrid,
  CreditCard, PhoneCall, Search, Trash2, ChevronRight,
  Zap, TrendingUp, Clock, Terminal, ShieldAlert, User as UserIcon
} from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/apiFetch';

/* ─── Pulsating Background Decor ────────────────── */
const Aurora = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="animate-pulse absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[150px] opacity-10"
      style={{ background: 'radial-gradient(circle, #00f3ff 0%, transparent 70%)', animationDuration: '4s' }} />
    <div className="animate-pulse absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-10"
      style={{ background: 'radial-gradient(circle, #bc13fe 0%, transparent 70%)', animationDuration: '6s' }} />
  </div>
);

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data States
  const [allUsers, setAllUsers] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [stations, setStations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [manualData, setManualData] = useState({ userEmail: '', branchName: '', stationId: '', plan: 'MONTHLY', customAmount: '', customUnit: 'MINUTES' });

  // Carga inicial de datos
  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [uRes, bRes, sRes, iRes] = await Promise.all([
        apiFetch('/api/admin/users'),
        apiFetch('/api/admin/branches'),
        apiFetch('/api/stations'),
        apiFetch('/api/incidents')
      ]);

      if (uRes.ok) {
        const data = await uRes.json();
        setAllUsers(Array.isArray(data) ? data : []);
      }
      if (bRes.ok) {
        const data = await bRes.json();
        setAllBranches(Array.isArray(data) ? data : []);
      }
      if (sRes.ok) {
        const data = await sRes.json();
        setStations(Array.isArray(data) ? data : []);
      }
      if (iRes.ok) {
        const data = await iRes.json();
        setIncidents(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    const res = await apiFetch('/api/admin/audit-logs');
    if (res.ok) {
      const data = await res.json();
      setAuditLogs(Array.isArray(data) ? data : []);
    }
  };

  const fetchHealth = async () => {
    const res = await apiFetch('/api/admin/health');
    if (res.ok) setSystemHealth(await res.json());
  };

  useEffect(() => {
    if (activeTab === 'audit') fetchAuditLogs();
    if (activeTab === 'settings') fetchHealth();
  }, [activeTab]);

  // Actions
  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario? Esto borrará sus sucursales.")) return;
    const res = await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) setAllUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleDeleteStation = async (id) => {
    if (!window.confirm("¿Eliminar esta estación master?")) return;
    const res = await apiFetch(`/api/admin/stations/${id}`, { method: 'DELETE' });
    if (res.ok) setStations(prev => prev.filter(s => s.id !== id));
  };

  const handleManualActivation = async (e) => {
    e.preventDefault();
    const res = await apiFetch('/api/branches/admin-create', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(manualData) 
    });
    if (res.ok) {
      alert("Sucursal activada correctamente");
      loadInitialData();
    } else {
      const data = await res.json();
      alert(data.message || "Error al activar");
    }
  };

  const handleAssignStation = async (branchId, stationId) => {
    const res = await apiFetch('/api/admin/assign-station', { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ branchId, stationId }) 
    });
    if (res.ok) loadInitialData();
  };

  const handleUpdateIncident = async (id, status) => {
    const res = await apiFetch(`/api/incidents/${id}/status`, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ status }) 
    });
    if (res.ok) setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  // Stats
  const stats = useMemo(() => {
    const activeClients = allUsers.filter(u => u.role === 'CLIENT').length;
    const activeSubs = allBranches.filter(b => b.subscriptionStatus === 'ACTIVE').length;
    const pendingTickets = incidents.filter(i => i.status !== 'RESOLVED').length;
    return [
      { label: 'Clientes', value: activeClients, icon: <Users size={20} />, color: 'neon-purple' },
      { label: 'Suscripciones', value: activeSubs, icon: <CreditCard size={20} />, color: 'neon-cyan' },
      { label: 'Tickets', value: pendingTickets, icon: <AlertTriangle size={20} />, color: 'amber-400' },
      { label: 'Estaciones', value: stations.length, icon: <Radio size={20} />, color: 'neon-green' }
    ];
  }, [allUsers, allBranches, incidents, stations]);

  const projectedIncome = useMemo(() => {
    return allBranches
      .filter(b => b.subscriptionStatus === 'ACTIVE')
      .reduce((acc, b) => acc + (b.plan === 'YEARLY' ? 5390 : 539), 0);
  }, [allBranches]);

  const filteredUsers = allUsers.filter(u => 
    (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredBranches = allBranches.filter(b => 
    (b.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (b.owner?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'users', label: 'Usuarios', icon: <Users className="w-5 h-5" /> },
    { id: 'branches_mgmt', label: 'Sucursales', icon: <Store className="w-5 h-5" /> },
    { id: 'stations', label: 'Estaciones', icon: <Radio className="w-5 h-5" /> },
    { id: 'incidents', label: 'Soporte', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'audit', label: 'Auditoría', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'settings', label: 'Sistema', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-void text-white selection:bg-neon-cyan/30 flex overflow-hidden relative">
      <Aurora />

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-black/40 border-r border-white/5 backdrop-blur-2xl z-50">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-12">
            <img src="/img%20radio%20olea/logosinfondoradioolea.svg" alt="Admin" className="h-10 w-auto" />
            <span className="font-display text-xl uppercase tracking-tighter">Admin</span>
          </div>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-neon-cyan text-void font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                {tab.icon} <span className="text-xs uppercase tracking-widest">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-gray-500 hover:text-red-400 transition-all uppercase text-[10px] font-black tracking-widest">
            <LogOut size={18} /> Salir
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-grow overflow-y-auto relative h-screen custom-scrollbar">
        <header className="sticky top-0 z-40 bg-void/60 backdrop-blur-md border-b border-white/5 p-6 lg:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="font-display text-3xl uppercase tracking-tighter">Gestión <span className="text-neon-cyan italic">Real</span></h1>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 text-xs outline-none focus:border-neon-cyan transition-all" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto relative z-10">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((st, i) => (
              <div key={i} className="glass rounded-[2rem] p-6 border-white/5 relative overflow-hidden group">
                <div className={`p-3 rounded-xl bg-white/5 w-fit mb-4 text-${st.color}`}>{st.icon}</div>
                <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">{st.label}</p>
                <p className="text-3xl font-display text-white">{st.value}</p>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8 glass rounded-[2.5rem] p-8">
                  <h3 className="font-display text-2xl uppercase mb-8 flex items-center gap-3"><TrendingUp className="text-neon-cyan" /> Finanzas Directas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-400/5 border border-emerald-400/10 p-8 rounded-[2rem]">
                      <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Ingreso Mensual Estimado</p>
                      <p className="text-5xl font-display text-emerald-400">${projectedIncome.toLocaleString()} <span className="text-sm">MXN</span></p>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem]">
                      <p className="text-[10px] font-black uppercase text-gray-500 mb-2">Salud de Cartera</p>
                      <p className="text-5xl font-display text-white">{allBranches.length > 0 ? Math.round((allBranches.filter(b => b.subscriptionStatus === 'ACTIVE').length / allBranches.length) * 100) : 0}%</p>
                    </div>
                  </div>
                </div>
                <div className="xl:col-span-4 glass rounded-[2.5rem] p-8">
                  <h3 className="font-display text-xl uppercase mb-6 flex items-center gap-3"><Zap className="text-amber-400" /> Accesos Rápidos</h3>
                  <div className="space-y-4">
                    <button onClick={() => setActiveTab('incidents')} className="w-full p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-black uppercase tracking-widest hover:bg-amber-400/20 transition-all flex items-center justify-between">
                      Tickets Pendientes <span>{incidents.filter(i => i.status !== 'RESOLVED').length}</span>
                    </button>
                    <button onClick={() => setActiveTab('audit')} className="w-full p-4 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] font-black uppercase tracking-widest hover:bg-neon-cyan/20 transition-all flex items-center justify-between">
                      Auditoría de Red <span>Logs</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="us" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.length === 0 ? (
                  <p className="col-span-full text-center py-20 text-gray-500 uppercase font-black text-xs tracking-widest">No se encontraron usuarios</p>
                ) : filteredUsers.map(u => (
                  <div key={u.id} className="glass rounded-[2rem] p-8 border-white/5 relative group hover:border-white/20 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-neon-purple"><Users size={24} /></div>
                      <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </div>
                    <h4 className="font-display text-lg uppercase truncate text-white">{u.name}</h4>
                    <p className="text-[10px] text-gray-500 font-mono mb-6 truncate">{u.email}</p>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase">
                      <span>Sucursales: {u._count?.branches || 0}</span>
                      <span className={`px-2 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-neon-purple/10 text-neon-purple' : 'bg-neon-cyan/10 text-neon-cyan'}`}>{u.role}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'branches_mgmt' && (
              <motion.div key="br" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {filteredBranches.length === 0 ? (
                  <p className="text-center py-20 text-gray-500 uppercase font-black text-xs tracking-widest">No se encontraron sucursales</p>
                ) : filteredBranches.map(b => (
                  <div key={b.id} className="glass rounded-[2.5rem] p-8 border-white/5 flex flex-col lg:flex-row justify-between gap-8 hover:border-white/10 transition-all">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="font-display text-2xl uppercase tracking-tight text-white">{b.name}</h3>
                        <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full ${b.subscriptionStatus === 'ACTIVE' ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-red-400/10 text-red-400 border border-red-400/20'}`}>{b.subscriptionStatus}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-6">Dueño: {b.owner?.name}</p>
                      <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-[10px]">
                        <p className="text-gray-600 mb-1 uppercase font-black tracking-widest">Master Stream URL:</p>
                        <p className="text-neon-cyan font-mono truncate">{b.station?.streamUrl || 'Link no asignado'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 min-w-[240px]">
                      <select className="bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] font-black text-white outline-none focus:border-neon-cyan appearance-none cursor-pointer" value={b.stationId || ''} onChange={(e) => handleAssignStation(b.id, e.target.value)}>
                        <option value="">Cambiar Audio Master...</option>
                        {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <button onClick={() => window.open(`/player/${b.slug}`, '_blank')} className="w-full py-4 rounded-xl bg-neon-cyan text-void text-[10px] font-black uppercase tracking-widest shadow-lg shadow-neon-cyan/10 hover:scale-105 transition-all">Abrir Terminal Player</button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'stations' && (
              <motion.div key="st" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass rounded-[2rem] p-8 mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 blur-3xl rounded-full" />
                  <h3 className="font-display text-xl uppercase mb-6 flex items-center gap-3 relative z-10"><Plus className="text-neon-green" /> Registrar Nuevo Master</h3>
                  <form className="flex flex-col md:flex-row gap-4 relative z-10" onSubmit={async (e) => {
                    e.preventDefault();
                    const name = e.target.name.value;
                    const streamUrl = e.target.url.value;
                    const res = await apiFetch('/api/stations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, streamUrl }) });
                    if (res.ok) { alert("Estación creada"); loadInitialData(); e.target.reset(); }
                  }}>
                    <input name="name" placeholder="Nombre descriptivo" className="flex-grow bg-white/5 border border-white/10 rounded-xl p-4 text-xs outline-none focus:border-neon-green transition-all" required />
                    <input name="url" placeholder="URL del stream (Icecast/HLS/etc)" className="flex-grow bg-white/5 border border-white/10 rounded-xl p-4 text-xs outline-none focus:border-neon-green transition-all" required />
                    <button type="submit" className="bg-neon-green text-void px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">Añadir Audio</button>
                  </form>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stations.map(s => (
                    <div key={s.id} className="glass rounded-[2rem] p-6 border-white/5 flex justify-between items-center group hover:border-white/20 transition-all">
                      <div className="truncate pr-4">
                        <p className="font-display text-lg uppercase text-white truncate">{s.name}</p>
                        <p className="text-[9px] font-mono text-gray-500 truncate">{s.streamUrl}</p>
                      </div>
                      <button onClick={() => handleDeleteStation(s.id)} className="p-3 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"><Trash2 size={18} /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'audit' && (
              <motion.div key="au" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-[100px] rounded-full" />
                <h3 className="font-display text-2xl uppercase mb-8 flex items-center gap-3 relative z-10"><ShieldCheck className="text-neon-cyan" /> Bitácora Técnica de Red</h3>
                <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-4 relative z-10 custom-scrollbar">
                  {auditLogs.length === 0 ? (
                    <div className="py-20 text-center text-gray-600 flex flex-col items-center gap-4">
                      <Terminal size={40} className="opacity-20" />
                      <p className="font-black uppercase text-[10px] tracking-[0.3em]">Sin registros de actividad</p>
                    </div>
                  ) : auditLogs.map(l => (
                    <div key={l.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex justify-between items-center hover:bg-black/60 transition-colors">
                      <div className="flex gap-4 items-center">
                        <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center text-neon-cyan"><Terminal size={14} /></div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-white tracking-widest">{l.action}</p>
                          <p className="text-[9px] text-gray-500 font-mono">Por: {l.adminName} <span className="mx-2">|</span> {new Date(l.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-[8px] font-mono text-gray-600 bg-white/5 p-3 rounded-xl max-w-[250px] truncate border border-white/5">{JSON.stringify(l.details)}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'incidents' && (
              <motion.div key="in" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center mb-4 px-4">
                  <h3 className="font-display text-2xl uppercase tracking-tighter">Tickets de <span className="text-amber-400 italic">Soporte</span></h3>
                  <div className="px-4 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[9px] font-black uppercase tracking-widest">{incidents.filter(i => i.status !== 'RESOLVED').length} Activos</div>
                </div>
                {incidents.length === 0 ? <div className="glass rounded-[3rem] p-20 text-center opacity-30 flex flex-col items-center"><CheckCircle2 size={60} className="mb-4"/><p className="font-display text-xl uppercase">Red Saludable</p></div> : incidents.map(inc => (
                  <div key={inc.id} className="glass rounded-[2.5rem] p-8 border-white/5 flex flex-col lg:flex-row justify-between gap-10 hover:border-white/10 transition-all">
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <span className={`w-3 h-3 rounded-full ${inc.status === 'PENDING' ? 'bg-amber-400 animate-pulse shadow-[0_0_10px_#fbbf24]' : 'bg-blue-400 shadow-[0_0_10px_#60a5fa]'}`} />
                        <h4 className="font-display text-xl uppercase text-white">{inc.title}</h4>
                      </div>
                      <p className="text-sm text-gray-400 font-light italic mb-6 bg-white/[0.02] p-6 rounded-2xl leading-relaxed border border-white/5">"{inc.description}"</p>
                      <div className="flex gap-6 text-[9px] font-black uppercase text-gray-600 tracking-[0.2em]">
                        <span className="flex items-center gap-2"><UserIcon size={12} /> {inc.user?.name}</span>
                        <span className="flex items-center gap-2"><Mail size={12} /> {inc.user?.email}</span>
                      </div>
                    </div>
                    <div className="w-full lg:w-64 space-y-3">
                      <select className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] font-black text-white outline-none focus:border-neon-cyan cursor-pointer" value={inc.status} onChange={(e) => handleUpdateIncident(inc.id, e.target.value)}>
                        <option value="PENDING">Pendiente</option>
                        <option value="IN_PROGRESS">En Proceso</option>
                        <option value="RESOLVED">Resuelto</option>
                      </select>
                      <a href={`https://wa.me/${inc.user?.phoneNumber?.replace(/\D/g, '') || ''}`} target="_blank" rel="noreferrer" className="w-full py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-emerald-500/20"><PhoneCall size={14}/> Contactar</a>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="se" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass rounded-[3.5rem] p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 blur-3xl rounded-full" />
                  <h3 className="font-display text-2xl uppercase mb-8 flex items-center gap-3 relative z-10"><Cpu className="text-neon-cyan" /> Recursos de Red</h3>
                  <div className="space-y-6 relative z-10">
                    {systemHealth ? (
                      <>
                        <div className="flex justify-between py-4 border-b border-white/5"><span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Estado Servidor</span><span className="text-emerald-400 font-black uppercase text-[10px]">{systemHealth.status}</span></div>
                        <div className="flex justify-between py-4 border-b border-white/5"><span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Base de Datos</span><span className="text-emerald-400 font-black uppercase text-[10px]">{systemHealth.database}</span></div>
                        <div className="flex justify-between py-4 border-b border-white/5"><span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Tiempo Activo</span><span className="text-neon-cyan font-mono text-[10px]">{Math.floor(systemHealth.uptime / 3600)}h {Math.floor((systemHealth.uptime % 3600) / 60)}m</span></div>
                        <div className="flex justify-between py-4 border-b border-white/5"><span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Memoria Heap</span><span className="text-white font-mono text-[10px]">{systemHealth.memory.heapUsed}</span></div>
                        <button onClick={fetchHealth} className="w-full mt-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-void transition-all">Refrescar Telemetría</button>
                      </>
                    ) : <div className="py-10 text-center animate-pulse text-gray-600 text-[10px] tracking-[0.3em] uppercase font-black">Conectando con Nodo...</div>}
                  </div>
                </div>
                <div className="glass rounded-[3.5rem] p-10 bg-gradient-to-br from-neon-cyan/5 to-transparent border-neon-cyan/10 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl uppercase mb-6 flex items-center gap-3"><ShieldAlert className="text-neon-cyan" /> Seguridad Operativa</h3>
                    <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">Este nodo de administración está protegido. Cada cambio en la infraestructura de audio es registrado permanentemente.</p>
                  </div>
                  <button onClick={() => setActiveTab('audit')} className="w-full py-5 rounded-full bg-white text-void font-black uppercase text-xs tracking-[0.3em] hover:bg-neon-cyan transition-all shadow-xl">Ver Auditoría Maestra</button>
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
