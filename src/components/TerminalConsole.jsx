import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';
import { profileData } from '../content/profile';

export default function TerminalConsole() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: `${profileData.osName} Shell ${profileData.osVersion}. Type "help", "whoami", or "sudo hire saquib".` }
  ]);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: 'user', content: `$ ${input}` }];

    switch (cmd) {
      case 'sudo hire saquib':
        newHistory.push({
          type: 'response',
          content: `[ACCESS GRANTED] Loading candidate profile...\n\n` +
                   `Status: ${profileData.recruiterInfo.status}\n` +
                   `Preferred Roles: ${profileData.recruiterInfo.preferredRoles.join(', ')}\n` +
                   `Response Time: ${profileData.recruiterInfo.responseTime}\n` +
                   `Resume PDF: ${profileData.resumeUrl}\n` +
                   `Direct Contact: ${profileData.socials.email}`
        });
        break;

      case 'whoami':
        newHistory.push({
          type: 'response',
          content: `${profileData.name} - ${profileData.title}\n` +
                   `Education: ${profileData.education}\n` +
                   `Location: ${profileData.location || 'Open to Remote / Relocation'}\n` +
                   `Status: ${profileData.availability}`
        });
        break;

      case 'help':
        newHistory.push({
          type: 'response',
          content: 'Available Saquib OS Commands:\n' +
                   '  whoami           - Display developer profile & status\n' +
                   '  sudo hire saquib - Secret recruitment metadata & status\n' +
                   '  projects         - Scroll to featured products & systems\n' +
                   '  experience       - Show internship & leadership timeline\n' +
                   '  resume           - Download official CV resume PDF\n' +
                   '  contact          - Scroll to contact form\n' +
                   '  clear            - Clear console output'
        });
        break;

      case 'projects':
        newHistory.push({ type: 'response', content: 'Navigating to Featured Products...' });
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'experience':
        newHistory.push({ type: 'response', content: 'Navigating to Experience Timeline...' });
        document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'contact':
        newHistory.push({ type: 'response', content: 'Navigating to Contact section...' });
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        break;

      case 'resume':
        newHistory.push({ type: 'response', content: 'Opening CV resume...' });
        window.open(profileData.resumeUrl, '_blank');
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        newHistory.push({
          type: 'error',
          content: `Command not found: "${cmd}". Type "help" or "sudo hire saquib" for commands.`
        });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-2xl glass-card apple-glass-edge shadow-xl overflow-hidden font-mono text-xs md:text-sm my-6 text-left relative">
      <div className="apple-specular-glare" />

      {/* Titlebar */}
      <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white/20 border border-white/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/15 border border-white/15" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10 border border-white/10" />
          <span className="text-[#C6CBD6] text-xs ml-2 font-medium flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-white" />
            saquib-os-cli ~ zsh
          </span>
        </div>
        <div className="text-[10px] text-white apple-glass-btn px-2.5 py-0.5 rounded font-semibold">
          CLI Active
        </div>
      </div>

      {/* Output */}
      <div className="p-4 space-y-2 max-h-48 overflow-y-auto font-mono text-[#C6CBD6] relative z-10">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={
              item.type === 'user'
                ? 'text-white font-bold'
                : item.type === 'error'
                ? 'text-rose-400'
                : item.type === 'system'
                ? 'text-[#C6CBD6]'
                : 'text-[#949BAA] whitespace-pre-wrap leading-relaxed'
            }
          >
            {item.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-2.5 optical-glass-input border-t border-white/10 flex items-center gap-2 relative z-10">
        <span className="text-white font-bold">$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          placeholder="Type 'sudo hire saquib', 'whoami', or 'help'..."
          className="w-full bg-transparent text-white placeholder-[#747B8B] focus:outline-none font-mono text-xs md:text-sm"
        />
        <CornerDownLeft className="w-3.5 h-3.5 text-[#747B8B] shrink-0" />
      </div>
    </div>
  );
}
