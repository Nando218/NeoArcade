
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

// Define variant colors
const variantColors = {
  blue: 'bg-arcade-neon-blue hover:bg-opacity-80 text-arcade-dark border-arcade-neon-blue',
  pink: 'bg-arcade-neon-pink hover:bg-opacity-80 text-arcade-dark border-arcade-neon-pink',
  green: 'bg-arcade-neon-green hover:bg-opacity-80 text-arcade-dark border-arcade-neon-green',
  yellow: 'bg-arcade-neon-yellow hover:bg-opacity-80 text-arcade-dark border-arcade-neon-yellow',
  orange: 'bg-arcade-neon-orange hover:bg-opacity-80 text-arcade-dark border-arcade-neon-orange',
  purple: 'bg-arcade-neon-purple hover:bg-opacity-80 text-arcade-dark border-arcade-neon-purple',
  ghost: 'bg-transparent hover:bg-arcade-neon-blue/10 text-arcade-neon-blue border-arcade-neon-blue',
};

export const ArcadeButton = React.forwardRef(
  ({ className, variant = 'blue', glowing = true, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'font-arcade text-sm tracking-wider border-2 transition-all duration-200 transform active:scale-95',
          variantColors[variant],
          glowing && 'shadow-[0_0_10px_rgba(0,255,255,0.7)]',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ArcadeButton.displayName = 'ArcadeButton';
