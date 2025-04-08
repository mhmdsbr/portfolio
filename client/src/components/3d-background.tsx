'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const circlesRef = useRef<any[]>([])
  const animationRef = useRef<gsap.core.Tween>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      if (animationRef.current?.scrollTrigger) {
         // Use direction 1 (downward trail) for static refresh redraws
         drawCircles(animationRef.current.scrollTrigger.progress, 1);
      } else {
         drawCircles(0, 1); // Initial draw
      }
    }

    circlesRef.current = Array.from({ length: 10 }, (_, i) => ({
      baseRadius: 5 + (i * 3),
      radius: 5 + (i * 3),
      maxRadius: 50 + (i * 30),
      z: i * 8,
      color: `hsla(${(i * 24) % 360}, 80%, 60%, ${0.1 + (i * 0.03)})`,
      initialX: 0,
      targetX: 0.5,
      initialScale: 0.2,
      targetScale: 2
    }))

    const drawCircles = (progress = 0, direction = 1) => {
      if (!ctx || !canvas) return

      // --- KEY CHANGE HERE ---
      // Define alpha for building trail (scrolling down)
      const clearAlphaDown = 0.05;
      // Define alpha for fading trail (scrolling up) - Needs to be > clearAlphaDown
      // Adjust this value to control how quickly the trail fades when scrolling up.
      // Values closer to clearAlphaDown = slower fade. Higher values = faster fade.
      const clearAlphaUp = 0.15; // <<< TRY TUNING THIS VALUE (e.g., 0.1, 0.15, 0.2)

      const clearAlpha = direction === -1 ? clearAlphaUp : clearAlphaDown;
      // --- END KEY CHANGE ---

      // Use viewport dimensions for clearing after scaling
      const viewportWidth = canvas.width / window.devicePixelRatio;
      const viewportHeight = canvas.height / window.devicePixelRatio;

      ctx.fillStyle = `rgba(0, 0, 0, ${clearAlpha})`;
      ctx.fillRect(0, 0, viewportWidth, viewportHeight);

      circlesRef.current
        .sort((a, b) => a.z - b.z)
        .forEach(circle => {
          const currentX = circle.initialX +
                         (circle.targetX - circle.initialX) * progress;
          const currentScale = circle.initialScale +
                            (circle.targetScale - circle.initialScale) * progress;
          const currentRadius = Math.max(1, circle.baseRadius +
                             (circle.maxRadius - circle.baseRadius) * progress);

          const centerX = viewportWidth * currentX;
          const centerY = viewportHeight / 2;
          const radius = Math.max(0.1, currentRadius * currentScale);

          ctx.beginPath();
          ctx.strokeStyle = circle.color;
          ctx.lineWidth = Math.max(0.1, 1.2 * currentScale);

          ctx.shadowBlur = Math.max(0, 3 * currentScale);
          ctx.shadowColor = circle.color;

          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.shadowBlur = 0;
        });
    }

    animationRef.current = gsap.to({}, {
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onUpdate: (self) => {
          drawCircles(self.progress, self.direction); // Pass direction
        },
        onRefresh: (self) => {
           drawCircles(self.progress, 1); // Use default downward trail for refresh
        },
        invalidateOnRefresh: true
      }
    });

    resizeCanvas(); // Initial draw
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      animationRef.current?.scrollTrigger?.kill();
      animationRef.current?.kill();
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  )
}