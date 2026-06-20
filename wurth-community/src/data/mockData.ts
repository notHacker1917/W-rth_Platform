import type { User, Post, Job, Project, Bounty, LectureMaterial, StudentInitiative, QAChannel, Deadline } from '../types';

// ─── Users ─────────────────────────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    role: 'student',
    name: 'Priya Nair',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    headline: 'CS Senior @ Carnegie Mellon · Full-stack & ML',
    location: 'Pittsburgh, PA',
    university: 'Carnegie Mellon University',
    graduationYear: 2026,
    skills: ['TypeScript', 'React', 'Python', 'PyTorch', 'PostgreSQL'],
    followersCount: 412,
    followingCount: 188,
    bio: 'Building things at the intersection of systems and intelligence. Open to SWE and ML internships for Summer 2026.',
    joinedAt: '2024-09-01',
  },
  {
    id: 'u2',
    role: 'student',
    name: 'Marcus Webb',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    headline: 'Product Design · UC San Diego · 2025',
    location: 'San Diego, CA',
    university: 'UC San Diego',
    graduationYear: 2025,
    skills: ['Figma', 'React', 'CSS', 'User Research', 'Prototyping'],
    followersCount: 289,
    followingCount: 143,
    bio: 'Designer who codes. Interested in how interfaces shape behavior at scale.',
    joinedAt: '2024-01-15',
  },
  {
    id: 'u3',
    role: 'student',
    name: 'Aisha Kamara',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
    headline: 'Data Science @ UT Austin · Class of 2026',
    location: 'Austin, TX',
    university: 'University of Texas at Austin',
    graduationYear: 2026,
    skills: ['Python', 'SQL', 'Tableau', 'R', 'Machine Learning'],
    followersCount: 174,
    followingCount: 96,
    bio: 'Turning messy data into clear decisions. Passionate about climate tech and civic data.',
    joinedAt: '2024-03-10',
  },
  {
    id: 'u4',
    role: 'company',
    name: 'Meridian Labs',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=ML&backgroundColor=2563eb',
    headline: 'Developer tools for the next generation of engineers',
    location: 'San Francisco, CA',
    industry: 'Developer Tools / SaaS',
    size: '51–200 employees',
    website: 'https://meridianlabs.dev',
    followersCount: 3820,
    followingCount: 41,
    bio: 'We build infrastructure that helps engineering teams ship faster. Always looking for curious people.',
    joinedAt: '2023-06-01',
  },
  {
    id: 'u5',
    role: 'company',
    name: 'GreenPulse',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=GP&backgroundColor=16a34a',
    headline: 'Climate tech powering a sustainable future',
    location: 'Boston, MA',
    industry: 'Climate Tech',
    size: '11–50 employees',
    website: 'https://greenpulse.io',
    followersCount: 1240,
    followingCount: 22,
    bio: 'Our platform helps cities track and reduce carbon emissions in real time. Hiring passionate mission-driven engineers.',
    joinedAt: '2023-11-15',
  },
  {
    id: 'u6',
    role: 'company',
    name: 'Stackform',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=SF&backgroundColor=7c3aed',
    headline: 'No-code infrastructure, built for teams',
    location: 'New York, NY',
    industry: 'Enterprise SaaS',
    size: '201–500 employees',
    website: 'https://stackform.com',
    followersCount: 6110,
    followingCount: 80,
    bio: 'Stackform replaces your tangled internal tools with one coherent platform. Used by 4,000+ teams worldwide.',
    joinedAt: '2022-04-10',
  },
];

  {
    id: 'u7',
    role: 'educator',
    name: 'Prof. Elena Hartmann',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    headline: 'Chair of Electrical Engineering · TU Munich',
    location: 'Munich, Germany',
    university: 'Technical University of Munich',
    followersCount: 1847,
    followingCount: 63,
    bio: 'Professor and department chair overseeing 14 research groups. Bridging academia and industry through student-industry collaboration programmes since 2018.',
    joinedAt: '2023-10-01',
  },
];

export const STUDENT_USERS = MOCK_USERS.filter(u => u.role === 'student');
export const COMPANY_USERS = MOCK_USERS.filter(u => u.role === 'company');
export const EDUCATOR_USERS = MOCK_USERS.filter(u => u.role === 'educator');

