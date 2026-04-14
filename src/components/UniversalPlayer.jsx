import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Square, Volume2, VolumeX, Activity, Loader2, Mic2, Waves, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

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
    } else if (streamUrl) {
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
    <div className="relative group w-full max-w-3xl mx-auto px-4">
      {/* Dynamic Glow Aura */}
      <div className={`absolute -inset-4 bg-gradient-to-r ${isPlaying ? 'from-neon-cyan/20 to-neon-purple/20' : 'from-white/5 to-white/5'} rounded-[3rem] blur-2xl transition-all duration-1000 pointer-events-none`} />
      
      <div className="relative bg-[#0a0a14] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-3xl">
        
        {/* ── Header: Pro Specs Display ────────────────── */}
        <div className="bg-black/40 border-b border-white/5 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'playing' ? 'bg-neon-cyan animate-pulse shadow-[0_0_8px_#00f3ff]' : 'bg-gray-700'}`} />
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${status === 'playing' ? 'text-neon-cyan' : 'text-gray-500'}`}>
                {status === 'playing' ? 'LIVE TRANSMISSION' : 'ENGINE STANDBY'}
              </span>
            </div>
            <div className="h-3 w-px bg-white/10 hidden xs:block" />
            <div className="hidden xs:flex gap-3 text-[8px] font-mono text-gray-600">
              <span className="flex items-center gap-1"><Zap size={10} className="text-neon-cyan/40" /> 320 KBPS</span>
              <span className="flex items-center gap-1"><Activity size={10} className="text-neon-purple/40" /> 48KHZ / 24-BIT</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <ShieldCheck size={10} className="text-neon-cyan" />
            <span className="text-[8px] font-bold uppercase tracking-widest text-white/40">Secure</span>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            
            {/* ── Left: Visual Core ────────────────── */}
            <div className="shrink-0 flex justify-center">
              <div className="relative group/disc">
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className={`w-32 h-32 md:w-44 md:h-44 rounded-full transition-all duration-700 ${isPlaying ? 'drop-shadow-[0_0_25px_rgba(0,243,255,0.35)]' : ''}`}
                >
                  <img
                    src="/Disco solito-radioleaconmtrols.png"
                    alt="Disco RadioOleaControls"
                    className="w-full h-full object-contain rounded-full"
                  />
                </motion.div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-2 -right-2 bg-neon-cyan text-void p-2 rounded-xl shadow-xl transform rotate-12">
                  <Mic2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* ── Right: Station Info & EQ ────────────────── */}
            <div className="flex-grow flex flex-col w-full">
              <div className="mb-6 text-center md:text-left">
                <div className="inline-block px-3 py-1 rounded-lg bg-neon-cyan/5 border border-neon-cyan/10 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neon-cyan">Mastering Audio Engine V2</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-display uppercase tracking-tight text-white leading-tight mb-2">
                  {stationName}
                </h3>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-2">
                  <Waves className="w-3 h-3 text-neon-purple" />
                  Hi-Fi Digital Broadcast
                </p>
              </div>

              {/* ── Dynamic EQ Display ────────────────── */}
              <div className="bg-black/60 rounded-2xl p-4 border border-white/5 mb-8 backdrop-blur-xl">
                <div className="h-10 flex items-end justify-between gap-1">
                  {[...Array(24)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={isPlaying ? { height: [4, Math.random() * 32 + 8, 4] } : { height: 2 }}
                      transition={{ repeat: Infinity, duration: 0.4 + Math.random() * 0.4 }}
                      className={`w-full rounded-full transition-colors ${isPlaying ? (i % 2 === 0 ? 'bg-neon-cyan' : 'bg-neon-purple') : 'bg-white/10'}`}
                    />
                  ))}
                </div>
              </div>

              {/* ── Controls Layout ────────────────── */}
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <button
                  onClick={togglePlay}
                  className={`group relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
                    isPlaying 
                    ? 'bg-neon-cyan text-void shadow-[0_0_30px_rgba(0,243,255,0.4)]' 
                    : 'bg-white/10 text-white hover:bg-white hover:text-void'
                  }`}
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : isPlaying ? (
                    <Square className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </button>

                <div className="flex-grow w-full space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Gain Control</span>
                    <span className="text-xs font-mono text-neon-cyan">{isMuted ? 'MUTED' : `${Math.round(volume * 100)}%`}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setIsMuted(!isMuted)} className={`transition-colors ${isMuted ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
                      {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <div className="relative flex-grow h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full transition-all duration-300 ${isMuted ? 'bg-red-500/50' : 'bg-gradient-to-r from-neon-cyan to-neon-purple'}`}
                        style={{ width: `${volume * 100}%` }}
                      />
                      <input 
                        type="range" 
                        min="0" max="1" step="0.01" 
                        value={volume}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setVolume(val);
                          audioRef.current.volume = val;
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Accent: Status Light ────────────────── */}
        <div className={`h-1 w-full transition-colors duration-1000 ${isPlaying ? 'bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_15px_#00f3ff]' : 'bg-white/5'}`} />
      </div>
      <audio ref={audioRef} />
    </div>
  );
};

export default UniversalPlayer;
