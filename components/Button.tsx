"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "unstyled";

type CommonButtonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type ButtonLinkProps = CommonButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonButtonProps | "href"> & {
    href: string;
  };

type ButtonElementProps = CommonButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonButtonProps | "href"> & {
    href?: undefined;
  };

type ButtonProps = ButtonLinkProps | ButtonElementProps;

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-black text-white shadow-lg shadow-black/30 hover:scale-105 hover:shadow-xl hover:shadow-black/40 focus-visible:outline-black active:scale-95",
  secondary:
    "bg-white text-black border border-black/10 hover:scale-105 hover:bg-white/90 focus-visible:outline-black active:scale-95",
  ghost:
    "bg-transparent text-black hover:scale-105 hover:bg-black/5 focus-visible:outline-black active:scale-95",
  unstyled: "",
};

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props as ButtonLinkProps;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonElementProps;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
