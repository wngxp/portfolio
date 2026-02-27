"use client";

import { useEffect, useRef } from "react";

type Strand = {
  baseYRatio: number;
  phase: number;
  speed: number;
  opacity: number;
  depth: number;
  sway: number;
  bend: number;
};

type Pulse = {
  x: number;
  y: number;
  startTime: number;
};

const STRAND_COUNT = 16;
const PULSE_DURATION_MS = 800;

export default function NeuralFieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;

    const mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    const parallax = { x: 0, y: 0 };
    const pulses: Pulse[] = [];

    const strands: Strand[] = Array.from({ length: STRAND_COUNT }, (_, index) => {
      const ratio = (index + 1) / (STRAND_COUNT + 1);
      return {
        baseYRatio: ratio,
        phase: Math.random() * Math.PI * 2,
        speed: 0.7 + Math.random() * 0.8,
        opacity: 0.05 + Math.random() * 0.07,
        depth: 0.45 + Math.random() * 0.85,
        sway: 18 + Math.random() * 30,
        bend: 24 + Math.random() * 42
      };
    });

    const configureCanvas = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawFrame = (timeMs: number, staticOnly: boolean) => {
      context.clearRect(0, 0, width, height);

      const t = timeMs / 1000;
      const targetX = ((mouse.x / Math.max(1, width)) - 0.5) * 2;
      const targetY = ((mouse.y / Math.max(1, height)) - 0.5) * 2;

      parallax.x += (targetX - parallax.x) * 0.03;
      parallax.y += (targetY - parallax.y) * 0.03;

      if (!staticOnly && pulses.length > 0) {
        for (let i = pulses.length - 1; i >= 0; i -= 1) {
          if (timeMs - pulses[i].startTime > PULSE_DURATION_MS) {
            pulses.splice(i, 1);
          }
        }
      }

      const startX = -width * 0.08;
      const endX = width * 1.08;

      for (const strand of strands) {
        const localTime = t * 0.12 * strand.speed + strand.phase;
        const baseY = strand.baseYRatio * height;

        const driftY = staticOnly
          ? 0
          : Math.sin(localTime * 0.8) * strand.sway + Math.cos(localTime * 0.55) * strand.sway * 0.35;

        const parallaxX = staticOnly ? 0 : parallax.x * 14 * strand.depth;
        const parallaxY = staticOnly ? 0 : parallax.y * 10 * strand.depth;

        let rippleY = 0;
        let brightnessBoost = 0;

        if (!staticOnly && pulses.length > 0) {
          for (const pulse of pulses) {
            const ageMs = timeMs - pulse.startTime;
            const age = ageMs / PULSE_DURATION_MS;
            if (age <= 0 || age >= 1) {
              continue;
            }

            const decay = Math.exp(-age * 3.4);
            const yDistance = Math.abs(baseY - pulse.y);
            const yInfluence = Math.exp(-(yDistance * yDistance) / (2 * 140 * 140));

            if (yInfluence < 0.01) {
              continue;
            }

            const xCenter = width * strand.baseYRatio;
            const xDistance = Math.abs(xCenter - pulse.x);
            const xInfluence = Math.exp(-(xDistance * xDistance) / (2 * 320 * 320));
            const influence = yInfluence * (0.55 + xInfluence * 0.45);

            const wave = Math.sin(age * Math.PI * 2.2 + strand.phase * 0.9);
            rippleY += wave * influence * decay * 8;
            brightnessBoost += influence * decay;
          }
        }

        const y = baseY + driftY + parallaxY + rippleY;

        const cp1x = width * 0.3 + parallaxX + Math.sin(localTime * 1.05) * strand.bend;
        const cp1y = y + Math.cos(localTime * 1.2 + strand.phase) * strand.sway * 1.15;
        const cp2x = width * 0.7 + parallaxX + Math.cos(localTime * 0.9 + strand.phase * 0.8) * strand.bend;
        const cp2y = y - Math.sin(localTime * 1.1 + strand.phase * 1.1) * strand.sway * 1.08;

        const alpha = Math.min(0.2, strand.opacity + brightnessBoost * 0.05);
        const glow = 2 + strand.depth * 1.8 + brightnessBoost * 3;

        context.beginPath();
        context.moveTo(startX, y + Math.sin(localTime * 0.7) * strand.sway * 0.25);
        context.bezierCurveTo(
          cp1x,
          cp1y,
          cp2x,
          cp2y,
          endX,
          y + Math.cos(localTime * 0.75 + strand.phase) * strand.sway * 0.25
        );

        context.strokeStyle = `rgba(138, 195, 247, ${alpha.toFixed(3)})`;
        context.lineWidth = 0.85 + strand.depth * 0.35;
        context.shadowColor = `rgba(138, 195, 247, ${(alpha * 0.58).toFixed(3)})`;
        context.shadowBlur = glow;
        context.stroke();
      }

      context.shadowBlur = 0;

      if (!staticOnly) {
        rafId = window.requestAnimationFrame((nextTime) => {
          drawFrame(nextTime, false);
        });
      }
    };

    const onResize = () => {
      configureCanvas();
      if (reducedMotion) {
        drawFrame(performance.now(), true);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
      }
    };

    const pushPulse = (x: number, y: number) => {
      pulses.push({ x, y, startTime: performance.now() });
    };

    const onMouseDown = (event: MouseEvent) => {
      pushPulse(event.clientX, event.clientY);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        pushPulse(touch.clientX, touch.clientY);
      }
    };

    configureCanvas();

    if (reducedMotion) {
      drawFrame(performance.now(), true);
    } else {
      rafId = window.requestAnimationFrame((timeMs) => {
        drawFrame(timeMs, false);
      });

      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("mousedown", onMouseDown, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
    }

    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
