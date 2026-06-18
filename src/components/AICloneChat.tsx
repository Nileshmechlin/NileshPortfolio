"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./AICloneChat.module.css";

interface Message {
  sender: "bot" | "user";
  text: string;
  time: string;
}

export default function AICloneChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with a welcome message on mount
  useEffect(() => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setMessages([
      {
        sender: "bot",
        text: "👋 Hi there! I'm the AI Clone of Nilesh Vijay. Ask me anything about my automation workflows, fullstack dev history, or GHL snapshot architectures!",
        time: timeStr,
      },
    ]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, isTyping, isOpen]);

  const getResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("skill") || q.includes("tech") || q.includes("languages") || q.includes("stack") || q.includes("competenc")) {
      return "I specialize in self-hosted n8n/Make automation, GoHighLevel snaps, fullstack development (Next.js, Node.js, TypeScript), and advanced AI integrations (RAG with Qdrant & Jina AI, AI Calling agents via Vocode/VAPI).";
    }
    if (q.includes("rag") || q.includes("vector") || q.includes("knowledge") || q.includes("qdrant") || q.includes("jina")) {
      return "I built a production RAG knowledgebase application. It chunks and embeds text documents via Jina AI Embeddings and performs vector similarity search queries in Qdrant, featuring a custom timeline search interface built on Next.js.";
    }
    if (q.includes("ghl") || q.includes("gohighlevel") || q.includes("crm") || q.includes("calling") || q.includes("voice") || q.includes("closebot")) {
      return "As a GoHighLevel Snapshots Architect, I configure complex workflows, code custom API v2 endpoints, and deploy Vocode voice agents and CloseBot CRM funnels to automate operations and SMS pipelines.";
    }
    if (q.includes("seo") || q.includes("blog") || q.includes("automation") || q.includes("n8n") || q.includes("workflow")) {
      return "One of my flagship projects is an Automated SEO Blog System. It discovers real estate trends, compiles blog drafts using OpenAI Deep Research, and publishes directly to CMS endpoints. Includes a human-in-the-loop Slack review queue.";
    }
    if (q.includes("remote") || q.includes("reloc") || q.includes("location") || q.includes("zone") || q.includes("time") || q.includes("live")) {
      return "I am based in Kota, Rajasthan, India, and am fully open to remote positions or global relocation. I comfortably work across US, EU, and AEST time zones to maintain clean sync with teams.";
    }
    if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("phone") || q.includes("call") || q.includes("book")) {
      return "Let's connect! Email me at nileshvijay2002@gmail.com, call +91 80033 98749, or use the Intake Webhook Form at the bottom of this page to request a direct meeting.";
    }
    if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("greetings")) {
      return "Hey there! I am Nilesh's interactive AI clone. Ask me about 'RAG', 'GHL Snapshots', 'SEO Blog Automation', or how to 'hire' me!";
    }
    return "That's an interesting question! While my creator is busy building autonomous pipelines, I can share that I have 5+ years of experience constructing SaaS apps, Twilio calling frameworks, and n8n pipelines. Ask me specifically about 'RAG', 'GHL snapshots', 'SEO blog', or 'contact' details.";
  };

  const handleSend = (text: string) => {
    if (!text.trim() || isTyping) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    // Add user message
    const userMsg: Message = { sender: "user", text, time: timeStr };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");

    // Start bot typing delay
    setIsTyping(true);
    setTimeout(() => {
      const botResponseText = getResponse(text);
      const botMsg: Message = { sender: "bot", text: botResponseText, time: timeStr };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200); // 1.2s typing latency simulation
  };

  const presetQuestions = [
    "Tell me about your RAG app",
    "What GHL work have you done?",
    "Show SEO Blog project details",
    "How can I contact or hire you?",
  ];

  return (
    <div className={`${styles.chatWrapper} ${isOpen ? styles.chatOpen : ""}`}>
      {/* Launch Trigger Button */}
      <button
        className={styles.launcher}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Clone Assistant Chat"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.launcherIcon}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <div className={styles.launcherInner}>
            <div className={styles.iconContainer}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.launcherIconClosed}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className={styles.activePulse}></span>
            </div>
            <span className={styles.launcherText}>Talk to My AI Clone</span>
            <span className={styles.launcherEmoji}>🤖</span>
          </div>
        )}
      </button>

      {/* Chat Window Panel */}
      <div className={styles.window}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerAvatar}>
            <div className={styles.avatarGlow}></div>
            <span className={styles.avatarText}>NV</span>
            <span className={styles.avatarOnline}></span>
          </div>
          <div className={styles.headerTitles}>
            <h4 className={styles.headerName}>Nilesh Vijay [AI Clone]</h4>
            <span className={styles.headerStatus}>Typically replies instantly</span>
          </div>
        </div>

        {/* Message feed */}
        <div className={styles.feed}>
          {messages.map((msg, index) => (
            <div key={index} className={`${styles.msgRow} ${msg.sender === "user" ? styles.msgUser : styles.msgBot}`}>
              <div className={styles.msgBubble}>
                <p className={styles.msgText}>{msg.text}</p>
                <span className={styles.msgTime}>{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className={`${styles.msgRow} ${styles.msgBot}`}>
              <div className={`${styles.msgBubble} ${styles.typingBubble}`}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Preset Recruiter Queries */}
        <div className={styles.presets}>
          <span className={styles.presetsLabel}>Suggest queries:</span>
          <div className={styles.presetGrid}>
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                className={styles.presetBtn}
                onClick={() => handleSend(q)}
                disabled={isTyping}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input area */}
        <form
          className={styles.inputArea}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
        >
          <input
            type="text"
            className={styles.input}
            placeholder="Type a message (e.g. 'skills', 'remote')..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping}
          />
          <button type="submit" className={styles.sendBtn} disabled={!inputVal.trim() || isTyping}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.sendIcon}>
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
