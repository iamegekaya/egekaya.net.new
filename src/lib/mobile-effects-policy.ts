const COARSE_POINTER_QUERY = "(pointer: coarse)";
const NARROW_VIEWPORT_QUERY = "(max-width: 820px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export type MobileEffectsQueries = {
  coarsePointerQuery: MediaQueryList;
  narrowViewportQuery: MediaQueryList;
  reducedMotionQuery: MediaQueryList;
};

export function createMobileEffectsQueries(): MobileEffectsQueries {
  return {
    coarsePointerQuery: window.matchMedia(COARSE_POINTER_QUERY),
    narrowViewportQuery: window.matchMedia(NARROW_VIEWPORT_QUERY),
    reducedMotionQuery: window.matchMedia(REDUCED_MOTION_QUERY),
  };
}

export function getMobileEffectsPolicyState({
  coarsePointerQuery,
  narrowViewportQuery,
  reducedMotionQuery,
}: MobileEffectsQueries) {
  const isTouchOptimizedMode = coarsePointerQuery.matches || narrowViewportQuery.matches;
  const prefersReducedMotion = reducedMotionQuery.matches;

  return {
    isTouchOptimizedMode,
    prefersReducedMotion,
    shouldReduceEffects: isTouchOptimizedMode || prefersReducedMotion,
  };
}

export function subscribeToMobileEffectsPolicy(
  queries: MobileEffectsQueries,
  onChange: () => void,
) {
  const { coarsePointerQuery, narrowViewportQuery, reducedMotionQuery } = queries;

  if (typeof coarsePointerQuery.addEventListener === "function") {
    coarsePointerQuery.addEventListener("change", onChange);
    narrowViewportQuery.addEventListener("change", onChange);
    reducedMotionQuery.addEventListener("change", onChange);

    return () => {
      coarsePointerQuery.removeEventListener("change", onChange);
      narrowViewportQuery.removeEventListener("change", onChange);
      reducedMotionQuery.removeEventListener("change", onChange);
    };
  }

  coarsePointerQuery.addListener(onChange);
  narrowViewportQuery.addListener(onChange);
  reducedMotionQuery.addListener(onChange);

  return () => {
    coarsePointerQuery.removeListener(onChange);
    narrowViewportQuery.removeListener(onChange);
    reducedMotionQuery.removeListener(onChange);
  };
}
