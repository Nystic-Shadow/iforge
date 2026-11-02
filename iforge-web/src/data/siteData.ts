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
  url: "https://www.iforge.in",
  tagline: "IT Services & Consulting",
  headline: "Accelerating Success With IT Services",
  subheadline: "Transform your business with cutting-edge technology and expert consultancy services tailored to your needs.",
  contactEmail: "info@iforge.in",
  phone: "+91 99718 66720",
  address: "Plot No. 12, Sector 62, Noida, Uttar Pradesh, India",
  founded: "2024",
};


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
    id: "cloud-services",
    slug: "cloud-services",
    title: "Cloud Services",
    subtitle: "Trust a managed public cloud partner delivering end-to-end multi-cloud excellence",
    shortDesc: "CloudSMART strategy delivering complete cloud consultancy, architecture, and multi-cloud management.",
    longDesc: "Our CloudSMART strategy gives enterprises a complete cloud consultancy and delivery platform that adapts to your needs. Working across leading providers (AWS, Google Cloud, Azure), we help you unlock the full potential of modern cloud technologies to build scalable, resilient environments.",
    iconName: "Cloud",
    features: [
      "Multi-Cloud Architecture & Zero-Downtime Migration",
      "Cloud Cost Optimization (FinOps & Waste Reduction)",
      "DevOps, CI/CD & Kubernetes Orchestration",
      "Serverless & Microservices Modernization",
      "Cloud Security & Compliance Hardening"
    ],
    technologies: ["AWS", "Google Cloud", "Microsoft Azure", "Kubernetes", "Docker", "Terraform", "ArgoCD", "Prometheus"],
    deliverables: [
      "Production multi-region cloud architecture",
      "Automated Infrastructure as Code (IaC) repository",
      "Comprehensive FinOps cost reduction report",
      "24/7 automated cloud monitoring dashboard"
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
      }
    ],
    benefits: [
      "Lower cloud infrastructure spend through FinOps practices",
      "High availability and automated disaster recovery across availability zones",
      "Instant resource scalability during traffic spikes and peak enterprise loads",
      "Multi-cloud vendor lock-in prevention"
    ],
    faqs: [
      {
        question: "Which cloud providers does iForge officially support?",
        answer: "We design, migrate and run workloads on Amazon Web Services (AWS), Google Cloud Platform (GCP) and Microsoft Azure."
      },
      {
        question: "How do you prevent downtime during database migrations?",
        answer: "We utilize continuous replication tools (e.g. AWS DMS, Google Datastream) with parallel dry-run validations until the final sub-minute cutover window."
      }
    ]
  },
  {
    id: "it-infrastructure",
    slug: "it-infrastructure",
    title: "IT Infrastructure",
    subtitle: "Deliver resilient experiences with agile infrastructure ensuring business continuity",
    shortDesc: "Robust enterprise networking, system architecture, AMC services, and hardware engineering.",
    longDesc: "iForge Technologies delivers secure, scalable, and reliable IT infrastructure services designed to support evolving enterprise demands. We ensure your foundational hardware, network architecture, and operational systems run without interruption.",
    iconName: "Server",
    features: [
      "Enterprise Network Architecture & SD-WAN",
      "Server Virtualization & High-Throughput Storage",
      "Annual Maintenance Contracts (AMC Services)",
      "Disaster Recovery & Redundant Power Architecture",
      "Data Center Setup & Remote Hands Operations"
    ],
    technologies: ["VMware vSphere", "Cisco", "Fortinet", "HPE", "Dell EMC", "Hyper-V", "Ubiquiti", "SAN/NAS"],
    deliverables: [
      "High-availability network topology blueprint",
      "Hardware health diagnostics & capacity plan",
      "Comprehensive AMC service contract & SLA guide",
      "Disaster recovery runbook with RPO/RTO specifications"
    ],
    metrics: [],
    offerings: [
      {
        title: "Network & Systems Engineering",
        description: "High-throughput, redundant routing and switching setups with strict zero-trust boundary segmentation.",
        points: ["SD-WAN deployment", "VLAN & firewall zoning", "Bandwidth traffic shaping"]
      },
      {
        title: "Comprehensive AMC Support",
        description: "Proactive annual maintenance, scheduled hardware diagnostics, and priority on-site technician dispatch.",
        points: ["Preventive hardware maintenance", "Firmware updates & thermal tuning", "Spare parts replacement reserve"]
      },
      {
        title: "Virtualization & Storage Clustering",
        description: "VMware, Hyper-V, and enterprise SAN/NAS configurations optimized for latency-critical workloads.",
        points: ["Live VM migration setups", "Deduplication & tiered caching", "Automated off-site tape/cloud backups"]
      }
    ],
    benefits: [
      "Elimination of single points of hardware failure across critical nodes",
      "24/7 uptime monitoring with fast SLA response commitments",
      "Prolonged hardware lifecycle and predictable operational budgeting",
      "Complete physical and logical network security"
    ],
    faqs: [
      {
        question: "What is covered in an iForge IT AMC (Annual Maintenance Contract)?",
        answer: "Our AMC covers quarterly preventive maintenance, emergency on-site engineer visits, hardware repairs, OS/firmware patching, network health checks, and 24/7 helpdesk support."
      },
      {
        question: "Can iForge manage hybrid infrastructure (on-premise + cloud)?",
        answer: "Yes, our team specializes in interconnecting on-premise server rooms and data centers with public clouds using VPNs and direct cloud interconnects."
      }
    ]
  },
  {
    id: "cybersecurity-services",
    slug: "cybersecurity-services",
    title: "Cybersecurity Services",
    subtitle: "End-to-end cybersecurity services ensuring safety, compliance, and continuous resilience",
    shortDesc: "Vulnerability assessment, penetration testing, endpoint protection, and proactive defense.",
    longDesc: "Today's threat landscape is highly dynamic, driven by the rapid adoption of disruptive technologies. iForge brings deep expertise in Defense, Protection, and Risk Management to ensure your mission-critical digital assets remain fortified.",
    iconName: "ShieldCheck",
    features: [
      "Vulnerability Assessment & Pen Testing (VAPT)",
      "Next-Gen Firewall & Endpoint Detection (EDR/XDR)",
      "Security Operations Center (SOC) 24/7 Monitoring",
      "Compliance Audits (ISO 27001, SOC 2, HIPAA, GDPR)",
      "Zero Trust Identity & Access Management (IAM)"
    ],
    technologies: ["Palo Alto Networks", "Trend Micro", "CrowdStrike", "Splunk", "Wireshark", "Burp Suite", "Tenable Nessus", "Okta"],
    deliverables: [
      "Executive VAPT Audit Report with CVSS scoring",
      "Step-by-step remediation guide for developer teams",
      "ISO 27001 / SOC 2 readiness gap assessment",
      "Incident response and breach containment protocol"
    ],
    metrics: [],
    offerings: [
      {
        title: "VAPT & Penetration Testing",
        description: "Rigorous ethical hacking targeting web apps, cloud accounts, APIs, mobile apps, and internal network perimeters.",
        points: ["OWASP Top 10 vulnerabilities", "Privilege escalation simulations", "Social engineering & phishing assessments"]
      },
      {
        title: "Perimeter & Endpoint Fortification",
        description: "Using industry-leading platforms such as Palo Alto Networks and Trend Micro for automated threat quarantine.",
        points: ["Next-Gen firewall policies", "Ransomware behavioral blocking", "Strict USB and endpoint lockouts"]
      },
      {
        title: "Regulatory Compliance & Audit Preparation",
        description: "Comprehensive security policy authoring and gap remediation to achieve ISO 27001, SOC 2 Type II, and GDPR compliance.",
        points: ["Audit defense representation", "Data classification protocols", "Mandatory staff security training"]
      }
    ],
    benefits: [
      "Complete proactive protection against ransomware and data exfiltration",
      "Guaranteed compliance with regulatory and enterprise client security mandates",
      "Minimization of security incident impact, loss, and operational downtime",
      "Strengthened client trust through verifiable security certifications"
    ],
    faqs: [
      {
        question: "How frequently should an enterprise conduct VAPT?",
        answer: "We recommend comprehensive VAPT testing bi-annually, as well as immediately following any major production feature release or infrastructure change."
      },
      {
        question: "Do you assist our developers with fixing the vulnerabilities discovered?",
        answer: "Yes, our security engineers provide exact code snippets, configuration patches, and re-test all remediated issues free of charge."
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
