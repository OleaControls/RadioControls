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
  const [newBranchModal, setNewBranchModal] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Estados para Perfil
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    companyName: user?.companyName || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState(null);

  // Estados para Perfil Sonoro (Contenido)
  const [contentForm, setContentForm] = useState({
    branchId: '',
    targetAudience: '',
    brandAtmosphere: '',
    adRequirements: ''
  });
  const [isUpdatingContent, setIsUpdatingProfileContent] = useState(false);
  const [contentStatus, setContentStatus] = useState(null);

  // Estados para Incidentes
  const [incidents, setIncidents] = useState([]);
  const [incidentForm, setIncidentForm] = useState({ title: '', description: '', branchId: '' });
  const [isReporting, setIsReporting] = useState(false);
  const [reportStatus, setReportStatus] = useState(null);

  // Sincronizar formulario cuando el usuario carga
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        companyName: user.companyName || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Cliente';
  const userRole = user?.role || 'CLIENT';
  const isVerified = user?.isVerified ?? false; // Cambiado a false por defecto para forzar verificacion

  const availableTabs = [
    { id: 'branches', label: 'Sucursales', icon: <LayoutGrid className="w-5 h-5" />, roles: ['ADMIN', 'CLIENT', 'STAFF'] },
    { id: 'content', label: 'Perfil Sonoro', icon: <Sparkles className="w-5 h-5" />, roles: ['ADMIN', 'CLIENT'] },
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

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileStatus(null);

    try {
      const response = await apiFetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      }, token);

      const data = await response.json().catch(() => null);

      if (response.ok) {
        updateUser(data.user); // Actualizar contexto global
        setProfileStatus({ success: true, message: 'Perfil actualizado' });
      } else {
        setProfileStatus({ success: false, message: data?.message || 'Error al actualizar' });
      }
    } catch (err) {
      setProfileStatus({ success: false, message: 'Error de conexión' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleContentUpdate = async (e) => {
    e.preventDefault();
    if (!contentForm.branchId) {
      alert("Selecciona una sucursal primero");
      return;
    }
    setIsUpdatingProfileContent(true);
    setContentStatus(null);

    try {
      const response = await apiFetch(`/api/branches/${contentForm.branchId}/content-profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentForm),
      }, token);

      if (response.ok) {
        setContentStatus({ success: true, message: 'Información enviada a Ingeniería' });
        loadBranches(); // Recargar para ver los cambios
      } else {
        setContentStatus({ success: false, message: 'Error al enviar datos' });
      }
    } catch (err) {
      setContentStatus({ success: false, message: 'Error de conexión' });
    } finally {
      setIsUpdatingProfileContent(false);
    }
  };

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendCode = async () => {
    if (resendTimer > 0 || !user?.email || isResending) {
      return;
    }
    
    setIsResending(true);
    setVerifyStatus(null); 

    try {
      const response = await apiFetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      }, token);
      
      if (response.ok) {
        setResendTimer(60);
      } else {
        setVerifyStatus('error');
      }
    } catch (err) {
      console.error("Error reenviando código:", err);
      setVerifyStatus('error');
    } finally {
      setIsResending(false);
    }
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

    const [stats, setStats] = useState({ listeners: 0, online: '0/0', upcomingInvoices: [] });
  
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
  
          let totalListeners = 0;
          let onlineCount = 0;
                  const upcomingInvoices = [];
          
                  const mapped = data.map((branch) => {
                    // Generar un número de oyentes estable basado en el ID para el demo
                    const mockListeners = Math.floor((parseInt(branch.id.slice(-4), 36) % 200) + 20);
                    totalListeners += mockListeners;
                    if (branch.status === 'Online') onlineCount++;
          
                    const renewalDate = branch.currentPeriodEnd ? new Date(branch.currentPeriodEnd) : null;
                    const isExpired = renewalDate && renewalDate < new Date();
                    
                    // Si está expirado, forzamos estado CANCELED para mostrar botón de pago
                    const effectiveStatus = isExpired ? 'CANCELED' : (branch.subscriptionStatus || 'INCOMPLETE');
          
                    // Incluir en facturas próximas si está activo O si ya venció (para que aparezca en el resumen de pagos)
                    if (renewalDate) {
                      upcomingInvoices.push({
                        branchName: branch.name,
                        date: renewalDate,
                        amount: branch.plan === 'YEARLY' ? 5390 : 539,
                        status: effectiveStatus
                      });
                    }
          
                    return {
                      id: branch.id,
                      name: branch.name,
                      station: branch.station?.name || 'Sin estacion',
                      slug: branch.slug,
                      status: branch.status || 'Offline',
                      listeners: mockListeners,
                      plan: branch.plan || null,
                      subscriptionStatus: effectiveStatus,
                      stripeSubscriptionId: branch.stripeSubscriptionId || null,
                      currentPeriodEnd: branch.currentPeriodEnd, // Pasamos el valor tal cual
                    };
                  });
  
          // Ordenar facturas por fecha más cercana
          upcomingInvoices.sort((a, b) => a.date - b.date);
  
          setBranches(mapped);
          setStats({
            listeners: totalListeners,
            online: `${onlineCount}/${mapped.length}`,
            upcomingInvoices: upcomingInvoices.map(inv => ({
              ...inv,
              formattedDate: inv.date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
              formattedAmount: `$${inv.amount.toLocaleString('es-MX')}`
            }))
          });
        } catch (err) {
          setBranchesError('No se pudieron cargar sucursales');
          setBranches(demoBranches);
        }
      };
  
      loadBranches();
      loadIncidents();
    }, [user?.id]);      
        const loadIncidents = async () => {
          if (!token) return;
          try {
            const response = await apiFetch('/api/incidents', {}, token);
            if (response.ok) {
              const data = await response.json();
              setIncidents(data);
            }
          } catch (err) {
            console.error("Error cargando incidentes:", err);
          }
        };
      
        const handleReportIncident = async (e) => {
          e.preventDefault();
          setIsReporting(true);
          setReportStatus(null);
      
          try {
            const response = await apiFetch('/api/incidents', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(incidentForm),
            }, token);
      
            if (response.ok) {
              setReportStatus({ success: true, message: 'Reporte enviado con éxito' });
              setIncidentForm({ title: '', description: '', branchId: '' });
              loadIncidents();
            } else {
              const data = await response.json();
              setReportStatus({ success: false, message: data.message || 'Error al enviar' });
            }
          } catch (err) {
            setReportStatus({ success: false, message: 'Error de conexión' });
          } finally {
            setIsReporting(false);
          }
        };
      
        const handleOpenPlayer = (slug) => {    if (!slug) return;
    window.open(`/player/${slug}`, '_blank');
  };

  const handleCopyLink = (slug) => {
    if (!slug) return;
    const url = `${window.location.origin}/player/${slug}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('¡Enlace copiado al portapapeles!');
    }).catch(err => {
      console.error('Error al copiar el enlace:', err);
    });
  };

  const planLabel = useMemo(() => ({
    MONTHLY: 'Basico Mensual',
    YEARLY: 'Profesional Anual',
  }), []);

  const statusLabel = useMemo(() => ({
    ACTIVE: 'Activo',
    CANCELED: 'No renovable',
    PAST_DUE: 'Pago pendiente',
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
      
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] bg-slate-900/80 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="RadiOlea Controls" className="h-8 w-auto object-contain" />
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-white bg-white/5 rounded-xl border border-white/10"
        >
          {isMobileMenuOpen ? <Plus className="w-6 h-6 rotate-45" /> : <LayoutGrid className="w-6 h-6" />}
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
                <img src="/logo.png" alt="RadiOlea Controls" className="h-10 w-auto object-contain" />
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-xl"><Plus className="w-6 h-6 rotate-45" /></button>
            </div>

            <nav className="flex-grow space-y-4">
              {visibleTabs.map((tab) => (
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

      {/* Sidebar - Desktop */}
      <aside className="w-72 bg-slate-900/50 border-r border-white/5 p-8 hidden lg:flex flex-col backdrop-blur-3xl sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 group cursor-pointer">
          <img src="/logo.png" alt="RadiOlea Controls" className="h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-500" />
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
      <main className="flex-grow p-6 lg:p-12 pt-24 lg:pt-12 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(0,243,255,0.03),transparent_40%)]">
        
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
              <form onSubmit={handleVerify} className="flex flex-col gap-2 w-full md:w-auto">
                <div className="flex gap-2">
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
                </div>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0 || isResending}
                  className="text-[10px] font-black uppercase tracking-widest text-amber-400 hover:text-amber-200 transition-colors disabled:opacity-50 text-center mt-2"
                >
                  {resendTimer > 0 ? `Reenviar en ${resendTimer}s` : (isResending ? 'Enviando...' : 'SOLICITAR NUEVO CÓDIGO')}
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
              onClick={() => setNewBranchModal(true)}
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
                  { label: "Oyentes Totales", val: stats.listeners, icon: <Activity className="text-neon-cyan" />, trend: "+12%" },
                  { label: "Sucursales Online", val: stats.online, icon: <Store className="text-neon-green" />, trend: "Estable" },
                  { 
                    label: "Próximas Facturas", 
                    val: stats.upcomingInvoices.length > 0 ? (stats.upcomingInvoices.length === 1 ? stats.upcomingInvoices[0].formattedDate : `${stats.upcomingInvoices.length} Pendientes`) : 'N/A', 
                    icon: <Calendar className="text-neon-purple" />, 
                    trend: stats.upcomingInvoices.length > 0 ? (stats.upcomingInvoices.length === 1 ? stats.upcomingInvoices[0].formattedAmount : `$${stats.upcomingInvoices.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString('es-MX')}`) : '$0',
                    subItems: stats.upcomingInvoices.length > 1 ? stats.upcomingInvoices : []
                  },
                ].map((st, i) => (
                  <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-[32px] backdrop-blur-xl flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-slate-950 rounded-xl border border-white/5">{st.icon}</div>
                        <span className="text-[10px] font-black text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded-lg uppercase tracking-widest">{st.trend}</span>
                      </div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{st.label}</p>
                      <p className="text-3xl font-black text-white">{st.val}</p>
                    </div>
                    {st.subItems && st.subItems.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                        {st.subItems.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                            <span className="truncate max-w-[100px]">{item.branchName}</span>
                            <span className="text-white">{item.formattedDate}</span>
                          </div>
                        ))}
                        {st.subItems.length > 3 && (
                          <p className="text-[8px] text-neon-cyan font-black uppercase tracking-widest text-center pt-1">
                            + {st.subItems.length - 3} más en Facturación
                          </p>
                        )}
                      </div>
                    )}
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
                      <button 
                        onClick={() => handleCopyLink(branch.slug)}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all group/link"
                      >
                        <Link2 className="w-4 h-4 text-slate-500 group-hover/link:text-neon-cyan" /> Copiar Link Receptor
                      </button>
                      <button 
                        onClick={() => handleOpenPlayer(branch.slug)}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-neon-cyan text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all"
                      >
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

          {activeTab === 'content' && (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8 max-w-4xl"
            >
              <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-8">
                  <Sparkles className="w-10 h-10 text-neon-cyan" />
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Perfil <span className="text-neon-cyan italic">Sonoro Pro</span></h3>
                </div>
                <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                  Completa esta información para que nuestro equipo de ingeniería y contenido genere la atmósfera perfecta y los anuncios ideales para tu marca.
                </p>

                <form onSubmit={handleContentUpdate} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Seleccionar Sucursal para configurar</label>
                    <select 
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none appearance-none"
                      value={contentForm.branchId}
                      onChange={(e) => {
                        const branch = branches.find(b => b.id === e.target.value);
                        setContentForm({
                          branchId: e.target.value,
                          targetAudience: branch?.targetAudience || '',
                          brandAtmosphere: branch?.brandAtmosphere || '',
                          adRequirements: branch?.adRequirements || ''
                        });
                      }}
                      required
                    >
                      <option value="">¿A qué sucursal aplicamos estos cambios?</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Psicodemografía (Audiencia)</label>
                      <textarea 
                        rows="4"
                        placeholder="Ej: Mujeres 25-45 años, nivel socioeconómico medio-alto, interesadas en moda y bienestar."
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none resize-none"
                        value={contentForm.targetAudience}
                        onChange={(e) => setContentForm({...contentForm, targetAudience: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Atmósfera de Marca</label>
                      <textarea 
                        rows="4"
                        placeholder="Ej: Elegante pero accesible, moderna, con mucha energía por las mañanas y chill por las tardes."
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none resize-none"
                        value={contentForm.brandAtmosphere}
                        onChange={(e) => setContentForm({...contentForm, brandAtmosphere: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Guiones o Requerimientos de Anuncios</label>
                    <textarea 
                      rows="4"
                      placeholder="Ej: Queremos un anuncio de '2x1 en cafés' cada 20 minutos. Otro de 'Bienvenida al cliente' cada hora."
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none resize-none"
                      value={contentForm.adRequirements}
                      onChange={(e) => setContentForm({...contentForm, adRequirements: e.target.value})}
                    />
                  </div>

                  <div className="pt-4">
                    {contentStatus && (
                      <p className={`text-center text-[10px] font-black uppercase tracking-widest mb-4 ${contentStatus.success ? 'text-emerald-400' : 'text-red-400'}`}>
                        {contentStatus.message}
                      </p>
                    )}
                    <button 
                      type="submit"
                      disabled={isUpdatingContent || !contentForm.branchId}
                      className="w-full py-5 bg-neon-cyan text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-neon-cyan/20 transition-all disabled:opacity-50"
                    >
                      {isUpdatingContent ? 'Enviando...' : 'Actualizar Perfil de Contenido'}
                    </button>
                  </div>
                </form>
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
              {branches.length === 0 ? (
                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl text-center">
                  <p className="text-slate-400 font-medium">No tienes sucursales con planes activos actualmente.</p>
                </div>
              ) : (
                branches.map((branch) => (
                  <div key={branch.id} className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 backdrop-blur-xl relative overflow-hidden group hover:border-neon-cyan/30 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/5 blur-[80px] rounded-full -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                      <div className="space-y-4 flex-grow">
                        <div className="flex items-center gap-3">
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${branch.subscriptionStatus === 'ACTIVE' ? 'bg-neon-cyan text-slate-950' : 'bg-red-500/20 text-red-400'}`}>
                            {statusLabel[branch.subscriptionStatus] || 'Sin Plan'}
                          </div>
                          <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{branch.name}</h3>
                        </div>
                        <p className="text-4xl font-black text-white uppercase leading-none">
                          {branch.plan ? planLabel[branch.plan] : 'Sin Suscripción'}
                        </p>
                        <div className="flex flex-wrap gap-8 pt-4">
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Próxima Renovación</p>
                            <p className={`text-xl font-black uppercase ${new Date(branch.currentPeriodEnd) < new Date() ? 'text-red-500' : 'text-white'}`}>
                              {new Date(branch.currentPeriodEnd) < new Date() ? 'Vencido: ' : ''}
                              {formatDate(branch.currentPeriodEnd) || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Costo Estimado</p>
                            <p className="text-xl font-black text-white uppercase">
                              {branch.plan === 'YEARLY' ? '$5,390.00 MXN' : (branch.plan === 'MONTHLY' ? '$539.00 MXN' : 'N/A')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 w-full md:w-auto flex flex-col gap-3">
                        <button 
                          onClick={() => setActiveTab('branches')}
                          className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white"
                        >
                          Gestionar Sucursal
                        </button>
                        {branch.subscriptionStatus !== 'ACTIVE' && (
                          <button 
                            onClick={() => navigate(`/checkout/${branch.plan === 'YEARLY' ? 'profesional' : 'basico'}?branchId=${branch.id}`)}
                            className="w-full md:w-auto px-8 py-4 bg-neon-cyan text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all"
                          >
                            Pagar otro mes
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Historial de Facturas (Simulado por sucursal) */}
              <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-8 backdrop-blur-xl">
                <h4 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                  <Clock className="text-neon-cyan w-6 h-6" /> Historial de Facturación Consolidado
                </h4>
                <div className="space-y-4">
                  {branches.filter(b => b.stripeSubscriptionId).map((branch, i) => (
                    <div key={i} className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-slate-950 border border-white/5 rounded-3xl hover:border-white/20 transition-all group">
                      <div className="flex items-center gap-6 mb-4 md:mb-0">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-neon-cyan transition-colors">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-white uppercase tracking-tighter">{branch.name}</p>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Periodo actual hasta: {formatDate(branch.currentPeriodEnd)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 w-full md:w-auto justify-between">
                        <span className="text-xl font-black text-white">{branch.plan === 'YEARLY' ? '$5,390.00' : '$539.00'}</span>
                        <span className="px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                          Pagado
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
              className="space-y-12"
            >
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Métodos de Contacto Directo */}
                <div className="space-y-8">
                  <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
                    <MessageSquare className="w-12 h-12 text-neon-cyan mb-8" />
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Soporte <span className="text-neon-cyan italic">Técnico</span></h3>
                    <p className="text-slate-500 font-medium mb-8">¿Tienes problemas con el streaming o tus sucursales? Nuestro equipo técnico está listo para ayudarte.</p>
                    <div className="space-y-4">
                      <a href="https://wa.me/525579192845" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group">
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

                {/* Formulario de Reporte de Incidentes */}
                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
                  <AlertTriangle className="w-12 h-12 text-amber-400 mb-8" />
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">Reportar <span className="text-amber-400 italic">Incidente</span></h3>
                  <p className="text-slate-500 font-medium mb-8">Describe el problema y lo revisaremos de inmediato.</p>
                  
                  <form onSubmit={handleReportIncident} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">¿Qué sucursal tiene el problema?</label>
                      <select 
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:border-neon-cyan/50 focus:outline-none appearance-none"
                        value={incidentForm.branchId}
                        onChange={(e) => setIncidentForm({...incidentForm, branchId: e.target.value})}
                        required
                      >
                        <option value="">Seleccionar sucursal...</option>
                        {branches.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Asunto Breve</label>
                      <input 
                        type="text"
                        placeholder="Ej: El stream no carga"
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:border-neon-cyan/50 focus:outline-none"
                        value={incidentForm.title}
                        onChange={(e) => setIncidentForm({...incidentForm, title: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Descripción del problema</label>
                      <textarea 
                        rows="4"
                        placeholder="Danos más detalles para ayudarte mejor..."
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white font-bold focus:border-neon-cyan/50 focus:outline-none resize-none"
                        value={incidentForm.description}
                        onChange={(e) => setIncidentForm({...incidentForm, description: e.target.value})}
                        required
                      />
                    </div>

                    {reportStatus && (
                      <p className={`text-[10px] font-black uppercase tracking-widest text-center ${reportStatus.success ? 'text-emerald-400' : 'text-red-400'}`}>
                        {reportStatus.message}
                      </p>
                    )}

                    <button 
                      type="submit"
                      disabled={isReporting}
                      className="w-full py-5 bg-amber-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50"
                    >
                      {isReporting ? 'Enviando...' : 'Enviar Reporte a Ingeniería'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Lista de Incidentes Recientes del Cliente */}
              {incidents.length > 0 && (
                <div className="bg-slate-900/40 border border-white/5 rounded-[40px] p-10 backdrop-blur-xl">
                  <h4 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                    <Activity className="text-neon-cyan w-6 h-6" /> Tus Reportes Recientes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {incidents.map((inc) => (
                      <div key={inc.id} className="p-6 bg-slate-950 border border-white/5 rounded-3xl hover:border-white/10 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-black text-white uppercase tracking-tighter">{inc.title}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sucursal: {inc.branch?.name || 'General'}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            inc.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' : 
                            inc.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400' : 
                            'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {inc.status === 'PENDING' ? 'Pendiente' : inc.status === 'IN_PROGRESS' ? 'En revisión' : 'Resuelto'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{inc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                 <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                   <div className="w-24 h-24 bg-gradient-to-br from-neon-cyan to-blue-600 rounded-[32px] flex items-center justify-center text-slate-950 text-4xl font-black shadow-2xl">
                     {firstName[0]}
                   </div>
                   <div className="text-center md:text-left">
                     <h3 className="text-3xl font-black uppercase tracking-tighter mb-1">{user?.name || 'Usuario'}</h3>
                     <p className="text-neon-cyan font-bold text-sm tracking-widest uppercase mb-3">{user?.role || 'CLIENTE ELITE'}</p>
                     <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ID Cliente:</span>
                        <span className="text-xs font-black text-white">{user?.customerCustomId || 'GENERANDO...'}</span>
                     </div>
                   </div>
                 </div>

                 <form onSubmit={handleProfileUpdate} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Empresa</p>
                       <input 
                        type="text"
                        placeholder="Nombre de la empresa"
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none transition-all"
                        value={profileForm.companyName}
                        onChange={(e) => setProfileForm({...profileForm, companyName: e.target.value})}
                       />
                     </div>
                     <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Teléfono</p>
                       <input 
                        type="text"
                        placeholder="+52 ..."
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none transition-all"
                        value={profileForm.phoneNumber}
                        onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Nombre Completo</label>
                       <input 
                        type="text" 
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none transition-all"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        required
                       />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Principal</label>
                       <input 
                        type="email" 
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-5 px-8 text-white font-bold focus:border-neon-cyan/50 focus:outline-none transition-all"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        required
                       />
                     </div>
                   </div>

                   <div className="pt-4">
                     {profileStatus && (
                       <p className={`text-center text-[10px] font-black uppercase tracking-widest mb-4 ${profileStatus.success ? 'text-emerald-400' : 'text-red-400'}`}>
                         {profileStatus.message}
                       </p>
                     )}
                     <button 
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="w-full py-5 bg-neon-cyan text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-neon-cyan/20 disabled:opacity-50"
                     >
                       {isUpdatingProfile ? 'Guardando...' : 'Guardar Cambios'}
                     </button>
                   </div>
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

      <AnimatePresence>
        {newBranchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center px-6 py-10 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setNewBranchModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              className="relative z-10 w-full max-w-4xl rounded-[40px] border border-white/10 bg-slate-900/50 backdrop-blur-3xl p-8 md:p-12 shadow-[0_0_80px_-20px_rgba(0,243,255,0.3)] my-auto"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-neon-cyan mb-3">Nueva Expansion</div>
                  <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">Elige un plan para tu <span className="text-neon-cyan italic text-4xl">Sucursal</span></h3>
                </div>
                <button 
                  onClick={() => setNewBranchModal(false)}
                  className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'basico', name: 'Basico', price: '$539', desc: 'Ideal para sucursales individuales.', icon: <Store className="w-6 h-6" />, color: 'bg-white/5' },
                  { id: 'profesional', name: 'Profesional', price: '$5,390', desc: 'Maximiza tus ventas con audio elite.', icon: <Sparkles className="w-6 h-6 text-neon-cyan" />, color: 'bg-neon-cyan/10 border-neon-cyan/20', highlight: true },
                  { id: 'corporativo', name: 'Corporativo', price: 'Custom', desc: 'Para mas de 10 sucursales.', icon: <LayoutGrid className="w-6 h-6 text-neon-purple" />, color: 'bg-white/5', isContact: true }
                ].map((plan) => (
                  <div 
                    key={plan.id}
                    className={`p-8 rounded-[32px] border transition-all group ${plan.highlight ? 'border-neon-cyan/30 bg-neon-cyan/5 shadow-2xl' : 'border-white/5 bg-slate-950/50 hover:border-white/20'}`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${plan.highlight ? 'bg-neon-cyan text-slate-950' : 'bg-white/5 text-slate-400'}`}>
                      {plan.icon}
                    </div>
                    <h4 className="text-xl font-black uppercase tracking-tighter text-white mb-1">{plan.name}</h4>
                    <div className="text-2xl font-black text-white mb-4">{plan.price} <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{plan.id === 'profesional' ? '/ ANUAL' : (plan.id === 'basico' ? '/ MES' : '')}</span></div>
                    <p className="text-xs text-slate-400 font-medium mb-8 leading-relaxed">{plan.desc}</p>
                    <button
                      onClick={() => {
                        if (plan.isContact) navigate('/contacto');
                        else navigate(`/checkout/${plan.id}`);
                      }}
                      className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${plan.highlight ? 'bg-neon-cyan text-slate-950 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]' : 'bg-white/5 border border-white/10 text-white hover:bg-white hover:text-slate-950'}`}
                    >
                      {plan.isContact ? 'Contactar' : 'Contratar'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-slate-500">
                  <Shield className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Pago 100% Seguro via Stripe</span>
                </div>
                <div className="flex items-center gap-6">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aceptamos:</p>
                   <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                      <CreditCard className="w-6 h-6" />
                      <BarChart3 className="w-6 h-6" />
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientPortal;
