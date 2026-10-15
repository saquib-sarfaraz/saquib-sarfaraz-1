import { useState } from 'react';
import { motion } from 'framer-motion';
import { useReveal } from '../hooks/useReveal';

export default function ProjectCard({
  variant,
  delayClass = '',
  header,
  title,
  action,
  description,
  descriptionClassName = 'text-gray-400 text-sm mb-4',
  note,
  features = [],
  techStack = [],
  impact = [],
  tags = [],
}) {
  const revealRef = useReveal();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: y * -10, rotateY: x * 10, scale: 1.02 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  };

  const cardClassName = `glass-card glass-card-hover apple-glass-edge rounded-3xl p-6 transition-all duration-300 group reveal hover-card relative overflow-hidden ${delayClass}`.trim();

  return (
    <motion.article
      ref={revealRef}
      data-cursor-label="EXPLORE →"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
        scale: tilt.scale,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={cardClassName}
    >
      <div className="apple-specular-glare" />

      {header?.type === 'gradient' ? (
        <div
          className={`h-44 rounded-2xl ${header.gradientClassName} mb-6 overflow-hidden relative group-hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-300`}
        >
          <div
            className={`absolute inset-0 ${header.overlayClassName} mix-blend-overlay`}
          ></div>
          <div className={header.blobClassName}></div>
          <div className="relative h-full p-5 flex flex-col justify-between">
            <div
              className={`text-[10px] uppercase tracking-[0.3em] ${header.eyebrowClassName}`}
            >
              {header.eyebrow}
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-white group-hover:text-white transition-colors">
                {header.name}
              </div>
              <div className="text-xs text-gray-400">{header.subtitle}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={header.statusClassName}>{header.statusLabel}</span>
            </div>
          </div>
        </div>
      ) : null}

      {header?.type === 'image' ? (
        <div
          className={`h-48 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 mb-6 overflow-hidden relative`}
        >
          <div
            className={`absolute inset-0 ${header.overlayClassName} mix-blend-overlay`}
          ></div>
          <img src={header.imageSrc} alt={header.imageAlt} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
        </div>
      ) : null}

      {variant === 'detailed' ? (
        <>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold">{title}</h3>
            {action?.type === 'link' ? (
              <a
                href={action.href}
                className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center ${action.hoverClassName} transition-colors`}
                aria-label={action.ariaLabel}
              >
                <i className="fas fa-arrow-up-right-from-square text-xs"></i>
              </a>
            ) : null}
            {action?.type === 'tag' ? (
              <span className="text-[10px] px-2 py-1 rounded-full border border-white/10 text-gray-400 uppercase tracking-wider">
                {action.text}
              </span>
            ) : null}
          </div>

          <p className={descriptionClassName}>{description}</p>
          {note ? <div className="text-xs text-gray-500 mb-4">{note}</div> : null}

          {features.length > 0 ? (
            <div className="mb-4">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                Core Features
              </div>
              <ul className="text-gray-400 text-sm list-disc list-inside space-y-1">
                {features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {techStack.length > 0 ? (
            <div className="mb-4">
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                Tech Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {techStack.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2 py-1 rounded border border-white/10 text-gray-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {impact.length > 0 ? (
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-2">
                Impact
              </div>
              <ul className="text-gray-400 text-sm list-disc list-inside space-y-1">
                {impact.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      ) : null}

      {variant === 'compact' ? (
        <>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold">{title}</h3>
            {action?.type === 'link' ? (
              <a
                href={action.href}
                className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center ${action.hoverClassName} transition-colors`}
                aria-label={action.ariaLabel}
              >
                <i className="fas fa-arrow-up-right-from-square text-xs"></i>
              </a>
            ) : null}
          </div>
          <p className="text-gray-400 text-sm mb-6 line-clamp-2">{description}</p>
          <div className="flex gap-2">
            {tags.map((item) => (
              <span
                key={item}
                className="text-xs px-2 py-1 rounded border border-white/10 text-gray-400"
              >
                {item}
              </span>
            ))}
          </div>
        </>
      ) : null}
    </motion.article>
  );
}
