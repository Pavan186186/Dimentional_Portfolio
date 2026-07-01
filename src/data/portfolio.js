// ═══════════════════════════════════════════════════════════════════
// PORTFOLIO.JS — Single source of truth for all professional content
// Every section imports from here. Edit once, updates everywhere.
// ═══════════════════════════════════════════════════════════════════

// ─── Identity ───────────────────────────────────────────────────────
export const IDENTITY = {
  name: 'Pavan Teja Tallapalli',
  title: 'Data Scientist & Software Engineer',
  mission: 'Building intelligent systems at the intersection of\ndata science, machine learning, and distributed networks',
  email: 'ptallap2@asu.edu',
  phone: '(602) 756-5938',
  location: 'Tempe, AZ',
  linkedin: 'linkedin.com/in/pavan-teja-tallapalli',
  github: 'github.com/pavan-teja',
  status: 'M.S. Data Science · ASU · May 2026 · F-1 OPT',
};

// ─── Timeline (1D — anchored to line nodes) ─────────────────────────
export const TIMELINE = [
  {
    t: 0.00,                          // position along the line 0→1
    tag: 'JIIT',
    year: '2019 – 2023',
    role: 'B.Tech — Electronics & Communications (AI/ML)',
    org: 'Jaypee Institute of Information Technology, India',
    color: '#4ab4f0',
    bullets: [
      'Foundations in AI, ML, DSP, and computer vision',
      'C/C++ systems programming and data structures',
      'Coursework: Artificial Intelligence, Deep Learning, Probability & Statistics',
      'Final year focus on machine learning applications in signal processing',
    ],
  },
  {
    t: 0.26,
    tag: 'BSNL',
    year: 'Jun 2022 – Jun 2023',
    role: 'Software Engineer — Networking Systems',
    org: 'Bharat Sanchar Nigam Limited, India',
    color: '#39ff8a',
    bullets: [
      'Implemented MQTT v5 messaging workflows and REST-based APIs for eSIM LPA SDK',
      'Supported 4 lifecycle operations across 8,000+ connected devices',
      'Engineered C/C++ modules for GSM/LTE switching systems',
      'Packet inspection with Wireshark, TShark, TCPdump, Postman, Burp Suite',
      'Designed unit, integration, API, and regression tests for networking modules',
    ],
  },
  {
    t: 0.54,
    tag: 'JIO',
    year: 'Jun 2023 – Jul 2024',
    role: 'Data Analyst / Software Development Engineer',
    org: 'Jio Platforms Limited, India',
    color: '#ff7043',
    bullets: [
      'Engineered Python ETL pipelines for production Data Collector application',
      'Analyzed telemetry from 3 platform components: Heartbeat, Data Collector, JIOoSCC',
      'Built BI dashboards contributing to 12% improvement in device uptime',
      'Deployed TensorFlow Lite anomaly-detection model — 40% reduction in false alerts',
      'Automated RSA key generation and implemented Salesforce-integrated test framework',
      'Contributed to 3 AirFiber production-facing telecom components',
    ],
  },
  {
    t: 0.78,
    tag: 'ASU',
    year: 'Aug 2024 – May 2026',
    role: 'M.S. Data Science — Computing & Decision Analytics',
    org: 'Arizona State University, Tempe AZ',
    color: '#9c6bff',
    bullets: [
      'Relevant coursework: Machine Learning, Statistical Learning, Data Mining',
      'NLP, Big Data Analytics, Bayesian Methods',
      'CRISPR Scrollytelling project — interactive narrative data visualization',
      'AI-Powered Personal Finance Agent — GenAI + MCP + fraud detection',
    ],
  },
  {
    t: 1.00,
    tag: 'NOW',
    year: '2026 →',
    role: 'Seeking Full-Time Roles',
    org: 'Open to: DS · ML Engineer · SWE · Data Analyst · Network Engineer',
    color: '#ffdc50',
    bullets: [
      'New graduate · F-1 OPT authorization',
      'Targeting: Data Science, ML Engineering, Software Engineering, Network/Security',
      'Open to: Remote, Hybrid, Relocation',
      'ptallap2@asu.edu · (602) 756-5938',
    ],
  },
];

