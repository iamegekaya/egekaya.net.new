"use client";

import type { ComponentProps } from "react";

import GlareHover from "@/components/ui/glare-hover";
import joinClassNames from "@/components/ui/join-class-names";

type GlarePanelVariant = "fact" | "feature";

type GlarePanelProps = Omit<ComponentProps<typeof GlareHover>, "className"> & {
  className?: string;
  variant?: GlarePanelVariant;
};

const VARIANT_CLASS_NAMES: Record<GlarePanelVariant, string> = {
  fact: "border-[var(--surface-border-medium)] bg-[var(--surface-card-bg)] p-5 backdrop-blur-[14px]",
  feature:
    "border-[var(--surface-border-medium)] bg-[var(--surface-card-bg-strong)] p-5 backdrop-blur-[14px] sm:p-6",
};

export default function GlarePanel({
  className,
  variant = "fact",
  ...props
}: GlarePanelProps) {
  return (
    <GlareHover
      {...props}
      className={joinClassNames(VARIANT_CLASS_NAMES[variant], className)}
    />
  );
}
