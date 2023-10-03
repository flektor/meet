import React, { ReactNode } from "react";
import Link from "next/link";

export function MenuOption(
  { children, className = "", href = "", onClick }: {
    children?: ReactNode;
    className?: string;
    href?: string;
    onClick?: () => void;
  },
) {
  return (
    <Link
      href={href}
      className={`p-2 hover:bg-white/10 rounded pl-4 pr-4 ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

export default MenuOption;
