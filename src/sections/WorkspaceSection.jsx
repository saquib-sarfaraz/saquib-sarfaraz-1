import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  GitBranch, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  Copy, 
  Check, 
  RefreshCw, 
  FileCode2,
  TerminalSquare,
  Layers
} from 'lucide-react';
import { profileData } from '../content/profile';

export default function WorkspaceSection() {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'success', text: 'Saquib OS Kernel v2.6 • Developer.tsx mounted cleanly' }
  ]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 5;
      const y = (e.clientY / innerHeight - 0.5) * -5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const developerCode = `import { Developer } from '@saquib/core';

export const saquib: Developer = {
  name: "${profileData.name}",
  role: "Full Stack Developer",
  education: "B.Tech CSE • Jamia Hamdard",
  stack: ["React 19", "Node.js", "MongoDB", "TypeScript", "Python", "Socket.io", "Next.js"],
  status: "${profileData.status}"
};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(developerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    if (!showTerminal) setShowTerminal(true);
    
    setTerminalLogs((prev) => [
      ...prev,
      { type: 'process', text: `> Executing Developer.tsx...` }
    ]);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        { type: 'success', text: '✔ Transpiled AST (0 errors, 18ms latency)' }
      ]);
      setIsRunning(false);
    }, 700);
  };

  return (
    <section id="workspace" className="relative py-6 sm:py-10 px-3 sm:px-6 bg-[#080A12] text-left overflow-hidden border-t border-[#171A25] flex flex-col justify-center min-h-0">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[220px] bg-white/[0.03] blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-3xl mx-auto space-y-4 relative z-10 w-full">
        
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-1"
        >
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#171A25]/80 border border-[#414655] text-[#C6CBD6] text-[10px] font-mono uppercase tracking-wider backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            <Sparkles className="w-3 h-3 text-white" />
            <span>Featured Module</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            Saquib OS — <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">Developer.tsx</span>
          </h2>
        </motion.div>

        {/* COMPACT SPOTLIGHT IDE CARD */}
        <motion.div
          style={{ rotateY: mousePos.x, rotateX: mousePos.y }}
          transition={{ type: 'spring', stiffness: 90, damping: 22 }}
          className="rounded-xl sm:rounded-2xl apple-glass-pill apple-glass-edge shadow-[0_25px_65px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-3 sm:p-4 space-y-2.5 font-mono text-xs relative overflow-hidden"
        >
          <div className="apple-specular-glare" />

          {/* IDE Window Bar */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 relative z-10">
            
            {/* Dots & Breadcrumb */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-500 shadow-sm" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-sm" />
              </div>
              <div className="h-3 w-[1px] bg-white/20 mx-0.5 shrink-0" />
              <div className="flex items-center gap-1 text-slate-200 text-xs font-bold truncate">
                <FileCode2 className="w-3.5 h-3.5 text-white/90 shrink-0" />
                <span className="truncate">Developer.tsx</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-2.5 py-1 rounded-full apple-glass-btn text-[#F5F6FA] hover:text-white transition-all font-mono text-[10px] font-semibold flex items-center gap-1 active:scale-95 disabled:opacity-50"
              >
                {isRunning ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-white" />
                ) : (
                  <Play className="w-3 h-3 fill-white text-white" />
                )}
                <span>{isRunning ? 'Running...' : 'Run'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-full apple-glass-btn text-slate-300 hover:text-white transition-all text-[10px]"
                title="Copy Code"
              >
                {copied ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
              </button>

              <button
                onClick={() => setShowTerminal(!showTerminal)}
                className={`p-1.5 rounded-full border transition-all text-[10px] ${
                  showTerminal 
                    ? 'optical-active-pill text-white' 
                    : 'apple-glass-btn text-slate-300 hover:text-white'
                }`}
                title="Toggle Console"
              >
                <TerminalSquare className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Ultra Compact Code Body */}
          <div className="p-2.5 sm:p-3 rounded-lg glass-nested-child leading-snug overflow-x-auto text-[11px] font-mono flex gap-2.5 select-text relative z-10">
            {/* Line Numbers */}
            <div className="select-none text-slate-500 text-right font-mono pr-2 border-r border-[#222633] shrink-0">
              {developerCode.split('\n').map((_, i) => (
                <div key={i} className="text-[10px]">{String(i + 1).padStart(2, '0')}</div>
              ))}
            </div>

            {/* Syntax Highlighted Code */}
            <pre className="text-slate-200 font-mono space-y-0.5 overflow-x-auto">
              <code>
                <div><span className="text-slate-400">import</span> &#123; <span className="text-white font-medium">Developer</span> &#125; <span className="text-slate-400">from</span> <span className="text-slate-300">'@saquib/core'</span>;</div>
                <div>&nbsp;</div>
                <div><span className="text-slate-400">export const</span> <span className="text-white font-medium">saquib</span>: <span className="text-slate-300">Developer</span> = &#123;</div>
                <div>&nbsp;&nbsp;<span className="text-slate-400">name:</span> <span className="text-slate-200">"{profileData.name}"</span>,</div>
                <div>&nbsp;&nbsp;<span className="text-slate-400">role:</span> <span className="text-slate-200">"Full Stack Developer"</span>,</div>
                <div>&nbsp;&nbsp;<span className="text-slate-400">education:</span> <span className="text-slate-200">"B.Tech CSE • Jamia Hamdard"</span>,</div>
                <div>&nbsp;&nbsp;<span className="text-slate-400">stack:</span> [<span className="text-slate-200">"React 19"</span>, <span className="text-slate-200">"Node.js"</span>, <span className="text-slate-200">"MongoDB"</span>, <span className="text-slate-200">"TypeScript"</span>, <span className="text-slate-200">"Python"</span>, <span className="text-slate-200">"Socket.io"</span>, <span className="text-slate-200">"Next.js"</span>],</div>
                <div>&nbsp;&nbsp;<span className="text-slate-400">status:</span> <span className="text-white">"{profileData.status}"</span></div>
                <div>&#125;;</div>
              </code>
            </pre>
          </div>

          {/* Compact Console Output Drawer */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="rounded-lg bg-[#10131D] border border-[#222633] p-2 space-y-1 text-[10px] font-mono overflow-hidden"
              >
                <div className="flex items-center justify-between text-slate-400 border-b border-[#222633] pb-1">
                  <span className="flex items-center gap-1 text-slate-200 font-bold">
                    <Terminal className="w-3 h-3 text-white" /> Console Logs
                  </span>
                  <button 
                    onClick={() => setTerminalLogs([])}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    clear
                  </button>
                </div>
                <div className="space-y-0.5 max-h-16 overflow-y-auto">
                  {terminalLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-1">
                      <span className="text-slate-600 select-none">$</span>
                      <span className={log.type === 'success' ? 'text-white font-bold' : 'text-slate-300'}>
                        {log.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Tech Strip */}
          <div className="pt-2 border-t border-[#222633] flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono">
            <div className="flex items-center gap-1.5 text-slate-400 overflow-x-auto py-0.5">
              <Layers className="w-3 h-3 text-white/80 shrink-0" />
              <span className="font-bold text-slate-300 shrink-0">Stack:</span>
              <div className="flex items-center gap-1 shrink-0">
                {['React 19', 'Node.js', 'MongoDB', 'TypeScript', 'Socket.io'].map((tech) => (
                  <span key={tech} className="px-1.5 py-0.2 rounded bg-[#171A25] text-slate-200 text-[9px] border border-[#414655]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 shrink-0">
              <span className="flex items-center gap-1 text-white font-bold text-[9px]">
                <CheckCircle2 className="w-3 h-3 text-white" /> Online
              </span>
              <span className="flex items-center gap-1 text-slate-300 font-semibold text-[9px]">
                <GitBranch className="w-2.5 h-2.5 text-slate-400" /> main*
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
