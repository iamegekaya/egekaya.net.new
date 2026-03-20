"use client";

import { gsap } from "gsap";
import { useCallback, useRef } from "react";

import useGsapIntersectionReveal from "@/components/about/use-gsap-intersection-reveal";

type StaggerListProps = {
  items: string[];
  className?: string;
  itemClassName?: string;
};

export default function StaggerList({
  items,
  className = "",
  itemClassName = "",
}: StaggerListProps) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<HTMLLIElement[]>([]);

  const setInitialState = useCallback((targets: HTMLLIElement[]) => {
    gsap.set(targets, { opacity: 0, y: 24, scale: 0.98 });
  }, []);

  const animateIn = useCallback((targets: HTMLLIElement[]) => {
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.08,
    });
  }, []);

  useGsapIntersectionReveal({
    scopeRef: listRef,
    targetsRef: itemRefs,
    threshold: 0.2,
    setInitialState,
    animateIn,
    resetKey: items.join("\u0000"),
  });

  return (
    <ul ref={listRef} className={className}>
      {items.map((item, index) => (
        <li
          key={item}
          ref={(node) => {
            if (node) {
              itemRefs.current[index] = node;
            } else {
              itemRefs.current.splice(index, 1);
            }
          }}
          className={itemClassName}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
