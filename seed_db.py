"""
seed_db.py — Würth Platform Interface · SQLite Seed Script
Processes all 6 data files and loads them into wurth_platform.db
Run: python seed_db.py
"""
import sqlite3, json, os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "wurth_platform.db")

# ──────────────────────────────────────────────────────────────────────────────
# DATA (extracted from all 6 TypeScript source files)
# ──────────────────────────────────────────────────────────────────────────────

# ── mockData.ts ───────────────────────────────────────────────────────────────

ALL_BADGES = [
    ("bg-first-post","First Post","Published your first post","✍️","bronze","contribution"),
    ("bg-bounty-hunter","Bounty Hunter","Applied to and completed your first bounty","🎯","silver","contribution"),
    ("bg-eagle-scout","Eagle Scout","Completed 5 or more bounties","🦅","gold","contribution"),
    ("bg-top-solver","Top Solver","Ranked #1 on the monthly leaderboard","🏆","platinum","contribution"),
    ("bg-code-wizard","Code Wizard","Submitted a bounty accepted without revisions","🧙","gold","contribution"),
    ("bg-community-start","Founder","Created a community with 50+ members","🏛️","silver","community"),
    ("bg-connector","Connector","Member of 5+ communities simultaneously","🔗","bronze","community"),
    ("bg-event-host","Event Host","Organised a workshop with 20+ attendees","🎤","silver","community"),
    ("bg-helpful","Most Helpful","Answered 10 open Q&A questions","🙌","gold","community"),
    ("bg-news-hound","News Hound","Read 20 electronics industry news articles","📰","bronze","learning"),
    ("bg-cert-pro","Certified Pro","Earned your first professional certificate","📜","silver","learning"),
    ("bg-deep-diver","Deep Diver","Completed all materials for a full course track","🤿","gold","learning"),
    ("bg-rising-star","Rising Star","Earned 500 XP within your first 30 days","⭐","silver","achievement"),
    ("bg-innovator","Innovator","Project received institutional endorsement","💡","gold","achievement"),
    ("bg-veteran","Veteran","Active on the platform for over 1 year","🎖️","silver","achievement"),
    ("bg-og","OG","Joined during the platform beta","🌟","platinum","special"),
    ("bg-mentor","Mentor","Successfully mentored 3+ students to completion","🧑‍🏫","gold","special"),
    ("bg-hardware-hacker","Hardware Hacker","Built and shipped a physical electronics prototype","🔧","silver","special"),
]

MOCK_USERS = [
    ("u1","student","Priya Nair","https://api.dicebear.com/7.x/avataaars/svg?seed=Priya","CS Senior @ Carnegie Mellon · Full-stack & ML","Pittsburgh, PA","Carnegie Mellon University",2026,'["TypeScript","React","Python","PyTorch","PostgreSQL"]',412,188,"Building things at the intersection of systems and intelligence.",1840,'["distributed-systems","machine-learning","open-source","power-electronics"]',"2024-09-01",None,None,None),
    ("u2","student","Marcus Webb","https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus","Product Design · UC San Diego · 2025","San Diego, CA","UC San Diego",2025,'["Figma","React","CSS","User Research","Prototyping"]',289,143,"Designer who codes. Interested in how interfaces shape behavior at scale.",920,'["ux-design","product","prototyping","accessibility"]',"2024-01-15",None,None,None),
    ("u3","student","Aisha Kamara","https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha","Data Science @ UT Austin · Class of 2026","Austin, TX","University of Texas at Austin",2026,'["Python","SQL","Tableau","R","Machine Learning"]',174,96,"Turning messy data into clear decisions. Passionate about climate tech.",610,'["data-science","climate","geospatial","open-source"]',"2024-03-10",None,None,None),
    ("u4","company","Meridian Labs","https://api.dicebear.com/7.x/initials/svg?seed=ML","Developer tools for the next generation of engineers","San Francisco, CA",None,None,'[]',3820,41,"We build infrastructure that helps engineering teams ship faster.",2400,'[]',"2023-06-01","https://meridianlabs.dev","Developer Tools / SaaS","51–200 employees"),
    ("u5","company","GreenPulse","https://api.dicebear.com/7.x/initials/svg?seed=GP","Climate tech powering a sustainable future","Boston, MA",None,None,'[]',1240,22,"Our platform helps cities track and reduce carbon emissions in real time.",1180,'[]',"2023-11-15","https://greenpulse.io","Climate Tech","11–50 employees"),
    ("u6","company","Stackform","https://api.dicebear.com/7.x/initials/svg?seed=SF","No-code infrastructure, built for teams","New York, NY",None,None,'[]',6110,80,"Stackform replaces your tangled internal tools with one coherent platform.",3250,'[]',"2022-04-10","https://stackform.com","Enterprise SaaS","201–500 employees"),
    ("u7","educator","Prof. Elena Hartmann","https://api.dicebear.com/7.x/avataaars/svg?seed=Elena","Chair of Electrical Engineering · TU Munich","Munich, Germany","Technical University of Munich",None,'[]',1847,63,"Professor and department chair overseeing 14 research groups.",2900,'[]',"2023-10-01",None,None,None),
    ("admin-001","corporate_admin","System Administrator","https://api.dicebear.com/7.x/initials/svg?seed=SA","Platform Administrator","Virtual",None,None,'[]',0,0,"Platform administration and oversight.",0,'[]',"2024-01-01",None,None,None),
]

USER_BADGES = [
    ("u1","bg-og","2024-09-01"),("u1","bg-first-post","2024-09-03"),("u1","bg-bounty-hunter","2025-02-10"),
    ("u1","bg-rising-star","2024-10-01"),("u1","bg-innovator","2026-03-15"),("u1","bg-connector","2026-01-20"),
    ("u2","bg-og","2024-01-15"),("u2","bg-first-post","2024-01-20"),("u2","bg-veteran","2025-01-15"),("u2","bg-news-hound","2026-04-01"),
    ("u3","bg-first-post","2024-03-15"),("u3","bg-news-hound","2025-11-01"),("u3","bg-connector","2026-02-01"),
    ("u4","bg-og","2023-06-01"),("u4","bg-helpful","2024-06-01"),("u4","bg-event-host","2025-03-01"),("u4","bg-top-solver","2026-01-01"),
    ("u5","bg-innovator","2024-05-01"),("u5","bg-connector","2025-01-01"),
    ("u6","bg-og","2022-04-10"),("u6","bg-top-solver","2023-01-01"),("u6","bg-event-host","2023-06-01"),("u6","bg-eagle-scout","2024-03-01"),("u6","bg-code-wizard","2024-08-01"),
    ("u7","bg-mentor","2024-06-01"),("u7","bg-event-host","2024-09-01"),("u7","bg-deep-diver","2025-01-01"),("u7","bg-cert-pro","2025-06-01"),("u7","bg-helpful","2026-01-01"),("u7","bg-community-start","2024-03-01"),
]

USER_ACHIEVEMENTS = [
    ("ach1","u1","Bounty Accepted","Carbon Footprint Calculator bounty accepted by GreenPulse","🎯",300,"2026-03-01T00:00:00Z"),
    ("ach2","u1","VoltForge Endorsed","Team VoltForge project received institutional endorsement","✅",500,"2026-05-20T00:00:00Z"),
    ("ach3","u1","400 Followers","Reached 400 followers on the platform","👥",200,"2026-04-01T00:00:00Z"),
    ("ach4","u1","Q&A Helper","Answered 5 open Q&A questions this week","💬",150,"2026-06-15T00:00:00Z"),
    ("ach5","u2","Storybook Award","Aria Design System featured in platform showcase","📚",250,"2026-02-10T00:00:00Z"),
    ("ach6","u2","Bounty Applied","Applied to Stackform onboarding redesign bounty","🎯",50,"2026-06-12T00:00:00Z"),
    ("ach7","u3","AirView Featured","AirView Austin project featured in community spotlight","🌿",300,"2026-06-14T00:00:00Z"),
    ("ach8","u3","Data Deep Diver","Published a Jupyter notebook with reproducible analysis","📊",150,"2026-03-01T00:00:00Z"),
    ("ach9","u7","100 Certificates Issued","Issued over 100 student certificates through the platform","📜",1000,"2026-05-01T00:00:00Z"),
    ("ach10","u7","Research Spotlight","Featured in the monthly educator spotlight","🔬",500,"2026-03-01T00:00:00Z"),
]

USER_CERTIFICATES = [
    ("cert1","u1","Power Electronics Fundamentals","TU Munich · Prof. Elena Hartmann","2026-06-01","TUM-EE401-2026-U1",'["MOSFET","Gate Drive","Magnetics","Thermal Design"]',"🏅"),
]