// ─── Skills (2D — anchored to 4 square vertices) ────────────────────
export const SKILLS = [
  {
    tag: 'LANG',
    label: 'Languages & Core',
    color: '#4ab4f0',
    items: [
      { name: 'Python',      level: 95 },
      { name: 'SQL',         level: 90 },
      { name: 'C / C++',     level: 82 },
      { name: 'JavaScript',  level: 78 },
      { name: 'TypeScript',  level: 72 },
      { name: 'Java',        level: 70 },
      { name: 'Scala',       level: 65 },
      { name: 'Bash',        level: 75 },
    ],
  },
  {
    tag: 'ML/AI',
    label: 'Machine Learning & AI',
    color: '#9c6bff',
    items: [
      { name: 'TensorFlow / Keras', level: 88 },
      { name: 'PyTorch',            level: 82 },
      { name: 'Scikit-learn',       level: 90 },
      { name: 'LLMs / RAG / MCP',   level: 85 },
      { name: 'NLP / Transformers', level: 80 },
      { name: 'OpenCV',             level: 72 },
      { name: 'Anomaly Detection',  level: 88 },
      { name: 'Feature Engineering',level: 85 },
    ],
  },
  {
    tag: 'DATA',
    label: 'Data Engineering',
    color: '#00e5ff',
    items: [
      { name: 'ETL / ELT Pipelines', level: 90 },
      { name: 'Apache Spark / PySpark',level: 82 },
      { name: 'Kafka',               level: 72 },
      { name: 'Airflow',             level: 75 },
      { name: 'dbt',                 level: 68 },
      { name: 'Snowflake',           level: 78 },
      { name: 'PostgreSQL / MySQL',  level: 88 },
      { name: 'MongoDB',             level: 75 },
    ],
  },
  {
    tag: 'CLOUD',
    label: 'Cloud & DevOps',
    color: '#39ff8a',
    items: [
      { name: 'AWS',           level: 78 },
      { name: 'Azure',         level: 72 },
      { name: 'GCP',           level: 68 },
      { name: 'Docker',        level: 82 },
      { name: 'Kubernetes',    level: 70 },
      { name: 'Terraform',     level: 65 },
      { name: 'CI/CD / GitHub Actions', level: 80 },
      { name: 'Databricks',    level: 72 },
    ],
  },
];

// ─── Projects (3D — anchored to cube vertices & faces) ──────────────
export const PROJECTS = [
  {
    tag: 'FINANCE',
    name: 'AI-Powered Personal Finance Agent',
    period: 'Apr 2024 – Aug 2024',
    color: '#00e5ff',
    stack: ['FastAPI', 'React', 'SQLite', 'Llama 3.2', 'LangGraph', 'BART', 'MCP', 'Vector DB'],
    metrics: [
      { label: 'F1 Score',      value: '0.93' },
      { label: 'ROC-AUC',       value: '0.98' },
      { label: 'NLP Accuracy',  value: '0.926' },
      { label: 'Query Latency', value: '218ms' },
    ],
    bullets: [
      'Secure financial microservice with automated ETL pipeline',
      'SMOTE resampling + Gradient Boosting fraud classifier',
      'Conversational GenAI copilot using Llama 3.2 + LangGraph',
      'Model Context Protocol (MCP) for real-time inference',
      'Unsupervised anomaly pipeline: Isolation Forest + Z-score',
    ],
  },
  {
    tag: 'CRISPR',
    name: 'CRISPR Scrollytelling',
    period: 'Sep 2025 – Dec 2025',
    color: '#9c6bff',
    stack: ['D3.js', 'Scrollama', 'JavaScript', 'CSS Animations', 'Data Visualization'],
    metrics: [
      { label: 'Dimensions Analyzed', value: '3' },
      { label: 'Data Sources',        value: 'Multi' },
      { label: 'Audience',            value: 'Non-technical' },
    ],
    bullets: [
      'Interactive narrative data visualizations for CRISPR gene editing',
      'Analyzed 3 dimensions: research trends, regulation, and adoption',
      'Geographic, policy, and trend-based findings through visual design',
      'Scrollama-driven storytelling with synchronized D3 animations',
    ],
  },
  {
    tag: 'JIO-ETL',
    name: 'Jio AirFiber Telemetry Pipeline',
    period: 'Jun 2023 – Jul 2024',
    color: '#ff7043',
    stack: ['Python', 'SQL', 'Pandas', 'TensorFlow Lite', 'Power BI', 'Salesforce'],
    metrics: [
      { label: 'Uptime Improvement',    value: '12%' },
      { label: 'False Alerts Reduced',  value: '40%' },
      { label: 'Devices Monitored',     value: '8k+' },
    ],
    bullets: [
      'ETL pipeline ingesting large-scale device telemetry for diagnostics',
      'Analyzed structured + semi-structured data from 3 platform components',
      'BI dashboards for device health, failure analysis, operational visibility',
      'TensorFlow Lite edge model for real-time anomaly detection',
      'Automated RSA key generation and encryption workflows',
    ],
  },
  {
    tag: 'BSNL-SDK',
    name: 'eSIM LPA SDK — BSNL',
    period: 'Jun 2022 – Jun 2023',
    color: '#39ff8a',
    stack: ['C', 'C++', 'MQTT v5', 'REST APIs', 'Wireshark', 'Burp Suite', 'Postman'],
    metrics: [
      { label: 'Devices Supported',      value: '8,000+' },
      { label: 'Lifecycle Operations',   value: '4' },
      { label: 'Protocol Tools Used',    value: '5' },
    ],
    bullets: [
      'MQTT v5 messaging + REST APIs for eSIM profile lifecycle management',
      'Download, activation, deactivation, and deletion across 8k+ devices',
      'C/C++ modules for 3G/4G GSM/LTE switching system efficiency',
      'Packet inspection with Wireshark, TShark, TCPdump',
      'Security validation with Burp Suite across multiple test scenarios',
    ],
  },
];

