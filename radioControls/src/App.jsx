import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import BranchPlayer from './pages/BranchPlayer';
import Login from './pages/Login';
import Register from './pages/Register';
import { AppProviders } from './components/AppProviders';
import Footer from './components/Footer';

const MainLayout = () => {
  const location = useLocation();
  const isPlayer = location.pathname.startsWith('/player/');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboard = location.pathname === '/dashboard';

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
          <Route path="/checkout/:planId" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ClientPortal />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/player/:branchSlug" element={<BranchPlayer />} />
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