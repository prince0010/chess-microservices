import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface UseLottieProps {
  path: string;
  loop?: boolean;
  autoplay?: boolean;
  renderer?: 'svg' | 'canvas' | 'html';
}

export const useLottie = ({ 
  path, 
  loop = true, 
  autoplay = true, 
  renderer = 'svg' 
}: UseLottieProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer,
      loop,
      autoplay,
      path,
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [path, loop, autoplay, renderer]);

  return containerRef;
};