"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./ProgressionDashboard.module.css";

interface SkillStat {
  name: string;
  level: number;
  xpPercent: number;
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

  const stats: SkillStat[] = [
    { name: "n8n Self-Hosted Workflows", level: 5, xpPercent: 95, color: "var(--orange)" },
    { name: "GHL Snapshots & CRM Custom APIs", level: 4, xpPercent: 90, color: "var(--blue)" },
    { name: "Fullstack SaaS (Next.js / Node.js)", level: 4, xpPercent: 85, color: "var(--purple)" },
    { name: "RAG & Vector search (Qdrant)", level: 3, xpPercent: 80, color: "var(--green)" },
    { name: "AI Voice agents (Vocode / Vapi)", level: 3, xpPercent: 75, color: "var(--pink)" },
  ];

  const missions = [
    {
      title: "Real Estate SEO Auto-Blog",
      desc: "Constructed deep-research keyword search flow with Slack review gate.",
      xp: "+1,200 XP",
      badge: "🏆 Gold Badge",
      accent: "var(--orange)",
    },
    {
      title: "Timeline RAG Knowledgebase",
      desc: "Mapped text chunking to Jina AI Embeddings and Qdrant queries.",
      xp: "+1,000 XP",
      badge: "⚡ Silver Badge",
      accent: "var(--purple)",
    },
    {
      title: "Vocode Voice CRM snaps",
      desc: "Wired Twilio call hooks and CloseBot SMS responders to GHL Pipelines.",
      xp: "+950 XP",
      badge: "🔥 Bronze Badge",
      accent: "var(--blue)",
    },
  ];

  return (
    <section id="progression" className={styles.section} ref={containerRef}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>System Stats</span>
          <h2 className={styles.title}>Career Achievements</h2>
          <p className={styles.subtitle}>
            Tracking my developer growth and completed missions in real-time.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className={styles.dashboard}>
          {/* Left Panel: Level & Core Profile */}
          <div className={`${styles.profilePanel} stagger-item`}>
            <div className={styles.levelCard}>
              <div className={styles.shieldWrapper}>
                <div className={styles.glowingOrb}></div>
                <div className={styles.shield}>5</div>
              </div>
              <div className={styles.levelDetails}>
                <span className={styles.rankLabel}>CURRENT RANK</span>
                <h3 className={styles.rankTitle}>AI Automation Arch-Mage</h3>
                <p className={styles.rankDesc}>Level 5 — Fullstack & Automation Specialist</p>
              </div>
            </div>

            {/* Total XP Bar */}
            <div className={styles.xpProgressGroup}>
              <div className={styles.xpLabels}>
                <span className={styles.xpText}>TOTAL EXPERIENCE</span>
                <span className={styles.xpNumber}>4,850 / 5,000 XP (97%)</span>
              </div>
              <div className={styles.xpTrack}>
                <div
                  className={styles.xpFill}
                  style={{ width: animate ? "97%" : "0%" }}
                />
              </div>
              <span className={styles.xpNextLevel}>150 XP remaining to Level 6 Onboarding Specialist</span>
            </div>

            {/* Sub Stats Cards Grid */}
            <div className={styles.gridMiniStats}>
              <div className={styles.miniStatCard}>
                <span className={styles.miniValue}>5+ Years</span>
                <span className={styles.miniLabel}>Total Campaign Time</span>
              </div>
              <div className={styles.miniStatCard}>
                <span className={styles.miniValue}>500k+</span>
                <span className={styles.miniLabel}>Workflow Actions Executed</span>
              </div>
              <div className={styles.miniStatCard}>
                <span className={styles.miniValue}>US·EU·AEST</span>
                <span className={styles.miniLabel}>Multiplayer Time Zones</span>
              </div>
              <div className={styles.miniStatCard}>
                <span className={styles.miniValue}>Remote</span>
                <span className={styles.miniLabel}>Deployment Strategy</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Skill stats XP levels */}
          <div className={`${styles.skillsPanel} stagger-item`}>
            <h3 className={styles.panelTitle}>Leveling Tree (Skill Progression)</h3>
            <div className={styles.skillList}>
              {stats.map((skill, idx) => (
                <div key={idx} className={styles.skillItem}>
                  <div className={styles.skillHeader}>
                    <span className={styles.skillName}>{skill.name}</span>
                    <span className={styles.skillLevel}>Lvl {skill.level}</span>
                  </div>
                  <div className={styles.skillTrack}>
                    <div
                      className={styles.skillFill}
                      style={{
                        backgroundColor: skill.color,
                        width: animate ? `${skill.xpPercent}%` : "0%",
                      }}
                    />
                  </div>
                  <div className={styles.skillFooter}>
                    <span className={styles.skillXP}>{skill.xpPercent}% Mastered</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Campaign Missions Showcase */}
        <div className={`${styles.missionsSection} stagger-item`}>
          <h3 className={styles.panelTitle}>Campaign Missions Completed</h3>
          <div className={styles.missionsGrid}>
            {missions.map((mission, idx) => (
              <div
                key={idx}
                className={styles.missionCard}
                style={{ "--mission-accent": mission.accent } as React.CSSProperties}
              >
                <div className={styles.missionHeader}>
                  <span className={styles.missionBadge}>{mission.badge}</span>
                  <span className={styles.missionXP}>{mission.xp}</span>
                </div>
                <h4 className={styles.missionTitle}>{mission.title}</h4>
                <p className={styles.missionDesc}>{mission.desc}</p>
                <div className={styles.missionFooter}>
                  <span className={styles.statusSuccess}>● Mission Accomplished</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
