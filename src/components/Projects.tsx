"use client";

import React, { useState, useEffect, useRef } from "react";
import TiltCard from "./TiltCard";
import styles from "./Projects.module.css";

type ProjectCategory = "all" | "fullstack" | "automation" | "ghl";

interface MetricItem {
  value: string;
  label: string;
}

interface DifficultyItem {
  label: string;
  score: number; // 0 to 100
}

interface CodeStatItem {
  label: string;
  value: string;
}

interface TerminalStep {
  text: string;
  delay: number;
}

interface CaseStudyData {
  problem: string;
  solution: string;
  impact: string[];
}

interface ProjectItem {
  title: string;
  subtitle: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  gradientClass: string;
  icon: string;
  linkText: string;
  metrics: MetricItem[];
  difficulty: DifficultyItem[];
  codeStats: CodeStatItem[];
  flowNodes: string[];
  nodeTooltips: string[];
  terminalScript: TerminalStep[];
  aiExplainer: string;
  architecture: string[];
  lastUpdated: string;
  technicalMetrics: { label: string; value: string }[];
  hoverStats: string[];
  caseStudy: CaseStudyData;
  productionReadiness: string[];
  n8nBadge: { nodes: string; integrations: string };
}

interface ProjectsProps {
  onInspect: (title: string) => void;
}

