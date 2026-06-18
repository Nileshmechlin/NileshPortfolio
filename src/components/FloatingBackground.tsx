"use client";

import React, { useEffect, useRef } from "react";
import styles from "./FloatingBackground.module.css";

interface Particle {
  x: number; // 3D coordinate
  y: number;
  z: number;
  vx: number; // Velocity
  vy: number;
  vz: number;
  colorIdx: number; // For dark mode color mapping
}

export default function FloatingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  const scrollRef = useRef({ y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationId: number;

    const particles: Particle[] = [];
    const numParticles = 65; // Balanced for visuals & performance

    const palettes = {
      default: [
        [0, 255, 255],    // Cyan
        [138, 43, 226],   // Purple
        [0, 117, 255],    // Blue
      ],
      automation: [
        [255, 92, 0],     // Sunset Orange
        [255, 75, 43],     // Hot Coral
        [255, 200, 80],    // Fire Yellow
      ],
      ghl: [
        [0, 117, 255],    // Cobalt Blue
        [63, 81, 181],     // Deep Indigo
        [0, 255, 240],    // Bright Cyan
      ],
      fullstack: [
        [186, 85, 211],   // Orchid Purple
        [255, 20, 147],    // Neon Pink
        [0, 255, 255],    // Cyan
      ],
    };

    const activePalette = [
      [0, 255, 255],
      [138, 43, 226],
      [0, 117, 255],
    ];

    let targetPalette = palettes.default;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles in 3D box
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: (Math.random() - 0.5) * 400,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.2,
        colorIdx: Math.floor(Math.random() * 3),
      });
    }

    let pitch = 0; // Rotation around X axis
    let yaw = 0;   // Rotation around Y axis

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleScroll = () => {
      scrollRef.current.y = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleInterestChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const interest = customEvent.detail as keyof typeof palettes;
      if (palettes[interest]) {
        targetPalette = palettes[interest];
      } else {
        targetPalette = palettes.default;
      }
    };
    window.addEventListener("visitor-interest", handleInterestChange);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interpolate active colors towards target colors
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          activePalette[i][j] += (targetPalette[i][j] - activePalette[i][j]) * 0.08;
        }
      }

      // Check current theme
      const isLight = document.documentElement.getAttribute("data-theme") === "light";

      // Mouse-driven 3D rotation (damped)
      const centerX = width / 2;
      const centerY = height / 2;
      const targetYaw = mouseRef.current.active
        ? ((mouseRef.current.targetX - centerX) / centerX) * 0.15
        : 0;
      const targetPitch = mouseRef.current.active
        ? ((mouseRef.current.targetY - centerY) / centerY) * 0.15
        : 0;

      yaw += (targetYaw - yaw) * 0.05;
      pitch += (targetPitch - pitch) * 0.05;

      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);

      // Scroll camera zoom depth calculation
      const scrollFactor = scrollRef.current.y * 0.12;

      // Project particles to 2D
      const projected = particles.map((p) => {
        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Bounding box wraparound in 3D
        const limitX = width * 0.7;
        const limitY = height * 0.7;
        const limitZ = 250;

        if (p.x > limitX) p.x = -limitX;
        if (p.x < -limitX) p.x = limitX;
        if (p.y > limitY) p.y = -limitY;
        if (p.y < -limitY) p.y = limitY;
        if (p.z > limitZ) p.z = -limitZ;
        if (p.z < -limitZ) p.z = limitZ;

        // 3D rotation math
        // 1. Rotate about Y-axis (Yaw)
        const rx1 = p.x * cosYaw - p.z * sinYaw;
        const rz1 = p.x * sinYaw + p.z * cosYaw;

        // 2. Rotate about X-axis (Pitch)
        const ry2 = p.y * cosPitch - rz1 * sinPitch;
        const rz2 = p.y * sinPitch + rz1 * cosPitch;

        // Project to 2D screen coordinates with depth perspective
        const fov = 500;
        const scale = fov / (fov + rz2 + scrollFactor);
        const sx = rx1 * scale + centerX;
        const sy = ry2 * scale + centerY;

        return {
          sx,
          sy,
          z: rz2,
          scale,
          colorIdx: p.colorIdx,
          orig: p,
        };
      });

      // Draw connection lines between particles close in 3D space
      const maxDistance3D = 135;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];

          // Compute 3D distance
          const dx = p1.orig.x - p2.orig.x;
          const dy = p1.orig.y - p2.orig.y;
          const dz = p1.orig.z - p2.orig.z;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < maxDistance3D) {
            const opacity = (1 - dist3D / maxDistance3D) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);

            if (isLight) {
              ctx.strokeStyle = `rgba(100, 116, 139, ${opacity * 0.35})`;
            } else {
              const [r, g, b] = activePalette[p1.colorIdx];
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
            ctx.lineWidth = Math.max(0.2, (p1.scale + p2.scale) * 0.4);
            ctx.stroke();
          }
        }
      }

      // Draw mouse gravity and lines
      if (mouseRef.current.active) {
        const mx = mouseRef.current.targetX;
        const my = mouseRef.current.targetY;
        const maxDist2D = 180;

        projected.forEach((p) => {
          const dx = p.sx - mx;
          const dy = p.sy - my;
          const dist2D = Math.sqrt(dx * dx + dy * dy);

          if (dist2D < maxDist2D) {
            const opacity = (1 - dist2D / maxDist2D) * 0.32;

            // Apply minor cursor attraction force
            const force = (1 - dist2D / maxDist2D) * 0.05;
            p.orig.x -= dx * force;
            p.orig.y -= dy * force;

            ctx.beginPath();
            ctx.moveTo(p.sx, p.sy);
            ctx.lineTo(mx, my);

            if (isLight) {
              ctx.strokeStyle = `rgba(100, 116, 139, ${opacity * 0.4})`;
            } else {
              const [r, g, b] = activePalette[p.colorIdx];
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
            ctx.lineWidth = Math.max(0.3, p.scale * 0.6);
            ctx.stroke();
          }
        });
      }

      // Draw particle nodes
      projected.forEach((p) => {
        if (p.scale > 0.1) {
          const radius = Math.max(0.6, 2.2 * p.scale);
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);

          if (isLight) {
            ctx.fillStyle = `rgba(100, 116, 139, ${Math.min(0.7, 0.4 * p.scale)})`;
            ctx.fill();
          } else {
            const [r, g, b] = activePalette[p.colorIdx];
            // Volumetric bloom for dark theme particles
            ctx.shadowBlur = radius * 4;
            ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.7)`;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1.0, 0.8 * p.scale)})`;
            ctx.fill();

            // Core center thread
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.9, 0.9 * p.scale)})`;
            ctx.beginPath();
            ctx.arc(p.sx, p.sy, radius * 0.35, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("visitor-interest", handleInterestChange);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
