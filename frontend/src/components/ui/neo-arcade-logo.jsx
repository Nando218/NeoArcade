
import React from 'react';
import { cn } from '@/lib/utils';

export function NeoArcadelogo({ 
  size = 'md', 
  className,
  glowing = true,
  animating = true
}) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-16',
    lg: 'h-16',
    xl: 'h-40'
  };

  return (
    <div className={cn(
      'inline-flex',
      glowing && 'filter drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]',
      animating && 'hover:scale-105 transition-transform duration-300',
      className
    )}>
      <img 
        src="https://res.cloudinary.com/dgzgzx9ov/image/upload/v1744820522/RAlogo_noxr13.png" 
        alt="NeoArcade Logo" 
        className={cn(sizeClasses[size])}
      />
    </div>
  );
}