MOCK_POSTS = [
    ("p1","u4","text","We're opening 3 summer internship spots for backend engineers.",184,27,"2026-06-18T08:00:00Z",'["hiring","internship","backend"]',None,None,None,None),
    ("p2","u1","image","Shipped my final project for Advanced Systems this semester — a distributed key-value store in Go.",312,44,"2026-06-17T12:00:00Z",'["Go","distributed-systems","projects"]',"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",None,None,None),
    ("p3","u5","link","We just published our 2026 Climate Tech Talent Report.",97,33,"2026-06-16T09:30:00Z",'["climate","hiring","report"]',None,"https://greenpulse.io/report-2026","2026 Climate Tech Talent Report","Key hiring trends, salary benchmarks, and the skills gap facing climate-focused companies."),
    ("p4","u2","text","Hot take: most onboarding flows treat first-time users like they already know what the product does.",228,19,"2026-06-15T18:00:00Z",'["design","ux","product"]',None,None,None,None),
    ("p5","u3","text","Built a dashboard that tracks Austin's real-time air quality + overlays traffic and weather data.",157,22,"2026-06-14T11:00:00Z",'["data","climate","open-source"]',None,None,None,None),
    ("p6","u6","text","We crossed 4,000 teams on Stackform this month.",541,88,"2026-06-13T14:00:00Z",'["milestone","product"]',None,None,None,None),
]

POST_COMMENTS = [
    ("c1","p1","u1","Just applied! Love what you all are building with the CI pipeline tooling.","2026-06-18T10:22:00Z",4),
    ("c2","p2","u4","This is impressive work — have you considered Go for backend roles?","2026-06-17T14:05:00Z",7),
    ("c3","p2","u2","Congrats Priya!! 🎉","2026-06-17T14:30:00Z",2),
    ("c4","p4","u6","Notion's early onboarding was the gold standard for us.","2026-06-15T20:10:00Z",11),
    ("c5","p6","u2","Big congrats! Stackform's component library was the best DX I've used.","2026-06-13T16:00:00Z",14),
]

MOCK_JOBS = [
    ("j1","u4","Backend Engineering Intern","San Francisco, CA (Hybrid)","Internship","$45–55 / hr","Join our core platform team to help build infrastructure thousands of engineering teams rely on daily.",'["Go","Rust","Distributed Systems","Backend","Internship"]',"2026-06-18T08:00:00Z",38),
    ("j2","u5","Data Engineer (Full-time)","Boston, MA (On-site)","Full-time","$120,000–$145,000","GreenPulse is hiring a Data Engineer to expand our real-time emissions tracking pipeline.",'["Python","SQL","Kafka","Data Engineering","Climate"]',"2026-06-15T09:00:00Z",24),
    ("j3","u6","Product Design Intern","New York, NY (Hybrid)","Internship","$38–46 / hr","Stackform is looking for a product design intern to join the platform experience team.",'["Figma","Product Design","UX Research","Internship"]',"2026-06-12T11:00:00Z",61),
    ("j4","u4","Developer Advocate (Contract)","Remote","Contract","$80–100 / hr","Help us reach developer communities through technical content, talks, and open-source contributions.",'["DevRel","Technical Writing","Open Source","Remote"]',"2026-06-10T10:00:00Z",17),
    ("j5","u5","Climate Data Analyst Intern","Remote","Internship","$28–35 / hr","Analyse emissions datasets, build reporting pipelines, and help surface insights for policy decisions.",'["Python","Data Analysis","Climate","Internship","Remote"]',"2026-06-08T08:00:00Z",49),
]

MOCK_BOUNTIES = [
    ("b1","u4","Build a CI/CD Pipeline Visualizer Widget","Meridian Labs needs an embeddable React widget that visualizes CI/CD pipeline runs in real time.",'["React","TypeScript","D3","SVG","CI/CD","npm"]',"$750 cash","2–3 weeks","2026-07-15T23:59:00Z","2026-06-18T09:00:00Z",12,"open"),
    ("b2","u4","Write a 5-Part Tutorial Series on Distributed Tracing","A well-structured technically accurate tutorial series on distributed tracing from first principles.",'["Technical Writing","Go","Python","OpenTelemetry","Distributed Systems"]',"$500 + byline credit","3–4 weeks","2026-07-25T23:59:00Z","2026-06-15T10:00:00Z",8,"open"),
    ("b3","u5","Carbon Footprint Calculator — React Component","GreenPulse needs a standalone React component that lets users estimate their household carbon footprint.",'["React","TypeScript","Storybook","Climate","Accessibility"]',"$600 cash","3 weeks","2026-07-20T23:59:00Z","2026-06-14T11:00:00Z",19,"open"),
    ("b4","u5","Urban Tree Coverage vs Urban Heat Island — Data Analysis","Analyse datasets from 12 US cities covering satellite-derived tree canopy coverage and temperature anomalies.",'["Python","Data Analysis","GIS","Climate","Statistics"]',"$400 + co-authorship","2–3 weeks","2026-07-10T23:59:00Z","2026-06-10T08:00:00Z",7,"reviewing"),
    ("b5","u6","Redesign Stackform Onboarding Flow (UX + Hi-Fi)","Our onboarding drop-off rate at step 3 is 54%. We need a product designer to audit and redesign.",'["Figma","UX Design","Product Design","Onboarding","SaaS"]',"$800 cash","3–4 weeks","2026-07-28T23:59:00Z","2026-06-12T14:00:00Z",31,"open"),
    ("b6","u6","TypeScript REST API Client SDK","Stackform is publishing a public API and needs a first-class TypeScript SDK.",'["TypeScript","SDK","REST API","npm","OpenAPI"]',"$1,000 cash","4–6 weeks","2026-08-10T23:59:00Z","2026-06-08T10:00:00Z",15,"open"),
]

MOCK_PROJECTS = [
    ("pr1","u1","RaftKV — Distributed Key-Value Store","A fault-tolerant distributed key-value store built on the Raft consensus algorithm in Go.",'["Go","Distributed Systems","Raft","GCP"]',"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80","https://github.com/priya/raftkv",None,88,"2026-06-01T00:00:00Z"),
    ("pr2","u2","Aria Design System","An accessible token-based component library built in React + TypeScript. Includes 40+ components.",'["React","TypeScript","Figma","Accessibility","Storybook"]',"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80","https://github.com/marcuswebb/aria-ds","https://aria-ds.vercel.app",143,"2026-05-10T00:00:00Z"),
    ("pr3","u3","AirView Austin","Real-time dashboard visualizing Austin air quality index and correlations with traffic and weather data.",'["Python","React","Plotly","PostgreSQL","Climate"]',"https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80","https://github.com/aishakamara/airview","https://airview.vercel.app",72,"2026-06-14T00:00:00Z"),
    ("pr4","u1","NoteSync — Local-First Notes App","A local-first Markdown notes app with real-time peer-to-peer sync using CRDTs (Yjs).",'["TypeScript","Yjs","CRDTs","Electron","Markdown"]',None,"https://github.com/priya/notesync",None,54,"2026-04-20T00:00:00Z"),
    ("pr5","u2","Onboard.fyi — Onboarding UX Teardowns","A curated collection of annotated onboarding flow breakdowns from 30+ products.",'["UX Research","Product Design","Case Studies"]',"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",None,"https://onboard.fyi",201,"2026-03-05T00:00:00Z"),
]

LECTURE_MATERIALS = [
    ("lm1","u7","Week 9 — Inverter Topologies & Gate Drive Circuits","EE401 — Power Electronics","slides","2026-06-17T09:00:00Z",214,"6.1 MB",'["MOSFET","gate-drive","inverters"]',1),
    ("lm2","u7","Lab 4 Handout — Half-Bridge Converter Bench Setup","EE401 — Power Electronics","lab","2026-06-15T14:30:00Z",198,"2.3 MB",'["half-bridge","bench","lab"]',1),
    ("lm3","u7","Lecture Notes — Thermal Management in High-Power","EE401 — Power Electronics","notes","2026-06-12T11:00:00Z",156,"1.8 MB",'["thermal","heatsinks"]',1),
    ("lm4","u7","Week 8 — Magnetics Design: Transformers & Inductors","EE401 — Power Electronics","slides","2026-06-10T09:00:00Z",231,"8.4 MB",'["magnetics","transformers","inductors"]',1),
    ("lm5","u7","Recorded Lecture — PFC & EMC Compliance Basics","EE501 — Power Systems Advanced","recording","2026-06-08T16:00:00Z",87,"312 MB",'["PFC","EMC","compliance"]',1),
    ("lm6","u7","Draft: Week 10 — SiC & GaN Wide-Bandgap Devices","EE401 — Power Electronics","slides","2026-06-19T08:00:00Z",0,"5.7 MB",'["SiC","GaN","wide-bandgap"]',0),
]

