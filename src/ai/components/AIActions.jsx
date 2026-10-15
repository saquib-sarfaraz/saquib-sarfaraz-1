import { ExternalLink, FolderGit2, Gamepad2, FileText, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';

export default function AIActions({ actions = [], onTriggerAction }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="pt-3 border-t border-[#414655] space-y-2">
      <div className="text-[10px] font-mono text-[#949BAA] font-bold uppercase tracking-wider">
        Related
      </div>
      <div className="flex flex-wrap gap-2">
      {actions.map((act, idx) => {
        if (act.type === 'project') {
          return (
            <button
              key={idx}
              onClick={() => onTriggerAction && onTriggerAction({ type: 'project', id: act.id })}
              className="px-3 py-1.5 rounded-xl bg-white/10 border border-[#747B8B]/40 text-[#F5F6FA] hover:text-white hover:bg-white/20 transition-all font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FolderGit2 className="w-3.5 h-3.5 text-white" />
              <span>{act.label || 'Open Project Modal'}</span>
            </button>
          );
        }

        if (act.type === 'live') {
          return (
            <a
              key={idx}
              href={act.url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white text-black hover:bg-[#C6CBD6] transition-all font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-black" />
              <span>{act.label || 'View Live Demo'}</span>
            </a>
          );
        }

        if (act.type === 'github') {
          return (
            <a
              key={idx}
              href={act.url}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#222633] border border-[#414655] text-[#C6CBD6] hover:text-white hover:border-[#747B8B] transition-all font-mono text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <FaGithub className="w-3.5 h-3.5 text-white" />
              <span>{act.label || 'GitHub Repository'}</span>
            </a>
          );
        }

        if (act.type === 'playzone') {
          return (
            <button
              key={idx}
              onClick={() => onTriggerAction && onTriggerAction({ type: 'playzone', gameId: act.gameId })}
              className="px-3 py-1.5 rounded-xl bg-white/10 border border-[#414655] text-[#F5F6FA] hover:text-white hover:bg-white/20 transition-all font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-white" />
              <span>{act.label || 'Launch Play Zone'}</span>
            </button>
          );
        }

        if (act.type === 'resume') {
          return (
            <a
              key={idx}
              href={act.url || '/Saquib_Sarfaraz_FullStack_Resume.pdf'}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-[#222633] border border-[#414655] text-[#C6CBD6] hover:text-white hover:border-[#747B8B] transition-all font-mono text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>{act.label || 'Download Resume PDF'}</span>
            </a>
          );
        }

        if (act.type === 'scroll') {
          return (
            <button
              key={idx}
              onClick={() => onTriggerAction && onTriggerAction({ type: 'scroll', target: act.target })}
              className="px-3 py-1.5 rounded-xl bg-[#171A25] border border-[#414655] text-[#C6CBD6] hover:text-white hover:border-[#747B8B] transition-all font-mono text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <span>{act.label || `Scroll to ${act.target}`}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#949BAA]" />
            </button>
          );
        }

        return null;
      })}
      </div>
    </div>
  );
}
