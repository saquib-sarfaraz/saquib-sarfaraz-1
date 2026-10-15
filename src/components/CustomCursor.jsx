import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorType, setCursorType] = useState('default'); // default, button, link, card, text, image
  const [cursorText, setCursorText] = useState('');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Position state (raw mouse position)
  const mousePos = useRef({ x: -100, y: -100 });
  // Follower position state (lerped interpolation for 60 FPS spring physics)
  const followerPos = useRef({ x: -100, y: -100 });

  const coreDotRef = useRef(null);
  const followerRingRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const currentTypeRef = useRef('default');
  const currentTextRef = useRef('');

  useEffect(() => {
    // 1. Accessibility & Touch Device check
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    // Hide native cursor on desktop
    document.body.style.cursor = 'none';

    // 2. Mouse position tracking
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Core dot moves instantly via GPU transform
      if (coreDotRef.current) {
        coreDotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }

      // Check hovered element type
      const target = e.target;
      const clickableButton = target.closest('button, [role="button"], .btn-magnetic');
      const clickableLink = target.closest('a');
      const heading = target.closest('h1, h2, h3, .hover-text');
      const projectCard = target.closest('.hover-card, [data-cursor-label]');

      let nextType = 'default';
      let nextText = '';

      if (projectCard) {
        nextType = 'card';
        nextText = projectCard.getAttribute('data-cursor-label') || 'OPEN →';
      } else if (clickableButton) {
        nextType = 'button';
      } else if (clickableLink) {
        nextType = 'link';
      } else if (heading) {
        nextType = 'text';
      }

      // Only update state when cursor state actually changes to avoid unnecessary re-renders
      if (nextType !== currentTypeRef.current || nextText !== currentTextRef.current) {
        currentTypeRef.current = nextType;
        currentTextRef.current = nextText;
        setCursorType(nextType);
        setCursorText(nextText);
      }

      // Magnetic Button interaction
      if (clickableButton) {
        const rect = clickableButton.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.12;
        const deltaY = (e.clientY - centerY) * 0.12;
        clickableButton.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      }
    };

    // Reset button transform on mouse out
    const handleMouseOut = (e) => {
      const button = e.target.closest('button, [role="button"], .btn-magnetic');
      if (button) {
        button.style.transform = 'translate3d(0px, 0px, 0)';
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    // Scroll detection
    const handleScroll = () => {
      if (!isScrolling) setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150);
    };

    // 60 FPS lerp loop for follower ring weighted physics
    let animFrameId;
    const loop = () => {
      const ease = 0.22;
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * ease;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * ease;

      if (followerRingRef.current) {
        followerRingRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0)`;
      }

      animFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    loop();

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      
      {/* LAYER 1: Core Dot (#FFFFFF pure white with soft specular glow) */}
      <div
        ref={coreDotRef}
        style={{ willChange: 'transform' }}
        className={`fixed top-0 left-0 w-[6px] h-[6px] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-transform duration-100 ease-out ${
          isMouseDown ? 'scale-[0.6]' : 'scale-100'
        } ${cursorType === 'text' ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* LAYER 2: Follower Ring (Weighted lerped spring ring) */}
      <div
        ref={followerRingRef}
        style={{ willChange: 'transform' }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      >
        <motion.div
          animate={{
            width: cursorType === 'button' ? 44 : cursorType === 'card' ? 68 : cursorType === 'text' ? 3 : cursorType === 'link' ? 34 : 26,
            height: cursorType === 'button' ? 44 : cursorType === 'card' ? 32 : cursorType === 'text' ? 24 : cursorType === 'link' ? 26 : 26,
            borderRadius: cursorType === 'card' ? '14px' : cursorType === 'text' ? '2px' : '9999px',
            scale: isMouseDown ? 0.88 : isScrolling ? 0.95 : 1,
            scaleY: isScrolling ? 1.2 : 1,
            borderColor: cursorType === 'button' || cursorType === 'card' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.35)',
            backgroundColor: cursorType === 'card' ? 'rgba(16, 19, 29, 0.9)' : 'rgba(255, 255, 255, 0.03)',
            boxShadow: cursorType === 'button' || cursorType === 'card' ? '0 0 20px rgba(255, 255, 255, 0.15)' : 'none',
          }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="border border-white/40 backdrop-blur-[2px] flex items-center justify-center font-mono text-[10px] font-bold text-white tracking-wider shadow-sm"
        >
          {cursorType === 'card' && cursorText}
        </motion.div>
      </div>

    </div>
  );
}
