import { useEffect, useRef } from 'react';

// Constellation Node Definitions concentrated around the center (relative to center (0, 0))
// 4 Diagnostic Quadrants:
// Cluster 0: CORE (upper-left)
// Cluster 1: NETWORK (upper-right)
// Cluster 2: INTERFACE (lower-left)
// Cluster 3: RENDER ENGINE (lower-right)
// Cluster 4: KERNEL (center anchor)

const NODES = [
  // Center Kernel Anchor
  { id: 0, cluster: 4, x: 0, y: 0, r: 4.5, unlockAt: 0.15, label: 'KERNEL' },

  // Cluster 0: CORE (unlocks 0.22 - 0.35)
  { id: 1, cluster: 0, x: -65, y: -45, r: 4.0, unlockAt: 0.24, isHub: true },
  { id: 2, cluster: 0, x: -125, y: -70, r: 3.0, unlockAt: 0.28 },
  { id: 3, cluster: 0, x: -95, y: -15, r: 2.5, unlockAt: 0.31 },
  { id: 4, cluster: 0, x: -40, y: -95, r: 2.8, unlockAt: 0.34 },
  { id: 5, cluster: 0, x: -150, y: -30, r: 2.2, unlockAt: 0.36 },

  // Cluster 1: NETWORK (unlocks 0.36 - 0.49)
  { id: 6, cluster: 1, x: 70, y: -45, r: 4.0, unlockAt: 0.38, isHub: true },
  { id: 7, cluster: 1, x: 130, y: -65, r: 3.0, unlockAt: 0.42 },
  { id: 8, cluster: 1, x: 100, y: -15, r: 2.6, unlockAt: 0.45 },
  { id: 9, cluster: 1, x: 45, y: -90, r: 2.8, unlockAt: 0.47 },
  { id: 10, cluster: 1, x: 155, y: -25, r: 2.2, unlockAt: 0.49 },

  // Cluster 2: INTERFACE (unlocks 0.50 - 0.61)
  { id: 11, cluster: 2, x: -65, y: 55, r: 4.0, unlockAt: 0.52, isHub: true },
  { id: 12, cluster: 2, x: -120, y: 45, r: 2.8, unlockAt: 0.55 },
  { id: 13, cluster: 2, x: -90, y: 95, r: 3.0, unlockAt: 0.57 },
  { id: 14, cluster: 2, x: -30, y: 80, r: 2.5, unlockAt: 0.59 },
  { id: 15, cluster: 2, x: -135, y: 90, r: 2.2, unlockAt: 0.61 },

  // Cluster 3: RENDER ENGINE (unlocks 0.62 - 0.72)
  { id: 16, cluster: 3, x: 70, y: 55, r: 4.0, unlockAt: 0.63, isHub: true },
  { id: 17, cluster: 3, x: 125, y: 50, r: 2.8, unlockAt: 0.66 },
  { id: 18, cluster: 3, x: 95, y: 95, r: 3.0, unlockAt: 0.68 },
  { id: 19, cluster: 3, x: 30, y: 80, r: 2.5, unlockAt: 0.70 },
  { id: 20, cluster: 3, x: 140, y: 90, r: 2.2, unlockAt: 0.72 },
];

// Graph Connections between node pairs
const EDGES = [
  // Kernel cross-links to hubs
  { from: 0, to: 1, speed: 0.6 },
  { from: 0, to: 6, speed: 0.65 },
  { from: 0, to: 11, speed: 0.58 },
  { from: 0, to: 16, speed: 0.62 },

  // Core internal links
  { from: 1, to: 2, speed: 0.7 },
  { from: 1, to: 3, speed: 0.55 },
  { from: 1, to: 4, speed: 0.65 },
  { from: 2, to: 5, speed: 0.5 },
  { from: 3, to: 5, speed: 0.6 },
  { from: 4, to: 2, speed: 0.55 },

  // Network internal links
  { from: 6, to: 7, speed: 0.7 },
  { from: 6, to: 8, speed: 0.6 },
  { from: 6, to: 9, speed: 0.65 },
  { from: 7, to: 10, speed: 0.5 },
  { from: 8, to: 10, speed: 0.55 },
  { from: 9, to: 7, speed: 0.6 },

  // Interface internal links
  { from: 11, to: 12, speed: 0.65 },
  { from: 11, to: 13, speed: 0.7 },
  { from: 11, to: 14, speed: 0.55 },
  { from: 12, to: 15, speed: 0.6 },
  { from: 13, to: 15, speed: 0.5 },
  { from: 14, to: 13, speed: 0.65 },

  // Render Engine internal links
  { from: 16, to: 17, speed: 0.65 },
  { from: 16, to: 18, speed: 0.7 },
  { from: 16, to: 19, speed: 0.55 },
  { from: 17, to: 20, speed: 0.6 },
  { from: 18, to: 20, speed: 0.5 },
  { from: 19, to: 18, speed: 0.65 },

  // Cross-Cluster Outer Perimeters (Harmonic Interconnects)
  { from: 4, to: 9, speed: 0.45 },   // Core top ↔ Network top
  { from: 1, to: 6, speed: 0.5 },    // Core hub ↔ Network hub
  { from: 14, to: 19, speed: 0.48 }, // Interface bottom ↔ Render bottom
  { from: 11, to: 16, speed: 0.52 }, // Interface hub ↔ Render hub
  { from: 3, to: 11, speed: 0.55 },  // Core ↔ Interface
  { from: 8, to: 16, speed: 0.55 },  // Network ↔ Render
];

