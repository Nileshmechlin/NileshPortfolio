"use client";

import React, { useState, useRef, MouseEvent } from "react";
import styles from "./TiltCard.module.css";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum rotation in degrees
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 15,
  onClick,
  style = {},
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize coordinates (range: -0.5 to 0.5)
    const normX = mouseX / width - 0.5;
    const normY = mouseY / height - 0.5;

    // Calculate rotation values (Y moves rotateX, X moves rotateY)
    const rotX = -normY * maxTilt;
    const rotY = normX * maxTilt;

    setTiltStyle({
      transform: `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`,
    });

    // Cursor lighting reflection effect
    const glareX = (mouseX / width) * 100;
    const glareY = (mouseY / height) * 100;

    setGlareStyle({
      opacity: 0.45,
      background: `radial-gradient(circle 200px at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.08), transparent 80%)`,
    });
  };

  const handleMouseLeave = () => {
    // Smooth transition back to neutral
    setTiltStyle({
      transform: "rotateX(0deg) rotateY(0deg)",
      transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    });
    setGlareStyle({
      opacity: 0,
      transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    });
  };

  const handleMouseEnter = () => {
    // Remove return transitions during hover for real-time tracking
    setTiltStyle({
      transform: "rotateX(0deg) rotateY(0deg)",
      transition: "none",
    });
    setGlareStyle({
      opacity: 0.45,
      transition: "none",
    });
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.container} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      style={{ ...style, ...tiltStyle }}
    >
      <div className={styles.glare} style={glareStyle} />
      <div className={styles.inner}>{children}</div>
    </div>
  );
}
