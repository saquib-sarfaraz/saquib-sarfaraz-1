export const confidentialGovInternship = {
  isCurrent: false,
  id: 'confidential-gov-internship-2026',
  title: "Confidential Government",
  subtitle: "Software Developer Intern • August 2026 – September 2026",
  company: "Confidential Government",
  role: "Software Developer Intern",
  statusBadge: "Verified Internship",
  period: "August 2026 – September 2026",
  location: "Remote (Riyadh, Saudi Arabia)",
  companyLocation: "Riyadh, Saudi Arabia",
  workMode: "Remote",
  type: "Industry Internship",
  highlightBadge: "Verified Internship",
  isPinned: true,
  summary: "Worked on software development and web-based solutions, contributing to backend functionality, administrative interfaces, responsive user experiences, and production-focused implementations. Gained practical experience translating requirements into functional features while focusing on usability, maintainability, and reliable delivery.",
  ongoingSummary: "Worked on software development and web-based solutions, contributing to backend functionality, administrative interfaces, responsive user experiences, and production-focused implementations.",
  impactBullets: [
    "Contributed to software development and web-based solutions, implementing backend functionality and administrative interfaces.",
    "Engineered responsive user experiences and production-focused implementations with reliable delivery.",
    "Translated functional requirements into maintainable, well-structured software features with emphasis on usability.",
    "Delivered remote software engineering solutions adhering to high standards of reliability and code quality."
  ],
  techStack: ["Software Development", "Web Development", "Backend Development", "Admin Panels", "Responsive Design"]
};

export const wonderkidsInternship = {
  isCurrent: false,
  id: 'wonderkids-internship-2026',
  title: "Wonderkids.club",
  subtitle: "Full Stack Web Developer Intern • June 2026 – August 2026",
  company: "Wonderkids.club",
  role: "Full Stack Web Developer Intern",
  statusBadge: "Verified Internship",
  period: "June 2026 – August 2026",
  location: "Remote",
  type: "Industry Internship",
  highlightBadge: "Verified Internship",
  isPinned: false,
  summary: "Built interactive educational games and responsive UI screens for a live EdTech product, working across front-end components and PHP/Python backend modules.",
  ongoingSummary: "Developed production-ready educational web applications, interactive learning games, and full-stack features while collaborating directly with the founder.",
  impactBullets: [
    "Built interactive educational games and responsive UI screens for a live EdTech product, working across the front end and PHP/Python backend modules.",
    "Fixed production bugs and improved rendering performance; shipped changes directly to the live product under tight iteration cycles.",
    "Improved mobile compatibility across core learning modules, owning each feature from development through production release."
  ],
  techStack: ["HTML5", "CSS3", "JavaScript", "PHP", "Python", "Responsive Design", "Git"]
};

export const pizeonflyInternship = {
  isCurrent: false,
  id: 'pizeonfly-internship-2024',
  year: '2024',
  title: 'Pizeonfly Pvt Ltd',
  subtitle: "Web Developer Intern • September 2024 – October 2024",
  role: 'Web Developer Intern',
  company: 'Pizeonfly Pvt Ltd',
  type: 'Industry Internship',
  highlightBadge: 'Verified Internship',
  statusBadge: 'Verified Internship',
  period: "September 2024 – October 2024",
  location: 'New Delhi, India',
  isPinned: false,
  summary: "Built full-stack features using React.js frontend and Node.js/Express.js backend, implemented authentication flows, and supported live production performance.",
  impactBullets: [
    "Built full-stack features with React.js and Node.js/Express.js, including authentication flows and REST API integrations.",
    "Debugged cross-browser and backend issues in a live production environment.",
    "Supported end-to-end module performance and deployment stability across production environments."
  ],
  techStack: ["React.js", "Node.js", "Express.js", "REST APIs", "JWT Auth", "Google OAuth", "Vercel", "Render"]
};

// Verified Employment History (Strictly reverse chronological order)
export const resumeExperienceData = [
  confidentialGovInternship,
  wonderkidsInternship,
  pizeonflyInternship
];

export const marvelTimelineData = resumeExperienceData;
export const baseExperienceData = resumeExperienceData;

export const getExperienceTimeline = () => {
  return resumeExperienceData;
};
