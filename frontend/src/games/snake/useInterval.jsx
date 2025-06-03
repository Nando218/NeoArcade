
import { useEffect, useRef } from 'react';

export function useInterval(callback, delay) {
  const savedCallback = useRef();
  
  // Recordar el último callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  // Configura el intervalo
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
