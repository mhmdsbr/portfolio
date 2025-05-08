'use client'

import React, { useEffect, useRef } from "react";
import { BackgroundGradientStar } from "@/types/animation";
import { drawStarsWithGradient } from "@/utils/drawStars";

export default function BackgroundGradient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stars = useRef<BackgroundGradientStar[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    stars.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      baseX: 0,
      baseY: 0,
      radius: Math.random() * 1 + 0.5,
      alpha: Math.random(),
      delta: Math.random() * 0.02
    }));

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = document.documentElement.scrollWidth;
      const height = document.documentElement.scrollHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      stars.current.forEach(star => {
        star.baseX = star.x = Math.random() * width;
        star.baseY = star.y = Math.random() * height;
      });
    };

    const animate = () => {
      drawStarsWithGradient(ctx, canvas, stars.current);
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 -z-10 w-full h-full"
        aria-hidden="true"
      />
    </>
  );
}
