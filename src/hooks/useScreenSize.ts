import { useEffect, useState } from "react";

interface ScreenSizeBreakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

const useScreenSize = (): string => {
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  const [breakpoints] = useState<ScreenSizeBreakpoints>({
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const getScreenSize = (): string => {
    if (windowWidth === undefined) {
      return "xl"; // Return a default screen size if windowWidth is undefined
    } else if (windowWidth < breakpoints.sm) {
      return "sm";
    } else if (windowWidth < breakpoints.md) {
      return "md";
    } else if (windowWidth < breakpoints.lg) {
      return "lg";
    } else {
      return "xl";
    }
  };

  return getScreenSize();
};

export default useScreenSize;