STUDENT_INITIATIVES = [
    ("si1","VoltForge",'["Priya Nair","Jonas Becker","Amara Osei"]',"Bidirectional EV Charger — 3.3 kW Prototype","Designing a vehicle-to-grid capable 3.3 kW bidirectional onboard charger using SiC MOSFETs.",'["SiC MOSFET WMT3N120","Gate Driver WGD220","Common-mode choke WE-CMB"]',"Würth Elektronik",1,"2026-05-20T00:00:00Z","active"),
    ("si2","GreenGrid",'["Marcus Webb","Aisha Kamara"]',"Microgrid Controller for Campus Solar Array","Embedded controller managing power flow between 40 kW rooftop solar and battery buffer.",'["Toroidal Inductor WE-TI","EMI Filter WE-CLFS","DC-Link Capacitor"]',"Würth Elektronik",0,"2026-06-01T00:00:00Z","pending-review"),
    ("si3","PulseDrive",'["Lena Vogel","Tobias Müller","Yuki Tanaka","Fatima Al-Hassan"]',"Brushless Motor Driver for Autonomous Campus Shuttle","Three-phase BLDC drive system for a low-speed autonomous vehicle project.",'["Gate Driver WGD100","Power Inductor WE-PD4","Current Sense Resistor"]',"Würth Elektronik",1,"2026-04-15T00:00:00Z","active"),
    ("si4","StorEd",'["Kwame Asante","Priya Nair"]',"Modular 48V Battery Management System","Scalable BMS for lithium-iron-phosphate cell stacks with active balancing.",'["Shunt Resistor WSLP","Ferrite Bead WE-CBF","NTC Thermistor"]',"Würth Elektronik",0,"2026-06-10T00:00:00Z","pending-review"),
    ("si5","FluxLab",'["Anika Rao","Chen Wei","Marcus Webb"]',"Wireless Power Transfer — 200W Qi2 Pad","High-efficiency inductive power transfer pad reaching 93% efficiency at 200W.",'["Wireless Charging Coil WE-WPCC","Resonant Capacitor","Shielding Foil"]',"Würth Elektronik",1,"2026-03-28T00:00:00Z","completed"),
]

QA_CHANNELS = [
    ("qa1","Gate driver bootstrap supply — floating ground confusion","EE401 — Power Electronics",3,18,"2026-06-19T22:10:00Z",'["gate-driver","bootstrap","half-bridge"]'),
    ("qa2","Lab 4 oscilloscope ringing — measurement artefact or real?","EE401 — Power Electronics",7,31,"2026-06-19T20:45:00Z",'["lab","oscilloscope","ringing"]'),
    ("qa3","SiC vs GaN for 48V-bus DC-DC — selection criteria","EE501 — Power Systems Advanced",2,9,"2026-06-18T16:00:00Z",'["SiC","GaN","device-selection"]'),
    ("qa4","Thermal pad placement for TO-247 packages on PCB","EE401 — Power Electronics",4,14,"2026-06-17T11:30:00Z",'["thermal","PCB","layout"]'),
]

DEADLINES = [
    ("dl1","Lab 4 Report Submission","lab-submission","2026-06-23T23:59:00Z","EE401 — Power Electronics",None,"high"),
    ("dl2","Carbon Footprint Calculator Bounty","bounty","2026-07-20T23:59:00Z",None,"b3","medium"),
    ("dl3","EE401 Mid-term Project Proposal","assignment","2026-06-27T17:00:00Z","EE401 — Power Electronics",None,"high"),
    ("dl4","CI/CD Visualizer Widget Bounty","bounty","2026-07-15T23:59:00Z",None,"b1","medium"),
    ("dl5","VoltForge — Weekly Progress Check-in","project-review","2026-06-21T14:00:00Z",None,None,"low"),
]

COMMUNITIES = [
    ("cm1","Power Electronics Society","The hub for students and professionals working on power conversion, motor drives, and renewable energy.","research-club",842,'["MOSFET","inverters","PFC","SiC","GaN","magnetics"]',"2024-01-10",1,"⚡",34,1),
    ("cm2","PCB Design Guild","Share PCB layouts, get design-rule feedback, discuss signal integrity and HDI stackups.","study-group",521,'["KiCad","Altium","signal-integrity","EMC","HDI"]',"2024-03-22",0,"🔌",22,1),
    ("cm3","Embedded & IoT Builders","From bare-metal RTOS to Linux on a Pi — hands-on embedded developers space.","open-source",1104,'["STM32","RTOS","FreeRTOS","Linux","Zephyr","UART","SPI"]',"2023-11-05",1,"🤖",58,1),
    ("cm4","RF & Wireless Engineers","Antenna design, RF front-ends, spectrum analysis, Bluetooth/WiFi/5G.","research-club",318,'["antenna","RF","spectrum","5G","Bluetooth","Zigbee"]',"2024-05-01",0,"📡",14,0),
    ("cm5","Würth Prototyping Circle","Exclusive to students using Würth Elektronik components through the academic access programme.","industry-connect",247,'["Würth","components","prototyping","magnetics","gate-drivers"]',"2024-02-15",1,"🔧",11,1),
    ("cm6","Women in EE & Tech","A community for women and non-binary engineers in electrical engineering and related fields.","mentorship-circle",389,'["community","mentorship","career","inclusion"]',"2024-04-08",0,"💜",19,0),
    ("cm7","EV & E-Mobility Hackers","Battery management systems, motor controllers, charging infrastructure, and vehicle-to-grid.","hackathon-team",673,'["BMS","motor-control","V2G","SiC","CAN","EV"]',"2023-09-20",1,"🚗",41,1),
    ("cm8","AI Hardware Accelerators","FPGA, custom ASICs, GPU microarchitecture, and the hardware powering modern AI workloads.","research-club",456,'["FPGA","ASIC","GPU","HLS","Verilog","AI"]',"2024-06-01",0,"🧠",27,0),
]

COMMUNITY_EVENTS = [
    ("ev1","cm1","GaN vs SiC Selection Workshop","Interactive workshop comparing GaN and SiC devices for 48V-bus applications.","workshop","2026-06-25T18:00:00Z","Online (Zoom)",87,120,'["GaN","SiC","device-selection","workshop"]',1),
    ("ev2","cm3","FreeRTOS Task Scheduling Deep Dive","Technical walkthrough of FreeRTOS task priorities, pre-emption, and common pitfalls.","workshop","2026-06-27T17:00:00Z","Online (Discord Stage)",142,200,'["FreeRTOS","STM32","RTOS","debugging"]',0),
    ("ev3","cm7","EV Battery Pack Design Hackathon","48-hour virtual hackathon: design a 72V 20Ah pack for an electric cargo bike.","hackathon","2026-07-05T09:00:00Z","Online (Async + Final Pitch Call)",56,80,'["BMS","battery-design","hackathon","EV"]',0),
    ("ev4","cm2","PCB Layout Review Night #12","Submit your PCB layout; community members give structured constructive feedback.","networking","2026-06-28T19:00:00Z","Online (Zoom)",33,None,'["PCB","review","KiCad","Altium"]',1),
    ("ev5","cm8","FPGA Acceleration for Neural Networks — Industry Talk","Engineer from Xilinx/AMD presents real-world FPGA deployment patterns for ML inference.","talk","2026-07-02T16:00:00Z","Online (YouTube Live)",214,None,'["FPGA","AI","inference","ML","industry"]',0),
    ("ev6","cm5","Würth Components Office Hours","Monthly drop-in with Würth Elektronik application engineers.","networking","2026-06-30T15:00:00Z","Online (Teams)",28,40,'["Würth","office-hours","components","Q&A"]',1),
]