// Helper
export const getUserById = (id: string): User | undefined =>
  MOCK_USERS.find(u => u.id === id);

// ─── Posts ─────────────────────────────────────────────────────────────────

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    authorId: 'u4',
    type: 'text',
    content:
      "We're opening 3 summer internship spots for backend engineers. If you've shipped something real and enjoy working close to the metal — apply. We move fast and give interns real ownership.\n\n👇 Link in the Jobs tab.",
    likes: 184,
    likedBy: ['u1', 'u3'],
    comments: [
      {
        id: 'c1',
        authorId: 'u1',
        content: 'Just applied! Love what you all are building with the CI pipeline tooling.',
        createdAt: '2026-06-18T10:22:00Z',
        likes: 4,
      },
    ],
    shares: 27,
    createdAt: '2026-06-18T08:00:00Z',
    tags: ['hiring', 'internship', 'backend'],
  },
  {
    id: 'p2',
    authorId: 'u1',
    type: 'image',
    content:
      'Shipped my final project for Advanced Systems this semester — a distributed key-value store written in Go with Raft consensus. 4 weeks, a lot of late nights, and exactly zero memory leaks (eventually).',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    likes: 312,
    likedBy: ['u2', 'u4', 'u5'],
    comments: [
      {
        id: 'c2',
        authorId: 'u4',
        content: 'This is impressive work — have you considered Go for backend roles? We use it heavily.',
        createdAt: '2026-06-17T14:05:00Z',
        likes: 7,
      },
      {
        id: 'c3',
        authorId: 'u2',
        content: 'Congrats Priya!! 🎉',
        createdAt: '2026-06-17T14:30:00Z',
        likes: 2,
      },
    ],
    shares: 44,
    createdAt: '2026-06-17T12:00:00Z',
    tags: ['Go', 'distributed-systems', 'projects'],
  },
  {
    id: 'p3',
    authorId: 'u5',
    type: 'link',
    content:
      "We just published our 2026 Climate Tech Talent Report. One finding that stood out: 68% of climate startups say hiring is their #1 bottleneck. Platforms like this one are part of the solution.",
    linkPreview: {
      url: 'https://greenpulse.io/report-2026',
      title: '2026 Climate Tech Talent Report — GreenPulse',
      description:
        'Key hiring trends, salary benchmarks, and the skills gap facing climate-focused companies.',
      imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
    },
    likes: 97,
    likedBy: ['u3'],
    comments: [],
    shares: 33,
    createdAt: '2026-06-16T09:30:00Z',
    tags: ['climate', 'hiring', 'report'],
  },
  {
    id: 'p4',
    authorId: 'u2',
    type: 'text',
    content:
      "Hot take: most onboarding flows treat first-time users like they already know what the product does. The best ones I've seen start with a single question — 'what are you trying to accomplish?' — and build from there.\n\nWhat's the most thoughtful onboarding you've encountered?",
    likes: 228,
    likedBy: ['u1', 'u6'],
    comments: [
      {
        id: 'c4',
        authorId: 'u6',
        content: "Notion's early onboarding was the gold standard for us — they got out of the way immediately.",
        createdAt: '2026-06-15T20:10:00Z',
        likes: 11,
      },
    ],
    shares: 19,
    createdAt: '2026-06-15T18:00:00Z',
    tags: ['design', 'ux', 'product'],
  },
  {
    id: 'p5',
    authorId: 'u3',
    type: 'text',
    content:
      "Built a dashboard in a weekend that tracks Austin's real-time air quality + overlays it against traffic and weather data. Surprised by how strongly particulate matter correlates with Tuesday morning rush hour specifically.\n\nOpen-sourcing it next week.",
    likes: 157,
    likedBy: ['u1', 'u5'],
    comments: [],
    shares: 22,
    createdAt: '2026-06-14T11:00:00Z',
    tags: ['data', 'climate', 'open-source'],
  },
  {
    id: 'p6',
    authorId: 'u6',
    type: 'text',
    content:
      "We crossed 4,000 teams on Stackform this month. When we started, our bet was that internal tooling was broken in a way nobody wanted to talk about. Turns out, a lot of people wanted to talk about it.\n\nHuge thanks to the engineering team and to every team that gave us candid feedback early.",
    likes: 541,
    likedBy: ['u2'],
    comments: [
      {
        id: 'c5',
        authorId: 'u2',
        content: "Big congrats! Stackform's component library was genuinely the best DX I've used for internal tools.",
        createdAt: '2026-06-13T16:00:00Z',
        likes: 14,
      },
    ],
    shares: 88,
    createdAt: '2026-06-13T14:00:00Z',
    tags: ['milestone', 'product'],
  },
];