// ─── Cube Face Domains (3D — face glow + label) ─────────────────────
export const CUBE_FACES = [
  {
    verts: [0,1,2,3],
    name: 'Data Engineering',
    color: 0x00e5ff,
    icon: '⬡',
    skills: ['ETL/ELT Pipelines', 'PySpark · Kafka', 'Airflow · dbt', 'Snowflake · PostgreSQL'],
  },
  {
    verts: [4,5,6,7],
    name: 'Cloud & DevOps',
    color: 0x39ff8a,
    icon: '▦',
    skills: ['AWS · Azure · GCP', 'Docker · Kubernetes', 'Terraform · CI/CD', 'Databricks · Airflow'],
  },
  {
    verts: [0,1,5,4],
    name: 'Machine Learning',
    color: 0x9c6bff,
    icon: '◈',
    skills: ['TensorFlow · PyTorch', 'Scikit-learn · OpenCV', 'LLMs · RAG · MCP', 'Anomaly Detection'],
  },
  {
    verts: [2,3,7,6],
    name: 'Software Engineering',
    color: 0xff7043,
    icon: '⬡',
    skills: ['Python · C/C++ · Go', 'REST · GraphQL', 'FastAPI · Node.js', 'Testing & QA'],
  },
  {
    verts: [0,3,7,4],
    name: 'Networking & Systems',
    color: 0xffdc50,
    icon: '∿',
    skills: ['MQTT v5 · eSIM LPA', 'Wireshark · TCPdump', '4G LTE · GSM', 'Protocol Analysis'],
  },
  {
    verts: [1,2,6,5],
    name: 'Data Science & Viz',
    color: 0xff6baf,
    icon: '✦',
    skills: ['Statistical Learning', 'NLP · Transformers', 'D3.js · Tableau · Power BI', 'A/B Testing · EDA'],
  },
];

// ─── Impact Metrics (4D — outer cube vertices) ───────────────────────
export const IMPACT = [
  {
    tag: '12%',
    label: 'Device Uptime ↑',
    color: '#00e5ff',
    detail: 'Jio AirFiber production environment',
    driver: 'Python ETL pipelines + BI dashboards surfacing failure patterns',
    tech: ['Python', 'SQL', 'Power BI', 'Pandas'],
  },
  {
    tag: '40%',
    label: 'False Alerts ↓',
    color: '#39ff8a',
    detail: 'Edge anomaly detection in production',
    driver: 'TensorFlow Lite model deployed directly on AirFiber devices',
    tech: ['TensorFlow Lite', 'Edge ML', 'Python'],
  },
  {
    tag: '8k+',
    label: 'Connected Devices',
    color: '#ff7043',
    detail: 'BSNL telecom infrastructure',
    driver: 'eSIM LPA SDK supporting full profile lifecycle over MQTT v5',
    tech: ['C/C++', 'MQTT v5', 'REST APIs'],
  },
  {
    tag: '100k+',
    label: 'Transactions Analyzed',
    color: '#9c6bff',
    detail: 'Personal Finance Agent dataset',
    driver: 'Gradient Boosting fraud classifier with SMOTE resampling',
    tech: ['Python', 'Scikit-learn', 'SQLite', 'FastAPI'],
  },
  {
    tag: '0.93',
    label: 'F1 Score',
    color: '#ffdc50',
    detail: 'Fraud detection classifier',
    driver: 'SMOTE + Gradient Boosting on imbalanced transaction data',
    tech: ['Scikit-learn', 'SMOTE', 'Feature Engineering'],
  },
  {
    tag: '0.98',
    label: 'ROC-AUC',
    color: '#ff6baf',
    detail: 'Classifier discrimination performance',
    driver: 'Careful threshold tuning + ensemble model evaluation',
    tech: ['Scikit-learn', 'Pandas', 'Matplotlib'],
  },
  {
    tag: '218ms',
    label: 'Query Latency',
    color: '#4ab4f0',
    detail: 'Median GenAI copilot response time',
    driver: 'Llama 3.2 + LangGraph + Vector DB optimized retrieval',
    tech: ['Llama 3.2', 'LangGraph', 'BART', 'MCP'],
  },
  {
    tag: '0.926',
    label: 'NLP Intent Accuracy',
    color: '#9c6bff',
    detail: 'Conversational finance assistant',
    driver: 'BART summarization + RAG pipeline with intent classification',
    tech: ['BART', 'Vector Databases', 'LangGraph'],
  },
];

