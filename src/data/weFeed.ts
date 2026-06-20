// ─── Würth Elektronik Live RSS Feed ────────────────────────────────────────
// Source: https://rss.app/feeds/v1.1/1S6y5xcPbR8OEhcm.json
// Feed title: "More Light, Greater Efficiency, Better Growth"

export type WEItemCategory = 'news' | 'product' | 'service' | 'event' | 'blog' | 'career';

export interface WEFeedItem {
  id: string;
  url: string;
  title: string;
  summary: string;
  image?: string;
  publishedAt: string;
  source: string;
  category: WEItemCategory;
  tags: string[];
  // derived
  upvotes: number;
  saved: boolean;
}

// ─── Parsed & categorised feed items ───────────────────────────────────────

export const WE_FEED_ITEMS: WEFeedItem[] = [
  // ── Products ──────────────────────────────────────────────────────────────
  {
    id: 'we-fncs',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=we-fncs',
    title: 'WE-FNCS — Nanocrystalline EMI Shielding Sheets',
    summary: 'Würth Elektronik introduces nanocrystalline EMI shielding sheets. Quick and easy surface mounting with superior suppression performance at high frequencies — ideal for PCB-level EMI management.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1812_01_group-we-fncs.jpg&resize=',
    publishedAt: '2026-06-01T09:00:00.000Z',
    source: 'Würth Elektronik Press',
    category: 'product',
    tags: ['EMI', 'shielding', 'nanocrystalline', 'PCB', 'EMC', 'WE-FNCS'],
    upvotes: 47,
    saved: false,
  },
  {
    id: 'we-wpme-cdi2c',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=WPME-CDI2C',
    title: 'WPME-CDI2C — Digital Isolators for I²C Interfaces',
    summary: 'New digital isolators from Würth Elektronik provide galvanic isolation of digital signals on I²C buses. Supports fast mode (400 kHz) and fast mode plus (1 MHz), with 5 kVrms isolation voltage. Suitable for industrial, medical, and automotive applications.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1817_01.jpg&resize=',
    publishedAt: '2026-06-01T08:00:00.000Z',
    source: 'Würth Elektronik Press',
    category: 'product',
    tags: ['isolator', 'I2C', 'galvanic-isolation', 'digital', 'WPME-CDI2C', 'industrial'],
    upvotes: 63,
    saved: false,
  },
  {
    id: 'we-sfia',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=we-sfia',
    title: 'WE-SFIA — SMT Flat-Wire Inductor for Automotive Electronics',
    summary: 'The WE-SFIA SMT flat-wire power inductor is engineered for automotive DC-DC converters. Its flat-wire winding technology achieves ultra-low DCR and excellent thermal performance in an AEC-Q200-qualified package, meeting the rigorous demands of ADAS and powertrain applications.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1709_01.jpg&resize=',
    publishedAt: '2026-05-28T10:00:00.000Z',
    source: 'Würth Elektronik Press',
    category: 'product',
    tags: ['inductor', 'automotive', 'flat-wire', 'AEC-Q200', 'DC-DC', 'WE-SFIA'],
    upvotes: 89,
    saved: true,
  },
  {
    id: 'we-smdc-led',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=smdc',
    title: 'SMDC Horticulture LEDs — Expanded Portfolio for Plant Growth',
    summary: 'Würth Elektronik expands its Horticulture LED portfolio with new SMDC emitters. More light output, greater efficiency, and better plant growth — the new wavelength options target red (660 nm) and far-red (730 nm) spectra for vertical farming and greenhouse applications.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/smdc.jpg&resize=',
    publishedAt: '2026-05-25T07:00:00.000Z',
    source: 'Würth Elektronik Press',
    category: 'product',
    tags: ['LED', 'horticulture', 'SMDC', 'lighting', 'vertical-farming', 'photonics'],
    upvotes: 34,
    saved: false,
  },
  {
    id: 'we-ic-leds',
    url: 'https://www.we-online.com/en/news-center/blog?d=rgb-leds-with-integrated-control-circuit',
    title: 'IC LEDs — Integrated Control Circuit LEDs Set New Standards',
    summary: 'ICLEDs from Würth Elektronik integrate an intelligent control circuit directly into the LED package. Where traditional LED solutions reach their limits, ICLED\'s built-in dimming, colour mixing, and fault detection begin to shine. Targeted at signage, automotive interior, and industrial HMI.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/aufmacherbild.jpg&resize=',
    publishedAt: '2026-05-20T10:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'product',
    tags: ['LED', 'IC-LED', 'integrated-control', 'RGB', 'automotive', 'HMI', 'lighting'],
    upvotes: 72,
    saved: false,
  },
  {
    id: 'we-rohs-leadfree',
    url: 'https://www.we-online.com/en/news-center/blog?d=rohs-leadfree',
    title: 'RoHS Lead-Free Transition — New Varistors & SMT Spacers',
    summary: 'Würth Elektronik is implementing lead-free alternatives across its passive component portfolio in compliance with RoHS Directive 2011/65/EU. New lead-free varistors and SMT spacers are now available. Learn how to transition your BOM without compromising reliability.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/eisos_nachhaltigkeit_bleifrei_l2.jpg&resize=',
    publishedAt: '2026-05-15T08:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'product',
    tags: ['RoHS', 'lead-free', 'varistor', 'SMT', 'compliance', 'sustainability'],
    upvotes: 58,
    saved: false,
  },

  // ── Services ──────────────────────────────────────────────────────────────
  {
    id: 'we-ics-solutions',
    url: 'https://www.we-online.com/en/products/intelligent-systems/overview',
    title: 'Intelligent Control Systems (ICS) — Vehicles & Industrial',
    summary: 'Würth Elektronik ICS provides complete system solutions for construction, agricultural, and commercial vehicles. From power distribution and signal transmission to control & display — covering simple components through to full system integration.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/ICS_Header_1920x600_L3_C2_V2.jpg&resize=',
    publishedAt: '2026-06-01T17:00:00.000Z',
    source: 'Würth Elektronik ICS',
    category: 'service',
    tags: ['ICS', 'intelligent-systems', 'vehicles', 'agricultural', 'power-distribution', 'system-solution'],
    upvotes: 41,
    saved: false,
  },
  {
    id: 'we-ics-services',
    url: 'https://www.we-online.com/en/products/intelligent-systems/services',
    title: 'ICS Engineering Services — From Idea to Series Product',
    summary: 'Würth Elektronik ICS offers unique engineering services from initial concept through prototype to series production. Experience their system design, testing, and qualification capabilities first-hand.',
    image: 'https://www.we-online.com/files/jpg1/_dsc2911.jpg',
    publishedAt: '2026-05-10T09:00:00.000Z',
    source: 'Würth Elektronik ICS',
    category: 'service',
    tags: ['ICS', 'engineering-services', 'prototyping', 'series-production', 'testing'],
    upvotes: 29,
    saved: false,
  },
  {
    id: 'we-wesystems',
    url: 'https://www.we-online.com/en/products/printed-circuit-boards/services/wesystems',
    title: 'WEsystems — Wire Bonding, PCBs & Custom System Processing',
    summary: 'WEsystems combines wire bonding services, printed circuit board manufacturing, and customer-specific system processing under one roof. Würth Elektronik acts as customer advocate and solution provider throughout the full product lifecycle.',
    publishedAt: '2026-05-05T10:00:00.000Z',
    source: 'Würth Elektronik PCB',
    category: 'service',
    tags: ['WEsystems', 'wire-bonding', 'PCB', 'custom-systems', 'manufacturing'],
    upvotes: 22,
    saved: false,
  },
  {
    id: 'we-support',
    url: 'https://www.we-online.com/en/support/overview',
    title: 'Technical Support — Personal, Professional & On-Site',
    summary: 'Würth Elektronik offers best-in-class technical support including FAE visits, application engineering, design-in assistance, REDEXPERT parametric selection tool, and online calculators for magnetics, power, and RF design.',
    publishedAt: '2026-04-20T09:00:00.000Z',
    source: 'Würth Elektronik Support',
    category: 'service',
    tags: ['support', 'FAE', 'application-engineering', 'REDEXPERT', 'design-in', 'calculators'],
    upvotes: 55,
    saved: true,
  },

  // ── News / Blog ────────────────────────────────────────────────────────────
  {
    id: 'we-ecovadis-platinum',
    url: 'https://www.we-online.com/en/news-center/blog?d=ecovadis-platinum',
    title: 'EcoVadis Platinum — Leading the Way in Sustainable PCB Manufacturing',
    summary: 'Würth Elektronik Circuit Board Technology has achieved EcoVadis Platinum status — placing it in the top 1% of companies assessed globally for sustainability performance. The rating covers environment, labour & human rights, ethics, and sustainable procurement.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-cbt-keyvisual-ecovadis-platinum-rating.jpg&resize=',
    publishedAt: '2026-06-05T08:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'news',
    tags: ['EcoVadis', 'sustainability', 'platinum', 'PCB', 'ESG', 'manufacturing'],
    upvotes: 118,
    saved: false,
  },
  {
    id: 'we-innovative-employer',
    url: 'https://www.we-online.com/en/news-center/blog?d=innovative-company',
    title: 'How to Find an Innovative Employer? Würth Elektronik\'s Answer',
    summary: 'What makes a company truly innovative — and how do you find one? Würth Elektronik shares its approach: R&D investment, know-how transfer through university partnerships, flat hierarchies, and an engineering-first culture. Insight for students evaluating employers.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/bild-5-fh230403_wemuc_0947m.jpg&resize=',
    publishedAt: '2026-05-18T09:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'blog',
    tags: ['employer', 'innovation', 'R&D', 'culture', 'students', 'career'],
    upvotes: 94,
    saved: false,
  },
  {
    id: 'we-en45545-rail',
    url: 'https://www.we-online.com/en/news-center/blog?d=en-45545-2-rail-standard',
    title: 'EN 45545-2 Railway Certification — Ready for Rail',
    summary: 'Würth Elektronik PCBs are now certified to EN 45545-2 — the European fire protection standard for railway vehicles. Covers hazard levels HL1 through HL3 for materials used in rolling stock and infrastructure equipment.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-cbt-rail-standard-en-45545-2.jpg&resize=',
    publishedAt: '2026-05-12T08:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'news',
    tags: ['railway', 'EN-45545-2', 'certification', 'PCB', 'safety', 'rail'],
    upvotes: 67,
    saved: false,
  },
  {
    id: 'we-pcb-quality',
    url: 'https://www.we-online.com/en/news-center/blog?d=small-component',
    title: 'Small Component, Big Responsibility — The Truth About PCB Quality',
    summary: 'PCBs are rarely the component engineers think hardest about — but they\'re often the root cause of field failures. Würth Elektronik\'s webinar with Dr. Andreas Schilpp explains IPC class, material selection, copper roughness, and why blind/buried via quality matters.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/cbt-speaker-webinar-andreas-schilpp.jpg&resize=',
    publishedAt: '2026-05-08T10:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'blog',
    tags: ['PCB', 'quality', 'IPC', 'webinar', 'reliability', 'manufacturing'],
    upvotes: 83,
    saved: false,
  },
  {
    id: 'we-smartwatch',
    url: 'https://www.we-online.com/en/news-center/blog?d=advanced-hdi-open-source-smartwatch-en',
    title: 'Open Source Smartwatch Powered by ADVANCED.hdi PCB Technology',
    summary: 'OV Tech\'s open-source smartwatch project uses Würth Elektronik\'s ADVANCED.hdi high-density interconnect PCBs. The design packs BLE, IMU, display driver, and 72-hour battery life into a 38×38mm board — a showcase of what HDI enables for wearable electronics.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-cbt-advanced-hdi-open-source-smartwatch-ovtech-2.jpeg&resize=',
    publishedAt: '2026-04-30T09:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'blog',
    tags: ['HDI', 'PCB', 'smartwatch', 'open-source', 'wearable', 'BLE', 'ADVANCED-hdi'],
    upvotes: 142,
    saved: true,
  },
  {
    id: 'we-asia-production',
    url: 'https://www.we-online.com/en/news-center/blog?d=asia-production-by-wuerth-elektronik',
    title: 'Asia Production by Würth Elektronik — More Than Just an Alternative',
    summary: 'Würth Elektronik\'s Asia production network offers customers quality manufacturing with European engineering oversight and real logistics relief. Covers PCBs, assemblies, and complete system builds — reducing lead times while maintaining Würth quality standards.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-cbt-asia-production-logistic-solutions.jpg&resize=',
    publishedAt: '2026-04-22T08:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'blog',
    tags: ['Asia', 'manufacturing', 'PCB', 'logistics', 'supply-chain', 'assembly'],
    upvotes: 51,
    saved: false,
  },
  {
    id: 'we-valencia-emc',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=10-jahre-catedra',
    title: '10 Years of EMC Research — University of Valencia Partnership',
    summary: 'Würth Elektronik and the University of Valencia celebrate a decade of collaboration in Electromagnetic Compatibility research. The Cátedra Würth has produced 40+ peer-reviewed publications, 12 PhD theses, and numerous EMC measurement tools freely available to the industry.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1843_01_valencia.jpg&resize=',
    publishedAt: '2026-04-15T09:00:00.000Z',
    source: 'Würth Elektronik Press',
    category: 'news',
    tags: ['EMC', 'university', 'Valencia', 'research', 'partnership', 'academic'],
    upvotes: 76,
    saved: false,
  },
  {
    id: 'we-united-summit',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=we-united',
    title: 'WE United Leadership Summit — Reflections on Leading in Complex Tech Environments',
    summary: 'Würth Elektronik hosted the WE United Leadership Summit in Munich, bringing together senior leaders across divisions to discuss navigating technological complexity, talent development, and the company\'s innovation roadmap for 2026–2030.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-united_hic-muenchen.jpg&resize=',
    publishedAt: '2026-04-10T10:00:00.000Z',
    source: 'Würth Elektronik Press',
    category: 'news',
    tags: ['leadership', 'summit', 'strategy', 'innovation', 'Munich', 'culture'],
    upvotes: 38,
    saved: false,
  },

  // ── Events / Career ────────────────────────────────────────────────────────
  {
    id: 'we-seminars',
    url: 'https://www.we-online.com/en/news-center/events/seminars',
    title: 'Free Seminars — Electronics, EMC, PCB Design & More',
    summary: 'Würth Elektronik runs free, expert-led seminars worldwide covering power electronics, EMC compliance, PCB design rules, RF fundamentals, and magnetics design. Available in-person and online. Register at no cost — suitable for students and working engineers.',
    publishedAt: '2026-06-01T23:00:00.000Z',
    source: 'Würth Elektronik Events',
    category: 'event',
    tags: ['seminar', 'free', 'EMC', 'PCB', 'power-electronics', 'RF', 'training', 'education'],
    upvotes: 201,
    saved: true,
  },
  {
    id: 'we-pcim-2026',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=ankuendigung-pcim',
    title: 'Würth Elektronik at PCIM Europe 2026 — Modern Power Electronics Solutions',
    summary: 'Würth Elektronik will exhibit at PCIM Europe 2026 in Nuremberg (27–29 May). Visit Hall 9, Stand 540 to see live demos of new SiC gate drivers, resonant magnetics, GaN-compatible inductors, and the REDEXPERT simulation platform.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1832_01.jpg&resize=',
    publishedAt: '2026-05-01T09:00:00.000Z',
    source: 'Würth Elektronik Events',
    category: 'event',
    tags: ['PCIM', 'exhibition', 'Nuremberg', 'SiC', 'GaN', 'power-electronics', 'event'],
    upvotes: 133,
    saved: false,
  },
  {
    id: 'we-ivt-2026',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=wuerth-elektronik-ics-at-ivt-2026',
    title: 'Würth Elektronik ICS at iVT Expo 2026 — Intelligent Power Distribution',
    summary: 'Würth Elektronik ICS exhibits at iVT International Expo 2026, showcasing intelligent power distribution solutions for off-highway vehicles. Live demos include solid-state relay modules, CANopen-controlled distribution boxes, and the new ICS SmartBox system.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=png1/we-ics-logo-ivt-2026.png&resize=',
    publishedAt: '2026-03-20T09:00:00.000Z',
    source: 'Würth Elektronik ICS',
    category: 'event',
    tags: ['iVT', 'exhibition', 'ICS', 'off-highway', 'power-distribution', 'CANopen'],
    upvotes: 44,
    saved: false,
  },
  {
    id: 'ikom-tum',
    url: 'https://ikom-tum.de/en',
    title: 'IKOM — TU Munich Career Forum (4 Annual Job Fairs)',
    summary: 'IKOM organises four career job fairs per year at the Technical University of Munich. Connect directly with top-tier engineering companies including Würth Elektronik, Siemens, BMW, and MAN. Open to all students — free registration.',
    publishedAt: '2026-06-01T12:00:00.000Z',
    source: 'IKOM TU Munich',
    category: 'career',
    tags: ['career', 'job-fair', 'TUM', 'Munich', 'students', 'networking', 'IKOM'],
    upvotes: 167,
    saved: false,
  },
  {
    id: 'we-overview',
    url: 'https://www.we-online.com/en/company/overview',
    title: 'About Würth Elektronik — Manufacturer of Electronic & Electromechanical Components',
    summary: 'Würth Elektronik is a leading manufacturer of electrical and electromechanical components, printed circuit boards, and intelligent systems. Family-owned, headquartered in Waldenburg, Germany, with 7,800+ employees globally and free samples available for engineers.',
    publishedAt: '2026-01-01T00:00:00.000Z',
    source: 'Würth Elektronik',
    category: 'news',
    tags: ['company', 'overview', 'manufacturer', 'components', 'PCB', 'Germany'],
    upvotes: 29,
    saved: false,
  },
];

