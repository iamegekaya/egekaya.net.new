import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import joinClassNames from "@/components/ui/join-class-names";

type GlassPanelProps<T extends ElementType = "section"> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

const GLASS_PANEL_CLASS_NAME =
  "rounded-[32px] border border-[var(--surface-border-strong)] bg-[var(--surface-panel-bg)] p-6 shadow-[var(--surface-shadow-lg)] backdrop-blur-[16px] sm:p-8";

export default function GlassPanel<T extends ElementType = "section">({
  as,
  children,
  className,
  ...rest
}: GlassPanelProps<T>) {
  const Tag = (as ?? "section") as ElementType;

  return (
    <Tag className={joinClassNames(GLASS_PANEL_CLASS_NAME, className)} {...rest}>
      {children}
    </Tag>
  );
}
