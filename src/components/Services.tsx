"use client";

import React from "react";
import TiltCard from "./TiltCard";
import styles from "./Services.module.css";

interface ServiceItem {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentClass: string;
  skills: string[];
  graphic: React.ReactNode;
}

export default function Services() {
  const services: ServiceItem[] = [
    {
      number: "01",
      title: "AI & Workflow Automation",
      description: "Designing end-to-end multi-platform integration pipelines. I build secure event-driven automations with built-in human-in-the-loop gates.",
      accentClass: styles.accentPurple,
      skills: [
        "n8n Self-hosted Workflow Architectures",
        "Zapier & Make Multi-stage Integrations",
        "Human-in-the-Loop Review Gate Systems",
        "LLM Prompt Engineering (GPT-4 · Claude)"
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.cardHeaderIcon}>
          <rect x="3" y="3" width="6" height="6" rx="1.5" />
          <rect x="15" y="3" width="6" height="6" rx="1.5" />
          <rect x="9" y="15" width="6" height="6" rx="1.5" />
          <path d="M6 9v2a2 2 0 0 0 2 2h2m0 0v-2l3 2-3 2v-2" />
          <path d="M18 9v2a2 2 0 0 1-2 2h-2" />
        </svg>
      ),
      graphic: (
        <svg className={styles.isometricGraphic} viewBox="0 0 100 100" fill="none">
          <path d="M10 50 L50 30 L90 50 L50 70 Z" stroke="rgba(138, 43, 226, 0.15)" strokeWidth="1" />
          <path d="M20 50 L50 35 L80 50 L50 65 Z" stroke="rgba(138, 43, 226, 0.1)" strokeWidth="0.8" />
          <g className={styles.isometricStack}>
            <path d="M30 62 L50 52 L70 62 L50 72 Z" fill="rgba(138, 43, 226, 0.2)" stroke="var(--purple)" strokeWidth="0.8" />
            <path d="M30 62 L30 65 L50 75 L50 72 Z" fill="rgba(138, 43, 226, 0.4)" stroke="var(--purple)" strokeWidth="0.8" />
            <path d="M70 62 L70 65 L50 75 L50 72 Z" fill="rgba(138, 43, 226, 0.3)" stroke="var(--purple)" strokeWidth="0.8" />
            <path d="M30 50 L50 40 L70 50 L50 60 Z" fill="rgba(138, 43, 226, 0.3)" stroke="var(--purple)" strokeWidth="0.8" />
            <path d="M30 50 L30 53 L50 63 L50 60 Z" fill="rgba(138, 43, 226, 0.5)" stroke="var(--purple)" strokeWidth="0.8" />
            <path d="M70 50 L70 53 L50 63 L50 60 Z" fill="rgba(138, 43, 226, 0.4)" stroke="var(--purple)" strokeWidth="0.8" />
            <path d="M30 38 L50 28 L70 38 L50 48 Z" fill="rgba(138, 43, 226, 0.45)" stroke="var(--purple)" strokeWidth="1" />
            <path d="M30 38 L30 41 L50 51 L50 48 Z" fill="rgba(138, 43, 226, 0.65)" stroke="var(--purple)" strokeWidth="1" />
            <path d="M70 38 L70 41 L50 51 L50 48 Z" fill="rgba(138, 43, 226, 0.55)" stroke="var(--purple)" strokeWidth="1" />
          </g>
        </svg>
      )
    },
    {
      number: "02",
      title: "GoHighLevel & AI Voice",
      description: "Maxing out CRM potential. I configure advanced agency snapshots, code custom API triggers, and deploy vocode AI call agents and notetakers.",
      accentClass: styles.accentBlue,
      skills: [
        "GHL Snapshots, Pipelines & Custom Values",
        "Vocode & VAPI AI Calling Agents",
        "CloseBot & Conversational CRM Workflows",
        "Twilio SMS & Voice Deliverability Setup"
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.cardHeaderIcon}>
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
          <line x1="12" y1="18" x2="12" y2="22" />
        </svg>
      ),
      graphic: (
        <svg className={styles.isometricGraphic} viewBox="0 0 100 100" fill="none">
          <path d="M10 60 L50 40 L90 60 L50 80 Z" stroke="rgba(0, 117, 255, 0.15)" strokeWidth="1" />
          <g className={styles.audioWaveIsometric}>
            <path d="M35 50 L35 60 L40 62.5 L40 52.5 Z" fill="rgba(0, 117, 255, 0.4)" stroke="var(--blue)" strokeWidth="0.8" />
            <path d="M45 35 L45 58 L50 60.5 L50 37.5 Z" fill="rgba(0, 255, 240, 0.5)" stroke="var(--blue)" strokeWidth="0.8" />
            <path d="M55 42 L55 56 L60 58.5 L60 44.5 Z" fill="rgba(0, 117, 255, 0.45)" stroke="var(--blue)" strokeWidth="0.8" />
            <path d="M65 48 L65 54 L70 56.5 L70 50.5 Z" fill="rgba(0, 117, 255, 0.3)" stroke="var(--blue)" strokeWidth="0.8" />
          </g>
        </svg>
      )
    },
    {
      number: "03",
      title: "Full-Stack SaaS & RAG",
      description: "Engineering robust web products and semantic retrieval pipelines. I build Next.js applications integrated with Qdrant vector databases.",
      accentClass: styles.accentOrange,
      skills: [
        "SaaS Dev (Next.js · Node.js · TypeScript)",
        "RAG (Qdrant Vector DB · Jina AI Embeddings)",
        "Real-Time Interfaces (WebSockets · Socket.io)",
        "Secure API endpoints & AWS Deployments"
      ],
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.cardHeaderIcon}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="10" y1="21" x2="14" y2="3" />
        </svg>
      ),
      graphic: (
        <svg className={styles.isometricGraphic} viewBox="0 0 100 100" fill="none">
          <path d="M10 50 L50 30 L90 50 L50 70 Z" stroke="rgba(255, 92, 0, 0.15)" strokeWidth="1" />
          <g className={styles.databaseIsometric}>
            <path d="M30 55 C30 50, 70 50, 70 55 C70 60, 30 60, 30 55" fill="rgba(255, 92, 0, 0.2)" stroke="var(--orange)" strokeWidth="0.8" />
            <path d="M30 55 L30 60 C30 65, 70 65, 70 60 L70 55" fill="rgba(255, 92, 0, 0.3)" stroke="var(--orange)" strokeWidth="0.8" />
            <path d="M30 45 C30 40, 70 40, 70 45 C70 50, 30 50, 30 45" fill="rgba(255, 92, 0, 0.3)" stroke="var(--orange)" strokeWidth="0.8" />
            <path d="M30 45 L30 50 C30 55, 70 55, 70 50 L70 45" fill="rgba(255, 92, 0, 0.4)" stroke="var(--orange)" strokeWidth="0.8" />
            <path d="M30 35 C30 30, 70 30, 70 35 C70 40, 30 40, 30 35" fill="rgba(255, 92, 0, 0.45)" stroke="var(--orange)" strokeWidth="1" />
            <path d="M30 35 L30 40 C30 45, 70 45, 70 40 L70 35" fill="rgba(255, 92, 0, 0.6)" stroke="var(--orange)" strokeWidth="1" />
          </g>
        </svg>
      )
    }
  ];

  return (
    <section id="services" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={styles.badgeStar}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
            </svg>
            WHAT I DO BEST
          </span>
          <h2 className={styles.title}>
            Core <span className={styles.gradientTitle}>Competencies</span>
          </h2>
          <p className={styles.subtitle}>
            Engineering high-performance systems and automations that scale, secure, and deliver{" "}
            <span className={styles.gradientTextBlue}>measurable impact</span>.
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <div 
              key={index} 
              className="borderBeamContainer stagger-item"
              onMouseEnter={() => {
                const category = index === 0 ? "automation" : index === 1 ? "ghl" : "fullstack";
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("visitor-interest", { detail: category }));
                }
              }}
              onMouseLeave={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("visitor-interest", { detail: "default" }));
                }
              }}
            >
              <TiltCard className={`${styles.card} ${service.accentClass}`}>
                <div className={styles.cardGlow} />
                
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    {service.icon}
                  </div>
                  <div className={styles.numberWrapper}>
                    <span className={styles.cardNumber}>{service.number}</span>
                    <span className={styles.cardLine} />
                  </div>
                </div>

                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <p className={styles.cardDescription}>{service.description}</p>
                  
                  <ul className={styles.skillList}>
                    {service.skills.map((skill, sIdx) => (
                      <li key={sIdx} className={styles.skillItem}>
                        <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {skill}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.cardFooter}>
                    <a href="#playground" className={styles.exploreLink}>
                      Explore Solutions
                      <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  </div>
                </div>

                {service.graphic}
              </TiltCard>
            </div>
          ))}
        </div>

        <div className={styles.bannerContainer}>
          <div className={styles.bannerGrid}>
            <div className={styles.bannerItem}>
              <div className={styles.bannerIconWrapper}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className={styles.bannerText}>
                <span className={styles.bannerTitle}>Secure by Design</span>
                <span className={styles.bannerSub}>Security at every layer</span>
              </div>
            </div>

            <div className={styles.bannerItem}>
              <div className={styles.bannerIconWrapper}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4.5 16.5c-1.5 1.25-2.5 3-2.5 4.5h20c0-1.5-1-3.25-2.5-4.5" />
                  <path d="M12 2s-5 4-5 10c0 3 1.5 5 5 7 3.5-2 5-4 5-7 0-6-5-10-5-10z" />
                </svg>
              </div>
              <div className={styles.bannerText}>
                <span className={styles.bannerTitle}>Scalable Architectures</span>
                <span className={styles.bannerSub}>Built for growth</span>
              </div>
            </div>

            <div className={styles.bannerItem}>
              <div className={styles.bannerIconWrapper}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <div className={styles.bannerText}>
                <span className={styles.bannerTitle}>Automation First</span>
                <span className={styles.bannerSub}>Work less, achieve more</span>
              </div>
            </div>

            <div className={styles.bannerItem}>
              <div className={styles.bannerIconWrapper}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className={styles.bannerText}>
                <span className={styles.bannerTitle}>Measurable Impact</span>
                <span className={styles.bannerSub}>Results that matter</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