// ─── Derived slices ─────────────────────────────────────────────────────────

export const WE_PRODUCTS   = WE_FEED_ITEMS.filter(i => i.category === 'product');
export const WE_SERVICES   = WE_FEED_ITEMS.filter(i => i.category === 'service');
export const WE_NEWS       = WE_FEED_ITEMS.filter(i => ['news', 'blog'].includes(i.category));
export const WE_EVENTS     = WE_FEED_ITEMS.filter(i => ['event', 'career'].includes(i.category));

// ─── Trending topics (derived from tag frequency) ──────────────────────────

const tagFrequency: Record<string, number> = {};
WE_FEED_ITEMS.forEach(item => item.tags.forEach(t => { tagFrequency[t] = (tagFrequency[t] ?? 0) + 1; }));

export const WE_TRENDING_TAGS = Object.entries(tagFrequency)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12)
  .map(([tag]) => tag);

// ─── FAQ / Most-asked question templates ────────────────────────────────────

export interface WEFaqEntry {
  question: string;
  keywords: string[];
  answerIntro: string;
  matchCategories: WEItemCategory[];
}

export const WE_FAQ: WEFaqEntry[] = [
  {
    question: 'What products does Würth Elektronik offer?',
    keywords: ['product', 'components', 'catalogue', 'portfolio', 'what do you sell', 'what makes'],
    answerIntro: 'Würth Elektronik manufactures a wide range of electronic components. Here are some of the latest additions:',
    matchCategories: ['product'],
  },
  {
    question: 'Are there any free training seminars?',
    keywords: ['seminar', 'training', 'course', 'learn', 'workshop', 'education', 'free'],
    answerIntro: 'Yes! Würth Elektronik offers free worldwide seminars on electronics, EMC, PCB design, and more:',
    matchCategories: ['event'],
  },
  {
    question: 'What are the latest Würth Elektronik news?',
    keywords: ['news', 'latest', 'recent', 'update', 'announcement', 'new'],
    answerIntro: 'Here\'s what\'s new from Würth Elektronik:',
    matchCategories: ['news', 'blog'],
  },
  {
    question: 'Tell me about Würth Elektronik job & career opportunities',
    keywords: ['job', 'career', 'hiring', 'internship', 'work', 'vacancy', 'apply', 'employer'],
    answerIntro: 'Looking to join the Würth Elektronik ecosystem? Here are relevant opportunities:',
    matchCategories: ['career', 'event'],
  },
  {
    question: 'What EMI / EMC solutions are available?',
    keywords: ['EMI', 'EMC', 'shielding', 'filter', 'interference', 'noise', 'compliance'],
    answerIntro: 'Würth Elektronik offers a broad range of EMI/EMC solutions:',
    matchCategories: ['product', 'service', 'blog'],
  },
  {
    question: 'Tell me about PCB services',
    keywords: ['PCB', 'circuit board', 'printed circuit', 'layout', 'board', 'HDI', 'multilayer'],
    answerIntro: 'Würth Elektronik is a leading PCB manufacturer and service provider:',
    matchCategories: ['service', 'product', 'blog'],
  },
  {
    question: 'What automotive electronics products do you have?',
    keywords: ['automotive', 'vehicle', 'car', 'AEC', 'ADAS', 'EV', 'off-highway', 'ICS'],
    answerIntro: 'Würth Elektronik has dedicated product lines and systems for the automotive sector:',
    matchCategories: ['product', 'service', 'event'],
  },
  {
    question: 'What LED products are available?',
    keywords: ['LED', 'lighting', 'light', 'horticulture', 'illumination', 'display'],
    answerIntro: 'Würth Elektronik\'s LED portfolio covers general lighting through to precision plant growth:',
    matchCategories: ['product'],
  },
  {
    question: 'What upcoming events or exhibitions?',
    keywords: ['event', 'exhibition', 'expo', 'trade show', 'upcoming', 'calendar', 'PCIM', 'iVT'],
    answerIntro: 'Würth Elektronik participates in key industry events:',
    matchCategories: ['event'],
  },
  {
    question: 'What sustainability / ESG initiatives does Würth have?',
    keywords: ['sustainability', 'ESG', 'green', 'RoHS', 'lead-free', 'EcoVadis', 'environment'],
    answerIntro: 'Würth Elektronik takes sustainability seriously:',
    matchCategories: ['news', 'product'],
  },
];

