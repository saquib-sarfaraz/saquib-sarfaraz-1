import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, RotateCw, Play, Sparkles, Gamepad2, Maximize2, Minimize2, Lock, Clock } from 'lucide-react';

const ARCADE_GAMES = [
  {
    id: 'xyxo',
    title: 'XYXO',
    category: 'Realtime Socket Engine',
    difficulty: 'Medium',
    badge: 'Multiplayer',
    status: 'available',
    description: 'Real-time socket-based multiplayer Tic-Tac-Toe with global matchmaking & room codes.',
    url: 'https://xyxo.vercel.app/',
    gradient: 'from-[#171A25] via-[#222633]/80 to-[#10131D]',
    borderColor: 'border-[#414655] hover:border-[#747B8B]',
  },
  {
    id: 'cityflow',
    title: 'CityFlow Commander 3D',
    category: '3D Simulation Engine',
    difficulty: 'Pro',
    badge: '3D Traffic',
    status: 'comingSoon',
    description: 'Urban traffic signal optimization & multi-agent road pathfinding engine.',
    gradient: 'from-[#171A25] via-[#10131D] to-[#080A12]',
    borderColor: 'border-[#414655]/60 hover:border-[#747B8B]/60',
  },
  {
    id: 'codebreaker',
    title: 'Code Breaker Matrix',
    category: 'Cipher & Logic Challenge',
    difficulty: 'Hard',
    badge: 'Logic',
    status: 'comingSoon',
    description: 'Decrypt obfuscated hex payloads under time constraints in a terminal interface.',
    gradient: 'from-[#171A25] via-[#10131D] to-[#080A12]',
    borderColor: 'border-[#414655]/60 hover:border-[#747B8B]/60',
  },
  {
    id: 'speed-typer',
    title: 'Speed Typer OS',
    category: 'Code Speed Arcade',
    difficulty: 'Speed',
    badge: 'Developer',
    status: 'comingSoon',
    description: 'Measure your WPM & accuracy typing production JavaScript & React snippets.',
    gradient: 'from-[#171A25] via-[#10131D] to-[#080A12]',
    borderColor: 'border-[#414655]/60 hover:border-[#747B8B]/60',
  }
];

