import React from "react";
import Link from "next/link";

export function NavLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`text-[#cc66ff] text-5xl font-extrabold tracking-tight -mt-3 ml-2 mr-4 ${className}`}
    >
      meet
    </Link>
  );
}

export default NavLogo;
