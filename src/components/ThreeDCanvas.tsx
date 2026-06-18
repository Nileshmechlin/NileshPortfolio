"use client";

import React, { useRef, useEffect } from "react";
import styles from "./ThreeDCanvas.module.css";

interface Project2D {
  sx: number;
  sy: number;
  z3: number;
  scale: number;
  x3d: number;
  y3d: number;
  z3d: number;
  index: number;
}

export default function ThreeDCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    // Generate nodes on a 3D Sphere (constellation network) instead of a rigid box
    const numNodes = 36;
    const vertices: number[][] = [];
    for (let i = 0; i < numNodes; i++) {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / numNodes);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k; // Golden spiral
      const radius = 175; // Increased from 125 to make canvas more big
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      vertices.push([x, y, z]);
    }

    // Dynamic rotation angles
    let angleXY = 0; // Yaw
    let angleXZ = 0; // Pitch
    let angleYZ = 0; // Roll

    // Physics Drag Momentum Variables
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      dragVelocityX = 0;
      dragVelocityY = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;

        dragVelocityY = dx * 0.005;
        dragVelocityX = -dy * 0.005;

        angleXY += dragVelocityY;
        angleXZ += dragVelocityX;

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      } else {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left - width / 2;
        const my = e.clientY - rect.top - height / 2;

        mouseRef.current.targetX = mx;
        mouseRef.current.targetY = my;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleScroll = () => {
      scrollRef.current.y = window.scrollY;
    };

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("scroll", handleScroll);

    // Resize listener
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Constellation stars in background
    const stars: number[][] = [];
    for (let i = 0; i < 45; i++) {
      const r = 200 + Math.random() * 120;
      const t1 = Math.random() * Math.PI * 2;
      const t2 = Math.random() * Math.PI * 2;
      stars.push([
        r * Math.sin(t1) * Math.cos(t2),
        r * Math.sin(t1) * Math.sin(t2),
        r * Math.cos(t1)
      ]);
    }

    // Anchor labels mapped to the top 12 core skills and technologies
    const labelNodes = [
      { vIdx: 0, label: "GHL Workflows", icon: "💼", color: "#0075ff" },
      { vIdx: 3, label: "React", icon: "⚛️", color: "#61dafb" },
      { vIdx: 6, label: "AWS Cloud", icon: "☁️", color: "#ff9900" },
      { vIdx: 9, label: "Next.js SaaS", icon: "▲", color: "#ffffff" },
      { vIdx: 12, label: "Hostinger", icon: "🌐", color: "#673de6" },
      { vIdx: 15, label: "n8n Workflows", icon: "🔗", color: "#ff6c37" },
      { vIdx: 18, label: "AI Voice Agents", icon: "🗣️", color: "#a855f7" },
      { vIdx: 21, label: "Twilio API", icon: "📞", color: "#f22f46" },
      { vIdx: 24, label: "Zapier Flow", icon: "🍊", color: "#ff4f00" },
      { vIdx: 27, label: "Node.js Backend", icon: "🟢", color: "#339933" },
      { vIdx: 30, label: "Docker", icon: "🐋", color: "#2496ed" },
      { vIdx: 33, label: "PostgreSQL", icon: "🐘", color: "#336791" }
    ];

    let t = 0;

    const render = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      t += 0.005;

      const isMobile = typeof window !== "undefined" && window.innerWidth < 992;

      if (!isDragging) {
        // Damped mouse hover tracking
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

        const mouseSpeedXW = (mouseRef.current.x / width) * 0.03;
        const mouseSpeedYW = -(mouseRef.current.y / height) * 0.03;
        const scrollDrift = isMobile ? 0 : scrollRef.current.y * 0.0003;

        angleXY += dragVelocityY;
        angleXZ += dragVelocityX;
        dragVelocityY *= 0.95;
        dragVelocityX *= 0.95;

        // Auto rotation + mouse tracking
        angleXY += 0.002 + scrollDrift * 0.2;
        angleXZ += 0.003 + mouseSpeedYW * 0.5;
        angleYZ += 0.001 + mouseSpeedXW * 0.5;
      } else {
        angleXY += dragVelocityY;
        angleXZ += dragVelocityX;
        angleYZ += 0.001;
      }

      // Trig ratios
      const cosXY = Math.cos(angleXY), sinXY = Math.sin(angleXY);
      const cosXZ = Math.cos(angleXZ), sinXZ = Math.sin(angleXZ);
      const cosYZ = Math.cos(angleYZ), sinYZ = Math.sin(angleYZ);

      const zoomFactor = isMobile ? 0 : Math.min(260, scrollRef.current.y * 0.38);
      const distance3D = isMobile ? 385 : Math.max(50, 320 - zoomFactor);

      // Rotate vertex in 3D
      const rotateAndProject3D = (coords: number[]): { sx: number; sy: number; z3: number; scale: number; x3d: number; y3d: number; z3d: number } => {
        let [x, y, z] = coords;

        // Yaw
        let x1 = x * cosXY - y * sinXY;
        let y1 = x * sinXY + y * cosXY;

        // Pitch
        let x2 = x1 * cosXZ - z * sinXZ;
        let z2 = x1 * sinXZ + z * cosXZ;

        // Roll
        let y3 = y1 * cosYZ - z2 * sinYZ;
        let z3 = y1 * sinYZ + z2 * cosYZ;

        // Project 3D to 2D
        const fov = 400;
        const scale3D = fov / Math.max(15, (distance3D + z3));
        const sx = width / 2 + x2 * scale3D;
        const sy = height / 2 + y3 * scale3D;

        return { sx, sy, z3, scale: scale3D, x3d: x2, y3d: y3, z3d: z3 };
      };

      // Project vertices
      const projectedVertices = vertices.map((v, idx) => {
        const proj = rotateAndProject3D(v);
        return { ...proj, index: idx };
      });

      // Project stars
      const projectedStars = stars.map((s) => {
        const proj = rotateAndProject3D(s);
        return proj;
      });

      projectedStars.sort((a, b) => b.z3 - a.z3);

      const isLight = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "light";

      // Draw background stars
      projectedStars.forEach((p) => {
        if (p.scale > 0.1) {
          ctx.fillStyle = isLight
            ? `rgba(100, 116, 139, ${Math.min(0.15, 0.04 * p.scale)})`
            : `rgba(140, 140, 160, ${Math.min(0.2, 0.06 * p.scale)})`;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, Math.max(0.1, 1.2 * p.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw dynamic proximity-based constellation connections (completely organic, no box feel)
      const maxDistance = 120;
      for (let i = 0; i < projectedVertices.length; i++) {
        const p1 = projectedVertices[i];
        for (let j = i + 1; j < projectedVertices.length; j++) {
          const p2 = projectedVertices[j];

          const dx = p1.x3d - p2.x3d;
          const dy = p1.y3d - p2.y3d;
          const dz = p1.z3d - p2.z3d;
          const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist3D < maxDistance) {
            const grad = ctx.createLinearGradient(p1.sx, p1.sy, p2.sx, p2.sy);
            let color1, color2, glowColor;
            const opacityMultiplier = (1 - dist3D / maxDistance) * 0.42;

            if (isLight) {
              color1 = `rgba(15, 23, 42, ${opacityMultiplier})`;
              color2 = `rgba(113, 113, 122, ${opacityMultiplier})`;
              glowColor = "transparent";
            } else {
              color1 = i % 2 === 0 ? `rgba(0, 255, 255, ${opacityMultiplier})` : `rgba(255, 92, 0, ${opacityMultiplier})`;
              color2 = j % 2 === 0 ? `rgba(138, 43, 226, ${opacityMultiplier})` : `rgba(0, 117, 255, ${opacityMultiplier})`;
              glowColor = i % 2 === 0 ? "rgba(0, 255, 255, 0.12)" : "rgba(255, 92, 0, 0.12)";
            }

            grad.addColorStop(0, color1);
            grad.addColorStop(1, color2);

            ctx.save();
            ctx.strokeStyle = grad;
            ctx.shadowBlur = isLight ? 0 : Math.max(1, 6 * p1.scale);
            ctx.shadowColor = glowColor;
            ctx.lineWidth = Math.max(0.4, 1.2 * p1.scale);
            ctx.beginPath();
            ctx.moveTo(p1.sx, p1.sy);
            ctx.lineTo(p2.sx, p2.sy);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Draw GHL logo inside a node's circle
      const drawGHLLogoIconAtNode = (x: number, y: number, scale: number) => {
        ctx.save();

        // 1. Middle pillar: Blue (drawn first so yellow/green overlap it from the sides)
        // Left half of tip: Bright Blue, Right half: Darker Blue
        ctx.fillStyle = "#00A3E0";
        ctx.fillRect(x - 0.8 * scale, y + 1 * scale, 1.6 * scale, 5.5 * scale);

        // Left half of blue arrowhead
        ctx.fillStyle = "#00A3E0";
        ctx.beginPath();
        ctx.moveTo(x - 2.2 * scale, y + 1 * scale);
        ctx.lineTo(x, y - 2.5 * scale);
        ctx.lineTo(x, y + 1 * scale);
        ctx.closePath();
        ctx.fill();

        // Right half of blue arrowhead
        ctx.fillStyle = "#0062B1";
        ctx.beginPath();
        ctx.moveTo(x, y + 1 * scale);
        ctx.lineTo(x, y - 2.5 * scale);
        ctx.lineTo(x + 2.2 * scale, y + 1 * scale);
        ctx.closePath();
        ctx.fill();

        // 2. Left pillar: Yellow
        // Left half of tip: Bright Yellow, Right half: Darker Yellow/Orange
        ctx.fillStyle = "#FFC72C";
        ctx.fillRect(x - 3.8 * scale, y - 1 * scale, 1.6 * scale, 5.5 * scale);

        // Left half of yellow arrowhead
        ctx.fillStyle = "#FFC72C";
        ctx.beginPath();
        ctx.moveTo(x - 5.2 * scale, y - 1 * scale);
        ctx.lineTo(x - 3.0 * scale, y - 4.5 * scale);
        ctx.lineTo(x - 3.0 * scale, y - 1 * scale);
        ctx.closePath();
        ctx.fill();

        // Right half of yellow arrowhead
        ctx.fillStyle = "#E59400";
        ctx.beginPath();
        ctx.moveTo(x - 3.0 * scale, y - 1 * scale);
        ctx.lineTo(x - 3.0 * scale, y - 4.5 * scale);
        ctx.lineTo(x - 0.8 * scale, y - 1 * scale);
        ctx.closePath();
        ctx.fill();

        // 3. Right pillar: Green
        // Left half of tip: Bright Green, Right half: Darker Green
        ctx.fillStyle = "#00D27F";
        ctx.fillRect(x + 2.2 * scale, y - 1 * scale, 1.6 * scale, 5.5 * scale);

        // Left half of green arrowhead
        ctx.fillStyle = "#00D27F";
        ctx.beginPath();
        ctx.moveTo(x + 0.8 * scale, y - 1 * scale);
        ctx.lineTo(x + 3.0 * scale, y - 4.5 * scale);
        ctx.lineTo(x + 3.0 * scale, y - 1 * scale);
        ctx.closePath();
        ctx.fill();

        // Right half of green arrowhead
        ctx.fillStyle = "#009E5A";
        ctx.beginPath();
        ctx.moveTo(x + 3.0 * scale, y - 1 * scale);
        ctx.lineTo(x + 3.0 * scale, y - 4.5 * scale);
        ctx.lineTo(x + 5.2 * scale, y - 1 * scale);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      };

      const drawReactLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.strokeStyle = "#61DAFB";
        ctx.lineWidth = 1 * scale;

        // Draw 3 ellipses using rotation and scaling transforms (maximizes compatibility)
        for (let i = 0; i < 3; i++) {
          ctx.save();
          ctx.beginPath();
          ctx.translate(x, y);
          ctx.rotate((i * 60 * Math.PI) / 180);
          ctx.scale(0.42, 1);
          ctx.arc(0, 0, 5.2 * scale, 0, Math.PI * 2);
          ctx.restore();
          ctx.stroke();
        }

        // Draw center dot
        ctx.fillStyle = "#61DAFB";
        ctx.beginPath();
        ctx.arc(x, y, 1.2 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      const drawNextLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.fillStyle = isLight ? "#ffffff" : "#000000";
        ctx.beginPath();
        ctx.arc(x, y, 5.2 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = isLight ? "#000000" : "#ffffff";
        ctx.lineWidth = 1.6 * scale;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(x - 2.5 * scale, y + 2.5 * scale);
        ctx.lineTo(x - 2.5 * scale, y - 2.5 * scale);
        ctx.lineTo(x + 1.5 * scale, y + 2.5 * scale);
        ctx.moveTo(x + 1.5 * scale, y - 1.5 * scale);
        ctx.lineTo(x + 1.5 * scale, y + 2.5 * scale);
        ctx.stroke();
        ctx.restore();
      };

      const drawTwilioLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.fillStyle = "#F22F46";
        ctx.beginPath();
        ctx.arc(x, y, 5.5 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        const dotOffset = 1.8 * scale;
        const dotRadius = 0.9 * scale;

        ctx.beginPath();
        ctx.arc(x - dotOffset, y - dotOffset, dotRadius, 0, Math.PI * 2);
        ctx.arc(x + dotOffset, y - dotOffset, dotRadius, 0, Math.PI * 2);
        ctx.arc(x - dotOffset, y + dotOffset, dotRadius, 0, Math.PI * 2);
        ctx.arc(x + dotOffset, y + dotOffset, dotRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      const drawN8NLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.strokeStyle = isLight ? "#0f172a" : "#ffffff";
        ctx.lineWidth = 1.2 * scale;

        // Draw connections
        ctx.beginPath();
        // Left to center
        ctx.moveTo(x - 3.5 * scale, y);
        ctx.lineTo(x - 1 * scale, y);
        // Center to top-right
        ctx.lineTo(x + 2.5 * scale, y - 2 * scale);
        // Center to bottom-right
        ctx.moveTo(x - 1 * scale, y);
        ctx.lineTo(x + 2.5 * scale, y + 2 * scale);
        ctx.stroke();

        // Draw node circles
        ctx.fillStyle = isLight ? "#0f172a" : "#ffffff";
        
        const nodes = [
          { nx: x - 3.5 * scale, ny: y },
          { nx: x - 1 * scale, ny: y },
          { nx: x + 2.5 * scale, ny: y - 2 * scale },
          { nx: x + 2.5 * scale, ny: y + 2 * scale }
        ];

        nodes.forEach((node) => {
          ctx.beginPath();
          ctx.arc(node.nx, node.ny, 1 * scale, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw outer ring for the nodes
          ctx.strokeStyle = isLight ? "#0f172a" : "#ffffff";
          ctx.lineWidth = 0.5 * scale;
          ctx.beginPath();
          ctx.arc(node.nx, node.ny, 1.8 * scale, 0, Math.PI * 2);
          ctx.stroke();
        });

        ctx.restore();
      };

      const drawAWSLogo = (x: number, y: number, scale: number) => {
        ctx.save();

        // 1. Draw the cloud outline
        ctx.strokeStyle = "#ff9900";
        ctx.lineWidth = 1 * scale;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.beginPath();
        // Start at bottom-left
        ctx.moveTo(x - 2.8 * scale, y + 1.8 * scale);

        // Left bump: curves out left and up
        ctx.quadraticCurveTo(x - 4.6 * scale, y + 0.5 * scale, x - 2.8 * scale, y - 0.8 * scale);

        // Top large bump: curves high up and across to the right
        ctx.quadraticCurveTo(x, y - 3.8 * scale, x + 2.8 * scale, y - 0.8 * scale);

        // Right bump: curves out right and down
        ctx.quadraticCurveTo(x + 4.6 * scale, y + 0.5 * scale, x + 2.8 * scale, y + 1.8 * scale);

        // Flat bottom connecting line
        ctx.closePath();
        ctx.stroke();

        // 2. Write the lowercase letters "aws"
        ctx.fillStyle = isLight ? "#0f172a" : "#ffffff";
        ctx.font = `bold ${Math.round(4.5 * scale)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("aws", x, y - 0.4 * scale);

        // 3. Draw the smiling curved arrow under "aws"
        ctx.strokeStyle = "#ff9900";
        ctx.lineWidth = 0.8 * scale;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(x - 2.0 * scale, y + 0.5 * scale);
        ctx.quadraticCurveTo(x, y + 1.9 * scale, x + 1.7 * scale, y + 0.5 * scale);
        ctx.stroke();

        // Arrowhead pointing to the right (smiling)
        ctx.fillStyle = "#ff9900";
        ctx.beginPath();
        ctx.moveTo(x + 1.7 * scale, y + 0.5 * scale);
        ctx.lineTo(x + 0.7 * scale, y + 0.1 * scale);
        ctx.lineTo(x + 2.1 * scale, y - 0.4 * scale);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      };

      const drawHostingerLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.fillStyle = "#673de6";

        // Stylized purple Hostinger "H"
        // Left pillar (angled ends)
        ctx.beginPath();
        ctx.moveTo(x - 3.2 * scale, y - 3 * scale);
        ctx.lineTo(x - 1.2 * scale, y - 2.2 * scale);
        ctx.lineTo(x - 1.2 * scale, y + 3 * scale);
        ctx.lineTo(x - 3.2 * scale, y + 2.2 * scale);
        ctx.closePath();
        ctx.fill();

        // Right pillar (angled ends)
        ctx.beginPath();
        ctx.moveTo(x + 1.2 * scale, y - 2.2 * scale);
        ctx.lineTo(x + 3.2 * scale, y - 3 * scale);
        ctx.lineTo(x + 3.2 * scale, y + 2.2 * scale);
        ctx.lineTo(x + 1.2 * scale, y + 3 * scale);
        ctx.closePath();
        ctx.fill();

        // Connecting bridge
        ctx.beginPath();
        ctx.moveTo(x - 1.2 * scale, y - 0.8 * scale);
        ctx.lineTo(x + 1.2 * scale, y - 0.4 * scale);
        ctx.lineTo(x + 1.2 * scale, y + 0.8 * scale);
        ctx.lineTo(x - 1.2 * scale, y + 0.4 * scale);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      };

      const drawZapierLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.strokeStyle = "#FF4F00";
        ctx.lineWidth = 1.8 * scale;
        ctx.lineCap = "round";

        const numSpokes = 5;
        const rad = 4.2 * scale;
        for (let i = 0; i < numSpokes; i++) {
          const angle = (i * 2 * Math.PI) / numSpokes - Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(angle) * rad, y + Math.sin(angle) * rad);
          ctx.stroke();
        }
        ctx.restore();
      };

      const drawNodeJSLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.strokeStyle = "#339933";
        ctx.lineWidth = 1.5 * scale;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const px = x + Math.cos(angle) * 4 * scale;
          const py = y + Math.sin(angle) * 4 * scale;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = "#339933";
        ctx.beginPath();
        ctx.arc(x, y, 1.8 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      const drawRetellLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.fillStyle = "#A855F7";

        const heights = [3, 6, 4, 2];
        const barWidth = 1.1 * scale;
        const gap = 0.8 * scale;
        const startX = x - 2.8 * scale;

        heights.forEach((h, i) => {
          const bx = startX + i * (barWidth + gap);
          const by = y - (h * scale) / 2;
          ctx.fillRect(bx, by, barWidth, h * scale);
        });

        ctx.restore();
      };

      const drawTypeScriptLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.fillStyle = "#3178C6";
        const r = 4.2 * scale;
        ctx.beginPath();
        // Standard Canvas path-based rounded rectangle
        ctx.moveTo(x - r + 0.8 * scale, y - r);
        ctx.lineTo(x + r - 0.8 * scale, y - r);
        ctx.quadraticCurveTo(x + r, y - r, x + r, y - r + 0.8 * scale);
        ctx.lineTo(x + r, y + r - 0.8 * scale);
        ctx.quadraticCurveTo(x + r, y + r, x + r - 0.8 * scale, y + r);
        ctx.lineTo(x - r + 0.8 * scale, y + r);
        ctx.quadraticCurveTo(x - r, y + r, x - r, y + r - 0.8 * scale);
        ctx.lineTo(x - r, y - r + 0.8 * scale);
        ctx.quadraticCurveTo(x - r, y - r, x - r + 0.8 * scale, y - r);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.round(4.0 * scale)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("TS", x, y);
        ctx.restore();
      };

      const drawJavaScriptLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.fillStyle = "#F7DF1E";
        const r = 4.2 * scale;
        ctx.beginPath();
        ctx.moveTo(x - r + 0.8 * scale, y - r);
        ctx.lineTo(x + r - 0.8 * scale, y - r);
        ctx.quadraticCurveTo(x + r, y - r, x + r, y - r + 0.8 * scale);
        ctx.lineTo(x + r, y + r - 0.8 * scale);
        ctx.quadraticCurveTo(x + r, y + r, x + r - 0.8 * scale, y + r);
        ctx.lineTo(x - r + 0.8 * scale, y + r);
        ctx.quadraticCurveTo(x - r, y + r, x - r, y + r - 0.8 * scale);
        ctx.lineTo(x - r, y - r + 0.8 * scale);
        ctx.quadraticCurveTo(x - r, y - r, x - r + 0.8 * scale, y - r);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#323330";
        ctx.font = `bold ${Math.round(4.0 * scale)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("JS", x, y);
        ctx.restore();
      };

      const drawDockerLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.fillStyle = "#2496ED";
        const w = 2.2 * scale;
        const h = 1.0 * scale;
        // Bottom row
        ctx.fillRect(x - w - 0.2 * scale, y + 0.8 * scale, w, h);
        ctx.fillRect(x + 0.2 * scale, y + 0.8 * scale, w, h);
        // Middle row
        ctx.fillRect(x - w - 0.2 * scale, y - 0.4 * scale, w, h);
        ctx.fillRect(x + 0.2 * scale, y - 0.4 * scale, w, h);
        // Top single container
        ctx.fillRect(x - w / 2, y - 1.6 * scale, w, h);
        ctx.restore();
      };

      const drawMongoDBLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.fillStyle = "#47A248";
        ctx.beginPath();
        ctx.moveTo(x, y - 4 * scale);
        ctx.quadraticCurveTo(x + 2.5 * scale, y, x, y + 4 * scale);
        ctx.quadraticCurveTo(x - 2.5 * scale, y, x, y - 4 * scale);
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 0.5 * scale;
        ctx.beginPath();
        ctx.moveTo(x, y - 3 * scale);
        ctx.lineTo(x, y + 3 * scale);
        ctx.stroke();
        ctx.restore();
      };

      const drawPostgresLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.fillStyle = "#336791";
        ctx.beginPath();
        ctx.moveTo(x - 3 * scale, y - 2 * scale);
        ctx.quadraticCurveTo(x, y - 3.5 * scale, x + 3 * scale, y - 2 * scale);
        ctx.quadraticCurveTo(x + 3.5 * scale, y + 1 * scale, x + 1.8 * scale, y + 2 * scale);
        ctx.lineTo(x + 0.8 * scale, y + 3.5 * scale);
        ctx.quadraticCurveTo(x, y + 4.2 * scale, x - 0.8 * scale, y + 3.5 * scale);
        ctx.lineTo(x - 1.8 * scale, y + 2 * scale);
        ctx.quadraticCurveTo(x - 3.5 * scale, y + 1 * scale, x - 3 * scale, y - 2 * scale);
        ctx.fill();
        ctx.restore();
      };

      const drawGraphQLLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.strokeStyle = "#E10098";
        ctx.lineWidth = 0.8 * scale;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const px = x + Math.cos(angle) * 3.5 * scale;
          const py = y + Math.sin(angle) * 3.5 * scale;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y - 3.5 * scale);
        ctx.lineTo(x, y + 3.5 * scale);
        ctx.moveTo(x - 3.03 * scale, y - 1.75 * scale);
        ctx.lineTo(x + 3.03 * scale, y + 1.75 * scale);
        ctx.moveTo(x - 3.03 * scale, y + 1.75 * scale);
        ctx.lineTo(x + 3.03 * scale, y - 1.75 * scale);
        ctx.stroke();

        ctx.fillStyle = "#E10098";
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          ctx.beginPath();
          ctx.arc(x + Math.cos(angle) * 3.5 * scale, y + Math.sin(angle) * 3.5 * scale, 0.9 * scale, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      };

      const drawMakeLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.fillStyle = "#8C00FF";
        ctx.beginPath();
        ctx.arc(x, y, 4 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(x - 1.5 * scale, y - 1.5 * scale, 1 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      const drawLovableLogo = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.fillStyle = "#FF2B85";
        ctx.beginPath();
        ctx.moveTo(x, y + 1.8 * scale);
        ctx.bezierCurveTo(x - 3.5 * scale, y - 1.2 * scale, x - 1.2 * scale, y - 3.5 * scale, x, y - 1.5 * scale);
        ctx.bezierCurveTo(x + 1.2 * scale, y - 3.5 * scale, x + 3.5 * scale, y - 1.2 * scale, x, y + 1.8 * scale);
        ctx.fill();
        ctx.restore();
      };

      // Sort vertices for correct depth rendering
      const sortedVertices = [...projectedVertices].sort((a, b) => b.z3 - a.z3);

      // Find the hovered node closest to the cursor
      let hoveredNodeIndex: number | null = null;
      let closestDist = 20; // Max hover activation radius in pixels

      projectedVertices.forEach((node) => {
        const dx = (mouseRef.current.x + width / 2) - node.sx;
        const dy = (mouseRef.current.y + height / 2) - node.sy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) {
          closestDist = dist;
          hoveredNodeIndex = node.index;
        }
      });

      // Draw vertices nodes
      sortedVertices.forEach((node) => {
        const isLabelNode = labelNodes.find((l) => l.vIdx === node.index);
        const isHovered = hoveredNodeIndex === node.index;

        if (isLabelNode) {
          let labelColor = isLabelNode.color;
          if (isLight) {
            if (labelColor === "#ffffff") labelColor = "#09090b";
            else if (labelColor === "#00ffff") labelColor = "#0e7490";
            else if (labelColor === "#61dafb") labelColor = "#0369a1";
            else if (labelColor === "#f7df1e") labelColor = "#854d0e";
          }

          // Dynamic hover sizing
          const rOuter = isHovered ? 17 : 13;
          const rInner = isHovered ? 11 : 8;
          const logoScale = isHovered ? 1.15 : 0.85;

          // Draw outer ring
          ctx.shadowBlur = isLight ? Math.max(1, 4 * node.scale) : (isHovered ? Math.max(2, 20 * node.scale) : Math.max(1, 10 * node.scale));
          ctx.shadowColor = labelColor;

          ctx.strokeStyle = labelColor;
          ctx.lineWidth = isHovered ? Math.max(0.5, 2.0 * node.scale) : Math.max(0.4, 1.4 * node.scale);
          ctx.beginPath();
          ctx.arc(node.sx, node.sy, Math.max(0.1, rOuter * node.scale), 0, Math.PI * 2);
          ctx.stroke();

          // Draw radial core
          const coreGrad = ctx.createRadialGradient(node.sx, node.sy, 0, node.sx, node.sy, Math.max(0.1, rInner * node.scale));
          coreGrad.addColorStop(0, "#ffffff");
          coreGrad.addColorStop(0.5, labelColor);
          coreGrad.addColorStop(1, isLight ? "rgba(242, 242, 247, 0.95)" : "rgba(5, 5, 8, 0.95)");

          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(node.sx, node.sy, Math.max(0.1, rInner * node.scale), 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;

          // Draw custom brand logos
          if (isLabelNode.label === "GHL Workflows") {
            drawGHLLogoIconAtNode(node.sx, node.sy, node.scale * logoScale);
          } else if (isLabelNode.label === "React") {
            drawReactLogo(node.sx, node.sy, node.scale * logoScale);
          } else if (isLabelNode.label === "Next.js SaaS") {
            drawNextLogo(node.sx, node.sy, node.scale * logoScale);
          } else if (isLabelNode.label === "Twilio API") {
            drawTwilioLogo(node.sx, node.sy, node.scale * logoScale);
          } else if (isLabelNode.label === "n8n Workflows") {
            drawN8NLogo(node.sx, node.sy, node.scale * logoScale);
          } else if (isLabelNode.label === "AWS Cloud") {
            drawAWSLogo(node.sx, node.sy, node.scale * logoScale);
          } else if (isLabelNode.label === "Hostinger") {
            drawHostingerLogo(node.sx, node.sy, node.scale * logoScale);
          } else if (isLabelNode.label === "Zapier Flow") {
            drawZapierLogo(node.sx, node.sy, node.scale * logoScale);
          } else if (isLabelNode.label === "Node.js Backend") {
            drawNodeJSLogo(node.sx, node.sy, node.scale * logoScale);
          } else if (isLabelNode.label === "AI Voice Agents") {
            drawRetellLogo(node.sx, node.sy, node.scale * logoScale);
          } else if (isLabelNode.label === "Docker") {
            drawDockerLogo(node.sx, node.sy, node.scale * logoScale);
          } else if (isLabelNode.label === "PostgreSQL") {
            drawPostgresLogo(node.sx, node.sy, node.scale * logoScale);
          } else {
            ctx.fillStyle = isLight ? "#0f172a" : "#ffffff";
            ctx.font = `${Math.round(10 * node.scale)}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(isLabelNode.icon, node.sx, node.sy);
          }

          // Draw label card below node
          if (node.scale > 0.52) {
            const labelText = isLabelNode.label;
            const fontSize = isHovered ? 10.5 : 8.5;
            ctx.font = `bold ${Math.round(fontSize * node.scale)}px var(--font-sans)`;
            const textWidth = ctx.measureText(labelText).width;

            const cardOffset = rOuter + 4;
            ctx.fillStyle = isLight ? "rgba(255, 255, 255, 0.96)" : "rgba(8, 8, 12, 0.88)";
            ctx.fillRect(
              node.sx - textWidth / 2 - 5,
              node.sy + cardOffset * node.scale,
              textWidth + 10,
              14
            );

            ctx.strokeStyle = isHovered ? labelColor : (isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.06)");
            ctx.lineWidth = 0.8 * node.scale;
            ctx.strokeRect(
              node.sx - textWidth / 2 - 5,
              node.sy + cardOffset * node.scale,
              textWidth + 10,
              14
            );

            ctx.fillStyle = isLight ? "#0f172a" : "#e4e4e7";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(labelText, node.sx, node.sy + cardOffset * node.scale + 2);
          }
        } else {
          // Regular constellation node dots
          if (isLight) {
            ctx.fillStyle = node.index % 2 === 0 ? "#09090b" : "#71717a";
          } else {
            ctx.fillStyle = node.index % 2 === 0 ? "#00ffff" : "#ff5c00";
          }
          ctx.beginPath();
          ctx.arc(node.sx, node.sy, Math.max(0.1, 3.2 * node.scale), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.canvasWrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.outerRing}></div>
      <div className={styles.innerRing}></div>
    </div>
  );
}
