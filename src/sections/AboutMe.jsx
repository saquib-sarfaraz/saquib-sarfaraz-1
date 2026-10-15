import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { User, MapPin, GraduationCap, Briefcase, Rocket, Code2, Sparkles } from 'lucide-react';
import { profileData } from '../content/profile';
import profilePic from '../assets/profile-pic.jpeg';

// Hardware-accelerated GPU scroll reading highlight component
function WordHighlightParagraph({ text }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.45'],
  });

  const clipRight = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPath = useTransform(clipRight, (val) => `inset(0 ${val}% 0 0)`);

  return (
    <div ref={containerRef} className="relative font-sans text-base sm:text-lg leading-relaxed font-normal selection:bg-white/20 selection:text-white">
      {/* Dim Unread Text */}
      <p className="text-slate-400/80 font-normal">
        {text}
      </p>
      {/* Bright White Read Text revealed via GPU clip-path */}
      <motion.p
        style={{ clipPath }}
        className="absolute inset-0 text-white font-normal select-none pointer-events-none"
      >
        {text}
      </motion.p>
    </div>
  );
}

export default function AboutMe() {
  const quickStats = [
    {
      icon: <GraduationCap className="w-5 h-5 text-white" />,
      label: 'Education',
      value: 'B.Tech CSE',
      detail: 'Jamia Hamdard University'
    },
    {
      icon: <Briefcase className="w-5 h-5 text-[#C6CBD6]" />,
      label: 'Latest Internship',
      value: 'Confidential Gov',
      detail: 'Software Developer Intern (Remote)'
    },
    {
      icon: <Rocket className="w-5 h-5 text-white" />,
      label: 'Flagship Platform',
      value: 'InCampus SaaS Network',
      detail: 'Private Campus Social Ecosystem'
    },
    {
      icon: <MapPin className="w-5 h-5 text-[#C6CBD6]" />,
      label: profileData.location ? 'Location' : 'Work Mode',
      value: profileData.location || 'Open to Remote / Relocation',
      detail: 'Available Worldwide'
    }
  ];

  const techBadges = [
    'React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 
    'JavaScript (ES6+)', 'PHP', 'Python', 'Git', 'Cloudinary', 'REST APIs', 'Tailwind CSS'
  ];

  const bioParagraph1 = "I'm Saquib Sarfaraz, a Computer Science Engineering student at Jamia Hamdard and a Full Stack Developer passionate about building scalable web applications, real-time systems, and interactive digital products.";
  const bioParagraph2 = "Most recently, I completed a Software Developer Internship at Confidential Government, building software and web-based solutions, administrative interfaces, and backend functionality. Previously, I worked as a Full Stack Developer Intern at WonderKids Club developing production educational platforms.";
  const bioParagraph3 = "I enjoy engineering products that combine clean architecture, sub-100ms API performance, and engaging user interfaces—from campus social ecosystems like InCampus to high-speed backend microservices.";

  return (
    <section id="about" className="py-24 px-4 sm:px-6 relative bg-gradient-to-b from-[#080A12] via-[#10131D] to-[#080A12] text-left overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute top-1/4 left-5 w-[450px] h-[450px] rounded-full bg-white/[0.02] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-5 w-[500px] h-[500px] rounded-full bg-[#171A25]/40 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171A25]/80 text-[#C6CBD6] text-xs font-mono uppercase tracking-widest border border-[#414655] shadow-md backdrop-blur-xl">
            <User className="w-4 h-4 text-white" /> Executive Overview
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About Me
          </h2>
          <p className="text-slate-200 text-sm sm:text-base max-w-xl mx-auto font-mono">
            Full Stack Developer specializing in real-time systems, scalable SaaS architecture, and interactive web products.
          </p>
        </div>

        {/* Two-Column Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT SIDE (5 Grid Cols): Profile Image & Bio Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 glass-card apple-glass-edge p-8 rounded-3xl space-y-6 flex flex-col items-center justify-between text-center relative overflow-hidden"
          >
            <div className="apple-specular-glare" />

            <div className="space-y-6 flex flex-col items-center w-full relative z-10">
              {/* Prominent Circular Profile Image Presentation */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.05 }}
                className="relative p-1.5 rounded-full bg-gradient-to-tr from-white/70 via-slate-400/40 to-white/20 shadow-[0_0_35px_rgba(255,255,255,0.18)] cursor-pointer"
              >
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-[#171A25] bg-[#171A25]">
                  <img
                    src={profilePic}
                    alt="Saquib Sarfaraz - Full Stack Developer"
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </motion.div>

              <div className="space-y-1">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Saquib Sarfaraz</h3>
                <p className="text-xs font-mono text-[#C6CBD6] font-bold">Full Stack Web Developer</p>
              </div>

              {/* Status Badge: Active Blue Accent matching Navbar */}
              <div className="w-full p-3.5 rounded-2xl optical-active-pill flex items-center justify-center gap-3 border border-blue-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.85)] shrink-0" />
                <div className="text-xs font-mono text-left">
                  <div className="font-extrabold text-blue-100">Available for Opportunities</div>
                  <div className="text-blue-200/80">Full-time roles & internships</div>
                </div>
              </div>

              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed text-center font-normal">
                Computer Science Engineering student at Jamia Hamdard with hands-on experience building production web applications, SaaS platforms, and interactive software.
              </p>
            </div>

            {/* Location & University Tag */}
            <div className="w-full pt-4 border-t border-white/15 space-y-2 text-xs font-mono text-slate-300 relative z-10">
              <div className="flex items-center justify-center gap-2">
                <GraduationCap className="w-4 h-4 text-white" />
                <span>Jamia Hamdard University • CSE</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-white" />
                <span>{profileData.location || 'Open to Remote / Relocation'}</span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE (7 Grid Cols): Written Overview & Quick Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 flex flex-col justify-between"
          >
            {/* Paragraph Bio Box with Interactive Reading Highlight */}
            <div className="glass-card apple-glass-edge p-8 rounded-3xl space-y-6 relative overflow-hidden">
              <div className="apple-specular-glare" />

              <h3 className="text-xl font-extrabold text-white flex items-center gap-2 relative z-10">
                <Code2 className="w-5 h-5 text-white" />
                <span>Professional Summary</span>
              </h3>

              <div className="space-y-4 relative z-10">
                <WordHighlightParagraph text={bioParagraph1} />
                <WordHighlightParagraph text={bioParagraph2} />
                <WordHighlightParagraph text={bioParagraph3} />
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat) => (
                <div key={stat.label} className="glass-nested-child p-4 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <span className="text-[11px] font-mono text-slate-300 font-semibold">{stat.label}</span>
                  </div>
                  <div className="text-sm font-extrabold text-white font-mono pt-1">{stat.value}</div>
                  <div className="text-[11px] text-slate-300 font-mono truncate">{stat.detail}</div>
                </div>
              ))}
            </div>

            {/* Tech Highlights Badges */}
            <div className="glass-card apple-glass-edge p-5 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="apple-specular-glare" />

              <span className="text-xs font-mono uppercase tracking-wider text-white font-bold block relative z-10">
                Primary Technical Stack
              </span>
              <div className="flex flex-wrap gap-1.5 relative z-10">
                {techBadges.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 rounded-full glass-nested-child text-xs font-mono text-slate-200"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
