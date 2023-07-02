import React, { type FunctionComponent } from "react";
import Svg from "../Svg";

type LeaveProps = {
  className?: string;
  viewBox?: string;
};

const Enter: FunctionComponent<LeaveProps> = (
  { className = "fill-white", viewBox },
) => {
  return (
    <Svg className={className} viewBox={viewBox}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.37905 2.66859L12.0686 2.08881C15.2892 1.58272 16.8995 1.32967 17.9497 2.22779C19 3.12591 19 4.75596 19 8.01607V10.9996H13.0806L15.7809 7.62428L14.2191 6.37489L10.2191 11.3749L9.71938 11.9996L10.2191 12.6243L14.2191 17.6243L15.7809 16.3749L13.0806 12.9996H19V15.9831C19 19.2432 19 20.8733 17.9497 21.7714C16.8995 22.6695 15.2892 22.4165 12.0686 21.9104L8.37905 21.3306C6.76632 21.0771 5.95995 20.9504 5.47998 20.3891C5 19.8279 5 19.0116 5 17.3791V6.6201C5 4.98758 5 4.17132 5.47998 3.61003C5.95995 3.04874 6.76632 2.92202 8.37905 2.66859Z"
      />
    </Svg>
  );
};

export default Enter;