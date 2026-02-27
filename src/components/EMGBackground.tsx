"use client";

import { useEffect, useRef } from "react";

type PulseSpike = {
  originX: number;
  startTime: number;
  amplitude: number;
  speed: number;
  width: number;
};

export default function EMGBackground() {
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
    let isHolding = false;
    let holdIntervalId: number | null = null;
    let pointerX = window.innerWidth * 0.5;
    let spikes: PulseSpike[] = [];

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

    const gaussian = (dx: number, sigma: number) => {
      const normalized = dx / sigma;
      return Math.exp(-0.5 * normalized * normalized);
    };

    const injectSpike = (now: number) => {
      spikes.push({
        originX: pointerX,
        startTime: now,
        amplitude: 19,
        speed: 300,
        width: 12
      });
    };

    const stopHold = () => {
      isHolding = false;
      if (holdIntervalId !== null) {
        window.clearInterval(holdIntervalId);
        holdIntervalId = null;
      }
    };

    const drawWaveform = (time: number, staticOnly: boolean) => {
      context.clearRect(0, 0, width, height);

      const seconds = time / 1000;
      const centerY = height * 0.52;
      const xStep = 2;
      const baselineAmplitude = Math.max(1.4, height * 0.0034);
      const maxAge = 4.5;
      const decayRate = 1.5;

      if (!staticOnly) {
        spikes = spikes.filter((spike) => {
          const age = seconds - spike.startTime / 1000;
          if (age < 0 || age > maxAge) {
            return false;
          }
          return spike.amplitude * Math.exp(-decayRate * age) > 0.1;
        });
      }

      let activeEnergy = 0;
      context.beginPath();

      for (let x = 0; x <= width; x += xStep) {
        const drift =
          Math.sin(x * 0.012 + seconds * 0.5) * baselineAmplitude +
          Math.sin(x * 0.024 - seconds * 0.27) * baselineAmplitude * 0.35;

        let pulse = 0;
        if (!staticOnly && spikes.length > 0) {
          for (const spike of spikes) {
            const elapsed = Math.max(0, seconds - spike.startTime / 1000);
            const travel = spike.speed * elapsed;
            const decay = Math.exp(-decayRate * elapsed);
            const leftCenter = spike.originX - travel;
            const rightCenter = spike.originX + travel;
            const leftPulse = gaussian(x - leftCenter, spike.width);
            const rightPulse = gaussian(x - rightCenter, spike.width);
            const contribution = spike.amplitude * decay * (leftPulse + rightPulse);
            pulse += contribution;
            activeEnergy += contribution;
          }
        }

        const y = centerY + drift - pulse;
        if (x === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      const normalizedEnergy = Math.min(1, activeEnergy / Math.max(1, width * 2.2));
      const lineAlpha = staticOnly ? 0.09 : 0.15 + normalizedEnergy * 0.1;
      const glowAlpha = staticOnly ? 0.03 : 0.05 + normalizedEnergy * 0.09;

      context.strokeStyle = `rgba(153, 214, 255, ${lineAlpha.toFixed(3)})`;
      context.lineWidth = 1;
      context.shadowColor = `rgba(153, 214, 255, ${glowAlpha.toFixed(3)})`;
      context.shadowBlur = staticOnly ? 2 : 4 + normalizedEnergy * 8;
      context.stroke();
      context.shadowBlur = 0;
    };

    const animate = (time: number) => {
      drawWaveform(time, false);
      rafId = window.requestAnimationFrame(animate);
    };

    const onMouseMove = (event: MouseEvent) => {
      pointerX = event.clientX;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        pointerX = event.touches[0].clientX;
      }
    };

    const startHold = () => {
      if (holdIntervalId !== null) {
        window.clearInterval(holdIntervalId);
      }
      holdIntervalId = window.setInterval(() => {
        injectSpike(performance.now());
      }, 300);
    };

    const onMouseDown = (event: MouseEvent) => {
      pointerX = event.clientX;
      isHolding = true;
      injectSpike(performance.now());
      startHold();
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        pointerX = event.touches[0].clientX;
      }
      isHolding = true;
      injectSpike(performance.now());
      startHold();
    };

    const onResize = () => {
      configureCanvas();
      if (reducedMotion) {
        drawWaveform(performance.now(), true);
      }
    };

    configureCanvas();

    if (reducedMotion) {
      drawWaveform(performance.now(), true);
    } else {
      rafId = window.requestAnimationFrame(animate);
      window.addEventListener("mousedown", onMouseDown, { passive: true });
      window.addEventListener("mouseup", stopHold, { passive: true });
      window.addEventListener("mouseleave", stopHold, { passive: true });
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", stopHold, { passive: true });
      window.addEventListener("touchcancel", stopHold, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
    }

    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      stopHold();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", stopHold);
      window.removeEventListener("mouseleave", stopHold);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", stopHold);
      window.removeEventListener("touchcancel", stopHold);
      window.removeEventListener("touchmove", onTouchMove);
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
