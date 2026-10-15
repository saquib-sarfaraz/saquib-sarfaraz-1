import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

/**
 * SAQUIB OS 3D Cinematic Boot Animation (100% Code-Generated)
 * 
 * Creative Direction:
 * - Pure Black (#000000), Graphite (#17191B), Metallic Silver (#BFC3C7), White (#F5F5F5)
 * - Obsidian reflective floor plane with physically based reflections
 * - Geometric assembling 3D emblem with brushed titanium fragments
 * - Volumetric lighting sweeps, procedural brushed metal textures, and particle dust
 * - Dimensional SAQUIB OS typography with specular contour light travel
 * - Luminous precision progress line & SYSTEM READY status
 * - Complete Three.js GPU resource disposal on exit (0 continuous overhead)
 */
export default function BootScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [timelinePhase, setTimelinePhase] = useState('power-on'); // power-on | assembling | identity | ready

  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const hasFinishedRef = useRef(false);
  const fallbackTimerRef = useRef(null);

  // Conclude boot sequence and transition smoothly to homepage
  const triggerExit = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;

    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
    }

    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch {
        // Safe ignore
      }
    }

    setIsVisible(false);

    // Call onComplete after exit transition concludes
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 650);
  }, [onComplete]);

  // Scroll locking: prevent page scroll behind the boot overlay
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    if (window.lenis) {
      window.lenis.stop();
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow || '';
      document.documentElement.style.overflow = originalHtmlOverflow || '';
      if (window.lenis) {
        window.lenis.start();
      }
    };
  }, []);

  // Audio initialization (single synchronized audio source with autoplay fallback)
  useEffect(() => {
    const audio = new Audio('/boot-sound.mp3');
    audio.volume = 0.85;
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay with sound restricted by browser; will play on user interaction if clicked
      });
    }

    const handleUserInteraction = () => {
      if (audioRef.current && audioRef.current.paused && !hasFinishedRef.current) {
        audioRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('pointerdown', handleUserInteraction, { once: true });
    window.addEventListener('keydown', handleUserInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Three.js 3D Procedural Scene Setup & Animation Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        triggerExit();
      }, 350);
      return () => clearTimeout(timer);
    }

    // Safety fallback timeout to guarantee website access
    fallbackTimerRef.current = setTimeout(() => {
      triggerExit();
    }, 5500);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.08);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 7.2);
    camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 3. Procedural Brushed Titanium Texture Generator (Canvas in memory)
    const createBrushedMetalTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#909498';
      ctx.fillRect(0, 0, 256, 256);
      for (let y = 0; y < 256; y++) {
        const val = 144 + (Math.random() - 0.5) * 55;
        ctx.fillStyle = `rgb(${val},${val},${val})`;
        ctx.fillRect(0, y, 256, 1);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      return texture;
    };

    const brushedTexture = createBrushedMetalTexture();

    // 4. Procedural Environment Map (Studio Lighting highlights)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envScene = new THREE.Scene();
    const envLight1 = new THREE.DirectionalLight(0xffffff, 4.0);
    envLight1.position.set(1.5, 3.0, 1.5);
    envScene.add(envLight1);
    const envLight2 = new THREE.DirectionalLight(0x70757a, 2.0);
    envLight2.position.set(-2.0, -1.5, -1.0);
    envScene.add(envLight2);
    const envLight3 = new THREE.DirectionalLight(0xcfd3d6, 2.5);
    envLight3.position.set(0, 1.0, 3.0);
    envScene.add(envLight3);
    const envMap = pmremGenerator.fromScene(envScene).texture;
    scene.environment = envMap;

    // 5. Materials
    const titaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8cccf,
      metalness: 0.96,
      roughness: 0.16,
      roughnessMap: brushedTexture,
      envMapIntensity: 1.8,
    });

    const darkTitaniumMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3d42,
      metalness: 0.94,
      roughness: 0.22,
      roughnessMap: brushedTexture,
      envMapIntensity: 1.4,
    });

    const obsidianFloorMaterial = new THREE.MeshStandardMaterial({
      color: 0x050608,
      metalness: 0.88,
      roughness: 0.12,
      envMapIntensity: 1.2,
    });

    // 6. Obsidian Ground Plane (Reflective Dark Floor)
    const floorGeo = new THREE.PlaneGeometry(50, 50);
    const floorMesh = new THREE.Mesh(floorGeo, obsidianFloorMaterial);
    floorMesh.position.y = -1.75;
    floorMesh.rotation.x = -Math.PI / 2;
    scene.add(floorMesh);

    // 7. Lighting Infrastructure
    const ambientLight = new THREE.AmbientLight(0x101216, 0.45);
    scene.add(ambientLight);

    // Spark light in center (Powers on immediately 0.0–0.5s)
    const sparkLight = new THREE.PointLight(0xffffff, 0, 16, 2);
    sparkLight.position.set(0, 0, 0.3);
    scene.add(sparkLight);

    // Moving light beam that travels across scene
    const sweepLight = new THREE.SpotLight(0xf2f4f7, 0, 35, Math.PI / 5, 0.5, 1.5);
    sweepLight.position.set(-6, 3, 4);
    sweepLight.target.position.set(0, 0, 0);
    scene.add(sweepLight);
    scene.add(sweepLight.target);

    // Key rim light for sharp metallic bevel highlights
    const rimLight = new THREE.DirectionalLight(0xffffff, 0);
    rimLight.position.set(0, 5, -2);
    scene.add(rimLight);

    // 8. Power-On Laser Light Streak (0.0s–0.6s)
    const streakCanvas = document.createElement('canvas');
    streakCanvas.width = 512;
    streakCanvas.height = 64;
    const sCtx = streakCanvas.getContext('2d');
    const sGrad = sCtx.createRadialGradient(256, 32, 0, 256, 32, 256);
    sGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sGrad.addColorStop(0.15, 'rgba(210, 215, 220, 0.85)');
    sGrad.addColorStop(0.5, 'rgba(140, 145, 150, 0.3)');
    sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 512, 64);
    const streakTexture = new THREE.CanvasTexture(streakCanvas);

    const streakMaterial = new THREE.MeshBasicMaterial({
      map: streakTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0,
      depthWrite: false,
    });
    const streakGeo = new THREE.PlaneGeometry(1, 1);
    const streakMesh = new THREE.Mesh(streakGeo, streakMaterial);
    streakMesh.position.set(0, 0, 0.1);
    scene.add(streakMesh);

    // 9. Assembling 3D Emblem Group
    const emblemGroup = new THREE.Group();
    scene.add(emblemGroup);

    // Central Core: Dual Beveled Octahedral Crystal
    const coreGeo = new THREE.OctahedronGeometry(0.85, 0);
    const coreMesh = new THREE.Mesh(coreGeo, titaniumMaterial);
    coreMesh.scale.set(1, 1.15, 0.65);
    emblemGroup.add(coreMesh);

    // Interlocking Precision Titanium Rings
    const ring1Geo = new THREE.TorusGeometry(1.35, 0.035, 16, 64);
    const ring1Mesh = new THREE.Mesh(ring1Geo, darkTitaniumMaterial);
    ring1Mesh.rotation.x = Math.PI / 4;
    emblemGroup.add(ring1Mesh);

    const ring2Geo = new THREE.TorusGeometry(1.6, 0.03, 16, 64);
    const ring2Mesh = new THREE.Mesh(ring2Geo, titaniumMaterial);
    ring2Mesh.rotation.y = Math.PI / 3;
    ring2Mesh.rotation.z = Math.PI / 6;
    emblemGroup.add(ring2Mesh);

    // 6 Precision Geometric Chevron / Prism Fragments that Assemble in Space
    const fragments = [];
    const fragmentCount = 6;
    const fragmentGeo = new THREE.ConeGeometry(0.38, 0.75, 4);

    for (let i = 0; i < fragmentCount; i++) {
      const angle = (i / fragmentCount) * Math.PI * 2;
      const targetRadius = 1.35;
      const targetPos = new THREE.Vector3(
        Math.cos(angle) * targetRadius,
        Math.sin(angle) * targetRadius,
        0
      );
      const targetRot = new THREE.Euler(
        0,
        0,
        angle - Math.PI / 2
      );

      // Dispersed origin in 3D space
      const startRadius = 4.2 + (i % 2) * 1.5;
      const startPos = new THREE.Vector3(
        Math.cos(angle + 0.6) * startRadius,
        Math.sin(angle + 0.6) * startRadius,
        (Math.random() - 0.5) * 3.5
      );
      const startRot = new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );

      const fMesh = new THREE.Mesh(
        fragmentGeo,
        i % 2 === 0 ? titaniumMaterial : darkTitaniumMaterial
      );
      fMesh.scale.set(0.6, 1.0, 0.4);
      fMesh.position.copy(startPos);
      fMesh.rotation.copy(startRot);
      fMesh.visible = false;

      emblemGroup.add(fMesh);
      fragments.push({
        mesh: fMesh,
        startPos,
        startRot,
        targetPos,
        targetRot,
      });
    }

    // 10. Floating Micro-Particle Dust Field (120 points)
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xbfc3c7,
      size: 0.038,
      transparent: true,
      opacity: 0.35,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // 11. Animation Timing & State
    const startTime = performance.now();
    let isExiting = false;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const now = performance.now();
      const elapsed = (now - startTime) / 1000; // in seconds

      // ── PHASE 1: 0.0s – 0.5s (Power On) ───────────────────────────
      if (elapsed < 0.5) {
        setTimelinePhase('power-on');
        // Point light spark
        if (elapsed < 0.2) {
          const t = elapsed / 0.2;
          sparkLight.intensity = t * 14.0;
          streakMaterial.opacity = t;
          streakMesh.scale.set(t * 14.0, 0.05, 1);
        } else {
          const t = (elapsed - 0.2) / 0.3;
          sparkLight.intensity = 14.0 - t * 10.0;
          streakMaterial.opacity = 1.0 - t;
          streakMesh.scale.set(14.0 + t * 4.0, 0.05 + t * 0.08, 1);
        }
      } else {
        streakMaterial.opacity = 0;
      }

      // ── PHASE 2: 0.5s – 1.5s (Core Awakening) ──────────────────────
      if (elapsed >= 0.5 && elapsed < 1.5) {
        setTimelinePhase('awakening');
        const t = (elapsed - 0.5) / 1.0;
        // Sweep light travels across
        sweepLight.intensity = Math.sin(t * Math.PI) * 22.0;
        sweepLight.position.x = -6 + t * 12;
        sweepLight.position.y = 2.5 + Math.sin(t * Math.PI) * 1.5;
        rimLight.intensity = t * 1.8;

        // Camera gentle push-in
        camera.position.z = 7.2 - t * 0.8;
      }

      // ── PHASE 3: 1.5s – 2.7s (System Assembly) ────────────────────
      if (elapsed >= 1.5 && elapsed < 2.7) {
        setTimelinePhase('assembling');
        const t = (elapsed - 1.5) / 1.2;
        // Cubic ease out
        const ease = 1 - Math.pow(1 - t, 3);

        fragments.forEach((f) => {
          f.mesh.visible = true;
          f.mesh.position.lerpVectors(f.startPos, f.targetPos, ease);
          f.mesh.rotation.x = THREE.MathUtils.lerp(f.startRot.x, f.targetRot.x, ease);
          f.mesh.rotation.y = THREE.MathUtils.lerp(f.startRot.y, f.targetRot.y, ease);
          f.mesh.rotation.z = THREE.MathUtils.lerp(f.startRot.z, f.targetRot.z, ease);
        });

        // Emblem rotation accelerates into lock
        emblemGroup.rotation.y = (1.0 - ease) * 1.8 + elapsed * 0.25;
        emblemGroup.rotation.x = Math.sin(elapsed * 1.5) * 0.08;

        rimLight.intensity = 1.8 + Math.sin(t * Math.PI) * 1.5;
        camera.position.z = 6.4 - t * 0.8;
      } else if (elapsed >= 2.7) {
        // Locked assembled state
        fragments.forEach((f) => {
          f.mesh.visible = true;
          f.mesh.position.copy(f.targetPos);
          f.mesh.rotation.copy(f.targetRot);
        });
      }

      // ── PHASE 4: 2.7s – 3.8s (Identity Reveal) ────────────────────
      if (elapsed >= 2.7 && elapsed < 3.8) {
        setTimelinePhase('identity');
        const t = (elapsed - 2.7) / 1.1;

        // Stable slow emblem rotation
        emblemGroup.rotation.y = elapsed * 0.2;
        emblemGroup.rotation.x = Math.sin(elapsed * 0.8) * 0.04;
        camera.position.z = 5.6 - t * 0.2;

        sweepLight.intensity = 8.0 + Math.sin(t * Math.PI) * 12.0;
        sweepLight.position.x = -4 + t * 8;
      }

      // ── PHASE 5: 3.8s – 4.5s (System Ready & Light Pulse) ─────────
      if (elapsed >= 3.8 && elapsed < 4.5) {
        setTimelinePhase('ready');
        emblemGroup.rotation.y = elapsed * 0.15;

        // Subtle specular pulse at 4.1s
        if (elapsed > 4.1 && elapsed < 4.4) {
          const p = (elapsed - 4.1) / 0.3;
          sparkLight.intensity = Math.sin(p * Math.PI) * 6.0;
          coreMesh.scale.set(1 + Math.sin(p * Math.PI) * 0.06, 1.15 + Math.sin(p * Math.PI) * 0.06, 0.65);
        } else {
          sparkLight.intensity = 1.0;
          coreMesh.scale.set(1, 1.15, 0.65);
        }
      }

      // ── PHASE 6: 4.5s+ (Enter Portfolio) ──────────────────────────
      if (elapsed >= 4.5 && !isExiting) {
        isExiting = true;
        triggerExit();
      }

      // Micro-particle gentle drift
      particlePoints.rotation.y = elapsed * 0.025;

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup & GPU resource disposal
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }

      // Dispose Three.js objects to leave 0 GPU footprint
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      if (brushedTexture) brushedTexture.dispose();
      if (streakTexture) streakTexture.dispose();
      if (envMap) envMap.dispose();
      pmremGenerator.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [triggerExit]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="saquib-os-3d-boot"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: 'blur(16px)',
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[99999] w-full h-[100dvh] bg-black overflow-hidden select-none pointer-events-auto flex flex-col items-center justify-center"
          style={{ willChange: 'opacity, transform, filter' }}
        >
          {/* Three.js 3D WebGL Canvas Viewport */}
          <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          {/* Ambient Volumetric Radial Glow on Floor */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#000000_88%)] pointer-events-none z-[1]" />

          {/* Dimensional SAQUIB OS Typography & System Ready Indicator (2.7s+) */}
          <div className="relative z-10 flex flex-col items-center justify-center mt-36 sm:mt-44 pointer-events-none">
            {/* Title: SAQUIB OS (Dimensional Brushed Titanium with Travelling Specular Sheen) */}
            <motion.div
              initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
              animate={
                timelinePhase === 'identity' || timelinePhase === 'ready'
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: 12, filter: 'blur(8px)' }
              }
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden text-center select-none"
            >
              <h1 className="text-3xl sm:text-5xl font-black tracking-[0.28em] uppercase font-sans drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] bg-gradient-to-b from-white via-[#BFC3C7] to-[#60656B] bg-clip-text text-transparent">
                SAQUIB OS
              </h1>

              {/* Dynamic Travelling Specular Highlight (2.7s–3.8s) */}
              <motion.div
                initial={{ x: '-120%' }}
                animate={
                  timelinePhase === 'identity' || timelinePhase === 'ready'
                    ? { x: '220%' }
                    : { x: '-120%' }
                }
                transition={{ duration: 1.1, ease: 'easeInOut', delay: 0.15 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] pointer-events-none"
              />
            </motion.div>

            {/* Precision Luminous Progress Line (3.8s–4.5s) */}
            <div className="w-48 sm:w-60 h-[1.5px] bg-[#17191B] mt-4 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: '0%' }}
                animate={
                  timelinePhase === 'ready'
                    ? { width: '100%' }
                    : timelinePhase === 'identity'
                    ? { width: '45%' }
                    : { width: '0%' }
                }
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-transparent via-[#F5F5F5] to-[#BFC3C7] shadow-[0_0_12px_rgba(255,255,255,0.9)]"
              />
            </div>

            {/* Status: SYSTEM READY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={
                timelinePhase === 'ready'
                  ? { opacity: 1 }
                  : { opacity: 0 }
              }
              transition={{ duration: 0.4 }}
              className="mt-2.5 text-[10px] font-mono tracking-[0.35em] text-[#BFC3C7] font-semibold uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            >
              SYSTEM READY
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