// ─── Jobs ──────────────────────────────────────────────────────────────────

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    companyId: 'u4',
    title: 'Backend Engineering Intern',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Internship',
    salary: '$45–55 / hr',
    description:
      'Join our core platform team to help build the infrastructure that thousands of engineering teams rely on daily. You will own meaningful features end-to-end, write code that ships to production, and get mentorship from senior engineers.',
    requirements: [
      'Enrolled in a CS or related degree program',
      'Proficiency in Go, Rust, or C++',
      'Familiarity with distributed systems concepts',
      'Strong debugging and systems-thinking skills',
    ],
    tags: ['Go', 'Rust', 'Distributed Systems', 'Backend', 'Internship'],
    postedAt: '2026-06-18T08:00:00Z',
    applicationCount: 38,
    appliedBy: [],
  },
  {
    id: 'j2',
    companyId: 'u5',
    title: 'Data Engineer (Full-time)',
    location: 'Boston, MA (On-site)',
    type: 'Full-time',
    salary: '$120,000–$145,000',
    description:
      'GreenPulse is hiring a Data Engineer to expand our real-time emissions tracking pipeline. You will design and maintain the ingestion layer that processes billions of sensor events per month from city infrastructure partners.',
    requirements: [
      '2+ years of data engineering experience',
      'Strong Python and SQL',
      'Experience with streaming systems (Kafka, Flink, or similar)',
      'Passion for climate or civic tech a strong plus',
    ],
    tags: ['Python', 'SQL', 'Kafka', 'Data Engineering', 'Climate'],
    postedAt: '2026-06-15T09:00:00Z',
    applicationCount: 24,
    appliedBy: [],
  },
  {
    id: 'j3',
    companyId: 'u6',
    title: 'Product Design Intern',
    location: 'New York, NY (Hybrid)',
    type: 'Internship',
    salary: '$38–46 / hr',
    description:
      "Stackform is looking for a product design intern to join the platform experience team. You'll work directly with PMs and engineers to redesign key workflows in our builder product, with user research and high-fidelity delivery.",
    requirements: [
      'Portfolio demonstrating product design craft',
      'Proficiency in Figma',
      'Experience with user research or usability testing',
      'Can articulate design decisions clearly',
    ],
    tags: ['Figma', 'Product Design', 'UX Research', 'Internship'],
    postedAt: '2026-06-12T11:00:00Z',
    applicationCount: 61,
    appliedBy: [],
  },
  {
    id: 'j4',
    companyId: 'u4',
    title: 'Developer Advocate (Contract)',
    location: 'Remote',
    type: 'Contract',
    salary: '$80–100 / hr',
    description:
      'Help us reach developer communities through technical content, talks, and open-source contributions. Ideal for someone who is deeply technical and genuinely enjoys teaching.',
    requirements: [
      'Strong technical writing and communication',
      'Active presence in developer communities',
      'Experience building demo projects or tutorials',
      'Comfortable with public speaking / streaming',
    ],
    tags: ['DevRel', 'Technical Writing', 'Open Source', 'Remote'],
    postedAt: '2026-06-10T10:00:00Z',
    applicationCount: 17,
    appliedBy: [],
  },
  {
    id: 'j5',
    companyId: 'u5',
    title: 'Climate Data Analyst Intern',
    location: 'Remote',
    type: 'Internship',
    salary: '$28–35 / hr',
    description:
      'Analyze emissions datasets, build reporting pipelines, and help surface insights that city partners use to make policy decisions. Great fit for someone studying data science, environmental science, or public policy.',
    requirements: [
      'Python and SQL proficiency',
      'Experience with data visualization (Tableau, Plotly, or similar)',
      'Interest in climate policy or sustainability',
      'Strong written communication for stakeholder reports',
    ],
    tags: ['Python', 'Data Analysis', 'Climate', 'Internship', 'Remote'],
    postedAt: '2026-06-08T08:00:00Z',
    applicationCount: 49,
    appliedBy: [],
  },
];

