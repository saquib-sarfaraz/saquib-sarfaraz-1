import { useCallback, useEffect, useRef, useState } from 'react'
import ErrorFallback from '../components/ErrorFallback'
import Loader from '../components/Loader'
import { useReveal } from '../hooks/useReveal'

const GAME_URL = 'https://xyxo.vercel.app/'

function useInViewOnce({ threshold = 0.15, rootMargin = '200px' } = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (isInView) return
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setIsInView(true)
        observer.disconnect()
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [isInView, threshold, rootMargin])

  return { ref, isInView }
}

export default function GameZone() {
  const titleRevealRef = useReveal()
  const subtitleRevealRef = useReveal()
  const containerRevealRef = useReveal()

  const { ref: inViewRef, isInView } = useInViewOnce()

  const iframeRef = useRef(null)
  const loadTimeoutId = useRef(null)

  const [iframeKey, setIframeKey] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [actionMessage, setActionMessage] = useState('')

  const clearLoadTimeout = useCallback(() => {
    if (!loadTimeoutId.current) return
    window.clearTimeout(loadTimeoutId.current)
    loadTimeoutId.current = null
  }, [])

  useEffect(() => {
    if (!isInView) return

    const updateState = () => {
      setActionMessage('')
      setHasError(false)
      setIsLoading(true)
    }

    requestAnimationFrame(updateState)
    clearLoadTimeout()

    loadTimeoutId.current = window.setTimeout(() => {
      requestAnimationFrame(() => {
        setHasError(true)
        setIsLoading(false)
      })
    }, 15000)

    return () => clearLoadTimeout()
  }, [isInView, iframeKey, clearLoadTimeout])

  const handleIframeLoad = useCallback(() => {
    clearLoadTimeout()
    setHasError(false)
    setIsLoading(false)
  }, [clearLoadTimeout])

  const handleIframeError = useCallback(() => {
    clearLoadTimeout()
    setHasError(true)
    setIsLoading(false)
  }, [clearLoadTimeout])

  const handleReload = useCallback(() => {
    setIframeKey((k) => k + 1)
  }, [])

  const handleOpenFullscreen = useCallback(async () => {
    setActionMessage('')
    const iframe = iframeRef.current

    try {
      if (!iframe?.requestFullscreen) {
        setActionMessage('Fullscreen is not supported in this browser.')
        return
      }
      await iframe.requestFullscreen()
    } catch {
      setActionMessage('Fullscreen request was blocked by the browser.')
    }
  }, [])

  return (
    <section id="game" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2
          ref={titleRevealRef}
          className="font-display text-3xl md:text-4xl font-bold mb-3 text-center reveal"
        >
          Game <span className="bg-gradient-to-r from-white via-[#C6CBD6] to-[#747B8B] bg-clip-text text-transparent">Zone</span>
        </h2>
        <p
          ref={subtitleRevealRef}
          className="text-gray-400 text-center mb-10 reveal"
        >
          Play directly inside my portfolio
        </p>

        <div
          ref={(node) => {
            containerRevealRef.current = node
            inViewRef.current = node
          }}
          className="glass-panel apple-glass-edge rounded-[32px] relative overflow-hidden transition-all reveal"
        >
          <div className="apple-specular-glare" />

          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between border-b border-white/10 relative z-10">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                Featured Playground
              </div>
              <div className="text-white font-display text-2xl font-bold">
                XYXO
              </div>
              <div className="text-gray-400 text-sm mt-1">
                Real-time multiplayer Tic-Tac-Toe (socket-based)
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={GAME_URL}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full apple-glass-btn !bg-white/95 !text-black hover:!bg-white font-bold transition-all text-center cursor-pointer shadow-md"
              >
                Open Full Page
              </a>
              <button
                type="button"
                onClick={handleOpenFullscreen}
                className="px-6 py-3 rounded-full apple-glass-btn text-[#F5F6FA] font-semibold transition-all cursor-pointer"
              >
                Open Fullscreen
              </button>
              <button
                type="button"
                onClick={handleReload}
                className="px-6 py-3 rounded-full apple-glass-btn text-gray-200 transition-all cursor-pointer"
              >
                Reload Game
              </button>
            </div>
          </div>

          {actionMessage ? (
            <div className="px-6 md:px-8 py-4 text-sm text-gray-400 border-b border-white/5">
              {actionMessage}
            </div>
          ) : null}

          <div className="relative w-full h-[600px] md:h-[700px] bg-void/30">
            {hasError ? (
              <ErrorFallback
                title="Embed blocked"
                message="Some browsers block embedding due to security headers (X-Frame-Options / CSP). Use the button below to play it in a new tab."
                openUrl={GAME_URL}
                onRetry={handleReload}
              />
            ) : null}

            {!hasError && isInView ? (
              <iframe
                key={iframeKey}
                ref={iframeRef}
                title="XYXO Game"
                src={GAME_URL}
                className="w-full h-full"
                loading="lazy"
                allow="fullscreen"
                allowFullScreen
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            ) : null}

            {isLoading && !hasError ? (
              <div className="absolute inset-0 bg-void/80 backdrop-blur-xl flex items-center justify-center">
                <Loader label="Loading game…" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

