"use client";

import { gsap } from "gsap";
import { useLayoutEffect, type RefObject } from "react";

type UseGsapIntersectionRevealOptions<T extends Element> = {
  scopeRef: RefObject<Element | null>;
  targetsRef: RefObject<T[]>;
  threshold: number;
  setInitialState: (targets: T[]) => void;
  animateIn: (targets: T[]) => void;
  resetKey?: unknown;
};

export default function useGsapIntersectionReveal<T extends Element>({
  scopeRef,
  targetsRef,
  threshold,
  setInitialState,
  animateIn,
  resetKey,
}: UseGsapIntersectionRevealOptions<T>) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    const targets = targetsRef.current.filter(Boolean) as T[];

    if (!scope || !targets.length) {
      return;
    }

    let observer: IntersectionObserver | null = null;

    const context = gsap.context(() => {
      setInitialState(targets);

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) {
            return;
          }

          observer?.disconnect();
          observer = null;
          animateIn(targets);
        },
        { threshold },
      );

      observer.observe(scope);
    }, scope);

    return () => {
      observer?.disconnect();
      context.revert();
    };
  }, [animateIn, resetKey, scopeRef, setInitialState, targetsRef, threshold]);
}
