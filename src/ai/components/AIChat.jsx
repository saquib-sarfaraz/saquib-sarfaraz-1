import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, ArrowDown } from 'lucide-react';
import AIMessage from './AIMessage';

export default function AIChat({ messages = [], isThinking = false, onTriggerAction, containerRef }) {
  const latestUserMsgRef = useRef(null);
  const bottomRef = useRef(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

  // Find index of the last user message
  const lastUserIndex = messages.reduce((lastIdx, m, idx) => (m.role === 'user' ? idx : lastIdx), -1);

  // 1. When a new user question is submitted, anchor viewport to the user question
  useEffect(() => {
    if (isThinking || lastUserIndex !== -1) {
      setTimeout(() => {
        latestUserMsgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  }, [messages.length, isThinking, lastUserIndex]);

  // 2. Track container scroll position to detect if user manually scrolled up
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      const isScrolledUp = distanceToBottom > 140;
      setIsUserScrolledUp(isScrolledUp);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef]);

  // 3. Jump to bottom button handler
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsUserScrolledUp(false);
  };

  return (
    <div className="space-y-6 relative">
      {messages.map((msg, idx) => {
        const isLatestUserMsg = idx === lastUserIndex;
        return (
          <div key={idx} ref={isLatestUserMsg ? latestUserMsgRef : null} className="scroll-mt-6">
            <AIMessage message={msg} onTriggerAction={onTriggerAction} />
          </div>
        );
      })}

      {/* Thinking / Retrieval Indicator */}
      {isThinking && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-left pt-2"
        >
          <div className="w-8 h-8 rounded-full bg-[#171A25] border border-[#414655] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
            <Bot className="w-4 h-4 animate-bounce text-white" />
          </div>

          <div className="px-4 py-3 rounded-2xl bg-[#171A25] border border-[#414655] text-[#C6CBD6] font-mono text-xs flex items-center gap-2 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
            <span>Saquib AI is thinking & retrieving knowledge...</span>
            <div className="flex gap-1 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6CBD6] animate-pulse delay-100" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#747B8B] animate-pulse delay-200" />
            </div>
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} className="h-2" />

      {/* Floating "Jump to Latest 👇" Button when user is scrolled up */}
      <AnimatePresence>
        {isUserScrolledUp && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            onClick={scrollToBottom}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-[#171A25]/95 hover:bg-[#222633] text-white border border-[#414655] font-mono text-xs font-bold shadow-2xl backdrop-blur-xl flex items-center gap-2 cursor-pointer transition-all"
          >
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-white" />
            <span>Jump to latest</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