// ─── Projects ──────────────────────────────────────────────────────────────

// ─── Bounties ──────────────────────────────────────────────────────────────

export const MOCK_BOUNTIES: Bounty[] = [
  {
    id: 'b1',
    companyId: 'u4',
    title: 'Build a CI/CD Pipeline Visualizer Widget',
    description:
      'Meridian Labs is looking for a developer to build an embeddable React widget that visualizes CI/CD pipeline runs in real time. The widget should render a directed acyclic graph (DAG) of pipeline stages, with live status indicators (pending, running, passed, failed) and a timeline view. It will be consumed by customers who embed it in their own dashboards.',
    submissionRequirements:
      'Submit a GitHub repo with the widget source, a README with usage instructions, and a live Stackblitz or CodeSandbox demo. The widget must be published as an npm package (even a local registry is fine).',
    requirements: [
      'Strong React + TypeScript skills',
      'Experience with SVG or canvas-based rendering (D3, Konva, or similar)',
      'Understanding of CI/CD concepts (stages, dependencies, artifacts)',
      'Ability to write clean, documented, testable component code',
    ],
    tags: ['React', 'TypeScript', 'D3', 'SVG', 'CI/CD', 'npm'],
    reward: '$750 cash',
    duration: '2–3 weeks',
    deadline: '2026-07-15T23:59:00Z',
    postedAt: '2026-06-18T09:00:00Z',
    applicationCount: 12,
    appliedBy: [],
    status: 'open',
  },
  {
    id: 'b2',
    companyId: 'u4',
    title: 'Write a 5-Part Tutorial Series on Distributed Tracing',
    description:
      'We want a well-structured, technically accurate tutorial series explaining distributed tracing from first principles through to production implementation with OpenTelemetry and Jaeger. Target audience is mid-level backend engineers who have never set up tracing before. Each article should be 1,500–2,500 words with code samples in Go or Python.',
    submissionRequirements:
      'Submit all 5 articles in Markdown format, with working code samples in a companion GitHub repo. Articles should be ready to publish with only light editorial review.',
    requirements: [
      'Strong technical writing — clear, opinionated, no fluff',
      'Backend engineering experience (Go or Python preferred)',
      'Hands-on experience with OpenTelemetry, Jaeger, or Zipkin',
      'Ability to explain distributed systems concepts accessibly',
    ],
    tags: ['Technical Writing', 'Go', 'Python', 'OpenTelemetry', 'Distributed Systems'],
    reward: '$500 + byline credit',
    duration: '3–4 weeks',
    deadline: '2026-07-25T23:59:00Z',
    postedAt: '2026-06-15T10:00:00Z',
    applicationCount: 8,
    appliedBy: [],
    status: 'open',
  },
  {
    id: 'b3',
    companyId: 'u5',
    title: 'Carbon Footprint Calculator — React Component',
    description:
      'GreenPulse needs a standalone React component that lets users estimate their household carbon footprint by answering a short questionnaire (transport, energy, food, consumption). The component should calculate a score in kg CO₂e/year, compare it against national averages, and display a breakdown with actionable reduction tips. Designed to be embedded on partner city websites.',
    submissionRequirements:
      'Deliver a published npm package with full TypeScript types, unit tests (>80% coverage), Storybook stories for all states, and a brief design rationale document.',
    requirements: [
      'React + TypeScript',
      'Familiarity with environmental/carbon accounting concepts is a strong plus',
      'Component design skills — clean props API, accessible markup',
      'Jest or Vitest for testing',
    ],
    tags: ['React', 'TypeScript', 'Storybook', 'Climate', 'Accessibility'],
    reward: '$600 cash',
    duration: '3 weeks',
    deadline: '2026-07-20T23:59:00Z',
    postedAt: '2026-06-14T11:00:00Z',
    applicationCount: 19,
    appliedBy: ['u1'],
    status: 'open',
  },
  {
    id: 'b4',
    companyId: 'u5',
    title: 'Urban Tree Coverage vs Urban Heat Island — Data Analysis',
    description:
      'We have datasets from 12 US cities covering satellite-derived tree canopy coverage (2010–2025), surface temperature anomalies (NOAA), and heat-related ER visits. We want a rigorous analysis that quantifies the correlation between canopy loss and heat island intensity, segmented by income quintile. Findings will inform our city partnership proposals.',
    submissionRequirements:
      'Deliver a Jupyter notebook with reproducible analysis, an executive summary (1–2 pages PDF), and a set of 5–8 publication-ready charts (PNG + source code). All data processing must be in Python.',
    requirements: [
      'Python (pandas, geopandas, statsmodels or scikit-learn)',
      'Experience with geospatial data (GeoJSON, shapefiles, rasterio)',
      'Statistical literacy — regression, correlation, significance testing',
      'Clear data visualization and storytelling',
    ],
    tags: ['Python', 'Data Analysis', 'GIS', 'Climate', 'Statistics'],
    reward: '$400 + co-authorship on GreenPulse blog post',
    duration: '2–3 weeks',
    deadline: '2026-07-10T23:59:00Z',
    postedAt: '2026-06-10T08:00:00Z',
    applicationCount: 7,
    appliedBy: [],
    status: 'reviewing',
  },
  {
    id: 'b5',
    companyId: 'u6',
    title: 'Redesign Stackform Onboarding Flow (UX + Hi-Fi)',
    description:
      'Our current onboarding drop-off rate at step 3 is 54%. We need a product designer to audit the existing flow, identify friction points through heuristic evaluation, and deliver a redesigned 5-step onboarding experience in Figma. The redesign should follow our existing design system (tokens provided) and be backed by UX reasoning.',
    submissionRequirements:
      'Deliver: (1) a 2-page audit doc identifying the top 5 drop-off causes, (2) a complete hi-fi Figma prototype of the redesigned flow (desktop + mobile), (3) a 10-minute Loom walkthrough explaining your decisions.',
    requirements: [
      'Strong portfolio in product/UX design',
      'Proficiency in Figma (auto-layout, components, prototyping)',
      'Ability to conduct and document heuristic evaluation',
      'Experience designing for SaaS onboarding flows',
    ],
    tags: ['Figma', 'UX Design', 'Product Design', 'Onboarding', 'SaaS'],
    reward: '$800 cash',
    duration: '3–4 weeks',
    deadline: '2026-07-28T23:59:00Z',
    postedAt: '2026-06-12T14:00:00Z',
    applicationCount: 31,
    appliedBy: ['u2'],
    status: 'open',
  },
  {
    id: 'b6',
    companyId: 'u6',
    title: 'TypeScript REST API Client SDK',
    description:
      'Stackform is publishing a public API and needs a first-class TypeScript SDK to go with it. The SDK should wrap all current API endpoints (OpenAPI spec provided), handle authentication, automatic retry with exponential backoff, and response type inference. It should feel idiomatic for TypeScript developers — not just a thin fetch wrapper.',
    submissionRequirements:
      'Deliver the SDK as a published npm package (scoped), with full TypeScript types auto-generated from the OpenAPI spec, 90%+ test coverage, a comprehensive README, and a changelog. We will conduct a code review before final acceptance.',
    requirements: [
      'Deep TypeScript expertise (generics, conditional types, template literals)',
      'Experience building and publishing npm packages',
      'Understanding of REST API design and OpenAPI specs',
      'Familiarity with fetch / axios and request retry patterns',
    ],
    tags: ['TypeScript', 'SDK', 'REST API', 'npm', 'OpenAPI'],
    reward: '$1,000 cash',
    duration: '4–6 weeks',
    deadline: '2026-08-10T23:59:00Z',
    postedAt: '2026-06-08T10:00:00Z',
    applicationCount: 15,
    appliedBy: [],
    status: 'open',
  },
];

