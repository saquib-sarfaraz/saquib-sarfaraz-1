import fs from 'fs';
import path from 'path';

// Module-level state across warm serverless / dev server invocations
const responseCache = new Map();
const rateLimitMap = new Map();
const keyCooldownMap = new Map(); // Key String -> Cooldown Expiration Timestamp (ms)

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache TTL
const RATE_LIMIT_MAX = 30; // 30 requests per minute per IP
const DEFAULT_COOLDOWN_MS = 60 * 1000; // Default 60 seconds cooldown fallback

function isRateLimited(ip) {
  const now = Date.now();
  const userRecord = rateLimitMap.get(ip) || { count: 0, resetTime: now + 60000 };

  if (now > userRecord.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }

  if (userRecord.count >= RATE_LIMIT_MAX) {
    return true;
  }

  userRecord.count += 1;
  rateLimitMap.set(ip, userRecord);
  return false;
}

// Multi-Key Groq Key Collector
function getApiKeys() {
  const keys = [];

  const envKeys = [
    process.env.GROQ_API_KEY_1,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY,
    process.env.XAI_API_KEY
  ];

  for (const k of envKeys) {
    if (k && typeof k === 'string' && k.trim() && !keys.includes(k.trim())) {
      keys.push(k.trim());
    }
  }

  // Parse .env.local or .env in project root if running in local Node environment
  try {
    const rootDir = process.cwd();
    const envPaths = [path.join(rootDir, '.env.local'), path.join(rootDir, '.env')];
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const matches = content.matchAll(/(?:GROQ_API_KEY_1|GROQ_API_KEY_2|GROQ_API_KEY_3|GROQ_API_KEY|XAI_API_KEY)\s*=\s*([^\s#]+)/g);
        for (const m of matches) {
          if (m && m[1]) {
            const val = m[1].trim().replace(/^["']|["']$/g, '');
            if (val && !keys.includes(val)) {
              keys.push(val);
            }
          }
        }
      }
    }
  } catch (e) {
    // Ignore fs errors in production serverless environments
  }

  return keys;
}

// Parse Groq's exact retry wait duration from error text or response headers
function parseGroqRetryWaitMs(errText, responseHeaders) {
  if (responseHeaders) {
    const retryHeader = responseHeaders.get('retry-after');
    if (retryHeader) {
      const sec = parseFloat(retryHeader);
      if (!isNaN(sec) && sec > 0) {
        return Math.round(sec * 1000);
      }
    }
  }

  if (typeof errText === 'string') {
    // Check minutes + seconds: e.g. "Please try again in 20m17.376s" or "9m54s"
    const minSecMatch = errText.match(/(\d+)\s*m\s*(\d+(?:\.\d+)?)\s*s/i);
    if (minSecMatch) {
      const min = parseInt(minSecMatch[1], 10);
      const sec = parseFloat(minSecMatch[2]);
      return Math.round((min * 60 + sec) * 1000);
    }

    // Check minutes only: e.g. "15m"
    const minMatch = errText.match(/(\d+)\s*m/i);
    if (minMatch) {
      const min = parseInt(minMatch[1], 10);
      return min * 60 * 1000;
    }

    // Check seconds only: e.g. "45.2s" or "45s"
    const secMatch = errText.match(/(\d+(?:\.\d+)?)\s*s/i);
    if (secMatch) {
      const sec = parseFloat(secMatch[1]);
      return Math.round(sec * 1000);
    }
  }

  return DEFAULT_COOLDOWN_MS;
}

// Key Cooldown Helpers
function isKeyOnCooldown(key) {
  const until = keyCooldownMap.get(key) || 0;
  if (Date.now() >= until) {
    keyCooldownMap.delete(key);
    return false;
  }
  return true;
}

function setKeyCooldown(key, label, customWaitMs = null) {
  const waitMs = customWaitMs || DEFAULT_COOLDOWN_MS;
  const until = Date.now() + waitMs;
  keyCooldownMap.set(key, until);
  const minutes = Math.floor(waitMs / 60000);
  const seconds = Math.round((waitMs % 60000) / 1000);
  const durationStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  console.log(`${label} placed on ${durationStr} cooldown until ${new Date(until).toLocaleTimeString()}`);
}

// Cache key normalization helper
function normalizeCacheKey(query) {
  return (query || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[?.!;,]+$/, '')
    .trim();
}

// ⚡ STATIC PROFILE DATA FOR SAQUIB SARFARAZ
const PORTFOLIO_PROFILE = {
  name: "Saquib Sarfaraz",
  title: "Full Stack Developer",
  education: "B.Tech Computer Science Engineering student at Jamia Hamdard, New Delhi (2023 - 2027)",
  location: "Open to Remote / Relocation",
  email: "saquibsarfaraz47@gmail.com",
  github: "https://github.com/saquib-sarfaraz",
  linkedin: "https://www.linkedin.com/in/saquib-sarfaraz-1691b9292/",
  instagram: "https://www.instagram.com/saquib.sarfaraz?igsh=MTB0ZWdlbWZnMTQ1dA==",
  website: "https://saquib-sarfaraz.vercel.app",
  resume: "/Saquib_Sarfaraz_FullStack_Resume.pdf",
  latestInternship: "Software Developer Intern at Confidential Government (August 2026 – September 2026, Remote • Company in Riyadh, Saudi Arabia)",
  currentInternship: "Software Developer Intern at Confidential Government (August 2026 – September 2026, Remote • Company in Riyadh, Saudi Arabia)",
  previousInternship: "Full Stack Developer Intern at WonderKids Club (June 2026 – August 2026)",
  flagshipSaaS: "InCampus (https://incampus.online)",
  aiSaaS: "AI Spend Audit (https://ai-audit-lilac.vercel.app)"
};

// ⚡ STEP 1: GREETING & IDENTITY FAST-PATH BYPASS (0 Token Cost)
function checkGreetingQuery(query) {
  const q = normalizeCacheKey(query);

  // Name / Identity fast path
  const isIdentity =
    q === 'naam' ||
    q === 'who are you' ||
    q === 'who are u' ||
    q === 'what is your name' ||
    q === 'whats your name' ||
    q === "what's your name" ||
    q === 'who is this' ||
    q === 'ur name' ||
    q === 'your name' ||
    q === 'name' ||
    q === 'tell me your name' ||
    q === 'introduce yourself' ||
    q === 'tell me about yourself' ||
    q === 'tell me about saquib' ||
    q === 'who is saquib' ||
    q === 'who is saquib sarfaraz' ||
    q === 'introduce saquib' ||
    q === 'about saquib' ||
    q.startsWith('who is saquib') ||
    q.startsWith('introduce yourself');

  if (isIdentity) {
    return {
      message: `I'm **Saquib Sarfaraz**! A Full Stack Developer and CSE student at Jamia Hamdard. Nice to meet you! 👋\n\nI build end-to-end web applications, scalable SaaS platforms (like **InCampus** and **AI Spend Audit**), and real-time socket engines. Recently, I completed a Software Developer Internship at **Confidential Government**.`,
      sources: ['About'],
      actions: [
        { type: 'scroll', target: 'about', label: 'About Me' },
        { type: 'scroll', target: 'projects', label: 'View Projects' }
      ]
    };
  }

  // Location fast path
  if (
    q === 'location' ||
    q === 'location?' ||
    q === 'where do you live' ||
    q.includes('where are you located') ||
    q.includes('where are you based') ||
    q.includes('riyadh')
  ) {
    return {
      message: `I'm open to remote roles and relocation worldwide 📍 (My recent software developer internship at Confidential Government was remote with a company based in Riyadh, Saudi Arabia).`,
      sources: ['About'],
      actions: [
        { type: 'scroll', target: 'contact', label: 'Contact Details' }
      ]
    };
  }

  // College / Education fast path
  if (
    q === 'college' ||
    q === 'college?' ||
    q === 'university' ||
    q === 'education' ||
    q.includes('which college') ||
    q.includes('where do you study')
  ) {
    return {
      message: `I'm pursuing my **B.Tech in Computer Science Engineering** at **Jamia Hamdard, New Delhi** (2023 - 2027) 🎓.`,
      sources: ['About'],
      actions: [
        { type: 'scroll', target: 'about', label: 'View Education' }
      ]
    };
  }

  // Hindi / Multilingual check
  if (q.includes('hindi') || q.includes('do you know hindi') || q.includes('hindi aati hai')) {
    return {
      message: `Yes 😄! I can understand both Hindi and English, so feel free to chat in whichever language you're comfortable with.`,
      sources: ['About'],
      actions: []
    };
  }

  // Skeptical / Emotional edge-case checks
  if (q.includes("don't want to hire") || q.includes("not hiring") || q.includes("wont hire")) {
    return {
      message: `That's completely fair! Not every developer is the right fit for every team. If you're curious about my work, feel free to explore my projects or ask me how I built something—I'm always happy to share.`,
      sources: ['About'],
      actions: [
        { type: 'scroll', target: 'projects', label: 'Explore Projects' }
      ]
    };
  }

  if (q.includes('defending yourself') || q.includes('defend yourself')) {
    return {
      message: `😄 There's nothing to defend! My goal here is simply to help you understand my work and experience. If something doesn't convince you, ask me about a project or a technical decision—I enjoy talking about those.`,
      sources: ['About'],
      actions: [
        { type: 'scroll', target: 'projects', label: 'View Technical Projects' }
      ]
    };
  }

  // Standard Greetings check
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'sup', 'yo', 'howdy'];
  const isGreeting = greetings.some((g) => q === g || q.startsWith(g + ' ') || q.startsWith(g + ',') || q.startsWith(g + '!'));

  if (isGreeting) {
    return {
      message: `Hi there! I'm **Saquib Sarfaraz**. Welcome to my portfolio! 👋 What would you like to explore—my live SaaS projects, tech stack, or recent internship work?`,
      sources: ['About'],
      actions: [
        { type: 'scroll', target: 'about', label: 'About Me' },
        { type: 'scroll', target: 'projects', label: 'View Projects' }
      ]
    };
  }

  // Gratitude check
  const thanks = ['thanks', 'thank you', 'thx', 'appreciate it', 'thank u', 'many thanks'];
  const isThanks = thanks.some((t) => q === t || q.startsWith(t + ' ') || q.startsWith(t + '!') || q.startsWith(t + ','));

  if (isThanks) {
    return {
      message: `You're welcome! Feel free to ask if you have any more questions about my work or portfolio.`,
      sources: ['About'],
      actions: []
    };
  }

  return null;
}

// ⚡ STEP 2: STATIC QUESTION BYPASS (0 Token Cost)
function checkStaticQuery(query) {
  const q = normalizeCacheKey(query);

  // 0. Leadership query
  if (
    q.includes('leadership') ||
    q.includes('campus mantri') ||
    q.includes('co-chairperson') ||
    q.includes('ignite society') ||
    q.includes('joint secretary') ||
    q.includes('design secretary') ||
    q.includes('creative lead') ||
    q.includes('nsdc') ||
    q.includes('nss') ||
    q.includes('student council')
  ) {
    return {
      message: `Here are my verified **Campus Leadership Roles**:\n\n1. 🌟 **Co-Chairperson** — NSDC, Jamia Hamdard (Sep 2025 – Aug 2026)\n   Supported student-led skill-building initiatives, workshops, and campus community engagement.\n\n2. 💻 **Campus Mantri** — GeeksforGeeks Campus Body, Jamia Hamdard (Dec 2024 – Feb 2026)\n   Fostered coding culture and connected 200+ students with competitions, peer learning, and hackathons.\n\n3. 🤝 **Joint Secretary** — Ignite Society, JHU (Sep 2024 – Apr 2025)\n   Co-managed society operations, visual communication, and event execution across campus activities.\n\n4. 🚀 **Creative Lead** — Ignite Society, JHU (Jan – Oct 2024)\n   Led creative initiatives, visual storytelling, event branding, and promotional design.`,
      sources: ['Leadership'],
      actions: [
        { type: 'scroll', target: 'leadership', label: 'View Leadership Section' }
      ]
    };
  }

  // 1. LinkedIn query
  if (q.includes('linkedin')) {
    return {
      message: `You can connect with me on **LinkedIn**:\n\n💼 [LinkedIn Profile](${PORTFOLIO_PROFILE.linkedin})\n\nFeel free to send a connection request or direct message!`,
      sources: ['Contact', 'LinkedIn'],
      actions: [
        { type: 'external', url: PORTFOLIO_PROFILE.linkedin, label: 'Open LinkedIn Profile' },
        { type: 'external', url: `mailto:${PORTFOLIO_PROFILE.email}`, label: 'Send Direct Email' }
      ]
    };
  }

  // 2. GitHub query
  if (q.includes('github') || q.includes('repo') || q.includes('repositories') || q.includes('code commits')) {
    return {
      message: `You can check out my open-source projects, repositories, and active code commits on **GitHub**:\n\n💻 [GitHub Profile](${PORTFOLIO_PROFILE.github})`,
      sources: ['Contact', 'GitHub'],
      actions: [
        { type: 'external', url: PORTFOLIO_PROFILE.github, label: 'Open GitHub Profile' },
        { type: 'scroll', target: 'projects', label: 'View Portfolio Projects' }
      ]
    };
  }

  // 3. Instagram query
  if (q.includes('instagram') || q.includes('insta')) {
    return {
      message: `Catch me on **Instagram**:\n\n📷 [Instagram Profile](${PORTFOLIO_PROFILE.instagram})`,
      sources: ['Contact', 'Instagram'],
      actions: [
        { type: 'external', url: PORTFOLIO_PROFILE.instagram, label: 'Open Instagram Profile' }
      ]
    };
  }

  // 4. Contact / Email / Phone / Location / Social links
  if (
    q.includes('contact') ||
    q.includes('reach') ||
    q.includes('touch') ||
    q.includes('email') ||
    q.includes('mail') ||
    q.includes('phone') ||
    q.includes('social')
  ) {
    return {
      message: `Here is how you can directly get in touch with me:\n\n📧 **Email**: [${PORTFOLIO_PROFILE.email}](mailto:${PORTFOLIO_PROFILE.email})\n💼 **LinkedIn**: [linkedin.com/in/saquib-sarfaraz](${PORTFOLIO_PROFILE.linkedin})\n💻 **GitHub**: [github.com/saquib-sarfaraz](${PORTFOLIO_PROFILE.github})\n📷 **Instagram**: [instagram.com/saquib.sarfaraz](${PORTFOLIO_PROFILE.instagram})\n📍 **Location**: ${PORTFOLIO_PROFILE.location}`,
      sources: ['Contact', 'Socials'],
      actions: [
        { type: 'external', url: `mailto:${PORTFOLIO_PROFILE.email}`, label: 'Send Direct Email' },
        { type: 'external', url: PORTFOLIO_PROFILE.linkedin, label: 'Open LinkedIn' },
        { type: 'external', url: PORTFOLIO_PROFILE.github, label: 'Open GitHub' },
        { type: 'scroll', target: 'contact', label: 'Go to Contact Form' }
      ]
    };
  }

  // 5. Resume / CV query
  if (q.includes('resume') || q.includes('cv') || q.includes('download resume') || q.includes('download cv')) {
    return {
      message: `You can view and download my official resume PDF here:\n\n📄 [Download Resume PDF](${PORTFOLIO_PROFILE.resume})\n\nIt covers my B.Tech studies at Jamia Hamdard, WonderKids Club internship, full-stack tech stack, and production SaaS projects.`,
      sources: ['Resume'],
      actions: [
        { type: 'resume', url: PORTFOLIO_PROFILE.resume, label: 'Download Resume PDF' },
        { type: 'scroll', target: 'experience', label: 'View Experience' }
      ]
    };
  }

  // 6. Tech Stack / Skills query
  if (
    q.includes('skill') ||
    q.includes('tech stack') ||
    q.includes('technologies') ||
    q === 'skills' ||
    q === 'tech' ||
    q === 'stack'
  ) {
    return {
      message: `I work primarily across modern full-stack web technologies:\n\n- **Frontend**: React.js, JavaScript (ES6+), Tailwind CSS, Framer Motion, HTML5 & CSS3\n- **Backend & Systems**: Node.js, Express.js, Socket.io, PHP, Python\n- **Databases & Infrastructure**: MongoDB Atlas, Cloudinary CDN, Vercel, Render\n- **Tools**: Git, GitHub, Figma, VS Code`,
      sources: ['Skills'],
      actions: [
        { type: 'scroll', target: 'skills', label: 'View Skills Section' }
      ]
    };
  }

  // 7. Portfolio / Projects location query
  if (
    q.includes('portfolio') ||
    q.includes('website') ||
    q.includes('where can i see your projects') ||
    q.includes('see your projects') ||
    q.includes('show projects')
  ) {
    return {
      message: `You can explore all of my live projects directly on this portfolio:\n\n🚀 **InCampus SaaS**: Live university social network at [incampus.online](https://incampus.online)\n💡 **AI Spend Audit**: Groq AI SaaS subscription optimizer live at [ai-audit-lilac.vercel.app](https://ai-audit-lilac.vercel.app)\n🎮 **XYXO Game**: Realtime multiplayer game in the Play Zone`,
      sources: ['Projects', 'Portfolio'],
      actions: [
        { type: 'scroll', target: 'projects', label: 'Explore Projects Section' },
        { type: 'external', url: 'https://incampus.online', label: 'Visit InCampus' },
        { type: 'external', url: 'https://ai-audit-lilac.vercel.app', label: 'Visit AI Spend Audit' }
      ]
    };
  }

  return null;
}

// CONTEXT TRIMMING BY WHOLE CHUNKS (Max 1800 Chars Strict Limit)
function formatContextChunks(retrievedContext) {
  if (!retrievedContext) return { formatted: '', count: 0 };

  const sections = retrievedContext.retrievedSections || [];
  let formatted = '';
  let count = 0;
  const MAX_TARGET = 1800;

  if (!Array.isArray(sections) || sections.length === 0) {
    const rawStr = typeof retrievedContext === 'string' ? retrievedContext : JSON.stringify(retrievedContext);
    return { formatted: rawStr.slice(0, MAX_TARGET), count: 1 };
  }

  for (let i = 0; i < Math.min(sections.length, 3); i++) {
    const sec = sections[i];
    const chunkTitle = sec.title || `Section ${i + 1}`;
    let chunkBody = typeof sec.data === 'string' ? sec.data : JSON.stringify(sec.data);

    // Cap single chunk body if it contains large arrays/objects
    if (chunkBody.length > 1200) {
      chunkBody = chunkBody.slice(0, 1200);
    }

    const chunkText = `### ${chunkTitle}\n${chunkBody}\n\n`;

    if (formatted.length + chunkText.length > MAX_TARGET && formatted.length > 0) {
      break;
    }

    formatted += chunkText;
    count++;

    if (formatted.length >= MAX_TARGET) break;
  }

  return { formatted: formatted.slice(0, MAX_TARGET).trim(), count };
}

// 🌟 DYNAMIC SYSTEM PROMPT GENERATOR (Mode Switching with Relevance Guardrails)
function getDynamicSystemPrompt(intent, contextText) {
  const baseIdentity = `You are Saquib Sarfaraz's digital twin on his personal portfolio website.
Always speak naturally in the first person ("I", "my", "I've", "I'm").
Never refer to yourself as an AI, chatbot, language model, assistant, machine, or software.

# STRICT RELEVANCE & NO-HALLUCINATION RULES:
- Mention ONLY the 1-2 projects or experiences directly relevant to answering the question. Do NOT over-list project names unless directly requested.
- Never guess or fabricate information about people, companies, or projects not present in the context. If unknown: "I don't have that information in my portfolio."`;

  if (intent === 'Technical') {
    return `${baseIdentity}

# TECHNICAL MODE:
- Explain software engineering decisions, why, how, trade-offs, architecture, and lessons learned like the developer who built it.
- Be articulate and confident without dictionary definitions.

# PORTFOLIO CONTEXT:
${contextText}`;
  }

  if (intent === 'Recruiter') {
    return `${baseIdentity}

# RECRUITER MODE (Elevator Pitch Style):
- Deliver a concise 30–45 second elevator pitch. Focus on real product ownership, production engineering impact, and WonderKids Club internship results.
- Be humble yet confident. Highlight real achievements without exaggerating.
- Answer in 2-3 punchy paragraphs ending with a natural follow-up invitation.

# PORTFOLIO CONTEXT:
${contextText}`;
  }

  if (intent === 'Casual') {
    return `${baseIdentity}

# CASUAL MODE:
- Warm, approachable, slightly informal tone. Keep answers light and natural.

# PORTFOLIO CONTEXT:
${contextText}`;
  }

  return `${baseIdentity}

# PORTFOLIO MODE:
- Concise initial answers (2-3 short paragraphs), ending with a natural follow-up offer.

# PORTFOLIO CONTEXT:
${contextText}`;
}

// DYNAMIC TOKEN LIMIT DETERMINATION
function getDynamicMaxTokens(query) {
  const q = normalizeCacheKey(query);
  const isDetailed = /\b(detailed|detail|thorough|in-depth|explain|how|architecture|implementation|backend|challenges|walk me through|expand)\b/i.test(q);
  if (isDetailed) return 500;
  return 300;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  const startTime = Date.now();

  // CORS & Method Check
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Send POST request.' });
  }

  // IP Rate Limiting Protection
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'global';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please wait a minute before asking again.' });
  }

  const { messages = [], retrievedContext = null, query = '' } = req.body || {};

  // Input Validation
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  const trimmedQuery = query.trim();
  const cacheKey = normalizeCacheKey(trimmedQuery);
  const retrievedSources = retrievedContext?.sources || ['Portfolio Data'];

  const intent = retrievedContext?.intent || 'General';
  const entity = retrievedContext?.entity || 'General';
  const card = retrievedContext?.card || (retrievedContext?.retrievedSections?.[0]?.title || 'Default Card');
  const rawKeywords = retrievedContext?.rawKeywords || [];
  const expandedKeywords = retrievedContext?.expandedKeywords || [];
  const confidence = retrievedContext?.confidence || 0.85;

  // ⚡ STEP 1A: UNKNOWN PERSON / ENTITY BYPASS (0 Token Cost, Zero Hallucination)
  if (retrievedContext?.unknownPerson && retrievedContext?.unknownMessage) {
    logMetrics({
      question: trimmedQuery,
      intent: 'UnknownPerson',
      entity: retrievedContext.entity || 'Unknown',
      card: 'Bypass > Unknown Person',
      rawKeywords: retrievedContext.rawKeywords || [],
      expandedKeywords: [],
      confidence: 1.0,
      cacheHit: false,
      retrievedChunks: 0,
      historyCount: 0,
      contextSize: 0,
      keyUsed: 'Bypass (No Hallucination)',
      retries: 0,
      providerStatus: '200 OK',
      latency: Date.now() - startTime,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0
    });
    return res.status(200).json({
      fallback: false,
      staticMatch: true,
      sources: ['About'],
      actions: retrievedContext.actions || [],
      message: retrievedContext.unknownMessage
    });
  }

  // ⚡ STEP 1A2: OUT-OF-SCOPE / GENERAL KNOWLEDGE REFUSAL BYPASS (0 Token Cost)
  if (retrievedContext?.outOfScope && retrievedContext?.outOfScopeMessage) {
    logMetrics({
      question: trimmedQuery,
      intent: 'OutOfScope',
      entity: 'Policy',
      card: 'Bypass > Out Of Scope Guardrail',
      rawKeywords: retrievedContext.rawKeywords || [],
      expandedKeywords: [],
      confidence: 1.0,
      cacheHit: false,
      retrievedChunks: 0,
      historyCount: 0,
      contextSize: 0,
      keyUsed: 'Bypass (Out of Scope Refusal)',
      retries: 0,
      providerStatus: '200 OK',
      latency: Date.now() - startTime,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0
    });
    return res.status(200).json({
      fallback: false,
      staticMatch: true,
      sources: ['Policy'],
      actions: retrievedContext.actions || [
        { type: 'scroll', target: 'about', label: 'About Saquib' },
        { type: 'scroll', target: 'projects', label: 'View Projects' }
      ],
      message: retrievedContext.outOfScopeMessage
    });
  }

  // ⚡ STEP 1B: AMBIGUOUS PROJECT CLARIFICATION BYPASS (0 Token Cost)
  if (retrievedContext?.needsClarification && retrievedContext?.clarificationMessage) {
    logMetrics({
      question: trimmedQuery,
      intent: 'AmbiguousProject',
      entity: 'Multiple Projects',
      card: 'Bypass > Ambiguous Clarification',
      rawKeywords: retrievedContext.rawKeywords || [],
      expandedKeywords: [],
      confidence: 1.0,
      cacheHit: false,
      retrievedChunks: 0,
      historyCount: 0,
      contextSize: 0,
      keyUsed: 'Bypass (Clarification Request)',
      retries: 0,
      providerStatus: '200 OK',
      latency: Date.now() - startTime,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0
    });
    return res.status(200).json({
      fallback: false,
      staticMatch: true,
      sources: ['Projects'],
      actions: retrievedContext.actions || [],
      message: retrievedContext.clarificationMessage
    });
  }

  // ⚡ STEP 1C: GREETING & IDENTITY FAST-PATH BYPASS (0 Token Cost)
  const greetingResult = checkGreetingQuery(trimmedQuery);
  if (greetingResult) {
    logMetrics({
      question: trimmedQuery,
      intent: 'Identity',
      entity: 'Saquib Sarfaraz',
      card: 'Bypass > Identity Fast Path',
      rawKeywords: ['identity'],
      expandedKeywords: [],
      confidence: 1.0,
      cacheHit: false,
      retrievedChunks: 1,
      historyCount: 0,
      contextSize: 0,
      keyUsed: 'Bypass (Identity Fast Path)',
      retries: 0,
      providerStatus: '200 OK',
      latency: Date.now() - startTime,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0
    });
    return res.status(200).json({
      fallback: false,
      staticMatch: true,
      sources: greetingResult.sources,
      actions: greetingResult.actions,
      message: greetingResult.message
    });
  }

  // ⚡ STEP 2: STATIC QUESTION BYPASS (0 Token Cost)
  const staticResult = checkStaticQuery(trimmedQuery);
  if (staticResult) {
    logMetrics({
      question: trimmedQuery,
      intent: 'Static',
      entity,
      card: 'Bypass > Static Match',
      rawKeywords: ['static'],
      expandedKeywords: [],
      confidence: 1.0,
      cacheHit: false,
      retrievedChunks: (staticResult.sources || []).length,
      historyCount: 0,
      contextSize: 0,
      keyUsed: 'Bypass (Static Match)',
      retries: 0,
      providerStatus: '200 OK',
      latency: Date.now() - startTime,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0
    });
    return res.status(200).json({
      fallback: false,
      staticMatch: true,
      sources: staticResult.sources,
      actions: staticResult.actions,
      message: staticResult.message
    });
  }

  // ⚡ STEP 3: 10-MINUTE IN-MEMORY RESPONSE CACHE
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    logMetrics({
      question: trimmedQuery,
      intent,
      entity,
      card,
      rawKeywords,
      expandedKeywords,
      confidence,
      cacheHit: true,
      retrievedChunks: (cached.sources || []).length,
      historyCount: 0,
      contextSize: 0,
      keyUsed: 'Cache',
      retries: 0,
      providerStatus: '200 OK',
      latency: Date.now() - startTime,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0
    });
    return res.status(200).json({
      fallback: false,
      cached: true,
      sources: cached.sources,
      actions: cached.actions,
      message: cached.message
    });
  }

  // ⚡ STEP 4: RAG RETRIEVAL & CONTEXT PREPARATION
  const { formatted: contextText, count: chunkCount } = formatContextChunks(retrievedContext);

  // 🌟 DYNAMIC SYSTEM PROMPT (Mode Switching with Relevance Guardrails)
  const systemPrompt = getDynamicSystemPrompt(intent, contextText);

  // 🔧 TOPIC-AWARE HISTORY FILTERING (Reset history on topic switches / non-technical queries)
  const isTopicSpecific = intent === 'Technical' || intent === 'Project';
  const cleanedHistory = isTopicSpecific
    ? messages
        .filter((m) => m && m.role && m.content)
        .slice(-4)
        .map(({ role, content }) => {
          let strContent = String(content).trim();
          if (role === 'assistant' && strContent.length > 200) {
            strContent = strContent.slice(0, 200) + '...';
          }
          return {
            role: role === 'assistant' ? 'assistant' : 'user',
            content: strContent
          };
        })
    : [];

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...cleanedHistory,
    { role: 'user', content: trimmedQuery }
  ];

  // 🔍 PROMPT PAYLOAD BREAKDOWN LOGGER
  const systemPromptChars = systemPrompt.length;
  const contextChars = contextText.length;
  const historyChars = cleanedHistory.reduce((acc, m) => acc + m.content.length, 0);
  const questionChars = trimmedQuery.length;
  const totalPromptChars = systemPromptChars + historyChars + questionChars;

  console.log(`--- PROMPT PAYLOAD BREAKDOWN ---
System Prompt: ${systemPromptChars} chars (~${Math.round(systemPromptChars / 4)} est. tokens)
Context:       ${contextChars} chars (~${Math.round(contextChars / 4)} est. tokens)
History:       ${historyChars} chars (~${Math.round(historyChars / 4)} est. tokens, ${cleanedHistory.length} msgs)
User Question: ${questionChars} chars (~${Math.round(questionChars / 4)} est. tokens)
Total Payload: ${totalPromptChars} chars (~${Math.round(totalPromptChars / 4)} est. tokens)
--------------------------------`);

  const maxTokens = getDynamicMaxTokens(trimmedQuery);
  const temperature = 0.4;

  // ⚡ INSTANT FAILOVER & ZERO-DELAY KEY SELECTION STRATEGY
  const apiKeys = getApiKeys();

  if (apiKeys.length === 0) {
    console.warn("WARNING: No Groq API keys found in environment.");
    const fallbackText = generateFallbackReply(trimmedQuery, retrievedContext);
    const helpfulMessage = `Based on my portfolio:\n\n${fallbackText}\n\nThe AI service is temporarily busy, but here is the information available from my portfolio.`;
    return res.status(200).json({
      fallback: true,
      error: "AI service is temporarily busy. Please try again in a few moments.",
      sources: retrievedSources,
      actions: retrievedContext?.actions || [],
      message: helpfulMessage
    });
  }

  // Filter keys: Primary non-cooling keys first, then cooling keys as last resort
  const now = Date.now();
  const availableKeys = [];
  const coolingKeys = [];

  apiKeys.forEach((key, idx) => {
    const label = `Using Key #${idx + 1}`;
    const cooldownUntil = keyCooldownMap.get(key) || 0;
    if (now < cooldownUntil) {
      coolingKeys.push({ key, label, index: idx + 1, until: cooldownUntil });
    } else {
      availableKeys.push({ key, label, index: idx + 1 });
    }
  });

  // Sort cooling keys by earliest cooldown expiration
  coolingKeys.sort((a, b) => a.until - b.until);

  // Candidates list: primary active keys first, cooling keys last
  const candidateKeys = [...availableKeys, ...coolingKeys];

  let lastError = null;

  for (const candidate of candidateKeys) {
    const currentApiKey = candidate.key;
    const keyLabel = candidate.label;

    // ⚡ INSTANT SKIP IF KEY IS ON ACTIVE COOLDOWN (0 SECONDS DELAY!)
    if (isKeyOnCooldown(currentApiKey)) {
      const remainingSec = Math.ceil((keyCooldownMap.get(currentApiKey) - Date.now()) / 1000);
      console.log(`Skipping ${keyLabel} (On active cooldown for ${remainingSec}s more)...`);
      continue;
    }

    const isGroq = currentApiKey.startsWith('gsk_');
    const apiEndpoint = isGroq
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.x.ai/v1/chat/completions';
    const candidateModels = isGroq
      ? ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b']
      : ['grok-beta'];

    for (const apiModel of candidateModels) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentApiKey}`
          },
          body: JSON.stringify({
            model: apiModel,
            messages: formattedMessages,
            temperature: temperature,
            max_tokens: maxTokens,
            stream: false
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const replyText =
            data?.choices?.[0]?.message?.content ||
            'I apologize, but I could not generate a response right now.';
          const latency = Date.now() - startTime;

          // Clear cooldown if key succeeded
          keyCooldownMap.delete(currentApiKey);

          logMetrics({
            question: trimmedQuery,
            intent,
            entity,
            card,
            rawKeywords,
            expandedKeywords,
            confidence,
            cacheHit: false,
            retrievedChunks: chunkCount,
            historyCount: cleanedHistory.length,
            contextSize: contextText.length,
            keyUsed: `${keyLabel} (${apiModel})`,
            retries: 0,
            providerStatus: `${response.status} OK`,
            latency,
            completionTokens: data?.usage?.completion_tokens || 0,
            promptTokens: data?.usage?.prompt_tokens || 0,
            totalTokens: data?.usage?.total_tokens || 0
          });

          // Cache successful response
          responseCache.set(cacheKey, {
            message: replyText,
            sources: retrievedSources,
            actions: retrievedContext?.actions || [],
            timestamp: Date.now()
          });

          return res.status(200).json({
            fallback: false,
            sources: retrievedSources,
            actions: retrievedContext?.actions || [],
            message: replyText
          });
        }

        const errText = await response.text();

        // ⚡ 429 RATE LIMIT: Parse exact wait time from Groq, place on cooldown immediately, and break to next key!
        if (response.status === 429) {
          const parsedWaitMs = parseGroqRetryWaitMs(errText, response.headers);
          setKeyCooldown(currentApiKey, keyLabel, parsedWaitMs);
          console.warn(`429 on ${keyLabel}. Instantly switching to next available key...`);
          lastError = '429 Rate Limit';
          break; // Try next key
        }

        // 404 Model Not Found / Inaccessible: Try next candidate model without penalizing the key
        if (response.status === 404) {
          console.warn(`Model ${apiModel} not found on ${keyLabel} (404). Trying next fallback model...`);
          continue; // Try next candidateModel
        }

        // Transient 5xx errors (500, 502, 503, 504): Place on short 15s cooldown and switch key
        if (response.status >= 500) {
          setKeyCooldown(currentApiKey, keyLabel, 15000);
          console.warn(`Server Error ${response.status} on ${keyLabel}. Switching key...`);
          lastError = `HTTP ${response.status}`;
          break; // Try next key
        }

        // Non-retriable 4xx errors (400, 401, 403): Skip key
        console.error(`Client Error ${response.status} on ${keyLabel}:`, errText);
        lastError = `HTTP ${response.status}`;
        break; // Try next key
      } catch (error) {
        clearTimeout(timeoutId);
        const isTimeout = error.name === 'AbortError';
        console.error(`LLM Exception on ${keyLabel} (${apiModel}):`, isTimeout ? 'Timeout 15s' : error.message);
        lastError = isTimeout ? 'Timeout' : error.message;
        break; // Try next key
      }
    }
  }

  // STEP 8: DETERMINISTIC PORTFOLIO FALLBACK
  console.warn("All Groq API keys on cooldown or failed. Generating deterministic portfolio fallback response.");
  const fallbackAnswer = generateFallbackReply(trimmedQuery, retrievedContext);
  const fallbackMessage = `Based on my portfolio:\n\n${fallbackAnswer}\n\nThe AI service is temporarily busy, but here is the information available from my portfolio.`;

  logMetrics({
    question: trimmedQuery,
    intent,
    entity,
    card,
    rawKeywords,
    expandedKeywords,
    confidence,
    cacheHit: false,
    retrievedChunks: chunkCount,
    historyCount: cleanedHistory.length,
    contextSize: contextText.length,
    keyUsed: 'All Keys Failed (Fallback Used)',
    retries: 0,
    providerStatus: 'Fallback Active',
    latency: Date.now() - startTime,
    completionTokens: 0,
    promptTokens: 0,
    totalTokens: 0
  });

  return res.status(200).json({
    fallback: true,
    error: "AI service is temporarily busy. Please try again in a few moments.",
    sources: retrievedSources,
    actions: retrievedContext?.actions || [],
    message: fallbackMessage
  });
}

function logMetrics(m) {
  console.log(`--- AI SEARCH PERFORMANCE METRICS ---
