import React from 'react';
import {
  SiReact,
  SiJavascript,
  SiTailwindcss,
  SiHtml5,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiSocketdotio,
  SiPhp,
  SiPython,
  SiMongodb,
  SiVercel,
  SiGit,
  SiFigma,
  SiTypescript,
  SiNextdotjs,
  SiVite,
  SiCloudinary,
  SiPostman
} from 'react-icons/si';
import { FaCss3Alt, FaGithub } from 'react-icons/fa6';
import { Code2, Cloud } from 'lucide-react';

export const TECH_BRAND_MAP = {
  'react': { icon: SiReact, color: '#61DAFB', label: 'React' },
  'react.js': { icon: SiReact, color: '#61DAFB', label: 'React.js' },
  'react 19': { icon: SiReact, color: '#61DAFB', label: 'React' },
  'javascript': { icon: SiJavascript, color: '#F7DF1E', label: 'JavaScript' },
  'javascript (es6+)': { icon: SiJavascript, color: '#F7DF1E', label: 'JavaScript (ES6+)' },
  'js': { icon: SiJavascript, color: '#F7DF1E', label: 'JavaScript' },
  'typescript': { icon: SiTypescript, color: '#3178C6', label: 'TypeScript' },
  'ts': { icon: SiTypescript, color: '#3178C6', label: 'TypeScript' },
  'tailwind css': { icon: SiTailwindcss, color: '#06B6D4', label: 'Tailwind CSS' },
  'tailwind': { icon: SiTailwindcss, color: '#06B6D4', label: 'Tailwind CSS' },
  'html5 & css3': {
    icon: SiHtml5,
    color: '#E34F26',
    altIcon: FaCss3Alt,
    altColor: '#1572B6',
    label: 'HTML5 & CSS3'
  },
  'html5': { icon: SiHtml5, color: '#E34F26', label: 'HTML5' },
  'html': { icon: SiHtml5, color: '#E34F26', label: 'HTML5' },
  'css3': { icon: FaCss3Alt, color: '#1572B6', label: 'CSS3' },
  'css': { icon: FaCss3Alt, color: '#1572B6', label: 'CSS3' },
  'framer motion': { icon: SiFramer, color: '#0055FF', label: 'Framer Motion' },
  'framer': { icon: SiFramer, color: '#0055FF', label: 'Framer Motion' },
  'node.js': { icon: SiNodedotjs, color: '#5FA04E', label: 'Node.js' },
  'node': { icon: SiNodedotjs, color: '#5FA04E', label: 'Node.js' },
  'express.js': { icon: SiExpress, color: '#FFFFFF', label: 'Express.js' },
  'express': { icon: SiExpress, color: '#FFFFFF', label: 'Express.js' },
  'socket.io': { icon: SiSocketdotio, color: '#FFFFFF', label: 'Socket.io' },
  'socket': { icon: SiSocketdotio, color: '#FFFFFF', label: 'Socket.io' },
  'websockets': { icon: SiSocketdotio, color: '#FFFFFF', label: 'WebSockets' },
  'php': { icon: SiPhp, color: '#777BB4', label: 'PHP' },
  'python': { icon: SiPython, color: '#3776AB', label: 'Python' },
  'mongodb atlas': { icon: SiMongodb, color: '#47A248', label: 'MongoDB Atlas' },
  'mongodb': { icon: SiMongodb, color: '#47A248', label: 'MongoDB' },
  'cloudinary cdn': { icon: SiCloudinary, color: '#3448C5', label: 'Cloudinary CDN' },
  'cloudinary': { icon: SiCloudinary, color: '#3448C5', label: 'Cloudinary' },
  'vercel / render': { icon: SiVercel, color: '#FFFFFF', label: 'Vercel / Render' },
  'vercel': { icon: SiVercel, color: '#FFFFFF', label: 'Vercel' },
  'git & github': {
    icon: SiGit,
    color: '#F05032',
    altIcon: FaGithub,
    altColor: '#FFFFFF',
    label: 'Git & GitHub'
  },
  'git': { icon: SiGit, color: '#F05032', label: 'Git' },
  'github': { icon: FaGithub, color: '#FFFFFF', label: 'GitHub' },
  'figma': { icon: SiFigma, color: '#F24E1E', label: 'Figma' },
  'vite': { icon: SiVite, color: '#646CFF', label: 'Vite' },
  'next.js': { icon: SiNextdotjs, color: '#FFFFFF', label: 'Next.js' },
  'nextjs': { icon: SiNextdotjs, color: '#FFFFFF', label: 'Next.js' },
  'postman': { icon: SiPostman, color: '#FF6C37', label: 'Postman' }
};

export function getTechBrand(name) {
  if (!name) return { icon: Code2, color: '#FFFFFF', label: '' };
  const key = name.trim().toLowerCase();
  if (TECH_BRAND_MAP[key]) return TECH_BRAND_MAP[key];

  // Try substring matching
  for (const [k, v] of Object.entries(TECH_BRAND_MAP)) {
    if (key.includes(k) || k.includes(key)) {
      return v;
    }
  }

  return { icon: Code2, color: '#FFFFFF', label: name };
}

export default function TechBrandIcon({
  name,
  className = 'w-4 h-4',
  altClassName = 'w-3.5 h-3.5 ml-0.5',
  style = {}
}) {
  const brand = getTechBrand(name);
  const IconComponent = brand.icon;
  const AltIconComponent = brand.altIcon;

  return (
    <div className="inline-flex items-center justify-center shrink-0">
      <IconComponent
        className={className}
        style={{ color: brand.color, ...style }}
      />
      {AltIconComponent && (
        <AltIconComponent
          className={altClassName}
          style={{ color: brand.altColor }}
        />
      )}
    </div>
  );
}
