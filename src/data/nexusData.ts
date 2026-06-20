// ─── Community Nexus Data ────────────────────────────────────────────────────

export type NexusTab = 'chat' | 'threads' | 'milestones' | 'progression';

export type MemberStatus = 'engaged' | 'near-levelup' | 'momentum' | 'highvalue' | 'atrisk';

export interface NexusMember {
  id: string;
  username: string;
  avatar: string;
  level: number;
  levelTitle: string;
  daysActive: number;
  repPoints: number;
  repTarget: number;
  nextLevelTitle: string;
  milestone: string;
  milestoneIcon: string;
  badgeUnlocked?: string;
  nextChallenge: string;
  nextChallengePoints: number;
  announcement: string;
  dmDraft: string;
  status: MemberStatus;
  weeklyUpvotes?: number;
  streakDays?: number;
  progressPath: { action: string; points: number; time: string }[];
}

export interface NexusThread {
  id: string;
  authorUsername: string;
  authorLevel: number;
  authorLevelTitle: string;
  question: string;
  topic: string;
  hoursUnanswered: number;
  tags: string[];
  nexusResponse: string;
  ctaForAuthor?: string;
}

// ─── Members ─────────────────────────────────────────────────────────────────

export const NEXUS_MEMBERS: NexusMember[] = [
  {
    id: 'nm-1',
    username: 'TechLena',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechLena',
    level: 1,
    levelTitle: 'Newcomer',
    daysActive: 2,
    repPoints: 10,
    repTarget: 100,
    nextLevelTitle: 'Explorer',
    milestone: 'Posted her first question',
    milestoneIcon: '🌱',
    badgeUnlocked: 'First Step',
    nextChallenge: 'Answer one peer question to unlock 🧠 Curious Mind badge',
    nextChallengePoints: 50,
    announcement: "Hey everyone, let's give a warm welcome to **@TechLena**! 🎉 She just fired off her very first question on the platform — that takes courage, and that's exactly the kind of curiosity that makes this community worth being part of.",
    dmDraft: "Hey @TechLena! 👋 You've asked your first great question — that's a real milestone. This week's challenge: answer one peer question to unlock your 🧠 Curious Mind badge and earn +50 rep. Want me to recommend a thread you can help with right now?",
    status: 'engaged',
    progressPath: [
      { action: 'Answer 1 peer question', points: 50, time: '~15 mins' },
      { action: 'Complete your profile', points: 20, time: '~5 mins' },
      { action: 'Receive 3 upvotes', points: 15, time: 'Passive' },
      { action: 'Join a community', points: 5, time: '~1 min' },
    ],
  },
  {
    id: 'nm-2',
    username: 'RohanV',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RohanV',
    level: 3,
    levelTitle: 'Contributor',
    daysActive: 47,
    repPoints: 500,
    repTarget: 600,
    nextLevelTitle: 'Mentor',
    milestone: 'Hit 500 reputation points',
    milestoneIcon: '🎯',
    nextChallenge: 'Reply to 3 open technical threads this week to reach Lv 4 — Mentor',
    nextChallengePoints: 60,
    announcement: '🔥 **@RohanV** just crossed 500 reputation points — and he did it in under 47 days. Members who hit 500 rep this fast usually become the go-to voices in their niche. Keep your eye on this one. 👀',
    dmDraft: "Hey @RohanV! You're sitting at 500 rep points. Lv 4 — Mentor is just 100 points away. Reply to 3 technical threads this week and you're there. Want me to surface the top unanswered threads in your domain?",
    status: 'near-levelup',
    progressPath: [
      { action: 'Reply to 3 open threads', points: 60, time: '~45 mins' },
      { action: 'Receive 5 upvotes on any reply', points: 25, time: 'Passive' },
      { action: 'Nominate a peer for a badge', points: 10, time: '~2 mins' },
      { action: 'Solve an open bounty', points: 25, time: 'Variable' },
    ],
  },
  {
    id: 'nm-3',
    username: 'CircuitSam',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CircuitSam',
    level: 2,
    levelTitle: 'Explorer',
    daysActive: 18,
    repPoints: 210,
    repTarget: 300,
    nextLevelTitle: 'Contributor',
    milestone: 'Solved his first bounty',
    milestoneIcon: '⚡',
    badgeUnlocked: 'Bounty Hunter',
    nextChallenge: 'Solve 2 more bounties to earn 💡 Problem Solver badge + jump to Lv 3',
    nextChallengePoints: 90,
    announcement: '⚡ **@CircuitSam** just cracked his first bounty — 18 days in. That\'s not beginner energy, that\'s builder energy. You\'ve unlocked the 🏹 Bounty Hunter badge. Go check it out in your profile!',
    dmDraft: "Hey @CircuitSam! Your first bounty solve — that's massive. 🏹 Bounty Hunter badge is now in your profile. Solve 2 more to earn 💡 Problem Solver and jump to Lv 3 — Contributor. Want me to match you with a bounty based on your skillset?",
    status: 'momentum',
    progressPath: [
      { action: 'Solve 2 more bounties', points: 90, time: 'Variable' },
      { action: 'Answer 2 technical threads', points: 40, time: '~30 mins' },
      { action: 'Receive 5 upvotes', points: 25, time: 'Passive' },
    ],
  },
  {
    id: 'nm-4',
    username: 'Prof_Ayesha',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProfAyesha',
    level: 4,
    levelTitle: 'Mentor',
    daysActive: 134,
    repPoints: 1840,
    repTarget: 2000,
    nextLevelTitle: 'Legend',
    milestone: 'Reached a 7-day reply streak',
    milestoneIcon: '🔥',
    badgeUnlocked: 'On Fire',
    nextChallenge: 'Maintain streak to Day 14 + answer 3 threads = Legend tier unlocked',
    nextChallengePoints: 160,
    weeklyUpvotes: 40,
    streakDays: 7,
    announcement: '🔥 Seven days. Every single day. **@Prof_Ayesha** hasn\'t missed a beat — her replies this week alone generated 40+ upvotes across 6 threads. She\'s 160 points from Legend tier. The Hall of Fame is calling.',
    dmDraft: "Hey Ayesha 👋 — You're at 1,840 rep points. The Legend tier is 160 points away — and based on your activity this week, you could hit it by this weekend. Answer 3 threads (+60), maintain streak to Day 14 (+50), nominate a peer (+25), collect 5 upvotes (+25) = 160 pts = Legend. You've been one of the most consistent voices here for 134 days. Let's get you across the finish line. 🏁",
    status: 'highvalue',
    progressPath: [
      { action: 'Answer 3 open technical threads', points: 60, time: '~90 mins' },
      { action: 'Maintain streak through Day 14', points: 50, time: 'Keep going!' },
      { action: 'Nominate a peer for a badge', points: 25, time: '~2 mins' },
      { action: 'Collect 5 more upvotes', points: 25, time: 'Passive' },
    ],
  },
  {
    id: 'nm-5',
    username: 'NewbieNick',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NewbieNick',
    level: 0,
    levelTitle: 'Unverified',
    daysActive: 1,
    repPoints: 0,
    repTarget: 100,
    nextLevelTitle: 'Newcomer',
    milestone: 'Just joined today',
    milestoneIcon: '👋',
    nextChallenge: 'Complete profile (+20 rep) and drop your first reply to unlock Newcomer status',
    nextChallengePoints: 20,
    announcement: "Welcome **@NewbieNick** to the community! 👋 Day one — everything starts here. Let's make it a great one.",
    dmDraft: "Hey @NewbieNick, welcome — genuinely glad you're here! 👋 Here's a low-pressure way to start: ✅ Complete your profile (+20 rep) ✅ Browse 'Good First Questions' ✅ Drop a reply anywhere — even a 'this helped me too!' counts. Want me to recommend one thread for your first reply? No pressure, no rush. This community moves at your pace. 🙌",
    status: 'atrisk',
    progressPath: [
      { action: 'Complete your profile', points: 20, time: '~5 mins' },
      { action: 'Post your first reply', points: 10, time: '~5 mins' },
      { action: 'Receive your first upvote', points: 5, time: 'Passive' },
      { action: 'Join a community group', points: 5, time: '~1 min' },
    ],
  },
];

