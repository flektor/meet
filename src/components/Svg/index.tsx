import React, { FunctionComponent } from "react";

const Svg: FunctionComponent<
  { children: any; className: string; viewBox?: string }
> = (
  { children, className, viewBox = "0 0 32 32" },
) => {
  return (
    <svg
      className={`w-10 h-10 transition ${className}`}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};

export default Svg;