NEWS_ARTICLES = [
    ("nw1","TSMC Announces 1.4nm A14 Process Node, Targeting Mass Production in 2028","TSMC has unveiled its next-generation 1.4nm process node with gate-all-around transistor architecture.","EE Times","📰","semiconductors","2026-06-20T07:00:00Z",5,312,"https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80","https://eetimes.com/tsmc-a14",'["TSMC","semiconductor","process-node","GAA","AI"]',0),
    ("nw2","Infineon Launches CoolGaN 650V Devices Targeting Datacentre PSUs","Infineon expanded its CoolGaN portfolio with new 650V GaN transistors for AC-DC power conversion.","Power Electronics News","⚡","power-electronics","2026-06-20T06:30:00Z",4,187,"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80","https://powerelectronicsnews.com/infineon-coolgancol",'["GaN","Infineon","power-electronics","datacenter","PSU"]',1),
    ("nw3","Nordic Semi Unveils nRF54L Series: Ultra-Low-Power BLE 6.0 + Matter SoCs","Nordic Semiconductor announced the nRF54L series with Bluetooth LE 6.0 and native Matter support.","Embedded Computing Design","🤖","iot-embedded","2026-06-20T05:00:00Z",6,241,"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80","https://embeddedcomputing.com/nordic-nrf54l",'["Nordic","BLE","Matter","IoT","SoC","ultra-low-power"]',0),
    ("nw4","KiCad 9.0 Released: Differential Pair Router Overhaul and 3D STEP Export","KiCad 9.0 features a completely rewritten differential pair router with length-matching tuning.","Hackaday","🔧","pcb-design","2026-06-19T20:00:00Z",3,528,"https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80","https://hackaday.com/kicad-9",'["KiCad","PCB","EDA","differential-pair","open-source"]',1),
    ("nw5","Qualcomm X85 Modem Achieves 10 Gbps Peak 5G Download in FR2 mmWave Tests","Qualcomm Snapdragon X85 baseband set a new commercial modem record at 10.4 Gbps peak downlink.","Anandtech","📡","rf-wireless","2026-06-19T16:00:00Z",7,144,None,"https://anandtech.com/qualcomm-x85",'["Qualcomm","5G","mmWave","RF","modem"]',0),
    ("nw6","Bosch and Continental Partner on 800V Silicon Carbide Traction Inverter Platform","A joint development agreement for a shared 800V SiC traction inverter platform targeting mid-range EVs.","Automotive Electronics","🚗","automotive","2026-06-19T12:00:00Z",5,203,"https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80","https://automotive-electronics.com/bosch-continental-sic",'["SiC","traction-inverter","EV","automotive","800V","Bosch"]',1),
    ("nw7","Google TPU v6 Trillium Benchmarks Published: 5x Compute vs v4 per Chip","Google TPU v6 delivers 4.7x peak compute improvement and 2x memory bandwidth versus TPU v4.","SemiAnalysis","🧠","ai-hardware","2026-06-19T10:00:00Z",9,476,"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80","https://semianalysis.com/google-tpu-v6",'["Google","TPU","AI","accelerator","HBM","optical-interconnect"]',0),
    ("nw8","EU Chips Act: 43B Fund Unlocks First Semiconductor Manufacturing Grants","The European Commission announced first disbursements totalling 8.2 billion under the EU Chips Act.","Reuters Technology","🌍","industry","2026-06-18T14:00:00Z",4,289,None,"https://reuters.com/eu-chips-act-grants",'["EU","Chips-Act","Intel","TSMC","STMicro","policy"]',0),
    ("nw9","TI Releases High-Density LLC Resonant Controller with 99.2% Efficiency at 3.3 kW","Texas Instruments introduced the UCC256xxA series LLC resonant controller IC for 3.3 kW converters.","Power Electronics World","⚡","power-electronics","2026-06-18T09:00:00Z",5,158,None,"https://powerelectronicsworld.com/ti-ucc256",'["TI","LLC","resonant","controller","power-electronics","IEC"]',1),
    ("nw10","Raspberry Pi Compute Module 5 Released with PCIe 3.0 and LPDDR5","Raspberry Pi CM5 features BCM2712 quad-core Cortex-A76 SoC up to 8GB LPDDR5 and PCIe 3.0 x1.","Toms Hardware","🖥️","iot-embedded","2026-06-17T15:00:00Z",4,622,"https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80","https://tomshardware.com/rpi-cm5",'["Raspberry-Pi","CM5","PCIe","LPDDR5","embedded"]',0),
    ("nw11","Wolfspeed Opens Worlds Largest SiC Wafer Fab in Siler City, NC","Wolfspeed inaugurated The JP — the world's largest dedicated SiC wafer manufacturing facility.","Power Systems Design","🏭","semiconductors","2026-06-17T11:00:00Z",6,334,"https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80","https://powersystemsdesign.com/wolfspeed-jp-factory",'["Wolfspeed","SiC","manufacturing","wafer-fab","EV"]',0),
    ("nw12","New IEC 61000-4-39 Standard Defines Conducted RF Immunity Test for EV Chargers","IEC finalised IEC 61000-4-39 establishing standardised conducted RF immunity test procedures for EV chargers.","Compliance Engineering","📋","industry","2026-06-16T08:00:00Z",5,91,None,"https://complianceengineering.com/iec-61000-4-39",'["IEC","EMC","standard","EV-charger","RF-immunity","compliance"]',0),
]

# ── adminMockData.ts ──────────────────────────────────────────────────────────

ANALYTICS_METRICS = [
    ("metric-1","Total Platform Revenue","$2.4M",12.5,"up","2025-01-15"),
    ("metric-2","Active Users","18,450",8.3,"up","2025-01-15"),
    ("metric-3","Conversion Rate","4.2%",-1.2,"down","2025-01-15"),
    ("metric-4","Student Engagement","67.8%",5.4,"up","2025-01-15"),
    ("metric-5","Partner Institution Count","142",3.2,"up","2025-01-15"),
    ("metric-6","Average Session Duration","12m 45s",2.1,"up","2025-01-15"),
]

ROI_DATA = [
    ("Jan",240000,62,18),("Feb",260000,65,21),("Mar",235000,63,19),
    ("Apr",310000,68,25),("May",285000,66,23),("Jun",340000,71,28),
    ("Jul",380000,74,32),("Aug",420000,78,35),("Sep",410000,76,34),
    ("Oct",450000,79,37),("Nov",480000,82,40),("Dec",520000,85,43),
]

GDPR_RECORDS = [
    ("gdpr-001","u1","Alex Johnson","alex.johnson@mit.edu","profile","active","2024-06-15","2025-01-10","90 days"),
    ("gdpr-002","u2","Sarah Chen","sarah.chen@stanford.edu","activity","pending-deletion","2024-08-10","2025-01-12","30 days"),
    ("gdpr-003","u3","Marcus Williams","marcus@berkeley.edu","connections","archived","2024-07-20","2024-11-05","180 days"),
    ("gdpr-004","u4","TechCorp Inc","compliance@techcorp.com","applications","active","2024-05-01","2025-01-15","1 year"),
]

GDPR_AUDIT = [
    ("audit-1","gdpr-001","Profile created","user:u1","2024-06-15T08:00:00Z","Initial profile creation"),
    ("audit-2","gdpr-001","Profile updated","user:u1","2024-12-20T14:30:00Z","Updated bio and skills"),
    ("audit-3","gdpr-002","Deletion requested","user:u2","2025-01-12T10:15:00Z","User requested data deletion"),
    ("audit-4","gdpr-003","Data archived","admin:a1","2024-11-05T09:00:00Z","Account archived per retention policy"),
    ("audit-5","gdpr-004","Data access request","admin:a1","2025-01-15T11:20:00Z","Compliance review initiated"),
]

HARDWARE_BOUNTIES = [
    ("hb-001","ESP32 Microcontroller Integration","Develop drivers and libraries for ESP32 IoT platform integration","Microcontroller",1500,"published",24,"2024-12-10","admin:a1","2025-02-28"),
    ("hb-002","Raspberry Pi 5 Performance Optimization","Optimize video processing pipeline for Raspberry Pi 5","Single-Board Computer",2000,"published",18,"2024-11-30","admin:a1","2025-03-15"),
    ("hb-003","Arduino Sensor Array Development","Create modular sensor array library for Arduino ecosystem","Development Board",1200,"draft",0,"2025-01-10","admin:a1","2025-04-30"),
    ("hb-004","STM32 Firmware Development","Develop custom firmware for STM32 embedded systems","Microcontroller",2500,"published",31,"2024-12-01","admin:a1","2025-03-31"),
]

MICRO_INTERNSHIPS = [
    ("mi-001","Backend API Development - Node.js","Build RESTful APIs for our platform","TechCorp Inc","4 weeks","$1,200","published",42,"2024-12-15","2025-02-15"),
    ("mi-002","React Component Library Refactor","Modernize and refactor existing component library","Stackform","6 weeks","$1,800","published",35,"2024-12-20","2025-03-01"),
    ("mi-003","Data Analytics Dashboard","Create real-time analytics dashboards using D3.js","DataStream Labs","3 weeks","$900","completed",28,"2024-11-01","2025-01-15"),
    ("mi-004","Mobile App Testing & QA","Comprehensive testing and QA for iOS app","MobileFirst","4 weeks","$1,100","draft",0,"2025-01-05","2025-03-20"),
]

PROJECT_VALIDATIONS = [
    ("pv-001","proj-001","AI-Powered Recommendation Engine","Alex Johnson","2025-01-10T14:30:00Z","2025-01-12T09:15:00Z","Dr. Sarah Chen","approved","Excellent technical implementation with clear documentation.",'["proposal.pdf","technical_spec.md"]'),
    ("pv-002","proj-002","Cloud Infrastructure Automation","Marcus Williams","2025-01-14T10:00:00Z","2025-01-15T16:45:00Z","Prof. James Rodriguez","approved","Strong DevOps practices. Minor documentation improvements suggested.",'["architecture_diagram.png","deployment_guide.md"]'),
    ("pv-003","proj-003","Blockchain Voting System","Emma Thompson","2025-01-13T11:20:00Z",None,None,"needs-revision","Please address security concerns in smart contract review.",'["contract_audit.pdf"]'),
    ("pv-004","proj-004","Real-time Collaboration Platform","David Kim","2025-01-15T09:00:00Z",None,None,"pending","",'[]'),
]

VERIFICATION_AUDIT = [
    ("audit-v-001","project","proj-001","AI Recommendation Engine","verified","Dr. Sarah Chen","2025-01-12T09:15:00Z",None,"low"),
    ("audit-v-002","user","u1","Alex Johnson","flagged","Admin Portal","2025-01-14T14:30:00Z","Multiple copyright violation reports","high"),
    ("audit-v-003","institution","inst-001","MIT","verified","Dr. Sarah Chen","2025-01-10T08:00:00Z",None,"low"),
    ("audit-v-004","project","proj-003","Blockchain Voting System","flagged","Security Team","2025-01-15T11:20:00Z","Security vulnerabilities detected","high"),
]

ADMIN_LOGS = [
    ("log-001","admin:a1","System Administrator","Created new hardware bounty","HardwareBounty","hb-004","2025-01-15T10:30:00Z",None,"success"),
    ("log-002","admin:a1","System Administrator","Updated project validation status","ProjectValidation","pv-003","2025-01-15T11:20:00Z",'{"status":"needs-revision"}',"success"),
    ("log-003","admin:a1","System Administrator","User data deletion request processed","GDPRRecord","gdpr-002","2025-01-15T14:45:00Z",None,"success"),
    ("log-004","admin:a1","System Administrator","Failed to update micro-internship","MicroInternship","mi-002","2025-01-15T15:10:00Z",None,"failed"),
]

# ── githubMockData.ts ─────────────────────────────────────────────────────────

