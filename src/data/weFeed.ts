// ─── Würth Elektronik Live RSS Feed ─────────────────────────────────────────
// Source : https://rss.app/feeds/v1.1/1S6y5xcPbR8OEhcm.json
// Feed   : "More Light, Greater Efficiency, Better Growth"
// Items  : 24 (full ingest — last fetched 2026-06-20)
// All platform content is proprietary to Würth Elektronik eiSos GmbH & Co. KG

export type WEItemCategory = 'news' | 'product' | 'service' | 'event' | 'blog' | 'career';

export interface WEFeedItem {
  /** Stable slug id */
  id: string;
  /** Canonical URL from feed */
  url: string;
  title: string;
  summary: string;
  image?: string;
  publishedAt: string;   // ISO 8601
  source: string;
  category: WEItemCategory;
  tags: string[];
  upvotes: number;
  saved: boolean;
}

// ─── All 24 items from the live feed ────────────────────────────────────────

export const WE_FEED_ITEMS: WEFeedItem[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  //  PRODUCTS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'we-fncs',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=we-fncs',
    title: 'WE-FNCS — Nanocrystalline EMI Shielding Sheets',
    summary:
      'Würth Elektronik introduces nanocrystalline EMI shielding sheets. Quick and easy surface-mount placement delivers superior high-frequency suppression — ideal for tight PCB-level EMI management. Available in multiple permeability grades.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1812_01_group-we-fncs.jpg',
    publishedAt: '2026-06-01T09:00:00.000Z',
    source: 'Würth Elektronik Press',
    category: 'product',
    tags: ['EMI', 'shielding', 'nanocrystalline', 'PCB', 'EMC', 'WE-FNCS', 'passive'],
    upvotes: 47,
    saved: false,
  },

  {
    id: 'we-wpme-cdi2c',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=WPME-CDI2C',
    title: 'WPME-CDI2C — Digital Isolators for I²C Interfaces',
    summary:
      'New digital isolators from Würth Elektronik provide galvanic isolation of digital signals on I²C buses. Supports fast mode (400 kHz) and fast mode plus (1 MHz), 5 kVrms isolation voltage. Suitable for industrial, medical, and automotive applications.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1817_01.jpg',
    publishedAt: '2026-06-01T08:00:00.000Z',
    source: 'Würth Elektronik Press',
    category: 'product',
    tags: ['isolator', 'I2C', 'galvanic-isolation', 'digital', 'WPME-CDI2C', 'industrial', 'medical', 'automotive'],
    upvotes: 63,
    saved: false,
  },

  {
    id: 'we-sfia',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=we-sfia',
    title: 'WE-SFIA — SMT Flat-Wire Inductor for Automotive Electronics',
    summary:
      'The WE-SFIA flat-wire power inductor is engineered for automotive DC-DC converters. Its flat-wire winding achieves ultra-low DCR and excellent thermal performance in an AEC-Q200-qualified package — designed for ADAS, powertrain, and EV applications.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1709_01.jpg',
    publishedAt: '2026-05-28T10:00:00.000Z',
    source: 'Würth Elektronik Press',
    category: 'product',
    tags: ['inductor', 'automotive', 'flat-wire', 'AEC-Q200', 'DC-DC', 'WE-SFIA', 'EV', 'ADAS'],
    upvotes: 89,
    saved: true,
  },

  {
    id: 'we-smdc-led',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=smdc',
    title: 'SMDC Horticulture LEDs — Expanded Portfolio for Plant Growth',
    summary:
      'Würth Elektronik expands its horticulture LED portfolio with new SMDC emitters. Higher light output, greater efficiency, better plant growth — new wavelength options target red (660 nm) and far-red (730 nm) spectra for vertical farming and greenhouse applications.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/smdc.jpg',
    publishedAt: '2026-05-25T07:00:00.000Z',
    source: 'Würth Elektronik Press',
    category: 'product',
    tags: ['LED', 'horticulture', 'SMDC', 'lighting', 'vertical-farming', 'photonics', 'plant-growth'],
    upvotes: 34,
    saved: false,
  },

  {
    id: 'we-ic-leds',
    url: 'https://www.we-online.com/en/news-center/blog?d=rgb-leds-with-integrated-control-circuit',
    title: 'IC LEDs — Integrated Control Circuit LEDs Set New Standards',
    summary:
      'ICLEDs integrate an intelligent control circuit directly into the LED package. Where traditional LED solutions reach their limits — ICLEDs\' built-in dimming, colour mixing, and fault detection begin to shine. Targeted at signage, automotive interior, and industrial HMI.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/aufmacherbild.jpg',
    publishedAt: '2026-05-20T10:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'product',
    tags: ['LED', 'IC-LED', 'integrated-control', 'RGB', 'automotive', 'HMI', 'lighting', 'dimming'],
    upvotes: 72,
    saved: false,
  },

  {
    id: 'we-rohs-leadfree',
    url: 'https://www.we-online.com/en/news-center/blog?d=rohs-leadfree',
    title: 'RoHS Lead-Free Transition — New Varistors & SMT Spacers',
    summary:
      'Würth Elektronik implements lead-free alternatives across its passive component portfolio in line with RoHS Directive 2011/65/EU. New lead-free varistors and SMT spacers now available. Learn how to transition your BOM without compromising reliability.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/eisos_nachhaltigkeit_bleifrei_l2.jpg',
    publishedAt: '2026-05-15T08:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'product',
    tags: ['RoHS', 'lead-free', 'varistor', 'SMT', 'compliance', 'sustainability', 'passive'],
    upvotes: 58,
    saved: false,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  SERVICES
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'we-ics-solutions',
    url: 'https://www.we-online.com/en/products/intelligent-systems/overview',
    title: 'Intelligent Control Systems (ICS) — Construction, Agricultural & Commercial Vehicles',
    summary:
      'Würth Elektronik ICS delivers complete power distribution, signal transmission, and control & display solutions for off-highway vehicles. From individual components to fully integrated system solutions — engineering start to series production under one roof.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/ICS_Header_1920x600_L3_C2_V2.jpg',
    publishedAt: '2026-06-01T17:00:00.000Z',
    source: 'Würth Elektronik ICS',
    category: 'service',
    tags: ['ICS', 'intelligent-systems', 'vehicles', 'agricultural', 'power-distribution', 'system-solution', 'off-highway'],
    upvotes: 41,
    saved: false,
  },

  {
    id: 'we-ics-services',
    url: 'https://www.we-online.com/en/products/intelligent-systems/services',
    title: 'ICS Engineering Services — From Idea to Series Product',
    summary:
      'Würth Elektronik ICS provides engineering services across the full lifecycle — from concept and schematic through prototype testing to series qualification. System design, custom enclosures, and compliance testing all in-house.',
    image: 'https://www.we-online.com/files/jpg1/_dsc2911.jpg',
    publishedAt: '2026-05-10T09:00:00.000Z',
    source: 'Würth Elektronik ICS',
    category: 'service',
    tags: ['ICS', 'engineering-services', 'prototyping', 'series-production', 'testing', 'system-design'],
    upvotes: 29,
    saved: false,
  },

  {
    id: 'we-wesystems',
    url: 'https://www.we-online.com/en/products/printed-circuit-boards/services/wesystems',
    title: 'WEsystems — Wire Bonding, PCBs & Customer-Specific System Processing',
    summary:
      'WEsystems combines wire bonding services, printed circuit board manufacturing, and customer-specific system processing. Würth Elektronik acts as a single-source customer advocate and solution provider across the full product lifecycle.',
    publishedAt: '2026-05-05T10:00:00.000Z',
    source: 'Würth Elektronik PCB',
    category: 'service',
    tags: ['WEsystems', 'wire-bonding', 'PCB', 'custom-systems', 'manufacturing', 'assembly'],
    upvotes: 22,
    saved: false,
  },

  {
    id: 'we-support',
    url: 'https://www.we-online.com/en/support/overview',
    title: 'Technical Support — Personal, Professional & On-Site',
    summary:
      'Würth Elektronik offers best-in-class technical support: FAE field visits, application engineering, design-in assistance, the REDEXPERT parametric selection and simulation platform, and online calculators for magnetics, power, and RF design.',
    publishedAt: '2026-04-20T09:00:00.000Z',
    source: 'Würth Elektronik Support',
    category: 'service',
    tags: ['support', 'FAE', 'application-engineering', 'REDEXPERT', 'design-in', 'calculators', 'technical'],
    upvotes: 55,
    saved: true,
  },

  {
    id: 'we-asia-production',
    url: 'https://www.we-online.com/en/news-center/blog?d=asia-production-by-wuerth-elektronik',
    title: 'Asia Production by Würth Elektronik — More Than Just an Alternative',
    summary:
      'Würth Elektronik\'s Asia production network offers quality manufacturing with European engineering oversight and genuine logistics relief. Covers PCBs, assemblies, and complete system builds — reducing lead times while maintaining Würth quality standards throughout.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-cbt-asia-production-logistic-solutions.jpg',
    publishedAt: '2026-04-22T08:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'service',
    tags: ['Asia', 'manufacturing', 'PCB', 'logistics', 'supply-chain', 'assembly', 'production'],
    upvotes: 51,
    saved: false,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  NEWS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'we-ecovadis-platinum',
    url: 'https://www.we-online.com/en/news-center/blog?d=ecovadis-platinum',
    title: 'EcoVadis Platinum — Leading the Way in Sustainable PCB Manufacturing',
    summary:
      'Würth Elektronik Circuit Board Technology achieves EcoVadis Platinum status — placing it in the global top 1% for sustainability. The assessment covers environment, labour & human rights, ethics, and sustainable procurement across all manufacturing sites.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-cbt-keyvisual-ecovadis-platinum-rating.jpg',
    publishedAt: '2026-06-05T08:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'news',
    tags: ['EcoVadis', 'sustainability', 'platinum', 'PCB', 'ESG', 'manufacturing', 'environment'],
    upvotes: 118,
    saved: false,
  },

  {
    id: 'we-en45545-rail',
    url: 'https://www.we-online.com/en/news-center/blog?d=en-45545-2-rail-standard',
    title: 'EN 45545-2 Railway Certification — Ready for Rail',
    summary:
      'Würth Elektronik PCBs are now certified to EN 45545-2, the European fire-protection standard for railway vehicles. Hazard levels HL1 through HL3 are covered — enabling use in rolling stock, driver cabs, and railway infrastructure equipment.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-cbt-rail-standard-en-45545-2.jpg',
    publishedAt: '2026-05-12T08:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'news',
    tags: ['railway', 'EN-45545-2', 'certification', 'PCB', 'safety', 'rail', 'fire-protection'],
    upvotes: 67,
    saved: false,
  },

  {
    id: 'we-valencia-emc',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=10-jahre-catedra',
    title: '10 Years of EMC Research — University of Valencia Partnership',
    summary:
      'Würth Elektronik and the University of Valencia celebrate a decade of EMC research collaboration. The Cátedra Würth has produced 40+ peer-reviewed publications, 12 PhD theses, and EMC measurement tools freely released to the electronics industry.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1843_01_valencia.jpg',
    publishedAt: '2026-04-15T09:00:00.000Z',
    source: 'Würth Elektronik Press',
    category: 'news',
    tags: ['EMC', 'university', 'Valencia', 'research', 'partnership', 'academic', 'PhD'],
    upvotes: 76,
    saved: false,
  },

  {
    id: 'we-united-summit',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=we-united',
    title: 'WE United Leadership Summit — Navigating Complex Technology Environments',
    summary:
      'Würth Elektronik hosted the WE United Leadership Summit in Munich, bringing together senior leaders across all divisions to discuss technological complexity, talent pipelines, university collaboration, and the company\'s innovation roadmap for 2026–2030.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-united_hic-muenchen.jpg',
    publishedAt: '2026-04-10T10:00:00.000Z',
    source: 'Würth Elektronik Press',
    category: 'news',
    tags: ['leadership', 'summit', 'strategy', 'innovation', 'Munich', 'culture', 'roadmap'],
    upvotes: 38,
    saved: false,
  },

  {
    id: 'we-news-center',
    url: 'https://www.we-online.com/en/news-center/overview',
    title: 'Würth Elektronik News Center — Events, Press & Updates',
    summary:
      'The central hub for all Würth Elektronik news: press releases, blog articles, upcoming events, product launches, and industry insights. Stay informed on the latest developments from one of Europe\'s leading electronic component manufacturers.',
    publishedAt: '2026-01-01T00:00:00.000Z',
    source: 'Würth Elektronik',
    category: 'news',
    tags: ['news', 'press', 'events', 'updates', 'overview', 'company'],
    upvotes: 19,
    saved: false,
  },

  {
    id: 'we-overview',
    url: 'https://www.we-online.com/en/company/overview',
    title: 'About Würth Elektronik — Manufacturer of Electronic & Electromechanical Components',
    summary:
      'Würth Elektronik eiSos GmbH & Co. KG is a leading manufacturer of electrical and electromechanical components, printed circuit boards, and intelligent systems. Family-owned, headquartered in Waldenburg, Germany — 7,800+ employees globally, free samples available.',
    publishedAt: '2026-01-01T00:00:00.000Z',
    source: 'Würth Elektronik',
    category: 'news',
    tags: ['company', 'overview', 'manufacturer', 'components', 'PCB', 'Germany', 'Waldenburg'],
    upvotes: 29,
    saved: false,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  BLOG
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'we-innovative-employer',
    url: 'https://www.we-online.com/en/news-center/blog?d=innovative-company',
    title: 'How to Find an Innovative Employer? Würth Elektronik\'s Answer',
    summary:
      'What makes a company genuinely innovative — and how do you identify one? Würth Elektronik shares its approach: sustained R&D investment, know-how transfer via university partnerships, engineering-first culture, and flat hierarchies. Essential reading for students evaluating employers.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/bild-5-fh230403_wemuc_0947m.jpg',
    publishedAt: '2026-05-18T09:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'blog',
    tags: ['employer', 'innovation', 'R&D', 'culture', 'students', 'career', 'university'],
    upvotes: 94,
    saved: false,
  },

  {
    id: 'we-pcb-quality',
    url: 'https://www.we-online.com/en/news-center/blog?d=small-component',
    title: 'Small Component, Big Responsibility — The Truth About PCB Quality',
    summary:
      'PCBs are rarely what engineers think hardest about — but they\'re often the root cause of field failures. Dr. Andreas Schilpp\'s webinar covers IPC class selection, material choices, copper roughness, and why blind/buried via quality matters more than most engineers realise.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/cbt-speaker-webinar-andreas-schilpp.jpg',
    publishedAt: '2026-05-08T10:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'blog',
    tags: ['PCB', 'quality', 'IPC', 'webinar', 'reliability', 'manufacturing', 'vias'],
    upvotes: 83,
    saved: false,
  },

  {
    id: 'we-smartwatch',
    url: 'https://www.we-online.com/en/news-center/blog?d=advanced-hdi-open-source-smartwatch-en',
    title: 'Open Source Smartwatch Powered by ADVANCED.hdi PCB Technology',
    summary:
      'OV Tech\'s open-source smartwatch uses Würth Elektronik\'s ADVANCED.hdi high-density interconnect PCBs to pack BLE connectivity, IMU, display driver, and 72-hour battery life into a 38×38 mm board — a showcase of what HDI enables for next-generation wearable electronics.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-cbt-advanced-hdi-open-source-smartwatch-ovtech-2.jpeg',
    publishedAt: '2026-04-30T09:00:00.000Z',
    source: 'Würth Elektronik Blog',
    category: 'blog',
    tags: ['HDI', 'PCB', 'smartwatch', 'open-source', 'wearable', 'BLE', 'ADVANCED-hdi', 'IoT'],
    upvotes: 142,
    saved: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  EVENTS
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'we-seminars',
    url: 'https://www.we-online.com/en/news-center/events/seminars',
    title: 'Free Seminars — Electronics, EMC, PCB Design & More',
    summary:
      'Würth Elektronik runs free expert-led seminars worldwide covering power electronics, EMC compliance, PCB design rules, RF fundamentals, and magnetics design. Available in-person and online. Free registration — suitable for students and working engineers alike.',
    publishedAt: '2026-06-01T23:00:00.000Z',
    source: 'Würth Elektronik Events',
    category: 'event',
    tags: ['seminar', 'free', 'EMC', 'PCB', 'power-electronics', 'RF', 'training', 'education', 'magnetics'],
    upvotes: 201,
    saved: true,
  },

  {
    id: 'we-pcim-2026',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=ankuendigung-pcim',
    title: 'Würth Elektronik at PCIM Europe 2026 — Modern Power Electronics Solutions',
    summary:
      'Würth Elektronik exhibits at PCIM Europe 2026, Nuremberg (27–29 May). Visit Hall 9, Stand 540 for live demos of SiC gate drivers, resonant magnetics, GaN-compatible inductors, and the REDEXPERT simulation platform.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1832_01.jpg',
    publishedAt: '2026-05-01T09:00:00.000Z',
    source: 'Würth Elektronik Events',
    category: 'event',
    tags: ['PCIM', 'exhibition', 'Nuremberg', 'SiC', 'GaN', 'power-electronics', 'event', 'REDEXPERT'],
    upvotes: 133,
    saved: false,
  },

  {
    id: 'we-ivt-2026',
    url: 'https://www.we-online.com/en/news-center/press/press-releases?d=wuerth-elektronik-ics-at-ivt-2026',
    title: 'Würth Elektronik ICS at iVT Expo 2026 — Intelligent Power Distribution',
    summary:
      'Würth Elektronik ICS exhibits at iVT International Expo 2026, showcasing intelligent power distribution for off-highway vehicles. Live demos include solid-state relay modules, CANopen-controlled distribution boxes, and the new ICS SmartBox system.',
    image: 'https://www.we-online.com/apps/services/image.cfm?source=png1/we-ics-logo-ivt-2026.png',
    publishedAt: '2026-03-20T09:00:00.000Z',
    source: 'Würth Elektronik ICS',
    category: 'event',
    tags: ['iVT', 'exhibition', 'ICS', 'off-highway', 'power-distribution', 'CANopen', 'event'],
    upvotes: 44,
    saved: false,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  //  CAREER
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'ikom-tum',
    url: 'https://ikom-tum.de/en',
    title: 'IKOM — TU Munich Career Forum (4 Annual Job Fairs)',
    summary:
      'IKOM organises four career job fairs per year at the Technical University of Munich, connecting students directly with engineering companies including Würth Elektronik. Open to all students — free registration. A key event for hardware, embedded, and electronics engineering careers.',
    publishedAt: '2026-06-01T12:00:00.000Z',
    source: 'IKOM · TU Munich',
    category: 'career',
    tags: ['career', 'job-fair', 'TUM', 'Munich', 'students', 'networking', 'IKOM', 'engineering'],
    upvotes: 167,
    saved: false,
  },

];

