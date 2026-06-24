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
  businessImpact: string;
  companyLogo?: string;
  techStackMap?: { [key: string]: string };
  results?: string[];
  screenshots?: string[];
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
      n8nBadge: { nodes: "26 Nodes", integrations: "6 Integrations" },
      businessImpact: "Automatically scales content marketing without hiring writers.",
      techStackMap: { "Frontend": "Google Workspace", "Backend": "Node.js", "AI Layer": "GPT-5", "Automation": "n8n", "Communications": "Slack" }
    },
    {
      title: "Autonomous Voice Architecture",
      subtitle: "CONVERSATIONAL AI PLATFORM",
      description: "Built a custom autonomous voice AI platform to replace expensive third-party solutions like Vapi and Retell, reducing operational costs while providing complete control over AI agents, telephony infrastructure, and business workflows.",
      category: "ghl",
      tags: ["📞 Twilio", "🗣️ Vocode", "🤖 Groq", "⚡ FastAPI", "🗄️ Supabase", "▲ Next.js"],
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
        { label: "Frontend", score: 70 }
      ],
      codeStats: [
        { label: "Voice AI", value: "Vocode" },
        { label: "Response LLM", value: "Groq API" },
        { label: "Telephony", value: "Twilio trunk" },
        { label: "Database", value: "Supabase DB" }
      ],
      flowNodes: ["Trigger", "Twilio", "Voice AI", "Groq LLM", "Backend DB", "Dashboard"],
      nodeTooltips: [
        "Customer call or outbound trigger event.",
        "Twilio telephony and voice routing.",
        "Real-time voice stream handled by Vocode.",
        "Ultra-low latency reasoning via Groq API.",
        "FastAPI webhook handling and Supabase DB logging.",
        "Next.js frontend dashboard updating in real-time."
      ],
      terminalScript: [
        { text: "$ voice-platform --initiate-call=\"+1234567890\" --pipeline=\"vocode-groq\"", delay: 500 },
        { text: "Dialing number via Twilio telephony trunk...", delay: 600 },
        { text: "✓ Call answered. Launching WebRTC voice stream...", delay: 350 },
        { text: "Connecting Vocode voice agents...", delay: 550 },
        { text: "✓ Real-time Speech-to-Text connection established", delay: 300 },
        { text: "User spoken input captured: 'I need to schedule an AC tune-up tomorrow.'", delay: 800 },
        { text: "Querying Groq LLM API for low-latency voice response...", delay: 400 },
        { text: "✓ Groq output generated: 'I can help with that...': 140ms response latency", delay: 300 },
        { text: "Routing callback webhook to FastAPI API backend...", delay: 500 },
        { text: "✓ FastAPI received payload. Logging call transcription...", delay: 300 },
        { text: "Updating Supabase database records...", delay: 450 },
        { text: "✓ Supabase DB synced. Updating Next.js live dashboard...", delay: 300 },
        { text: "Triggering follow-up automation: dispatching slot booking confirmation...", delay: 600 },
        { text: "✓ System workflow execution completed successfully.", delay: 300 }
      ],
      aiExplainer: "Built a custom autonomous voice AI platform to replace expensive third-party solutions like Vapi and Retell, reducing operational costs while providing complete control over AI agents, telephony infrastructure, and business workflows. The system uses Twilio for phone numbers and call routing, Vocode for real-time voice conversations, Groq for fast AI responses, FastAPI for backend APIs, Supabase for database storage, and Next.js for the frontend dashboard. This platform can be used for lead qualification, appointment booking, customer support, missed-call follow-up, and outbound sales automation.",
      architecture: ["Twilio Call Routing", "Voice AI (Vocode)", "Groq LLM Reasoning", "FastAPI Backend", "Supabase PostgreSQL Database", "Next.js Dashboard"],
      lastUpdated: "Apr 2026",
      technicalMetrics: [
        { label: "Voice Latency", value: "< 200ms" },
        { label: "AI response loop", value: "Groq LLM" },
        { label: "Outbound Calls", value: "5000+" },
        { label: "Booking Rate", value: "42%" },
        { label: "Active SLA", value: "24/7" },
        { label: "Frameworks", value: "Next.js / FastAPI" }
      ],
      hoverStats: [
        "Twilio call routing",
        "Vocode stream",
        "Fast response via Groq API",
        "FastAPI & Supabase DB"
      ],
      caseStudy: {
        problem: "Businesses lose customer conversion opportunities due to slow manual response times, high overhead for 24/7 manual dialers, and lack of automated call logging.",
        solution: "Deploy an event-driven AI Voice Calling platform leveraging Twilio voice routing, low-latency Groq response loops, and automated Supabase database reconciliation.",
        impact: [
          "✓ Automates inbound/outbound calling",
          "✓ Eliminates manual calling labor overhead",
          "✓ Sub-200ms audio response loop with Groq LLM",
          "✓ Synced call records in Next.js dashboard",
          "✓ Automatic appointment scheduling"
        ]
      },
      productionReadiness: [
        "Twilio Trunking Active",
        "Voice AI Stream Verified",
        "Groq Ultra-low Latency Loop",
        "FastAPI Webhook Handler",
        "Supabase DB Persistence",
        "Next.js Dashboard Live",
        "24/7 Voice SLA"
      ],
      n8nBadge: { nodes: "N/A", integrations: "Vocode, Twilio, Supabase, Groq" },
      businessImpact: "Reduced manual calling workload by automating lead qualification and appointment booking.",
      companyLogo: "AC Medics",
      techStackMap: { "Frontend": "Next.js", "Backend": "FastAPI", "Database": "Supabase", "AI Layer": "Groq", "Voice AI": "Vocode", "Communications": "Twilio" }
    },
    {
      title: "Tapsy Backend Platform",
      subtitle: "FLUTTER VIDEO REVIEW BACKEND SYSTEM",
      description: "Built the complete backend architecture for Tapsy, a Flutter mobile app where users record authentic 30-second video reviews for physical businesses — replacing unreliable text reviews with real atmosphere, food, and vibe footage.",
      category: "fullstack",
      tags: ["🟢 Node.js", "📘 TypeScript", "⚡ Fastify", "◭ Prisma", "☁️ AWS S3", "🗄️ Redis", "🔥 Firebase", "🔌 QR/NFC"],
      gradientClass: styles.gradYellow,
      icon: "🎥",
      linkText: "▶ Inspect Architecture Detail",
      metrics: [
        { value: "< 40ms", label: "Fastify API Response" },
        { value: "AWS S3", label: "Signed Video Uploads" },
        { value: "Redis", label: "Popular Time Cache" },
        { value: "NFC/QR", label: "Business Discovery" }
      ],
      difficulty: [
        { label: "AI & Agents", score: 40 },
        { label: "Automation", score: 80 },
        { label: "Backend", score: 98 },
        { label: "Frontend", score: 65 }
      ],
      codeStats: [
        { label: "Video Storage", value: "AWS S3 Signed URLs" },
        { label: "Database", value: "PostgreSQL + Prisma" },
        { label: "Caching", value: "Redis insights" },
        { label: "Dev Workflow", value: "Husky + ESLint" }
      ],
      flowNodes: ["S3 Upload", "PostgreSQL", "Publish", "FCM Notify", "Redis Cache", "QR/NFC"],
      nodeTooltips: [
        "Backend generates signed AWS S3 URL for secure video upload.",
        "Review metadata stored in PostgreSQL via Prisma ORM.",
        "Review is published to the business profile and follower feed.",
        "Firebase FCM sends push notifications to all followers.",
        "Popular review time insights cached in Redis for fast retrieval.",
        "NFC tags and QR codes redirect users to dynamic business profiles."
      ],
      terminalScript: [
        { text: "$ tapsy-upload --user=\"sarah_k\" --business=\"Blue Tokai Coffee\"", delay: 400 },
        { text: "Generating signed AWS S3 upload URL...", delay: 450 },
        { text: "✓ Signed URL generated (expires in 5min)", delay: 300 },
        { text: "Uploading 30s video review to S3...", delay: 700 },
        { text: "✓ S3 upload confirmed (4.2MB, H.264)", delay: 350 },
        { text: "Saving review metadata to PostgreSQL via Prisma...", delay: 500 },
        { text: "✓ Review published to business profile", delay: 300 },
        { text: "Triggering Firebase FCM push notifications...", delay: 500 },
        { text: "✓ 4,200 followers notified (Firebase FCM)", delay: 400 },
        { text: "Caching popular review time data in Redis...", delay: 450 },
        { text: "✓ Redis cache updated (8ms)", delay: 300 },
        { text: "✓ Transaction completed successfully.", delay: 300 }
      ],
      aiExplainer: "A scalable Flutter video-review backend built on Node.js/TypeScript/Fastify. Handles secure 30s video uploads via AWS S3 signed URLs, stores review metadata in PostgreSQL through Prisma ORM, distributes Firebase FCM push notifications to followers, caches popular review insights in Redis, and maps NFC/QR scans to dynamic business profiles.",
      architecture: ["Flutter App", "Fastify API", "AWS S3 Upload", "PostgreSQL + Prisma", "Redis Cache", "Firebase FCM", "NFC/QR Discovery"],
      lastUpdated: "Jun 2026",
      technicalMetrics: [
        { label: "API Latency", value: "< 40ms" },
        { label: "Storage", value: "AWS S3" },
        { label: "DB ORM", value: "Prisma + PostgreSQL" },
        { label: "Notifications", value: "Firebase FCM" },
        { label: "Caching", value: "Redis" },
        { label: "Dev Safety", value: "Husky Hooks" }
      ],
      hoverStats: [
        "AWS S3 Signed Uploads",
        "Prisma + PostgreSQL",
        "Redis Popular Time Cache",
        "Firebase FCM Notifications"
      ],
      caseStudy: {
        problem: "Text reviews are unreliable, easily faked, and fail to convey the real atmosphere, food quality, or service experience of physical businesses like restaurants and salons.",
        solution: "Built the complete backend for a Flutter video review app — secure AWS S3 video uploads, PostgreSQL data storage, Redis caching, Firebase notifications, and NFC/QR discovery maps.",
        impact: [
          "✓ Secure 30s video uploads via AWS S3",
          "✓ < 40ms Fastify API responses",
          "✓ Real-time FCM push to followers",
          "✓ NFC/QR physical business tags",
          "✓ Husky pre-commits prevent broken deploys"
        ]
      },
      productionReadiness: [
        "AWS S3 Signed URL Auth",
        "Prisma DB Indexing",
        "Redis Replication",
        "Firebase FCM Active",
        "Twilio SMS/OTP",
        "Husky Pre-commit Hooks",
        "ESLint Code Quality"
      ],
      n8nBadge: { nodes: "N/A", integrations: "AWS S3, Prisma, Firebase, Redis, Twilio" },
      businessImpact: "Created authentic social proof by replacing easily faked text reviews with verifiable 30s video footage.",
      techStackMap: { "Frontend": "Flutter App", "Backend": "Fastify", "Database": "PostgreSQL", "Caching": "Redis", "Storage": "AWS S3" }
    },
    {
      title: "Bear Intelligence Pipeline",
      subtitle: "SMART DOCUMENT CHAT SYSTEM",
      description: "AI-powered Temporal RAG platform transforming scripts, transcripts, and documents into an intelligent Next.js conversational chat base.",
      category: "fullstack",
      tags: ["⚡ n8n", "🧠 Jina AI", "🗄️ Qdrant", "💻 Next.js", "🤖 Groq LLM", "🔌 Webhooks"],
      gradientClass: styles.gradBear,
      icon: "🐻",
      linkText: "▶ Inspect Pipeline Detail",
      metrics: [
        { value: "< 200ms", label: "Avg Response Time" },
        { value: "99.2%", label: "Accuracy Rate" },
        { value: "10K+", label: "Docs Processed" },
        { value: "24/7", label: "System Uptime" }
      ],
      difficulty: [
        { label: "AI & Agents", score: 92 },
        { label: "Automation", score: 88 },
        { label: "Backend", score: 90 },
        { label: "Frontend", score: 85 }
      ],
      codeStats: [
        { label: "Fastify Latency", value: "< 200ms" },
        { label: "Database Engine", value: "Qdrant Cloud" },
        { label: "Automation Engine", value: "n8n Workflow" },
        { label: "LLM Reasoner", value: "Groq LLM" }
      ],
      flowNodes: ["Webhook", "Embed", "Qdrant", "Retrieve", "Ask Groq", "Response"],
      nodeTooltips: [
        "Webhook receives the user query from the Next.js interface.",
        "Query is converted into vector embedding by Jina AI.",
        "Vector search finds the most relevant script chunks in Qdrant.",
        "Fetches relevant timeline chunks from matched documents.",
        "Groq AI LLM generates the final intelligent response.",
        "Response is sent back to the webhook and displayed in the UI."
      ],
      terminalScript: [
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
      ],
      aiExplainer: "An end-to-end AI workflow that ingests documents, generates Jina embeddings, stores them in Qdrant vector database, and processes natural language queries via n8n temporal logic routing to Groq LLM.",
      architecture: ["Next.js UI", "n8n Webhook", "Jina AI Embeddings", "Qdrant Vector DB", "Groq AI LLM"],
      lastUpdated: "Jun 2026",
      technicalMetrics: [
        { label: "Avg Latency", value: "< 200ms" },
        { label: "Accuracy Rate", value: "99.2%" },
        { label: "Index Engine", value: "Qdrant DB" },
        { label: "Embedding API", value: "Jina Embeddings" },
        { label: "Reasoning API", value: "Groq LLM" },
        { label: "Automation Logic", value: "n8n Workflow" }
      ],
      hoverStats: [
        "Next.js Chat UI",
        "Qdrant Vector DB",
        "Jina Embeddings",
        "Groq LLM response"
      ],
      caseStudy: {
        problem: "Transforming raw transcripts and scripts into accurate, time-contextual natural language answers was complex and prone to hallucinations.",
        solution: "A custom Next.js UI routing query webhooks to n8n, applying temporal logic filters to Qdrant searches, and synthesizing answers via Groq LLM.",
        impact: [
          "✓ sub-200ms average response",
          "✓ 99.2% retrieval accuracy",
          "✓ 10k+ files indexed",
          "✓ Live Next.js chat system"
        ]
      },
      productionReadiness: [
        "n8n Webhook Auth",
        "Qdrant Index Tuning",
        "Jina Cache Buffers",
        "Groq Fallbacks Active",
        "Vercel CDN Edge",
        "Docker Local Testing"
      ],
      n8nBadge: { nodes: "8 Stages", integrations: "n8n, Qdrant, Groq, Jina" },
      businessImpact: "Eliminated manual document search by instantly answering complex questions across thousands of scripts.",
      companyLogo: "APCC",
      techStackMap: { "Frontend": "Next.js", "Database": "Qdrant", "AI Layer": "Groq", "Embeddings": "Jina AI", "Automation": "n8n" }
    },
    {
      title: "ThermoConnect AI",
      subtitle: "CONVERSATIONAL AI AUTOMATION ENGINE",
      description: "AI voice agent that qualifies, scores, and books appointments for HVAC leads — synced to Google Sheets and CRMs.",
      category: "automation",
      tags: ["📞 Retell AI", "⚡ n8n", "🟢 Next.js", "🤖 OpenAI", "📊 Sheets", "🔌 Webhooks"],
      gradientClass: styles.gradThermo,
      icon: "🔥",
      linkText: "▶ Inspect Calling Pipeline",
      metrics: [
        { value: "100%", label: "Lead Outreach SLA" },
        { value: "30-50%", label: "Conversion Lift" },
        { value: "100+ Hrs", label: "Monthly Labor Saved" },
        { value: "< 2s", label: "Voice Response Latency" }
      ],
      difficulty: [
        { label: "AI & Agents", score: 92 },
        { label: "Automation", score: 95 },
        { label: "Backend", score: 85 },
        { label: "Frontend", score: 75 }
      ],
      codeStats: [
        { label: "Workflow Size", value: "18 Nodes" },
        { label: "AI Models", value: "Retell AI & GPT" },
        { label: "Integrations", value: "5" },
        { label: "Automation Level", value: "100%" }
      ],
      flowNodes: ["Read CRM", "DNC Check", "Voice Call", "Webhook", "LLM Score", "Update DB"],
      nodeTooltips: [
        "Reads customer profiles from CRM.",
        "Checks Do-Not-Call registry history.",
        "Triggers outbound Retell AI voice call.",
        "Receives call completion status webhook.",
        "Extracts structured conversation data using OpenAI.",
        "Updates Google Sheets / DB with follow-ups."
      ],
      terminalScript: [
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
      ],
      aiExplainer: "An automated outbound voice qualifying system. It monitors lead intake, places Retell AI voice calls, transcribes/extracts structured customer details via GPT, and logs appointments directly into database sheets.",
      architecture: ["Trigger Pool", "Google Sheets DB", "n8n Outbound Workflow", "Retell AI Voice API", "OpenAI Extractor", "Google Sheets Updater"],
      lastUpdated: "Jun 2026",
      technicalMetrics: [
        { label: "Outbound Latency", value: "< 2s" },
        { label: "Conversation Accuracy", value: "98%" },
        { label: "Automation Level", value: "100%" },
        { label: "Monthly Savings", value: "100+ hours" },
        { label: "API Integrations", value: "6" },
        { label: "Output Format", value: "JSON Schema" }
      ],
      hoverStats: [
        "Retell AI Voice API",
        "n8n Automation Engine",
        "OpenAI JSON Extraction",
        "Google Sheets Live Sync"
      ],
      caseStudy: {
        problem: "HVAC companies lose hot leads due to slow manual response times and high administrative calling overhead.",
        solution: "Autonomous calling agent dials leads instantly, qualifies service requirements via Retell AI, and records structured responses.",
        impact: [
          "✓ 100+ hours saved monthly",
          "✓ 30-50% higher conversion",
          "✓ Zero missed call opportunities",
          "✓ Structured data output"
        ]
      },
      productionReadiness: [
        "Retell API Key Validation",
        "DNC Database Check",
        "Webhook Resiliency Retry",
        "Structured JSON Schema",
        "Twilio Caller ID Verification",
        "n8n Execution Logs"
      ],
      n8nBadge: { nodes: "18 Nodes", integrations: "Retell AI, OpenAI, Sheets" },
      businessImpact: "Saved over 100+ hours of calling labor monthly and increased booking conversions by up to 50%.",
      companyLogo: "HVAC Voice Agent",
      techStackMap: { "Frontend": "React", "Backend": "Node.js", "Database": "Google Sheets", "Voice AI": "Retell", "Automation": "n8n" }
    },
    {
      title: "Dental AI Revenue Engine",
      subtitle: "PATIENT ACQUISITION AUTOMATION PLATFORM",
      description: "End-to-end AI-powered patient acquisition system combining Google/Meta Ads, GoHighLevel CRM, Vapi AI voice calling, and Supabase to automatically qualify dental leads and book appointments without manual intervention.",
      category: "ghl",
      tags: ["🦷 GoHighLevel", "🤖 Vapi AI", "📞 Twilio", "🗄️ Supabase", "⚡ n8n", "📣 Meta Ads", "🔍 Google Ads"],
      gradientClass: styles.gradPurple,
      icon: "🦷",
      linkText: "▶ Explore Patient Acquisition System",
      metrics: [
        { value: "< 2 Min", label: "Lead Response Time" },
        { value: "24/7", label: "AI Calling Agent SLA" },
        { value: "100%", label: "Automated Follow-Up" },
        { value: "9 Fields", label: "Structured AI Output" }
      ],
      difficulty: [
        { label: "AI & Agents", score: 94 },
        { label: "Automation", score: 97 },
        { label: "Backend", score: 88 },
        { label: "Frontend", score: 65 }
      ],
      codeStats: [
        { label: "Voice AI", value: "Vapi AI" },
        { label: "CRM Platform", value: "GoHighLevel" },
        { label: "Database", value: "Supabase/PostgreSQL" },
        { label: "Automation", value: "n8n Webhooks" }
      ],
      flowNodes: ["Ads", "GHL CRM", "Webhook", "Supabase", "Vapi AI", "Qualify", "AI Output", "Follow-Up", "Book"],
      nodeTooltips: [
        "Google Ads and Meta Ads drive qualified dental traffic to landing pages.",
        "GoHighLevel captures leads, manages pipeline, and triggers automations.",
        "Webhooks sync lead data in real-time between GHL and Supabase.",
        "Supabase/PostgreSQL stores all leads, call logs, transcripts, and AI analysis.",
        "Vapi AI places outbound voice calls to leads within minutes of capture.",
        "AI qualifies treatment interest, availability, budget, and buying intent.",
        "Structured JSON output: intent, score, budget, objections, next action.",
        "GHL triggers SMS, email, and ringless voicemail follow-up sequences.",
        "Qualified leads are booked directly into the dental clinic calendar."
      ],
      terminalScript: [
        { text: "$ dental-ai --new-lead=\"patient_id_1234\" --source=\"google-ads\"", delay: 400 },
        { text: "Lead captured in GoHighLevel CRM. Syncing to Supabase...", delay: 500 },
        { text: "✓ Supabase record created (patient_id: 1234)", delay: 300 },
        { text: "Triggering Vapi AI outbound call via Twilio...", delay: 600 },
        { text: "✓ Call connected. AI voice agent active...", delay: 350 },
        { text: "AI: 'Hi! I'm calling about your dental inquiry. What treatment are you interested in?'", delay: 800 },
        { text: "Patient: 'I need a dental implant consultation.'", delay: 700 },
        { text: "AI qualifying: treatment, availability, budget, intent...", delay: 500 },
        { text: "✓ Call completed (Duration: 3m 42s). Extracting structured data...", delay: 400 },
        { text: "✓ JSON output: intent=implant, score=87, stage=HOT, budget=$3000-5000", delay: 350 },
        { text: "Updating GHL stage → HOT LEAD. Triggering follow-up sequence...", delay: 500 },
        { text: "✓ SMS sent. Appointment booked. Database updated.", delay: 300 }
      ],
      aiExplainer: "A complete patient acquisition engine combining paid ads traffic with GoHighLevel CRM, Vapi AI voice calling, and Supabase database. The AI agent qualifies each dental lead through natural conversation — capturing treatment interest, budget, availability, and buying intent — then auto-books appointments and triggers personalized GHL follow-up campaigns.",
      architecture: ["Google/Meta Ads", "GHL CRM", "Webhook Bridge", "Supabase DB", "Vapi AI Voice", "Lead Qualification", "Structured Output", "GHL Campaigns", "Appointment Booking"],
      lastUpdated: "Jun 2026",
      technicalMetrics: [
        { label: "Lead Response", value: "< 2 min" },
        { label: "AI Platform", value: "Vapi AI" },
        { label: "CRM", value: "GoHighLevel" },
        { label: "Database", value: "Supabase" },
        { label: "Structured Fields", value: "9" },
        { label: "Calling SLA", value: "24/7 Automated" }
      ],
      hoverStats: [
        "Vapi AI Voice Calling",
        "GoHighLevel CRM Sync",
        "Supabase DB Storage",
        "9-Field AI Extraction"
      ],
      caseStudy: {
        problem: "Dental clinics waste ad spend because leads are not followed up instantly — most calls happen hours or days later when intent has cooled.",
        solution: "Vapi AI calls every new lead within minutes of ad form submission, qualifies them, and books appointments automatically — all synced to GoHighLevel CRM.",
        impact: [
          "✓ Instant lead response (< 2 min)",
          "✓ 24/7 AI calling agent",
          "✓ Structured qualification output",
          "✓ Automated CRM stage updates",
          "✓ End-to-end appointment booking"
        ]
      },
      productionReadiness: [
        "GHL Webhook Integration",
        "Vapi AI Voice Active",
        "Supabase DB Schema",
        "Structured JSON Output",
        "DNC List Validation",
        "GHL Campaign Triggers",
        "SMS/Email Automation"
      ],
      n8nBadge: { nodes: "12 Nodes", integrations: "GHL, Vapi, Supabase, Twilio" },
      businessImpact: "Maximized ad spend ROI by engaging and qualifying 100% of dental leads under 2 minutes, 24/7.",
      companyLogo: "Bellagio Employee Hub",
      techStackMap: { "Frontend": "GoHighLevel", "Database": "Supabase", "AI Layer": "GPT-4", "Voice AI": "Vapi AI", "Communications": "Twilio" }
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
          <h2 className={styles.title}>Production AI Systems</h2>
          <div className={styles.featuredStatsGrid}>
            <div className={styles.featuredStatItem}>
              <span className={styles.featuredStatVal}>6</span>
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
  const [activeTab, setActiveTab] = useState<"dashboard" | "case_study" | "terminal">("dashboard");
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
    if (project.title.includes("Calling") || project.title.includes("Voice")) return styles.cardVoice;
    if (project.title.includes("Mesh") || project.title.includes("Automation")) return styles.cardGHL;
    if (project.title.includes("Tapsy")) return styles.cardTapsy;
    if (project.title.includes("Bear")) return styles.cardBear;
    if (project.title.includes("Thermo")) return styles.cardThermo;
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
      project.title === "Production AI SEO Pipeline" ||
      project.title === "Autonomous Voice Architecture" ||
      project.title === "Tapsy Backend Platform" ||
      project.title.includes("Bear") ||
      project.title.includes("Thermo") ||
      project.title.includes("Dental")
    ) {
      onInspect(project.title);
    } else {
      setActiveTab("terminal");
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
          <div className={`${styles.cardImage} ${project.gradientClass}`} style={project.title.includes("Tapsy") ? { background: "white", border: "1px solid #e8d5f5", padding: 0, overflow: "hidden" } : {}}>
            {project.title.includes("Tapsy") ? (
              <img src="/tapsy-logo.png" alt="Tapsy Logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
            ) : (
              <span className={styles.cardIcon}>{project.icon}</span>
            )}
          </div>
          <div className={styles.cardHeaderTitleWrap}>
            {project.companyLogo && (
              <span className={styles.companyLogoText} style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--purple)", marginBottom: "4px", display: "inline-block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                ❖ {project.companyLogo}
              </span>
            )}
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
            className={`${styles.progStepBtn} ${activeTab === "terminal" ? styles.progStepActive : ""}`}
            onClick={() => setActiveTab("terminal")}
            title="Live pipeline simulator"
          >
            Execution
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




        </div>

        {/* Description & Tags */}
        <div className={styles.cardBody} style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <div className={styles.tagWrapper}>
            {project.tags.slice(0, 5).map((tag, tIdx) => (
              <span key={tIdx} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>

          <p className={styles.cardText} style={{ fontWeight: 600, paddingRight: "0", whiteSpace: "normal", wordBreak: "break-word" }}>
            {activeTab === "dashboard" && project.description}
            {activeTab === "case_study" && (project.title.includes("SEO") ? "Case Study analysis covering business problem, solution, and impact." : "Case study details highlighting business value.")}

            {activeTab === "terminal" && "Live execution simulation of the production pipeline."}
          </p>
        </div>

        {/* Footer Action Area */}
        <div className={styles.cardActionFooter}>
          <button
            className={styles.ghostActionBtn}
            onClick={() => onInspect(project.title)}
          >
            {project.linkText.replace("▶ ", "")} <span className={styles.btnArrow}>➔</span>
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
