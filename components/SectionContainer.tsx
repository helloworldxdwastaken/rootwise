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
  maxWidthClass = "max-w-7xl",
  ...props
}: SectionContainerProps) {
  return (
    <Component
      id={id}
      className={cn(
        "relative mx-auto flex w-full flex-col gap-6 px-3 py-12 sm:px-5 sm:py-16 md:px-8 md:py-20 self-stretch",
        maxWidthClass,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
