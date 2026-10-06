import type { ElementType, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type TextVariant =
  "body" | "bodyStrong" | "caption" | "nav" | "label" | "muted" | "meta";

type HeadingVariant = "display" | "headline" | "title" | "subtitle";

type HeadingLevel = 1 | 2 | 3 | 4;

const textVariantClassName: Record<TextVariant, string> = {
  body: "ui-type-body text-foreground",
  bodyStrong: "ui-type-body-strong text-foreground",
  caption: "ui-type-caption text-muted-foreground",
  nav: "ui-type-nav text-label",
  label: "ui-type-label",
  muted: "ui-type-body text-muted-foreground",
  meta: "ui-type-caption text-label",
};

const headingVariantClassName: Record<HeadingVariant, string> = {
  display: "ui-type-display text-foreground",
  headline: "ui-type-headline text-foreground",
  title: "ui-type-title text-foreground",
  subtitle: "ui-type-subtitle text-foreground",
};

type TextProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  variant?: TextVariant;
  children: ReactNode;
};

export function Text({
  as,
  variant = "body",
  className,
  children,
  ...props
}: TextProps) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(textVariantClassName[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
  variant?: HeadingVariant;
  children: ReactNode;
};

export function Heading({
  level = 2,
  variant = "title",
  className,
  children,
  ...props
}: HeadingProps) {
  const Component = `h${level}` as ElementType;

  return (
    <Component
      className={cn(headingVariantClassName[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

type ShorthandTextProps = Omit<TextProps, "variant">;

export function Caption(props: ShorthandTextProps) {
  return <Text variant="caption" {...props} />;
}

export function MutedText(props: ShorthandTextProps) {
  return <Text variant="muted" {...props} />;
}

export function MetaText(props: ShorthandTextProps) {
  return <Text variant="meta" {...props} />;
}

export function SectionLabel(props: ShorthandTextProps) {
  return <Text variant="nav" {...props} />;
}
