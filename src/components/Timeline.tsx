"use client";

import React from "react";
import TiltCard from "./TiltCard";
import styles from "./Timeline.module.css";

interface TimelineEvent {
  role: string;
  company: string;
  location: string;
  duration: string;
  bullets: string[];
  tags: string[];
}

export default function Timeline() {
  const experiences: TimelineEvent[] = [
    {
      role: "Senior Automation & AI Engineer",
      company: "Bellagio Real Estate",
      location: "Arizona, USA (Remote)",
      duration: "October 2025 – Present",
      bullets: [
        "Architected full-scale GHL automation ecosystem including pipelines, triggers, and multi-stage lead workflows.",
        "Built Bellagio Employee Hub for internal team operations and workflow management.",
        "Developed AI voice calling system using Vocode for real-time inbound and outbound interactions.",
        "Implemented Twilio-based SMS and voice automation with deliverability optimisation.",
        "Designed KPI dashboards tracking funnel performance, conversion rates, and engagement metrics.",
        "Integrated CRM with external systems via REST APIs and webhooks."
      ],
      tags: ["Vocode", "Twilio API", "GHL API v2", "KPI Dashboards", "REST APIs"]
    },
    {
      role: "AI Support Engineer (Freelance Contract)",
      company: "Closer Control – Real Estate Automation",
      location: "Remote",
      duration: "Feb 2026 – Apr 2026",
      bullets: [
        "Built end-to-end real estate automation systems using GoHighLevel (GHL) including pipelines, triggers, and lead workflows.",
        "Developed automated blog generation and publishing system with human-in-the-loop review before live posting to company websites.",
        "Designed AI-powered calling systems for lead qualification, follow-ups, and appointment booking.",
        "Implemented AI notetaker systems to capture and summarise call data directly into CRM.",
        "Optimised CloseBot workflows for automated lead engagement and conversion.",
        "Created multi-platform automation pipelines using n8n, Zapier, and Lovable."
      ],
      tags: ["GoHighLevel", "n8n", "CloseBot", "AI Calling", "Webhooks"]
    },
    {
      role: "Associate Software Developer",
      company: "Mechlin Technologies",
      location: "India",
      duration: "August 2024 – October 2025",
      bullets: [
        "Developed scalable SaaS applications using Next.js, Node.js, and TypeScript.",
        "Built REST and GraphQL APIs with secure authentication and role-based access control (RBAC).",
        "Implemented real-time features using WebSockets and Socket.IO for live updates and collaboration.",
        "Deployed applications on AWS and DigitalOcean using Docker and CI/CD pipelines.",
        "Collaborated in Agile teams delivering production-ready features on schedule."
      ],
      tags: ["Next.js", "TypeScript", "Node.js", "WebSockets", "AWS", "Docker"]
    },
    {
      role: "Freelance Automation & Full-Stack Developer",
      company: "Self-Employed",
      location: "Remote",
      duration: "January 2021 – July 2024",
      bullets: [
        "Delivered CRM, Twilio, email API, and webhook-based automation systems for SaaS and service businesses globally.",
        "Built custom funnels, landing pages, and frontend components using JavaScript and CSS.",
        "Designed end-to-end workflow automation reducing manual operations across multiple client industries."
      ],
      tags: ["JavaScript", "CSS", "Twilio", "Automation", "CRM Integrations"]
    }
  ];

  return (
    <section id="experience" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Journey</span>
          <h2 className={styles.title}>Professional Experience</h2>
          <p className={styles.subtitle}>A history of developing SaaS products and engineering enterprise-level AI workflow automations.</p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.line} />
          
          {experiences.map((exp, index) => (
            <div key={index} className={`${styles.item} stagger-item`}>
              {/* Dot marker */}
              <div className={styles.marker}>
                <div className={styles.markerInner} />
              </div>

              {/* Timestamp */}
              <div className={styles.timeWrapper}>
                <span className={styles.time}>{exp.duration}</span>
                <span className={styles.location}>{exp.location}</span>
              </div>

              {/* Experience Card */}
              <div className={`${styles.cardWrapper} borderBeamContainer`}>
                <TiltCard className={styles.card}>
                  <div className={styles.cardContent}>
                    <h3 className={styles.roleTitle}>{exp.role}</h3>
                    <h4 className={styles.companyName}>{exp.company}</h4>
                    
                    <ul className={styles.bullets}>
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className={styles.bulletItem}>
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    <div className={styles.tags}>
                      {exp.tags.map((tag, tIdx) => (
                        <span key={tIdx} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