export default function Projects({ onInspect }: ProjectsProps) {
  const [filter, setFilter] = useState<ProjectCategory>("all");

  const projects: ProjectItem[] = [
    {
      title: "Production AI SEO Pipeline",
      subtitle: "CONTENT AUTOMATION ENGINE",
      description: "Automates search research, outline mapping, long-form writing, and Google Workspace publishing.",
      category: "automation",
      tags: ["⚡ n8n", "🤖 GPT-5", "🔍 Deep Research", "📊 Sheets", "📝 Docs", "☁️ Drive"],
      gradientClass: styles.gradOrange,
      icon: "📰",
      linkText: "▶ Explore Production System",
      metrics: [
        { value: "26 Nodes", label: "n8n Blueprint" },
        { value: "6 APIs", label: "External Integrations" },
        { value: "4000 Words", label: "Long-form Output" },
        { value: "1 Gate", label: "Human Review Gate" }
      ],
      difficulty: [
        { label: "AI & Agents", score: 90 },
        { label: "Automation", score: 95 },
        { label: "Backend", score: 80 },
        { label: "Frontend", score: 70 }
      ],
      codeStats: [
        { label: "Workflow Size", value: "26 Nodes" },
        { label: "AI Models", value: "2" },
        { label: "Integrations", value: "6" },
        { label: "Automation Level", value: "90%" }
      ],
      flowNodes: ["Research", "Filter", "Dedup", "Writing", "Humanize", "Publish"],
      nodeTooltips: [
        "Uses OpenAI web search to discover trending opportunities.",
        "AI relevance scoring.",
        "Deduplication and duplicate checks.",
        "GPT-5 content generation.",
        "Tone adjustment & style matching.",
        "Google Workspace auto export."
      ],
      terminalScript: [
        { text: "$ pipeline.run()", delay: 400 },
        { text: "Research...", delay: 600 },
        { text: "✓ 12 topics found", delay: 300 },
        { text: "Qualification...", delay: 600 },
        { text: "✓ 4 selected", delay: 300 },
        { text: "Writing...", delay: 700 },
        { text: "✓ 4000 words", delay: 300 },
        { text: "Publishing...", delay: 500 },
        { text: "✓ Done", delay: 400 },
        { text: "Execution Time: 4m 11s", delay: 300 }
      ],
      aiExplainer: "This AI-driven content strategist crawls active property search trends, executes Deep Research queries, qualifies topics, drafts articles using GPT-5, formats them in Google Docs, and uploads to Drive upon approval.",
      architecture: ["Research", "AI Analysis", "Topic Selection", "SEO Writing", "Human Review", "Google Docs", "Publishing"],
      lastUpdated: "Jun 2026",
      technicalMetrics: [
        { label: "Workflow Nodes", value: "26" },
        { label: "AI Models", value: "2" },
        { label: "Integrations", value: "6" },
        { label: "Approval Gates", value: "1" },
        { label: "Storage Systems", value: "3" },
        { label: "Output Formats", value: "2" }
      ],
      hoverStats: [
        "26 Workflow Nodes",
        "6 External Services",
        "2 AI Models",
        "1 Human Approval Gate"
      ],
      caseStudy: {
        problem: "Manual SEO workflows are slow and difficult to scale.",
        solution: "AI pipeline automates research, writing, review and publishing.",
        impact: [
          "✓ Faster publishing",
          "✓ Consistent quality",
          "✓ Human approval",
          "✓ Google integration"
        ]
      },
      productionReadiness: [
        "Live Sync",
        "Architecture Approved",
        "Human Approval Gate",
        "Google Workspace",
        "HTML Export",
        "Duplicate Prevention"
      ],
      n8nBadge: { nodes: "26 Nodes", integrations: "6 Integrations" }
    },
    {
      title: "Production RAG Platform",
      subtitle: "PRODUCTION RAG ENGINE",
      description: "Enterprise semantic retrieval indexing 10,000+ files with sub-80ms search queries.",
      category: "fullstack",
      tags: ["⚡ n8n", "🧠 Jina", "🗄️ Qdrant", "💻 Next", "🔑 Security"],
      gradientClass: styles.gradPurple,
      icon: "📚",
      linkText: "▶ Open Interactive Case Study",
      metrics: [
        { value: "10000 Docs", label: "Knowledgebase Files" },
        { value: "80ms", label: "Query Retrieval" },
        { value: "99.2%", label: "Accuracy Rate" },
        { value: "4 Sources", label: "Ingestion Paths" }
      ],
      difficulty: [
        { label: "AI & Agents", score: 85 },
        { label: "Automation", score: 70 },
        { label: "Backend", score: 95 },
        { label: "Frontend", score: 85 }
      ],
      codeStats: [
        { label: "Workflow Size", value: "18 Nodes" },
        { label: "AI Models", value: "Jina Embeddings" },
        { label: "Integrations", value: "4" },
        { label: "Automation Level", value: "95%" }
      ],
      flowNodes: ["Ingest", "Chunk", "Embed", "Vector", "Search"],
      nodeTooltips: [
        "Parses raw files into clean text chunks.",
        "Removes noise and structural metadata.",
        "Creates query embeddings via Jina AI.",
        "Indexes vector data in Qdrant store.",
        "Delivers semantic responses inside UI."
      ],
      terminalScript: [
        { text: "$ qdrant-query --search=\"real estate tax benefit\"", delay: 400 },
        { text: "Connecting...", delay: 500 },
        { text: "✓ Qdrant vector store online", delay: 300 },
        { text: "Embedding query...", delay: 600 },
        { text: "✓ Jina AI vector ready", delay: 300 },
        { text: "Searching index...", delay: 600 },
        { text: "✓ Retrieved 4 context chunks (52ms)", delay: 400 },
        { text: "Synthesizing...", delay: 600 },
        { text: "✓ Response ready", delay: 400 },
        { text: "Query processed. (0.8s)", delay: 300 }
      ],
      aiExplainer: "A custom Retrieval-Augmented Generation (RAG) platform. Documents are chunked and embedded via Jina AI, stored in Qdrant, and retrieved inside a Next.js chat layout using semantic vector search.",
      architecture: ["Raw Docs", "Node.js Parser", "Jina API", "Qdrant Vector DB", "Next.js Interface"],
      lastUpdated: "May 2026",
      technicalMetrics: [
        { label: "Vector Nodes", value: "18" },
        { label: "AI Embeddings", value: "Jina AI" },
        { label: "Vector DB", value: "Qdrant" },
        { label: "Indexed Docs", value: "10,000+" },
        { label: "Query Latency", value: "< 80ms" },
        { label: "Accuracy Rate", value: "99.2%" }
      ],
      hoverStats: [
        "18 RAG Nodes",
        "Qdrant Vector DB",
        "Jina Embeddings",
        "99.2% Accuracy"
      ],
      caseStudy: {
        problem: "Document search is disconnected and manual analysis is slow.",
        solution: "RAG automation indexer parses, embeddings, and formats semantic answers.",
        impact: [
          "✓ Sub-80ms search",
          "✓ 99.2% accuracy",
          "✓ Auto chunks parsed",
          "✓ Secured local store"
        ]
      },
      productionReadiness: [
        "Vector Sync",
        "Index Validation",
        "Latency Safeguard",
        "Secure Ingestion",
        "Semantic Guardrails",
        "Multi-source Parsing"
      ],
      n8nBadge: { nodes: "18 Nodes", integrations: "4 Integrations" }
    },
    {
      title: "AI Voice Calling Engine",
      subtitle: "CONVERSATIONAL AI ENGINE",
      description: "Autonomous WebRTC conversational voice qualification agent synced with GoHighLevel CRM.",
      category: "ghl",
      tags: ["📞 Twilio", "🗣️ Vocode", "🤖 CloseBot", "🏠 GHL", "📅 Calendar"],
      gradientClass: styles.gradBlue,
      icon: "📞",
      linkText: "▶ Explore Production System",
      metrics: [
        { value: "5000+ Calls", label: "System Dialers Run" },
        { value: "42%", label: "Slot Booking Rate" },
        { value: "< 200ms", label: "WebRTC Voice Latency" },
        { value: "24/7", label: "Active Operational SLA" }
      ],
      difficulty: [
        { label: "AI & Agents", score: 95 },
        { label: "Automation", score: 90 },
        { label: "Backend", score: 85 },
        { label: "Frontend", score: 60 }
      ],
      codeStats: [
        { label: "Workflow Size", value: "32 Nodes" },
        { label: "AI Models", value: "Vocode & CloseBot" },
        { label: "Integrations", value: "5" },
        { label: "Automation Level", value: "98%" }
      ],
      flowNodes: ["Call", "STT", "AI", "Action", "CRM"],
      nodeTooltips: [
        "Twilio voice call trigger.",
        "Inbound webhook dispatcher.",
        "Vocode WebRTC speech agent.",
        "CloseBot AI intent parser.",
        "GoHighLevel CRM update."
      ],
      terminalScript: [
        { text: "$ call --lead=\"+1234567\" --agent=\"Qualify\"", delay: 500 },
        { text: "Connecting Twilio...", delay: 600 },
        { text: "✓ Voice trunk active", delay: 300 },
        { text: "Vocode pipeline...", delay: 600 },
        { text: "✓ Speech-to-Text active (180ms latency)", delay: 400 },
        { text: "Intent parsing...", delay: 600 },
        { text: "✓ CloseBot intent: motivated seller", delay: 300 },
        { text: "Booking slot...", delay: 700 },
        { text: "✓ CRM slot secured (Friday 3pm)", delay: 300 },
        { text: "Simulation finished.", delay: 300 }
      ],
      aiExplainer: "This voice pipeline fields inbound questions and triggers outbound qualification campaigns. It transcribes discussions, extracts purchase/sell intent, and logs scheduled bookings straight into GoHighLevel.",
      architecture: ["Twilio Webhook", "Vocode WebRTC", "CloseBot Parser", "GoHighLevel API"],
      lastUpdated: "Apr 2026",
      technicalMetrics: [
        { label: "Workflow Nodes", value: "32" },
        { label: "Voice Latency", value: "< 200ms" },
        { label: "Integrations", value: "5" },
        { label: "Outbound Calls", value: "5000+" },
        { label: "Booking Rate", value: "42%" },
        { label: "Active Hours", value: "24/7" }
      ],
      hoverStats: [
        "32 Voice Nodes",
        "Twilio Trunking",
        "Vocode WebRTC",
        "CloseBot intent parsing"
      ],
      caseStudy: {
        problem: "Inbound leads grow cold rapidly and manual operators are expensive.",
        solution: "Voice AI transcribes live dialogue and filters seller intents.",
        impact: [
          "✓ Instant call reply",
          "✓ 42% booked slots",
          "✓ Vocode WebRTC live",
          "✓ GHL calendar sync"
        ]
      },
      productionReadiness: [
        "Trunking Verified",
        "Vocode Audio Active",
        "CloseBot Intent Engine",
        "GHL Integration",
        "Secure Logging",
        "24/7 Uptime SLA"
      ],
      n8nBadge: { nodes: "32 Nodes", integrations: "5 Integrations" }
    },
    {
      title: "GHL Revenue Automation",
      subtitle: "BUSINESS AUTOMATION ENGINE",
      description: "Complex revenue event mesh syncing Stripe webhooks to HubSpot CRM and Slack alerts.",
      category: "automation",
      tags: ["⚡ n8n", "🔗 Zapier", "⚙️ Make.com", "🛡️ OAuth2", "📂 Webhooks"],
      gradientClass: styles.gradGreen,
      icon: "⚙️",
      linkText: "▶ Explore Production System",
      metrics: [
        { value: "50K Runs/mo", label: "Mesh Trigger Volume" },
        { value: "120 Hrs Saved", label: "Admin Overhead Saved" },
        { value: "15+ Apps", label: "Connected SaaS Nodes" },
        { value: "99.9% Uptime", label: "Operational SLA Uptime" }
      ],
      difficulty: [
        { label: "AI & Agents", score: 50 },
        { label: "Automation", score: 100 },
        { label: "Backend", score: 90 },
        { label: "Frontend", score: 50 }
      ],
      codeStats: [
        { label: "Workflow Size", value: "45 Nodes" },
        { label: "AI Models", value: "1" },
        { label: "Integrations", value: "15" },
        { label: "Automation Level", value: "100%" }
      ],
      flowNodes: ["Lead", "Pipeline", "SMS", "Booking", "Follow-up"],
      nodeTooltips: [
        "Monitors Stripe checkout webhooks.",
        "Authenticates connections via OAuth2.",
        "n8n router logic flow.",
        "Syncs CRM pipeline databases.",
        "Dispatches team Slack alerts."
      ],
      terminalScript: [
        { text: "$ mesh-status --verbose", delay: 400 },
        { text: "Checking auth...", delay: 500 },
        { text: "✓ OAuth2 connection tokens verified", delay: 300 },
        { text: "Testing router...", delay: 600 },
        { text: "✓ Webhook router pool online", delay: 400 },
        { text: "Syncing DB...", delay: 600 },
        { text: "✓ Synced Stripe with HubSpot CRM", delay: 300 },
        { text: "Mesh healthy. (Uptime: 99.9%)", delay: 300 }
      ],
      aiExplainer: "An orchestration grid managing operational pipelines. It coordinates real-time billing, team chats, client dashboards, CRM triggers, and inventory levels across disjoint cloud tools.",
      architecture: ["Stripe / SaaS triggers", "Webhook Receivers", "n8n Router Node", "HubSpot / Slack Sync"],
      lastUpdated: "Mar 2026",
      technicalMetrics: [
        { label: "Mesh Nodes", value: "45" },
        { label: "SaaS Integrations", value: "15" },
        { label: "Monthly Runs", value: "50K/mo" },
        { label: "Hours Saved", value: "120 hrs" },
        { label: "Uptime Rate", value: "99.9%" },
        { label: "Auth Protocol", value: "OAuth2" }
      ],
      hoverStats: [
        "45 Mesh Nodes",
        "15 Connected Apps",
        "OAuth2 Encryption",
        "99.9% Uptime SLA"
      ],
      caseStudy: {
        problem: "Fragmented systems require constant manual syncing.",
        solution: "OAuth2 middleware routes checkouts and updates CRM databases.",
        impact: [
          "✓ No manual entry",
          "✓ OAuth2 data path",
          "✓ 120+ hours saved",
          "✓ Slack alerts live"
        ]
      },
      productionReadiness: [
        "OAuth2 Validation",
        "Webhook Router Active",
        "HubSpot CRM Sync",
        "Stripe Checkout Hook",
        "Uptime Monitoring",
        "Disaster Recovery Plan"
      ],
      n8nBadge: { nodes: "45 Nodes", integrations: "15 Integrations" }
    }
  ];

  const filteredProjects = filter === "all"
    ? projects
    : projects.filter(p => p.category === filter);

  return (
    <section id="work" className={styles.section}>
      <div className={styles.container}>
        {/* Decorative Grid Network Background */}
        <div className={styles.meshNetworkBg}>
          <div className={styles.gridLineHorizontal}></div>
          <div className={styles.gridLineVertical}></div>
        </div>

        <div className={styles.header}>
          <span className={styles.badge}>Production Ready</span>
          <h2 className={styles.title}>Featured AI Systems</h2>
          <div className={styles.featuredStatsGrid}>
            <div className={styles.featuredStatItem}>
              <span className={styles.featuredStatVal}>4</span>
              <span className={styles.featuredStatLbl}>Production Systems</span>
            </div>
            <div className={styles.featuredStatDivider}></div>
            <div className={styles.featuredStatItem}>
              <span className={styles.featuredStatVal}>20+</span>
              <span className={styles.featuredStatLbl}>Integrations</span>
            </div>
            <div className={styles.featuredStatDivider}></div>
            <div className={styles.featuredStatItem}>
              <span className={styles.featuredStatVal}>70+</span>
              <span className={styles.featuredStatLbl}>Workflow Nodes</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className={styles.filters}>
          {(["all", "fullstack", "automation", "ghl"] as ProjectCategory[]).map((cat) => {
            const count = cat === "all" ? projects.length : projects.filter(p => p.category === cat).length;
            const label = cat === "all" ? "All" : cat === "fullstack" ? "Full Stack" : cat === "automation" ? "AI & Workflows" : "GoHighLevel";
            return (
              <button
                key={cat}
                className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ""}`}
                onClick={() => {
                  setFilter(cat);
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("visitor-interest", { detail: cat }));
                  }
                }}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className={styles.grid}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              onInspect={onInspect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: ProjectItem;
  onInspect: (title: string) => void;
}

function ProjectCard({ project, onInspect }: ProjectCardProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "case_study" | "architecture" | "blueprint" | "terminal" | "stats">("dashboard");
  const [zoomImageSrc, setZoomImageSrc] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [terminalRunning, setTerminalRunning] = useState(false);
  const [aiOrbHovered, setAiOrbHovered] = useState(false);
  const [seoCounter, setSeoCounter] = useState(25);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Track mouse coordinates inside card to supply custom reactive lighting variables
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const [lightStyles, setLightStyles] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLightStyles({
      "--mouse-x": `${x}px`,
      "--mouse-y": `${y}px`,
    } as React.CSSProperties);
  };

  // Live continuous terminal simulation loop
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentLogIndex = 0;
    let isRunning = true;

    const runNextStep = () => {
      if (!isRunning) return;
      if (currentLogIndex < project.terminalScript.length) {
        const step = project.terminalScript[currentLogIndex];
        setTerminalLogs(prev => [...prev, step.text]);
        currentLogIndex++;
        timeoutId = setTimeout(runNextStep, step.delay);
      } else {
        // Loop continuously after 3.5 seconds
        timeoutId = setTimeout(() => {
          if (!isRunning) return;
          setTerminalLogs([]);
          currentLogIndex = 0;
          runNextStep();
        }, 3500);
      }
    };

    if (activeTab === "terminal") {
      setTerminalLogs([]);
      runNextStep();
    } else {
      isRunning = false;
      setTerminalLogs([]);
    }

    return () => {
      isRunning = false;
      clearTimeout(timeoutId);
    };
  }, [activeTab, project.terminalScript]);

  // Scroll terminal logs to bottom automatically
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Live SEO counter animation
  useEffect(() => {
    if (activeTab === "dashboard" && project.title === "Production AI SEO Pipeline") {
      setSeoCounter(25);
      const timer = setTimeout(() => {
        setSeoCounter(26);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, project.title]);

  const getProjectCardClass = () => {
    if (project.title.includes("SEO")) return styles.cardSEO;
    if (project.title.includes("RAG")) return styles.cardRAG;
    if (project.title.includes("Calling") || project.title.includes("Voice")) return styles.cardVoice;
    if (project.title.includes("Mesh") || project.title.includes("Automation")) return styles.cardGHL;
    return "";
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest(`.${styles.progressionIndicator}`) ||
      target.closest(`.${styles.aiOrb}`) ||
      target.closest(`.${styles.lightboxOverlay}`) ||
      target.closest(`.${styles.nodeCardTooltip}`) ||
      target.closest("button")
    ) {
      return;
    }
    if (
      project.title === "AI SEO Content Engine" ||
      project.title === "AI Real Estate Calling System" ||
      project.title === "Multi-Platform Automation Mesh"
    ) {
      onInspect(project.title);
    } else {
      startTerminalSimulation();
    }
  };

  return (
    <div
      ref={cardContainerRef}
      className={`${styles.gridItem} stagger-item`}
      onMouseMove={handleMouseMove}
    >
      <TiltCard
        className={`${styles.card} ${getProjectCardClass()}`}
        onClick={handleCardClick}
        style={{ cursor: "pointer" }}
      >
        {/* Custom Mouse Chased Border Light Layer */}
        <div className={styles.cardMouseLight} style={lightStyles}></div>

        {/* Floating AI Explainer Orb */}
        <div
          className={`${styles.aiOrb} ${aiOrbHovered ? styles.aiOrbExpanded : ""}`}
          onMouseEnter={() => setAiOrbHovered(true)}
          onMouseLeave={() => setAiOrbHovered(false)}
        >
          <span className={styles.aiOrbIcon}>🤖</span>
          <div className={styles.aiOrbExplainer}>
            <p className={styles.aiOrbTitle}>AI Assistant Explainer</p>
            <p className={styles.aiOrbText}>{project.aiExplainer}</p>
          </div>
        </div>

        {/* Top Header section */}
        <div className={styles.cardHeaderArea}>
          <div className={`${styles.cardImage} ${project.gradientClass}`}>
            <span className={styles.cardIcon}>{project.icon}</span>
          </div>
          <div className={styles.cardHeaderTitleWrap}>
            <h3 className={styles.cardTitle}>{project.title}</h3>
            <span className={styles.cardCategoryLabel}>{project.subtitle}</span>
          </div>

          {/* Live Mission Control Status Indicator */}
          <div className={styles.statusIndicator}>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot}></span>
              <span className={styles.statusText}>LIVE • {project.lastUpdated}</span>
            </div>

            {/* Hover Tooltip Overlay */}
            <div className={styles.statusTooltip}>
              <div className={styles.tooltipTitle}>System Metrics</div>
              {project.hoverStats.map((stat, idx) => (
                <div key={idx} className={styles.tooltipRow}>
                  <span className={styles.tooltipDot}>●</span> {stat}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Story Progression Navigation */}
        <div className={styles.progressionIndicator}>
          <button
            type="button"
            className={`${styles.progStepBtn} ${activeTab === "dashboard" ? styles.progStepActive : ""}`}
            onClick={() => setActiveTab("dashboard")}
            title="Business overview"
          >
            Business
          </button>
          <span className={styles.progArrow}>•</span>
          <button
            type="button"
            className={`${styles.progStepBtn} ${activeTab === "case_study" ? styles.progStepActive : ""}`}
            onClick={() => setActiveTab("case_study")}
            title="Case study analysis"
          >
            Case Study
          </button>
          <span className={styles.progArrow}>•</span>
          <button
            type="button"
            className={`${styles.progStepBtn} ${activeTab === "architecture" ? styles.progStepActive : ""}`}
            onClick={() => setActiveTab("architecture")}
            title="System design"
          >
            Architecture
          </button>
          <span className={styles.progArrow}>•</span>
          <button
            type="button"
            className={`${styles.progStepBtn} ${activeTab === "blueprint" ? styles.progStepActive : ""}`}
            onClick={() => setActiveTab("blueprint")}
            title="Production implementation"
          >
            Real n8n
          </button>
          <span className={styles.progArrow}>•</span>
          <button
            type="button"
            className={`${styles.progStepBtn} ${activeTab === "terminal" ? styles.progStepActive : ""}`}
            onClick={() => setActiveTab("terminal")}
            title="Live pipeline simulator"
          >
            Execution
          </button>
          <span className={styles.progArrow}>•</span>
          <button
            type="button"
            className={`${styles.progStepBtn} ${activeTab === "stats" ? styles.progStepActive : ""}`}
            onClick={() => setActiveTab("stats")}
            title="Technical specs & statistics"
          >
            Specs
          </button>
        </div>

        {/* Interactive Viewport Area */}
        <div className={styles.interactiveViewport}>
          {activeTab === "dashboard" && (
            <div className={styles.dashboardTabContent}>
              {/* 1. Live Workflow Node Graph */}
              <div className={styles.workflowContainer}>
                <div className={styles.flowTitle}>Live Workflow Diagram</div>
                <div className={styles.flowNodesList}>
                  {project.flowNodes.map((node, index) => (
                    <React.Fragment key={node}>
                      <div className={styles.flowNodeCard}>
                        <div className={styles.flowNodeCircle}></div>
                        <span className={styles.flowNodeName}>{node}</span>
                        {/* Custom Tooltip */}
                        <div className={styles.nodeCardTooltip}>
                          {project.nodeTooltips[index]}
                        </div>
                      </div>
                      {index < project.flowNodes.length - 1 && (
                        <div className={styles.flowConnector}>
                          <div
                            className={styles.connectorPulse}
                            style={{ animationDelay: `${index * 0.25}s` }}
                          ></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* 2. Glassmorphism Metrics Grid */}
              <div className={styles.metricsGrid}>
                {project.metrics.map((metric, index) => (
                  <div key={index} className={styles.metricGlassCard}>
                    <span className={styles.metricVal}>
                      {project.title === "AI SEO Content Engine" && metric.label === "Workflows" ? seoCounter : metric.value}
                    </span>
                    <span className={styles.metricLabel}>{metric.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "case_study" && (
            <div className={styles.caseStudyTabContent}>
              <div className={styles.caseStudyHeaderMini}>
                <span className={styles.caseStudyTitleMini}>Case Study Brief</span>
              </div>
              <div className={styles.caseStudyGridMini}>
                <div className={styles.caseStudyColMini}>
                  <strong className={styles.caseStudyLabelMini}>Problem</strong>
                  <p className={styles.caseStudyTextMini}>{project.caseStudy.problem}</p>
                </div>
                <div className={styles.caseStudyColMini}>
                  <strong className={styles.caseStudyLabelMini}>Solution</strong>
                  <p className={styles.caseStudyTextMini}>{project.caseStudy.solution}</p>
                </div>
                <div className={styles.caseStudyColMini}>
                  <strong className={styles.caseStudyLabelMini}>Impact</strong>
                  <ul className={styles.caseStudyListMini}>
                    {project.caseStudy.impact.map((imp, idx) => (
                      <li key={idx} className={styles.caseStudyListItemMini}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "terminal" && (
            <div className={styles.terminalTabContent}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalDotRed}></div>
                <div className={styles.terminalDotYellow}></div>
                <div className={styles.terminalDotGreen}></div>
                <span className={styles.terminalTitle}>Pipeline Simulator</span>
              </div>
              <div ref={terminalContainerRef} className={styles.terminalBody}>
                {terminalLogs.length === 0 ? (
                  <div className={styles.terminalIdleText}>
                    Click "Run Simulation" below to see this agent execute its task in real-time.
                  </div>
                ) : (
                  terminalLogs.map((log, index) => (
                    <div key={index} className={styles.terminalLine}>
                      {log}
                    </div>
                  ))
                )}
                {terminalRunning && (
                  <div className={styles.terminalCursor}>█</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className={styles.statsTabContent}>
              <div className={styles.technicalMetricsHeader}>Production Metrics</div>
              <div className={styles.technicalMetricsGrid}>
                {project.technicalMetrics.map((stat, idx) => (
                  <div key={idx} className={styles.technicalMetricCard}>
                    <span className={styles.technicalMetricLabel}>{stat.label}</span>
                    <span className={styles.technicalMetricVal}>{stat.value}</span>
                  </div>
                ))}
              </div>
              {/* Production Readiness checklist */}
              <div className={styles.readinessHeader}>Production Readiness Checklist</div>
              <div className={styles.readinessGrid}>
                {project.productionReadiness.map((item, idx) => (
                  <span key={idx} className={styles.readinessItem}>
                    🟢 {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className={styles.imageTabContentCol}>
              <div
                className={styles.screenshotViewportWrap}
                onClick={() => setZoomImageSrc("/n8n-workflow.png")}
                style={{ cursor: "zoom-in" }}
              >
                <img
                  src="/n8n-workflow.png"
                  alt="System Architecture Diagram"
                  className={styles.largeViewportImg}
                />
                <span className={styles.inspectOverlayBadge}>🔍 Click to inspect</span>
              </div>
              <div className={styles.architectureFlowSequence}>
                {project.title === "AI SEO Content Engine" ? (
                  <>
                    <span className={styles.archSequenceNode}>Research</span>
                    <span className={styles.archSequenceArrow}>→</span>
                    <span className={styles.archSequenceNode}>Qualification</span>
                    <span className={styles.archSequenceArrow}>→</span>
                    <span className={styles.archSequenceNode}>Writing</span>
                    <span className={styles.archSequenceArrow}>→</span>
                    <span className={styles.archSequenceNode}>Publishing</span>
                  </>
                ) : (
                  project.flowNodes.map((node, nIdx) => (
                    <React.Fragment key={nIdx}>
                      <span className={styles.archSequenceNode}>{node}</span>
                      {nIdx < project.flowNodes.length - 1 && (
                        <span className={styles.archSequenceArrow}>→</span>
                      )}
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "blueprint" && (
            <div className={styles.imageTabContent}>
              <div
                className={styles.screenshotViewportWrap}
                onClick={() => setZoomImageSrc("/n8n-workflow.png")}
                style={{ cursor: "zoom-in" }}
              >
                {/* Real n8n popup badge */}
                <div className={styles.blueprintBadge}>
                  <span>{project.n8nBadge.nodes}</span>
                  <span>|</span>
                  <span>{project.n8nBadge.integrations.replace("Integrations", "").trim()} APIs</span>
                  <span>|</span>
                  <span>n8n Production</span>
                </div>
                <img
                  src="/n8n-workflow.png"
                  alt="Actual n8n Workflow Screenshot Blueprint"
                  className={styles.largeViewportImg}
                />
                <span className={styles.inspectOverlayBadge}>🔍 Click to inspect</span>
              </div>
            </div>
          )}
        </div>

        {/* Description & Tags */}
        <div className={styles.cardBody}>
          <div className={styles.tagWrapper}>
            {project.tags.map((tag, tIdx) => (
              <span key={tIdx} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>

          <p className={styles.cardText} style={{ fontWeight: 600 }}>
            {activeTab === "dashboard" && project.description}
            {activeTab === "case_study" && (project.title.includes("SEO") ? "Case Study analysis covering business problem, solution, and impact." : "Case study details highlighting business value.")}
            {activeTab === "architecture" && "System architecture behind the automation engine."}
            {activeTab === "blueprint" && (
              project.title.includes("SEO") ? "Production SEO automation pipeline." :
              project.title.includes("RAG") ? "Production knowledge retrieval system." :
              project.title.includes("Calling") || project.title.includes("Voice") ? "Real-time conversational AI platform." :
              "Business process automation ecosystem."
            )}
            {activeTab === "terminal" && "Live execution simulation of the production pipeline."}
            {activeTab === "stats" && "Technical metrics and production readiness."}
          </p>
        </div>

        {/* Footer Action Area */}
        <div className={styles.cardActionFooter}>
          <button
            className={styles.primaryActionBtn}
            style={{ width: "100%" }}
            onClick={() => onInspect(project.title)}
          >
            {project.linkText} <span className={styles.btnArrow}>→</span>
          </button>
        </div>

        {/* Full-screen Lightbox Zoom Modal */}
        {zoomImageSrc && (
          <div className={styles.lightboxOverlay} onClick={() => { setZoomImageSrc(null); setZoomScale(1); }}>
            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.lightboxControls}>
                <button className={styles.lightboxControlBtn} onClick={() => setZoomScale(prev => Math.min(prev + 0.25, 3))}>Zoom +</button>
                <button className={styles.lightboxControlBtn} onClick={() => setZoomScale(prev => Math.max(prev - 0.25, 0.5))}>Zoom -</button>
                <button className={styles.lightboxControlBtn} onClick={() => setZoomScale(1)}>Reset</button>
                <button className={styles.lightboxControlBtn} onClick={() => {
                  const link = document.createElement('a');
                  link.href = zoomImageSrc;
                  link.download = zoomImageSrc.split('/').pop() || 'download.png';
                  link.click();
                }}>Download</button>
                <button className={styles.lightboxControlBtn} onClick={() => { setZoomImageSrc(null); setZoomScale(1); }}>Close</button>
              </div>
              <img
                src={zoomImageSrc}
                alt="Pipeline Zoomed View"
                className={styles.lightboxImg}
                style={{ transform: `scale(${zoomScale})`, transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
            </div>
          </div>
        )}
      </TiltCard>
    </div>
  );
}