// ─── RAG Copilot system context ─────────────────────────────────────
export const COPILOT_CONTEXT = `
You are Pavan Teja Tallapalli's portfolio AI assistant. Answer questions about Pavan accurately and concisely based on the following information. Be friendly, specific, and always cite real numbers and tech when relevant. If asked something not covered, say so honestly.

IDENTITY:
Name: Pavan Teja Tallapalli
Location: Tempe, AZ
Email: ptallap2@asu.edu | Phone: (602) 756-5938
Status: M.S. Data Science candidate at Arizona State University (graduating May 2026), seeking full-time roles, F-1 OPT eligible.
Tracks: Data Scientist, ML Engineer, Software Engineer, Data Analyst, Network/Security Engineer

EDUCATION:
- M.S. Data Science (Computing & Decision Analytics), Arizona State University, Aug 2024–May 2026
  Coursework: Machine Learning, Statistical Learning, Data Mining, NLP, Big Data Analytics
- B.Tech Electronics & Communications Engineering (AI/ML), JIIT India, Jul 2019–May 2023

EXPERIENCE:
1. Data Analyst / SDE, Jio Platforms Limited, Jun 2023–Jul 2024
   - ETL pipelines for large-scale device telemetry
   - TensorFlow Lite anomaly-detection: 40% false alert reduction
   - BI dashboards: 12% device uptime improvement
   - Supported 3 AirFiber production components
   - Automated RSA encryption + Salesforce test framework
   - 8,000+ connected devices monitored

2. Software Engineer (Networking), BSNL, Jun 2022–Jun 2023
   - MQTT v5 APIs + eSIM LPA SDK for 8,000+ devices
   - C/C++ modules for 3G/4G GSM/LTE switching systems
   - Packet analysis: Wireshark, TShark, TCPdump, Burp Suite, Postman
   - Unit, integration, API, regression testing

PROJECTS:
1. AI-Powered Personal Finance Agent
   Stack: FastAPI, React, SQLite, Llama 3.2, LangGraph, BART, MCP, Vector DB
   Results: 0.93 F1, 0.98 ROC-AUC, 0.926 NLP intent accuracy, 218ms latency
   
2. CRISPR Scrollytelling
   Stack: D3.js, Scrollama, JavaScript
   Narrative data visualization across research, regulation, and adoption

3. Jio AirFiber ETL Pipeline
   Stack: Python, SQL, Pandas, TensorFlow Lite, Power BI
   Results: 12% uptime improvement, 40% false alert reduction

4. BSNL eSIM SDK
   Stack: C/C++, MQTT v5, REST APIs
   Results: 8,000+ devices, 4 lifecycle operations

SKILLS:
Languages: Python, SQL, C/C++, JavaScript, TypeScript, Java, Scala, Bash
ML/AI: TensorFlow, PyTorch, Scikit-learn, LLMs, RAG, MCP, NLP, Transformers, OpenCV
Data Engineering: ETL/ELT, PySpark, Kafka, Airflow, dbt, Snowflake, PostgreSQL, MongoDB
Cloud: AWS, Azure, GCP, Docker, Kubernetes, Terraform, CI/CD, Databricks
Viz: Tableau, Power BI, D3.js, Matplotlib, Looker

PERSONAL:
Sports: Cricket, Badminton, Volleyball, Table Tennis, Swimming, Chess, Poker
Travel: California (Big Sur, Santa Monica, Santa Barbara, SF, LA), Las Vegas, Atlanta, Savannah, Tempe, Flagstaff, Page, Sedona, Hilton Head Beach
Creative: Photography, Video editing, Short story writing
`;