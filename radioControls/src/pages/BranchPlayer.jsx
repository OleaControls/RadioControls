import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UniversalPlayer from '../components/UniversalPlayer';
import WaveCursor from '../components/WaveCursor';
import { ShieldCheck, Info } from 'lucide-react';

const BranchPlayer = () => {
  const { branchSlug } = useParams();
  const [branchData, setBranchData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setStatus('loading');
    setError('');

    const loadBranch = async () => {
      try {
        const response = await fetch(`/api/branches/get-stream?slug=${encodeURIComponent(branchSlug)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || 'No se pudo cargar la sucursal');
        }

        if (!isMounted) return;
        setBranchData({
          name: data.branchName,
          streamUrl: data.streamUrl,
          stationName: data.stationName,
          subscriptionStatus: data.subscriptionStatus,
        });
        setStatus('ready');
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'No se pudo cargar la sucursal');
        setBranchData({
          name: branchSlug.replace('-', ' ').toUpperCase(),
          streamUrl: '/audios/Tutiendahabla.mp3',
          stationName: 'RadiOlea Ambient Mix (Demo)',
          subscriptionStatus: 'ACTIVE', // En demo permitimos reproducir
        });
        setStatus('ready');
      }
    };

    loadBranch();
    return () => {
      isMounted = false;
    };
  }, [branchSlug]);

  const isBlocked = branchData && branchData.subscriptionStatus !== 'ACTIVE';

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <WaveCursor />
      
      <div className="mb-12 text-center relative z-10">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 ${isBlocked ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan'}`}>
          {isBlocked ? <Info className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          {isBlocked ? 'Acceso Suspendido' : 'Terminal Autorizada'}
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
          {branchData?.name || 'Cargando...'}
        </h1>
        <p className="text-gray-500 font-medium">RadiOleaControls Receiver Engine V2.0</p>
      </div>

      <div className="relative z-10 w-full flex justify-center">
        {status === 'loading' ? (
          <div className="text-gray-500 text-sm uppercase tracking-widest">Cargando estación...</div>
        ) : isBlocked ? (
          <div className="bg-slate-900/50 border border-red-500/30 rounded-[40px] p-12 text-center max-w-xl backdrop-blur-xl shadow-2xl shadow-red-500/10">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
               <ShieldCheck className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">SERVICIO SUSPENDIDO</h2>
            <p className="text-red-200/60 font-medium text-lg mb-8 leading-relaxed">
              Detectamos un problema con tu suscripción para esta sucursal. La reproducción automática ha sido bloqueada.
            </p>
            <div className="bg-red-500 text-slate-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest animate-pulse">
              REALICE EL PAGO PARA CONTINUAR
            </div>
          </div>
        ) : (
          <UniversalPlayer 
            streamUrl={branchData?.streamUrl} 
            stationName={branchData?.stationName} 
          />
        )}
      </div>

      {error && !isBlocked && (
        <div className="mt-6 max-w-md bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-amber-200 text-xs font-bold uppercase tracking-widest">
          {error} Usando modo demo temporal.
        </div>
      )}

      {!isBlocked && (
        <div className="mt-12 max-w-md bg-white/5 border border-white/10 p-6 rounded-2xl relative z-10 backdrop-blur-md">
          <div className="flex gap-4 text-gray-400 text-sm">
            <Info className="w-6 h-6 shrink-0 text-neon-cyan" />
            <p>Esta terminal está configurada para uso exclusivo en sucursal. No comparta este enlace para evitar desconexiones por límites de concurrencia.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchPlayer;
