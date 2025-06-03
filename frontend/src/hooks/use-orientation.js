import { useEffect, useState } from "react";

// Hook para detectar orientación del dispositivo
export function useOrientation() {
  const getOrientation = () => {
    if (typeof window === "undefined") return "portrait";
    return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  };

  const [orientation, setOrientation] = useState(getOrientation());

  useEffect(() => {
    const handleResize = () => {
      setOrientation(getOrientation());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return orientation;
}
