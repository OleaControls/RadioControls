import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Link as LinkIcon, ShoppingBag } from 'lucide-react';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [streamUrl, setStreamUrl] = useState('');
  const [error, setError] = useState('');
  const audioRef = useRef(new Audio());

  // Lista de marcas con URLs de prueba que funcionan (Radios Públicas de México/Global)
  const brands = [
    { name: 'Coppel', url: 'https://str.radiogrupo.com.mx/XU-X64k', color: 'bg-yellow-500' }, // Ejemplo funcional (Radio FM)
    { name: 'Puma', url: 'https://icecast-qmusic.be/qmusic_be_aac.m4a', color: 'bg-black' }, // Q-Music (Pop Upbeat)
    { name: 'Sanborns', url: 'https://stream.zeno.fm/un385d385d0uv', color: 'bg-blue-600' }, // Smooth Jazz (Vibe Sanborns)
    { name: 'Sears', url: 'https://stream.zeno.fm/f3wvbbqmdg8uv', color: 'bg-red-600' }, // Lo-Fi / Chill
    { name: 'Tous', url: 'https://stream.zeno.fm/0r0xa854rp8uv', color: 'bg-pink-400' }, // Ambient / Fashion
  ];

  useEffect(() => {
    const audio = audioRef.current;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
        // No mostramos error invasivo al principio, solo si falla el play manual
        setIsPlaying(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => {
    if (!streamUrl) {
        setError('Por favor ingresa un link de estación.');
        return;
    }
    setError('');
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.src = streamUrl;
      audioRef.current.play().catch(e => {
        console.error("Play error:", e);
        setError('Error al reproducir. Verifica el link o la conexión.');
      });
    }
  };

  const handleBrandClick = (url) => {
    // Al hacer click, llenamos el input para que el usuario vea el link "copiado"
    // y pueda darle play.
    setStreamUrl(url);
    setError('');
    // Opcional: Auto-play
    // audioRef.current.src = url;
    // audioRef.current.play().catch(() => setError('Estación no disponible por el momento.'));
  };

  return (
    <section id="player-section" className="min-h-screen py-24 px-4 bg-gray-900/50 backdrop-blur-sm relative z-10 flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Receptor Digital de Alta Fidelidad
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto italic text-lg">
          "Conectando tu espacio a la atmósfera perfecta."
        </p>
        <p className="text-gray-500 max-w-xl mx-auto mt-4 text-sm">
          Introduce la URL de transmisión proporcionada por RadioControls para iniciar el ambiente sonoro en tu punto de venta.
        </p>
      </div>
      
      <div className="bg-gray-800/80 p-8 rounded-3xl shadow-2xl w-full max-w-4xl border border-gray-700 relative overflow-hidden backdrop-blur-md flex flex-col md:flex-row gap-8">
        
        {/* Columna Izquierda: Marcas */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-700 pb-6 md:pb-0 md:pr-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 text-gray-400 uppercase tracking-wider">
                <ShoppingBag className="w-4 h-4"/> Canales Oficiales
            </h3>
            <div className="space-y-3">
                {brands.map((brand, idx) => (
                    <button 
                        key={idx}
                        onClick={() => handleBrandClick(brand.url)}
                        className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all border border-gray-700 group hover:border-cyan-500/50 hover:bg-gray-700/50 ${streamUrl === brand.url ? 'bg-gray-700 border-cyan-500' : 'bg-gray-900/50'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${brand.color}`}>
                            {brand.name[0]}
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className="font-medium text-white text-sm truncate">{brand.name}</p>
                            <p className="text-xs text-gray-500 truncate">Estación Ambiental</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Columna Derecha: Reproductor */}
        <div className="w-full md:w-2/3 flex flex-col justify-between">
            
            {/* Visualizer Background (Local) */}
            <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none flex items-end justify-center gap-1 px-8 pb-8">
                 {[...Array(20)].map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-cyan-500 rounded-t-sm transition-all duration-100 w-full"
                      style={{ 
                        height: isPlaying ? `${Math.random() * 40 + 5}%` : '2%',
                      }} 
                    />
                 ))}
            </div>

            <div className="relative z-10 space-y-8">
                {/* URL Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 flex justify-between">
                        <span>Enlace de Transmisión (Stream URL)</span>
                        <span className="text-xs text-cyan-500 cursor-pointer hover:underline flex items-center gap-1">
                            <LinkIcon className="w-3 h-3"/> Copiar Link Actual
                        </span>
                    </label>
                    <input 
                        type="text" 
                        value={streamUrl}
                        onChange={(e) => setStreamUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-4 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all placeholder-gray-600 font-mono text-sm"
                    />
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </div>

                {/* Main Controls */}
                <div className="flex flex-col items-center gap-6">
                    <button 
                        onClick={togglePlay}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${isPlaying ? 'bg-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.5)]' : 'bg-white hover:bg-gray-200 text-black shadow-lg'}`}
                    >
                        {isPlaying ? <Pause className="w-8 h-8 text-black fill-current" /> : <Play className="w-8 h-8 text-black fill-current ml-1" />}
                    </button>
                    
                    {/* Status Text */}
                    <div className="text-center">
                        <p className="text-white font-medium tracking-wide">
                            {isPlaying ? 'Reproduciendo...' : 'Listo para transmitir'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            {streamUrl ? 'Fuente conectada' : 'Selecciona una fuente'}
                        </p>
                    </div>
                </div>

                {/* Volume Slider */}
                <div className="flex items-center gap-3 bg-gray-900/80 p-3 rounded-xl border border-gray-700">
                    <button onClick={() => setVolume(volume === 0 ? 0.5 : 0)}>
                        {volume === 0 ? <VolumeX className="text-gray-400 w-5 h-5" /> : <Volume2 className="text-cyan-400 w-5 h-5" />}
                    </button>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Player;