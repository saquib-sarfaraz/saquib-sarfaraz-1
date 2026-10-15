import React, { useEffect, useRef, useState } from 'react';
import { LiquidGlass } from '@ybouane/liquidglass';

/**
 * Checks whether WebGL is supported and available in the current browser.
 */
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * LiquidGlassContainer:
 * Manages the WebGL Liquid Glass root container, scanning for direct child elements
 * with [data-glass="true"], injecting WebGL refraction and lighting shaders,
 * and performing complete cleanup on unmount.
 */
export default function LiquidGlassContainer({
  children,
  className = '',
  style = {},
  defaultConfig = {
    blurAmount: 0.18,
    refraction: 0.55,
    chromAberration: 0.05,
    edgeHighlight: 0.2,
    specular: 0.15,
    fresnel: 1.1,
    cornerRadius: 32,
    zRadius: 20,
    shadowOpacity: 0.25,
    shadowSpread: 18,
    shadowOffsetY: 4,
  },
  onReady = null,
}) {
  const rootRef = useRef(null);
  const instanceRef = useRef(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Check WebGL availability
    if (!isWebGLAvailable()) {
      setWebGLSupported(false);
      return;
    }

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) {
      setWebGLSupported(false);
      return;
    }

    const currentRoot = rootRef.current;
    if (!currentRoot) return;

    let isMounted = true;
    let localInstance = null;

    // Small delay to ensure child DOM elements are rendered and layout is computed
    const timer = setTimeout(async () => {
      try {
        if (!isMounted || !currentRoot) return;

        // Query all glass elements inside or direct children
        const glassElements = Array.from(
          currentRoot.querySelectorAll('[data-glass="true"]')
        );

        if (glassElements.length === 0) return;

        // Initialize LiquidGlass
        localInstance = await LiquidGlass.init({
          root: currentRoot,
          glassElements,
          defaults: defaultConfig,
        });

        if (!isMounted) {
          localInstance.destroy();
          localInstance = null;
        } else {
          instanceRef.current = localInstance;
          if (onReady) onReady(localInstance);
        }
      } catch (err) {
        console.warn('LiquidGlass WebGL initialization fallback:', err);
        setWebGLSupported(false);
      }
    }, 60);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (instanceRef.current) {
        try {
          instanceRef.current.destroy();
        } catch (e) {
          // ignore cleanup errors
        }
        instanceRef.current = null;
      }
      if (localInstance) {
        try {
          localInstance.destroy();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, [defaultConfig, onReady]);

  return (
    <div
      ref={rootRef}
      className={`relative ${webGLSupported ? 'liquidglass-active' : 'liquidglass-fallback'} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
