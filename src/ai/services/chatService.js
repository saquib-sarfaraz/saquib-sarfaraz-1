import { retrieveKnowledge } from '../rag/retrieve';
import { profileData } from '../../content/profile';

// Static answer router for client-side instant responses
function checkStaticClientQuery(query) {
  const q = (query || '').toLowerCase().trim();

  // 1. LinkedIn query
  if (q.includes('linkedin')) {
    return {
      text: `You can connect with Saquib on **LinkedIn**:\n\n💼 [LinkedIn Profile](${profileData.socials.linkedin})\n\nFeel free to send a connection request or message!`,
      sources: ['Contact', 'LinkedIn'],
      actions: [
        { type: 'external', url: profileData.socials.linkedin, label: 'Open LinkedIn Profile' },
        { type: 'external', url: `mailto:${profileData.socials.email}`, label: 'Send Direct Email' }
      ]
    };
  }

  // 2. GitHub query
  if (q.includes('github') || q.includes('repo') || q.includes('repositories')) {
    return {
      text: `Explore Saquib's open-source projects, repositories, and active code commits on **GitHub**:\n\n💻 [GitHub Profile](${profileData.socials.github})`,
      sources: ['Contact', 'GitHub'],
      actions: [
        { type: 'external', url: profileData.socials.github, label: 'Open GitHub Profile' },
        { type: 'scroll', target: 'projects', label: 'View Portfolio Projects' }
      ]
    };
  }

  // 3. Instagram query
  if (q.includes('instagram') || q.includes('insta')) {
    return {
      text: `Follow Saquib on **Instagram**:\n\n📷 [Instagram Profile](${profileData.socials.instagram})`,
      sources: ['Contact', 'Instagram'],
      actions: [
        { type: 'external', url: profileData.socials.instagram, label: 'Open Instagram Profile' }
      ]
    };
  }

  // 4. Contact / How to reach query
  if (q.includes('location') || q.includes('where do you live') || q.includes('where are you') || q.includes('riyadh') || q.includes('contact') || q.includes('reach') || q.includes('touch') || q.includes('email') || q.includes('mail') || q.includes('phone') || q.includes('social')) {
    return {
      text: `Here is how you can directly contact and connect with **Saquib Sarfaraz**:\n\n📧 **Email**: [${profileData.socials.email}](mailto:${profileData.socials.email})\n💼 **LinkedIn**: [linkedin.com/in/saquib-sarfaraz](https://www.linkedin.com/in/saquib-sarfaraz-1691b9292/)\n💻 **GitHub**: [github.com/saquib-sarfaraz](https://github.com/saquib-sarfaraz)\n📷 **Instagram**: [instagram.com/saquib.sarfaraz](https://www.instagram.com/saquib.sarfaraz?igsh=MTB0ZWdlbWZnMTQ1dA==)\n📍 **Work Preference**: ${profileData.location || 'Open to Remote / Relocation'}`,
      sources: ['Contact', 'Socials'],
      actions: [
        { type: 'external', url: `mailto:${profileData.socials.email}`, label: 'Send Direct Email' },
        { type: 'external', url: profileData.socials.linkedin, label: 'Open LinkedIn' },
        { type: 'external', url: profileData.socials.github, label: 'Open GitHub' },
        { type: 'scroll', target: 'contact', label: 'Go to Contact Form' }
      ]
    };
  }

  // 5. Resume / CV query
  if (q.includes('resume') || q.includes('cv') || q.includes('download resume')) {
    return {
      text: `View and download Saquib's official resume PDF:\n\n📄 [Download Resume PDF](${profileData.resumeUrl})\n\nIt details his education at Jamia Hamdard, Software Developer Internship at Confidential Government, WonderKids Club internship, full-stack technologies, and production SaaS projects.`,
      sources: ['Resume'],
      actions: [
        { type: 'resume', url: profileData.resumeUrl, label: 'Download Resume PDF' },
        { type: 'scroll', target: 'experience', label: 'View Experience' }
      ]
    };
  }

  // 6. Projects location query
  if (q.includes('where can i see your projects') || q.includes('see your projects') || q.includes('show projects')) {
    return {
      text: `You can explore all of Saquib's live projects directly on this portfolio:\n\n🚀 **InCampus**: Flagship University Social SaaS live at [incampus.online](https://incampus.online)\n💡 **AI Spend Audit**: Groq AI SaaS subscription optimizer live at [ai-audit-lilac.vercel.app](https://ai-audit-lilac.vercel.app)\n🎮 **XYXO Game**: Realtime multiplayer game in the Play Zone`,
      sources: ['Projects'],
      actions: [
        { type: 'scroll', target: 'projects', label: 'Explore Projects Section' },
        { type: 'external', url: 'https://incampus.online', label: 'Visit InCampus' },
        { type: 'external', url: 'https://ai-audit-lilac.vercel.app', label: 'Visit AI Spend Audit' }
      ]
    };
  }

  return null;
}

