"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

import {
  createMobileEffectsQueries,
  getMobileEffectsPolicyState,
  subscribeToMobileEffectsPolicy,
} from "@/lib/mobile-effects-policy";

type LetterGlitchProps = {
  glitchColors?: [string, string, string] | string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  characters?: string;
};

type LetterState = {
  char: string;
  color: string;
  sourceColor: string;
  targetColor: string;
  colorProgress: number;
};

const FONT_SIZE = 16;
const CHAR_WIDTH = 10;
const CHAR_HEIGHT = 20;
const MAX_CANVAS_DPR = 1.5;
const MOBILE_CANVAS_DPR = 1.1;
const MOBILE_GLITCH_SPEED_MULTIPLIER = 1.8;
const MOBILE_UPDATE_RATIO = 0.025;
const DESKTOP_UPDATE_RATIO = 0.05;
const DEFAULT_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789";
const DEFAULT_COLORS = ["#41B06E", "#211C6A", "#FFF5E0"];

export default function LetterGlitch({
  glitchColors = DEFAULT_COLORS,
  glitchSpeed = 80,
  centerVignette = true,
  outerVignette = true,
  smooth = true,
  characters = DEFAULT_CHARACTERS,
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lettersRef = useRef<LetterState[]>([]);
  const gridRef = useRef({ columns: 0, rows: 0 });
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTimeRef = useRef(0);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const lettersAndSymbols = Array.from(characters);

    if (!canvas) {
      return;
    }

    contextRef.current = canvas.getContext("2d");

    if (!contextRef.current) {
      return;
    }

    lastGlitchTimeRef.current = Date.now();
    const mobileEffectsQueries = createMobileEffectsQueries();

    function getPolicyState() {
      return getMobileEffectsPolicyState(mobileEffectsQueries);
    }

    function getCanvasDevicePixelRatio() {
      const devicePixelRatio = window.devicePixelRatio || 1;
      return Math.min(
        devicePixelRatio,
        getPolicyState().isTouchOptimizedMode ? MOBILE_CANVAS_DPR : MAX_CANVAS_DPR,
      );
    }

    function getRandomChar() {
      return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
    }

    function getRandomColor() {
      return glitchColors[Math.floor(Math.random() * glitchColors.length)];
    }

    function hexToRgb(hex: string) {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const normalizedHex = hex.replace(shorthandRegex, (_match, r, g, b) => {
        return `${r}${r}${g}${g}${b}${b}`;
      });

      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalizedHex);

      return result
        ? {
            r: Number.parseInt(result[1], 16),
            g: Number.parseInt(result[2], 16),
            b: Number.parseInt(result[3], 16),
          }
        : null;
    }

    function interpolateColor(
      start: { r: number; g: number; b: number },
      end: { r: number; g: number; b: number },
      factor: number,
    ) {
      return `rgb(${Math.round(start.r + (end.r - start.r) * factor)}, ${Math.round(
        start.g + (end.g - start.g) * factor,
      )}, ${Math.round(start.b + (end.b - start.b) * factor)})`;
    }

    function calculateGrid(width: number, height: number) {
      return {
        columns: Math.ceil(width / CHAR_WIDTH),
        rows: Math.ceil(height / CHAR_HEIGHT),
      };
    }

    function createLetterState() {
        const color = getRandomColor();

        return {
          char: getRandomChar(),
          color,
          sourceColor: color,
          targetColor: color,
          colorProgress: 1,
        };
    }

    function updateLetterGrid(columns: number, rows: number, preserveExisting: boolean) {
      const totalLetters = columns * rows;
      const previousLetters = preserveExisting ? lettersRef.current : [];

      lettersRef.current = Array.from(
        { length: totalLetters },
        (_item, index) => previousLetters[index] ?? createLetterState(),
      );
      gridRef.current = { columns, rows };
    }

    function drawLetters() {
      const currentCanvas = canvasRef.current;
      const context = contextRef.current;

      if (!currentCanvas || !context || lettersRef.current.length === 0) {
        return;
      }

      const { width, height } = currentCanvas.getBoundingClientRect();
      context.clearRect(0, 0, width, height);
      context.font = `${FONT_SIZE}px monospace`;
      context.textBaseline = "top";

      lettersRef.current.forEach((letter, index) => {
        const x = (index % gridRef.current.columns) * CHAR_WIDTH;
        const y = Math.floor(index / gridRef.current.columns) * CHAR_HEIGHT;
        context.fillStyle = letter.color;
        context.fillText(letter.char, x, y);
      });
    }

    function resizeCanvas() {
      const currentCanvas = canvasRef.current;
      const context = contextRef.current;

      if (!currentCanvas || !context) {
        return;
      }

      const parent = currentCanvas.parentElement;

      if (!parent) {
        return;
      }

      const devicePixelRatio = getCanvasDevicePixelRatio();
      const rect = parent.getBoundingClientRect();

      currentCanvas.width = rect.width * devicePixelRatio;
      currentCanvas.height = rect.height * devicePixelRatio;
      currentCanvas.style.width = `${rect.width}px`;
      currentCanvas.style.height = `${rect.height}px`;

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      const { columns, rows } = calculateGrid(rect.width, rect.height);
      const preserveExistingLetters =
        lettersRef.current.length > 0 && gridRef.current.columns === columns;
      updateLetterGrid(columns, rows, preserveExistingLetters);
      drawLetters();
    }

    function updateLetters() {
      if (lettersRef.current.length === 0) {
        return;
      }

      const updateRatio = getPolicyState().isTouchOptimizedMode
        ? MOBILE_UPDATE_RATIO
        : DESKTOP_UPDATE_RATIO;
      const updateCount = Math.max(1, Math.floor(lettersRef.current.length * updateRatio));

      for (let index = 0; index < updateCount; index += 1) {
        const randomIndex = Math.floor(Math.random() * lettersRef.current.length);
        const target = lettersRef.current[randomIndex];

        if (!target) {
          continue;
        }

        const nextColor = getRandomColor();
        target.char = getRandomChar();
        target.sourceColor = target.color;
        target.targetColor = nextColor;
        target.colorProgress = smooth ? 0 : 1;
        target.color = smooth ? target.sourceColor : nextColor;
      }
    }

    function handleSmoothTransitions() {
      let needsRedraw = false;

      lettersRef.current.forEach((letter) => {
        if (letter.colorProgress >= 1) {
          return;
        }

        letter.colorProgress = Math.min(1, letter.colorProgress + 0.05);

        const startRgb = hexToRgb(letter.sourceColor);
        const endRgb = hexToRgb(letter.targetColor);

        if (!startRgb || !endRgb) {
          letter.color = letter.targetColor;
        } else {
          letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
        }

        needsRedraw = true;
      });

      if (needsRedraw) {
        drawLetters();
      }
    }

    function stopAnimation() {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    function startAnimation() {
      if (animationFrameRef.current !== null || reducedMotionRef.current || document.hidden) {
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    function animate() {
      if (document.hidden || reducedMotionRef.current) {
        animationFrameRef.current = null;
        return;
      }

      const now = Date.now();
        const effectiveGlitchSpeed = getPolicyState().isTouchOptimizedMode
          ? glitchSpeed * MOBILE_GLITCH_SPEED_MULTIPLIER
          : glitchSpeed;

      if (now - lastGlitchTimeRef.current >= effectiveGlitchSpeed) {
        updateLetters();
        drawLetters();
        lastGlitchTimeRef.current = now;
      }

      if (smooth) {
        handleSmoothTransitions();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    function handlePolicyChange() {
      reducedMotionRef.current = getPolicyState().prefersReducedMotion;
      stopAnimation();
      resizeCanvas();

      if (!reducedMotionRef.current) {
        lastGlitchTimeRef.current = Date.now();
        startAnimation();
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopAnimation();
        return;
      }

      lastGlitchTimeRef.current = Date.now();
      startAnimation();
    }

    function handleResize() {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        stopAnimation();
        resizeCanvas();
        lastGlitchTimeRef.current = Date.now();
        startAnimation();
      }, 100);
    }

    reducedMotionRef.current = getPolicyState().prefersReducedMotion;
    resizeCanvas();
    startAnimation();
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const unsubscribePolicy = subscribeToMobileEffectsPolicy(
      mobileEffectsQueries,
      handlePolicyChange,
    );

    return () => {
      stopAnimation();

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsubscribePolicy();
    };
  }, [characters, glitchColors, glitchSpeed, smooth]);

  const containerStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "#050505",
  };

  const canvasStyle: CSSProperties = {
    display: "block",
    width: "100%",
    height: "100%",
    opacity: 0.96,
  };

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  };

  const outerVignetteStyle: CSSProperties = {
    ...overlayStyle,
    background: "radial-gradient(circle, rgba(0, 0, 0, 0) 54%, rgba(0, 0, 0, 0.92) 100%)",
  };

  const centerVignetteStyle: CSSProperties = {
    ...overlayStyle,
    background: "radial-gradient(circle, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0) 55%)",
  };

  return (
    <div style={containerStyle}>
      <canvas ref={canvasRef} style={canvasStyle} />
      {outerVignette ? <div style={outerVignetteStyle} /> : null}
      {centerVignette ? <div style={centerVignetteStyle} /> : null}
    </div>
  );
}
