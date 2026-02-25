import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Gallery from './pages/Gallery';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import ClientPortal from './pages/ClientPortal';
import Admin from './pages/Admin';
import AudioInstallation from './pages/AudioInstallation';
import BranchPlayer from './pages/BranchPlayer';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyAccount from './pages/VerifyAccount';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AccessDenied from './pages/AccessDenied';
import CheckoutSuccess from './pages/CheckoutSuccess';
import { AppProviders } from './components/AppProviders';
import Footer from './components/Footer';
import { useAuth } from './components/AuthContext';

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-neon-cyan font-black">CARGANDO SESIÓN...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ redirectTo: location.pathname }} replace />;
  }
  return children;
};

const RequireRole = ({ roles, children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-neon-cyan font-black">VERIFICANDO PERMISOS...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ redirectTo: location.pathname }} replace />;
  }
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/access-denied" state={{ from: location.pathname }} replace />;
  }
  return children;
};

const MainLayout = () => {
  const location = useLocation();
  const isPlayer = location.pathname.startsWith('/player/');
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/register' || 
                     location.pathname === '/verify' || 
                     location.pathname === '/forgot-password' || 
                     location.pathname.startsWith('/reset-password');
  
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/admin';

  return (
    <div className="flex flex-col min-h-screen">
      {(!isPlayer && !isAuthPage && !isDashboard) && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/planes" element={<Pricing />} />
          <Route path="/galeria" element={<Gallery />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="/checkout/success" element={<RequireAuth><CheckoutSuccess /></RequireAuth>} />
          <Route path="/dashboard" element={<RequireRole roles={['ADMIN', 'CLIENT', 'STAFF']}><ClientPortal /></RequireRole>} />
          <Route path="/admin" element={<RequireRole roles={['ADMIN']}><Admin /></RequireRole>} />
          <Route path="/checkout/:planId" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/player/:branchSlug" element={<BranchPlayer />} />
          <Route path="/instalacion-audio" element={<AudioInstallation />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      {(!isPlayer && !isAuthPage && !isDashboard) && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text min-h-screen">
          <MainLayout />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
