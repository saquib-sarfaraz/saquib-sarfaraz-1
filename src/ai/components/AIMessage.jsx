import { motion } from 'framer-motion';
import { Bot, User, Database } from 'lucide-react';
import AIActions from './AIActions';

export default function AIMessage({ message, onTriggerAction }) {
  const isUser = message.role === 'user';

  // Helper to parse markdown headers, bold, bullet lists, links
  const renderFormattedContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    return lines.map((line, lineIdx) => {
      let trimmed = line.trim();
      if (!trimmed) return <div key={lineIdx} className="h-2" />;

      // Header H3 ###
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={lineIdx} className="text-sm sm:text-base font-bold text-white font-sans pt-2 pb-1 border-b border-slate-800/60">
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
      }

      // Bullet list item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.substring(2);
        return (
          <li key={lineIdx} className="ml-4 list-disc text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
            {parseInlineMarkdown(itemText)}
          </li>
        );
      }

      // Numbered list item
      if (/^\d+\.\s/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+\.\s+/, '');
        return (
          <li key={lineIdx} className="ml-4 list-decimal text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
            {parseInlineMarkdown(itemText)}
          </li>
        );
      }

      return (
        <p key={lineIdx} className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    });
  };

  // Helper for **bold** and [links](url)
  const parseInlineMarkdown = (text) => {
    // Regex split for bold **bold**
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('[') && part.includes('](')) {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          return (
            <a
              key={i}
              href={match[2]}
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:underline font-semibold"
            >
              {match[1]}
            </a>
          );
        }
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 text-left ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar Icon */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-md ${
          isUser
            ? 'bg-white text-black font-mono shadow-sm'
            : 'bg-[#171A25] border border-[#414655] text-white shadow-sm'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Bubble Card */}
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl backdrop-blur-2xl border ${
          isUser
            ? 'bg-[#222633] border-[#747B8B] text-[#F5F6FA] rounded-tr-none'
            : 'bg-[#171A25]/90 border-[#414655] text-[#C6CBD6] rounded-tl-none'
        }`}
      >
        {/* Message Body Content */}
        <div className="space-y-1">{renderFormattedContent(message.content)}</div>

        {/* Action Buttons if present */}
        {!isUser && message.actions && message.actions.length > 0 && (
          <AIActions actions={message.actions} onTriggerAction={onTriggerAction} />
        )}
      </div>
    </motion.div>
  );
}