GITHUB_PORTFOLIO = [("alex-mueller","https://github.com/alex-mueller",1247,34,32,18,16)]

GITHUB_REPOS = [
    ("repo-1","alex-mueller","wireless-sensor-network","IoT platform for distributed environmental monitoring using LoRaWAN protocol stack","C++",142,28,"https://github.com/alex-mueller/wireless-sensor-network",0,0),
    ("repo-2","alex-mueller","power-converter-sim","SPICE simulation framework for resonant DC-DC converter optimization","Python",89,15,"https://github.com/alex-mueller/power-converter-sim",0,0),
    ("repo-3","alex-mueller","embedded-rtos","Lightweight RTOS kernel for ARM Cortex-M microcontrollers with preemptive scheduling","C",234,52,"https://github.com/alex-mueller/embedded-rtos",0,0),
    ("repo-4","alex-mueller","vhdl-neural-accelerator","Hardware neural network accelerator implemented in VHDL for edge inference","VHDL",78,12,"https://github.com/alex-mueller/vhdl-neural-accelerator",0,0),
    ("repo-5","alex-mueller","pcb-design-toolkit","Utilities and validation scripts for automated PCB manufacturing checks","Python",45,8,"https://github.com/alex-mueller/pcb-design-toolkit",0,0),
    ("repo-6","alex-mueller","firmware-bootloader","Secure bootloader implementation with OTA update capabilities for embedded systems","C",156,34,"https://github.com/alex-mueller/firmware-bootloader",0,0),
]

GITHUB_COLLABS = [
    ("alex-mueller","student-hardware-projects","https://github.com/org/student-hardware-projects",8,42,"collaborator","WürthElectronics"),
    ("alex-mueller","embedded-systems-hackathon-2025","https://github.com/org/embedded-systems-hackathon-2025",5,28,"collaborator","HackathonOrganization"),
    ("alex-mueller","open-source-rtos","https://github.com/org/open-source-rtos",12,87,"contributor","OpenSourceProject"),
]

# ── jobsMockData.ts ───────────────────────────────────────────────────────────

WE_JOBS = [
    ("job-1","PCB Design Internship","Power Modules","Internship","Ludwigsburg, Germany","Join our Power Modules team to design and optimize PCBs for high-efficiency power conversion.",'["KiCAD","Circuit Analysis","SPICE Simulation","VHDL"]','["Passive Components","Power Semiconductors","Magnetic Components"]',"https://careers.wuerth.com/job-1"),
    ("job-2","Firmware Development Working Student","Embedded Systems","Working Student","Ludwigsburg, Germany","Develop embedded firmware for IoT devices and sensors with microcontrollers and RTOS.",'["C/C++","ARM Cortex","FreeRTOS","CAN/I2C/SPI"]','["Microcontrollers","Sensors","Communication Modules"]',"https://careers.wuerth.com/job-2"),
    ("job-3","Wireless Connectivity Research Assistant","Wireless Connectivity & Sensors","Research Assistant","Ludwigsburg, Germany","Research 5G and WiFi 6 technologies for industrial IoT applications.",'["RF Circuit Design","MATLAB","Signal Processing","Network Protocols"]','["RF Components","Antennas","Network Processors"]',"https://careers.wuerth.com/job-3"),
    ("job-4","HiWi - Sensor Integration","Wireless Connectivity & Sensors","HiWi","Ludwigsburg, Germany","Support the Sensor Integration team in designing multi-sensor platforms for environmental monitoring.",'["Electronics","Python","Data Analysis","Lab Work"]','["Environmental Sensors","Signal Conditioning Circuits","ADC Modules"]',"https://careers.wuerth.com/job-4"),
    ("job-5","Power Electronics Design Internship","Power Modules","Internship","Ludwigsburg, Germany","Design and simulate power conversion circuits with high efficiency and reliability.",'["SPICE","Circuit Simulation","Power Electronics Theory","Thermal Management"]','["MOSFETs","IGBTs","Capacitors","Inductors"]',"https://careers.wuerth.com/job-5"),
    ("job-6","Software Engineer - Embedded Systems","Embedded Systems","Working Student","Ludwigsburg, Germany","Build robust firmware for industrial control systems with CI/CD pipelines.",'["C","Git","Linux","Debugging Techniques"]','["ARM Processors","Memory Controllers","Communication Interfaces"]',"https://careers.wuerth.com/job-6"),
    ("job-7","RF Systems Internship","Wireless Connectivity & Sensors","Internship","Ludwigsburg, Germany","Design and characterize RF systems for wireless communications.",'["RF Design","ADS/HFSS","Spectrum Analysis","Network Analysis"]','["Antennas","RF Filters","Amplifiers","Oscillators"]',"https://careers.wuerth.com/job-7"),
    ("job-8","HiWi - Test Engineering","Power Modules","HiWi","Ludwigsburg, Germany","Develop and execute test procedures for power module products.",'["Test Engineering","Measurement Instruments","Data Analysis","Technical Writing"]','["Power Modules","Test Equipment","Thermal Cameras"]',"https://careers.wuerth.com/job-8"),
]

# ── nexusData.ts ──────────────────────────────────────────────────────────────

NEXUS_MEMBERS = [
    ("nm-1","TechLena","https://api.dicebear.com/7.x/avataaars/svg?seed=TechLena",1,"Newcomer",2,10,100,"Explorer","Posted her first question","🌱","First Step","Answer one peer question to unlock Curious Mind badge",50,"engaged",None,None),
    ("nm-2","RohanV","https://api.dicebear.com/7.x/avataaars/svg?seed=RohanV",3,"Contributor",47,500,600,"Mentor","Hit 500 reputation points","🎯",None,"Reply to 3 open technical threads this week to reach Lv 4 — Mentor",60,"near-levelup",None,None),
    ("nm-3","CircuitSam","https://api.dicebear.com/7.x/avataaars/svg?seed=CircuitSam",2,"Explorer",18,210,300,"Contributor","Solved his first bounty","⚡","Bounty Hunter","Solve 2 more bounties to earn Problem Solver badge + jump to Lv 3",90,"momentum",None,None),
    ("nm-4","Prof_Ayesha","https://api.dicebear.com/7.x/avataaars/svg?seed=ProfAyesha",4,"Mentor",134,1840,2000,"Legend","Reached a 7-day reply streak","🔥","On Fire","Maintain streak to Day 14 + answer 3 threads = Legend tier unlocked",160,"highvalue",40,7),
    ("nm-5","NewbieNick","https://api.dicebear.com/7.x/avataaars/svg?seed=NewbieNick",0,"Unverified",1,0,100,"Newcomer","Just joined today","👋",None,"Complete profile (+20 rep) and drop your first reply to unlock Newcomer status",20,"atrisk",None,None),
]

NEXUS_THREADS = [
    ("nt-1","TechLena",1,"Newcomer","Why does my I2C sensor stop responding after running for ~30 minutes? Using STM32 + BMP280.","Embedded Systems",5,'["I2C","STM32","BMP280","Embedded"]'),
    ("nt-2","CircuitSam",2,"Explorer","Best approach for EMI shielding on a 4-layer PCB with a switching regulator at 400kHz?","PCB Design",6,'["EMI","PCB","Power Electronics","Shielding"]'),
    ("nt-3","NewbieNick",0,"Unverified","What is the difference between a working student position and an internship at a tech company?","Career",4.5,'["Career","Internship","Working Student","Germany"]'),
]

NEXUS_ANNOUNCEMENTS = [
    ("🌱","@TechLena posted her very first question — welcome her and help her grow!","5h ago"),
    ("⚡","@CircuitSam just solved his first bounty — 18 days in. Absolute builder energy.","6h ago"),
    ("🔥","@Prof_Ayesha is on a 7-day streak with 40+ upvotes this week. Legend tier incoming.","1h ago"),
    ("🎯","@RohanV crossed 500 reputation points in under 47 days. Watch this space.","3h ago"),
    ("👋","@NewbieNick just joined — lets make them feel welcome!","2h ago"),
]

# ── weFeed.ts ─────────────────────────────────────────────────────────────────

