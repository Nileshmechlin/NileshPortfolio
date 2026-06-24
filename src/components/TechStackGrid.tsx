"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./TechStackGrid.module.css";

import { BrainCircuit, Bot, PhoneCall, Database, Laptop, Cloud } from "lucide-react";

const techCategories = [
  {
    name: "AI & LLMs",
    icon: <BrainCircuit size={26} color="var(--purple)" />,
    color: "var(--purple)",
    items: ["GPT-4o", "Claude 3.5", "Groq", "Jina AI", "DeepSeek", "LangChain"]
  },
  {
    name: "Automation",
    icon: <Bot size={26} color="var(--orange)" />,
    color: "var(--orange)",
    items: ["n8n", "Make.com", "Zapier", "GoHighLevel", "Stripe API", "HubSpot"]
  },
  {
    name: "Voice AI",
    icon: <PhoneCall size={26} color="var(--blue)" />,
    color: "var(--blue)",
    items: ["Twilio", "Vocode", "Vapi AI", "Retell AI", "Deepgram", "11Labs"]
  },
  {
    name: "Backend & DB",
    icon: <Database size={26} color="var(--green)" />,
    color: "var(--green)",
    items: ["Node.js", "FastAPI", "Supabase", "PostgreSQL", "Qdrant", "Redis"]
  },
  {
    name: "Frontend",
    icon: <Laptop size={26} color="var(--foreground)" />,
    color: "var(--foreground)",
    items: ["Next.js", "React", "TypeScript", "TailwindCSS", "Framer Motion", "Flutter"]
  },
  {
    name: "Cloud & DevOps",
    icon: <Cloud size={26} color="var(--orange)" />,
    color: "var(--orange)",
    items: ["AWS S3", "Docker", "Vercel", "Git / GitHub", "Cloudflare", "Nginx"]
  }
];

export default function TechStackGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="tech-stack" className={styles.section} ref={containerRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Technology</span>
          <h2 className={styles.title}>Core Infrastructure Stack</h2>
          <p className={styles.subtitle}>
            Enterprise-grade tools and frameworks used to orchestrate scalable AI systems.
          </p>
        </div>

        <div className={`${styles.grid} ${isVisible ? styles.animate : ""}`}>
          {techCategories.map((category, idx) => (
            <div 
              key={idx} 
              className={styles.categoryCard}
              style={{ "--card-accent": category.color, animationDelay: `${idx * 0.1}s` } as React.CSSProperties}
            >
              <div className={styles.cardGlow}></div>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>{category.icon}</span>
                <h3 className={styles.cardTitle}>{category.name}</h3>
              </div>
              
              <div className={styles.itemsGrid}>
                {category.items.map((item, iIdx) => (
                  <span key={iIdx} className={styles.techPill}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
