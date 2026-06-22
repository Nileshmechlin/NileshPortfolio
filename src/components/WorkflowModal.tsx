"use client";

import React, { useState, useEffect } from "react";
import styles from "./WorkflowModal.module.css";

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectTitle: string;
}

type ViewMode = "story" | "pipeline" | "architecture" | "workflow" | "terminal" | "specs" | "website";

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

  const views: ViewMode[] = projectTitle.includes("Thermo")
    ? ["story", "pipeline", "architecture", "workflow", "terminal", "specs"]
    : projectTitle.includes("Tapsy")
    ? ["story", "pipeline", "architecture", "website", "terminal", "specs"]
    : ["story", "pipeline", "architecture", "terminal", "specs"];
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
    if (projectTitle.includes("Autonomous")) {
      return [
        { text: "$ voice-platform --initiate-call=\"+1234567890\" --orchestrator=\"custom-fastapi\"", delay: 500 },
        { text: "Dialing number via Twilio telephony trunk...", delay: 600 },
        { text: "✓ Twilio connection established. Spawning real-time voice stream...", delay: 350 },
        { text: "Initializing custom audio state engine in FastAPI backend...", delay: 550 },
        { text: "✓ Speech-to-Text (STT) worker online", delay: 300 },
        { text: "User input: 'Can I book a technician for tomorrow at 2 PM?'", delay: 800 },
        { text: "Querying Groq LLM for low-latency custom conversational response...", delay: 400 },
        { text: "✓ Groq reasoning complete: 'Let me check availability...' (115ms latency)", delay: 300 },
        { text: "FastAPI scheduling hook verifying DB calendar availability...", delay: 500 },
        { text: "✓ Slot confirmed. Logging interaction to Supabase DB...", delay: 300 },
        { text: "Pushing event update to Next.js dashboard UI via websockets...", delay: 450 },
        { text: "✓ Client UI synced. Triggering automated follow-up SMS...", delay: 600 },
        { text: "✓ Call completed successfully.", delay: 300 }
      ];
    }
    if (projectTitle.includes("Bear")) {
      return [
        { text: "$ n8n-trigger --webhook=\"query\" --data=\"key takeaways from script\"", delay: 400 },
        { text: "Generating query embedding via Jina AI...", delay: 450 },
        { text: "✓ Embeddings vector generated (38ms)", delay: 300 },
        { text: "Searching Qdrant index (10,000+ files)...", delay: 550 },
        { text: "✓ Retrieved 15 raw chunks (42ms)", delay: 300 },
        { text: "Applying temporal-aware filtering logic...", delay: 500 },
        { text: "✓ Identified 6 timeline-relevant chunks (18ms)", delay: 300 },
        { text: "Structuring Groq LLM context window...", delay: 400 },
        { text: "Requesting answer from Groq API...", delay: 650 },
        { text: "✓ Groq response ready: 'Here are the key takeaways...'", delay: 350 },
        { text: "Returning HTTP response to Next.js client.", delay: 300 }
      ];
    }
    if (projectTitle.includes("Thermo")) {
      return [
        { text: "$ n8n-trigger --schedule=\"15m\"", delay: 400 },
        { text: "Reading new leads from Google Sheets...", delay: 450 },
        { text: "✓ 3 new leads detected", delay: 300 },
        { text: "Checking DNC list...", delay: 500 },
        { text: "✓ Lead \"John Smith\" eligible for call", delay: 300 },
        { text: "Initiating Retell AI outbound voice call...", delay: 600 },
        { text: "✓ Call completed (Duration: 2m 14s)", delay: 350 },
        { text: "Webhook received. Fetching transcript...", delay: 450 },
        { text: "Analyzing dialogue with OpenAI GPT...", delay: 500 },
        { text: "✓ Structured JSON output generated", delay: 300 },
        { text: "Updating database: AC Repair qualified (Score: 85)", delay: 400 },
        { text: "Sending follow-up SMS...", delay: 350 },
        { text: "✓ Done", delay: 300 }
      ];
    }
    if (projectTitle.includes("Tapsy")) {
      return [
        { text: "$ tapsy-transcode --file=\"review_SarahK_coffee.mov\"", delay: 400 },
        { text: "Compressing video to H.264 standard format...", delay: 450 },
        { text: "✓ Transcoded to 4.2MB web-optimized stream (310ms)", delay: 350 },
        { text: "Saving file to cloud storage...", delay: 600 },
        { text: "✓ Storage upload confirmed", delay: 300 },
        { text: "Triggering social feed dispatch API...", delay: 500 },
        { text: "✓ Notifying 4,200 followers via Firebase FCM", delay: 400 },
        { text: "Syncing business popular time graphs in Redis...", delay: 550 },
        { text: "✓ Cache updated successfully (8ms)", delay: 300 },
        { text: "Transaction completed successfully.", delay: 300 }
      ];
    }
    if (projectTitle.includes("Dental")) {
      return [
        { text: "$ dental-ai --new-lead=\"patient_id_1234\" --source=\"google-ads\"", delay: 400 },
        { text: "Lead captured in GoHighLevel CRM. Syncing to Supabase...", delay: 500 },
        { text: "\u2713 Supabase record created (patient_id: 1234)", delay: 300 },
        { text: "Triggering Vapi AI outbound call via Twilio...", delay: 600 },
        { text: "\u2713 Call connected. AI voice agent active...", delay: 350 },
        { text: "AI: 'Hi! Calling about your dental inquiry. What treatment are you interested in?'", delay: 800 },
        { text: "Patient: 'I need a dental implant consultation.'", delay: 700 },
        { text: "AI qualifying: treatment interest, availability, budget, buying intent...", delay: 500 },
        { text: "\u2713 Call completed (Duration: 3m 42s). Extracting structured data...", delay: 400 },
        { text: "\u2713 JSON: intent=implant, score=87, stage=HOT, budget=$3000-5000", delay: 350 },
        { text: "Updating GHL stage \u2192 HOT LEAD. Triggering follow-up sequence...", delay: 500 },
        { text: "\u2713 SMS sent. Appointment booked. Database updated.", delay: 300 }
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

  const getArchitectureImage = () => {
    if (projectTitle.includes("Tapsy")) {
      return "/Tapsy.png";
    }
    if (projectTitle.includes("Bear")) {
      return "/bear-architecture.jpg";
    }
    if (projectTitle.includes("Thermo")) {
      return "/thermoconnect-architecture.jpg";
    }
    if (projectTitle.includes("Autonomous")) {
      return "/autonomous-voice-architecture.png";
    }
    if (projectTitle.includes("Dental")) {
      return "/Dental AI Revenue Engine.png";
    }
    return "/n8n-workflow.png";
  };

  const getStageCount = () => {
    if (projectTitle.includes("Bear")) return 8;
    if (projectTitle.includes("SEO")) return 6;
    if (projectTitle.includes("Thermo")) return 10;
    if (projectTitle.includes("Autonomous")) return 8;
    if (projectTitle.includes("Dental")) return 9;
    return 5;
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
          const maxStages = getStageCount();
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
              {projectTitle.includes("Calling") ? "🏠 GoHighLevel Snapshot" : projectTitle.includes("Tapsy") ? "📦 System Architecture" : "⚡ n8n Pipeline"}
            </span>
            <h3 className={styles.title}>{projectTitle}</h3>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.modeToggleGroup}>
              {views.map((view) => {
                const getViewLabel = (v: ViewMode) => {
                  switch (v) {
                    case "story": return "● 1. Problem";
                    case "pipeline": return "● 2. Pipeline";
                    case "architecture": return "● 3. Architecture";
                    case "website": return "● 4. Website";
                    case "workflow": return "● 4. n8n Workflow";
                    case "terminal": return projectTitle.includes("Thermo") ? "● 5. Live Simulation" : projectTitle.includes("Tapsy") ? "● 5. Live Simulation" : "● 4. Live Simulation";
                    case "specs": return projectTitle.includes("Thermo") || projectTitle.includes("Tapsy") ? "● 6. Specs" : "● 5. Specs";
                    default: return "";
                  }
                };
                return (
                  <button
                    key={view}
                    className={`${styles.modeToggleBtn} ${viewMode === view ? styles.modeToggleActive : ""}`}
                    onClick={() => setViewMode(view)}
                  >
                    {getViewLabel(view)}
                  </button>
                );
              })}
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
                {projectTitle.includes("Autonomous") ? (
                  <>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>🎯</div>
                      <h5 className={styles.caseStudySectionTitle}>Business Problem</h5>
                      <p className={styles.caseStudyText}>
                        Businesses lose customer conversion opportunities due to slow manual response times, high overhead for 24/7 manual dialers, and lack of automated call logging.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>⚡</div>
                      <h5 className={styles.caseStudySectionTitle}>System Solution</h5>
                      <p className={styles.caseStudyText}>
                        Engineered a custom conversational routing and orchestration platform using FastAPI websockets, Twilio media streams, and Groq reasoning pipelines.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>📈</div>
                      <h5 className={styles.caseStudySectionTitle}>Key Outcomes</h5>
                      <p className={styles.caseStudyText}>
                        Achieves 100% data ownership (via Supabase), custom state machines control conversation orchestration, and Groq reasoning outputs sub-150ms speech response frames.
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
                ) : projectTitle.includes("Thermo") ? (
                  <>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>🎯</div>
                      <h5 className={styles.caseStudySectionTitle}>Business Problem</h5>
                      <p className={styles.caseStudyText}>
                        HVAC companies lose hot leads due to slow manual response times, high labor calling overhead, and failed follow-up coordination.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>⚡</div>
                      <h5 className={styles.caseStudySectionTitle}>System Solution</h5>
                      <p className={styles.caseStudyText}>
                        An autonomous Retell AI outbound calling agent integrated with n8n. Reads fresh leads, validates fields, dials/qualifies them over phone streams, extracts structured specs with OpenAI, and logs details in Google Sheets.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>📈</div>
                      <h5 className={styles.caseStudySectionTitle}>Key Outcomes</h5>
                      <p className={styles.caseStudyText}>
                        Saves 100+ hours of calling labor monthly, achieves 30-50% higher booking conversions, operates 24/7/365, and ensures zero missed customer requests.
                      </p>
                    </div>
                  </>
                ) : projectTitle.includes("Bear") ? (
                  <>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>🎯</div>
                      <h5 className={styles.caseStudySectionTitle}>Business Problem</h5>
                      <p className={styles.caseStudyText}>
                        Transforming large collections of unstructured scripts, transcripts, and documents into timeline-aware natural language answers was complex, inaccurate, and slow.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>⚡</div>
                      <h5 className={styles.caseStudySectionTitle}>System Solution</h5>
                      <p className={styles.caseStudyText}>
                        Built an end-to-end Temporal RAG platform. Ingests docs using Jina AI embeddings into a Qdrant vector database. Leverages n8n workflows for webhook-driven queries, custom temporal logic for timeline filtering, and Groq LLM for real-time answer generation.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>📈</div>
                      <h5 className={styles.caseStudySectionTitle}>Key Outcomes</h5>
                      <p className={styles.caseStudyText}>
                        Ensures context-aware answers with 99.2% accuracy, sub-200ms average response times, indexes 10,000+ files, and operates 24/7/365 with dynamic Vercel scaling.
                      </p>
                    </div>
                  </>
                ) : projectTitle.includes("Tapsy") ? (
                  <>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>🎯</div>
                      <h5 className={styles.caseStudySectionTitle}>Business Problem</h5>
                      <p className={styles.caseStudyText}>
                        Text reviews are unreliable and easily faked — reading "amazing food" or "great service" fails to convey the real atmosphere and vibe of a physical business. Customers need authentic proof before visiting.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>⚡</div>
                      <h5 className={styles.caseStudySectionTitle}>System Solution</h5>
                      <p className={styles.caseStudyText}>
                        Built the complete Flutter app backend: secure 30s video uploads via AWS S3 signed URLs, PostgreSQL + Prisma for data storage, Firebase FCM notifications to followers, Redis caching for popular review insights, and NFC/QR tags mapping to dynamic business profiles.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>📈</div>
                      <h5 className={styles.caseStudySectionTitle}>Key Outcomes</h5>
                      <p className={styles.caseStudyText}>
                        Sub-40ms Fastify API responses, secure AWS S3 video delivery, real-time Firebase FCM push to followers, Redis-cached business insights, and Husky + ESLint pre-commit hooks ensuring zero broken deploys.
                      </p>
                    </div>
                  </>
                ) : projectTitle.includes("Dental") ? (
                  <>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>🎯</div>
                      <h5 className={styles.caseStudySectionTitle}>Business Problem</h5>
                      <p className={styles.caseStudyText}>
                        Dental clinics waste advertising budget because leads from Google and Meta Ads are followed up hours or days later — long after buying intent has cooled. Manual calling teams miss leads, forget follow-ups, and have no structured data on patient interest or budget.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>⚡</div>
                      <h5 className={styles.caseStudySectionTitle}>System Solution</h5>
                      <p className={styles.caseStudyText}>
                        Built a complete patient acquisition engine: Ads → GoHighLevel → Supabase → Vapi AI calls the lead within 2 minutes → qualifies treatment interest, budget, availability, and objections → updates CRM stage → triggers personalized SMS/email/ringless voicemail campaigns → books appointments automatically.
                      </p>
                    </div>
                    <div className={styles.caseStudyCard}>
                      <div className={styles.caseStudyIcon}>📈</div>
                      <h5 className={styles.caseStudySectionTitle}>Key Outcomes</h5>
                      <p className={styles.caseStudyText}>
                        Instant lead response under 2 minutes, 24/7 AI calling agent, 9-field structured qualification output per patient, zero missed lead opportunities, centralized Supabase intelligence database, and end-to-end automated appointment booking with no manual intervention.
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
              ) : projectTitle.includes("Autonomous") ? (
                <>
                  <div className={`${styles.stageGroup} ${styles.stage1} ${activeStage === 1 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>1. Trigger</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="trigger">
                        <div className={styles.nodeIcon}>📞</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Call Event</div>
                          <div className={styles.nodeDesc}>Inbound/Outbound</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage2} ${activeStage === 2 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>2. Telephony</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="merge">
                        <div className={styles.nodeIcon}>🔌</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Twilio stream</div>
                          <div className={styles.nodeDesc}>Call Routing</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage3} ${activeStage === 3 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>3. Orchestrator</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="code">
                        <div className={styles.nodeIcon}>{"{}"}</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>FastAPI Engine</div>
                          <div className={styles.nodeDesc}>State Machine</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage4} ${activeStage === 4 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>4. Reasoning</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🤖</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Groq LLM</div>
                          <div className={styles.nodeDesc}>Low-Latency AI</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage5} ${activeStage === 5 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>5. Voice Processing</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🗣️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>STT / TTS</div>
                          <div className={styles.nodeDesc}>Media Streams</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage6} ${activeStage === 6 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>6. Storage</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="sheet">
                        <div className={styles.nodeIcon}>🗄️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Supabase logs</div>
                          <div className={styles.nodeDesc}>PostgreSQL DB</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage7} ${activeStage === 7 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>7. Dashboard</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="doc">
                        <div className={styles.nodeIcon}>📊</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Next.js UI</div>
                          <div className={styles.nodeDesc}>Live Monitoring</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage8} ${activeStage === 8 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>8. Follow up</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="doc">
                        <div className={styles.nodeIcon}>✉️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Workflow Actions</div>
                          <div className={styles.nodeDesc}>CRM Scheduling</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : projectTitle.includes("Thermo") ? (
                <>
                  <div className={`${styles.stageGroup} ${styles.stage1} ${activeStage === 1 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>1. Trigger</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="trigger">
                        <div className={styles.nodeIcon}>⏰</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Schedule Trigger</div>
                          <div className={styles.nodeDesc}>Runs every 15m</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage2} ${activeStage === 2 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>2. Get Leads</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="sheet">
                        <div className={styles.nodeIcon}>📥</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Read New Leads</div>
                          <div className={styles.nodeDesc}>Sheets / DB</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage3} ${activeStage === 3 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>3. Format Lead</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="code">
                        <div className={styles.nodeIcon}>{"{}"}</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Validate & Structure</div>
                          <div className={styles.nodeDesc}>Lead Data</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage4} ${activeStage === 4 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>4. Check DNC</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="filter">
                        <div className={styles.nodeIcon}>⚙️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Check Do-Not-Call</div>
                          <div className={styles.nodeDesc}>Registry Check</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage5} ${activeStage === 5 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>5. Initiate Call</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="trigger">
                        <div className={styles.nodeIcon}>📞</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Start Retell Call</div>
                          <div className={styles.nodeDesc}>Outbound Dial</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage6} ${activeStage === 6 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>6. AI Talk</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🗣️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Retell AI voice</div>
                          <div className={styles.nodeDesc}>Qualify Lead</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage7} ${activeStage === 7 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>7. Extract Data</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🧠</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Extract Structured</div>
                          <div className={styles.nodeDesc}>OpenAI API</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage8} ${activeStage === 8 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>8. Score Lead</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="code">
                        <div className={styles.nodeIcon}>🎯</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>AI Lead Scoring</div>
                          <div className={styles.nodeDesc}>Evaluate Budget</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage9} ${activeStage === 9 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>9. Update Database</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="sheet">
                        <div className={styles.nodeIcon}>🗄️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Save Structured</div>
                          <div className={styles.nodeDesc}>Sheets / DB</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage10} ${activeStage === 10 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>10. Follow Up</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="doc">
                        <div className={styles.nodeIcon}>✉️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Send Notification</div>
                          <div className={styles.nodeDesc}>SMS / Email</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : projectTitle.includes("Bear") ? (
                <>
                  <div className={`${styles.stageGroup} ${styles.stage1} ${activeStage === 1 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>1. Webhook Trigger</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="trigger">
                        <div className={styles.nodeIcon}>🔌</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>n8n Webhook</div>
                          <div className={styles.nodeDesc}>Incoming Query</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage2} ${activeStage === 2 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>2. Embedding</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🧠</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Jina AI</div>
                          <div className={styles.nodeDesc}>Query Vectors</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage3} ${activeStage === 3 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>3. Search Qdrant</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="code">
                        <div className={styles.nodeIcon}>🗄️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Qdrant Vector</div>
                          <div className={styles.nodeDesc}>Semantic Search</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage4} ${activeStage === 4 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>4. Temporal Logic</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="filter">
                        <div className={styles.nodeIcon}>⏱️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Time Filtering</div>
                          <div className={styles.nodeDesc}>Temporal Engine</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage5} ${activeStage === 5 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>5. Fetch Chunks</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="sheet">
                        <div className={styles.nodeIcon}>📂</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Data Retrieval</div>
                          <div className={styles.nodeDesc}>Timeline Chunks</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage6} ${activeStage === 6 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>6. Build Context</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="merge">
                        <div className={styles.nodeIcon}>⚙️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Context Builder</div>
                          <div className={styles.nodeDesc}>Optimized Window</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage7} ${activeStage === 7 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>7. Ask Groq</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🤖</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Groq Reasoning</div>
                          <div className={styles.nodeDesc}>Answer Generation</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage8} ${activeStage === 8 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>8. Respond</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="doc">
                        <div className={styles.nodeIcon}>💬</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Display Chat</div>
                          <div className={styles.nodeDesc}>Return AI Response</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : projectTitle.includes("Tapsy") ? (
                <>
                  <div className={`${styles.stageGroup} ${styles.stage1} ${activeStage === 1 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>1. Video Record</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="trigger">
                        <div className={styles.nodeIcon}>📹</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Video Upload</div>
                          <div className={styles.nodeDesc}>30s Clip</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage2} ${activeStage === 2 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>2. Transcoding</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="code">
                        <div className={styles.nodeIcon}>⚙️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Node.js Job</div>
                          <div className={styles.nodeDesc}>FFmpeg Compression</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage3} ${activeStage === 3 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>3. Feed Router</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="ai">
                        <div className={styles.nodeIcon}>🗄️</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Redis Cache</div>
                          <div className={styles.nodeDesc}>Followers Dispatch</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage4} ${activeStage === 4 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>4. Analytics</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="sheet">
                        <div className={styles.nodeIcon}>📊</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Prisma DB</div>
                          <div className={styles.nodeDesc}>Views & Ratings</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.stageGroup} ${styles.stage5} ${activeStage === 5 ? styles.stageActive : ""}`}>
                    <div className={styles.stageTitle}>5. NFC/QR Event</div>
                    <div className={styles.nodesRow}>
                      <div className={styles.node} data-type="merge">
                        <div className={styles.nodeIcon}>🔌</div>
                        <div className={styles.nodeContent}>
                          <div className={styles.nodeName}>Profile Matching</div>
                          <div className={styles.nodeDesc}>QR Tag Dispatch</div>
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

          {viewMode === "architecture" && (() => {
            const archImageSrc = getArchitectureImage();
            return (
              <div className={styles.macWindowWrapperCol}>
                <div
                  className={styles.macWindowWrapper}
                  onClick={() => openZoom(archImageSrc)}
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
                      src={archImageSrc}
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
                  ) : projectTitle.includes("Autonomous") ? (
                    <>
                      <span className={styles.modalArchSequenceNode}>Twilio Telephony</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>FastAPI Engine</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Groq LLM</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Supabase DB</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Next.js UI</span>
                    </>
                  ) : projectTitle.includes("Thermo") ? (
                    <>
                      <span className={styles.modalArchSequenceNode}>Lead Intake</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Retell AI Call</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Webhook Dispatch</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>OpenAI Extraction</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Sheets Update</span>
                    </>
                  ) : projectTitle.includes("Bear") ? (
                    <>
                      <span className={styles.modalArchSequenceNode}>User Query</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Jina AI Embedding</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Qdrant Vector DB</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Temporal Filtering</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Groq LLM</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Next.js Chat UI</span>
                    </>
                  ) : projectTitle.includes("Tapsy") ? (
                    <>
                      <span className={styles.modalArchSequenceNode}>Mobile Recording</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Node.js Transcoder</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Redis Feed Router</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Firebase FCM</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>QR Discovery</span>
                    </>
                  ) : projectTitle.includes("Dental") ? (
                    <>
                      <span className={styles.modalArchSequenceNode}>Ads Traffic</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>GHL CRM</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Vapi AI Call</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Qualify Lead</span>
                      <span className={styles.modalArchSequenceArrow}>→</span>
                      <span className={styles.modalArchSequenceNode}>Book Appointment</span>
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
            );
          })()}

          {viewMode === "website" && projectTitle.includes("Tapsy") && (
            <div className={styles.macWindowWrapperCol}>
              <div
                className={styles.macWindowWrapper}
                onClick={() => openZoom("/tapsy-website.png")}
              >
                <div className={styles.macTitlebar}>
                  <div className={styles.macDotRed}></div>
                  <div className={styles.macDotYellow}></div>
                  <div className={styles.macDotGreen}></div>
                  <span className={styles.macTitle}>tapsy.app — Live Product Website</span>
                  <span className={styles.inspectBadge}>🔍 Click to inspect</span>
                </div>
                <img
                  src="/tapsy-website.png"
                  alt="Tapsy Website"
                  style={{ width: "100%", display: "block", borderRadius: "0 0 8px 8px" }}
                />
              </div>
              <div className={styles.modalArchitectureFlowSequence}>
                <span className={styles.modalArchSequenceNode}>Flutter App</span>
                <span className={styles.modalArchSequenceArrow}>→</span>
                <span className={styles.modalArchSequenceNode}>Video Reviews</span>
                <span className={styles.modalArchSequenceArrow}>→</span>
                <span className={styles.modalArchSequenceNode}>AWS S3</span>
                <span className={styles.modalArchSequenceArrow}>→</span>
                <span className={styles.modalArchSequenceNode}>Business Profiles</span>
                <span className={styles.modalArchSequenceArrow}>→</span>
                <span className={styles.modalArchSequenceNode}>NFC/QR Discovery</span>
              </div>
            </div>
          )}

          {viewMode === "workflow" && (
            <div className={styles.macWindowWrapperCol}>
              <div
                className={styles.macWindowWrapper}
                onClick={() => openZoom("/thermoconnect-workflow.png")}
              >
                <div className={styles.macTitlebar}>
                  <div className={styles.macDotRed}></div>
                  <div className={styles.macDotYellow}></div>
                  <div className={styles.macDotGreen}></div>
                  <span className={styles.macTitle}>n8n Workflow Canvas</span>
                  <span className={styles.inspectBadge}>🔍 Click to inspect</span>
                </div>
                <div className={styles.macContent}>
                  <img
                    src="/thermoconnect-workflow.png"
                    alt="n8n Workflow Canvas"
                    className={styles.architectureImg}
                  />
                </div>
              </div>
              <div className={styles.modalArchitectureFlowSequence}>
                <span className={styles.modalArchSequenceNode}>Schedule Trigger</span>
                <span className={styles.modalArchSequenceArrow}>→</span>
                <span className={styles.modalArchSequenceNode}>Read Leads</span>
                <span className={styles.modalArchSequenceArrow}>→</span>
                <span className={styles.modalArchSequenceNode}>Retell Call</span>
                <span className={styles.modalArchSequenceArrow}>→</span>
                <span className={styles.modalArchSequenceNode}>AI Analysis</span>
                <span className={styles.modalArchSequenceArrow}>→</span>
                <span className={styles.modalArchSequenceNode}>Update sheets & Send Followup</span>
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
                    {projectTitle.includes("Thermo") ? (
                      <>
                        <li>⚡ **Retell AI Call Flow**: Human-like conversational outbound qualification stream under 2s latency.</li>
                        <li>🤖 **OpenAI Insights**: Automated transcription analysis, dynamic lead scoring, and service classification.</li>
                        <li>📊 **Google Sheets Sync**: Real-time sheets reconciliation updating call outcomes, transcripts, and statuses.</li>
                        <li>📅 **DNC Safeguard**: Integrated Do-Not-Call check verifying customer eligibility before dial triggers.</li>
                        <li>🔗 **n8n Automation**: Complete lead intake schedule mapping, call status triggers, and webhook management.</li>
                      </>
                    ) : projectTitle.includes("Bear") ? (
                      <>
                        <li>⚡ **sub-200ms response time**: Real-time webhook-driven responses returned instantly to client interface.</li>
                        <li>🗄️ **High-performance vector search**: Scalable index in Qdrant database queries context elements easily.</li>
                        <li>⏱️ **Temporal-aware logic**: Filters relevant chunks chronologically for precise timeline conversations.</li>
                        <li>🤖 **Groq LLM answers**: Translates query context vectors into natural answers with minimal latency.</li>
                        <li>🧠 **Jina AI Embeddings**: Robust semantic representation of files, scripts, and transcripts.</li>
                        <li>🔗 **n8n Automation Mesh**: Orchestrates the entire webhook-to-database-to-LLM event grid.</li>
                      </>
                    ) : projectTitle.includes("Tapsy") ? (
                      <>
                        <li>⚡ **sub-40ms Fastify Latency**: High-speed lookup matching profiles with active cached views.</li>
                        <li>◭ **Optimized Prisma Indices**: Database queries accelerated 4x with schema spatial indexing.</li>
                        <li>🔥 **Firebase Social Alerts**: Real-time push notifications dispatch follows, comments, and chats instantly.</li>
                        <li>🗄️ **Redis popular time cache**: Caches popular review time insights and rating distributions.</li>
                        <li>🐶 **Husky Pre-commit Gates**: Automated linting, styling checking, and test validation.</li>
                      </>
                    ) : projectTitle.includes("SEO") ? (
                      <>
                        <li>📈 **30+ Hours Saved**: Displaces weekly manual trend mapping and copywriting.</li>
                        <li>📝 **4,000-Word Generation**: Complete long-form editorial drafts published automatically.</li>
                        <li>🛡️ **Review Gate**: Safe dual-mode AI + Human approval path.</li>
                        <li>☁️ **Google Workspace Sync**: Instantly saves docs to Drive folders.</li>
                      </>
                    ) : projectTitle.includes("Autonomous") ? (
                      <>
                        <li>📞 **5,000+ Calls Automated**: High-volume voice operations processed without human dialer overhead.</li>
                        <li>⚡ **Ultra-low Latency Loop**: Groq LLM reasoning yields sub-150ms speech response frames.</li>
                        <li>🔒 **Custom state orchestration**: 100% control over call logic directly in FastAPI (no middleware dependencies).</li>
                        <li>📅 **Supabase & CRM Sync**: Real-time webhook reconciliation for logs, scheduling, and analytics.</li>
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
                    {projectTitle.includes("Tapsy") && ["Node.js", "TypeScript", "Prisma ORM", "Redis Cache", "Firebase FCM", "Twilio API", "Husky", "DB Indexing", "ESLint"].map(p => (
                      <span key={p} className={styles.techPill}>{p}</span>
                    ))}
                    {projectTitle.includes("SEO") && ["n8n", "GPT-5", "Google Sheets", "Google Docs", "Google Drive", "Deep Research API", "OAuth2", "REST API"].map(p => (
                      <span key={p} className={styles.techPill}>{p}</span>
                    ))}
                    {projectTitle.includes("Autonomous") && ["Next.js", "FastAPI", "Supabase", "Groq LLM", "Twilio", "Python", "TypeScript", "REST APIs", "Webhooks"].map(p => (
                      <span key={p} className={styles.techPill}>{p}</span>
                    ))}
                    {projectTitle.includes("Bear") && ["n8n Workflow", "Jina AI Embeddings", "Qdrant Vector DB", "Groq LLM", "Next.js UI", "Temporal-aware logic", "Webhooks"].map(p => (
                      <span key={p} className={styles.techPill}>{p}</span>
                    ))}
                    {projectTitle.includes("Thermo") && ["n8n", "Retell AI", "OpenAI API", "Google Sheets", "FastAPI", "Webhooks", "JSON Schema", "Docker"].map(p => (
                      <span key={p} className={styles.techPill}>{p}</span>
                    ))}
                    {!projectTitle.includes("SEO") && !projectTitle.includes("Autonomous") && !projectTitle.includes("Tapsy") && !projectTitle.includes("Bear") && !projectTitle.includes("Thermo") && ["n8n Mesh", "HubSpot CRM", "Stripe API", "Slack Webhooks", "OAuth2", "Make.com Router", "Fail-safe retries"].map(p => (
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
            <span>Running stage {activeStage || 1} of {getStageCount()}</span>
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
              Step {currentIdx + 1} of {views.length}
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
