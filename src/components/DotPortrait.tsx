"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import styles from "./DotPortrait.module.css";

interface DotPortraitProps {
  src: string;
  alt?: string;
  showLabel?: boolean;
  ghostMode?: boolean;
  /** 0–1: top of crop. Default 0 (very top of image = top of head) */
  cropFrom?: number;
  /** 0–1: height of crop as fraction of image. Default 0.42 = face only */
  cropHeight?: number;
  renderMode?: "dots" | "image";
}

interface Particle {
  // Target position (where the dot belongs in the portrait)
  tx: number;
  ty: number;
  // Current position (animated)
  cx: number;
  cy: number;
  // Starting position (random far away)
  sx: number;
  sy: number;
  // Dot properties
  r: number;
  brightness: number;
  colorIdx: number;
  // Animation
  delay: number; // stagger delay (0–1)
  speed: number; // individual speed multiplier
  // Trail particles
  trail: { x: number; y: number; alpha: number }[];
  // Depth (z-axis simulation)
  z: number;
  targetZ: number;
  // Has arrived
  arrived: boolean;
}

export default function DotPortrait({
  src,
  alt = "Portrait",
  showLabel = true,
  ghostMode = false,
  cropFrom = 0.02,
  cropHeight = 0.42,
  renderMode = "dots",
}: DotPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const assemblyProgressRef = useRef(0); // 0 to 1
  const assemblyStartedRef = useRef(false);
  const hasAssembledOnceRef = useRef(false);
  const [loaded, setLoaded] = useState(false);

  // Neon palette
  const neonColors = React.useMemo(() => {
    return ghostMode
      ? [
        [0, 255, 255],
        [0, 117, 255],
        [138, 43, 226],
        [100, 200, 255],
        [200, 150, 255],
      ]
      : [
        [0, 255, 255],
        [0, 117, 255],
        [138, 43, 226],
        [255, 92, 0],
        [255, 200, 80],
      ];
  }, [ghostMode]);

  const resetParticles = useCallback((width: number, height: number) => {
    const particles = particlesRef.current;
    let startX = width / 2;
    let startY = height / 2;
    if (typeof document !== "undefined" && canvasRef.current) {
      const buttons = Array.from(document.querySelectorAll("a, button"));
      const bookCallBtn = buttons.find(
        btn => btn.textContent?.trim().toLowerCase() === "book a call"
      );
      if (bookCallBtn) {
        const btnRect = bookCallBtn.getBoundingClientRect();
        const canvasRect = canvasRef.current.getBoundingClientRect();
        startX = btnRect.left - canvasRect.left + btnRect.width / 2;
        startY = btnRect.top - canvasRect.top + btnRect.height / 2;
      }
    }
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.sx = startX + (Math.random() - 0.5) * 16;
      p.sy = startY + (Math.random() - 0.5) * 16;
      p.cx = p.sx;
      p.cy = p.sy;
      p.z = 40 + Math.random() * 80;
      p.targetZ = 0;
      p.arrived = false;
      p.trail = [];
      p.delay = Math.random() * 0.04;
      p.speed = 1.4 + Math.random() * 0.4;
    }
    assemblyProgressRef.current = 0;
    assemblyStartedRef.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    let t = 0;
    let width = 0;
    let height = 0;
    let subjectCanvas: HTMLCanvasElement | null = null;

    const buildDots = () => {
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      const sampleWidth = Math.round(width * dpr);
      const sampleHeight = Math.round(height * dpr);
      const GAP = (ghostMode ? 17 : 4.5) * dpr;

      const offscreen = document.createElement("canvas");
      const srcY = Math.floor(img.naturalHeight * cropFrom);
      const srcH = Math.floor(img.naturalHeight * cropHeight);
      const srcW = img.naturalWidth;

      offscreen.width = srcW;
      offscreen.height = srcH;
      const offCtx = offscreen.getContext("2d")!;
      offCtx.drawImage(img, 0, srcY, srcW, srcH, 0, 0, srcW, srcH);

      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = sampleWidth;
      sampleCanvas.height = sampleHeight;
      const sampleCtx = sampleCanvas.getContext("2d")!;
      sampleCtx.drawImage(offscreen, 0, 0, sampleWidth, sampleHeight);

      const data = sampleCtx.getImageData(0, 0, sampleWidth, sampleHeight);
      const newParticles: Particle[] = [];

      // Background detection
      const bgMap = new Uint8Array(sampleWidth * sampleHeight);
      const isBgColor = (r: number, g: number, b: number) => {
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const saturation = maxC > 0 ? (maxC - minC) / maxC : 0;
        return (brightness > 0.28 && saturation < 0.13) || brightness > 0.90;
      };

      for (let y = 0; y < sampleHeight; y++) {
        for (let x = 0; x < sampleWidth; x++) {
          const idx = y * sampleWidth + x;
          const r = data.data[idx * 4];
          const g = data.data[idx * 4 + 1];
          const b = data.data[idx * 4 + 2];
          bgMap[idx] = isBgColor(r, g, b) ? 1 : 2;
        }
      }

      // Erosion pass
      const numPasses = Math.max(2, Math.round(2 * dpr));
      for (let pass = 0; pass < numPasses; pass++) {
        const toRemove: number[] = [];
        for (let y = 1; y < sampleHeight - 1; y++) {
          for (let x = 1; x < sampleWidth - 1; x++) {
            const idx = y * sampleWidth + x;
            if (bgMap[idx] !== 1) {
              let hasBgNeighbor = false;
              for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                  if (bgMap[(y + dy) * sampleWidth + (x + dx)] === 1) {
                    hasBgNeighbor = true;
                    break;
                  }
                }
                if (hasBgNeighbor) break;
              }
              if (hasBgNeighbor) {
                const i = idx * 4;
                const r = data.data[i];
                const g = data.data[i + 1];
                const b = data.data[i + 2];
                const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                const maxC = Math.max(r, g, b);
                const minC = Math.min(r, g, b);
                const saturation = maxC > 0 ? (maxC - minC) / maxC : 0;
                if (brightness > 0.24 && saturation < 0.15) {
                  toRemove.push(idx);
                }
              }
            }
          }
        }
        for (let j = 0; j < toRemove.length; j++) {
          bgMap[toRemove[j]] = 1;
        }
      }

      // Generate particles
      const centerX = width / 2;
      const centerY = height / 2;
      const maxDist = Math.sqrt(centerX ** 2 + centerY ** 2);

      for (let y = Math.round(GAP); y < sampleHeight; y += Math.round(GAP)) {
        for (let x = Math.round(GAP); x < sampleWidth; x += Math.round(GAP)) {
          const idx = y * sampleWidth + x;
          if (bgMap[idx] === 1) continue;

          const i = idx * 4;
          const r = data.data[i];
          const g = data.data[i + 1];
          const b = data.data[i + 2];
          const a = data.data[i + 3];
          if (a < 10) continue;

          const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const dotRadius = ghostMode
            ? (1.2 + (1 - brightness) * 4.5) * dpr
            : (1 - brightness) * 3.8 * dpr;
          if (dotRadius < 0.6 * dpr) continue;

          let colorIdx: number;
          if (brightness < 0.15) colorIdx = 0;
          else if (brightness < 0.3) colorIdx = 1;
          else if (brightness < 0.48) colorIdx = 2;
          else if (brightness < 0.65) colorIdx = 3;
          else colorIdx = 4;

          const tx = x / dpr;
          const ty = y / dpr;

          let startX = width / 2;
          let startY = height / 2;
          if (typeof document !== "undefined") {
            const buttons = Array.from(document.querySelectorAll("a, button"));
            const bookCallBtn = buttons.find(
              btn => btn.textContent?.trim().toLowerCase() === "book a call"
            );
            if (bookCallBtn) {
              const btnRect = bookCallBtn.getBoundingClientRect();
              const canvasRect = canvas.getBoundingClientRect();
              startX = btnRect.left - canvasRect.left + btnRect.width / 2;
              startY = btnRect.top - canvasRect.top + btnRect.height / 2;
            } else {
              startX = width * 1.2;
              startY = -height * 0.3;
            }
          }

          const sx = startX + (Math.random() - 0.5) * 16;
          const sy = startY + (Math.random() - 0.5) * 16;

          const delay = Math.random() * 0.04;

          newParticles.push({
            tx, ty,
            cx: sx, cy: sy,
            sx, sy,
            r: dotRadius / dpr,
            brightness,
            colorIdx,
            delay,
            speed: 1.4 + Math.random() * 0.4,
            trail: [],
            z: 40 + Math.random() * 80,
            targetZ: 0,
            arrived: false,
          });
        }
      }

      particlesRef.current = newParticles;

      // Subject canvas for image underlay
      subjectCanvas = document.createElement("canvas");
      subjectCanvas.width = sampleWidth;
      subjectCanvas.height = sampleHeight;
      const sCtx = subjectCanvas.getContext("2d")!;
      const sData = sampleCtx.getImageData(0, 0, sampleWidth, sampleHeight);
      for (let y = 0; y < sampleHeight; y++) {
        for (let x = 0; x < sampleWidth; x++) {
          const idx = y * sampleWidth + x;
          if (bgMap[idx] === 1) {
            sData.data[idx * 4 + 3] = 0;
          }
        }
      }
      sCtx.putImageData(sData, 0, 0);
    };

    img.onload = () => {
      const container = canvas.parentElement;
      const containerWidth = container?.clientWidth || 420;
      const containerHeight = container?.clientHeight || 420;
      const faceAspect = img.naturalWidth / (img.naturalHeight * cropHeight);

      if (containerWidth / containerHeight > faceAspect) {
        height = containerHeight;
        width = Math.round(height * faceAspect);
      } else {
        width = containerWidth;
        height = Math.round(width / faceAspect);
      }

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      buildDots();
      setLoaded(true);

      // Start assembly instantly
      setTimeout(() => {
        assemblyStartedRef.current = true;
        hasAssembledOnceRef.current = true;
      }, 0);

      const render = () => {
        ctx.clearRect(0, 0, width, height);
        t += 0.016;
        const particles = particlesRef.current;
        const assemblyStarted = assemblyStartedRef.current;

        if (assemblyStarted) {
          assemblyProgressRef.current = Math.min(1, assemblyProgressRef.current + 0.12);
        }
        const progress = assemblyProgressRef.current;

        if (renderMode === "image") {
          // Image render mode with particle assembly
          const allArrived = particles.length > 0 && particles.every(p => p.arrived);

          if (allArrived && subjectCanvas) {
            // Fully assembled — show the image with fade-in
            ctx.save();
            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";
            ctx.globalAlpha = 0.95;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            const isLight = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "light";

            if (typeof ctx.filter === "string") {
              ctx.filter = isLight
                ? "brightness(1.04) contrast(1.1) saturate(1.2)"
                : "brightness(0.98) contrast(1.12) saturate(1.25)";
            }
            ctx.drawImage(subjectCanvas, 0, 0, width, height);

            if (typeof ctx.filter === "string") {
              ctx.filter = "none";
            }
            ctx.globalCompositeOperation = "source-atop";
            const grad = ctx.createLinearGradient(0, 0, 0, height);
            if (isLight) {
              grad.addColorStop(0, "rgba(255, 255, 255, 0.0)");
              grad.addColorStop(0.40, "rgba(255, 255, 255, 0.0)");
              grad.addColorStop(0.75, "rgba(255, 255, 255, 0.5)");
              grad.addColorStop(1, "rgba(255, 255, 255, 1.0)");
            } else {
              grad.addColorStop(0, "rgba(5, 5, 8, 0.0)");
              grad.addColorStop(0.40, "rgba(5, 5, 8, 0.0)");
              grad.addColorStop(0.75, "rgba(5, 5, 8, 0.5)");
              grad.addColorStop(1, "rgba(5, 5, 8, 1.0)");
            }
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
          }

          // Draw flying/settling particles
          if (!allArrived) {
            for (let i = 0; i < particles.length; i++) {
              const p = particles[i];
              const [cr, cg, cb] = neonColors[p.colorIdx];

              if (assemblyStarted && progress > p.delay) {
                // Calculate individual progress
                const individualProgress = Math.min(1, (progress - p.delay) / (0.15 * p.speed));
                // Easing: cubic ease-out for smooth deceleration
                const eased = 1 - Math.pow(1 - individualProgress, 3);

                // Update position
                p.cx = p.sx + (p.tx - p.sx) * eased;
                p.cy = p.sy + (p.ty - p.sy) * eased;
                p.z = (200 + Math.random() * 100) * (1 - eased);

                // Add trail
                if (individualProgress < 0.95) {
                  p.trail.push({ x: p.cx, y: p.cy, alpha: 0.6 });
                }
                // Fade old trail points
                p.trail = p.trail
                  .map(tp => ({ ...tp, alpha: tp.alpha * 0.88 }))
                  .filter(tp => tp.alpha > 0.02);

                if (individualProgress >= 0.99) {
                  p.arrived = true;
                  p.cx = p.tx;
                  p.cy = p.ty;
                  p.z = 0;
                  p.trail = [];
                }
              }

              // Depth scale effect
              const depthScale = 1 + p.z * 0.002;
              const dotSize = p.r * depthScale;

              // Draw trail
              for (const tp of p.trail) {
                ctx.globalAlpha = tp.alpha * 0.4;
                ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
                ctx.beginPath();
                ctx.arc(tp.x, tp.y, dotSize * 0.5, 0, Math.PI * 2);
                ctx.fill();
              }

              // Draw particle
              ctx.globalAlpha = p.arrived ? 0 : 0.9; // Hide once image takes over
              ctx.shadowBlur = p.arrived ? 0 : 12 + p.z * 0.02;
              ctx.shadowColor = `rgba(${cr}, ${cg}, ${cb}, 0.8)`;
              ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
              ctx.beginPath();
              ctx.arc(p.cx, p.cy, Math.max(0.3, dotSize), 0, Math.PI * 2);
              ctx.fill();

              // Hot white center
              ctx.shadowBlur = 0;
              ctx.globalAlpha = p.arrived ? 0 : 0.7;
              ctx.fillStyle = `rgba(255, 255, 255, 0.9)`;
              ctx.beginPath();
              ctx.arc(p.cx, p.cy, Math.max(0.15, dotSize * 0.3), 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            // Draw partial image reveal as particles arrive
            if (subjectCanvas) {
              const arrivedCount = particles.filter(p => p.arrived).length;
              const revealAlpha = arrivedCount / particles.length;
              if (revealAlpha > 0.05) {
                ctx.save();
                ctx.globalAlpha = revealAlpha * 0.95;
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";

                const isLight = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "light";
                if (typeof ctx.filter === "string") {
                  ctx.filter = isLight
                    ? "brightness(1.04) contrast(1.1) saturate(1.2)"
                    : "brightness(0.98) contrast(1.12) saturate(1.25)";
                }
                ctx.drawImage(subjectCanvas, 0, 0, width, height);

                if (typeof ctx.filter === "string") {
                  ctx.filter = "none";
                }
                ctx.globalCompositeOperation = "source-atop";
                const grad = ctx.createLinearGradient(0, 0, 0, height);
                if (isLight) {
                  grad.addColorStop(0, "rgba(255, 255, 255, 0.0)");
                  grad.addColorStop(0.40, "rgba(255, 255, 255, 0.0)");
                  grad.addColorStop(0.75, "rgba(255, 255, 255, 0.5)");
                  grad.addColorStop(1, "rgba(255, 255, 255, 1.0)");
                } else {
                  grad.addColorStop(0, "rgba(5, 5, 8, 0.0)");
                  grad.addColorStop(0.40, "rgba(5, 5, 8, 0.0)");
                  grad.addColorStop(0.75, "rgba(5, 5, 8, 0.5)");
                  grad.addColorStop(1, "rgba(5, 5, 8, 1.0)");
                }
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, height);
                ctx.restore();
              }
            }
          }
        } else {
          // Dots render mode with particle assembly
          // Draw image underlay (fades in as particles arrive)
          if (subjectCanvas) {
            const arrivedCount = particles.filter(p => p.arrived).length;
            const revealAlpha = particles.length > 0 ? arrivedCount / particles.length : 0;
            if (revealAlpha > 0) {
              ctx.save();
              ctx.globalAlpha = (ghostMode ? 0.32 : 0.18) * revealAlpha;
              if (typeof ctx.filter === "string") {
                ctx.filter = ghostMode
                  ? "grayscale(100%) brightness(0.95) contrast(1.25)"
                  : "grayscale(100%) brightness(1.0) contrast(1.4)";
              }
              ctx.drawImage(subjectCanvas, 0, 0);
              if (typeof ctx.filter === "string") {
                ctx.filter = "none";
              }
              ctx.globalCompositeOperation = "source-atop";
              const grad = ctx.createLinearGradient(0, 0, 0, height);
              if (ghostMode) {
                grad.addColorStop(0, "rgba(0, 255, 255, 0.45)");
                grad.addColorStop(0.5, "rgba(0, 117, 255, 0.45)");
                grad.addColorStop(1, "rgba(138, 43, 226, 0.45)");
              } else {
                grad.addColorStop(0, "rgba(0, 255, 255, 0.45)");
                grad.addColorStop(0.5, "rgba(138, 43, 226, 0.45)");
                grad.addColorStop(1, "rgba(255, 92, 0, 0.45)");
              }
              ctx.fillStyle = grad;
              ctx.fillRect(0, 0, width, height);
              ctx.restore();
            }
          }

          // Draw particles
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const [cr, cg, cb] = neonColors[p.colorIdx];

            if (assemblyStarted && progress > p.delay) {
              const individualProgress = Math.min(1, (progress - p.delay) / (0.15 * p.speed));
              const eased = 1 - Math.pow(1 - individualProgress, 3);

              p.cx = p.sx + (p.tx - p.sx) * eased;
              p.cy = p.sy + (p.ty - p.sy) * eased;
              p.z = (200 + Math.random() * 100) * (1 - eased);

              if (individualProgress < 0.95) {
                p.trail.push({ x: p.cx, y: p.cy, alpha: 0.5 });
              }
              p.trail = p.trail
                .map(tp => ({ ...tp, alpha: tp.alpha * 0.85 }))
                .filter(tp => tp.alpha > 0.02);

              if (individualProgress >= 0.99) {
                p.arrived = true;
                p.cx = p.tx;
                p.cy = p.ty;
                p.z = 0;
                p.trail = [];
              }
            }

            const depthScale = 1 + p.z * 0.002;
            const wave = p.arrived
              ? Math.sin(t * 1.8 + p.tx * 0.06 + p.ty * 0.04 + i * 0.0008) * 0.5 + 0.5
              : 0.5;
            const radius = p.arrived
              ? p.r * (0.65 + wave * 0.5)
              : p.r * depthScale;

            const alpha = p.arrived
              ? (ghostMode
                ? Math.max(0.40, (1 - p.brightness) * (0.85 + wave * 0.3))
                : (1 - p.brightness) * (0.6 + wave * 0.4))
              : 0.9;

            // Draw trail
            for (const tp of p.trail) {
              ctx.globalAlpha = tp.alpha * 0.3;
              ctx.shadowBlur = 0;
              ctx.fillStyle = `rgb(${cr}, ${cg}, ${cb})`;
              ctx.beginPath();
              ctx.arc(tp.x, tp.y, radius * 0.4, 0, Math.PI * 2);
              ctx.fill();
            }

            // Main dot
            ctx.globalAlpha = 1;
            ctx.shadowBlur = p.arrived
              ? (ghostMode ? 3 + wave * 3 : 8 + wave * 10)
              : 15 + p.z * 0.03;
            ctx.shadowColor = `rgba(${cr}, ${cg}, ${cb}, ${p.arrived ? (ghostMode ? 0.3 : 0.7) : 0.9})`;
            ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${Math.min(1, alpha)})`;
            ctx.beginPath();
            ctx.arc(p.cx, p.cy, Math.max(0.3, radius), 0, Math.PI * 2);
            ctx.fill();

            // White hot-center
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.9, alpha * (p.arrived ? (ghostMode ? 0.2 : 0.55) : 0.7))})`;
            ctx.beginPath();
            ctx.arc(p.cx, p.cy, Math.max(0.15, radius * 0.38), 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }

        animRef.current = requestAnimationFrame(render);
      };

      render();
    };

    img.onerror = () => console.warn("DotPortrait: failed to load", src);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const cw = canvas.parentElement.clientWidth;
      const ch = canvas.parentElement.clientHeight;
      const faceAspect = img.naturalWidth / (img.naturalHeight * cropHeight);
      if (cw / ch > faceAspect) { height = ch; width = Math.round(ch * faceAspect); }
      else { width = cw; height = Math.round(cw / faceAspect); }
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      buildDots();
      // If already assembled, skip animation
      if (hasAssembledOnceRef.current) {
        const particles = particlesRef.current;
        for (const p of particles) {
          p.cx = p.tx;
          p.cy = p.ty;
          p.z = 0;
          p.arrived = true;
          p.trail = [];
        }
        assemblyProgressRef.current = 1;
        assemblyStartedRef.current = true;
      }
    };

    // Intersection Observer for replay on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !assemblyStartedRef.current) {
            setTimeout(() => {
              assemblyStartedRef.current = true;
              hasAssembledOnceRef.current = true;
            }, 0);
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(canvas);

    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [src, ghostMode, cropFrom, cropHeight, renderMode, neonColors, resetParticles]);

  return (
    <div className={styles.wrapper}>
      {!ghostMode && (
        <>
          <div className={styles.ringOuter} />
          <div className={styles.ringInner} />
          <div className={styles.ringCore} />
        </>
      )}

      <canvas
        ref={canvasRef}
        className={`${styles.canvas} ${loaded ? styles.canvasVisible : ""}`}
        aria-label={alt}
      />

      {!ghostMode && <div className={styles.scanlines} aria-hidden="true" />}

      {showLabel && !ghostMode && (
        <div className={styles.label}>
          <span className={styles.labelDot} />
          <span className={styles.labelText}>Nilesh Vijay · AI Engineer</span>
        </div>
      )}
    </div>
  );
}