// ─── Chatbot search function ────────────────────────────────────────────────

export function searchFeed(query: string): {
  items: WEFeedItem[];
  matchedFaq: WEFaqEntry | null;
  confidence: 'high' | 'medium' | 'low';
} {
  const q = query.toLowerCase();

  // 1. Match FAQ
  let matchedFaq: WEFaqEntry | null = null;
  let bestFaqScore = 0;
  for (const faq of WE_FAQ) {
    const score = faq.keywords.filter(kw => q.includes(kw.toLowerCase())).length;
    if (score > bestFaqScore) { bestFaqScore = score; matchedFaq = faq; }
  }

  // 2. Search items by tags + title + summary
  const scored = WE_FEED_ITEMS.map(item => {
    let score = 0;
    const searchable = `${item.title} ${item.summary} ${item.tags.join(' ')}`.toLowerCase();
    // exact tag matches
    item.tags.forEach(t => { if (q.includes(t.toLowerCase())) score += 3; });
    // word-by-word title/summary match
    q.split(/\s+/).forEach(word => {
      if (word.length > 2 && searchable.includes(word)) score += 1;
    });
    // category filter via matched FAQ
    if (matchedFaq && matchedFaq.matchCategories.includes(item.category)) score += 2;
    return { item, score };
  })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(s => s.item);

  const confidence = scored.length >= 3 ? 'high' : scored.length >= 1 ? 'medium' : 'low';

  return { items: scored, matchedFaq, confidence };
}