export const getBountyById = (id: string): Bounty | undefined =>
  MOCK_BOUNTIES.find(b => b.id === id);

// ─── Projects ──────────────────────────────────────────────────────────────

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'pr1',
    authorId: 'u1',
    title: 'RaftKV — Distributed Key-Value Store',
    description:
      'A fault-tolerant distributed key-value store built on the Raft consensus algorithm in Go. Supports linearizable reads, log compaction via snapshotting, and cluster membership changes. Deployed a 5-node cluster on GCP.',
    tags: ['Go', 'Distributed Systems', 'Raft', 'GCP'],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    repoUrl: 'https://github.com/priya/raftkv',
    createdAt: '2026-06-01T00:00:00Z',
    likes: 88,
    likedBy: ['u2', 'u4'],
  },
  {
    id: 'pr2',
    authorId: 'u2',
    title: 'Aria Design System',
    description:
      'An accessible, token-based component library built in React + TypeScript. Includes 40+ components, a Figma library that stays in sync via design tokens, and a Storybook documentation site.',
    tags: ['React', 'TypeScript', 'Figma', 'Accessibility', 'Storybook'],
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    repoUrl: 'https://github.com/marcuswebb/aria-ds',
    liveUrl: 'https://aria-ds.vercel.app',
    createdAt: '2026-05-10T00:00:00Z',
    likes: 143,
    likedBy: ['u1', 'u6'],
  },
  {
    id: 'pr3',
    authorId: 'u3',
    title: 'AirView Austin',
    description:
      'Real-time dashboard visualizing Austin air quality index, particulate matter (PM2.5/PM10), and correlations with traffic and weather data. Pulls from 14 EPA sensor stations, updated every 5 minutes.',
    tags: ['Python', 'React', 'Plotly', 'PostgreSQL', 'Climate'],
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80',
    repoUrl: 'https://github.com/aishakamara/airview',
    liveUrl: 'https://airview.vercel.app',
    createdAt: '2026-06-14T00:00:00Z',
    likes: 72,
    likedBy: ['u1', 'u5'],
  },
  {
    id: 'pr4',
    authorId: 'u1',
    title: 'NoteSync — Local-First Notes App',
    description:
      'A local-first Markdown notes app with real-time peer-to-peer sync using CRDTs (Yjs). No server required — sync happens directly between devices on the same network.',
    tags: ['TypeScript', 'Yjs', 'CRDTs', 'Electron', 'Markdown'],
    repoUrl: 'https://github.com/priya/notesync',
    createdAt: '2026-04-20T00:00:00Z',
    likes: 54,
    likedBy: ['u4'],
  },
  {
    id: 'pr5',
    authorId: 'u2',
    title: 'Onboard.fyi — Onboarding UX Teardowns',
    description:
      'A curated collection of annotated onboarding flow breakdowns from 30+ products. Each entry includes screen recordings, UX annotations, and a score across clarity, time-to-value, and delight.',
    tags: ['UX Research', 'Product Design', 'Case Studies'],
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    liveUrl: 'https://onboard.fyi',
    createdAt: '2026-03-05T00:00:00Z',
    likes: 201,
    likedBy: ['u1', 'u3', 'u6'],
  },
];

