import React, { type FunctionComponent } from "react";

const Svg: FunctionComponent<
  {
    children: any;
    className: string;
    viewBox?: string;
    innerRef?: React.ForwardedRef<SVGSVGElement>;
    onClick?: React.MouseEventHandler<SVGSVGElement>;
  }
> = (
  { innerRef, children, className, onClick, viewBox = "0 0 24 24" },
) => {
  return (
    <svg
      ref={innerRef}
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
