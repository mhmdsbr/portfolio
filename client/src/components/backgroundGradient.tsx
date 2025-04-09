'use client'

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { BackgroundGradientStar, BackgroundGradientMouse} from "@/types/animation";

export default function BackgroundGradient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const tailRef = useRef<HTMLDivElement[]>([]);
  const mouse = useRef<BackgroundGradientMouse>({ x: 0, y: 0 });
  const lastMouse = useRef<BackgroundGradientMouse>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const stars: BackgroundGradientStar[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      baseX: 0,
      baseY: 0,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      delta: Math.random() * 0.02
    }));

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars.forEach(star => {
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

      stars.forEach(star => {
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

    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const dx = x - lastMouse.current.x;
      const dy = y - lastMouse.current.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      lastMouse.current = { x, y };
      mouse.current = { x, y };

      if (pointerRef.current) {
        gsap.to(pointerRef.current, {
          x: x - 10,
          y: y - 15,
          rotate: angle,
          duration: 0.2,
          ease: "power2.out"
        });
      }

      const trailDot = document.createElement("div");
      trailDot.className = "fixed w-2 h-2 bg-white rounded-full pointer-events-none z-50 opacity-50";
      trailDot.style.left = `${x - 10}px`;
      trailDot.style.top = `${y - 20}px`;
      document.body.appendChild(trailDot);
      tailRef.current.push(trailDot);

      gsap.to(trailDot, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          document.body.removeChild(trailDot);
          tailRef.current = tailRef.current.filter(d => d !== trailDot);
        }
      });

      stars.forEach(star => {
        const offsetX = (x / window.innerWidth - 0.5) * 50 * (star.radius / 2);
        const offsetY = (y / window.innerHeight - 0.5) * 50 * (star.radius / 2);
        gsap.to(star, {
          x: star.baseX + offsetX,
          y: star.baseY + offsetY,
          duration: 0.5,
          ease: "power2.out"
        });
      });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("pointermove", handlePointerMove as EventListener);
    document.body.style.cursor = "none";
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove as EventListener);
      document.body.style.cursor = "auto";

      // Clean up any remaining trail dots
      tailRef.current.forEach(dot => {
        if (dot.parentNode) {
          document.body.removeChild(dot);
        }
      });
      tailRef.current = [];
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10 h-full"
        aria-hidden="true"
      />
      <div
        ref={pointerRef}
        className="fixed top-0 left-0 w-10 h-10 z-100 text-red pointer-events-none"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="yellow"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M12 2l2.39 7.26H22l-5.92 4.3L17.47 22 12 17.77 6.53 22l1.39-8.44L2 9.26h7.61z" />
        </svg>
      </div>
    </>
  );
}