Question:          "${m.question}"
Intent:            ${m.intent || 'General'}
Entity:            ${m.entity || 'General'}
Knowledge Card:    ${m.card || 'Default'}
Raw Keywords:      [${(m.rawKeywords || []).map((k) => `"${k}"`).join(', ')}]
Expanded Keywords: [${(m.expandedKeywords || []).map((k) => `"${k}"`).join(', ')}]
Confidence:        ${m.confidence || 0.85}
Cache Hit:         ${m.cacheHit}
Retrieved Chunks:  ${m.retrievedChunks}
History Count:     ${m.historyCount}
Context Size:      ${m.contextSize} chars
Key Used:          ${m.keyUsed}
Retries:           ${m.retries}
Provider Status:   ${m.providerStatus}
Latency:           ${m.latency}ms
Completion Tokens:  ${m.completionTokens}
Prompt Tokens:     ${m.promptTokens}
Total Tokens:      ${m.totalTokens}
-------------------------------------`);
}

// Local smart generator when API is offline or rate limited
function generateFallbackReply(query, context) {
  const q = normalizeCacheKey(query);

  const staticMatch = checkStaticQuery(q);
  if (staticMatch) {
    return staticMatch.message;
  }

  const generalKnowledgeKeywords = ['elon musk', 'who is', 'capital of', 'weather', 'recipe', 'president', 'movie', 'song', 'crypto', 'bitcoin'];
  const isGeneralQuery = generalKnowledgeKeywords.some((kw) => q.includes(kw)) && !q.includes('saquib') && !q.includes('incampus') && !q.includes('wonderkids');

  if (isGeneralQuery) {
    return `I'm designed to answer questions about **Saquib Sarfaraz**, including my projects, experience, skills, achievements, and portfolio. I can't answer general knowledge questions.`;
  }

  if (q.includes('hardest part') || q.includes('challenging') || q.includes('difficulty') || q.includes('obstacle')) {
    return `The most challenging part of building **InCampus** was architecting the real-time messaging system. I had to manage Socket.io connection heartbeats, user presence indicators, authentication token auto-rotations, and message delivery while keeping latency under 100ms.\n\nIt pushed me to think deeply about multi-tenant MongoDB aggregation pipelines, weighted feed indexing, and system scalability rather than just making it work on localhost.`;
  }

  if (q.includes('best project') || q.includes('strongest project') || q.includes('incampus')) {
    return `If I had to pick one project that best represents my skills, it would be **InCampus** (Live at [incampus.online](https://incampus.online)).\n\nInCampus is a private campus social platform that I built to make it easier for university students to connect, communicate, and share updates within their college community. It includes secure OAuth identity verification, real-time 1-to-1 messaging with sub-100ms latency, media uploads, and isolated campus feeds.\n\nThrough this project, I gained deep hands-on experience with React 19, Node.js, Express, MongoDB Atlas aggregation pipelines, JWT authentication, Socket.io, Cloudinary CDN, and production deployment workflows.`;
  }

  if (q.includes('ai') || q.includes('spend') || q.includes('audit')) {
    return `I built **AI Spend Audit** (Live at [ai-audit-lilac.vercel.app](https://ai-audit-lilac.vercel.app)) to solve a real problem development teams face: tracking and optimizing overlapping AI tool subscriptions.\n\nThe platform integrates the Groq AI LLM engine to automatically analyze subscription data, identify seat redundancies, recommend cost-saving optimizations, and generate shareable audit reports.`;
  }

  if (q.includes('confidential') || q.includes('government') || q.includes('wonderkids') || q.includes('intern') || q.includes('experience') || q.includes('work')) {
    return `Most recently, I completed a **Software Developer Internship at Confidential Government** (August 2026 – September 2026, Remote), where I contributed to software development and web-based solutions, backend functionality, administrative interfaces, and responsive user experiences.\n\nPreviously, I was a Web Developer Intern at **WonderKids Club** (June 2026 – August 2026) developing production educational platforms, and earlier at **Pizeonfly Pvt Ltd** developing full-stack modules with React.js and Node.js/Express.`;
  }

  if (q.includes('leadership') || q.includes('roles') || q.includes('campus mantri') || q.includes('co-chairperson') || q.includes('nsdc') || q.includes('nss') || q.includes('joint secretary') || q.includes('ignite')) {
    return `Here are my verified **Campus Leadership Roles**:\n\n1. 🌟 **Co-Chairperson** — NSDC, Jamia Hamdard (Sep 2025 – Aug 2026)\n   Supported student-led skill-building initiatives, workshops, and campus community engagement.\n\n2. 💻 **Campus Mantri** — GeeksforGeeks Campus Body, Jamia Hamdard (Dec 2024 – Feb 2026)\n   Fostered coding culture and connected 200+ students with competitions, peer learning, and hackathons.\n\n3. 🤝 **Joint Secretary** — Ignite Society, JHU (Sep 2024 – Apr 2025)\n   Co-managed society operations, visual communication, and event execution across campus activities.\n\n4. 🚀 **Creative Lead** — Ignite Society, JHU (Jan – Oct 2024)\n   Led creative initiatives, visual storytelling, event branding, and promotional design.`;
  }

  if (q.includes('skill') || q.includes('tech') || q.includes('stack')) {
    return `I work primarily across modern full-stack web technologies:\n\n- **Frontend**: React.js, JavaScript (ES6+), Tailwind CSS, Framer Motion, HTML5 & CSS3\n- **Backend & Systems**: Node.js, Express.js, Socket.io, PHP, Python\n- **Databases & Infrastructure**: MongoDB Atlas, Cloudinary CDN, Vercel, Render\n- **Tools**: Git, GitHub, Figma, VS Code`;
  }

  if (q.includes('hire') || q.includes('why')) {
    return `I enjoy building products that people can actually use. Rather than focusing only on academic projects, I've spent my time developing production-ready applications, experimenting with AI integrations, and completing software development internships at Confidential Government and WonderKids Club.\n\nI learn quickly, take full ownership of my work, and pay close attention to user experience.`;
  }

  if (q.includes('who are you') || q.includes('tell me about saquib') || q.includes('about yourself')) {
    return `Hi! I'm **Saquib Sarfaraz**, a Full Stack Developer and Computer Science Engineering student at Jamia Hamdard.\n\nI enjoy building products that solve real problems rather than just academic projects. Over the past year, I've worked on everything from AI-powered SaaS applications to real-time platforms and interactive web experiences.\n\nOne of my flagship projects is **InCampus**, a private campus social platform with real-time chat, authentication, and community features. I also built **AI Spend Audit**, which helps users analyze and optimize AI tool subscriptions.\n\nI recently completed software engineering internships at **Confidential Government** and **WonderKids Club**, contributing to production web applications and shipping features used by real users.`;
  }

  return `I specialize in product engineering, scalable SaaS web platforms (**InCampus**, **AI Spend Audit**), real-time socket engines, and interactive web tools. I recently completed a Software Developer Internship at **Confidential Government**.`;
}