// ─── Lecture Materials ─────────────────────────────────────────────────────

export const MOCK_LECTURE_MATERIALS: LectureMaterial[] = [
  {
    id: 'lm1',
    authorId: 'u7',
    title: 'Week 9 — Inverter Topologies & Gate Drive Circuits',
    course: 'EE401 — Power Electronics',
    type: 'slides',
    uploadedAt: '2026-06-17T09:00:00Z',
    downloads: 214,
    fileSize: '6.1 MB',
    tags: ['MOSFET', 'gate-drive', 'inverters', 'switching'],
    published: true,
  },
  {
    id: 'lm2',
    authorId: 'u7',
    title: 'Lab 4 Handout — Half-Bridge Converter Bench Setup',
    course: 'EE401 — Power Electronics',
    type: 'lab',
    uploadedAt: '2026-06-15T14:30:00Z',
    downloads: 198,
    fileSize: '2.3 MB',
    tags: ['half-bridge', 'bench', 'oscilloscope', 'lab'],
    published: true,
  },
  {
    id: 'lm3',
    authorId: 'u7',
    title: 'Lecture Notes — Thermal Management in High-Power Systems',
    course: 'EE401 — Power Electronics',
    type: 'notes',
    uploadedAt: '2026-06-12T11:00:00Z',
    downloads: 156,
    fileSize: '1.8 MB',
    tags: ['thermal', 'heatsinks', 'junction-temperature'],
    published: true,
  },
  {
    id: 'lm4',
    authorId: 'u7',
    title: 'Week 8 — Magnetics Design: Transformers & Inductors',
    course: 'EE401 — Power Electronics',
    type: 'slides',
    uploadedAt: '2026-06-10T09:00:00Z',
    downloads: 231,
    fileSize: '8.4 MB',
    tags: ['magnetics', 'transformers', 'inductors', 'core-loss'],
    published: true,
  },
  {
    id: 'lm5',
    authorId: 'u7',
    title: 'Recorded Lecture — PFC & EMC Compliance Basics',
    course: 'EE501 — Power Systems Advanced',
    type: 'recording',
    uploadedAt: '2026-06-08T16:00:00Z',
    downloads: 87,
    fileSize: '312 MB',
    tags: ['PFC', 'EMC', 'compliance', 'IEC'],
    published: true,
  },
  {
    id: 'lm6',
    authorId: 'u7',
    title: 'Draft: Week 10 — SiC & GaN Wide-Bandgap Devices',
    course: 'EE401 — Power Electronics',
    type: 'slides',
    uploadedAt: '2026-06-19T08:00:00Z',
    downloads: 0,
    fileSize: '5.7 MB',
    tags: ['SiC', 'GaN', 'wide-bandgap', 'next-gen'],
    published: false,
  },
];

