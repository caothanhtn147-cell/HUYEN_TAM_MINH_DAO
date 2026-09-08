'use client';

import React, { useEffect, useState } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    return typeof window !== 'undefined' && !window.matchMedia('(pointer: coarse)').matches;
  });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const id = Date.now() + Math.random();
      const newRipple: Ripple = { id, x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-2), newRipple]);

      // Smart Auto-Cleanup: remove ripple after 450ms animation finishes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 450);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Smart Temporary Click Ripple (Auto-destructs after 450ms) */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="pointer-events-none fixed z-50 rounded-full border border-amber-400/60 bg-amber-400/10 transition-all duration-500 ease-out shadow-lg shadow-amber-500/30 scale-150 opacity-0 animate-ping-once"
          style={{
            left: r.x - 20,
            top: r.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}

      {/* Outer Glowing Magnetic Aura Circle (Smooth Cursor) */}
      <div
        className={`pointer-events-none fixed z-50 rounded-full border transition-transform duration-150 ease-out ${
          isHovered
            ? 'h-10 w-10 border-amber-400 bg-amber-500/20 shadow-xl shadow-amber-500/40 scale-125'
            : 'h-7 w-7 border-amber-500/40 bg-amber-500/10'
        }`}
        style={{
          transform: `translate3d(${pos.x - (isHovered ? 20 : 14)}px, ${pos.y - (isHovered ? 20 : 14)}px, 0)`,
        }}
      />
      {/* Inner Pinpoint Specular Core (No annoying blinking) */}
      <div
        className="pointer-events-none fixed z-50 h-2 w-2 rounded-full bg-amber-300 shadow-md shadow-amber-300"
        style={{
          transform: `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`,
        }}
      />
    </>
  );
};
