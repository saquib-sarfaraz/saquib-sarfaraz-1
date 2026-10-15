import amazonCloneImg from '../assets/amazon-clone.png';
import ticTacToeImg from '../assets/tic-tac-toe.png';

export const flagshipProject = {
  id: 'incampus',
  featured: true,
  spotlight: true,
  title: 'InCampus',
  subtitle: 'Private Campus Social & Community Network',
  category: 'Full Stack SaaS',
  eyebrow: 'Flagship SaaS Product',
  status: 'Live Platform',
  demoUrl: 'https://incampus.online',
  githubUrl: 'https://github.com/saquib-sarfaraz',
  image: null,
  gradient: 'from-[#171A25] via-[#222633]/80 to-[#10131D]',
  accentColor: '#FFFFFF',
  tags: ['React', 'Node.js', 'Express', 'MongoDB Atlas', 'Socket.io', 'Cloudinary', 'JWT OAuth'],
  overview: 'A university-exclusive social network featuring isolated campus feeds, real-time 1-to-1 messaging, dynamic identity verification workflows, and automated report moderation.',
  challenge: 'Enforcing strict campus privacy boundaries while facilitating verified cross-college communication, alongside managing real-time chat concurrency.',
  approach: 'Engineered a multi-tenant MongoDB data schema isolating campus feeds with weighted ranking algorithms, integrated Google OAuth 2.0 + JWT authentication, and implemented low-latency Socket.io channels.',
  architecture: [
    'Authentication: Google OAuth 2.0 with JWT access token auto-rotation',
    'Feed Engine: Universal vs My College feed modes with MongoDB aggregation pipelines',
    'Chat System: Socket.io 1-to-1 and group messaging with presence detection',
    'Media Pipeline: Signed client uploads to Cloudinary with image optimization'
  ],
  results: [
    'Successfully onboarded university students with instant campus verification',
    'Achieved sub-100ms real-time chat latency using event-driven socket handling',
    'Zero reported feed leaks across distinct college privacy boundaries'
  ],
  lessonsLearned: 'Building a production social network highlighted database indexing strategies for pagination, rate limiting for API security, and socket reconnection handling.'
};

