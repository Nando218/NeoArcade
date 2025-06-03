import React from "react";


export default function GameOverGlitchText({ text = "GAME OVER", className = "" }) {
  return (
    <span
      className={`relative inline-block font-pixel text-6xl md:text-8xl text-red select-none glitch-text animate-fall drop-shadow-2xl ${className}`}
      aria-label={text}
    >
      <span aria-hidden="true" className="absolute left-0 top-0 w-full h-full text-pink-500 opacity-70 glitch-text-before">
        {text}
      </span>
      <span aria-hidden="true" className="absolute left-0 top-0 w-full h-full text-cyan-400 opacity-70 glitch-text-after">
        {text}
      </span>
      <span className="relative z-10">{text}</span>
      <style jsx>{`
        .glitch-text {
          filter: drop-shadow(0 0 6px #00fff7);
        }
        .animate-fall {
          animation: fallFromTop 0.9s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fallFromTop {
          0% {
            opacity: 0;
            transform: translateY(-120px) scaleY(1.2) skewY(-8deg);
          }
          60% {
            opacity: 1;
            transform: translateY(12px) scaleY(0.95) skewY(2deg);
          }
          80% {
            transform: translateY(-4px) scaleY(1.05) skewY(-1deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scaleY(1) skewY(0deg);
          }
        }
        .glitch-text-before {
          animation: glitchTop 1.2s infinite linear alternate-reverse;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        }
        .glitch-text-after {
          animation: glitchBottom 1.2s infinite linear alternate-reverse;
          clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
        }
        @keyframes glitchTop {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-2px, -2px); }
          40% { transform: translate(-4px, 2px); }
          60% { transform: translate(2px, -1px); }
          80% { transform: translate(-1px, 2px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes glitchBottom {
          0% { transform: translate(0, 0); }
          20% { transform: translate(2px, 2px); }
          40% { transform: translate(4px, -2px); }
          60% { transform: translate(-2px, 1px); }
          80% { transform: translate(1px, -2px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </span>
  );
}
