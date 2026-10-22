import aboutData from '../knowledge/about.json' with { type: 'json' };
import projectsData from '../knowledge/projects.json' with { type: 'json' };
import experienceData from '../knowledge/experience.json' with { type: 'json' };
import skillsData from '../knowledge/skills.json' with { type: 'json' };
import gamesData from '../knowledge/games.json' with { type: 'json' };
import contactData from '../knowledge/contact.json' with { type: 'json' };
import resumeData from '../knowledge/resume.json' with { type: 'json' };
import leadershipData from '../knowledge/leadership.json' with { type: 'json' };

export function retrieveKnowledge(query = '', history = []) {
  const historyText = Array.isArray(history)
    ? history.slice(-4).map((m) => m.content || '').join(' ')
    : '';

  const q = (query || '').toLowerCase().trim();
  const fullContextText = `${q} ${historyText.toLowerCase()}`;

  const matchedSources = new Set();
  const retrievedSections = [];
  const suggestedActions = [];

  const rawKeywords = [];
  const expandedKeywords = [];

  const checkRaw = (...keywords) => {
    const found = keywords.filter((kw) => {
      const lowerKw = kw.toLowerCase();
      if (lowerKw.length <= 3) {
        return new RegExp(`\\b${lowerKw}\\b`, 'i').test(q);
      }
      return q.includes(lowerKw);
    });
    if (found.length > 0) {
      rawKeywords.push(...found);
      return true;
    }
    return false;
  };

  const checkExpanded = (...keywords) => {
    const found = keywords.filter((kw) => {
      const lowerKw = kw.toLowerCase();
      if (lowerKw.length <= 3) {
        return new RegExp(`\\b${lowerKw}\\b`, 'i').test(fullContextText);
      }
      return fullContextText.includes(lowerKw);
    });
    if (found.length > 0) {
      expandedKeywords.push(...found);
      return true;
    }
    return false;
  };

  // 🕵️ 1. UNKNOWN PERSON / ENTITY CHECK (Strict No-Hallucination)
  const unknownPersonKeywords = ['nemat', 'taj', 'sam', 'john', 'alex', 'rahul', 'priya', 'rohit'];
  const foundUnknownPerson = unknownPersonKeywords.find((name) => q.includes(name));

  if (foundUnknownPerson) {
    const nameCap = foundUnknownPerson.charAt(0).toUpperCase() + foundUnknownPerson.slice(1);
    return {
      query,
      intent: 'UnknownPerson',
      entity: nameCap,
      card: 'About > Unknown Person',
      rawKeywords: [foundUnknownPerson],
      expandedKeywords: [],
      confidence: 1.0,
      unknownPerson: true,
      sources: ['About'],
      retrievedSections: [],
      actions: [
        { type: 'scroll', target: 'about', label: 'About Saquib' }
      ],
      unknownMessage: `I don't have any information about **${nameCap}** in my portfolio context. If you're referring to a colleague, classmate, or project collaborator, feel free to tell me who you mean!`
    };
  }

  // ❓ 2. AMBIGUOUS PROJECT QUERY CHECK (Clarification Guardrail)
  const isAmbiguousProject =
    (q.includes('architecture') || q.includes('backend') || q.includes('show project') || q.includes('project code') || q.includes('explain project')) &&
    !q.includes('incampus') &&
    !q.includes('spend') &&
    !q.includes('audit') &&
    !q.includes('xyxo') &&
    !q.includes('wonderkids');

  if (isAmbiguousProject) {
    return {
      query,
      intent: 'AmbiguousProject',
      entity: 'Multiple Projects',
      card: 'Clarification > Select Project',
      rawKeywords: Array.from(new Set(rawKeywords)),
      expandedKeywords: [],
      confidence: 1.0,
      needsClarification: true,
      sources: ['Projects'],
      retrievedSections: [],
      actions: [
        { type: 'scroll', target: 'projects', label: 'InCampus (Social SaaS)' },
        { type: 'scroll', target: 'projects', label: 'AI Spend Audit (AI SaaS)' },
        { type: 'scroll', target: 'projects', label: 'XYXO (Game Engine)' }
      ],
      clarificationMessage: `Which project's architecture would you like to explore?\n\n• **InCampus**: Private campus social network with Socket.io real-time chat & MongoDB pipelines\n• **AI Spend Audit**: Groq AI SaaS platform for subscription cost optimization\n• **XYXO**: Server-authoritative realtime multiplayer game engine`
    };
  }

  // 🚫 2B. OUT-OF-SCOPE / GENERAL KNOWLEDGE REFUSAL CHECK
  const generalKnowledgeQueries = [
    'capital of', 'weather in', 'president of', 'prime minister', 'who won', 'population of',
    'recipe for', 'how to cook', 'crypto price', 'bitcoin price', 'stock price',
    'who is elon musk', 'who is sundar pichai', 'who is bill gates', 'who is sam altman'
  ];
  const isGeneralKnowledge = generalKnowledgeQueries.some((term) => q.includes(term)) &&
    !q.includes('saquib') && !q.includes('incampus') && !q.includes('portfolio') && !q.includes('hamdard');

  if (isGeneralKnowledge) {
    return {
      query,
      intent: 'OutOfScope',
      entity: 'General Knowledge',
      card: 'Policy > Portfolio Only',
      rawKeywords: [],
      expandedKeywords: [],
      confidence: 1.0,
      outOfScope: true,
      sources: ['Policy'],
      retrievedSections: [],
      actions: [
        { type: 'scroll', target: 'about', label: 'About Saquib' },
        { type: 'scroll', target: 'projects', label: 'View Projects' }
      ],
      outOfScopeMessage: "I am designed specifically to answer questions about **Saquib Sarfaraz**, his portfolio, projects, experience, skills, and background. I can't assist with general knowledge topics, but feel free to ask about his work!"
    };
  }

  // 🎯 3. INTENT DETECTION (RAW QUERY KEYWORDS FIRST)
  let detectedIntent = 'General';
  if (checkRaw('architecture', 'backend', 'system', 'tech', 'how', 'database', 'socket', 'auth', 'challenge', 'hardest', 'obstacle')) {
    detectedIntent = 'Technical';
  } else if (checkRaw('hire', 'why', 'recruiter', 'experience', 'internship', 'background', 'yourself', 'tell me about yourself', 'introduce', 'strengths')) {
    detectedIntent = 'Recruiter';
  } else if (checkRaw('hi', 'hello', 'hey', 'naam', 'hindi', 'thanks', 'thank you')) {
    detectedIntent = 'Casual';
  } else if (checkRaw('project', 'build', 'built', 'incampus', 'ai spend', 'xyxo')) {
    detectedIntent = 'Project';
  }

  // 🧠 4. TOPIC MEMORY & ENTITY RESOLUTION
  let activeProject = null;
  let entityName = 'Saquib Sarfaraz';

  if (checkRaw('incampus', 'campus social') || checkExpanded('incampus', 'campus social')) {
    activeProject = projectsData.find((p) => p.id === 'incampus');
    entityName = 'InCampus';
  } else if (checkRaw('ai spend', 'spend audit', 'subscription cost') || checkExpanded('ai spend', 'spend audit')) {
    activeProject = projectsData.find((p) => p.id === 'ai-spend-audit');
    entityName = 'AI Spend Audit';
  } else if (checkRaw('xyxo', 'tic-tac-toe', 'multiplayer game') || checkExpanded('xyxo', 'tic-tac-toe')) {
    activeProject = projectsData.find((p) => p.id === 'xyxo');
    entityName = 'XYXO Engine';
  }

  // 🃏 5. PROGRESSIVE HAND-CRAFTED KNOWLEDGE CARDS
  let cardTitle = 'About > Profile Summary';
  let confidenceScore = 0.85;

  // 🎯 RECRUITER PITCH CARD: "Why Should I Hire You?"
  if (checkRaw('why i hire', 'why hire', 'why should we hire', 'why hire u', 'what makes you different', 'value proposition', 'why choose you')) {
    confidenceScore = 0.99;
    cardTitle = 'Recruiter > Why Hire Me';
    entityName = 'Value Proposition';
    const whyHireCard = {
      valueProposition: 'I build production-ready applications that solve real problems rather than just academic projects.',
      provenImpact: 'Built InCampus (incampus.online) and AI Spend Audit (ai-audit-lilac.vercel.app), and completed software engineering internships at Confidential Government and WonderKids Club.',
      ownership: 'Full-stack ownership across React frontend, Node.js/Express backend, MongoDB aggregation, and Socket.io real-time infrastructure.',
      speedAndMindset: 'Fast learner, self-driven, focused on clean UI/UX and scalable code.'
    };
    retrievedSections.push({ title: cardTitle, data: whyHireCard });
    matchedSources.add('Recruiter Pitch');
    suggestedActions.push({ type: 'scroll', target: 'experience', label: 'View Experience & Impact' });
  } else if (checkRaw('yourself', 'introduce', 'about yourself', 'who are you', 'tell me about yourself', 'background')) {
    // 🎯 RECRUITER INTRO CARD: "Tell Me About Yourself" (Elevator Pitch Style)
    confidenceScore = 0.98;
    cardTitle = 'About > Recruiter Intro';
    const recruiterIntroCard = {
      name: 'Saquib Sarfaraz',
      title: 'Full Stack Developer & CSE Student at Jamia Hamdard',
      internship: 'Software Developer Intern at Confidential Government (August 2026 - September 2026, Remote)',
      flagshipProjects: 'InCampus (incampus.online), AI Spend Audit (ai-audit-lilac.vercel.app)',
      coreStack: 'React.js, Node.js, Express.js, MongoDB Atlas, Socket.io, Tailwind CSS',
      elevatorPitch: 'Building production-ready SaaS web platforms with full product ownership from idea to live deployment.'
    };
    retrievedSections.push({ title: cardTitle, data: recruiterIntroCard });
    matchedSources.add('About');
    suggestedActions.push({ type: 'scroll', target: 'about', label: 'About Me' });
  } else if (activeProject) {
    confidenceScore = 0.95;
    matchedSources.add('Projects');
    suggestedActions.push(...(activeProject.actions || []));

    const isArch = checkRaw('architecture', 'backend', 'system', 'tech', 'how', 'database', 'socket', 'auth');
    const isChallenge = checkRaw('challenge', 'hardest', 'obstacle', 'problem', 'difficulty');
    const isImpact = checkRaw('result', 'impact', 'metric', 'user');

    let aspectCard = { title: activeProject.title, tagline: activeProject.subtitle };

    if (isArch && activeProject.architecture) {
      cardTitle = `${activeProject.title} > Architecture & Tech`;
      aspectCard.architecture = activeProject.architecture;
      aspectCard.approach = activeProject.approach;
      aspectCard.techStack = activeProject.tags;
      retrievedSections.push({ title: cardTitle, data: aspectCard });
    } else if (isChallenge && activeProject.challenge) {
      cardTitle = `${activeProject.title} > Engineering Challenges`;
      aspectCard.challenge = activeProject.challenge;
      aspectCard.approach = activeProject.approach;
      retrievedSections.push({ title: cardTitle, data: aspectCard });
    } else if (isImpact && activeProject.results) {
      cardTitle = `${activeProject.title} > Impact & Outcomes`;
      aspectCard.results = activeProject.results;
      aspectCard.summary = activeProject.summary;
      retrievedSections.push({ title: cardTitle, data: aspectCard });
    } else {
      cardTitle = `${activeProject.title} > Overview`;
      aspectCard.summary = activeProject.summary;
      aspectCard.overview = activeProject.overview;
      aspectCard.demoUrl = activeProject.demoUrl;
      retrievedSections.push({ title: cardTitle, data: aspectCard });
    }
  } else if (checkRaw('project', 'build', 'built', 'work', 'code', 'repo', 'saas', 'show projects', 'see projects')) {
    confidenceScore = 0.92;
    cardTitle = 'Projects > Summary List';
    const compactProjects = projectsData.map((p) => ({ title: p.title, summary: p.summary, demoUrl: p.demoUrl }));
    retrievedSections.push({ title: cardTitle, data: compactProjects });
    matchedSources.add('Projects');
    suggestedActions.push({ type: 'scroll', target: 'projects', label: 'Explore Projects Section' });
  }

  // 6. EXPERIENCE & INTERNSHIP MATCHING
  if (checkRaw('internship', 'confidential', 'government', 'wonderkids', 'pizeonfly', 'experience', 'work history', 'company', 'job', 'role', 'current')) {
    if (!matchedSources.has('Experience') && retrievedSections.length === 0) {
      confidenceScore = 0.94;
      cardTitle = 'Experience > Confidential Gov & WonderKids';
      entityName = 'Confidential Government';
      retrievedSections.push({ title: cardTitle, data: experienceData });
      matchedSources.add('Experience');
      suggestedActions.push({ type: 'scroll', target: 'experience', label: 'View Experience Section' });
    }
  }

  // 6B. LEADERSHIP MATCHING
  if (checkRaw('leadership', 'leader', 'campus mantri', 'gfg', 'geeksforgeeks', 'co-chairperson', 'nsdc', 'nss', 'ignite', 'joint secretary', 'design secretary', 'creative lead', 'society', 'extracurricular', 'campus role')) {
    if (!matchedSources.has('Leadership') && retrievedSections.length === 0) {
      confidenceScore = 0.96;
      cardTitle = 'Leadership > Campus Leadership & Initiatives';
      entityName = 'Campus Leadership';
      retrievedSections.push({ title: cardTitle, data: leadershipData });
      matchedSources.add('Leadership');
      suggestedActions.push({ type: 'scroll', target: 'leadership', label: 'View Campus Leadership' });
    }
  }

  // 7. SKILLS MATCHING
  if (checkRaw('skill', 'tech', 'stack', 'react', 'node', 'express', 'mongo', 'python', 'php', 'backend', 'frontend', 'database')) {
    if (!matchedSources.has('Skills') && retrievedSections.length === 0) {
      cardTitle = 'Skills > Stack Overview';
      retrievedSections.push({ title: cardTitle, data: skillsData });
      matchedSources.add('Skills');
      suggestedActions.push({ type: 'scroll', target: 'skills', label: 'View Skills Section' });
    }
  }

  // 8. CONTACT & RESUME MATCHING
  if (checkRaw('contact', 'email', 'touch', 'reach', 'linkedin', 'github', 'social', 'location', 'phone', 'mail')) {
    if (!matchedSources.has('Contact') && retrievedSections.length === 0) {
      cardTitle = 'Contact > Profile Details';
      retrievedSections.push({ title: cardTitle, data: contactData });
      matchedSources.add('Contact');
      suggestedActions.push(...(contactData.actions || []));
    }
  }

  if (checkRaw('resume', 'cv', 'download', 'education', 'jamia')) {
    if (!matchedSources.has('Resume') && retrievedSections.length === 0) {
      cardTitle = 'Resume > PDF Overview';
      retrievedSections.push({ title: cardTitle, data: resumeData });
      matchedSources.add('Resume');
      suggestedActions.push(...(resumeData.actions || []));
    }
  }

  // Fallback to static about info if no specific sections matched
  if (retrievedSections.length === 0) {
    cardTitle = 'About > Profile Summary';
    retrievedSections.push({ title: cardTitle, data: aboutData });
    matchedSources.add('About');
  }

  // Deduplicate actions by type/id/url
  const uniqueActions = [];
  const actionKeys = new Set();
  for (const act of suggestedActions) {
    const key = `${act.type}:${act.id || act.target || act.url || act.label}`;
    if (!actionKeys.has(key)) {
      actionKeys.add(key);
      uniqueActions.push(act);
    }
  }

  return {
    query,
    intent: detectedIntent,
    entity: entityName,
    card: cardTitle,
    rawKeywords: Array.from(new Set(rawKeywords)),
    expandedKeywords: Array.from(new Set(expandedKeywords)),
    confidence: confidenceScore,
    sources: Array.from(matchedSources),
    retrievedSections,
    actions: uniqueActions
  };
}
