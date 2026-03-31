import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Square, Volume2, VolumeX, Radio, Activity, Loader2, Disc, Mic2, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UniversalPlayer = ({ streamUrl, stationName = "Estación RadiOlea" }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, playing, error
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let hls;
    if (streamUrl && streamUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(audioRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => setStatus('ready'));
        hls.on(Hls.Events.ERROR, () => setStatus('error'));
      } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        audioRef.current.src = streamUrl;
      }
    } else {
      audioRef.current.src = streamUrl;
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [streamUrl]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setStatus('idle');
    } else {
      setStatus('loading');
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setStatus('playing');
        })
        .catch(() => setStatus('error'));
    }
  };

  return (
    <div className="relative group max-w-2xl w-full">
      {/* Outer Glow Decor */}
      <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-black border border-white/10 rounded-[38px] overflow-hidden shadow-2xl">
        
        {/* Top "Status Bar" */}
        <div className="bg-white/5 border-b border-white/5 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${status === 'playing' ? 'bg-neon-cyan animate-ping' : 'bg-gray-600'}`} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              {status === 'playing' ? 'En Directo' : 'Standby'}
            </span>
          </div>
          <div className="flex gap-4">
            <div className="text-[10px] font-mono text-neon-cyan/50 tracking-tighter">BITRATE: 320KBPS</div>
            <div className="text-[10px] font-mono text-neon-cyan/50 tracking-tighter">DAC: 24-BIT</div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            
            {/* Spinning Disc / Visualizer */}
            <div className="relative shrink-0">
              <motion.div 
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-royal-blue to-black border-4 border-white/10 flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <Disc className={`w-16 h-16 ${isPlaying ? 'text-neon-cyan' : 'text-gray-700'} transition-colors duration-500`} />
                
                {/* Visualizer Rings */}
                {isPlaying && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 border-2 border-neon-cyan rounded-full"
                  />
                )}
              </motion.div>
              
              <div className="absolute -bottom-2 -right-2 bg-royal-blue-dark border border-white/10 p-2 rounded-xl shadow-lg">
                <Mic2 className="w-4 h-4 text-neon-purple" />
              </div>
            </div>

            {/* Content & Controls */}
            <div className="flex-grow w-full text-center md:text-left">
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">{stationName}</h3>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Waves className="w-4 h-4 text-neon-cyan" />
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Atmosphere Engine V2</p>
                </div>
              </div>

              {/* Dynamic Visualizer Bars */}
              <div className="h-12 flex items-end justify-center md:justify-start gap-1 mb-8 opacity-40">
                {[...Array(20)].map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={isPlaying ? { height: [10, Math.random() * 48, 10] } : { height: 4 }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                    className="w-1.5 bg-neon-cyan rounded-full"
                  />
                ))}
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-6 justify-center md:justify-start">
                  <button
                    onClick={togglePlay}
                    className={`w-20 h-20 rounded-[24px] flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 ${
                      status === 'playing' 
                      ? 'bg-neon-cyan text-royal-blue-dark shadow-[0_0_30px_rgba(0,243,255,0.4)]' 
                      : 'bg-white text-royal-blue-dark hover:bg-neon-cyan'
                    }`}
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : status === 'playing' ? (
                      <Square className="w-8 h-8 fill-current" />
                    ) : (
                      <Play className="w-8 h-8 fill-current ml-1" />
                    )}
                  </button>

                  <div className="flex-grow max-w-[200px] space-y-3">
                    <div className="flex justify-between text-[9px] font-black text-gray-500 tracking-widest uppercase">
                      <span>Nivel de Salida</span>
                      <span className="text-neon-cyan">{isMuted ? 'Muted' : `${Math.round(volume * 100)}%`}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setIsMuted(!isMuted)} className="hover:text-neon-cyan transition-colors">
                        {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                      <input 
                        type="range" 
                        min="0" max="1" step="0.01" 
                        value={volume}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setVolume(val);
                          audioRef.current.volume = val;
                        }}
                        className="w-full accent-neon-cyan h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Deco */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-20"></div>
      </div>
      <audio ref={audioRef} muted={isMuted} />
    </div>
  );
};

export default UniversalPlayer;