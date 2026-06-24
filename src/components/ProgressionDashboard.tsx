"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./ProgressionDashboard.module.css";

interface SkillCategory {
  name: string;
  skills: string[];
  color: string;
}

export default function ProgressionDashboard() {
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const skillCategories: SkillCategory[] = [
    { name: "Automation & Workflows", skills: ["n8n", "Make.com", "GoHighLevel Automations"], color: "var(--orange)" },
    { name: "Fullstack Engineering", skills: ["Next.js", "Node.js", "TypeScript", "FastAPI"], color: "var(--purple)" },
    { name: "AI & Data Layers", skills: ["Supabase", "Qdrant", "OpenAI / Groq API"], color: "var(--green)" },
    { name: "Voice & Real-time AI", skills: ["Vocode", "Vapi", "Twilio", "WebRTC"], color: "var(--blue)" },
  ];

  const systems = [
    {
      title: "Real Estate SEO Engine",
      icon: "📰",
      desc: "✓ 26-node automation platform\n✓ 4000-word AI articles\n✓ Google Workspace publishing",
      metric: "High Volume",
      accent: "var(--orange)",
      liveMetric: "LIVE • 4K+ ARTICLES PUBLISHED",
    },
    {
      title: "Timeline RAG Platform",
      icon: "🐻",
      desc: "✓ 10,000+ indexed documents\n✓ <80ms retrieval latency\n✓ Jina + Qdrant + Next.js",
      metric: "Enterprise AI",
      accent: "var(--purple)",
      liveMetric: "LIVE • SUB-200MS API LATENCY",
    },
    {
      title: "Voice Calling Platform",
      icon: "📞",
      desc: "✓ Twilio + Vocode platform\n✓ Sub-200ms conversational latency\n✓ Automated CRM appointment booking",
      metric: "Real-time Voice",
      accent: "var(--blue)",
      liveMetric: "LIVE • 5000+ CALLS AUTOMATED",
    },
    {
      title: "Dental Acquisition Engine",
      icon: "🦷",
      desc: "✓ GoHighLevel + Vapi AI\n✓ < 2 min lead response time\n✓ Auto-booking pipeline",
      metric: "Growth Engine",
      accent: "var(--green)",
      liveMetric: "LIVE • 24/7 SLA",
    },
  ];

  return (
    <section id="progression" className={styles.section} ref={containerRef}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>Impact Metrics</span>
          <h2 className={styles.title}>Career Impact</h2>
          <p className={styles.subtitle}>
            Tracking professional experience and delivered production systems.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className={styles.dashboard}>
          {/* Left Panel: Impact Dashboard */}
          <div className={`${styles.profilePanel} stagger-item`}>
            <div className={styles.levelCard}>
              <div className={styles.shieldWrapper}>
                <div className={styles.glowingOrb}></div>
                <div className={styles.shield}>AI</div>
              </div>
              <div className={styles.levelDetails}>
                <span className={styles.rankLabel}>CORE FOCUS</span>
                <h3 className={styles.rankTitle}>AI + Full-Stack Engineering</h3>
                <p className={styles.rankDesc}>Architecting scalable automations and intelligent systems</p>
              </div>
            </div>

            {/* Sub Stats Cards Grid */}
            <div className={styles.gridMiniStats} style={{ marginTop: '2rem' }}>
              <div className={styles.miniStatCard}>
                <span className={styles.miniValue} style={{ fontSize: "2.2rem", color: "var(--orange)" }}>5M+</span>
                <span className={styles.miniLabel}>API Requests Processed</span>
              </div>
              <div className={styles.miniStatCard}>
                <span className={styles.miniValue} style={{ fontSize: "1.8rem", color: "var(--orange)" }}>500K+</span>
                <span className={styles.miniLabel}>Workflow Runs</span>
              </div>
              <div className={styles.miniStatCard}>
                <span className={styles.miniValue} style={{ fontSize: "1.5rem", color: "var(--orange)" }}>100+</span>
                <span className={styles.miniLabel}>Automations Built</span>
              </div>
              <div className={styles.miniStatCard}>
                <span className={styles.miniValue} style={{ fontSize: "1.5rem", color: "var(--orange)" }}>10+</span>
                <span className={styles.miniLabel}>SaaS Systems Delivered</span>
              </div>
              <div className={styles.miniStatCard} style={{ gridColumn: "span 2" }}>
                <span className={styles.miniValue} style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--purple)" }}>US-Based Clients</span>
                <span className={styles.miniLabel} style={{ marginTop: "4px" }}>Remote Delivery across Real Estate, Healthcare, & SaaS</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Core Competencies */}
          <div className={`${styles.skillsPanel} stagger-item`}>
            <h3 className={styles.panelTitleHero}>Core Competencies</h3>
            <div className={styles.skillList}>
              {skillCategories.map((category, idx) => (
                <div key={idx} className={styles.skillCategoryItem}>
                  <div className={styles.skillCategoryHeader} style={{ color: category.color }}>
                    {category.name}
                  </div>
                  <div className={styles.skillPills}>
                    {category.skills.map((skill, sIdx) => (
                      <span key={sIdx} className={styles.skillPill} style={{ border: `1px solid ${category.color}`, color: category.color, backgroundColor: `color-mix(in srgb, ${category.color} 10%, transparent)` }}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Production Systems Showcase */}
        <div className={`${styles.missionsSection} stagger-item`}>
          <h3 className={styles.panelTitle}>Production Systems Delivered</h3>
          <div className={styles.missionsGrid}>
            {systems.map((system, idx) => (
              <div
                key={idx}
                className={styles.missionCard}
                style={{ "--mission-accent": system.accent } as React.CSSProperties}
              >
                <div className={styles.missionHeader}>
                  <span className={styles.missionBadge} style={{ backgroundColor: system.accent }}>{system.metric}</span>
                  <span className={styles.missionIcon}>{system.icon}</span>
                </div>
                <h4 className={styles.missionTitle}>{system.title}</h4>
                <div className={styles.missionDesc}>
                  {system.desc.split('\n').map((line, i) => (
                    <div key={i} style={{ marginBottom: "6px" }}>{line}</div>
                  ))}
                </div>
                <div className={styles.missionFooter}>
                  <span className={styles.statusSuccess}>✓ {system.liveMetric}</span>
                  <a href="#work" className={styles.missionLink}>View Details ➔</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