// ─── Student Initiatives ───────────────────────────────────────────────────

export const MOCK_INITIATIVES: StudentInitiative[] = [
  {
    id: 'si1',
    teamName: 'VoltForge',
    memberNames: ['Priya Nair', 'Jonas Becker', 'Amara Osei'],
    projectTitle: 'Bidirectional EV Charger — 3.3 kW Prototype',
    description: 'Designing a vehicle-to-grid capable 3.3 kW bidirectional onboard charger using SiC MOSFETs sourced through the Würth component access programme.',
    partsUsed: ['SiC MOSFET WMT3N120', 'Gate Driver WGD220', 'Common-mode choke WE-CMB'],
    companyName: 'Würth Elektronik',
    endorsed: true,
    submittedAt: '2026-05-20T00:00:00Z',
    status: 'active',
  },
  {
    id: 'si2',
    teamName: 'GreenGrid',
    memberNames: ['Marcus Webb', 'Aisha Kamara'],
    projectTitle: 'Microgrid Controller for Campus Solar Array',
    description: 'Embedded controller managing power flow between 40 kW rooftop solar installation, campus grid connection, and battery buffer using Würth magnetics.',
    partsUsed: ['Toroidal Inductor WE-TI', 'EMI Filter WE-CLFS', 'DC-Link Capacitor'],
    companyName: 'Würth Elektronik',
    endorsed: false,
    submittedAt: '2026-06-01T00:00:00Z',
    status: 'pending-review',
  },
  {
    id: 'si3',
    teamName: 'PulseDrive',
    memberNames: ['Lena Vogel', 'Tobias Müller', 'Yuki Tanaka', 'Fatima Al-Hassan'],
    projectTitle: 'Brushless Motor Driver for Autonomous Campus Shuttle',
    description: 'Three-phase BLDC drive system for a low-speed autonomous vehicle project, using gate driver ICs and power inductors from Würth for the inverter stage.',
    partsUsed: ['Gate Driver WGD100', 'Power Inductor WE-PD4', 'Current Sense Resistor'],
    companyName: 'Würth Elektronik',
    endorsed: true,
    submittedAt: '2026-04-15T00:00:00Z',
    status: 'active',
  },
  {
    id: 'si4',
    teamName: 'StorEd',
    memberNames: ['Kwame Asante', 'Priya Nair'],
    projectTitle: 'Modular 48V Battery Management System',
    description: 'Scalable BMS for lithium-iron-phosphate cell stacks with active balancing, thermal monitoring, and CAN bus communication for integration with campus energy storage.',
    partsUsed: ['Shunt Resistor WSLP', 'Ferrite Bead WE-CBF', 'NTC Thermistor'],
    companyName: 'Würth Elektronik',
    endorsed: false,
    submittedAt: '2026-06-10T00:00:00Z',
    status: 'pending-review',
  },
  {
    id: 'si5',
    teamName: 'FluxLab',
    memberNames: ['Anika Rao', 'Chen Wei', 'Marcus Webb'],
    projectTitle: 'Wireless Power Transfer — 200W Qi2 Pad',
    description: 'High-efficiency inductive power transfer pad designed for desk charging in university library, reaching 93% efficiency at 200W using resonant topologies.',
    partsUsed: ['Wireless Charging Coil WE-WPCC', 'Resonant Capacitor', 'Shielding Foil'],
    companyName: 'Würth Elektronik',
    endorsed: true,
    submittedAt: '2026-03-28T00:00:00Z',
    status: 'completed',
  },
];