export async function sendChatMessage({ messages, query }) {
  // ⚡ 1. Pre-LLM Client Static Matcher (Instant 0-latency response)
  const staticResponse = checkStaticClientQuery(query);
  if (staticResponse) {
    return {
      text: staticResponse.text,
      sources: staticResponse.sources,
      actions: staticResponse.actions,
      fallback: false
    };
  }

  // 2. Local RAG Retrieval with multi-turn conversation history
  const retrievedContext = retrieveKnowledge(query, messages);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages,
        query,
        retrievedContext
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        text: data.message || 'No response content returned.',
        sources: data.sources || retrievedContext.sources,
        actions: data.actions && data.actions.length > 0 ? data.actions : retrievedContext.actions,
        fallback: data.fallback || false
      };
    }
  } catch (err) {
    console.warn('Network call to /api/chat failed, utilizing client-side RAG fallback:', err);
  }

  // Client-side fallback if server endpoint is unreachable
  const fallbackMessage = generateLocalFallbackText(query, retrievedContext);
  return {
    text: fallbackMessage,
    sources: retrievedContext.sources,
    actions: retrievedContext.actions,
    fallback: true
  };
}

function generateLocalFallbackText(query, retrievedContext) {
  const q = (query || '').toLowerCase().trim();

  // General knowledge refusal check
  const generalKnowledgeKeywords = ['elon musk', 'who is', 'capital of', 'weather', 'recipe', 'president', 'movie', 'song', 'crypto', 'bitcoin'];
  const isGeneralQuery = generalKnowledgeKeywords.some((kw) => q.includes(kw)) && !q.includes('saquib') && !q.includes('incampus') && !q.includes('wonderkids') && !q.includes('confidential') && !q.includes('government');

  if (isGeneralQuery) {
    return `I'm designed to answer questions about **Saquib Sarfaraz**, including my projects, experience, skills, achievements, and portfolio. I can't answer general knowledge questions.`;
  }

  if (q.includes('hardest part') || q.includes('challenging') || q.includes('difficulty') || q.includes('obstacle')) {
    return `The most challenging part of building **InCampus** was architecting the real-time messaging system. I had to manage Socket.io connection heartbeats, user presence indicators, authentication token auto-rotations, and message delivery while keeping latency under 100ms.\n\nIt pushed me to think deeply about multi-tenant MongoDB aggregation pipelines, weighted feed indexing, and system scalability rather than just making it work on localhost.`;
  }

  if (q.includes('best project') || q.includes('strongest project') || q.includes('incampus')) {
    return `**InCampus** is my flagship **Full Stack SaaS Product** (Live at [incampus.online](https://incampus.online)).\n\nI built it as a university-exclusive social network featuring isolated campus feeds, real-time 1-to-1 messaging, identity verification workflows, and automated moderation.\n\nTo make it scalable and responsive, I engineered it with React 19, Node.js, Express, MongoDB Atlas aggregation pipelines, Socket.io, Cloudinary CDN, and JWT OAuth 2.0. It achieves sub-100ms chat latency while maintaining zero feed leaks across distinct college privacy boundaries.`;
  }

  if (q.includes('ai') || q.includes('spend') || q.includes('audit')) {
    return `**AI Spend Audit** is a live SaaS platform I built (Live at [ai-audit-lilac.vercel.app](https://ai-audit-lilac.vercel.app)).\n\nIt helps startups and engineering teams analyze their AI subscription costs, detect overlapping tools, optimize team seat allocations, and generate shareable cost-saving reports using the Groq AI LLM engine.`;
  }

  if (q.includes('confidential') || q.includes('government') || q.includes('wonderkids') || q.includes('intern') || q.includes('experience') || q.includes('work')) {
    return `Most recently, I completed a **Software Developer Internship at Confidential Government** (August 2026 – September 2026, Remote), where I contributed to software development and web-based solutions, backend functionality, administrative interfaces, and responsive user experiences.\n\nPreviously, I worked as a Full Stack Developer Intern at **WonderKids Club** (June 2026 – August 2026) building production educational web applications and simulation modules, and as a Web Developer Intern at **Pizeonfly Pvt Ltd** developing React/Node.js production modules.`;
  }

  if (q.includes('skill') || q.includes('tech') || q.includes('stack')) {
    return `My core technical stack centers around modern full-stack JavaScript and web engineering:\n\n- **Frontend**: React.js, JavaScript (ES6+), Tailwind CSS, Framer Motion, HTML5 & CSS3\n- **Backend & Systems**: Node.js, Express.js, Socket.io, PHP, Python\n- **Databases & Infrastructure**: MongoDB Atlas, Cloudinary CDN, Vercel, Render\n- **Tools**: Git, GitHub, Figma, VS Code`;
  }

  if (q.includes('hire') || q.includes('why') || q.includes('about') || q.includes('who')) {
    return `Hi! I'm **Saquib Sarfaraz**, a Full Stack Developer and Computer Science Engineering student at Jamia Hamdard.\n\nWhat makes me stand out is that I've spent my time building production-ready applications instead of only classroom projects. Over the past year, I've built live SaaS platforms like **InCampus** and **AI Spend Audit**, and recently completed software engineering internships at **Confidential Government** and **WonderKids Club**.\n\nI enjoy solving practical problems, architecting real-time systems with Socket.io & MongoDB, and crafting polished web user experiences.`;
  }

  return `Hi! I'm **Saquib Sarfaraz**, a Full Stack Developer and Computer Science Engineering student at Jamia Hamdard.\n\nI specialize in product engineering, scalable SaaS web platforms (**InCampus**, **AI Spend Audit**), real-time socket engines, and interactive web tools. Recently, I completed a Software Developer Internship at **Confidential Government**.`;
}
