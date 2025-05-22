
import { cn } from '@/lib/utils';

const colorStyles = {
  blue: 'text-arcade-neon-blue',
  pink: 'text-arcade-neon-pink',
  green: 'text-arcade-neon-green',
  yellow: 'text-arcade-neon-yellow',
  orange: 'text-arcade-neon-orange',
  purple: 'text-arcade-neon-purple',
};

const glowStyles = {
  blue: 'shadow-[0_0_10px_#00ffff] text-shadow-[0_0_5px_#fff,0_0_10px_#fff,0_0_15px_#00ffff,0_0_20px_#00ffff]',
  pink: 'shadow-[0_0_10px_#ff00ff] text-shadow-[0_0_5px_#fff,0_0_10px_#fff,0_0_15px_#ff00ff,0_0_20px_#ff00ff]',
  green: 'shadow-[0_0_10px_#39ff14] text-shadow-[0_0_5px_#fff,0_0_10px_#fff,0_0_15px_#39ff14,0_0_20px_#39ff14]',
  yellow: 'shadow-[0_0_10px_#ffff00] text-shadow-[0_0_5px_#fff,0_0_10px_#fff,0_0_15px_#ffff00,0_0_20px_#ffff00]',
  orange: 'shadow-[0_0_10px_#ff9100] text-shadow-[0_0_5px_#fff,0_0_10px_#fff,0_0_15px_#ff9100,0_0_20px_#ff9100]',
  purple: 'shadow-[0_0_10px_#9d00ff] text-shadow-[0_0_5px_#fff,0_0_10px_#fff,0_0_15px_#9d00ff,0_0_20px_#9d00ff]',
};

export function NeonText({
  children,
  color = 'blue',
  className,
  glitch = false,
}) {
  return (
    <span
      className={cn(
        'font-arcade',
        colorStyles[color],
        glowStyles[color],
        glitch && 'animate-glitch',
        className
      )}
    >
      {children}
    </span>
  );
}
