'use client';

import React, { useEffect, useRef } from 'react';
import { BackgroundGradientStar } from '@/types/animation';
import { drawStarsWithGradient } from '@/utils/drawStars';

export default function BackgroundGradient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stars = useRef<BackgroundGradientStar[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      stars.current = Array.from({ length: 100 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: 0,
        baseY: 0,
        radius: Math.random() * 1 + 0.5,
        alpha: Math.random(),
        delta: 0.01 + Math.random() * 0.04,
      }));
    };

    const animate = () => {
      drawStarsWithGradient(ctx, canvas, stars.current);
      timeoutId.current = setTimeout(() => {
        animationFrameId.current = requestAnimationFrame(animate);
      }, 33);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (timeoutId.current) clearTimeout(timeoutId.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
      aria-hidden="true"
    />
  );
}