"use client";

import React, { useState } from "react";
import styles from "./ContactForm.module.css";

interface WebhookStep {
  title: string;
  subtext: string;
  status: "pending" | "processing" | "success";
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeOverlayStep, setActiveOverlayStep] = useState(0);
  const [jsonOutput, setJsonOutput] = useState("");

  const [steps, setSteps] = useState<WebhookStep[]>([
    { title: "Hook Listener 443", subtext: "Awaiting incoming JSON payload...", status: "pending" },
    { title: "AI Intent Parser (Claude API)", subtext: "Analyzing project scope and priority...", status: "pending" },
    { title: "GoHighLevel CRM Sync", subtext: "Upserting contact and pipeline opportunity...", status: "pending" },
    { title: "Slack Alert Broadcast", subtext: "Dispatching team notification webhook...", status: "pending" }
  ]);

  const updateStepStatus = (index: number, status: WebhookStep["status"], subtext?: string) => {
    setSteps(prev => {
      const copy = [...prev];
      copy[index].status = status;
      if (subtext) copy[index].subtext = subtext;
      return copy;
    });
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setService("");
    setMessage("");
    setShowOverlay(false);
    setIsSubmitting(false);
    setActiveOverlayStep(0);
    setSteps([
      { title: "Hook Listener 443", subtext: "Awaiting incoming JSON payload...", status: "pending" },
      { title: "AI Intent Parser (Claude API)", subtext: "Analyzing project scope and priority...", status: "pending" },
      { title: "GoHighLevel CRM Sync", subtext: "Upserting contact and pipeline opportunity...", status: "pending" },
      { title: "Slack Alert Broadcast", subtext: "Dispatching team notification webhook...", status: "pending" }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setShowOverlay(true);

    const payload = {
      event: "portfolio_inbound_lead",
      timestamp: new Date().toISOString(),
      data: {
        name,
        email,
        service,
        message: message.substring(0, 150) + (message.length > 150 ? "..." : "")
      }
    };

    setJsonOutput(`// Connecting to webhook URL...\nGET https://api.nilesh.vijay/v1/inbound ...`);

    // Simulated Webhook Pipeline sequence
    // Step 1: Listening/Received
    setTimeout(() => {
      setActiveOverlayStep(1);
      updateStepStatus(0, "processing", "Parsing header tokens & headers...");
    }, 400);

    setTimeout(() => {
      updateStepStatus(0, "success", "Payload parsed successfully.");
      setJsonOutput(JSON.stringify(payload, null, 2));
      
      // Step 2: AI Intent Parsing
      setActiveOverlayStep(2);
      updateStepStatus(1, "processing", "Running prompt template analysis...");
    }, 1200);

    setTimeout(() => {
      const intentAnalysis = {
        lead_priority: "HIGH",
        inquiry_intent: "Project proposal / Freelance hire",
        classification: service,
        sentiment_score: 0.94,
        suggested_action: "Schedule discovery call immediately."
      };
      updateStepStatus(1, "success", "Sentiment: Positive | Priority: High");
      setJsonOutput(JSON.stringify({ ...payload, ai_insights: intentAnalysis }, null, 2));

      // Step 3: GHL CRM Sync
      setActiveOverlayStep(3);
      updateStepStatus(2, "processing", "Querying GHL contact record database...");
    }, 2500);

    setTimeout(() => {
      const ghlSync = {
        contact_id: "ghl_lead_9a82c",
        status: "UPSERT_SUCCESS",
        pipeline: "Portfolio Contacts",
        stage: "Discovery Inbound",
        assigned_user: "Nilesh Vijay"
      };
      updateStepStatus(2, "success", "Contact created. Opportunity card added to funnel.");
      setJsonOutput(JSON.stringify({ ...payload, ghl_sync: ghlSync }, null, 2));

      // Step 4: Slack dispatch
      setActiveOverlayStep(4);
      updateStepStatus(3, "processing", "Pushing blocks payload to Slack webhook...");
    }, 3800);

    setTimeout(() => {
      updateStepStatus(3, "success", "Alert published on channel #portfolio-leads.");
      setJsonOutput(`// Webhook workflow completed successfully!\n// Response 200 OK - Lead synced in 4.2s.`);
      setActiveOverlayStep(5); // Complete state
    }, 4800);
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Get In Touch</span>
          <h2 className={styles.title}>Let's Build Something Great</h2>
          <p className={styles.subtitle}>Fill out the form to trigger my portfolio intake webhook and watch AI lead automation process your details in real-time.</p>
        </div>

        <div className={styles.grid}>
          {/* Form details side */}
          <div className={`${styles.infoCol} stagger-item`}>
            <h3 className={styles.infoTitle}>Connect With Me</h3>
            <p className={styles.infoText}>
              Whether you need a performant custom web application built, your GoHighLevel funnels optimized with custom code, or high-throughput n8n/Zapier automation pipelines configured, let's talk.
            </p>

            <div className={styles.contactItems}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>📬</div>
                <div className={styles.contactTexts}>
                  <span className={styles.contactLabel}>Email Address</span>
                  <a href="mailto:nileshvijay2002@gmail.com" className={styles.contactLink}>nileshvijay2002@gmail.com</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>📞</div>
                <div className={styles.contactTexts}>
                  <span className={styles.contactLabel}>Phone / WhatsApp</span>
                  <a href="tel:+918003398749" className={styles.contactLink}>+91 80033 98749</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>🌐</div>
                <div className={styles.contactTexts}>
                  <span className={styles.contactLabel}>GitHub Profile</span>
                  <a href="https://github.com/Nileshmechlin" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>github.com/Nileshmechlin</a>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>📍</div>
                <div className={styles.contactTexts}>
                  <span className={styles.contactLabel}>Location</span>
                  <span className={styles.contactLink}>Kota, Rajasthan, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <div className={`${styles.formPanel} stagger-item`}>
            {!showOverlay ? (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className={styles.formInput} 
                      placeholder="Alex Carter" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.formLabel}>Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className={styles.formInput} 
                      placeholder="alex@startup.io" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="service" className={styles.formLabel}>Primary Project Requirement</label>
                  <select 
                    id="service" 
                    className={styles.formSelect}
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a capability...</option>
                    <option value="AI & Automation">AI & Workflow Automation (n8n/Zapier)</option>
                    <option value="GoHighLevel">GoHighLevel snap setup & custom APIs</option>
                    <option value="Full Stack Dev">Full-Stack Web App Development</option>
                    <option value="Consulting">General Integration Consultation</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>Project Details</label>
                  <textarea 
                    id="message" 
                    className={styles.formTextarea} 
                    rows={4} 
                    placeholder="Describe what you want to automate or code..." 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitBtn}>
                  Trigger Intake Webhook
                </button>
              </form>
            ) : (
              /* Webhook Process Panel Overlay */
              <div className={styles.webhookOverlay}>
                <div className={styles.webhookHeader}>
                  <div className={styles.pulseDot}></div>
                  <h4 className={styles.webhookTitle}>Lead Intake Webhook Status</h4>
                </div>

                <div className={styles.webhookSteps}>
                  {steps.map((step, idx) => {
                    let statusClass = styles.stepPending;
                    if (step.status === "processing") statusClass = styles.stepProcessing;
                    if (step.status === "success") statusClass = styles.stepSuccess;

                    return (
                      <div key={idx} className={`${styles.webhookStep} ${statusClass}`}>
                        <div className={styles.stepIndicator}>
                          {step.status === "success" ? "✓" : step.status === "processing" ? "●" : "○"}
                        </div>
                        <div className={styles.stepTexts}>
                          <span className={styles.stepTitle}>{step.title}</span>
                          <span className={styles.stepSubtext}>{step.subtext}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live JSON Payload output */}
                <div className={styles.jsonWrapper}>
                  <pre><code className={styles.jsonCode}>{jsonOutput}</code></pre>
                </div>

                {activeOverlayStep === 5 && (
                  <button 
                    onClick={resetForm} 
                    className={`${styles.submitBtn} ${styles.btnReset} animate-fade-in`}
                  >
                    Close Webhook Console
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