export default function BootNetworkGraph({ progress = 0.5 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const progressRef = useRef(progress);

  // Keep progressRef in sync with prop without triggering re-render
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Travelling blue pulse particles along edges
    const pulses = EDGES.map((edge, i) => ({
      edgeIndex: i,
      offset: (i * 0.17) % 1.0,
      speed: edge.speed * (0.35 + (i % 3) * 0.08),
    }));

    let startTime = performance.now();

    const render = () => {
      animRef.current = requestAnimationFrame(render);

      if (!width || !height || width <= 0 || height <= 0) {
        return;
      }

      try {
        const now = performance.now();
        const elapsed = (now - startTime) * 0.001;
        const prog = Math.min(Math.max(progressRef.current, 0), 1.0);

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const cx = width * 0.5;
        const cy = height * 0.5;

        // Responsive scale based on canvas size (target ~460px container, clamped to positive safe minimum)
        const scale = Math.max(0.1, Math.min(width, height) / 440);

        // Breathing harmonic motion
        const breath = prefersReducedMotion ? 1 : 1 + Math.sin(elapsed * 1.8) * 0.015;

        // ─── 1. WAVEFORM SIGNAL PASSING THROUGH CENTER ───
        if (prog > 0.25) {
          const waveAlpha = Math.min((prog - 0.25) / 0.35, 1.0) * (prog > 0.85 ? Math.max(0, 1 - (prog - 0.85) / 0.15) : 0.45);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.35 * waveAlpha})`;
          ctx.lineWidth = 1.0;

          const waveWidth = 320 * scale;
          const waveStartX = cx - waveWidth * 0.5;

          for (let x = 0; x <= waveWidth; x += 3) {
            const px = waveStartX + x;
            const normX = (x / waveWidth) * 2 - 1; // [-1, 1]
            const envelope = Math.exp(-normX * normX * 2.5); // Gaussian center concentration
            const freq1 = Math.sin(x * 0.04 - elapsed * 4.0);
            const freq2 = Math.cos(x * 0.08 - elapsed * 2.5) * 0.5;
            const py = cy + (freq1 + freq2) * 16 * envelope * scale;

            if (x === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Waveform subtle silver secondary harmonic
          ctx.beginPath();
          ctx.strokeStyle = `rgba(226, 232, 240, ${0.2 * waveAlpha})`;
          ctx.lineWidth = 0.75;
          for (let x = 0; x <= waveWidth; x += 4) {
            const px = waveStartX + x;
            const normX = (x / waveWidth) * 2 - 1;
            const envelope = Math.exp(-normX * normX * 3.0);
            const freq = Math.sin(x * 0.06 + elapsed * 3.2);
            const py = cy + freq * 10 * envelope * scale;
            if (x === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }

        // ─── 2. NETWORK CONNECTING LINES ───
        EDGES.forEach((edge) => {
          const nodeA = NODES[edge.from];
          const nodeB = NODES[edge.to];

          const unlA = prog >= nodeA.unlockAt;
          const unlB = prog >= nodeB.unlockAt;

          if (!unlA && !unlB) return;

          // Line activation factor
          const actA = Math.min(Math.max((prog - nodeA.unlockAt) / 0.08, 0), 1);
          const actB = Math.min(Math.max((prog - nodeB.unlockAt) / 0.08, 0), 1);
          const lineAct = Math.min(actA, actB);

          if (lineAct <= 0.02) return;

          const xA = cx + nodeA.x * scale * breath;
          const yA = cy + nodeA.y * scale * breath;
          const xB = cx + nodeB.x * scale * breath;
          const yB = cy + nodeB.y * scale * breath;

          // Base network line (graphite-silver)
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 * lineAct})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(xA, yA);
          ctx.lineTo(xB, yB);
          ctx.stroke();

          // Subtle electric blue accent line underneath
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.22 * lineAct})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(xA, yA);
          ctx.lineTo(xB, yB);
          ctx.stroke();
        });

        // ─── 3. TRAVELLING ELECTRIC BLUE PULSES ───
        if (!prefersReducedMotion && prog > 0.22) {
          pulses.forEach((pulse) => {
            const edge = EDGES[pulse.edgeIndex];
            const nodeA = NODES[edge.from];
            const nodeB = NODES[edge.to];

            if (prog < nodeA.unlockAt || prog < nodeB.unlockAt) return;

            // Compute moving position along edge
            const tPos = ((elapsed * pulse.speed + pulse.offset) % 1.0);

            const xA = cx + nodeA.x * scale * breath;
            const yA = cy + nodeA.y * scale * breath;
            const xB = cx + nodeB.x * scale * breath;
            const yB = cy + nodeB.y * scale * breath;

            const px = xA + (xB - xA) * tPos;
            const py = yA + (yB - yA) * tPos;

            // Pulse head glow with strictly non-negative outer radius
            const pulseRadius = Math.max(0.5, 6 * scale);
            const grad = ctx.createRadialGradient(px, py, 0, px, py, pulseRadius);
            grad.addColorStop(0, 'rgba(147, 197, 253, 0.95)'); // soft silver-blue core
            grad.addColorStop(0.3, 'rgba(59, 130, 246, 0.7)');  // electric blue
            grad.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

            ctx.beginPath();
            ctx.arc(px, py, pulseRadius, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();

            // Core bright dot
            const coreRadius = Math.max(0.2, 1.2 * scale);
            ctx.beginPath();
            ctx.arc(px, py, coreRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
          });
        }

        // ─── 4. NETWORK NODES & PROGRESSIVE ILLUMINATION ───
        NODES.forEach((node) => {
          const isUnlocked = prog >= node.unlockAt;
          const activation = Math.min(Math.max((prog - node.unlockAt) / 0.08, 0), 1);

          const nx = cx + node.x * scale * breath;
          const ny = cy + node.y * scale * breath;
          const radius = Math.max(0.5, node.r * scale);

          if (isUnlocked && activation > 0) {
            // Outer halo aura for active nodes - safely clamped to positive radius
            const baseHalo = radius * 2.8;
            const hubOffset = node.isHub ? Math.sin(elapsed * 3 + node.id) * Math.min(2, baseHalo * 0.3) : 0;
            const haloRadius = Math.max(radius + 0.5, baseHalo + hubOffset);
            const auraGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, haloRadius);
            auraGrad.addColorStop(0, `rgba(59, 130, 246, ${0.45 * activation})`);
            auraGrad.addColorStop(0.5, `rgba(37, 99, 235, ${0.2 * activation})`);
            auraGrad.addColorStop(1, 'rgba(2, 4, 10, 0)');

            ctx.beginPath();
            ctx.arc(nx, ny, haloRadius, 0, Math.PI * 2);
            ctx.fillStyle = auraGrad;
            ctx.fill();

            // Hub pulse ring
            if (node.isHub) {
              const ringRadius = Math.max(0.5, radius * (1.6 + (Math.sin(elapsed * 2.5 + node.id) * 0.3)));
              ctx.beginPath();
              ctx.arc(nx, ny, ringRadius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(147, 197, 253, ${0.5 * activation})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }

            // Active metallic core
            ctx.beginPath();
            ctx.arc(nx, ny, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * activation})`;
            ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0; // reset
          } else {
            // Dormant node (subtle graphite dot waiting for initialization)
            ctx.beginPath();
            ctx.arc(nx, ny, Math.max(0.2, radius * 0.75), 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.fill();
          }
        });

        ctx.restore();
      } catch (err) {
        console.warn('[BootNetworkGraph] render loop recovered from error:', err);
        ctx.restore();
      }
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[520px] h-[340px] sm:h-[380px] mx-auto flex items-center justify-center">
      {/* 2D Canvas for Centered Constellation Network & Pulses */}
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