WE_FEED = [
    ("we-fncs","https://www.we-online.com/en/news-center/press/press-releases?d=we-fncs","WE-FNCS Nanocrystalline EMI Shielding Sheets","Würth Elektronik introduces nanocrystalline EMI shielding sheets for PCB-level EMI management.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1812_01_group-we-fncs.jpg","2026-06-01T09:00:00Z","Würth Elektronik Press","product",'["EMI","shielding","nanocrystalline","PCB","EMC"]',47,0),
    ("we-wpme-cdi2c","https://www.we-online.com/en/news-center/press/press-releases?d=WPME-CDI2C","WPME-CDI2C Digital Isolators for I2C Interfaces","Digital isolators providing galvanic isolation of digital signals on I2C buses, 5 kVrms isolation.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1817_01.jpg","2026-06-01T08:00:00Z","Würth Elektronik Press","product",'["isolator","I2C","galvanic-isolation","digital","industrial"]',63,0),
    ("we-sfia","https://www.we-online.com/en/news-center/press/press-releases?d=we-sfia","WE-SFIA SMT Flat-Wire Inductor for Automotive Electronics","AEC-Q200-qualified flat-wire power inductor for automotive DC-DC converters with ultra-low DCR.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1709_01.jpg","2026-05-28T10:00:00Z","Würth Elektronik Press","product",'["inductor","automotive","flat-wire","AEC-Q200","DC-DC"]',89,1),
    ("we-smdc-led","https://www.we-online.com/en/news-center/press/press-releases?d=smdc","SMDC Horticulture LEDs Expanded Portfolio for Plant Growth","New SMDC emitters targeting red (660 nm) and far-red (730 nm) spectra for vertical farming.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/smdc.jpg","2026-05-25T07:00:00Z","Würth Elektronik Press","product",'["LED","horticulture","SMDC","lighting","vertical-farming"]',34,0),
    ("we-ic-leds","https://www.we-online.com/en/news-center/blog?d=rgb-leds-with-integrated-control-circuit","IC LEDs Integrated Control Circuit LEDs Set New Standards","ICLEDs integrate an intelligent control circuit directly into the LED package for signage and HMI.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/aufmacherbild.jpg","2026-05-20T10:00:00Z","Würth Elektronik Blog","product",'["LED","IC-LED","integrated-control","RGB","automotive","HMI"]',72,0),
    ("we-rohs-leadfree","https://www.we-online.com/en/news-center/blog?d=rohs-leadfree","RoHS Lead-Free Transition New Varistors and SMT Spacers","New lead-free varistors and SMT spacers compliant with RoHS Directive 2011/65/EU.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/eisos_nachhaltigkeit_bleifrei_l2.jpg","2026-05-15T08:00:00Z","Würth Elektronik Blog","product",'["RoHS","lead-free","varistor","SMT","compliance","sustainability"]',58,0),
    ("we-ics-solutions","https://www.we-online.com/en/products/intelligent-systems/overview","Intelligent Control Systems ICS Vehicles and Industrial","Complete system solutions for construction, agricultural, and commercial vehicles from WE ICS.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/ICS_Header_1920x600_L3_C2_V2.jpg","2026-06-01T17:00:00Z","Würth Elektronik ICS","service",'["ICS","intelligent-systems","vehicles","agricultural","power-distribution"]',41,0),
    ("we-ics-services","https://www.we-online.com/en/products/intelligent-systems/services","ICS Engineering Services From Idea to Series Product","Unique engineering services from concept through prototype to series production.",None,"2026-05-10T09:00:00Z","Würth Elektronik ICS","service",'["ICS","engineering-services","prototyping","series-production","testing"]',29,0),
    ("we-wesystems","https://www.we-online.com/en/products/printed-circuit-boards/services/wesystems","WEsystems Wire Bonding PCBs and Custom System Processing","Wire bonding, PCB manufacturing, and customer-specific system processing under one roof.",None,"2026-05-05T10:00:00Z","Würth Elektronik PCB","service",'["WEsystems","wire-bonding","PCB","custom-systems","manufacturing"]',22,0),
    ("we-support","https://www.we-online.com/en/support/overview","Technical Support Personal Professional and On-Site","Best-in-class technical support including FAE visits, REDEXPERT selection tool, and online calculators.",None,"2026-04-20T09:00:00Z","Würth Elektronik Support","service",'["support","FAE","application-engineering","REDEXPERT","design-in"]',55,1),
    ("we-ecovadis-platinum","https://www.we-online.com/en/news-center/blog?d=ecovadis-platinum","EcoVadis Platinum Leading the Way in Sustainable PCB Manufacturing","Würth Elektronik achieved EcoVadis Platinum status — top 1% globally for sustainability.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-cbt-keyvisual-ecovadis-platinum-rating.jpg","2026-06-05T08:00:00Z","Würth Elektronik Blog","news",'["EcoVadis","sustainability","platinum","PCB","ESG","manufacturing"]',118,0),
    ("we-innovative-employer","https://www.we-online.com/en/news-center/blog?d=innovative-company","How to Find an Innovative Employer Würth Elektroniks Answer","R&D investment, university partnerships, flat hierarchies — insight for students evaluating employers.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/bild-5-fh230403_wemuc_0947m.jpg","2026-05-18T09:00:00Z","Würth Elektronik Blog","blog",'["employer","innovation","R&D","culture","students","career"]',94,0),
    ("we-en45545-rail","https://www.we-online.com/en/news-center/blog?d=en-45545-2-rail-standard","EN 45545-2 Railway Certification Ready for Rail","WE PCBs certified to EN 45545-2 fire protection standard for railway vehicles.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-cbt-rail-standard-en-45545-2.jpg","2026-05-12T08:00:00Z","Würth Elektronik Blog","news",'["railway","EN-45545-2","certification","PCB","safety","rail"]',67,0),
    ("we-pcb-quality","https://www.we-online.com/en/news-center/blog?d=small-component","Small Component Big Responsibility The Truth About PCB Quality","IPC class, material selection, copper roughness, and why blind/buried via quality matters.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/cbt-speaker-webinar-andreas-schilpp.jpg","2026-05-08T10:00:00Z","Würth Elektronik Blog","blog",'["PCB","quality","IPC","webinar","reliability","manufacturing"]',83,0),
    ("we-smartwatch","https://www.we-online.com/en/news-center/blog?d=advanced-hdi-open-source-smartwatch-en","Open Source Smartwatch Powered by ADVANCED.hdi PCB Technology","BLE, IMU, display driver in 38x38mm HDI board — a showcase of what HDI enables for wearables.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-cbt-advanced-hdi-open-source-smartwatch-ovtech-2.jpeg","2026-04-30T09:00:00Z","Würth Elektronik Blog","blog",'["HDI","PCB","smartwatch","open-source","wearable","BLE"]',142,1),
    ("we-asia-production","https://www.we-online.com/en/news-center/blog?d=asia-production-by-wuerth-elektronik","Asia Production by Würth Elektronik More Than Just an Alternative","Quality manufacturing with European engineering oversight — PCBs, assemblies, and complete system builds.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-cbt-asia-production-logistic-solutions.jpg","2026-04-22T08:00:00Z","Würth Elektronik Blog","blog",'["Asia","manufacturing","PCB","logistics","supply-chain","assembly"]',51,0),
    ("we-valencia-emc","https://www.we-online.com/en/news-center/press/press-releases?d=10-jahre-catedra","10 Years of EMC Research University of Valencia Partnership","40+ peer-reviewed publications, 12 PhD theses from the Catedra Würth at University of Valencia.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1843_01_valencia.jpg","2026-04-15T09:00:00Z","Würth Elektronik Press","news",'["EMC","university","Valencia","research","partnership","academic"]',76,0),
    ("we-united-summit","https://www.we-online.com/en/news-center/press/press-releases?d=we-united","WE United Leadership Summit Reflections on Leading in Complex Tech","Senior leaders discuss navigating technological complexity and innovation roadmap 2026-2030.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/we-united_hic-muenchen.jpg","2026-04-10T10:00:00Z","Würth Elektronik Press","news",'["leadership","summit","strategy","innovation","Munich","culture"]',38,0),
    ("we-seminars","https://www.we-online.com/en/news-center/events/seminars","Free Seminars Electronics EMC PCB Design and More","Free expert-led seminars worldwide: power electronics, EMC compliance, PCB design, RF fundamentals.",None,"2026-06-01T23:00:00Z","Würth Elektronik Events","event",'["seminar","free","EMC","PCB","power-electronics","RF","training","education"]',201,1),
    ("we-pcim-2026","https://www.we-online.com/en/news-center/press/press-releases?d=ankuendigung-pcim","Würth Elektronik at PCIM Europe 2026 Modern Power Electronics Solutions","Hall 9, Stand 540 — live demos of SiC gate drivers, resonant magnetics, and REDEXPERT platform.","https://www.we-online.com/apps/services/image.cfm?source=jpg1/wth1pi1832_01.jpg","2026-05-01T09:00:00Z","Würth Elektronik Events","event",'["PCIM","exhibition","Nuremberg","SiC","GaN","power-electronics","event"]',133,0),
    ("we-ivt-2026","https://www.we-online.com/en/news-center/press/press-releases?d=wuerth-elektronik-ics-at-ivt-2026","Würth Elektronik ICS at iVT Expo 2026 Intelligent Power Distribution","Live demos: solid-state relay modules, CANopen-controlled distribution boxes, ICS SmartBox.","https://www.we-online.com/apps/services/image.cfm?source=png1/we-ics-logo-ivt-2026.png","2026-03-20T09:00:00Z","Würth Elektronik ICS","event",'["iVT","exhibition","ICS","off-highway","power-distribution","CANopen"]',44,0),
    ("ikom-tum","https://ikom-tum.de/en","IKOM TU Munich Career Forum 4 Annual Job Fairs","Four career fairs per year at TU Munich — connect with Würth Elektronik, Siemens, BMW, and MAN.",None,"2026-06-01T12:00:00Z","IKOM TU Munich","career",'["career","job-fair","TUM","Munich","students","networking"]',167,0),
    ("we-overview","https://www.we-online.com/en/company/overview","About Würth Elektronik Manufacturer of Electronic and Electromechanical Components","Family-owned, 7,800+ employees, headquartered in Waldenburg, Germany. Free samples for engineers.",None,"2026-01-01T00:00:00Z","Würth Elektronik","news",'["company","overview","manufacturer","components","PCB","Germany"]',29,0),
]

