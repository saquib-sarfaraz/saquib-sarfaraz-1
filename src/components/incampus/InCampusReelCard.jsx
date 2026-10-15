import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Heart,
  Eye,
  Share2,
  ExternalLink,
  CheckCircle,
  RefreshCw,
  Check
} from 'lucide-react';
import { formatReelCount } from '../../services/incampusReelsApi';

export default function InCampusReelCard({
  reel,
  index,
  isActive,
  globalMuted,
  onGlobalMutedChange
}) {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(globalMuted);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reel.likesCount);
  const [avatarError, setAvatarError] = useState(false);

  // Drag detection coordinates to prevent tap-toggle when swiping vertically
  const dragStart = useRef({ x: 0, y: 0, time: 0 });

  // Synchronize active state with HTML5 video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      setHasError(false);
      video.muted = globalMuted;
      setIsMuted(globalMuted);

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsBuffering(false);
          })
          .catch(() => {
            // If browser autoplay policy blocks sound, fallback to muted autoplay
            if (!video.muted) {
              video.muted = true;
              setIsMuted(true);
              video.play().catch(() => {});
            }
          });
      }
    } else {
      // Strictly pause and mute non-active reels immediately
      video.pause();
      video.muted = true;
      setIsPaused(true);
      setIsBuffering(false);
    }
  }, [isActive, globalMuted]);

  // Synchronize global mute preference when this reel is active
  useEffect(() => {
    const video = videoRef.current;
    if (video && isActive && video.muted !== globalMuted) {
      video.muted = globalMuted;
      setIsMuted(globalMuted);
    }
  }, [globalMuted, isActive]);

  // Native media event handlers - updates state strictly from the real video element
  const handleNativePlay = () => setIsPaused(false);
  const handleNativePause = () => setIsPaused(true);
  const handleNativeVolumeChange = () => {
    if (videoRef.current) {
      setIsMuted(videoRef.current.muted);
    }
  };

  // Toggle Play / Pause on the actual video element
  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch((err) => {
        console.warn('[InBuzz] Play attempt rejected:', err);
      });
    } else {
      video.pause();
    }
  }, []);

  // Toggle Mute / Unmute directly on the actual video element
  const handleToggleMute = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();

    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    // Notify parent feed to update global mute preference across reels
    onGlobalMutedChange(nextMuted);
  }, [onGlobalMutedChange]);

  // Pointer/Touch handlers: distinguish vertical swipe from tap
  const handlePointerDown = (e) => {
    dragStart.current = {
      x: e.clientX || 0,
      y: e.clientY || 0,
      time: Date.now()
    };
  };

  const handlePointerUp = (e) => {
    const deltaX = Math.abs((e.clientX || 0) - dragStart.current.x);
    const deltaY = Math.abs((e.clientY || 0) - dragStart.current.y);
    const deltaTime = Date.now() - dragStart.current.time;

    // If movement was less than 8px and under 300ms, treat as an intentional tap to play/pause
    if (deltaX < 8 && deltaY < 8 && deltaTime < 350) {
      handleTogglePlay();
    }
  };

  // Handle Share / Copy Link
  const handleShare = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    const shareUrl = reel.publicUrl || `https://incampus.online/inbuzz/reel/${reel.id}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2000);
      }).catch(() => {});
    }
  }, [reel]);

  // Handle Like feedback
  const handleLike = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  }, []);

  // Handle video retry
  const handleRetry = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setHasError(false);
    setIsBuffering(true);
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().then(() => {
        setIsBuffering(false);
      }).catch(() => {
        setHasError(true);
        setIsBuffering(false);
      });
    }
  }, []);

  const author = reel.author;
  const isLongCaption = (reel.caption || '').length > 70;

  return (
    <div
      data-reel-id={reel.id}
      data-reel-index={index}
      className="relative w-full h-full min-h-full snap-start snap-normal shrink-0 flex items-center justify-center bg-black overflow-hidden select-none"
      style={{ touchAction: 'pan-y' }}
    >
      {/* 1. Actual HTML5 Video Stream */}
      <video
        ref={videoRef}
        src={reel.streamUrl}
        poster={reel.thumbnailUrl}
        playsInline
        loop
        preload={isActive ? 'auto' : 'metadata'}
        muted={isMuted}
        onPlay={handleNativePlay}
        onPause={handleNativePause}
        onVolumeChange={handleNativeVolumeChange}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
        onError={() => {
          setIsBuffering(false);
          setHasError(true);
        }}
        className="w-full h-full object-cover pointer-events-none"
      />

      {/* 2. Full-viewport gesture tap area with pan-y touch action */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="absolute inset-0 z-10 cursor-pointer"
        style={{ touchAction: 'pan-y' }}
        aria-label={isPaused ? 'Tap to play video' : 'Tap to pause video'}
      />

      {/* 3. Subtle Vignette Gradients for Text & Control Legibility */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/75 via-black/25 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none z-10" />


      {/* 5. Top Right: Dedicated Working Audio Mute / Unmute Control */}
      <div className="absolute top-3.5 right-3.5 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={handleToggleMute}
          className="p-2.5 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/80 active:scale-90 transition-all backdrop-blur-md shadow-lg cursor-pointer flex items-center justify-center focus:outline-none"
          aria-label={isMuted ? 'Unmute InBuzz audio' : 'Mute InBuzz audio'}
          title={isMuted ? 'Tap to unmute audio' : 'Tap to mute audio'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-300" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>
      </div>

      {/* 6. Center Persistent Play Icon when Video is Paused */}
      {isPaused && !isBuffering && !hasError && (
        <div
          onClick={handleTogglePlay}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-auto cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-black/60 border border-white/25 flex items-center justify-center text-white backdrop-blur-md shadow-2xl hover:scale-105 active:scale-95 transition-transform">
            <Play className="w-7 h-7 fill-white ml-1 text-white" />
          </div>
        </div>
      )}

      {/* 7. Center Buffering Spinner */}
      {isBuffering && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        </div>
      )}

      {/* 8. Error & Retry Screen */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/90 z-30 text-center space-y-3">
          <p className="text-white font-medium text-xs">Video stream temporarily unavailable</p>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-extrabold text-xs hover:bg-slate-200 transition-all shadow-md cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 9. Right Action Rail (Likes, Views, Share, Launch InBuzz) */}
      <div className="absolute right-3.5 bottom-16 sm:bottom-18 flex flex-col items-center gap-4 z-20 pointer-events-auto">
        {/* Like Button */}
        <button
          type="button"
          onClick={handleLike}
          className="flex flex-col items-center gap-1 group cursor-pointer focus:outline-none"
          aria-label="Like InBuzz reel"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 ${
              liked
                ? 'bg-rose-500/25 border-rose-500 text-rose-400 scale-105 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'bg-black/50 border-white/15 text-white group-hover:bg-white/20'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500' : ''}`} />
          </div>
          <span className="text-[11px] font-mono font-bold text-white drop-shadow-md">
            {formatReelCount(likeCount)}
          </span>
        </button>

        {/* Views Count */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-slate-300 backdrop-blur-md">
            <Eye className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-200 drop-shadow-md">
            {formatReelCount(reel.viewsCount)}
          </span>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-col items-center gap-1 group cursor-pointer focus:outline-none"
          title="Share InBuzz Reel"
          aria-label="Share InBuzz Reel"
        >
          <div className="w-11 h-11 rounded-full bg-black/50 border border-white/15 flex items-center justify-center text-white group-hover:bg-white/20 backdrop-blur-md transition-all active:scale-95">
            {copiedToast ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-300 drop-shadow-md">
            {copiedToast ? 'Copied!' : 'Share'}
          </span>
        </button>

        {/* Open in InCampus Platform Link */}
        <a
          href={reel.publicUrl}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 group cursor-pointer focus:outline-none pt-1"
          title="Open in InCampus InBuzz"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 border border-emerald-300/40 flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.35)] group-hover:scale-105 transition-transform">
            <ExternalLink className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-300 font-bold drop-shadow">
            InBuzz
          </span>
        </a>
      </div>

      {/* 10. Bottom Left Creator Information & Caption */}
      <div className="absolute left-4 right-18 bottom-6 sm:bottom-8 z-20 pointer-events-auto space-y-2 text-left pr-2">
        {/* Creator Identity */}
        <div className="flex items-center gap-2.5">
          {author.profilePicUrl && !avatarError ? (
            <img
              src={author.profilePicUrl}
              alt={author.fullName}
              onError={() => setAvatarError(true)}
              className="w-9 h-9 rounded-full object-cover border border-white/35 shadow-md shrink-0 bg-slate-800"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#171A25] to-[#414655] border border-white/30 flex items-center justify-center text-white text-xs font-bold font-mono shrink-0 shadow-md">
              {author.fullName?.charAt(0)?.toUpperCase() || 'I'}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 leading-snug">
              <span className="text-sm font-extrabold text-white truncate drop-shadow-md">
                {author.fullName}
              </span>
              {author.isVerified && (
                <CheckCircle className="w-3.5 h-3.5 fill-cyan-400 text-black shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 mt-0.5">
              <span>@{author.username}</span>
              {author.collegeTagName && (
                <>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 truncate max-w-[130px]">
                    {author.collegeTagName}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Caption */}
        {reel.caption && (
          <div className="text-xs text-slate-100 font-sans leading-relaxed drop-shadow-md">
            <p className={captionExpanded ? '' : 'line-clamp-2'}>
              {reel.caption}
            </p>
            {isLongCaption && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCaptionExpanded((prev) => !prev);
                }}
                className="text-[11px] font-mono font-bold text-slate-300 hover:text-white mt-0.5 underline cursor-pointer"
              >
                {captionExpanded ? 'show less' : 'more'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 11. Toast Feedback */}
      {copiedToast && (
        <div className="absolute top-14 inset-x-0 mx-auto w-fit px-4 py-1.5 rounded-full bg-emerald-500 text-black font-mono font-extrabold text-xs shadow-xl z-40 animate-in fade-in slide-in-from-top-2">
          InBuzz link copied to clipboard!
        </div>
      )}
    </div>
  );
}
