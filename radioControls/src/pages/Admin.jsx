import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Activity, Server, Users, Radio, Link2, Settings,
  AlertTriangle, CheckCircle2, Wrench, Plus, Cpu, Network,
  BarChart3, Eye, Globe, LogOut, Mail, Store, Sparkles
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
    plan: 'MONTHLY'
  });
  const [stations, setStations] = useState([]);
  const [isActivating, setIsActivating] = useState(false);
  const [activationStatus, setActivationStatus] = useState(null);

  // Estados para creación de usuarios
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CLIENT'
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userCreateStatus, setUserCreateStatus] = useState(null);

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
    if (activeTab === 'activations') loadStations();
  }, [activeTab, token]);

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
        setManualData({ userEmail: '', branchName: '', stationId: '', plan: 'MONTHLY' });
      } else {
        setActivationStatus({ success: false, message: data?.message || "Error al activar" });
      }
    } catch (err) {
      setActivationStatus({ success: false, message: "Error de conexión" });
    } finally {
      setIsActivating(false);
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
      } else {
        setUserCreateStatus({ success: false, message: data?.message || "Error al crear" });
      }
    } catch (err) {
      setUserCreateStatus({ success: false, message: "Error de conexión" });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const tabs = useMemo(() => ([
    { id: 'overview', label: 'Resumen', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'activations', label: 'Activaciones', icon: <Sparkles className="w-5 h-5 text-neon-cyan" /> },
    { id: 'streams', label: 'Streams', icon: <Radio className="w-5 h-5" /> },
    { id: 'users', label: 'Usuarios', icon: <Users className="w-5 h-5" /> },
    { id: 'incidents', label: 'Incidentes', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'settings', label: 'Sistema', icon: <Settings className="w-5 h-5" /> },
  ]), []);

  const stats = [
    { label: 'Sucursales Activas', value: '214', trend: '+8%', icon: <Radio className="text-neon-cyan" /> },
    { label: 'Streams Saludables', value: '97%', trend: 'Estable', icon: <Activity className="text-neon-green" /> },
    { label: 'Clientes Activos', value: '64', trend: '+4', icon: <Users className="text-neon-purple" /> },
    { label: 'Alertas Criticas', value: '2', trend: '-1', icon: <AlertTriangle className="text-amber-400" /> },
  ];

  const streams = [
    { id: 'STR-204', name: 'Hotel Polanco', station: 'Ambient Luxe', status: 'Ok', latency: '38ms' },
    { id: 'STR-188', name: 'Puma Centro', station: 'Urban Pulse', status: 'Degraded', latency: '210ms' },
    { id: 'STR-102', name: 'Coppel Norte', station: 'Retail Pop', status: 'Ok', latency: '42ms' },
  ];

  const users = [
    { id: 'USR-11', name: 'Grupo Loma', role: 'CLIENT', plan: 'Anual', status: 'Activo' },
    { id: 'USR-04', name: 'Olea Retail', role: 'CLIENT', plan: 'Mensual', status: 'Activo' },
    { id: 'USR-01', name: 'Admin Demo', role: 'ADMIN', plan: '-', status: 'Activo' },
  ];

  const incidents = [
    { id: 'INC-12', title: 'Corte de stream en Zona Norte', level: 'Alta', time: 'Hace 9m' },
    { id: 'INC-09', title: 'Latencia elevada en CDN', level: 'Media', time: 'Hace 45m' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex">
        <aside className="w-72 bg-slate-900/50 border-r border-white/5 p-8 hidden lg:flex flex-col sticky top-0 h-screen">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-neon-cyan rounded-2xl flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(0,243,255,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tighter uppercase leading-none">Admin</span>
              <span className="block text-[10px] font-black text-neon-cyan/60 tracking-[0.3em] uppercase mt-1">Control</span>
            </div>
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

        <main className="flex-grow p-6 lg:p-12">
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
                  <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                      <Network className="w-6 h-6 text-neon-cyan" /> Salud de Red
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-950 border border-white/5 p-5 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CDN</p>
                        <p className="text-2xl font-black text-white">Estable</p>
                        <p className="text-slate-500 text-xs">Perdida 0.2%</p>
                      </div>
                      <div className="bg-slate-950 border border-white/5 p-5 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Latencia</p>
                        <p className="text-2xl font-black text-white">42ms</p>
                        <p className="text-slate-500 text-xs">Promedio global</p>
                      </div>
                      <div className="bg-slate-950 border border-white/5 p-5 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Uptime</p>
                        <p className="text-2xl font-black text-white">99.96%</p>
                        <p className="text-slate-500 text-xs">Ultimos 30 dias</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                      <Server className="w-6 h-6 text-neon-cyan" /> Streams Recientes
                    </h3>
                    <div className="space-y-4">
                      {streams.map((s) => (
                        <div key={s.id} className="flex items-center justify-between p-4 bg-slate-950/60 border border-white/5 rounded-2xl">
                          <div>
                            <p className="font-black uppercase tracking-tighter">{s.name}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">{s.station}</p>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="text-xs text-slate-400">{s.latency}</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${s.status === 'Ok' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                              {s.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                      <Cpu className="w-6 h-6 text-neon-purple" /> Capacidad
                    </h3>
                    <div className="space-y-4">
                      {[['CPU', '62%'], ['RAM', '71%'], ['Storage', '48%']].map((item) => (
                        <div key={item[0]}>
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                            <span>{item[0]}</span>
                            <span className="text-neon-cyan">{item[1]}</span>
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-neon-cyan" style={{ width: item[1] }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-950/20 to-purple-950/20 border border-cyan-900/30 p-8 rounded-[32px]">
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                      <Globe className="w-6 h-6 text-neon-cyan" /> Regiones
                    </h3>
                    <div className="space-y-3 text-sm text-slate-400">
                      <div className="flex justify-between"><span>MX-CDMX</span><span className="text-emerald-300">OK</span></div>
                      <div className="flex justify-between"><span>MX-NL</span><span className="text-emerald-300">OK</span></div>
                      <div className="flex justify-between"><span>US-TX</span><span className="text-amber-300">Degraded</span></div>
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
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Estación de Radio</label>
                        <select 
                          className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none appearance-none"
                          value={manualData.stationId}
                          onChange={(e) => setManualData({...manualData, stationId: e.target.value})}
                          required
                        >
                          <option value="">Seleccionar estación...</option>
                          {stations.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
                        </select>
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
                        </select>
                      </div>
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
                {/* Formulario de Creación */}
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

                {/* Lista de Usuarios */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                    <Users className="w-6 h-6 text-neon-cyan" /> Clientes y Roles
                  </h3>
                  <div className="space-y-4">
                    {users.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-4 bg-slate-950/60 border border-white/5 rounded-2xl">
                        <div>
                          <p className="font-black uppercase tracking-tighter">{u.name}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-widest">{u.role} - {u.plan}</p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300">{u.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'incidents' && (
              <motion.div key="incidents" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <div className="bg-slate-900/40 border border-white/5 rounded-[32px] p-8">
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-400" /> Alertas Activas
                  </h3>
                  <div className="space-y-4">
                    {incidents.map((inc) => (
                      <div key={inc.id} className="flex items-center justify-between p-4 bg-slate-950/60 border border-white/5 rounded-2xl">
                        <div>
                          <p className="font-black uppercase tracking-tighter">{inc.title}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-widest">{inc.time}</p>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${inc.level === 'Alta' ? 'bg-red-500/10 text-red-300' : 'bg-amber-500/10 text-amber-300'}`}>
                          {inc.level}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 text-emerald-300 text-xs font-bold uppercase tracking-widest">
                      <CheckCircle2 className="w-4 h-4" /> Sin alertas adicionales
                    </div>
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
