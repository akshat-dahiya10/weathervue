"use client";

import { useEffect, useState } from "react";

export default function Particles() {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: 40 }, (_, i) => i);
    setParticles(arr);
  }, []);

  return (
    <div className="particles">
      {particles.map((i) => {
        const size = Math.random() * 6 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;

        return (
          <span
            key={i}
            className="particle"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}
