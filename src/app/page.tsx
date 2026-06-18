"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

// Components imports
import FloatingBackground from "../components/FloatingBackground";
import AICloneChat from "../components/AICloneChat";
import HeroSection from "../components/HeroSection";
import Services from "../components/Services";
import AutomationLab from "../components/AutomationLab";
import Projects from "../components/Projects";
import ProgressionDashboard from "../components/ProgressionDashboard";
import Timeline from "../components/Timeline";
import ContactForm from "../components/ContactForm";
import WorkflowModal from "../components/WorkflowModal";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeSection, setActiveSection] = useState("hero");
  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);
  const [workflowModalTitle, setWorkflowModalTitle] = useState("");

  // Force scroll to top on mount and clear any hash to prevent auto-scroll
  useEffect(() => {
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
    }
    window.scrollTo(0, 0);
  }, []);

  // Sync theme with localStorage & system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      const initialTheme = prefersLight ? "light" : "dark";
      setTheme(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  // Monitor scroll to apply sticky header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active Section Scroll Spy
  useEffect(() => {
    const sectionIds = ["hero", "services", "playground", "work", "progression", "experience", "contact"];
    
    const observerOptions = {
      root: null,
      rootMargin: "-45% 0px -45% 0px", // Detect middle of the viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Map special section names or keep simple
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // IntersectionObserver for 3D scroll unfolding reveals
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px -10px -40px -10px", // Margins to trigger unfolds slightly before view
      threshold: 0.08
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealActive");
          observer.unobserve(entry.target); // Trigger only once
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".revealNode");
    revealElements.forEach((el) => observer.observe(el));

    // Instantly reveal sections on hash links navigation
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          const revealParent = targetEl.closest(".revealNode");
          if (revealParent) {
            revealParent.classList.add("revealActive");
          }
          if (targetEl.classList.contains("revealNode")) {
            targetEl.classList.add("revealActive");
          }
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // Check initial hash on load after layout shifts settle
    const initialTimeout = setTimeout(handleHashChange, 300);

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      window.removeEventListener("hashchange", handleHashChange);
      clearTimeout(initialTimeout);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={styles.appContainer}>
      {/* Scroll parallax objects */}
      <FloatingBackground />

      {/* AI Chat clone widget */}
      <AICloneChat />

      {/* Navigation Header */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.headerContainer}>
          <a href="#" className={styles.logo}>
            <span className={styles.logoText}>NILESH</span>
            <span className={styles.logoAccent}>.VIJAY</span>
            <span className={styles.logoDot}></span>
          </a>

          <nav className={styles.navMenu}>
            <a href="#hero" className={`${styles.navLink} ${activeSection === "hero" ? styles.navLinkActive : ""}`}>Home</a>
            <a href="#services" className={`${styles.navLink} ${activeSection === "services" ? styles.navLinkActive : ""}`}>Services</a>
            <a href="#playground" className={`${styles.navLink} ${activeSection === "playground" ? styles.navLinkActive : ""}`}>Automation Lab</a>
            <a href="#work" className={`${styles.navLink} ${activeSection === "work" ? styles.navLinkActive : ""}`}>Projects</a>
            <a href="#progression" className={`${styles.navLink} ${activeSection === "progression" ? styles.navLinkActive : ""}`}>Achievements</a>
            <a href="#experience" className={`${styles.navLink} ${activeSection === "experience" ? styles.navLinkActive : ""}`}>Experience</a>
            <a href="#contact" className={`${styles.navLink} ${activeSection === "contact" ? styles.navLinkActive : ""}`}>Contact</a>
          </nav>

          <div className={styles.headerActions}>
            <button 
              className={styles.themeToggle} 
              onClick={toggleTheme}
              aria-label={`Toggle theme to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.themeIcon}>
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.themeIcon}>
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>

            <div className={styles.headerCta}>
              <a href="#contact" className={styles.btnSm}>Book a Call</a>
            </div>
          </div>

          {/* Mobile hamburger menu */}
          <button 
            className={`${styles.mobileToggle} ${mobileMenuOpen ? styles.toggleOpen : ""}`} 
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
          >
            <span className={styles.toggleLine}></span>
            <span className={styles.toggleLine}></span>
            <span className={styles.toggleLine}></span>
          </button>
        </div>
      </header>

      {/* Mobile nav drawer */}
      <div className={`${styles.mobileDrawer} ${mobileMenuOpen ? styles.drawerOpen : ""}`}>
        <nav className={styles.mobileNav}>
          <a href="#hero" onClick={toggleMobileMenu} className={`${styles.mobileLink} ${activeSection === "hero" ? styles.mobileLinkActive : ""}`}>Home</a>
          <a href="#services" onClick={toggleMobileMenu} className={`${styles.mobileLink} ${activeSection === "services" ? styles.mobileLinkActive : ""}`}>Services</a>
          <a href="#playground" onClick={toggleMobileMenu} className={`${styles.mobileLink} ${activeSection === "playground" ? styles.mobileLinkActive : ""}`}>Automation Lab</a>
          <a href="#work" onClick={toggleMobileMenu} className={`${styles.mobileLink} ${activeSection === "work" ? styles.mobileLinkActive : ""}`}>Projects</a>
          <a href="#progression" onClick={toggleMobileMenu} className={`${styles.mobileLink} ${activeSection === "progression" ? styles.mobileLinkActive : ""}`}>Achievements</a>
          <a href="#experience" onClick={toggleMobileMenu} className={`${styles.mobileLink} ${activeSection === "experience" ? styles.mobileLinkActive : ""}`}>Experience</a>
          <a href="#contact" onClick={toggleMobileMenu} className={`${styles.mobileLink} ${activeSection === "contact" ? styles.mobileLinkActive : ""}`}>Contact</a>
          
          {/* Theme Switcher inside mobile menu as well */}
          <button 
            className={styles.mobileThemeToggle} 
            onClick={() => { toggleTheme(); toggleMobileMenu(); }}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
          </button>
          
          <a href="#contact" onClick={toggleMobileMenu} className={styles.btnMobileCta}>Book a Call</a>
        </nav>
      </div>

      <main className={styles.main}>
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Services Section */}
        <div className="revealNode">
          <Services />
        </div>

        {/* 3. Automation Playground */}
        <div className="revealNode">
          <AutomationLab />
        </div>

        {/* 4. Projects Showcase */}
        <div className="revealNode">
          <Projects onInspect={(title) => {
            setWorkflowModalTitle(title);
            setWorkflowModalOpen(true);
          }} />
        </div>

        {/* 4.25 RPG Career Progression stats */}
        <div className="revealNode">
          <ProgressionDashboard />
        </div>

        {/* 4.5 Experience Journey Timeline */}
        <div className="revealNode">
          <Timeline />
        </div>

        {/* 5. Metrics / Impact Stats Section */}
        <div className="revealNode">
          <section className={styles.statsSection}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statNum}>500,000+</div>
                <div className={styles.statLabel}>Automated Tasks Run</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNum}>200+</div>
                <div className={styles.statLabel}>Monthly Hours Saved</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNum}>99.9%</div>
                <div className={styles.statLabel}>API Pipeline Uptime</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNum}>50+</div>
                <div className={styles.statLabel}>Businesses Automating</div>
              </div>
            </div>
          </section>
        </div>

        {/* 6. Contact and Intake Form */}
        <div className="revealNode">
          <ContactForm />
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerCopyright}>
            &copy; 2026 Nilesh Vijay. Designed and Engineered with precision.
          </div>
          <div className={styles.footerSocials}>
            <a href="https://github.com/Nileshmechlin" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
              <svg viewBox="0 0 24 24" className={styles.socialIcon}>
                <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" className={styles.socialIcon}>
                <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.8v8.37h2.8v-4.87c0-.26.05-.52.12-.7a1.16 1.16 0 0 1 1.06-.75c.75 0 1.04.57 1.04 1.4v4.92h2.8M6.5 8.37a1.37 1.37 0 1 0 0-2.75 1.37 1.37 0 0 0 0 2.75M8 18.5V10.13H5.2V18.5H8z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* n8n Live Workflow Modal */}
      <WorkflowModal 
        isOpen={workflowModalOpen} 
        onClose={() => setWorkflowModalOpen(false)} 
        projectTitle={workflowModalTitle} 
      />
    </div>
  );
}
