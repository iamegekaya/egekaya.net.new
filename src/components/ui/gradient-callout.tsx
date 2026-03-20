import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import joinClassNames from "@/components/ui/join-class-names";

type GradientCalloutProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className" | "style">;

const GRADIENT_CALLOUT_CLASS_NAME =
  "rounded-[32px] border border-[var(--callout-border-accent)] bg-[var(--surface-callout-bg)] shadow-[var(--surface-shadow-callout)] backdrop-blur-[16px]";

const GRADIENT_CALLOUT_STYLE = {
  backgroundImage:
    "linear-gradient(145deg, var(--callout-gradient-start), var(--callout-gradient-end))",
};

export default function GradientCallout<T extends ElementType = "div">({
  as,
  children,
  className,
  ...rest
}: GradientCalloutProps<T>) {
  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag
      className={joinClassNames(GRADIENT_CALLOUT_CLASS_NAME, className)}
      style={GRADIENT_CALLOUT_STYLE}
      {...rest}
    >
      {children}
    </Tag>
  );
}