// ─── Q&A Channels ─────────────────────────────────────────────────────────

export const MOCK_QA_CHANNELS: QAChannel[] = [
  {
    id: 'qa1',
    topic: 'Gate driver bootstrap supply — floating ground confusion',
    course: 'EE401 — Power Electronics',
    openQuestions: 3,
    participants: 18,
    lastActivityAt: '2026-06-19T22:10:00Z',
    tags: ['gate-driver', 'bootstrap', 'half-bridge'],
  },
  {
    id: 'qa2',
    topic: 'Lab 4 oscilloscope ringing — measurement artefact or real?',
    course: 'EE401 — Power Electronics',
    openQuestions: 7,
    participants: 31,
    lastActivityAt: '2026-06-19T20:45:00Z',
    tags: ['lab', 'oscilloscope', 'ringing', 'probe'],
  },
  {
    id: 'qa3',
    topic: 'SiC vs GaN for 48V-bus DC-DC — selection criteria',
    course: 'EE501 — Power Systems Advanced',
    openQuestions: 2,
    participants: 9,
    lastActivityAt: '2026-06-18T16:00:00Z',
    tags: ['SiC', 'GaN', 'device-selection'],
  },
  {
    id: 'qa4',
    topic: 'Thermal pad placement for TO-247 packages on PCB',
    course: 'EE401 — Power Electronics',
    openQuestions: 4,
    participants: 14,
    lastActivityAt: '2026-06-17T11:30:00Z',
    tags: ['thermal', 'PCB', 'layout', 'TO-247'],
  },
];

// ─── Student Deadlines ─────────────────────────────────────────────────────

export const MOCK_DEADLINES: Deadline[] = [
  {
    id: 'dl1',
    title: 'Lab 4 Report Submission',
    type: 'lab-submission',
    dueAt: '2026-06-23T23:59:00Z',
    course: 'EE401 — Power Electronics',
    priority: 'high',
  },
  {
    id: 'dl2',
    title: 'Carbon Footprint Calculator Bounty',
    type: 'bounty',
    dueAt: '2026-07-20T23:59:00Z',
    linkedId: 'b3',
    priority: 'medium',
  },
  {
    id: 'dl3',
    title: 'EE401 Mid-term Project Proposal',
    type: 'assignment',
    dueAt: '2026-06-27T17:00:00Z',
    course: 'EE401 — Power Electronics',
    priority: 'high',
  },
  {
    id: 'dl4',
    title: 'CI/CD Visualizer Widget Bounty',
    type: 'bounty',
    dueAt: '2026-07-15T23:59:00Z',
    linkedId: 'b1',
    priority: 'medium',
  },
  {
    id: 'dl5',
    title: 'VoltForge — Weekly Progress Check-in',
    type: 'project-review',
    dueAt: '2026-06-21T14:00:00Z',
    priority: 'low',
  },
];
