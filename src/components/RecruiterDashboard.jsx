import { motion } from 'framer-motion';
import { Briefcase, Calendar, Mail, FileText, CheckCircle2, Clock, MapPin, ExternalLink } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { profileData } from '../content/profile';

export default function RecruiterDashboard() {
  const { recruiterInfo, socials, resumeUrl } = profileData;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 rounded-3xl apple-glass-pill apple-glass-edge space-y-6 shadow-2xl text-left relative overflow-hidden">
      <div className="apple-specular-glare" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white">
              {recruiterInfo.status}
            </span>
            <span className="text-xs font-mono text-slate-300 px-3 py-1 rounded-full glass-nested-child">
              Recruiter Dashboard
            </span>
          </div>

          <h3 className="text-2xl font-extrabold text-white pt-1">
            Engineering Availability & Direct Hiring Metrics
          </h3>
        </div>

        <div className="text-xs font-mono text-slate-300 px-3 py-1.5 rounded-full apple-glass-btn flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-white" />
          <span>Avg Response Time: <strong className="text-white">{recruiterInfo.responseTime}</strong></span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid sm:grid-cols-3 gap-4 text-xs font-mono relative z-10">
        <div className="p-4 rounded-2xl glass-nested-child space-y-1.5">
          <div className="text-slate-400 uppercase font-semibold">Target Roles</div>
          <div className="text-slate-100 font-semibold leading-relaxed">
            {recruiterInfo.preferredRoles.join(' • ')}
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-nested-child space-y-1.5">
          <div className="text-slate-400 uppercase font-semibold">Current Location</div>
          <div className="text-slate-100 font-semibold">
            {recruiterInfo.currentLocation}
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-nested-child space-y-1.5">
          <div className="text-slate-400 uppercase font-semibold">Portfolio Version & Date</div>
          <div className="text-slate-100 font-semibold">
            {profileData.osName} {profileData.osVersion} ({recruiterInfo.lastUpdated})
          </div>
        </div>
      </div>

      {/* Quick Action CTAs */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${socials.email}`}
            className="px-5 py-2.5 rounded-full apple-glass-btn !bg-white/95 !text-black hover:!bg-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Mail className="w-4 h-4 text-black" />
            <span>Send Direct Email</span>
          </a>

          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-full apple-glass-btn text-white font-bold text-xs hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>View Resume</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-full apple-glass-btn text-slate-300 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-4 h-4" />
          </a>
          <a
            href={socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-2.5 rounded-full apple-glass-btn text-slate-300 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <FaGithub className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

