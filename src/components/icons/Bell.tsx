import React, { type FunctionComponent, MouseEventHandler } from "react";
import Svg from "../Svg";

type BellProps = {
  className?: string;
  viewBox?: string;
  active?: boolean;
  newNotification: boolean;
  innerRef?: React.ForwardedRef<SVGSVGElement | null>;
  onClick: MouseEventHandler<SVGSVGElement>;
};

const Bell: FunctionComponent<BellProps> = (
  {
    className = "fill-white",
    viewBox = "0 0 24 24",
    onClick,
    active,
    newNotification,
    innerRef,
  },
) => {
  return (
    <Svg
      innerRef={innerRef}
      className={`hover:cursor-pointer transition duration-500 group hover:fill-primary ${
        active ? "fill-primary" : "fill-white"
      } ${className}`}
      viewBox={viewBox}
      onClick={onClick}
    >
      {newNotification
        ? (
          <path d="M20,18H4l2-2V10a6,6,0,0,1,5-5.91V3a1,1,0,0,1,2,0V4.09a5.9,5.9,0,0,1,1.3.4A3.992,3.992,0,0,0,18,10v6Zm-8,4a2,2,0,0,0,2-2H10A2,2,0,0,0,12,22ZM18,4a2,2,0,1,0,2,2A2,2,0,0,0,18,4Z" />
        )
        : (
          <path d="M10,20h4a2,2,0,0,1-4,0Zm8-4V10a6,6,0,0,0-5-5.91V3a1,1,0,0,0-2,0V4.09A6,6,0,0,0,6,10v6L4,18H20Z" />
        )}
    </Svg>
  );
};

export default Bell;
