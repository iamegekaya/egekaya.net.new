"use client";

import type { Route } from "next";
import Link from "next/link";
import { gsap } from "gsap";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { flushSync } from "react-dom";

import {
  SITE_ACCENT_COLOR,
  SITE_LIGHT_ACCENT_COLOR,
  SITE_MENU_COLORS,
} from "@/lib/site-palette";

export interface StaggeredMenuItem {
  label: string;
  link: Route | `https://${string}` | `http://${string}`;
  ariaLabel?: string;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuProps {
  brand?: string;
  brandHref?: Route;
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  isFixed?: boolean;
}

type MenuStyle = CSSProperties & {
  "--sm-accent"?: string;
};

export default function StaggeredMenu({
  brand = "Ege Kaya",
  brandHref = "/" as Route,
  position = "right",
  colors = SITE_MENU_COLORS,
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  menuButtonColor = SITE_LIGHT_ACCENT_COLOR,
  openMenuButtonColor = SITE_LIGHT_ACCENT_COLOR,
  accentColor = SITE_ACCENT_COLOR,
  changeMenuColorOnOpen = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  isFixed = false,
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [textLines, setTextLines] = useState<string[]>(["Menu", "Close"]);
  const openRef = useRef(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);
  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const openTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);
  const busyRef = useRef(false);

  const setMenuSurfaceVisibility = useCallback((visible: boolean) => {
    setPanelVisible(visible);
  }, []);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;
      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) {
        return;
      }

      const preLayers = preContainer
        ? (Array.from(preContainer.querySelectorAll(".sm-prelayer")) as HTMLElement[])
        : [];

      preLayerElsRef.current = preLayers;