WE_FAQ = [
    ("What types of components does Würth Elektronik offer?","Würth Elektronik manufactures a broad portfolio of passive components and electromechanical parts.",'["components","product","range"]','["product","catalog","components"]'),
    ("How can I get free samples from Würth Elektronik?","You can request free samples of most standard catalogue components directly via the we-online.com sample shop.",'["samples","free","request"]','["samples","free","request","component"]'),
    ("What is REDEXPERT?","REDEXPERT is Würth Elektronik''s online simulation platform for passive components.",'["REDEXPERT","simulation","tool","component-selection"]','["tool","simulation","REDEXPERT","selection"]'),
    ("Does Würth Elektronik offer AEC-Q200 qualified components?","Yes. Würth Elektronik offers a wide range of AEC-Q200 qualified components for automotive applications.",'["AEC-Q200","automotive","qualified","components"]','["automotive","qualification","AEC"]'),
    ("What PCB manufacturing capabilities does Würth Elektronik offer?","Würth Elektronik Circuit Board Technology (CBT) manufactures PCBs from standard FR4 up to advanced HDI multilayer.",'["PCB","manufacturing","CBT","HDI","multilayer"]','["PCB","manufacturing","board","fabrication"]'),
    ("Can I attend Würth Elektronik training or seminars?","Yes. Würth Elektronik runs free technical seminars worldwide covering power electronics, EMC, PCB design, and RF.",'["seminars","training","education","free"]','["training","seminar","education","workshop"]'),
    ("What is the Würth Elektronik academic programme?","Würth Elektronik partners with universities to give students access to components, tools, and engineering support.",'["academic","university","students","partnership","programme"]','["academic","university","students","education"]'),
    ("Does Würth Elektronik provide application engineering support?","Yes. Würth Elektronik has a global team of field application engineers (FAEs) available for design-in support.",'["FAE","support","application","engineering","design-in"]','["support","engineering","FAE","design"]'),
    ("What is the WE-SFIA inductor used for?","The WE-SFIA is a flat-wire SMT power inductor designed for space-constrained automotive DC-DC converters.",'["WE-SFIA","inductor","automotive","flat-wire","DC-DC"]','["product","inductor","automotive","power"]'),
    ("How does Würth Elektronik support sustainability?","Würth Elektronik holds EcoVadis Platinum certification and is committed to lead-free manufacturing and supply chain transparency.",'["sustainability","EcoVadis","lead-free","environment","ESG"]','["sustainability","environment","ESG","green"]'),
]

# ──────────────────────────────────────────────────────────────────────────────
# SEED
# ──────────────────────────────────────────────────────────────────────────────

SCHEMA = [
    # mockData
    "CREATE TABLE IF NOT EXISTS badges (id TEXT PRIMARY KEY, name TEXT, description TEXT, icon TEXT, tier TEXT, category TEXT)",
    "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, role TEXT, name TEXT, avatar_url TEXT, headline TEXT, location TEXT, university TEXT, graduation_year INTEGER, skills_json TEXT, followers_count INTEGER, following_count INTEGER, bio TEXT, points INTEGER, interests_json TEXT, joined_at TEXT, website TEXT, industry TEXT, size TEXT)",
    "CREATE TABLE IF NOT EXISTS user_badges (user_id TEXT, badge_id TEXT, earned_at TEXT, PRIMARY KEY (user_id, badge_id))",
    "CREATE TABLE IF NOT EXISTS user_achievements (id TEXT PRIMARY KEY, user_id TEXT, name TEXT, description TEXT, icon TEXT, points INTEGER, unlocked_at TEXT)",
    "CREATE TABLE IF NOT EXISTS user_certificates (id TEXT PRIMARY KEY, user_id TEXT, title TEXT, issuer TEXT, issued_at TEXT, credential_id TEXT, skills_json TEXT, badge_url TEXT)",
    "CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, author_id TEXT, type TEXT, content TEXT, likes INTEGER, shares INTEGER, created_at TEXT, tags_json TEXT, image_url TEXT, link_url TEXT, link_title TEXT, link_description TEXT)",
    "CREATE TABLE IF NOT EXISTS post_comments (id TEXT PRIMARY KEY, post_id TEXT, author_id TEXT, content TEXT, created_at TEXT, likes INTEGER)",
    "CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY, company_id TEXT, title TEXT, location TEXT, type TEXT, salary TEXT, description TEXT, tags_json TEXT, posted_at TEXT, application_count INTEGER)",
    "CREATE TABLE IF NOT EXISTS bounties (id TEXT PRIMARY KEY, company_id TEXT, title TEXT, description TEXT, tags_json TEXT, reward TEXT, duration TEXT, deadline TEXT, posted_at TEXT, application_count INTEGER, status TEXT)",
    "CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, author_id TEXT, title TEXT, description TEXT, tags_json TEXT, image_url TEXT, repo_url TEXT, live_url TEXT, likes INTEGER, created_at TEXT)",
    "CREATE TABLE IF NOT EXISTS lecture_materials (id TEXT PRIMARY KEY, author_id TEXT, title TEXT, course TEXT, type TEXT, uploaded_at TEXT, downloads INTEGER, file_size TEXT, tags_json TEXT, published INTEGER)",
    "CREATE TABLE IF NOT EXISTS student_initiatives (id TEXT PRIMARY KEY, team_name TEXT, members_json TEXT, project_title TEXT, description TEXT, parts_used_json TEXT, company_name TEXT, endorsed INTEGER, submitted_at TEXT, status TEXT)",
    "CREATE TABLE IF NOT EXISTS qa_channels (id TEXT PRIMARY KEY, topic TEXT, course TEXT, open_questions INTEGER, participants INTEGER, last_activity_at TEXT, tags_json TEXT)",
    "CREATE TABLE IF NOT EXISTS deadlines (id TEXT PRIMARY KEY, title TEXT, type TEXT, due_at TEXT, course TEXT, linked_id TEXT, priority TEXT)",
    "CREATE TABLE IF NOT EXISTS communities (id TEXT PRIMARY KEY, name TEXT, description TEXT, category TEXT, member_count INTEGER, tags_json TEXT, created_at TEXT, is_joined INTEGER, icon TEXT, weekly_activity INTEGER, is_verified INTEGER)",
    "CREATE TABLE IF NOT EXISTS community_events (id TEXT PRIMARY KEY, community_id TEXT, title TEXT, description TEXT, type TEXT, date TEXT, location TEXT, attendee_count INTEGER, max_attendees INTEGER, tags_json TEXT, is_registered INTEGER)",
    "CREATE TABLE IF NOT EXISTS news_articles (id TEXT PRIMARY KEY, title TEXT, summary TEXT, source TEXT, source_logo TEXT, category TEXT, published_at TEXT, read_time INTEGER, upvotes INTEGER, image_url TEXT, url TEXT, tags_json TEXT, saved INTEGER)",
    # adminMockData
    "CREATE TABLE IF NOT EXISTS analytics_metrics (id TEXT PRIMARY KEY, label TEXT, value TEXT, change_pct REAL, trend TEXT, timestamp TEXT)",
    "CREATE TABLE IF NOT EXISTS roi_data (month TEXT PRIMARY KEY, revenue INTEGER, engagement INTEGER, roi REAL)",
    "CREATE TABLE IF NOT EXISTS gdpr_records (id TEXT PRIMARY KEY, user_id TEXT, user_name TEXT, user_email TEXT, data_category TEXT, status TEXT, created_at TEXT, modified_at TEXT, retention_period TEXT)",
    "CREATE TABLE IF NOT EXISTS gdpr_audit_trail (id TEXT PRIMARY KEY, record_id TEXT, action TEXT, actor TEXT, timestamp TEXT, details TEXT)",
    "CREATE TABLE IF NOT EXISTS hardware_bounties (id TEXT PRIMARY KEY, title TEXT, description TEXT, category TEXT, value INTEGER, status TEXT, applicants INTEGER, created_at TEXT, created_by TEXT, deadline TEXT)",
    "CREATE TABLE IF NOT EXISTS micro_internships (id TEXT PRIMARY KEY, title TEXT, description TEXT, company TEXT, duration TEXT, compensation TEXT, status TEXT, applicants INTEGER, created_at TEXT, deadline TEXT)",
    "CREATE TABLE IF NOT EXISTS project_validations (id TEXT PRIMARY KEY, project_id TEXT, project_title TEXT, author_name TEXT, submitted_at TEXT, validated_at TEXT, validated_by TEXT, status TEXT, validation_notes TEXT, attachments_json TEXT)",
    "CREATE TABLE IF NOT EXISTS verification_audit (id TEXT PRIMARY KEY, entity_type TEXT, entity_id TEXT, entity_name TEXT, action TEXT, reviewed_by TEXT, timestamp TEXT, reason TEXT, severity TEXT)",
    "CREATE TABLE IF NOT EXISTS admin_logs (id TEXT PRIMARY KEY, admin_id TEXT, admin_name TEXT, action TEXT, resource_type TEXT, resource_id TEXT, timestamp TEXT, changes_json TEXT, status TEXT)",
    # githubMockData
    "CREATE TABLE IF NOT EXISTS github_portfolios (username TEXT PRIMARY KEY, profile_url TEXT, total_contributions INTEGER, pull_requests_count INTEGER, pull_requests_merged INTEGER, issues_opened INTEGER, issues_closed INTEGER)",
    "CREATE TABLE IF NOT EXISTS github_repositories (id TEXT PRIMARY KEY, username TEXT, name TEXT, description TEXT, primary_language TEXT, stars INTEGER, forks INTEGER, url TEXT, is_fork INTEGER, is_private INTEGER)",
    "CREATE TABLE IF NOT EXISTS github_collaborations (username TEXT, repository_name TEXT, repository_url TEXT, pull_requests_count INTEGER, commits_count INTEGER, role TEXT, organization TEXT, PRIMARY KEY (username, repository_name))",
    # jobsMockData
    "CREATE TABLE IF NOT EXISTS we_jobs (id TEXT PRIMARY KEY, title TEXT, department TEXT, type TEXT, location TEXT, description TEXT, required_skills_json TEXT, hardware_stack_json TEXT, application_url TEXT)",
    # nexusData
    "CREATE TABLE IF NOT EXISTS nexus_members (id TEXT PRIMARY KEY, username TEXT, avatar TEXT, level INTEGER, level_title TEXT, days_active INTEGER, rep_points INTEGER, rep_target INTEGER, next_level_title TEXT, milestone TEXT, milestone_icon TEXT, badge_unlocked TEXT, next_challenge TEXT, next_challenge_points INTEGER, status TEXT, weekly_upvotes INTEGER, streak_days INTEGER)",
    "CREATE TABLE IF NOT EXISTS nexus_threads (id TEXT PRIMARY KEY, author_username TEXT, author_level INTEGER, author_level_title TEXT, question TEXT, topic TEXT, hours_unanswered REAL, tags_json TEXT)",
    "CREATE TABLE IF NOT EXISTS nexus_announcements (id INTEGER PRIMARY KEY AUTOINCREMENT, icon TEXT, text TEXT, time TEXT)",
    # weFeed
    "CREATE TABLE IF NOT EXISTS we_feed_items (id TEXT PRIMARY KEY, url TEXT, title TEXT, summary TEXT, image TEXT, published_at TEXT, source TEXT, category TEXT, tags_json TEXT, upvotes INTEGER, saved INTEGER)",
    "CREATE TABLE IF NOT EXISTS we_faq (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, answer_intro TEXT, tags_json TEXT, match_categories_json TEXT)",
]

