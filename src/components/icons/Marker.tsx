import React, { type FunctionComponent } from "react";
import Svg from "../Svg";

type MarkerProps = {
  className?: string;
  viewBox?: string;
};

const Marker: FunctionComponent<MarkerProps> = (
  { className = "fill-white", viewBox },
) => {
  return (
    <Svg className={className} viewBox={viewBox}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke="default"
      />
      <path
        d="M12 5V3"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M19 12L21 12"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 21L12 19"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 12H5"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default Marker;
