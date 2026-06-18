"use client";

import React, { useState, useEffect } from "react";
import styles from "./WorkflowModal.module.css";

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
}

type ViewMode = "story" | "pipeline" | "architecture" | "blueprint" | "terminal" | "specs";

export default function WorkflowModal({ isOpen, onClose, projectTitle }: WorkflowModalProps) {
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const [pulseActive, setPulseActive] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("story");
  const [zoomImageSrc, setZoomImageSrc] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const terminalContainerRef = React.useRef<HTMLDivElement>(null);

  const views: ViewMode[] = ["story", "pipeline", "architecture", "blueprint", "terminal", "specs"];
  const currentIdx = views.indexOf(viewMode);

  const handleNext = () => {
    if (currentIdx < views.length - 1) {
      setViewMode(views[currentIdx + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setViewMode(views[currentIdx - 1]);
    }
  };

  const getTerminalScript = () => {
    if (projectTitle.includes("SEO")) {
      return [
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
      ];
    }
    if (projectTitle.includes("RAG")) {
      return [
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
      ];
    }
    if (projectTitle.includes("Calling") || projectTitle.includes("Voice")) {
      return [
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
      ];
    }
    return [
      { text: "$ mesh-status --verbose", delay: 400 },
      { text: "Checking auth...", delay: 500 },
      { text: "✓ OAuth2 connection tokens verified", delay: 300 },
      { text: "Testing router...", delay: 600 },
      { text: "✓ Webhook router pool online", delay: 400 },
      { text: "Syncing DB...", delay: 600 },
      { text: "✓ Synced Stripe with HubSpot CRM", delay: 300 },
      { text: "Mesh healthy. (Uptime: 99.9%)", delay: 300 }
    ];
  };

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (zoomImageSrc) {
          setZoomImageSrc(null);
          setZoomScale(1);
          setPanOffset({ x: 0, y: 0 });
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, zoomImageSrc, onClose]);

  const openZoom = (src: string) => {
    setZoomImageSrc(src);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const closeZoom = () => {
    setZoomImageSrc(null);
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setViewMode("story");
      setPulseActive(true);
      const interval = setInterval(() => {
        setActiveStage((prev) => {
          if (prev === null) return 1;
          const maxStages = projectTitle.includes("SEO") ? 6 : 5;
          if (prev >= maxStages) return 1;
          return prev + 1;
        });
      }, 3000);
      return () => {
        clearInterval(interval);
        document.body.style.overflow = "unset";
      };
    } else {
      document.body.style.overflow = "unset";
      setActiveStage(null);
    }
  }, [isOpen, projectTitle]);

  // Live continuous terminal simulation loop inside modal
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentLogIndex = 0;
    let isRunning = true;
    const script = getTerminalScript();

    const runNextStep = () => {
      if (!isRunning) return;
      if (currentLogIndex < script.length) {
        const step = script[currentLogIndex];
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

    if (viewMode === "terminal" && isOpen) {
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
  }, [viewMode, isOpen, projectTitle]);

  // Scroll terminal logs to bottom inside modal
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleArea}>
            <span className={styles.headerBadge}>
              {projectTitle.includes("Calling") ? "🏠 GoHighLevel Snapshot" : "⚡ n8n Pipeline"}
            </span>
            <h3 className={styles.title}>{projectTitle}</h3>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.modeToggleGroup}>
              <button
                className={`${styles.modeToggleBtn} ${viewMode === "story" ? styles.modeToggleActive : ""}`}
                onClick={() => setViewMode("story")}
              >
                ● 1. Problem
              </button>
              <button
                className={`${styles.modeToggleBtn} ${viewMode === "pipeline" ? styles.modeToggleActive : ""}`}
                onClick={() => setViewMode("pipeline")}
              >
                ● 2. Pipeline
              </button>
              <button
                className={`${styles.modeToggleBtn} ${viewMode === "architecture" ? styles.modeToggleActive : ""}`}
                onClick={() => setViewMode("architecture")}
              >
                ● 3. Architecture
              </button>
              <button
                className={`${styles.modeToggleBtn} ${viewMode === "blueprint" ? styles.modeToggleActive : ""}`}
                onClick={() => setViewMode("blueprint")}
              >
                ● 4. Blueprint
              </button>
              <button
                className={`${styles.modeToggleBtn} ${viewMode === "terminal" ? styles.modeToggleActive : ""}`}
                onClick={() => setViewMode("terminal")}
              >
                ● 5. Live Simulation
              </button>
              <button
                className={`${styles.modeToggleBtn} ${viewMode === "specs" ? styles.modeToggleActive : ""}`}
                onClick={() => setViewMode("specs")}
              >
                ● 6. Specs
              </button>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>
        </div>

        {/* Canvas Area with dotted background */}
        <div className={styles.canvas}>
          <div className={styles.gridDots}></div>

          {viewMode === "story" && (
            <div className={styles.caseStudyContainer}>
              <div className={styles.caseStudyHeader}>
                <h4 className={styles.caseStudyTitle}>Project Objective & Business Alignment</h4>
                <p className={styles.caseStudySubtitle}>A detailed summary of the operational problem, core automation solution, and immediate business values.</p>
              </div>
              <div className={styles.caseStudyGrid}>
                {projectTitle.includes("Calling") ? (
                  <>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>🎯</div>
                      <h5 className={styles.caseStudySectionTitle}>Business Problem</h5>
                      <p className={styles.caseStudyText}>
                        Lead response times dictate client acquisition success. Inbound leads left uncontacted for more than 5 minutes drop in conversion by 80%. Hiring 24/7 manual dialers is costly and introduces human scheduling errors.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>⚡</div>
                      <h5 className={styles.caseStudySectionTitle}>System Solution</h5>
                      <p className={styles.caseStudyText}>
                        Deploy a voice qualification funnel linking Twilio call webhooks with a real-time Vocode WebRTC speech agent. CloseBot AI intent classification qualifies motivation level and syncs slot bookings straight to GoHighLevel CRM.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>📈</div>
                      <h5 className={styles.caseStudySectionTitle}>Key Outcomes</h5>
                      <p className={styles.caseStudyText}>
                        Secures a verified 42% slot booking rate, qualification logic operates 24/7/365 without manual oversight, and response latency is reduced to sub-200ms WebRTC voice frames.
                      </p>
                    </div>
                  </>
                ) : projectTitle.includes("Mesh") ? (
                  <>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>🎯</div>
                      <h5 className={styles.caseStudySectionTitle}>Business Problem</h5>
                      <p className={styles.caseStudyText}>
                        Enterprise administrative staff spend excessive manual hours copying database rows, verifying Stripe billing invoices, dispatching customer updates, and syncing Hubspot contacts, which introduces transcription discrepancies.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>⚡</div>
                      <h5 className={styles.caseStudySectionTitle}>System Solution</h5>
                      <p className={styles.caseStudyText}>
                        Build a secure event mesh connecting Stripe checkout webhooks with custom n8n router nodes. This handles HubSpot database reconciliation and team Slack notification dispatches instantly using OAuth2 tokens.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>📈</div>
                      <h5 className={styles.caseStudySectionTitle}>Key Outcomes</h5>
                      <p className={styles.caseStudyText}>
                        Saves over 120+ administration hours monthly, maintains a 99.9% uptime SLA, and completely eliminates sync failures between billing systems and contact record columns.
                      </p>
                    </div>
                  </>
                ) : projectTitle.includes("RAG") ? (
                  <>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>🎯</div>
                      <h5 className={styles.caseStudySectionTitle}>Business Problem</h5>
                      <p className={styles.caseStudyText}>
                        Accessing context across internal PDFs, spreadsheets, and databases is slow. Operators search directories manually, which increases support times and leads to outdated document references.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>⚡</div>
                      <h5 className={styles.caseStudySectionTitle}>System Solution</h5>
                      <p className={styles.caseStudyText}>
                        Create an ingestion pipeline chunking documents with Jina AI embeddings, indexing vectors inside Qdrant, and querying semantic answers through a production-ready Next.js search layout.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>📈</div>
                      <h5 className={styles.caseStudySectionTitle}>Key Outcomes</h5>
                      <p className={styles.caseStudyText}>
                        Enables semantic query retrieval under 80ms, indexes 10,000+ knowledge files, and outputs contextually accurate answers with verified 99.2% recall rates.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>🎯</div>
                      <h5 className={styles.caseStudySectionTitle}>Business Problem</h5>
                      <p className={styles.caseStudyText}>
                        Consistent publishing is difficult when trend research, outlining, long-form drafting, and document formatting consume hours of writing time per article, making scale impossible.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>⚡</div>
                      <h5 className={styles.caseStudySectionTitle}>System Solution</h5>
                      <p className={styles.caseStudyText}>
                        Implement an agentic pipeline monitoring search trends, qualification web search targets, outline assembly, long-form drafting via GPT-5, and direct Google Drive file export.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>📈</div>
                      <h5 className={styles.caseStudySectionTitle}>Key Outcomes</h5>
                      <p className={styles.caseStudyText}>
                        Speeds up publishing workflows by 10x, saves 30+ drafting hours weekly, and automatically populates Google Drive with humanized drafts.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {viewMode === "pipeline" && (
            <div className={styles.workflowGrid}>
              {projectTitle.includes("SEO") ? (
                <>
                  <div className={`${styles.stageGroup} ${styles.stage1} ${activeStage === 1 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>1. Topic Research</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="trigger">
                        <div className={styles.nodeIcon}>⚡</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Run Scraper</div>
                          <div className={styles.nodeDesc}>Trigger</div>
                        </div>
                      </div>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🤖</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Web Search</div>
                          <div className={styles.nodeDesc}>GPT-5</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage2} ${activeStage === 2 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>2. Topic Filtering</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="filter">
                        <div className={styles.nodeIcon}>🔍</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Relevance Filter</div>
                          <div className={styles.nodeDesc}>Intent Match</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage3} ${activeStage === 3 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>3. Deduplication</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="merge">
                        <div className={styles.nodeIcon}>🔗</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Skip Duplicates</div>
                          <div className={styles.nodeDesc}>Sheet Scan</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage4} ${activeStage === 4 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>4. AI Writing</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>📝</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Outline & Copy</div>
                          <div className={styles.nodeDesc}>4000 Words</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage5} ${activeStage === 5 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>5. Humanization</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🤖</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Tone Modulator</div>
                          <div className={styles.nodeDesc}>Human Tone</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage6} ${activeStage === 6 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>6. Workspace Publish</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="doc">
                        <div className={styles.nodeIcon}>📝</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Google Workspace</div>
                          <div className={styles.nodeDesc}>Doc & Drive</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : projectTitle.includes("RAG") ? (
                <>
                  <div className={`${styles.stageGroup} ${styles.stage1} ${activeStage === 1 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>1. Ingestion</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="trigger">
                        <div className={styles.nodeIcon}>📂</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Doc Ingestion</div>
                          <div className={styles.nodeDesc}>4 Sources</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage2} ${activeStage === 2 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>2. Chunking</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="code">
                        <div className={styles.nodeIcon}>{"{}"}</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Node Parser</div>
                          <div className={styles.nodeDesc}>Recursive Text</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage3} ${activeStage === 3 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>3. Embedding</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🧠</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Vector Creation</div>
                          <div className={styles.nodeDesc}>Jina Embeddings</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage4} ${activeStage === 4 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>4. Qdrant Index</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="merge">
                        <div className={styles.nodeIcon}>🗄️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Vector Database</div>
                          <div className={styles.nodeDesc}>Qdrant Cloud</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage5} ${activeStage === 5 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>5. Search API</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🔍</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Semantic Query</div>
                          <div className={styles.nodeDesc}>Next.js UI</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : projectTitle.includes("Calling") ? (
                <>
                  <div className={`${styles.stageGroup} ${styles.stage1} ${activeStage === 1 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>1. Inbound Trigger</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="trigger">
                        <div className={styles.nodeIcon}>📞</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Lead Inbound</div>
                          <div className={styles.nodeDesc}>Twilio Voice</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage2} ${activeStage === 2 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>2. Dispatcher</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="merge">
                        <div className={styles.nodeIcon}>🔗</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Call Handshake</div>
                          <div className={styles.nodeDesc}>Webhook Router</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage3} ${activeStage === 3 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>3. Vocode Audio</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🗣️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>WebRTC Stream</div>
                          <div className={styles.nodeDesc}>Vocode Voice</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage4} ${activeStage === 4 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>4. Intent Parser</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🤖</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Intent Evaluate</div>
                          <div className={styles.nodeDesc}>CloseBot Parser</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage5} ${activeStage === 5 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>5. GHL Calendar</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="sheet">
                        <div className={styles.nodeIcon}>📅</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Slot Booking</div>
                          <div className={styles.nodeDesc}>CRM Sync</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={`${styles.stageGroup} ${styles.stage1} ${activeStage === 1 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>1. Checkout Hook</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="trigger">
                        <div className={styles.nodeIcon}>💳</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Stripe Purchase</div>
                          <div className={styles.nodeDesc}>Stripe Hook</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage2} ${activeStage === 2 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>2. Event Router</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="merge">
                        <div className={styles.nodeIcon}>🔗</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>n8n Route Logic</div>
                          <div className={styles.nodeDesc}>OAuth Router</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage3} ${activeStage === 3 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>3. HubSpot CRM</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="sheet">
                        <div className={styles.nodeIcon}>⚙️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Contact Sync</div>
                          <div className={styles.nodeDesc}>HubSpot CRM</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage4} ${activeStage === 4 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>4. Ops Dashboard</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="code">
                        <div className={styles.nodeIcon}>{"{}"}</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Dashboard Sync</div>
                          <div className={styles.nodeDesc}>Operations API</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage5} ${activeStage === 5 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>5. Team Alert</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="doc">
                        <div className={styles.nodeIcon}>🔔</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Slack Notify</div>
                          <div className={styles.nodeDesc}>Event Dispatched</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {viewMode === "architecture" && (
            <div className={styles.macWindowWrapperCol}>
              <div
                className={styles.macWindowWrapper}
                onClick={() => openZoom("/n8n-workflow.png")}
              >
                <div className={styles.macTitlebar}>
                  <div className={styles.macDotRed}></div>
                  <div className={styles.macDotYellow}></div>
                  <div className={styles.macDotGreen}></div>
                  <span className={styles.macTitle}>Pipeline Architecture</span>
                  <span className={styles.inspectBadge}>🔍 Click to inspect</span>
                </div>
                <div className={styles.macContent}>
                  <img
                    src="/n8n-workflow.png"
                    alt="System Architecture Diagram"
                    className={styles.architectureImg}
                  />
                </div>
              </div>
              <div className={styles.modalArchitectureFlowSequence}>
                {projectTitle.includes("SEO") ? (
                  <>
                    <span className={styles.modalArchSequenceNode}>Research</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>Qualification</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>Writing</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>Publishing</span>
                  </>
                ) : projectTitle.includes("RAG") ? (
                  <>
                    <span className={styles.modalArchSequenceNode}>Ingestion</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>Chunking</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>Embedding</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>Qdrant Vector DB</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>Search UI</span>
                  </>
                ) : projectTitle.includes("Calling") ? (
                  <>
                    <span className={styles.modalArchSequenceNode}>Twilio Inbound</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>Vocode voice</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>CloseBot AI</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>GoHighLevel Booking</span>
                  </>
                ) : (
                  <>
                    <span className={styles.modalArchSequenceNode}>Checkout Webhook</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>n8n Route Node</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>HubSpot CRM</span>
                    <span className={styles.modalArchSequenceArrow}>→</span>
                    <span className={styles.modalArchSequenceNode}>Slack Alerts</span>
                  </>
                )}
              </div>
            </div>
          )}

          {viewMode === "blueprint" && (
            <div className={styles.screenshotView}>
              <div
                className={styles.blueprintImageWrapper}
                onClick={() => openZoom("/n8n-workflow.png")}
              >
                <div className={styles.blueprintBadgeOverlay}>n8n Production Workflow Blueprint</div>
                <img
                  src="/n8n-workflow.png"
                  alt="Actual n8n Workflow Screenshot Blueprint"
                  className={styles.screenshotImg}
                />
                <span className={styles.inspectBadgeOverlay}>🔍 Click to inspect</span>
              </div>
            </div>
          )}

          {viewMode === "terminal" && (
            <div className={styles.terminalView}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalDotRed}></div>
                <div className={styles.terminalDotYellow}></div>
                <div className={styles.terminalDotGreen}></div>
                <span className={styles.terminalTitle}>Pipeline Live Simulator</span>
              </div>
              <div ref={terminalContainerRef} className={styles.terminalBody}>
                {terminalLogs.map((log, index) => (
                  <div key={index} className={styles.terminalLine}>
                    {log}
                  </div>
                ))}
                <div className={styles.terminalCursor}>_</div>
              </div>
            </div>
          )}

          {viewMode === "specs" && (
            <div className={styles.specsTabContent}>
              <div className={styles.specsHeader}>
                <h4 className={styles.specsTitle}>Technical Validation & Verified Outcomes</h4>
                <p className={styles.specsSubtitle}>Production readiness metrics, business outcomes, and core APIs utilized.</p>
              </div>
              <div className={styles.specsGrid}>
                <div className={styles.specsCard}>
                  <h5 className={styles.specsSectionTitle}>Verified Business Outcomes</h5>
                  <ul className={styles.specsList}>
                    {projectTitle.includes("SEO") ? (
                      <>
                        <li>📈 **30+ Hours Saved**: Displaces weekly manual trend mapping and copywriting.</li>
                        <li>📝 **4,000-Word Generation**: Complete long-form editorial drafts published automatically.</li>
                        <li>🛡️ **Review Gate**: Safe dual-mode AI + Human approval path.</li>
                        <li>☁️ **Google Workspace Sync**: Instantly saves docs to Drive folders.</li>
                      </>
                    ) : projectTitle.includes("RAG") ? (
                      <>
                        <li>📚 **10,000+ Docs Indexed**: Ingests files recursively from 4 channels.</li>
                        <li>⚡ **Sub-80ms Latency**: Real-time vector retrieval search queries inside Qdrant.</li>
                        <li>🧠 **Jina AI Context**: Accurate parsing of dense, structural knowledge files.</li>
                        <li>🛡️ **Production Clustering**: Scalable database schema with semantic guardrails.</li>
                      </>
                    ) : projectTitle.includes("Calling") ? (
                      <>
                        <li>📞 **5,000+ Calls Run**: Qualifications executed 24/7 without manual operator needs.</li>
                        <li>📅 **42% Booking Rate**: Converts intentions straight into calendar slots.</li>
                        <li>🗣️ **Vocode WebRTC**: Inbound response latency under 200ms.</li>
                        <li>🏠 **CRM Integration**: Automatic syncing of transcription logs back to GHL.</li>
                      </>
                    ) : (
                      <>
                        <li>⚙️ **50,000+ Runs/mo**: Continuous event dispatching for operational systems.</li>
                        <li>⏳ **120+ Hours Saved**: Seamless data reconciliation between Stripe and CRM records.</li>
                        <li>🔗 **15+ Apps Connected**: OAuth2 authorization mesh unifying SaaS networks.</li>
                        <li>🛡️ **99.9% Uptime**: Fail-safe routing and retry logic.</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className={styles.specsCard}>
                  <h5 className={styles.specsSectionTitle}>Tech Stack & APIs</h5>
                  <div className={styles.techPillsContainer}>
                    {projectTitle.includes("SEO") && ["n8n", "GPT-5", "Google Sheets", "Google Docs", "Google Drive", "Deep Research API", "OAuth2", "REST API"].map(p => (
                      <span key={p} className={styles.techPill}>{p}</span>
                    ))}
                    {projectTitle.includes("RAG") && ["n8n", "Jina Embeddings", "Qdrant Vector DB", "Next.js", "Docker", "Node Parser API", "Semantic Guardrails"].map(p => (
                      <span key={p} className={styles.techPill}>{p}</span>
                    ))}
                    {projectTitle.includes("Calling") && ["Twilio Voice", "Vocode Audio", "CloseBot AI", "GHL CRM API", "Node.js", "WebRTC Stream", "Google Calendar"].map(p => (
                      <span key={p} className={styles.techPill}>{p}</span>
                    ))}
                    {!projectTitle.includes("SEO") && !projectTitle.includes("RAG") && !projectTitle.includes("Calling") && ["n8n Mesh", "HubSpot CRM", "Stripe API", "Slack Webhooks", "OAuth2", "Make.com Router", "Fail-safe retries"].map(p => (
                      <span key={p} className={styles.techPill}>{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SVG Connection Pulses */}
          {pulseActive && viewMode === "pipeline" && (
            <div className={styles.svgOverlay}>
              <div className={`${styles.executionPulse} ${styles[`pulse${activeStage}`]}`}></div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={styles.footer}>
          <div className={styles.footerNote}>
            <span>🟢 Status: Active Simulation</span>
            <span className={styles.divider}>|</span>
            <span>Running stage {activeStage || 1} of {projectTitle.includes("SEO") ? 6 : 5}</span>
          </div>
          <div className={styles.footerActions}>
            <button
              className={styles.prevStepBtn}
              onClick={handlePrev}
              disabled={currentIdx === 0}
            >
              ← Previous
            </button>
            <span className={styles.stepIndicator}>
              Step {currentIdx + 1} of 6
            </span>
            <button
              className={styles.nextStepBtn}
              onClick={handleNext}
              disabled={currentIdx === views.length - 1}
            >
              Next →
            </button>
            <span className={styles.divider}>|</span>
            <button className={styles.closeActionBtn} onClick={onClose}>
              Close Walkthrough
            </button>
          </div>
        </div>

        {/* Full-screen Lightbox Zoom Modal */}
        {zoomImageSrc && (
          <div
            className={styles.lightboxOverlay}
            onClick={closeZoom}
          >
            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.lightboxControls}>
                <button className={styles.lightboxControlBtn} onClick={() => setZoomScale(prev => Math.min(prev + 0.25, 3))}>Zoom +</button>
                <button className={styles.lightboxControlBtn} onClick={() => setZoomScale(prev => Math.max(prev - 0.25, 0.5))}>Zoom -</button>
                <button className={styles.lightboxControlBtn} onClick={handleDoubleClick}>Reset</button>
                <button className={styles.lightboxControlBtn} onClick={() => {
                  const link = document.createElement('a');
                  link.href = zoomImageSrc;
                  link.download = zoomImageSrc.split('/').pop() || 'download.png';
                  link.click();
                }}>Download</button>
                <button className={styles.lightboxControlBtn} onClick={closeZoom}>Close</button>
              </div>
              <img
                src={zoomImageSrc}
                alt="Pipeline Zoomed View"
                className={styles.lightboxImg}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleClick}
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale})`,
                  transition: isDragging ? "none" : "transform 0.15s ease-out",
                  cursor: isDragging ? "grabbing" : "grab"
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