export const ecosystemProjects = [
  {
    id: 'ai-spend-audit',
    featured: true,
    title: 'AI Spend Audit',
    subtitle: 'AI-Powered SaaS Cost Optimisation Platform',
    category: 'Full Stack SaaS',
    eyebrow: 'AI SaaS Platform',
    status: 'Live Platform',
    demoUrl: 'https://ai-audit-lilac.vercel.app',
    githubUrl: 'https://github.com/saquib-sarfaraz/ai-audit-',
    image: null,
    gradient: 'from-[#171A25] via-[#222633]/70 to-[#10131D]',
    accentColor: '#FFFFFF',
    tags: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Groq AI', 'Tailwind CSS', 'Vite'],
    overview: 'AI-powered SaaS platform that helps startups and development teams analyze AI subscription costs, detect overlapping tools, optimize seat allocation, and generate shareable cost-saving reports.',
    challenge: 'Aggregating disparate AI tool subscriptions and leveraging LLM reasoning to evaluate seat utilization and tool overlap in real time.',
    approach: 'Integrated Groq AI for instant optimization recommendations, built responsive interactive analytics dashboards, and created shareable report pages with unique permalinks.',
    architecture: [
      'Groq AI LLM Engine: Generates actionable cost-saving summaries & tool overlap detection',
      'Interactive Analytics: Dashboard charts comparing current vs optimized tool spend',
      'Shareable Audit Reports: Unique URL generation for multi-step team review',
      'REST Backend API: Node.js, Express, and MongoDB for subscription data persistence'
    ],
    results: [
      'Built production-ready SaaS application with end-to-end audit workflows',
      'Integrated Groq AI for instant cost recommendations and tool redundancy detection',
      'Deployed live on Vercel with environment-based configuration'
    ]
  },
  {
    id: 'campus-chat-engine',
    title: 'Campus Chat Engine',
    subtitle: 'Event-Driven Real-Time Messaging',
    category: 'InCampus Infrastructure',
    eyebrow: 'Real-Time Messaging',
    status: 'Active Pipeline',
    demoUrl: null,
    githubUrl: 'https://github.com/saquib-sarfaraz',
    image: null,
    gradient: 'from-[#171A25] via-[#222633]/50 to-[#10131D]',
    accentColor: '#C6CBD6',
    tags: ['Socket.io', 'Node.js', 'MongoDB', 'Presence Detection'],
    overview: 'The core Socket.io messaging infrastructure powering real-time chat, presence indicators, unread message badges, and auto-purging message buffers.',
    challenge: 'Managing socket connection heartbeats and room namespaces over intermittent mobile connections.',
    approach: 'Built event-driven room dispatchers with optimistic client delivery and server-side message persistence.',
    architecture: ['Socket.io Namespaces', 'Auto-Purging Buffers', 'Presence Detection Heartbeat'],
    results: ['Sub-100ms message delivery with zero message drop rate.']
  },
  {
    id: 'college-search-api',
    title: 'College Search API',
    subtitle: 'Infrastructure Powering InCampus',
    category: 'InCampus Infrastructure',
    eyebrow: 'Core Infrastructure',
    status: 'Production API',
    demoUrl: null,
    githubUrl: 'https://github.com/saquib-sarfaraz',
    image: null,
    gradient: 'from-[#171A25] via-[#222633]/50 to-[#10131D]',
    accentColor: '#C6CBD6',
    tags: ['Node.js', 'Express', 'MongoDB Atlas', 'Regex Search Index'],
    overview: 'High-speed autocomplete microservice indexing thousands of global universities for student onboarding search within InCampus.',
    challenge: 'Ensuring sub-20ms search query response times across thousands of university names with partial prefix matches.',
    approach: 'Created MongoDB compound text & wildcard indexes with memory-cached frequent query responses.',
    architecture: ['Compound Regex Text Indexing', 'Express Middleware Rate Limiting'],
    results: ['Sub-15ms search latency reducing onboarding drop-offs.']
  },
  {
    id: 'xyxo',
    title: 'XYXO Game Engine',
    subtitle: 'Real-Time Multiplayer Engine',
    category: 'Multiplayer System',
    eyebrow: 'Multiplayer System',
    status: 'Live & Playable',
    demoUrl: 'https://xyxo.vercel.app/',
    githubUrl: 'https://github.com/saquib-sarfaraz',
    image: null,
    gradient: 'from-[#171A25] via-[#222633]/50 to-[#10131D]',
    accentColor: '#FFFFFF',
    tags: ['React', 'Socket.io', 'Node.js', 'Express', 'Minimax AI'],
    overview: 'Real-time multiplayer web game featuring room matchmaking, turn synchronization, live chat, and single-player Minimax AI fallback.',
    challenge: 'Preventing state desynchronization between players over mobile networks.',
    approach: 'Implemented server-authoritative move validation with room pairing queues.',
    architecture: ['Dynamic Room Pairing Queue', 'Server Move Validation', 'Minimax Fallback AI'],
    results: ['Instant 50ms turn response with embedded interactive runner.']
  },
  {
    id: 'incampus-help',
    title: 'InCampus Help',
    subtitle: 'Verification & Support Portal',
    category: 'InCampus Ecosystem',
    eyebrow: 'Support Portal',
    status: 'Live',
    demoUrl: 'https://incampus-help.online',
    githubUrl: 'https://github.com/saquib-sarfaraz',
    image: null,
    gradient: 'from-[#171A25] via-[#222633]/50 to-[#10131D]',
    accentColor: '#C6CBD6',
    tags: ['React', 'Node.js', 'MongoDB', 'Forms Webhook'],
    overview: 'A dedicated support center centralizing student verification requests, blue tick badge issuances, FAQs, and developer documentation.',
    challenge: 'Streamlining manual campus identity verification requests while giving users transparent status feedback.',
    approach: 'Designed a searchable support documentation center connected with webhook form submissions for verification ticket processing.',
    architecture: ['Searchable Knowledge Index', 'Dynamic Verification Request Queues'],
    results: ['Automated verification inquiry workflows with 100% policy transparency.']
  }
];

export const learningProjects = [
  {
    id: 'amazon-clone',
    title: 'Amazon E-Commerce Storefront',
    subtitle: 'Responsive Interface Practice',
    tags: ['HTML5', 'CSS3', 'Flexbox & Grid'],
    demoUrl: 'https://amazon-clone-five-drab.vercel.app/',
    githubUrl: 'https://github.com/saquib-sarfaraz',
    image: amazonCloneImg,
    overview: 'E-commerce storefront replica demonstrating advanced CSS layouts and multi-tier navigation.'
  },
  {
    id: 'tic-tac-toe',
    title: 'Interactive Tic-Tac-Toe',
    subtitle: 'Vanilla JS State Practice',
    tags: ['JavaScript (ES6+)', 'DOM API', 'CSS Keyframes'],
    demoUrl: 'https://tic-tac-toe-game-bay-two.vercel.app/',
    githubUrl: 'https://github.com/saquib-sarfaraz',
    image: ticTacToeImg,
    overview: 'Vanilla JavaScript state management showcase with turn animations and win evaluation logic.'
  }
];

export const projectsData = [flagshipProject, ...ecosystemProjects];
