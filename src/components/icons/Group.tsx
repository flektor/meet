import React, { type FunctionComponent, MouseEventHandler } from "react";
import Svg from "../Svg";

type GroupProps = {
  className?: string;
  viewBox?: string;
  active?: boolean;
  newMessage?: boolean;
  onClick: MouseEventHandler<SVGSVGElement>;
};

const Group: FunctionComponent<GroupProps> = (
  {
    className = "fill-white",
    viewBox = "0 0 24 24",
    onClick,
    active,
  },
) => {
  return (
    <Svg
      className={`hover:cursor-pointer transition duration-500 group hover:fill-primary ${className}`}
      viewBox={viewBox}
      onClick={onClick}
    >
      <path d="M13,13 C15.2091,13 17,14.7909 17,17 L17,18.5 C17,19.3284 16.3284,20 15.5,20 L3.5,20 C2.67157,20 2,19.3284 2,18.5 L2,17 C2,14.7909 3.79086,13 6,13 L13,13 Z M19,13.0002 C20.6569,13.0002 22,14.3434 22,16.0002 L22,17.5002 C22,18.3287 21.3284,19.0002 20.5,19.0002 L19,19.0002 L19,17 C19,15.3645 18.2148,13.9125 17.0008,13.0002 L19,13.0002 Z M9.5,3 C11.9853,3 14,5.01472 14,7.5 C14,9.98528 11.9853,12 9.5,12 C7.01472,12 5,9.98528 5,7.5 C5,5.01472 7.01472,3 9.5,3 Z M18,6 C19.6569,6 21,7.34315 21,9 C21,10.6569 19.6569,12 18,12 C16.3431,12 15,10.6569 15,9 C15,7.34315 16.3431,6 18,6 Z" />
    </Svg>
  );
};

export default Group;
