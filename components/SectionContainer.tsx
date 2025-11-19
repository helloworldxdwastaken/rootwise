import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type AsElement = "section" | "div" | "footer" | "header";

type SectionContainerProps = HTMLAttributes<HTMLElement> & {
  id?: string;
  as?: AsElement;
  maxWidthClass?: string;
};

export function SectionContainer({
  className,
  id,
  children,
  as: Component = "section",
  maxWidthClass = "max-w-6xl",
  ...props
}: SectionContainerProps) {
  return (
    <Component
      id={id}
      className={cn(
        "relative mx-auto flex w-full flex-col gap-6 px-6 py-16 sm:px-8 sm:py-20 self-stretch",
        maxWidthClass,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
