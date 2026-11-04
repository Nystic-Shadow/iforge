export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceMetric {
  value: string;
  label: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  shortDesc: string;
  longDesc: string;
  iconName: string;
  heroImage?: string;
  features: string[];
  technologies: string[];
  deliverables: string[];
  metrics: ServiceMetric[];
  offerings: {
    title: string;
    description: string;
    points?: string[];
  }[];
  benefits: string[];
  faqs: ServiceFaq[];
}

export const siteConfig = {
  name: "iForge Technologies",
  tagline: "IT Services & Consulting",
  headline: "Accelerating Success With IT Services",
  subheadline: "Transform your business with cutting-edge technology and expert consultancy services tailored to your needs.",
  contactEmail: "info@iforge.in",
  phone: "+91 99718 66720",
  address: "Plot No. 12, Sector 62, Noida, Uttar Pradesh, India",
  founded: "2024",
  /** Up to two more of each, added in Admin → Content → Site & Contact. */
  extraEmails: [] as string[],
  extraPhones: [] as string[],
};

/** The live site's address, for links in emails. */
export const SITE_URL = "https://www.iforge.in";

/** Most numbers or addresses shown for each: the main one plus two extras. */
export const MAX_CONTACTS = 3;

type Contacts = { contactEmail: string; phone: string; extraEmails?: string[]; extraPhones?: string[] };

/** The main email first, then any extras — blanks dropped. */
export const allEmails = (c: Contacts) =>
  [c.contactEmail, ...(c.extraEmails ?? [])].map((v) => v.trim()).filter(Boolean).slice(0, MAX_CONTACTS);

/** The main phone first, then any extras — blanks dropped. */
export const allPhones = (c: Contacts) =>
  [c.phone, ...(c.extraPhones ?? [])].map((v) => v.trim()).filter(Boolean).slice(0, MAX_CONTACTS);

