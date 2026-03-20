"use client";

import {
  useCallback,
  useMemo,
  useRef,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";

import { gsap } from "gsap";

import useGsapIntersectionReveal from "@/components/about/use-gsap-intersection-reveal";

type SplitRevealProps<T extends ElementType> = {
  as?: T;
  text: string;
  className?: string;
  stagger?: number;
  threshold?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export default function SplitReveal<T extends ElementType = "p">({
  as,
  text,
  className,
  stagger = 0.06,
  threshold = 0.35,
  ...rest
}: SplitRevealProps<T>) {
  const containerRef = useRef<HTMLElement | null>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const words = useMemo(() => text.split(" "), [text]);
  const Tag = (as ?? "p") as ElementType;

  const setInitialState = useCallback((targets: HTMLSpanElement[]) => {
    gsap.set(targets, { yPercent: 115, opacity: 0 });
  }, []);

  const animateIn = useCallback(
    (targets: HTMLSpanElement[]) => {
      gsap.to(targets, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger,
      });
    },
    [stagger],
  );

  useGsapIntersectionReveal({
    scopeRef: containerRef,
    targetsRef: wordRefs,
    threshold,
    setInitialState,
    animateIn,
    resetKey: text,
  });

  return (
    <Tag
      ref={containerRef}
      className={className}
      aria-label={text}
      {...rest}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline whitespace-normal">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden align-bottom"
            style={{ paddingBottom: "0.16em", marginBottom: "-0.16em" }}
          >
            <span
              ref={(node) => {
                if (node) {
                  wordRefs.current[index] = node;
                } else {
                  wordRefs.current.splice(index, 1);
                }
              }}
              className="inline-block will-change-transform"
            >
              {word}
              {index < words.length - 1 ? "\u00A0" : ""}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
