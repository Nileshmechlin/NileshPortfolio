"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./AutomationLab.module.css";

type TriggerType = "form" | "stripe" | "webhook";
type Action1Type = "gpt" | "priority";
type Action2Type = "ghl" | "slack";

interface LogLine {
  text: string;
  type: "system" | "info" | "success" | "error" | "ai" | "crm";
  time: string;
}

export default function AutomationLab() {
  const [trigger, setTrigger] = useState<TriggerType>("form");
  const [action1, setAction1] = useState<Action1Type>("gpt");
  const [action2, setAction2] = useState<Action2Type>("ghl");
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(0); // 0: idle, 1: trig, 2: line1, 3: act1, 4: line2, 5: act2, 6: success
  const [logs, setLogs] = useState<LogLine[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logs.length > 0 && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [logs]);

  const addLog = (text: string, type: LogLine["type"] = "info") => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${(now.getMilliseconds() / 10).toFixed(0).padStart(2, "0")}`;
    setLogs((prev) => [...prev, { text, type, time: timeStr }]);
  };

  const executeWorkflow = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs([]);
    setActiveStep(1);

    // Timeline execution script simulating n8n node logic
    setTimeout(() => {
      addLog("⚡ WORKFLOW ENGINE START: Listening for incoming payloads...", "system");
    }, 100);

    // 1. Trigger phase
    setTimeout(() => {
      if (trigger === "form") {
        addLog("▶️ Trigger Node [Form Submit]: Received input payload.", "info");
        addLog("   ↳ Contact payload: { name: 'Alex Carter', email: 'alex@startup.io' }", "info");
      } else if (trigger === "stripe") {
        addLog("▶️ Trigger Node [Stripe Webhook]: Received invoice.paid event.", "info");
        addLog("   ↳ Stripe payload: { amount: 120000, currency: 'USD', status: 'succeeded' }", "info");
      } else {
        addLog("▶️ Trigger Node [Custom Hook]: Received raw POST payload.", "info");
        addLog("   ↳ Raw JSON: { query: 'GHL onboarding checklist', lead_score: 95 }", "info");
      }
      setActiveStep(2); // Start pulse line 1
    }, 900);

    // 2. Action 1 phase (AI)
    setTimeout(() => {
      setActiveStep(3);
      if (action1 === "gpt") {
        addLog("🤖 Node [OpenAI GPT-4]: Processing system prompt draft...", "ai");
        addLog("   ↳ Generating personalized intro for 'Alex Carter'...", "ai");
        addLog("   ↳ AI draft generated: 'Hi Alex, saw your startup.io checkout...'", "ai");
      } else {
        addLog("🏷️ Node [AI Intent Classifier]: Evaluating sentiment analysis...", "ai");
        addLog("   ↳ Lead classified as [HIGH PRIORITY] based on content score.", "ai");
      }
      setActiveStep(4); // Start pulse line 2
    }, 2200);

    // 3. Action 2 phase (CRM & Alert)
    setTimeout(() => {
      setActiveStep(5);
      if (action2 === "ghl") {
        addLog("💼 Node [GoHighLevel Sync]: Connecting to GHL API v2...", "crm");
        addLog("   ↳ Contacts: Searching database for 'alex@startup.io'...", "crm");
        addLog("   ↳ Contact not found. Creating new contact records...", "crm");
        addLog("   ↳ Opportunity added to Pipeline [Active Prospects]. Stage: Lead Inbound.", "crm");
      } else {
        addLog("💬 Node [Slack Notifier]: Constructing JSON payload format...", "info");
        addLog("   ↳ Dispatching notification to #hq-leads channel...", "info");
        addLog("   ↳ Slack API Response: 200 OK { ok: true, channel: 'C03FG7L3' }", "info");
      }
    }, 3500);

    // 4. Success Completion
    setTimeout(() => {
      setActiveStep(6);
      addLog("✅ WORKFLOW EXECUTION COMPLETE. All nodes succeeded in 3.82s.", "success");
      setIsRunning(false);
    }, 4200);
  };

  const getTriggerLabel = () => {
    switch (trigger) {
      case "form": return "Form Submit";
      case "stripe": return "Stripe Hook";
      case "webhook": return "Custom Hook";
    }
  };

  const getAction1Label = () => {
    switch (action1) {
      case "gpt": return "AI Draft (GPT-4)";
      case "priority": return "AI Scoring";
    }
  };

  const getAction2Label = () => {
    switch (action2) {
      case "ghl": return "GHL CRM Sync";
      case "slack": return "Slack Alert";
    }
  };

  return (
    <section id="playground" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge}>Interactive Lab</span>
          <h2 className={styles.title}>The Automation Playground</h2>
          <p className={styles.subtitle}>Build your own logic sequence below and watch a live integration pipeline execute.</p>
        </div>

        <div className={styles.grid}>
          {/* Controls Panel */}
          <div className={`${styles.builderPanel} stagger-item`}>
            <h3 className={styles.panelTitle}>1. Setup Pipeline Node Logic</h3>
            
            {/* Triggers */}
            <div className={styles.formGroup}>
              <span className={styles.label}>Trigger Node (Input event)</span>
              <div className={styles.selectors}>
                <button 
                  className={`${styles.selectorBtn} ${trigger === "form" ? styles.activeOrange : ""}`}
                  onClick={() => !isRunning && setTrigger("form")}
                  disabled={isRunning}
                >
                  <span className={styles.selectorIcon}>⚡</span>
                  <div className={styles.selectorTexts}>
                    <span className={styles.selectorTitle}>Form Submission</span>
                    <span className={styles.selectorDesc}>Contact input fields</span>
                  </div>
                </button>
                <button 
                  className={`${styles.selectorBtn} ${trigger === "stripe" ? styles.activeGreen : ""}`}
                  onClick={() => !isRunning && setTrigger("stripe")}
                  disabled={isRunning}
                >
                  <span className={styles.selectorIcon}>💳</span>
                  <div className={styles.selectorTexts}>
                    <span className={styles.selectorTitle}>Stripe Checkout</span>
                    <span className={styles.selectorDesc}>Successful transactions</span>
                  </div>
                </button>
                <button 
                  className={`${styles.selectorBtn} ${trigger === "webhook" ? styles.activeBlue : ""}`}
                  onClick={() => !isRunning && setTrigger("webhook")}
                  disabled={isRunning}
                >
                  <span className={styles.selectorIcon}>🌐</span>
                  <div className={styles.selectorTexts}>
                    <span className={styles.selectorTitle}>REST Webhook</span>
                    <span className={styles.selectorDesc}>Accept raw JSON POSTs</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Action 1 */}
            <div className={styles.formGroup}>
              <span className={styles.label}>Action Node 1 (AI Processing)</span>
              <div className={styles.selectors}>
                <button 
                  className={`${styles.selectorBtn} ${action1 === "gpt" ? styles.activePurple : ""}`}
                  onClick={() => !isRunning && setAction1("gpt")}
                  disabled={isRunning}
                >
                  <span className={styles.selectorIcon}>🤖</span>
                  <div className={styles.selectorTexts}>
                    <span className={styles.selectorTitle}>GPT-4 Email Draft</span>
                    <span className={styles.selectorDesc}>Write personalized responses</span>
                  </div>
                </button>
                <button 
                  className={`${styles.selectorBtn} ${action1 === "priority" ? styles.activePink : ""}`}
                  onClick={() => !isRunning && setAction1("priority")}
                  disabled={isRunning}
                >
                  <span className={styles.selectorIcon}>🏷️</span>
                  <div className={styles.selectorTexts}>
                    <span className={styles.selectorTitle}>AI Intent Scorer</span>
                    <span className={styles.selectorDesc}>Qualify and segment leads</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Action 2 */}
            <div className={styles.formGroup}>
              <span className={styles.label}>Action Node 2 (Output / CRM Sync)</span>
              <div className={styles.selectors}>
                <button 
                  className={`${styles.selectorBtn} ${action2 === "ghl" ? styles.activeBlue : ""}`}
                  onClick={() => !isRunning && setAction2("ghl")}
                  disabled={isRunning}
                >
                  <span className={styles.selectorIcon}>💼</span>
                  <div className={styles.selectorTexts}>
                    <span className={styles.selectorTitle}>GoHighLevel API</span>
                    <span className={styles.selectorDesc}>Sync contact and update pipeline</span>
                  </div>
                </button>
                <button 
                  className={`${styles.selectorBtn} ${action2 === "slack" ? styles.activePink : ""}`}
                  onClick={() => !isRunning && setAction2("slack")}
                  disabled={isRunning}
                >
                  <span className={styles.selectorIcon}>💬</span>
                  <div className={styles.selectorTexts}>
                    <span className={styles.selectorTitle}>Slack Webhook</span>
                    <span className={styles.selectorDesc}>Send real-time developer metrics</span>
                  </div>
                </button>
              </div>
            </div>

            <button 
              className={`${styles.runBtn} ${isRunning ? styles.btnRunning : ""}`}
              onClick={executeWorkflow}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <span className={styles.spinner}></span> Running Engine Execution...
                </>
              ) : (
                "Deploy & Execute Workflow"
              )}
            </button>
          </div>

          {/* Visualizer Panel */}
          <div className={`${styles.visualizerPanel} stagger-item`}>
            <h3 className={styles.panelTitle}>2. Live Runtime Mesh Graph</h3>
            
            <div className={styles.flowMesh}>
              <div className={styles.gridLines}></div>
              
              <div className={styles.flowNodes}>
                {/* Trigger Node */}
                <div className={`${styles.flowNode} ${activeStep >= 1 ? styles.nodeTriggerActive : ""}`}>
                  <div className={styles.nodeIcon}>⚡</div>
                  <div className={styles.nodeLabels}>
                    <span className={styles.nodeType}>TRIGGER</span>
                    <span className={styles.nodeName}>{getTriggerLabel()}</span>
                  </div>
                </div>

                {/* Line 1 */}
                <div className={`${styles.connectorLine} ${activeStep >= 2 ? styles.lineActive : ""}`}>
                  <div className={styles.spark}></div>
                </div>

                {/* Action 1 Node */}
                <div className={`${styles.flowNode} ${activeStep >= 3 ? styles.nodeAction1Active : ""}`}>
                  <div className={styles.nodeIcon}>🤖</div>
                  <div className={styles.nodeLabels}>
                    <span className={styles.nodeType}>ACTION</span>
                    <span className={styles.nodeName}>{getAction1Label()}</span>
                  </div>
                </div>

                {/* Line 2 */}
                <div className={`${styles.connectorLine} ${activeStep >= 4 ? styles.lineActive : ""}`}>
                  <div className={styles.spark}></div>
                </div>

                {/* Action 2 Node */}
                <div className={`${styles.flowNode} ${activeStep >= 5 ? styles.nodeAction2Active : ""}`}>
                  <div className={styles.nodeIcon}>💼</div>
                  <div className={styles.nodeLabels}>
                    <span className={styles.nodeType}>SYNC</span>
                    <span className={styles.nodeName}>{getAction2Label()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal Panel */}
            <div className={styles.terminalWrapper}>
              <div className={styles.terminalHeader}>
                <span className={`${styles.termDot} ${styles.termRed}`}></span>
                <span className={`${styles.termDot} ${styles.termYellow}`}></span>
                <span className={`${styles.termDot} ${styles.termGreen}`}></span>
                <span className={styles.termTitle}>n8n_v2_webhook_logs.log</span>
              </div>
              <div className={styles.terminalBody}>
                {logs.length === 0 ? (
                  <div className={styles.emptyTerminal}>
                    <span className={styles.termComment}>// Node execution telemetry data will write here dynamically...</span>
                    <span className={styles.termPrompt}>$ awaiting execution command</span>
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className={styles.terminalLine}>
                      <span className={styles.termTime}>[{log.time}]</span>
                      <span className={`${styles.termText} ${styles[`text_${log.type}`]}`}>
                        {log.text}
                      </span>
                    </div>
                  ))
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
