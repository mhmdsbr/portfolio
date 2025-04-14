'use client'

import React, { useEffect, useRef } from "react";
import { BackgroundGradientStar } from "@/types/animation";

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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars.current.forEach(star => {
        star.baseX = star.x;
        star.baseY = star.y;
      });
    };

    const drawGradientBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(1, "#000428");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGradientBackground();

      stars.current.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        star.alpha += star.delta;
        if (star.alpha <= 0 || star.alpha >= 1) {
          star.delta = -star.delta;
        }
      });
    };

    const animate = () => {
      drawStars();
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
        className="absolute inset-0 -z-10 h-full"
        aria-hidden="true"
      />
    </>
  );
}