/** A tel: link for a displayed number. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, "")}`;


export const servicesData: ServiceItem[] = [
  {
    id: "ai-ml",
    slug: "ai-ml",
    title: "AI & ML",
    subtitle: "Reimagine enterprise intelligence with customized AI & Machine Learning solutions",
    shortDesc: "Enterprise AI consulting, LLM adoption, predictive analytics, and automated decision engineering.",
    longDesc: "iForge AI & ML Advisory helps organizations transition from experimental AI to scalable, production-grade intelligence. From strategic roadmap design to deploying custom LLMs, RAG architectures, predictive models, and automated MLOps pipelines, we help enterprises accelerate outcomes with robust governance and security.",
    iconName: "BrainCircuit",
    features: [
      "AI Strategy & Readiness Assessment",
      "Custom Generative AI & Enterprise LLM Integration",
      "Predictive Analytics & Machine Learning Pipelines",
      "Enterprise Data Warehousing & Real-Time ETL",
      "Responsible AI & Algorithmic Governance"
    ],
    technologies: ["Python", "PyTorch", "OpenAI", "LangChain", "Snowflake", "Databricks", "Apache Spark", "Hugging Face"],
    deliverables: [
      "Enterprise AI Architecture Blueprint",
      "Production-ready RAG / LLM application pipeline",
      "Automated ML training and inference pipelines",
      "Model governance and safety evaluation framework"
    ],
    metrics: [],
    offerings: [
      {
        title: "AI Advisory & Strategic Roadmap",
        description: "Identify high-ROI AI use cases, assess technological readiness, and build an executable roadmap for enterprise artificial intelligence.",
        points: ["Use-case prioritization", "Technology gap analysis", "Total cost of ownership modeling"]
      },
      {
        title: "Predictive & Prescriptive Analytics",
        description: "Transform historical enterprise data into foresight with custom statistical learning, anomaly detection, and operational optimization.",
        points: ["Demand forecasting", "Customer churn prediction", "Automated anomaly alerts"]
      },
      {
        title: "Responsible AI Governance & Security",
        description: "Ensure ethical deployment, transparency, bias mitigation, and strict compliance with global AI governance regulations.",
        points: ["Guardrails & hallucination prevention", "Privacy-preserving data masking", "Regulatory compliance audits"]
      }
    ],
    benefits: [
      "Accelerated time-to-market for enterprise AI products",
      "Automated repetitive manual operational workflows",
      "High data confidence and centralized real-time intelligence",
      "Secure on-premise or VPC-isolated model deployments"
    ],
    faqs: [
      {
        question: "How does iForge ensure enterprise data privacy when using LLMs?",
        answer: "We deploy models strictly within your private cloud (VPC) or dedicated on-premise infrastructure with zero training on customer data and strict role-based access control."
      },
      {
        question: "What is the typical timeline for an AI proof-of-concept (PoC)?",
        answer: "Our structured agile AI sprint delivers a working, benchmarked PoC integrated with your sample data within 3 to 4 weeks."
      },
      {
        question: "Can iForge work with our existing data warehouse?",
        answer: "Yes, our engineers seamlessly integrate with Snowflake, BigQuery, AWS Redshift, PostgreSQL, and Databricks lakehouses."
      }
    ]
  },
  {
    id: "it-cloud",
    slug: "it-cloud",
    title: "Cloud & IT Infrastructure",
    subtitle: "Multi-cloud platforms and resilient on-premise infrastructure, designed and managed by one team",
    shortDesc: "Cloud architecture, migration and management, plus enterprise networking, servers, storage, and data center services.",
    longDesc: "iForge brings your cloud and your on-premise IT under one accountable team. We architect, migrate, and manage workloads across AWS, Google Cloud, and Azure, and we design and maintain the networks, servers, storage, and data centers your business depends on. The result is a hybrid environment that is secure, scalable, cost-efficient, and built to run without interruption.",
    iconName: "Cloud",
    features: [
      "Multi-Cloud Architecture & Zero-Downtime Migration",
      "Cloud Cost Optimization (FinOps & Waste Reduction)",
      "DevOps, CI/CD & Kubernetes Orchestration",
      "Enterprise Network Architecture & SD-WAN",
      "Server Virtualization & High-Throughput Storage",
      "Data Center Design, Build-Out & Operations",
      "Disaster Recovery & Business Continuity"
    ],
    technologies: ["AWS", "Google Cloud", "Microsoft Azure", "Kubernetes", "Docker", "Terraform", "VMware vSphere", "Hyper-V", "Cisco", "Fortinet", "HPE", "Dell EMC", "SAN/NAS"],
    deliverables: [
      "High-availability network and hybrid cloud architecture blueprint",
      "Automated Infrastructure as Code (IaC) repository",
      "Data center capacity, power & cooling plan",
      "FinOps cost reduction report",
      "Disaster recovery runbook with RPO/RTO specifications"
    ],
    metrics: [],
    offerings: [
      {
        title: "Cloud Migration & Modernization",
        description: "Zero-downtime workload migration from legacy on-premise infrastructure to high-performance cloud environments.",
        points: ["Phased lift-and-shift & refactor", "Database zero-loss synchronization", "Cutover dry-runs & failover testing"]
      },
      {
        title: "Managed Cloud Infrastructure & 24/7 SRE",
        description: "Around-the-clock monitoring, auto-scaling, backup redundancy, and SLA-backed management for your core cloud footprint.",
        points: ["Continuous health telemetry", "Automated incident remediation", "Kernel & vulnerability patching"]
      },
      {
        title: "DevOps & Cloud Automation",
        description: "Infrastructure as Code (Terraform), continuous integration pipelines, and containerized deployments with Kubernetes.",
        points: ["GitOps deployment workflows", "Self-healing Kubernetes clusters", "Multi-stage automated testing"]
      },
      {
        title: "Network & Systems Engineering",
        description: "High-throughput, redundant routing and switching setups with strict zero-trust boundary segmentation.",
        points: ["SD-WAN deployment", "VLAN & firewall zoning", "Bandwidth traffic shaping"]
      },
      {
        title: "Virtualization & Storage Clustering",
        description: "VMware, Hyper-V, and enterprise SAN/NAS configurations optimized for latency-critical workloads.",
        points: ["Live VM migration setups", "Deduplication & tiered caching", "Automated off-site tape/cloud backups"]
      },
      {
        title: "Data Center Services",
        description: "Design, build-out, and operation of server rooms, on-premise data centers, and colocation footprints — built for uptime and room to grow.",
        points: ["Rack, power & cooling design", "Structured cabling & physical security", "Colocation planning & data center migration"]
      }
    ],
    benefits: [
      "One team accountable for on-premise IT and cloud alike",
      "Elimination of single points of failure across critical systems",
      "High availability and automated disaster recovery across availability zones",
      "Lower infrastructure spend through FinOps practices and right-sized hardware",
      "Instant scalability during traffic spikes, with no multi-cloud vendor lock-in"
    ],
    faqs: [
      {
        question: "Can iForge manage hybrid infrastructure (on-premise + cloud)?",
        answer: "Yes, our team specializes in interconnecting on-premise server rooms and data centers with public clouds using VPNs and direct cloud interconnects."
      },
      {
        question: "Which cloud providers does iForge officially support?",
        answer: "We design, migrate and run workloads on Amazon Web Services (AWS), Google Cloud Platform (GCP) and Microsoft Azure."
      },
      {
        question: "Can iForge design or modernize our data center?",
        answer: "Yes. We plan and build server rooms and data centers — rack layout, power and cooling, cabling, virtualization, and storage — and can move workloads into colocation or the cloud when that is the better fit."
      },
      {
        question: "How do you prevent downtime during database migrations?",
        answer: "We utilize continuous replication tools (e.g. AWS DMS, Google Datastream) with parallel dry-run validations until the final sub-minute cutover window."
      }
    ]
  },
  {
    id: "cybersecurity-services",
    slug: "cybersecurity-services",
    title: "Cybersecurity",
    subtitle: "Find and fix weaknesses before attackers do, and stay compliant as you grow",
    shortDesc: "Penetration testing, vulnerability management, cloud security, threat protection, and compliance readiness.",
    longDesc: "Attackers look for the one gap you missed — in an application, an API, a misconfigured cloud account, or a phishing email. iForge tests your systems the way a real adversary would, prioritizes what actually matters, and works alongside your team until every finding is fixed and verified. From one-off penetration tests to ongoing vulnerability management and audit readiness, we help you reduce risk, protect data, and prove it to customers and regulators.",
    iconName: "ShieldCheck",
    features: [
      "Penetration Testing: Web, API, Mobile, Network & Cloud",
      "Vulnerability Assessment & Continuous Vulnerability Management",
      "Cloud Security Posture Review (AWS, Azure, Google Cloud)",
      "Red Teaming, Phishing Simulation & Social Engineering",
      "Endpoint, Firewall & Email Threat Protection",
      "Compliance Readiness (ISO 27001, SOC 2, GDPR, DPDP Act)",
      "Incident Response Planning & Security Awareness Training"
    ],
    technologies: ["Burp Suite", "OWASP ZAP", "Metasploit", "Nmap", "Tenable Nessus", "Kali Linux", "Wireshark", "CrowdStrike", "Palo Alto Networks", "Splunk", "Okta"],
    deliverables: [
      "Executive summary with business-level risk ratings",
      "Detailed technical report with CVSS-scored findings and proof of concept",
      "Prioritized, step-by-step remediation guide for developers and IT",
      "Re-test report confirming each fix",
      "Compliance gap assessment and security policy pack",
      "Incident response playbook with roles and escalation paths"
    ],
    metrics: [],
    offerings: [
      {
        title: "Penetration Testing",
        description: "Manual, expert-led ethical hacking of your web apps, APIs, mobile apps, and internal and external networks — going well beyond automated scanners.",
        points: ["OWASP Top 10 & API Security Top 10", "Authentication, session & business-logic flaws", "Privilege escalation & lateral movement"]
      },
      {
        title: "Vulnerability Assessment & Management",
        description: "Scheduled scanning and expert triage across servers, endpoints, and applications, so the riskiest issues are fixed first.",
        points: ["Asset discovery & attack-surface mapping", "Risk-based prioritization", "Patch tracking & verification"]
      },
      {
        title: "Cloud Security Assessment",
        description: "A configuration and access review of your AWS, Azure, or Google Cloud accounts against industry benchmarks.",
        points: ["IAM & least-privilege review", "Exposed storage & network misconfigurations", "CIS benchmark alignment"]
      },
      {
        title: "Red Teaming & Social Engineering",
        description: "Realistic attack simulations, including phishing campaigns, that test your people and processes as well as your technology.",
        points: ["Phishing & vishing simulations", "Objective-based attack scenarios", "Detection & response evaluation"]
      },
      {
        title: "Endpoint & Network Protection",
        description: "Design and hardening of firewalls, endpoint detection, and email security to block ransomware and data theft.",
        points: ["Next-gen firewall policies", "EDR/XDR deployment & tuning", "Email filtering & anti-phishing controls"]
      },
      {
        title: "Compliance & Audit Readiness",
        description: "Policy writing, gap remediation, and evidence preparation for ISO 27001, SOC 2, GDPR, and India's DPDP Act.",
        points: ["Gap assessment & remediation roadmap", "Security policies & data classification", "Staff security awareness training"]
      }
    ],
    benefits: [
      "Find and fix vulnerabilities before attackers can exploit them",
      "Clear, prioritized findings your developers can act on immediately",
      "Lower risk of ransomware, data breaches, and costly downtime",
      "Evidence to satisfy auditors, enterprise customers, and regulators",
      "A security program that keeps pace with new releases and infrastructure changes"
    ],
    faqs: [
      {
        question: "What is the difference between a vulnerability assessment and a penetration test?",
        answer: "A vulnerability assessment uses scanning and expert review to list known weaknesses across your systems. A penetration test goes further: our testers actively exploit weaknesses, as a real attacker would, to show what could actually be accessed and how to stop it."
      },
      {
        question: "How often should we run a penetration test?",
        answer: "We recommend at least once a year, and after any major release, infrastructure change, or cloud migration. Many teams pair this with continuous vulnerability scanning between tests."
      },
      {
        question: "Will testing disrupt our live systems?",
        answer: "Testing is scoped and scheduled with you in advance. We avoid destructive techniques on production, can test against staging environments, and stay in contact throughout so any concern is handled immediately."
      },
      {
        question: "Do you help our team fix the issues you find?",
        answer: "Yes. Every finding comes with clear remediation steps, our engineers can work directly with your developers and IT team, and we re-test to confirm each fix."
      }
    ]
  },
  {
    id: "application-development",
    slug: "application-development",
    title: "Application Development",
    subtitle: "End-to-end digital engineering: web platforms, enterprise dashboards, mobile & SaaS solutions",
    shortDesc: "Full-lifecycle custom applications, web platforms, real-time enterprise dashboards, and scalable APIs.",
    longDesc: "iForge delivers end-to-end Application Development for high-growth enterprises and modern startups. Whether you need custom web applications, executive dashboards with real-time analytics, scalable SaaS architectures, cross-platform mobile apps, or high-throughput microservice APIs, our engineering teams build scalable, secure, and intuitive digital products designed for peak performance.",
    iconName: "Code2",
    features: [
      "Full-Stack Web & Enterprise Application Engineering",
      "Real-Time Executive Dashboards & Analytics Portals",
      "Custom SaaS Platforms & Multi-Tenant Cloud Architecture",
      "Cross-Platform Mobile Apps & Progressive Web Applications (PWA)",
      "High-Throughput RESTful & GraphQL Microservice APIs"
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Python", "Go", "PostgreSQL", "Redis", "Docker", "GraphQL"],
    deliverables: [
      "Production-grade enterprise web & application platform",
      "Interactive real-time analytics & telemetry dashboard",
      "Modular TypeScript/Node/Go codebase with automated CI/CD",
      "Comprehensive OpenAPI / Swagger API architecture"
    ],
    metrics: [],
    offerings: [
      {
        title: "Custom Web & Enterprise Applications",
        description: "Tailored full-stack platforms with modern frontends and resilient backends designed for enterprise reliability.",
        points: ["Server-Side Rendering (SSR) & high interactivity", "Role-based access control (RBAC)", "Real-time WebSockets & event streaming"]
      },
      {
        title: "Executive Dashboards & BI Portals",
        description: "High-throughput data visualization portals delivering real-time telemetry, operational metrics, and decision intelligence.",
        points: ["Custom interactive charting & KPI monitors", "Multi-source data aggregation", "Granular export and drill-down reporting"]
      },
      {
        title: "SaaS & Mobile Application Engineering",
        description: "Multi-tenant SaaS foundations, progressive web apps (PWAs), and cross-platform mobile experiences.",
        points: ["Multi-tenant data isolation & billing", "Offline-first sync & mobile readiness", "Scalable REST & GraphQL microservice backends"]
      }
    ],
    benefits: [
      "Unified digital engineering across web, mobile, dashboards, and internal tooling",
      "Sub-second load times and intuitive, high-productivity user interfaces",
      "Clean, maintainable, modular codebase with zero vendor lock-in",
      "Strict enterprise security, data encryption, and role-based permissions"
    ],
    faqs: [
      {
        question: "What types of applications does iForge build?",
        answer: "We engineer the full spectrum of modern digital products: custom enterprise web applications, real-time data dashboards, SaaS platforms, internal operations tools, customer portals, cross-platform mobile apps, and scalable API ecosystems."
      },
      {
        question: "Can you build real-time dashboards connected to our databases and cloud telemetry?",
        answer: "Yes. We specialize in building responsive, low-latency executive dashboards that connect directly to PostgreSQL, Snowflake, BigQuery, Kafka streams, and REST/GraphQL APIs with instant live updating."
      },
      {
        question: "Do we retain 100% full ownership of the source code and IP?",
        answer: "Yes, 100% of the source code, design systems, architectural schemas, repositories, and deployment configurations are transferred directly to your organization upon project delivery."
      }
    ]
  }
];


export const valueProps = [
  {
    title: "Outcome-Driven ROI",
    description: "We align technology architectures directly with concrete business metrics: revenue, operational velocity, and cloud efficiency.",
    icon: "Target"
  },
  {
    title: "Zero-Trust Engineering",
    description: "Every line of code and infrastructure component is architected with defense-in-depth, encrypted pipelines, and resilience.",
    icon: "Lock"
  },
  {
    title: "Agile Speed & Transparency",
    description: "Rapid sprints, bi-weekly milestone demonstrations, dedicated Slack channels, and crystal-clear project accounting.",
    icon: "Zap"
  }
];

export const techCapabilities = [
  {
    category: "Cloud & DevOps",
    items: ["Amazon Web Services (AWS)", "Google Cloud Platform", "Kubernetes & Docker", "Terraform & OpenTofu", "CI/CD GitOps", "FinOps Architecture"]
  },
  {
    category: "AI & Machine Learning",
    items: ["PyTorch & TensorFlow", "Large Language Models (LLMs)", "LangChain & RAG Systems", "Snowflake & Databricks", "Apache Spark & Kafka", "Predictive Analytics"]
  },
  {
    category: "Cybersecurity & Governance",
    items: ["Palo Alto Networks", "Trend Micro Cloud One", "VAPT & Pen Testing", "ISO 27001 Audits", "SOC 2 Type II Prep", "Zero Trust IAM"]
  },
  {
    category: "Application & Dashboard Engineering",
    items: ["Next.js & React 19", "TypeScript & Node.js", "Executive Real-Time Dashboards", "Cross-Platform Mobile & PWA", "PostgreSQL & Redis", "High-Throughput APIs"]
  }
];

// Removed until the real history is confirmed; add entries in Admin → Content → About.
export const companyTimeline: { year: string; title: string; description: string }[] = [];
