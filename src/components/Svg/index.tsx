import React, { type FunctionComponent, type MouseEventHandler } from "react";

const Svg: FunctionComponent<
  {
    children: any;
    className: string;
    viewBox?: string;
    onClick?: MouseEventHandler<SVGSVGElement>;
  }
> = (
  { children, className, onClick, viewBox = "0 0 24 24" },
) => {
  return (
    <svg
      className={`w-8 h-8 transition ${className}`}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      {children}
    </svg>
  );
};

export default Svg;
