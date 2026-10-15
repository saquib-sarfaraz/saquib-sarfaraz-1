import { useEffect, useRef } from 'react';

// Maximum simultaneous active ripples to track on GPU
const MAX_RIPPLES = 28;

// Vertex Shader: Fullscreen quad
const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    // a_position is in [-1, 1], transform to [0, 1] for texture coordinates
    v_uv = (a_position + 1.0) * 0.5;
    // Flip Y so top is 0.0 and bottom is 1.0 (matching DOM coordinates)
    v_uv.y = 1.0 - v_uv.y;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment Shader: Physical water ripple wave simulation & Liquid Glass refraction
const FRAGMENT_SHADER_SOURCE = `
  precision highp float;

  varying vec2 v_uv;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform int u_count;

  // Packed ripple properties:
  // center: (x, y) in [0, 1]
  uniform vec2 u_centers[${MAX_RIPPLES}];
  // elapsedTime: current_time - spawn_time
  uniform float u_times[${MAX_RIPPLES}];
  // amplitude: disturbance magnitude
  uniform float u_amplitudes[${MAX_RIPPLES}];
  // type: 0.0 for cursor trail, 1.0 for stone drop
  uniform float u_types[${MAX_RIPPLES}];

  void main() {
    if (u_count == 0) {
      gl_FragColor = vec4(0.0);
      return;
    }

    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = vec2(v_uv.x * aspect, v_uv.y);

    // Sum surface normal perturbation gradient
    vec2 totalGrad = vec2(0.0);

    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      if (i >= u_count) break;

      float t = u_times[i];
      if (t <= 0.0) continue;

      float rType = u_types[i];
      float maxDur = (rType > 0.5) ? 2.5 : 1.1;
      if (t > maxDur) continue;

      vec2 c = vec2(u_centers[i].x * aspect, u_centers[i].y);
      vec2 diff = p - c;
      float r = length(diff);
      if (r < 0.0001) continue;

      vec2 dir = diff / r;
      float amp = u_amplitudes[i];

      if (rType > 0.5) {
        // === STONE DROP CLICK INTERACTION ===
        // Concentric harmonic wave packet expanding outward
        float speed = 0.38;
        float waveFront = speed * t;
        float dr = r - waveFront;

        // Packet spread expands as wave propagates
        float packetWidth = 0.065 + 0.04 * t;
        float env = exp(-(dr * dr) / (packetWidth * packetWidth));
        float decay = exp(-1.75 * t) * env;

        // Multi-frequency harmonic wave rings (dispersion)
        float k1 = 38.0;
        float k2 = 56.0;
        float profile = 0.72 * sin(k1 * dr - 2.5 * t) + 0.36 * sin(k2 * dr - 4.0 * t);
        float dProfile = 0.72 * k1 * cos(k1 * dr - 2.5 * t) + 0.36 * k2 * cos(k2 * dr - 4.0 * t);

        // Center rebound drop effect in early phase
        float centerDip = 0.0;
        float dDip = 0.0;
        if (t < 0.6) {
          float dipEnv = exp(-r * r / 0.003) * exp(-5.5 * t);
          centerDip = -0.04 * dipEnv * cos(14.0 * t);
          dDip = 2.0 * r / 0.003 * centerDip;
        }

        float dHeight = amp * 0.038 * decay * (dProfile - (2.0 * dr / (packetWidth * packetWidth)) * profile) + dDip;
        totalGrad += dir * dHeight;

      } else {
        // === CURSOR MOVEMENT TRAIL RIPPLE ===
        // Smooth, subtle fluid displacement along mouse path
        float speed = 0.44;
        float waveFront = speed * t;
        float dr = r - waveFront;

        float packetWidth = 0.04 + 0.02 * t;
        float decay = exp(-3.4 * t) * exp(-(dr * dr) / (packetWidth * packetWidth));

        float k = 46.0;
        float profile = sin(k * dr);
        float dProfile = k * cos(k * dr);

        float dHeight = amp * 0.016 * decay * (dProfile - (2.0 * dr / (packetWidth * packetWidth)) * profile);
        totalGrad += dir * dHeight;
      }
    }

    // Convert gradient into screen-space UV derivatives
    float dIdx = totalGrad.x * aspect;
    float dIdy = totalGrad.y;
    float disturbance = length(vec2(dIdx, dIdy));

    if (disturbance < 0.0003) {
      gl_FragColor = vec4(0.0);
      return;
    }

    // Compute surface normal (perturbed liquid glass surface)
    vec3 N = normalize(vec3(-dIdx, -dIdy, 0.42));

    // Studio rim lighting: directional light source from top-left
    vec3 L = normalize(vec3(-0.35, -0.65, 0.68));
    vec3 V = vec3(0.0, 0.0, 1.0);
    vec3 H = normalize(L + V);

    // Liquid Glass Specular Reflections
    float NdotH = max(dot(N, H), 0.0);
    float specSharp = pow(NdotH, 44.0);
    float specSoft = pow(NdotH, 12.0);

    // Fresnel refraction factor
    float NdotV = max(dot(N, V), 0.0);
    float fresnel = pow(1.0 - NdotV, 3.2);

    // Caustic intensity along wave crests
    float caustic = smoothstep(0.015, 0.09, disturbance) * 0.35;

    // Premium Liquid Glass Palette:
    // Pure silver/crystal highlight, graphite core, with a delicate hint of cyan
    vec3 silverHighlight = vec3(0.96, 0.98, 1.0);
    vec3 cyanGlint = vec3(0.18, 0.84, 0.96);
    vec3 graphiteTone = vec3(0.48, 0.54, 0.62);

    vec3 waterColor = mix(silverHighlight, cyanGlint, 0.25 * fresnel + 0.15 * specSharp);
    waterColor = mix(waterColor, graphiteTone, 0.12 * (1.0 - specSoft));
    waterColor += silverHighlight * (specSharp * 1.3);

    // Dynamic Alpha: completely transparent where water is calm,
    // elegantly lighting up at wave crests and specular glints
    float alpha = smoothstep(0.0006, 0.05, disturbance) * (specSharp * 1.5 + specSoft * 0.45 + fresnel * 0.75 + caustic);
    alpha = clamp(alpha, 0.0, 0.75);

    // Premultiplied alpha for seamless WebGL compositing
    gl_FragColor = vec4(waterColor * alpha, alpha);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn('HeroWaterRipple shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function HeroWaterRipple({ containerRef }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    gl: null,
    program: null,
    locations: null,
    animationFrameId: null,
    isVisible: true,
    ripples: [], // Array of { x, y, spawnTime, amplitude, type }
    lastMoveTime: 0,
    lastPos: { x: -1, y: -1 },
  });

  useEffect(() => {
    // 1. Accessibility & Hardware Capability checks
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isTouchOnly = window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(pointer: fine)').matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use parent hero stage container if provided, else fallback to canvas parent
    const heroContainer = containerRef?.current || canvas.parentElement;
    if (!heroContainer) return;

    // Initialize WebGL context with transparent framebuffer
    const gl = canvas.getContext('webgl', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      console.warn('HeroWaterRipple: WebGL not supported, water ripple cursor disabled.');
      return;
    }

    // Compile Shaders & Link Program
    const vertShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('HeroWaterRipple: Program linking failed:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Enable premultiplied alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // Setup full-screen quad geometry
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    const vertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Cache Uniform Locations
    const locations = {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      time: gl.getUniformLocation(program, 'u_time'),
      count: gl.getUniformLocation(program, 'u_count'),
      centers: gl.getUniformLocation(program, 'u_centers'),
      times: gl.getUniformLocation(program, 'u_times'),
      amplitudes: gl.getUniformLocation(program, 'u_amplitudes'),
      types: gl.getUniformLocation(program, 'u_types'),
    };

    stateRef.current.gl = gl;
    stateRef.current.program = program;
    stateRef.current.locations = locations;

    // Handle high-DPI sizing and viewport scaling
    const handleResize = () => {
      const rect = heroContainer.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(rect.width * dpr);
      const height = Math.floor(rect.height * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Performance Optimization: Pause rendering when Hero is outside viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          stateRef.current.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(heroContainer);

    // Helper: Add disturbance to state buffer
    const addRipple = (x, y, amplitude, type) => {
      const now = performance.now() * 0.001;
      const state = stateRef.current;
      
      // Clean expired ripples before adding
      state.ripples = state.ripples.filter((r) => {
        const dur = r.type > 0.5 ? 2.5 : 1.1;
        return now - r.spawnTime < dur;
      });

      // Keep within max budget
      if (state.ripples.length >= MAX_RIPPLES) {
        state.ripples.shift();
      }

      state.ripples.push({
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
        spawnTime: now,
        amplitude: Math.min(amplitude, 2.5),
        type: type, // 0.0 = cursor trail, 1.0 = stone drop
      });
    };

    // --- CURSOR MOVEMENT HANDLER ---
    const handlePointerMove = (e) => {
      // Touch-only devices do not emit continuous cursor trails
      if (e.pointerType === 'touch' || isTouchOnly) return;

      const rect = heroContainer.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return;
      }

      const normX = (clientX - rect.left) / rect.width;
      const normY = (clientY - rect.top) / rect.height;

      const now = performance.now();
      const state = stateRef.current;
      const dt = now - state.lastMoveTime;

      // Throttle: minimum interval between movement ripples (38ms ~= ~26 updates/sec)
      if (dt < 38) return;

      if (state.lastPos.x >= 0) {
        const dx = (normX - state.lastPos.x) * rect.width;
        const dy = (normY - state.lastPos.y) * rect.height;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Filter out micro-jitter (movement must exceed 8 pixels)
        if (dist > 8) {
          // Velocity-sensitive amplitude: faster movements create slightly more defined ripples
          const velocity = dist / Math.max(dt, 1);
          const amp = Math.min(Math.max(velocity * 0.45, 0.4), 1.25);

          // Fast movement interpolation: emit intermediate disturbance to maintain organic continuous wave path
          if (dist > 45) {
            const midX = (state.lastPos.x + normX) * 0.5;
            const midY = (state.lastPos.y + normY) * 0.5;
            addRipple(midX, midY, amp * 0.75, 0.0);
          }

          addRipple(normX, normY, amp, 0.0);
          state.lastPos = { x: normX, y: normY };
          state.lastMoveTime = now;
        }
      } else {
        state.lastPos = { x: normX, y: normY };
        state.lastMoveTime = now;
      }
    };

    // --- CLICK INTERACTION: STONE DROPPED IN WATER ---
    const handlePointerDown = (e) => {
      const rect = heroContainer.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        return;
      }

      const normX = (clientX - rect.left) / rect.width;
      const normY = (clientY - rect.top) / rect.height;

      // Primary stone drop wave
      addRipple(normX, normY, 1.9, 1.0);

      // Subtle paired secondary ring offset by 45ms for organic water impact realism
      setTimeout(() => {
        addRipple(normX, normY, 1.1, 1.0);
      }, 45);
    };

    // Attach listeners with passive: true so scrolling is 100% unimpeded
    heroContainer.addEventListener('pointermove', handlePointerMove, { passive: true });
    heroContainer.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // --- ANIMATION / RENDER LOOP ---
    const centersArr = new Float32Array(MAX_RIPPLES * 2);
    const timesArr = new Float32Array(MAX_RIPPLES);
    const amplitudesArr = new Float32Array(MAX_RIPPLES);
    const typesArr = new Float32Array(MAX_RIPPLES);

    const render = () => {
      stateRef.current.animationFrameId = requestAnimationFrame(render);

      // Skip render if not in viewport or tab is inactive
      if (!stateRef.current.isVisible || document.hidden) return;

      const now = performance.now() * 0.001;
      const state = stateRef.current;

      // Filter expired ripples
      state.ripples = state.ripples.filter((r) => {
        const dur = r.type > 0.5 ? 2.5 : 1.1;
        return now - r.spawnTime < dur;
      });

      const count = state.ripples.length;

      // Clear transparent framebuffer
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (count === 0) return;

      gl.useProgram(program);

      // Populate flat uniform arrays
      for (let i = 0; i < count; i++) {
        const r = state.ripples[i];
        centersArr[i * 2] = r.x;
        centersArr[i * 2 + 1] = r.y;
        timesArr[i] = now - r.spawnTime;
        amplitudesArr[i] = r.amplitude;
        typesArr[i] = r.type;
      }

      gl.uniform2f(locations.resolution, canvas.width, canvas.height);
      gl.uniform1f(locations.time, now);
      gl.uniform1i(locations.count, count);

      gl.uniform2fv(locations.centers, centersArr);
      gl.uniform1fv(locations.times, timesArr);
      gl.uniform1fv(locations.amplitudes, amplitudesArr);
      gl.uniform1fv(locations.types, typesArr);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    stateRef.current.animationFrameId = requestAnimationFrame(render);

    // --- CLEANUP ---
    return () => {
      if (stateRef.current.animationFrameId) {
        cancelAnimationFrame(stateRef.current.animationFrameId);
      }
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      heroContainer.removeEventListener('pointermove', handlePointerMove);
      heroContainer.removeEventListener('pointerdown', handlePointerDown);

      if (gl) {
        gl.deleteBuffer(quadBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
      }
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
      style={{ touchAction: 'pan-y' }}
    />
  );
}