// ─── Derived category slices ─────────────────────────────────────────────────

export const WE_PRODUCTS = WE_FEED_ITEMS.filter(i => i.category === 'product');
export const WE_SERVICES = WE_FEED_ITEMS.filter(i => i.category === 'service');
export const WE_NEWS     = WE_FEED_ITEMS.filter(i => ['news', 'blog'].includes(i.category));
export const WE_EVENTS   = WE_FEED_ITEMS.filter(i => ['event', 'career'].includes(i.category));

// ─── Trending tags (by frequency across all items) ───────────────────────────

const _tagFreq: Record<string, number> = {};
WE_FEED_ITEMS.forEach(item => item.tags.forEach(t => { _tagFreq[t] = (_tagFreq[t] ?? 0) + 1; }));

export const WE_TRENDING_TAGS = Object.entries(_tagFreq)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12)
  .map(([tag]) => tag);

// ─── FAQ entries for the WE Assistant chatbot ────────────────────────────────

export interface WEFaqEntry {
  question: string;
  keywords: string[];
  answerIntro: string;
  matchCategories: WEItemCategory[];
}

export const WE_FAQ: WEFaqEntry[] = [
  {
    question: 'What products does Würth Elektronik offer?',
    keywords: ['product', 'components', 'catalogue', 'portfolio', 'what do you sell', 'what makes', 'offer'],
    answerIntro: 'Würth Elektronik manufactures a broad range of electronic components. Here are highlights from the latest portfolio:',
    matchCategories: ['product'],
  },
  {
    question: 'Are there any free training or seminars?',
    keywords: ['seminar', 'training', 'course', 'learn', 'workshop', 'education', 'free', 'webinar'],
    answerIntro: 'Yes — Würth Elektronik offers free worldwide seminars on electronics, EMC, PCB design, and more:',
    matchCategories: ['event'],
  },
  {
    question: 'What are the latest Würth Elektronik news?',
    keywords: ['news', 'latest', 'recent', 'update', 'announcement', 'new', 'press'],
    answerIntro: 'Here\'s what\'s new from Würth Elektronik:',
    matchCategories: ['news', 'blog'],
  },
  {
    question: 'Tell me about career and job opportunities',
    keywords: ['job', 'career', 'hiring', 'internship', 'work', 'vacancy', 'apply', 'employer', 'student'],
    answerIntro: 'Looking to join the Würth Elektronik ecosystem? Here are relevant opportunities:',
    matchCategories: ['career', 'event', 'blog'],
  },
  {
    question: 'What EMI / EMC solutions are available?',
    keywords: ['EMI', 'EMC', 'shielding', 'filter', 'interference', 'noise', 'compliance', 'electromagnetic'],
    answerIntro: 'Würth Elektronik offers a broad EMI/EMC product and knowledge portfolio:',
    matchCategories: ['product', 'service', 'blog', 'event'],
  },
  {
    question: 'Tell me about PCB services and manufacturing',
    keywords: ['PCB', 'circuit board', 'printed circuit', 'layout', 'board', 'HDI', 'multilayer', 'WEsystems'],
    answerIntro: 'Würth Elektronik is a leading PCB manufacturer and full-service provider:',
    matchCategories: ['service', 'product', 'blog'],
  },
  {
    question: 'What automotive electronics products do you have?',
    keywords: ['automotive', 'vehicle', 'car', 'AEC', 'ADAS', 'EV', 'off-highway', 'ICS', 'powertrain'],
    answerIntro: 'Würth Elektronik has dedicated automotive product lines and ICS system solutions:',
    matchCategories: ['product', 'service', 'event'],
  },
  {
    question: 'What LED and lighting products are available?',
    keywords: ['LED', 'lighting', 'light', 'horticulture', 'illumination', 'display', 'photonics', 'SMDC'],
    answerIntro: 'Würth Elektronik\'s LED portfolio covers general lighting through to precision horticultural applications:',
    matchCategories: ['product'],
  },
  {
    question: 'What upcoming events or trade shows?',
    keywords: ['event', 'exhibition', 'expo', 'trade show', 'upcoming', 'calendar', 'PCIM', 'iVT', 'conference'],
    answerIntro: 'Würth Elektronik actively participates in key industry events:',
    matchCategories: ['event'],
  },
  {
    question: 'What sustainability and ESG initiatives does Würth Elektronik have?',
    keywords: ['sustainability', 'ESG', 'green', 'RoHS', 'lead-free', 'EcoVadis', 'environment', 'responsible'],
    answerIntro: 'Sustainability is central to Würth Elektronik\'s operations:',
    matchCategories: ['news', 'product'],
  },
  {
    question: 'Tell me about intelligent systems and power distribution',
    keywords: ['ICS', 'intelligent', 'power distribution', 'SmartBox', 'CANopen', 'relay', 'control system'],
    answerIntro: 'Würth Elektronik ICS provides intelligent power and control systems for demanding applications:',
    matchCategories: ['service', 'event'],
  },
  {
    question: 'What railway and rail-certified products are available?',
    keywords: ['railway', 'rail', 'EN 45545', 'rolling stock', 'train', 'metro', 'traction'],
    answerIntro: 'Würth Elektronik offers rail-certified PCBs and components:',
    matchCategories: ['news', 'product'],
  },
];

