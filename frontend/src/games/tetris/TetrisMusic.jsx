import React, { useEffect, useRef } from "react";

// Componente para reproducir la música de fondo de Tetris
export default function TetrisMusic({ play, muted }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  useEffect(() => {
    if (play && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [play]);

  return (
    <audio
      ref={audioRef}
      src="https://res.cloudinary.com/dgzgzx9ov/video/upload/v1749715112/Tetris_Rewind_Arcade_bisaat.mp3"
      autoPlay
    />
  );
}
