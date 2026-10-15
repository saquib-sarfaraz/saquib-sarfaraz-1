import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, MapPin, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import RecruiterDashboard from '../components/RecruiterDashboard';
import { profileData } from '../content/profile';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    setErrorMsg('');

    try {
      const response = await fetch("https://formspree.io/f/mgograry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Portfolio Direct Message',
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } else {
        throw new Error('Formspree response error');
      }
    } catch (err) {
      console.error('Formspree Send Error:', err);
      setErrorMsg('Unable to send message via Formspree. Please try again or email directly.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 relative bg-[#080A12] overflow-hidden text-left border-t border-[#171A25]">
      {/* Radial Glow Blobs */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] rounded-full bg-[#171A25]/40 blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        {/* Recruiter Dashboard */}
        <RecruiterDashboard />

        {/* Contact Form & Messaging Card */}
        <motion.div
          initial={{ opacity: 0, y: 32, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto p-8 sm:p-10 rounded-3xl apple-glass-pill apple-glass-edge space-y-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative overflow-hidden"
        >
          <div className="apple-specular-glare" />

          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full apple-glass-btn text-white text-xs font-mono uppercase tracking-widest shadow-sm">
              <Mail className="w-4 h-4 text-white" /> Direct Channel
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
              Let's Build Something <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Together</span>
            </h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto font-mono">
              Open for full stack roles, technical projects, and engineering collaborations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto font-mono text-xs relative z-10">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase text-[10px]">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saquib Sarfaraz"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl optical-glass-input text-white placeholder-slate-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase text-[10px]">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="saquib@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl optical-glass-input text-white placeholder-slate-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase text-[10px]">Subject (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Job Opportunity / Collaboration"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-xl optical-glass-input text-white placeholder-slate-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-bold uppercase text-[10px]">Message</label>
              <textarea
                rows={4}
                required
                placeholder="Share project details, job opportunity, or inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl optical-glass-input text-white placeholder-slate-500 transition-all leading-relaxed"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center gap-2 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={isSending}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="w-full py-3.5 rounded-xl apple-glass-btn !bg-white/95 !text-black hover:!bg-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 text-black animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Message Delivered Successfully!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-black" />
                  <span>Send Direct Message</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