// ─── Unanswered Threads ──────────────────────────────────────────────────────

export const NEXUS_THREADS: NexusThread[] = [
  {
    id: 'nt-1',
    authorUsername: 'TechLena',
    authorLevel: 1,
    authorLevelTitle: 'Newcomer',
    question: 'Why does my I²C sensor stop responding after running for ~30 minutes? Using STM32 + BMP280.',
    topic: 'Embedded Systems',
    hoursUnanswered: 5,
    tags: ['I2C', 'STM32', 'BMP280', 'Embedded'],
    nexusResponse: `Hey @TechLena — great question, and you're definitely not alone on this one! Based on what our community solved last month, this is a classic symptom of one of three things. Let's figure this out together:\n\n**🔍 Most Likely Causes:**\n\n**1. Clock Stretching Timeout** — The STM32 HAL I²C driver has a default timeout. If the BMP280 stretches the clock longer than expected during a conversion, the peripheral can lock up silently. Try increasing your HAL_I2C_Master_Transmit timeout parameter.\n\n**2. Missing or Weak Pull-up Resistors** — I²C lines need external pull-ups (typically 4.7kΩ for 3.3V systems). Signal integrity degrades under thermal load — which explains the consistent 30-minute mark.\n\n**3. Bus Lock-up After NACK** — If a transmission is interrupted, the bus can lock. Add a software I²C bus recovery routine — toggle SCL 9 times to flush any stuck slave.\n\n**🛠 Quick Fix to try first:**\nHAL_I2C_DeInit(&hi2c1); → HAL_I2C_Init(&hi2c1);\n\nThis forces a peripheral reset without a full system reboot. Many community members resolved the 30-minute lockup with exactly this.\n\nHas anyone else tackled I²C lockup on STM32 recently? Drop your fix below! 👇`,
    ctaForAuthor: "Hey @TechLena! You've asked your first great question 🌱 Answer one peer question this week to unlock your 🧠 Curious Mind badge (+50 rep). Want me to find a thread you can help with?",
  },
  {
    id: 'nt-2',
    authorUsername: 'CircuitSam',
    authorLevel: 2,
    authorLevelTitle: 'Explorer',
    question: 'Best approach for EMI shielding on a 4-layer PCB with a switching regulator at 400kHz?',
    topic: 'PCB Design',
    hoursUnanswered: 6,
    tags: ['EMI', 'PCB', 'Power Electronics', 'Shielding'],
    nexusResponse: `Hey @CircuitSam — solid design question, and the 400kHz range is exactly where things get interesting. Based on what our community and Würth Elektronik's application notes have covered, here's the structured approach:\n\n**🛡 Recommended Stackup:**\nLayer 1 — Signal + Switching components (tight loops!)\nLayer 2 — Ground plane (unbroken, directly beneath L1) ← Your primary EMI weapon\nLayer 3 — Power plane\nLayer 4 — Signal (low-speed, away from switching nodes)\n\n**⚡ Key Layout Rules:**\n• Keep the hot loop (switch node → inductor → output cap → GND) as small as possible\n• Never route sensitive signals beneath the switching node\n• Use a pour guard / keepout around the SW node on all layers\n• Stitch vias around the board perimeter every λ/20\n\n**🔩 Component Pick:**\nWürth Elektronik's WE-MAPI and WE-SFIA series inductors are shielded and specifically characterized for this frequency range — a community favourite for this exact use case.\n\nAny power layout veterans want to add their preferred stackup? The more real-world examples, the better! 👇`,
  },
  {
    id: 'nt-3',
    authorUsername: 'NewbieNick',
    authorLevel: 0,
    authorLevelTitle: 'Unverified',
    question: "What's the difference between a working student position and an internship at a tech company?",
    topic: 'Career',
    hoursUnanswered: 4.5,
    tags: ['Career', 'Internship', 'Working Student', 'Germany'],
    nexusResponse: `Welcome to the community, @NewbieNick — and don't let anyone tell you this is a "basic" question. It trips a lot of people up outside the European tech ecosystem. Let's break it down clearly:\n\n**🎓 Internship (Praktikum)**\n• Fixed term, typically 3–6 months\n• Full-time commitment (40hrs/week)\n• Often mandatory as part of a degree programme\n• Focused on a single project or rotation\n\n**💼 Working Student (Werkstudent)**\n• Ongoing, part-time role (15–20hrs/week)\n• Must be actively enrolled as a student\n• Can last 1–2+ years alongside your studies\n• More responsibility, deeper team integration\n• Often converts to a full-time offer upon graduation\n\n**Which is better?** Depends on your goal. If you want depth and a long-term foot in the door — working student. If you want breadth and a structured sprint — internship.\n\nOur Jobs board has both types listed from Würth Elektronik right now if you want to compare real postings side by side! 🔍\n\nHas anyone here done both? Would love your comparison in the replies! 👇`,
    ctaForAuthor: "Hey @NewbieNick! Great first question 👋 Complete your profile this week to earn +20 rep and unlock Newcomer status. Want me to recommend a thread you can answer to earn your first points?",
  },
];