// ─── Feed search (used by WE Assistant chatbot) ───────────────────────────────

export function searchFeed(query: string): {
  items: WEFeedItem[];
  matchedFaq: WEFaqEntry | null;
  confidence: 'high' | 'medium' | 'low';
} {
  const q = query.toLowerCase();

  // 1. Best-matching FAQ entry
  let matchedFaq: WEFaqEntry | null = null;
  let bestFaqScore = 0;
  for (const faq of WE_FAQ) {
    const score = faq.keywords.filter(kw => q.includes(kw.toLowerCase())).length;
    if (score > bestFaqScore) { bestFaqScore = score; matchedFaq = faq; }
  }

  // 2. Score every feed item against tags + title + summary
  const scored = WE_FEED_ITEMS.map(item => {
    let score = 0;
    const haystack = `${item.title} ${item.summary} ${item.tags.join(' ')}`.toLowerCase();
    item.tags.forEach(t => { if (q.includes(t.toLowerCase())) score += 3; });
    q.split(/\s+/).forEach(word => {
      if (word.length > 2 && haystack.includes(word)) score += 1;
    });
    if (matchedFaq?.matchCategories.includes(item.category)) score += 2;
    return { item, score };
  })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.item);

  const confidence: 'high' | 'medium' | 'low' =
    scored.length >= 3 ? 'high' : scored.length >= 1 ? 'medium' : 'low';

  return { items: scored, matchedFaq, confidence };
}
