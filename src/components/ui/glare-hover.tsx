"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

type GlareHoverProps = {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  children?: ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: CSSProperties;
};

const RGB_COLOR_PATTERN =
  /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:\d*\.?\d+))?\s*\)$/i;

function clampOpacity(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function getGlareColorWithOpacity(glareColor: string, glareOpacity: number) {
  const opacity = clampOpacity(glareOpacity);
  const normalizedHex = glareColor.replace("#", "");

  if (/^[\dA-Fa-f]{6}$/.test(normalizedHex)) {
    const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
    const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
    const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  }

  if (/^[\dA-Fa-f]{3}$/.test(normalizedHex)) {
    const red = Number.parseInt(normalizedHex[0] + normalizedHex[0], 16);
    const green = Number.parseInt(normalizedHex[1] + normalizedHex[1], 16);
    const blue = Number.parseInt(normalizedHex[2] + normalizedHex[2], 16);
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  }

  const rgbMatch = glareColor.match(RGB_COLOR_PATTERN);

  if (rgbMatch) {
    const [, red, green, blue] = rgbMatch;
    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  }

  return glareColor;
}

export default function GlareHover({
  width = "100%",
  height = "100%",
  background = "rgba(255,255,255,0.04)",
  borderRadius = "28px",
  borderColor = "rgba(255,255,255,0.08)",
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.28,
  glareAngle = -38,
  glareSize = 220,
  transitionDuration = 650,
  playOnce = false,
  className = "",
  style = {},
}: GlareHoverProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const rgba = getGlareColorWithOpacity(glareColor, glareOpacity);

  const animateIn = () => {
    const element = overlayRef.current;
    if (!element) {
      return;
    }

    element.style.transition = "none";
    element.style.backgroundPosition = "-100% -100%, 0 0";
    element.style.transition = `${transitionDuration}ms ease`;
    element.style.backgroundPosition = "100% 100%, 0 0";
  };

  const animateOut = () => {
    const element = overlayRef.current;
    if (!element) {
      return;
    }

    if (playOnce) {
      element.style.transition = "none";
      element.style.backgroundPosition = "-100% -100%, 0 0";
      return;
    }

    element.style.transition = `${transitionDuration}ms ease`;
    element.style.backgroundPosition = "-100% -100%, 0 0";
  };

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(${glareAngle}deg, hsla(0,0%,0%,0) 58%, ${rgba} 72%, hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-100% -100%, 0 0",
    pointerEvents: "none",
  };

  return (
    <div
      className={`relative overflow-hidden border ${className}`.trim()}
      style={{
        width,
        height,
        background,
        borderRadius,
        borderColor,
        ...style,
      }}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
      <div ref={overlayRef} style={overlayStyle} />
      {children}
    </div>
  );
}