// ─── Announcement feed ────────────────────────────────────────────────────────

export const NEXUS_ANNOUNCEMENTS: { icon: string; text: string; time: string }[] = [
  { icon: '🌱', text: '@TechLena posted her very first question — welcome her and help her grow!', time: '5h ago' },
  { icon: '⚡', text: '@CircuitSam just solved his first bounty — 18 days in. Absolute builder energy.', time: '6h ago' },
  { icon: '🔥', text: "@Prof_Ayesha is on a 7-day streak with 40+ upvotes this week. Legend tier incoming.", time: '1h ago' },
  { icon: '🎯', text: '@RohanV crossed 500 reputation points in under 47 days. Watch this space.', time: '3h ago' },
  { icon: '👋', text: "@NewbieNick just joined — let's make them feel welcome!", time: '2h ago' },
];

// ─── Status config ────────────────────────────────────────────────────────────

export const STATUS_CONFIG: Record<MemberStatus, { label: string; color: string; dot: string }> = {
  'engaged':     { label: 'Engaged',      color: 'bg-green-500/10 text-green-400 border-green-400/20',    dot: 'bg-green-400' },
  'near-levelup':{ label: 'Near Level-Up',color: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20', dot: 'bg-yellow-400' },
  'momentum':    { label: 'Momentum',     color: 'bg-blue-500/10 text-blue-400 border-blue-400/20',       dot: 'bg-blue-400' },
  'highvalue':   { label: 'High Value',   color: 'bg-accent/10 text-[#f2a0a0] border-accent/20',          dot: 'bg-accent' },
  'atrisk':      { label: 'At Risk',      color: 'bg-red-500/10 text-red-400 border-red-400/20',          dot: 'bg-red-400' },
};
