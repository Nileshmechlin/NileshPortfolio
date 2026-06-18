"use client";

import React, { useEffect, useState } from "react";
import ThreeDCanvas from "./ThreeDCanvas";
import DotPortrait from "./DotPortrait";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentRoles, setCurrentRoles] = useState([
    "AI Automation Engineer",
    "Full-Stack Developer",
    "RAG & Vector AI Specialist",
    "GoHighLevel Architect"
  ]);

  const typingSpeed = 70;
  const deletingSpeed = 40;
  const pauseTime = 2000;

  const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 });
  const [btnOffsetPrimary, setBtnOffsetPrimary] = useState({ x: 0, y: 0 });
  const [btnOffsetSecondary, setBtnOffsetSecondary] = useState({ x: 0, y: 0 });

  const btnPrimaryRef = React.useRef<HTMLAnchorElement>(null);
  const btnSecondaryRef = React.useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Background Grid Tilt
      const xOffset = (e.clientX / window.innerWidth - 0.5) * -60;
      const yOffset = (e.clientY / window.innerHeight - 0.5) * -60;
      setGridOffset({ x: xOffset, y: yOffset });

      // Magnetic Button Primary
      if (btnPrimaryRef.current) {
        const rect = btnPrimaryRef.current.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const dx = e.clientX - btnCenterX;
        const dy = e.clientY - btnCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80) {
          const pull = (1 - dist / 80) * 12; // 12px max pull
          setBtnOffsetPrimary({ x: (dx / 80) * pull, y: (dy / 80) * pull });
        } else {
          setBtnOffsetPrimary({ x: 0, y: 0 });
        }
      }

      // Magnetic Button Secondary
      if (btnSecondaryRef.current) {
        const rect = btnSecondaryRef.current.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const dx = e.clientX - btnCenterX;
        const dy = e.clientY - btnCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80) {
          const pull = (1 - dist / 80) * 12; // 12px max pull
          setBtnOffsetSecondary({ x: (dx / 80) * pull, y: (dy / 80) * pull });
        } else {
          setBtnOffsetSecondary({ x: 0, y: 0 });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleInterest = (e: Event) => {
      const customEvent = e as CustomEvent;
      const interest = customEvent.detail;
      
      let priorityRole = "";
      if (interest === "automation") priorityRole = "AI Automation Engineer";
      else if (interest === "ghl") priorityRole = "GoHighLevel Architect";
      else if (interest === "fullstack") priorityRole = "RAG & Vector AI Specialist";

      if (priorityRole) {
        setCurrentRoles((prev) => {
          if (prev[0] === priorityRole) return prev; // Already prioritized
          const filtered = prev.filter((r) => r !== priorityRole);
          return [priorityRole, ...filtered];
        });
        setRoleIndex(0);
        setCharIndex(0);
        setIsDeleting(false);
        setTypedText("");
      }
    };

    window.addEventListener("visitor-interest", handleInterest);
    return () => window.removeEventListener("visitor-interest", handleInterest);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentRole = currentRoles[roleIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(currentRole.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      }, deletingSpeed);
    } else if (charIndex < currentRole.length) {
      timer = setTimeout(() => {
        setTypedText(currentRole.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    }

    // Handle end of typing / deletion state changes
    if (!isDeleting && charIndex === currentRole.length) {
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % currentRoles.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, roleIndex, currentRoles]);

  return (
    <section id="hero" className={styles.section}>
      {/* 3D Perspective Grid Background */}
      <div 
        className={styles.floorGrid} 
        style={{ 
          "--grid-offset-x": `${gridOffset.x}px`, 
          "--grid-offset-y": `${gridOffset.y}px` 
        } as React.CSSProperties} 
      />
      
      <div className={styles.grid}>
        {/* Left text content — dot portrait ghost behind it */}
        <div className={styles.textContent}>
          {/* Ghost dot portrait — face visible */}
          <div className={styles.portraitBg}>
            <DotPortrait
              src="/nilesh-photo.jpg"
              alt="Nilesh Vijay"
              ghostMode
              showLabel={false}
              cropFrom={0}
              cropHeight={1}
              renderMode="image"
            />
          </div>

          {/* Text content layers above portrait */}
          <div className={styles.textInner}>
            <div className={styles.badge}>
              <span className={styles.badgePulse} />
              US · EU · AEST Time Zones — Open to Relocation
            </div>

            <h1 className={styles.title}>
              Hi, I'm <span className={styles.name}>Nilesh Vijay</span>
              <span className={styles.tagline}>AI Automation Engineer &amp; Full Stack Developer</span>
            </h1>

            <div className={styles.typewriterWrapper}>
              <span className={styles.typewriterLabel}>specialist in</span>{" "}
              <span className={styles.typewriterText}>{typedText}</span>
              <span className={styles.caret}>|</span>
            </div>

            <p className={styles.subtitle}>
              Specializing in building mission-control dashboards, AI voice calling funnels, and search-optimized systems like the **AI SEO Content Engine** (which automatically finds trends, removes duplicates, writes high-quality articles, humanizes content, and publishes automatically). I convert manual pipelines into autonomous, high-performing revenue engines.
            </p>

            <div className={styles.ctas}>
              <a 
                ref={btnPrimaryRef}
                href="#playground" 
                className={styles.btnPrimary}
                style={{ transform: `translate3d(${btnOffsetPrimary.x}px, ${btnOffsetPrimary.y}px, 0)` }}
              >
                Try Automation Lab
              </a>
              <a 
                ref={btnSecondaryRef}
                href="#contact" 
                className={styles.btnSecondary}
                style={{ transform: `translate3d(${btnOffsetSecondary.x}px, ${btnOffsetSecondary.y}px, 0)` }}
              >
                Start Intake Webhook
              </a>
            </div>
          </div>
        </div>

        {/* Right side: 3D Tesseract canvas — fully preserved */}
        <div className={styles.visualContent}>
          <ThreeDCanvas />
        </div>
      </div>
    </section>
  );
}
