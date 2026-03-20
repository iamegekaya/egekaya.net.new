"use client";

/* eslint-disable @next/next/no-img-element */

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  createMobileEffectsQueries,
  getMobileEffectsPolicyState,
  subscribeToMobileEffectsPolicy,
} from "@/lib/mobile-effects-policy";

const DEFAULT_INNER_GRADIENT = "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180,
} as const;

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value: number, precision = 3) => Number.parseFloat(value.toFixed(precision));
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

const KEYFRAMES_ID = "pc-keyframes";

if (typeof document !== "undefined" && !document.getElementById(KEYFRAMES_ID)) {
  const style = document.createElement("style");
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes pc-holo-bg {
      0% { background-position: 0 var(--background-y), 0 0, center; }
      100% { background-position: 0 var(--background-y), 90% 90%, center; }
    }
  `;
  document.head.appendChild(style);
}

type ProfileCardProps = {
  avatarUrl?: string;
  iconUrl?: string;
  innerGradient?: string;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  className?: string;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  mobileTiltSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  titleLines?: string[];
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
};

type TiltEngine = {
  setImmediate: (x: number, y: number) => void;
  setTarget: (x: number, y: number) => void;
  toCenter: () => void;
  beginInitial: (durationMs: number) => void;
  getCurrent: () => { x: number; y: number; tx: number; ty: number };
  cancel: () => void;
};

type CardStyle = CSSProperties & Record<`--${string}`, string>;

function ProfileCardComponent({
  avatarUrl = "/pp.png",
  iconUrl = "/spyware.svg",
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = "",
  enableTilt = true,
  enableMobileTilt = true,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = "Ege Kaya",
  title = "Cyber Security Engineer",
  titleLines = [],
  handle = "iamegekaya",
  status = "Online",
  contactText = "Contact",
  showUserInfo = true,
  onContactClick,
}: ProfileCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const enterTimerRef = useRef<number | null>(null);
  const leaveRafRef = useRef<number | null>(null);
  const [isMobileReducedMode, setIsMobileReducedMode] = useState(false);

  useEffect(() => {
    const queries = createMobileEffectsQueries();

    const updateMode = () => {
      setIsMobileReducedMode(getMobileEffectsPolicyState(queries).shouldReduceEffects);
    };

    updateMode();

    return subscribeToMobileEffectsPolicy(queries, updateMode);
  }, []);

  const tiltEngine = useMemo<TiltEngine | null>(() => {
    if (!enableTilt) {
      return null;
    }

    let rafId: number | null = null;
    let running = false;
    let lastTimestamp = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVarsFromXY = (x: number, y: number) => {
      const shell = shellRef.current;
      const wrapper = wrapRef.current;

      if (!shell || !wrapper) {
        return;
      }

      const width = shell.clientWidth || 1;
      const height = shell.clientHeight || 1;
      const percentX = clamp((100 / width) * x);
      const percentY = clamp((100 / height) * y);
      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const properties: Record<string, string> = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5))}deg`,
        "--rotate-y": `${round(centerY / 4)}deg`,
      };

      Object.entries(properties).forEach(([key, nextValue]) => {
        wrapper.style.setProperty(key, nextValue);
      });
    };

    const step = (timestamp: number) => {
      if (!running) {
        return;
      }

      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }

      const deltaTime = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const tau = timestamp < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const factor = 1 - Math.exp(-deltaTime / tau);

      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;

      setVarsFromXY(currentX, currentY);

      const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

      if (stillFar || document.hasFocus()) {
        rafId = requestAnimationFrame(step);
        return;
      }

      running = false;
      lastTimestamp = 0;

      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const start = () => {
      if (running) {
        return;
      }

      running = true;
      lastTimestamp = 0;
      rafId = requestAnimationFrame(step);
    };

    return {
      setImmediate(x: number, y: number) {
        currentX = x;
        currentY = y;
        setVarsFromXY(currentX, currentY);
      },
      setTarget(x: number, y: number) {
        targetX = x;
        targetY = y;
        start();
      },
      toCenter() {
        const shell = shellRef.current;
        if (!shell) {
          return;
        }

        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(durationMs: number) {
        initialUntil = performance.now() + durationMs;
        start();
      },
      getCurrent() {
        return { x: currentX, y: currentY, tx: targetX, ty: targetY };
      },
      cancel() {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }

        rafId = null;
        running = false;
        lastTimestamp = 0;
      },
    };
  }, [enableTilt]);

  const getOffsets = (event: PointerEvent, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) {
        return;
      }

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine],
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent) => {
      const shell = shellRef.current;
      const card = cardRef.current;

      if (!shell || !card || !tiltEngine) {
        return;
      }

      shell.classList.add("active");
      shell.classList.add("entering");
      card.style.transition = "none";
      card.style.transform = "translateZ(0) rotateX(var(--rotate-y)) rotateY(var(--rotate-x))";

      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current);
      }

      enterTimerRef.current = window.setTimeout(() => {
        shell.classList.remove("entering");
      }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

      const { x, y } = getOffsets(event, shell);
      tiltEngine.setTarget(x, y);
    },
    [tiltEngine],
  );

  const handlePointerLeave = useCallback(() => {
    const shell = shellRef.current;
    const card = cardRef.current;

    if (!shell || !card || !tiltEngine) {
      return;
    }

    tiltEngine.toCenter();

    const checkSettle = () => {
      const { x, y, tx, ty } = tiltEngine.getCurrent();
      const settled = Math.hypot(tx - x, ty - y) < 0.6;

      if (settled) {
        shell.classList.remove("active");
        card.style.transition = shell.classList.contains("entering")
          ? "transform 180ms ease-out"
          : "transform 1s ease";
        card.style.transform = "translateZ(0) rotateX(0deg) rotateY(0deg)";
        leaveRafRef.current = null;
        return;
      }

      leaveRafRef.current = requestAnimationFrame(checkSettle);
    };

    if (leaveRafRef.current) {
      cancelAnimationFrame(leaveRafRef.current);
    }

    leaveRafRef.current = requestAnimationFrame(checkSettle);
  }, [tiltEngine]);

  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const shell = shellRef.current;
      if (!shell || !tiltEngine) {
        return;
      }

      const { beta, gamma } = event;
      if (beta == null || gamma == null) {
        return;
      }

      const centerX = shell.clientWidth / 2;
      const centerY = shell.clientHeight / 2;
      const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
      const y = clamp(
        centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        0,
        shell.clientHeight,
      );

      tiltEngine.setTarget(x, y);
    },
    [mobileTiltSensitivity, tiltEngine],
  );

  useEffect(() => {
    if (!enableTilt || !tiltEngine) {
      return;
    }

    const shell = shellRef.current;
    if (!shell) {
      return;
    }

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;
    const deviceOrientationHandler = handleDeviceOrientation as EventListener;

    shell.addEventListener("pointerenter", pointerEnterHandler);
    shell.addEventListener("pointermove", pointerMoveHandler);
    shell.addEventListener("pointerleave", pointerLeaveHandler);

    const handleClick = () => {
      if (!enableMobileTilt || isMobileReducedMode || window.location.protocol !== "https:") {
        return;
      }

      const anyMotion = window.DeviceMotionEvent as typeof DeviceMotionEvent & {
        requestPermission?: () => Promise<string>;
      };

      if (typeof anyMotion?.requestPermission === "function") {
        anyMotion
          .requestPermission()
          .then((state: string) => {
            if (state === "granted") {
              window.addEventListener("deviceorientation", deviceOrientationHandler);
            }
          })
          .catch(console.error);
        return;
      }

      window.addEventListener("deviceorientation", deviceOrientationHandler);
    };

    shell.addEventListener("click", handleClick);

    const initialX = (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    tiltEngine.setImmediate(initialX, initialY);
    tiltEngine.toCenter();
    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener("pointerenter", pointerEnterHandler);
      shell.removeEventListener("pointermove", pointerMoveHandler);
      shell.removeEventListener("pointerleave", pointerLeaveHandler);
      shell.removeEventListener("click", handleClick);
      window.removeEventListener("deviceorientation", deviceOrientationHandler);

      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current);
      }

      if (leaveRafRef.current) {
        cancelAnimationFrame(leaveRafRef.current);
      }

      tiltEngine.cancel();
      shell.classList.remove("entering");
      shell.classList.remove("active");
    };
  }, [
    enableMobileTilt,
    enableTilt,
    handleDeviceOrientation,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerMove,
    isMobileReducedMode,
    tiltEngine,
  ]);

  const cardRadius = "30px";

  const cardStyle = useMemo(
    () =>
      ({
        "--icon": iconUrl ? `url(${iconUrl})` : "none",
        "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
        "--behind-glow-color": behindGlowColor ?? "rgba(125, 190, 255, 0.67)",
        "--behind-glow-size": behindGlowSize ?? "50%",
        "--pointer-x": "50%",
        "--pointer-y": "50%",
        "--pointer-from-center": "0",
        "--pointer-from-top": "0.5",
        "--pointer-from-left": "0.5",
        "--card-opacity": "0",
        "--rotate-x": "0deg",
        "--rotate-y": "0deg",
        "--background-x": "50%",
        "--background-y": "50%",
        "--card-radius": cardRadius,
        "--sunpillar-1": "hsl(2, 100%, 73%)",
        "--sunpillar-2": "hsl(53, 100%, 69%)",
        "--sunpillar-3": "hsl(93, 100%, 69%)",
        "--sunpillar-4": "hsl(176, 100%, 76%)",
        "--sunpillar-5": "hsl(228, 100%, 74%)",
        "--sunpillar-6": "hsl(283, 100%, 73%)",
        "--sunpillar-clr-1": "var(--sunpillar-1)",
        "--sunpillar-clr-2": "var(--sunpillar-2)",
        "--sunpillar-clr-3": "var(--sunpillar-3)",
        "--sunpillar-clr-4": "var(--sunpillar-4)",
        "--sunpillar-clr-5": "var(--sunpillar-5)",
        "--sunpillar-clr-6": "var(--sunpillar-6)",
      }) satisfies CardStyle,
    [behindGlowColor, behindGlowSize, cardRadius, iconUrl, innerGradient],
  );

  const shineStyle: CSSProperties = {
    maskImage: "var(--icon)",
    WebkitMaskImage: "var(--icon)",
    maskMode: "luminance",
    maskRepeat: "space",
    WebkitMaskRepeat: "space",
    maskSize: "15%",
    WebkitMaskSize: "15%",
    maskPosition: "top calc(200% - (var(--background-y) * 5)) left calc(100% - var(--background-x))",
    WebkitMaskPosition: "top calc(200% - (var(--background-y) * 5)) left calc(100% - var(--background-x))",
    filter: "brightness(0.66) contrast(1.33) saturate(0.33) opacity(0.5)",
    animation: isMobileReducedMode ? "none" : "pc-holo-bg 18s linear infinite",
    animationPlayState: isMobileReducedMode ? "paused" : "running",
    mixBlendMode: "color-dodge",
    transform: "translate3d(0, 0, 1px)",
    overflow: "hidden",
    zIndex: 0,
    background: "transparent",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: `
      repeating-linear-gradient(
        0deg,
        var(--sunpillar-clr-1) 5%,
        var(--sunpillar-clr-2) 10%,
        var(--sunpillar-clr-3) 15%,
        var(--sunpillar-clr-4) 20%,
        var(--sunpillar-clr-5) 25%,
        var(--sunpillar-clr-6) 30%,
        var(--sunpillar-clr-1) 35%
      ),
      repeating-linear-gradient(
        -45deg,
        #0e152e 0%,
        hsl(180, 10%, 60%) 3.8%,
        hsl(180, 29%, 66%) 4.5%,
        hsl(180, 10%, 60%) 5.2%,
        #0e152e 10%,
        #0e152e 12%
      ),
      radial-gradient(
        farthest-corner circle at var(--pointer-x) var(--pointer-y),
        hsla(0, 0%, 0%, 0.1) 12%,
        hsla(0, 0%, 0%, 0.15) 20%,
        hsla(0, 0%, 0%, 0.25) 120%
      )
    `.replace(/\s+/g, " "),
    gridArea: "1 / -1",
    borderRadius: cardRadius,
    pointerEvents: "none",
  };

  const glareStyle: CSSProperties = {
    transform: "translate3d(0, 0, 1.1px)",
    overflow: "hidden",
    backgroundImage:
      "radial-gradient(farthest-corner circle at var(--pointer-x) var(--pointer-y), hsl(248, 25%, 80%) 12%, hsla(207, 40%, 30%, 0.8) 90%)",
    mixBlendMode: "overlay",
    filter: "brightness(0.8) contrast(1.2)",
    zIndex: 1,
    gridArea: "1 / -1",
    borderRadius: cardRadius,
    pointerEvents: "none",
  };

  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`.trim()}
      style={{
        width: "min(100%, 24rem)",
        perspective: "500px",
        touchAction: "pan-y",
        transform: "translate3d(0, 0, 0.1px)",
        ...cardStyle,
      }}
    >
      {behindGlowEnabled ? (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-200 ease-out"
          style={{
            background:
              "radial-gradient(circle at var(--pointer-x) var(--pointer-y), var(--behind-glow-color) 0%, transparent var(--behind-glow-size))",
            filter: "blur(50px) saturate(1.1)",
            opacity: "calc(0.8 * var(--card-opacity))",
          }}
        />
      ) : null}

      <div ref={shellRef} className="group relative z-[1]">
        <section
          ref={cardRef}
          className="relative grid overflow-hidden"
          style={{
            width: "100%",
            aspectRatio: "0.718",
            borderRadius: cardRadius,
            backgroundBlendMode: "color-dodge, normal, normal, normal",
            boxShadow:
              "rgba(0, 0, 0, 0.8) calc((var(--pointer-from-left) * 10px) - 3px) calc((var(--pointer-from-top) * 20px) - 6px) 20px -5px",
            transition: "transform 1s ease",
            transform: "translateZ(0) rotateX(0deg) rotateY(0deg)",
            background: "rgba(0, 0, 0, 0.9)",
            backfaceVisibility: "hidden",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "var(--inner-gradient)",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              borderRadius: cardRadius,
              display: "grid",
              gridArea: "1 / -1",
            }}
          >
            <div style={shineStyle} />
            <div style={glareStyle} />

            <div
              className="overflow-visible"
              style={{
                mixBlendMode: "luminosity",
                transform: "translateZ(2px)",
                zIndex: 2,
                gridArea: "1 / -1",
                borderRadius: cardRadius,
                pointerEvents: "none",
                backfaceVisibility: "hidden",
              }}
            >
              <img
                className="absolute bottom-[-1px] left-1/2 will-change-transform transition-transform duration-[120ms] ease-out"
                src={avatarUrl}
                alt={`${name} avatar`}
                loading="lazy"
                style={{
                  width: "120%",
                  height: "95%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  transformOrigin: "50% 100%",
                  transform:
                    "translateX(calc(-50% + (var(--pointer-from-left) - 0.5) * 6px)) translateZ(0) scaleY(calc(1 + (var(--pointer-from-top) - 0.5) * 0.02)) scaleX(calc(1 + (var(--pointer-from-left) - 0.5) * 0.01))",
                  borderRadius: cardRadius,
                  backfaceVisibility: "hidden",
                }}
                onError={(event) => {
                  const target = event.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />

              {showUserInfo ? (
                <div
                  className="absolute z-[2] flex items-center justify-between border border-white/10 backdrop-blur-[30px]"
                  style={
                    {
                      "--ui-inset": "20px",
                      "--ui-radius-bias": "6px",
                      bottom: "var(--ui-inset)",
                      left: "var(--ui-inset)",
                      right: "var(--ui-inset)",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius:
                        "calc(max(0px, var(--card-radius) - var(--ui-inset) + var(--ui-radius-bias)))",
                      padding: "12px 14px",
                    } as CSSProperties
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="shrink-0 overflow-hidden rounded-full border border-white/10"
                      style={{ width: "48px", height: "48px" }}
                    >
                      <img
                        className="block h-full w-full rounded-full object-cover"
                        src={miniAvatarUrl || avatarUrl}
                        alt={`${name} mini avatar`}
                        loading="lazy"
                        style={{ pointerEvents: "auto" }}
                        onError={(event) => {
                          const target = event.target as HTMLImageElement;
                          target.style.opacity = "0.5";
                          target.src = avatarUrl;
                        }}
                      />
                    </div>

                    <div className="flex flex-col items-start gap-1.5">
                      <div className="text-sm leading-none font-medium text-white/90">
                        @{handle}
                      </div>
                      <div className="text-sm leading-none text-white/70">
                        {status}
                      </div>
                    </div>
                  </div>

                  <button
                    className="cursor-pointer rounded-lg border border-white/10 px-4 py-3 text-xs font-semibold text-white/90 backdrop-blur-[10px] transition-all duration-200 ease-out hover:-translate-y-px hover:border-white/40"
                    onClick={handleContactClick}
                    style={{ pointerEvents: "auto" }}
                    type="button"
                    aria-label={`Contact ${name}`}
                  >
                    {contactText}
                  </button>
                </div>
              ) : null}
            </div>

            <div
              className="relative z-[3] max-h-full overflow-visible text-center"
              style={{
                transform:
                  "translate3d(calc(var(--pointer-from-left) * -6px + 3px), calc(var(--pointer-from-top) * -6px + 3px), 0.1px)",
                mixBlendMode: "luminosity",
                gridArea: "1 / -1",
                borderRadius: cardRadius,
                pointerEvents: "none",
              }}
            >
              <div className="absolute top-[1.2em] flex w-full flex-col px-6 sm:px-7">
                <h3
                  className="m-0 font-semibold"
                  style={{
                    fontSize: "min(5svh, 3em)",
                    lineHeight: 1.06,
                    paddingBottom: "0.14em",
                    marginBottom: "-0.14em",
                    backgroundImage: "linear-gradient(to bottom, #fff, #6f6fbe)",
                    backgroundSize: "1em 1.5em",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    display: "block",
                    pointerEvents: "auto",
                  }}
                >
                  {name}
                </h3>

                {titleLines.length > 0 ? (
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {titleLines.map((line) => (
                      <span
                        key={line}
                        className="rounded-full border border-white/12 bg-black/18 px-3 py-1.5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-white/88 backdrop-blur-[8px] sm:text-[0.72rem]"
                        style={{ pointerEvents: "auto" }}
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                ) : title ? (
                  <p
                    className="mt-3 font-semibold"
                    style={{
                      fontSize: "16px",
                      marginInline: "auto",
                      maxWidth: "85%",
                      lineHeight: 1.35,
                      backgroundImage: "linear-gradient(to bottom, #fff, #4a4ac0)",
                      backgroundSize: "1em 1.5em",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      display: "block",
                      pointerEvents: "auto",
                    }}
                  >
                    {title}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

const ProfileCard = memo(ProfileCardComponent);

export default ProfileCard;
