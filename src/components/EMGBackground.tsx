"use client";

import { useEffect, useRef } from "react";

type SignalState = {
  low: number;
  smooth: number;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

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
    let pressed = false;
    let activation = 0;
    let lastTime = performance.now();
    let sampleBuffer = new Float32Array(0);
    let sampleCount = 0;
    let drawStep = 2;
    let carryPx = 0;

    const signalState: SignalState = { low: 0, smooth: 0 };

    const configureCanvas = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      drawStep = width < 900 ? 2 : 3;
      sampleCount = Math.max(64, Math.ceil(width / drawStep) + 2);
      sampleBuffer = new Float32Array(sampleCount);
      for (let i = 0; i < sampleCount; i += 1) {
        sampleBuffer[i] = nextSample();
      }
    };

    const nextSample = () => {
      const white = Math.random() * 2 - 1;
      signalState.low = signalState.low * 0.93 + white * 0.07;
      const band = white - signalState.low;
      signalState.smooth = signalState.smooth * 0.72 + band * 0.28;
      return signalState.smooth;
    };

    const drawFrame = (time: number) => {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      if (pressed) {
        activation += dt * 1.85;
      } else {
        activation *= Math.exp(-dt * 2.8);
      }
      activation = clamp01(activation);

      context.clearRect(0, 0, width, height);

      const centerY = height * 0.52;
      const baselineAmplitude = Math.max(2.1, height * 0.0048);
      const activeAmplitude = Math.max(5.5, height * 0.019);
      const amplitude = baselineAmplitude + (activeAmplitude - baselineAmplitude) * activation;
      const speed = 72 + activation * 105;
      carryPx += speed * dt;
      const shiftSamples = Math.floor(carryPx / drawStep);
      if (shiftSamples > 0) {
        carryPx -= shiftSamples * drawStep;
        const shift = Math.min(shiftSamples, sampleCount - 1);
        sampleBuffer.copyWithin(0, shift);
        for (let i = sampleCount - shift; i < sampleCount; i += 1) {
          sampleBuffer[i] = nextSample();
        }
      }

      const glowAlpha = 0.04 + activation * 0.08;
      const lineAlpha = 0.14 + activation * 0.08;

      context.beginPath();
      for (let i = 0; i < sampleCount; i += 1) {
        const x = i * drawStep;
        const y = centerY + sampleBuffer[i] * amplitude;
        if (x === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.strokeStyle = `rgba(153, 214, 255, ${lineAlpha.toFixed(3)})`;
      context.lineWidth = 1;
      context.shadowColor = `rgba(153, 214, 255, ${glowAlpha.toFixed(3)})`;
      context.shadowBlur = 6 + activation * 14;
      context.stroke();
      context.shadowBlur = 0;

      rafId = window.requestAnimationFrame(drawFrame);
    };

    const drawStatic = () => {
      context.clearRect(0, 0, width, height);

      const centerY = height * 0.5;
      const xStep = 2;
      const amplitude = Math.max(1.9, height * 0.0048);
      let phaseA = 0;
      let phaseB = 1.2;

      context.beginPath();
      for (let x = 0; x <= width; x += xStep) {
        phaseA += 0.08;
        phaseB += 0.21;
        const bandNoise = Math.sin(phaseA) * 0.55 + Math.sin(phaseB) * 0.28;
        const y = centerY + bandNoise * amplitude;
        if (x === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }

      context.strokeStyle = "rgba(153, 214, 255, 0.1)";
      context.lineWidth = 1;
      context.stroke();
    };

    const onPointerDown = () => {
      pressed = true;
    };

    const onPointerUp = () => {
      pressed = false;
    };

    const onResize = () => {
      configureCanvas();
      if (reducedMotion) {
        drawStatic();
      }
    };

    configureCanvas();

    if (reducedMotion) {
      drawStatic();
    } else {
      rafId = window.requestAnimationFrame(drawFrame);
      window.addEventListener("mousedown", onPointerDown, { passive: true });
      window.addEventListener("mouseup", onPointerUp, { passive: true });
      window.addEventListener("touchstart", onPointerDown, { passive: true });
      window.addEventListener("touchend", onPointerUp, { passive: true });
      window.addEventListener("touchcancel", onPointerUp, { passive: true });
    }

    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("touchcancel", onPointerUp);
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
