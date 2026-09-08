'use client';

import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

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

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Glowing Magnetic Aura Circle */}
      <div
        className={`pointer-events-none fixed z-50 rounded-full border transition-transform duration-150 ease-out ${
          isHovered
            ? 'h-12 w-12 border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/30 scale-125'
            : 'h-8 w-8 border-amber-500/40 bg-amber-500/5'
        }`}
        style={{
          transform: `translate3d(${pos.x - (isHovered ? 24 : 16)}px, ${pos.y - (isHovered ? 24 : 16)}px, 0)`,
        }}
      />
      {/* Inner Pinpoint Cursor */}
      <div
        className="pointer-events-none fixed z-50 h-2 w-2 rounded-full bg-amber-400 shadow-md shadow-amber-400"
        style={{
          transform: `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`,
        }}
      />
    </>
  );
};