export default function PlayZoneModal({ isOpen, onClose }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const windowContainerRef = useRef(null);
  const gameContainerRef = useRef(null);

  // Sync fullscreen state with browser events (Esc key, browser gestures)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Manage body scroll lock and pause/resume Lenis smooth scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.lenis?.stop();
    } else {
      document.body.style.overflow = '';
      window.lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      window.lenis?.start();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLaunchGame = (game, launchFullscreen = false) => {
    if (game.status !== 'available') return;
    setSelectedGame(game);
    setIframeKey((prev) => prev + 1);

    if (launchFullscreen) {
      setTimeout(() => {
        toggleFullscreen();
      }, 100);
    }
  };

  const handleBackToArcade = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setSelectedGame(null);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const target = gameContainerRef.current || windowContainerRef.current;
        if (target?.requestFullscreen) {
          await target.requestFullscreen();
        } else if (target?.webkitRequestFullscreen) {
          await target.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request could not be completed:', err);
    }
  };

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent
        className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-2xl overflow-y-auto text-left font-sans safe-area-inset"
      >
        
        {/* Main OS Window Container */}
        <motion.div
          ref={windowContainerRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full max-w-5xl h-[92vh] sm:h-[90vh] max-h-[850px] rounded-3xl optical-modal-card apple-glass-edge flex flex-col justify-between overflow-hidden transition-all duration-300 ${
            isFullscreen ? 'max-w-none max-h-none h-full rounded-none border-none' : ''
          }`}
        >
          <div className="apple-specular-glare" />
          
          {/* OS Window Header Controls */}
          <div className="p-3.5 sm:p-5 border-b border-white/15 bg-white/[0.02] flex items-center justify-between shrink-0 pt-safe relative z-10">
            <div className="flex items-center gap-2 sm:gap-3">
              {selectedGame ? (
                <button
                  onClick={handleBackToArcade}
                  className="px-3 py-1.5 rounded-xl apple-glass-btn text-[#F5F6FA] font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div className="p-2 rounded-xl apple-glass-btn text-white">
                  <Gamepad2 className="w-5 h-5" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-white font-sans flex items-center gap-1.5">
                    <span>🎮 {selectedGame ? selectedGame.title : 'Play Zone Arcade Library'}</span>
                    <span className="text-xs font-mono font-normal text-[#949BAA]">v2.6 OS</span>
                  </h3>
                </div>
                <p className="text-xs font-mono text-[#949BAA] hidden sm:block">
                  {selectedGame ? selectedGame.category : 'Browse interactive mini experiences & arcade games.'}
                </p>
              </div>
            </div>

            {/* Window Right Action Trio */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Fullscreen Toggle Button (⛶) */}
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 rounded-full apple-glass-btn text-[#F5F6FA] font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Exit Fullscreen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </>
                )}
              </button>

              {/* Reload Button (When Game Active) */}
              {selectedGame && selectedGame.url && (
                <button
                  onClick={() => setIframeKey((k) => k + 1)}
                  className="p-2 rounded-full apple-glass-btn text-[#C6CBD6] hover:text-white transition-colors cursor-pointer"
                  title="Reload Game"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              )}

              {/* Close Button (✕) */}
              <button
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                  }
                  setSelectedGame(null);
                  onClose();
                }}
                className="p-2 rounded-full apple-glass-btn text-[#C6CBD6] hover:text-white transition-colors cursor-pointer"
                aria-label="Close Play Zone"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* OS Window Body */}
          <div
            data-lenis-prevent
            className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-8 space-y-6 scrollbar-none relative z-10"
          >
            
            {/* VIEW A: ARCADE SELECTION GRID */}
            {!selectedGame ? (
              <div className="space-y-6 max-w-5xl mx-auto">
                {/* Banner Header */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-[#171A25] via-[#222633]/60 to-[#10131D] border border-[#414655] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-mono font-bold uppercase tracking-wider border border-white/15">
                      <Sparkles className="w-3.5 h-3.5" /> Saquib OS Arcade Library
                    </div>
                    <p className="text-xs text-[#C6CBD6] font-mono pt-1">
                      1 Active Game online • 3 Production Releases Coming Soon.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-[#C6CBD6]">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 font-bold">
                      ● 1 Playable
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#171A25] text-[#949BAA] border border-[#414655] font-bold">
                      ○ 3 Coming Soon
                    </span>
                  </div>
                </div>

                {/* Arcade Game Library Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ARCADE_GAMES.map((game) => {
                    const isPlayable = game.status === 'available';

                    return (
                      <motion.div
                        key={game.id}
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-6 rounded-3xl glass-card glass-card-hover apple-glass-edge transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
                      >
                        <div className="apple-specular-glare" />

                        <div className="space-y-3 relative z-10">
                          {/* Header Status Row */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded bg-white/10 text-[#C6CBD6] border border-white/15">
                              {game.category}
                            </span>
                            
                            {isPlayable ? (
                              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/30 flex items-center gap-1 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                Play Now
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#171A25] text-[#949BAA] border border-[#414655] flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#949BAA]" />
                                Coming Soon
                              </span>
                            )}
                          </div>

                          {/* Game Info */}
                          <div>
                            <h4 className={`text-xl font-extrabold font-sans ${isPlayable ? 'text-white group-hover:text-white' : 'text-[#C6CBD6]'}`}>
                              {game.title}
                            </h4>
                            <p className="text-xs text-[#949BAA] pt-1 leading-relaxed font-sans line-clamp-2">
                              {game.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Action Footer */}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-xs font-bold relative z-10">
                          {isPlayable ? (
                            <div className="flex items-center gap-2 w-full">
                              <button
                                onClick={() => handleLaunchGame(game, false)}
                                className="flex-1 py-2.5 rounded-xl apple-glass-btn !bg-white/95 !text-black hover:!bg-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>▶ Play</span>
                              </button>

                              <button
                                onClick={() => handleLaunchGame(game, true)}
                                className="p-2.5 rounded-xl apple-glass-btn text-white transition-all cursor-pointer"
                                title="Play Fullscreen"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between w-full">
                              <span className="px-3.5 py-2 rounded-xl bg-[#171A25] border border-[#414655] text-[#949BAA] text-[11px] font-mono font-medium flex items-center gap-1.5 cursor-not-allowed">
                                <Lock className="w-3 h-3 text-[#747B8B]" />
                                <span>Coming Soon</span>
                              </span>
                              <span className="text-[10px] text-[#747B8B] uppercase">{game.badge}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* VIEW B: EMBEDDED GAME VIEWPORT */
              <div
                ref={gameContainerRef}
                className="w-full h-full flex flex-col justify-between rounded-2xl overflow-hidden border border-[#414655] bg-black/80 relative min-h-[500px]"
              >
                {selectedGame.url ? (
                  <iframe
                    key={iframeKey}
                    title={selectedGame.title}
                    src={selectedGame.url}
                    className="w-full h-full min-h-[600px] border-none flex-1"
                    allow="fullscreen; autoplay; clipboard-write"
                  />
                ) : (
                  /* Fallback View */
                  <div className="p-8 text-center space-y-6 my-auto max-w-md mx-auto">
                    <button
                      onClick={handleBackToArcade}
                      className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-xs hover:bg-[#C6CBD6] transition-all cursor-pointer"
                    >
                      Return to Arcade Grid
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* OS Window Footer Bar */}
          <div className="p-3 border-t border-[#414655] bg-[#080A12]/95 flex items-center justify-between text-[11px] font-mono text-[#949BAA] shrink-0 pb-safe">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[#F5F6FA]">Saquib OS Arcade Library</span>
            </span>
            <span className="hidden sm:inline">1 Playable • 3 Releases Coming Soon</span>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