      const offscreen = position === "left" ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });
      setMenuSurfaceVisibility(false);
      gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
      gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    });

    return () => context.revert();
  }, [menuButtonColor, position, setMenuSurfaceVisibility]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;

    if (!panel) {
      return null;
    }

    openTimelineRef.current?.kill();

    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemLabels = Array.from(panel.querySelectorAll(".sm-panel-itemLabel")) as HTMLElement[];
    const numberedItems = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"),
    ) as HTMLElement[];
    const socialTitle = panel.querySelector(".sm-socials-title") as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link")) as HTMLElement[];
    const layerStates = layers.map((element) => ({
      element,
      start: Number(gsap.getProperty(element, "xPercent")),
    }));
    const panelStart = Number(gsap.getProperty(panel, "xPercent"));

    if (itemLabels.length) {
      gsap.set(itemLabels, { yPercent: 140, rotate: 10 });
    }

    if (numberedItems.length) {
      gsap.set(numberedItems, { "--sm-num-opacity": 0 });
    }

    if (socialTitle) {
      gsap.set(socialTitle, { opacity: 0 });
    }

    if (socialLinks.length) {
      gsap.set(socialLinks, { y: 25, opacity: 0 });
    }

    const timeline = gsap.timeline({ paused: true });

    layerStates.forEach((layerState, index) => {
      timeline.fromTo(
        layerState.element,
        { xPercent: layerState.start },
        { xPercent: 0, duration: 0.5, ease: "power4.out" },
        index * 0.07,
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    timeline.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime,
    );

    if (itemLabels.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;

      timeline.to(
        itemLabels,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" },
        },
        itemsStart,
      );

      if (numberedItems.length) {
        timeline.to(
          numberedItems,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" },
          },
          itemsStart + 0.1,
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle) {
        timeline.to(
          socialTitle,
          {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          socialsStart,
        );
      }

      if (socialLinks.length) {
        timeline.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: "opacity" });
            },
          },
          socialsStart + 0.04,
        );
      }
    }

    openTimelineRef.current = timeline;

    return timeline;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) {
      return;
    }

    busyRef.current = true;
    flushSync(() => {
      setMenuSurfaceVisibility(true);
    });
    const timeline = buildOpenTimeline();

    if (!timeline) {
      busyRef.current = false;
      setMenuSurfaceVisibility(false);
      return;
    }

    timeline.eventCallback("onComplete", () => {
      busyRef.current = false;
    });
    timeline.play(0);
  }, [buildOpenTimeline, setMenuSurfaceVisibility]);

  const playClose = useCallback(() => {
    openTimelineRef.current?.kill();
    openTimelineRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;

    if (!panel) {
      return;
    }

    closeTweenRef.current?.kill();

    const offscreen = position === "left" ? -100 : 100;
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemLabels = Array.from(panel.querySelectorAll(".sm-panel-itemLabel")) as HTMLElement[];
        const numberedItems = Array.from(
          panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"),
        ) as HTMLElement[];
        const socialTitle = panel.querySelector(".sm-socials-title") as HTMLElement | null;
        const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link")) as HTMLElement[];

        if (itemLabels.length) {
          gsap.set(itemLabels, { yPercent: 140, rotate: 10 });
        }

        if (numberedItems.length) {
          gsap.set(numberedItems, { "--sm-num-opacity": 0 });
        }

        if (socialTitle) {
          gsap.set(socialTitle, { opacity: 0 });
        }

        if (socialLinks.length) {
          gsap.set(socialLinks, { y: 25, opacity: 0 });
        }

        setMenuSurfaceVisibility(false);
        busyRef.current = false;
      },
    });
  }, [position, setMenuSurfaceVisibility]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;

    if (!icon) {
      return;
    }

    spinTweenRef.current?.kill();
    spinTweenRef.current = gsap.to(icon, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? "power4.out" : "power3.inOut",
      overwrite: "auto",
    });
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const button = toggleBtnRef.current;

      if (!button) {
        return;
      }

      colorTweenRef.current?.kill();

      if (changeMenuColorOnOpen) {
        colorTweenRef.current = gsap.to(button, {
          color: opening ? openMenuButtonColor : menuButtonColor,
          delay: 0.18,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.set(button, { color: menuButtonColor });
      }
    },
    [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor],
  );

  useEffect(() => {
    if (!toggleBtnRef.current) {
      return;
    }

    if (changeMenuColorOnOpen) {
      gsap.set(toggleBtnRef.current, {
        color: openRef.current ? openMenuButtonColor : menuButtonColor,
      });
      return;
    }

    gsap.set(toggleBtnRef.current, { color: menuButtonColor });
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;

    if (!inner) {
      return;
    }

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const sequence = [currentLabel];
    let lastLabel = currentLabel;

    for (let index = 0; index < 3; index += 1) {
      lastLabel = lastLabel === "Menu" ? "Close" : "Menu";
      sequence.push(lastLabel);
    }

    if (lastLabel !== targetLabel) {
      sequence.push(targetLabel);
    }

    sequence.push(targetLabel);
    setTextLines(sequence);

    gsap.set(inner, { yPercent: 0 });

    const lineCount = sequence.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out",
    });
  }, []);

  const closeMenu = useCallback(() => {
    if (!openRef.current) {
      return;
    }

    openRef.current = false;
    setOpen(false);
    onMenuClose?.();
    playClose();
    animateIcon(false);
    animateColor(false);
    animateText(false);
  }, [animateColor, animateIcon, animateText, onMenuClose, playClose]);

  const toggleMenu = useCallback(() => {
    const targetState = !openRef.current;
    openRef.current = targetState;
    setOpen(targetState);

    if (targetState) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(targetState);
    animateColor(targetState);
    animateText(targetState);
  }, [animateColor, animateIcon, animateText, onMenuClose, onMenuOpen, playClose, playOpen]);

  useEffect(() => {
    if (!closeOnClickAway || !open) {
      return;
    }

    function handleClickOutside(event: PointerEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [closeMenu, closeOnClickAway, open]);

  const layerColors = (() => {
    const palette = colors.length ? colors.slice(0, 4) : ["#111111", "#6d63ff"];
    const nextPalette = [...palette];

    if (nextPalette.length >= 3) {
      nextPalette.splice(Math.floor(nextPalette.length / 2), 1);
    }

    return nextPalette;
  })();

  const wrapperClassName = `${className ? `${className} ` : ""}staggered-menu-wrapper${
    isFixed ? " fixed-wrapper" : ""
  }`;

  const wrapperStyle: MenuStyle | undefined = accentColor
    ? { "--sm-accent": accentColor }
    : undefined;

  const hiddenSurfaceStyle: CSSProperties | undefined = panelVisible
    ? undefined
    : { visibility: "hidden", pointerEvents: "none" };

  return (
    <div
      className={wrapperClassName}
      style={wrapperStyle}
      data-position={position}
      data-open={open || undefined}
    >
      <div
        ref={preLayersRef}
        className="sm-prelayers"
        aria-hidden="true"
        style={hiddenSurfaceStyle}
      >
        {layerColors.map((color, index) => (
          <div key={`${color}-${index}`} className="sm-prelayer" style={{ background: color }} />
        ))}
      </div>

      <header className="staggered-menu-header" aria-label="Main navigation header">
        <Link className="sm-brand" href={brandHref} aria-label={`${brand} home`}>
          <span className="sm-brand-copy">{brand}</span>
        </Link>

        <button
          ref={toggleBtnRef}
          className="sm-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span className="sm-toggle-textWrap" aria-hidden="true">
            <span ref={textInnerRef} className="sm-toggle-textInner">
              {textLines.map((line, index) => (
                <span className="sm-toggle-line" key={`${line}-${index}`}>
                  {line}
                </span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span ref={plusHRef} className="sm-icon-line" />
            <span ref={plusVRef} className="sm-icon-line sm-icon-line-v" />
          </span>
        </button>
      </header>

      <aside
        id="staggered-menu-panel"
        ref={panelRef}
        className="staggered-menu-panel"
        aria-hidden={!open}
        style={hiddenSurfaceStyle}
      >
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list" data-numbering={displayItemNumbering || undefined}>
            {items.length ? (
              items.map((item, index) => (
                <li className="sm-panel-itemWrap" key={`${item.label}-${index}`}>
                  {item.link.startsWith("http://") || item.link.startsWith("https://") ? (
                    <a
                      className="sm-panel-item"
                      href={item.link}
                      aria-label={item.ariaLabel ?? item.label}
                      onClick={closeMenu}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="sm-panel-itemLabel">{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      className="sm-panel-item"
                      href={item.link}
                      aria-label={item.ariaLabel ?? item.label}
                      onClick={closeMenu}
                    >
                      <span className="sm-panel-itemLabel">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))
            ) : (
              <li className="sm-panel-itemWrap" aria-hidden="true">
                <span className="sm-panel-item">
                  <span className="sm-panel-itemLabel">No items</span>
                </span>
              </li>
            )}
          </ul>

          {displaySocials && socialItems.length > 0 ? (
            <div className="sm-socials" aria-label="Social links">
              <h2 className="sm-socials-title">Socials</h2>
              <ul className="sm-socials-list" role="list">
                {socialItems.map((item, index) => (
                  <li key={`${item.label}-${index}`} className="sm-socials-item">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sm-socials-link"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