def upsert(cur, table, cols, rows):
    ph = ",".join(["?"] * len(cols))
    sql = f"INSERT OR REPLACE INTO {table} ({','.join(cols)}) VALUES ({ph})"
    cur.executemany(sql, rows)

def seed():
    # Remove stale DB if exists
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)

    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()

    # Create all tables
    for ddl in SCHEMA:
        cur.execute(ddl)
    con.commit()

    # Insert data
    upsert(cur, "badges", ["id","name","description","icon","tier","category"], ALL_BADGES)
    upsert(cur, "users", ["id","role","name","avatar_url","headline","location","university","graduation_year","skills_json","followers_count","following_count","bio","points","interests_json","joined_at","website","industry","size"], MOCK_USERS)
    upsert(cur, "user_badges", ["user_id","badge_id","earned_at"], USER_BADGES)
    upsert(cur, "user_achievements", ["id","user_id","name","description","icon","points","unlocked_at"], USER_ACHIEVEMENTS)
    upsert(cur, "user_certificates", ["id","user_id","title","issuer","issued_at","credential_id","skills_json","badge_url"], USER_CERTIFICATES)
    upsert(cur, "posts", ["id","author_id","type","content","likes","shares","created_at","tags_json","image_url","link_url","link_title","link_description"], MOCK_POSTS)
    upsert(cur, "post_comments", ["id","post_id","author_id","content","created_at","likes"], POST_COMMENTS)
    upsert(cur, "jobs", ["id","company_id","title","location","type","salary","description","tags_json","posted_at","application_count"], MOCK_JOBS)
    upsert(cur, "bounties", ["id","company_id","title","description","tags_json","reward","duration","deadline","posted_at","application_count","status"], MOCK_BOUNTIES)
    upsert(cur, "projects", ["id","author_id","title","description","tags_json","image_url","repo_url","live_url","likes","created_at"], MOCK_PROJECTS)
    upsert(cur, "lecture_materials", ["id","author_id","title","course","type","uploaded_at","downloads","file_size","tags_json","published"], LECTURE_MATERIALS)
    upsert(cur, "student_initiatives", ["id","team_name","members_json","project_title","description","parts_used_json","company_name","endorsed","submitted_at","status"], STUDENT_INITIATIVES)
    upsert(cur, "qa_channels", ["id","topic","course","open_questions","participants","last_activity_at","tags_json"], QA_CHANNELS)
    upsert(cur, "deadlines", ["id","title","type","due_at","course","linked_id","priority"], DEADLINES)
    upsert(cur, "communities", ["id","name","description","category","member_count","tags_json","created_at","is_joined","icon","weekly_activity","is_verified"], COMMUNITIES)
    upsert(cur, "community_events", ["id","community_id","title","description","type","date","location","attendee_count","max_attendees","tags_json","is_registered"], COMMUNITY_EVENTS)
    upsert(cur, "news_articles", ["id","title","summary","source","source_logo","category","published_at","read_time","upvotes","image_url","url","tags_json","saved"], NEWS_ARTICLES)
    upsert(cur, "analytics_metrics", ["id","label","value","change_pct","trend","timestamp"], ANALYTICS_METRICS)
    upsert(cur, "roi_data", ["month","revenue","engagement","roi"], ROI_DATA)
    upsert(cur, "gdpr_records", ["id","user_id","user_name","user_email","data_category","status","created_at","modified_at","retention_period"], GDPR_RECORDS)
    upsert(cur, "gdpr_audit_trail", ["id","record_id","action","actor","timestamp","details"], GDPR_AUDIT)
    upsert(cur, "hardware_bounties", ["id","title","description","category","value","status","applicants","created_at","created_by","deadline"], HARDWARE_BOUNTIES)
    upsert(cur, "micro_internships", ["id","title","description","company","duration","compensation","status","applicants","created_at","deadline"], MICRO_INTERNSHIPS)
    upsert(cur, "project_validations", ["id","project_id","project_title","author_name","submitted_at","validated_at","validated_by","status","validation_notes","attachments_json"], PROJECT_VALIDATIONS)
    upsert(cur, "verification_audit", ["id","entity_type","entity_id","entity_name","action","reviewed_by","timestamp","reason","severity"], VERIFICATION_AUDIT)
    upsert(cur, "admin_logs", ["id","admin_id","admin_name","action","resource_type","resource_id","timestamp","changes_json","status"], ADMIN_LOGS)
    upsert(cur, "github_portfolios", ["username","profile_url","total_contributions","pull_requests_count","pull_requests_merged","issues_opened","issues_closed"], GITHUB_PORTFOLIO)
    upsert(cur, "github_repositories", ["id","username","name","description","primary_language","stars","forks","url","is_fork","is_private"], GITHUB_REPOS)
    upsert(cur, "github_collaborations", ["username","repository_name","repository_url","pull_requests_count","commits_count","role","organization"], GITHUB_COLLABS)
    upsert(cur, "we_jobs", ["id","title","department","type","location","description","required_skills_json","hardware_stack_json","application_url"], WE_JOBS)
    upsert(cur, "nexus_members", ["id","username","avatar","level","level_title","days_active","rep_points","rep_target","next_level_title","milestone","milestone_icon","badge_unlocked","next_challenge","next_challenge_points","status","weekly_upvotes","streak_days"], NEXUS_MEMBERS)
    upsert(cur, "nexus_threads", ["id","author_username","author_level","author_level_title","question","topic","hours_unanswered","tags_json"], NEXUS_THREADS)
    upsert(cur, "nexus_announcements", ["icon","text","time"], NEXUS_ANNOUNCEMENTS)
    upsert(cur, "we_feed_items", ["id","url","title","summary","image","published_at","source","category","tags_json","upvotes","saved"], WE_FEED)
    upsert(cur, "we_faq", ["question","answer_intro","tags_json","match_categories_json"], WE_FAQ)

    con.commit()

    # ── VERIFY ────────────────────────────────────────────────────────────────
    tables = [
        "badges","users","user_badges","user_achievements","user_certificates",
        "posts","post_comments","jobs","bounties","projects","lecture_materials",
        "student_initiatives","qa_channels","deadlines","communities",
        "community_events","news_articles",
        "analytics_metrics","roi_data","gdpr_records","gdpr_audit_trail",
        "hardware_bounties","micro_internships","project_validations",
        "verification_audit","admin_logs",
        "github_portfolios","github_repositories","github_collaborations",
        "we_jobs",
        "nexus_members","nexus_threads","nexus_announcements",
        "we_feed_items","we_faq",
    ]

    print(f"\n  wurth_platform.db -> {DB_PATH}\n")
    print(f"  {'Table':<32} {'Rows':>5}")
    print("  " + "─" * 39)
    total = 0
    for t in tables:
        n = cur.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
        total += n
        print(f"  {t:<32} {n:>5}")
    print("  " + "─" * 39)
    print(f"  {'TOTAL':<32} {total:>5}\n")

    con.close()

if __name__ == "__main__":
    seed()
