import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FolderGit2, Briefcase, User, Mail, FileText, ExternalLink, Gamepad2, X, Check } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { profileData } from '../content/profile';

export default function CommandPalette({ isOpen, onClose, onOpenAISearch }) {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.lenis?.stop();
    } else {
      document.body.style.overflow = '';
      window.lenis?.start();
    }

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.lenis?.start();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const scrollToElement = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.lenis) {
      window.lenis.scrollTo(el, { offset: -60, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const actions = [
    {
      id: 'ai-search',
      label: 'Launch AI Search',
      category: 'AI Assistant',
      icon: Search,
      perform: () => {
        onClose();
        if (onOpenAISearch) onOpenAISearch();
      }
    },
    {
      id: 'projects',
      label: 'Go to Featured Products & Systems',
      category: 'Navigation',
      icon: FolderGit2,
      perform: () => {
        scrollToElement('projects');
        onClose();
      }
    },
    {
      id: 'experience',
      label: 'View Experience & Outcomes',
      category: 'Navigation',
      icon: Briefcase,
      perform: () => {
        scrollToElement('experience');
        onClose();
      }
    },
    {
      id: 'about',
      label: 'About & Background',
      category: 'Navigation',
      icon: User,
      perform: () => {
        const el = document.getElementById('about');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'game',
      label: 'Launch XYXO Interactive Game',
      category: 'Interactive',
      icon: Gamepad2,
      perform: () => {
        const el = document.getElementById('game');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'contact',
      label: 'Contact & Send Message',
      category: 'Actions',
      icon: Mail,
      perform: () => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        onClose();
      }
    },
    {
      id: 'resume',
      label: 'Download Resume (PDF)',
      category: 'Actions',
      icon: FileText,
      perform: () => {
        window.open(profileData.resumeUrl, '_blank');
        onClose();
      }
    },
    {
      id: 'copy-email',
      label: 'Copy Email Address',
      category: 'Actions',
      icon: copied ? Check : Mail,
      perform: () => {
        navigator.clipboard.writeText(profileData.socials.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    },
    {
      id: 'github',
      label: 'Open GitHub Profile',
      category: 'Socials',
      icon: FaGithub,
      perform: () => {
        window.open(profileData.socials.github, '_blank');
        onClose();
      }
    },
    {
      id: 'linkedin',
      label: 'Open LinkedIn Profile',
      category: 'Socials',
      icon: FaLinkedin,
      perform: () => {
        window.open(profileData.socials.linkedin, '_blank');
        onClose();
      }
    }
  ];

  const filtered = actions.filter((act) =>
    act.label.toLowerCase().includes(query.toLowerCase()) ||
    act.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl optical-modal-card apple-glass-edge rounded-2xl overflow-hidden z-10 backdrop-blur-3xl"
          >
            <div className="apple-specular-glare" />

            {/* Search Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/15 gap-3 relative z-10 bg-white/[0.02]">
              <Search className="w-4 h-4 text-white shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
              />
              <button
                onClick={onClose}
                className="apple-glass-btn text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1 relative z-10">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-mono">
                  No commands found matching "{query}"
                </div>
              ) : (
                filtered.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.perform}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/15 text-left group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg apple-glass-btn text-[#C6CBD6] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                            {action.label}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                            {action.category}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-white/15 bg-black/20 flex items-center justify-between text-[11px] text-slate-400 font-mono relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200 border border-white/15">↑↓</span>
                <span>Navigate</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200 border border-white/15 ml-2">↵</span>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-[#222633] text-[#C6CBD6] border border-[#414655]">ESC</span>
                <span>Close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
