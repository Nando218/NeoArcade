import React, { useRef, useEffect, useState } from "react";
import { useScores } from "@/lib/scores";
import { useAuth } from "@/lib/auth";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Audio } from "../audio";
import GameOverGlitchText from "../tetris/GameOverGlitchText";
import PongMusic from "./PongMusic";

// Parámetros del juego
const WIDTH = 600;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;
const BALL_SIZE = 10;
const PLAYER_SPEED = 12;
const AI_SPEED = 6.35; // Velocidad de la IA
const BALL_SPEED = 7;
const WIN_SCORE = 10;

export function PongGame() {
  const canvasRef = useRef(null);
  const [playerY, setPlayerY] = useState(HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [aiY, setAiY] = useState(HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ball, setBall] = useState({
    x: WIDTH / 2,
    y: HEIGHT / 2,
    dx: BALL_SPEED,
    dy: BALL_SPEED,
  });
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [countdownStage, setCountdownStage] = useState(null); // null | 'ready' | 'go'
  const { isAuthenticated } = useAuth();
  const { addScore } = useScores();
  const isMobile = useIsMobile();
  const audio = useRef(null);
  // Estado para dirección de movimiento
  const [moveDirection, setMoveDirection] = useState(null);
  const [musicMuted, setMusicMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Bloquear scroll cuando el juego está activo
  useEffect(() => {
    if (isRunning && !gameOver) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isRunning, gameOver]);

  // Inicializar sonidos
  useEffect(() => {
    audio.current = new Audio();
  }, []);

  // Dibuja el juego
  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // Fondo
    ctx.fillStyle = "#18181b";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    // Red
    ctx.strokeStyle = "#00fff7";
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2, 0);
    ctx.lineTo(WIDTH / 2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
    // Paletas
    ctx.fillStyle = "#00ff7f";
    ctx.fillRect(10, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "#ff00ea";
    ctx.fillRect(WIDTH - 20, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);
    // Pelota (ahora círculo)
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(
      ball.x + BALL_SIZE / 2,
      ball.y + BALL_SIZE / 2,
      BALL_SIZE / 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    // Puntuación
    ctx.font = "32px monospace";
    ctx.fillStyle = "#00fff7";
    ctx.fillText(playerScore, WIDTH / 2 - 50, 40);
    ctx.fillText(aiScore, WIDTH / 2 + 30, 40);
  }, [playerY, aiY, ball, playerScore, aiScore]);

  // Lógica principal del juego
  useEffect(() => {
    if (!isRunning || gameOver) return;
    let animation;
    function gameLoop() {
      // Terminar si alguien llega a WIN_SCORE
      if (playerScore >= WIN_SCORE || aiScore >= WIN_SCORE) {
        setIsRunning(false);
        setGameOver(true);
        return;
      }
      // Si hay cuenta atrás, no mover la pelota ni las paletas
      if (countdownStage) {
        animation = requestAnimationFrame(gameLoop);
        return;
      }
      // Movimiento de la paleta IA
      if (ball.y + BALL_SIZE / 2 > aiY + PADDLE_HEIGHT / 2) {
        setAiY((y) => Math.min(y + AI_SPEED, HEIGHT - PADDLE_HEIGHT));
      } else if (ball.y + BALL_SIZE / 2 < aiY + PADDLE_HEIGHT / 2) {
        setAiY((y) => Math.max(y - AI_SPEED, 0));
      }
      // Movimiento de la paleta del jugador (fluido)
      setPlayerY((prevY) => {
        let targetY = prevY;
        if (moveDirection === "up") {
          targetY = Math.max(prevY - PLAYER_SPEED, 0);
        } else if (moveDirection === "down") {
          targetY = Math.min(prevY + PLAYER_SPEED, HEIGHT - PADDLE_HEIGHT);
        }
        return targetY;
      });
      // Movimiento de la pelota
      setBall((prev) => {
        let { x, y, dx, dy } = prev;
        x += dx;
        y += dy;
        // Punto para IA
        if (x < 0) {
          setAiScore((s) => s + 1);
          audio.current?.playDraw(); // Sonido de empate al encajar gol
          resetAfterGoal(-BALL_SPEED);
          // Devolver pelota quieta en el centro para evitar rebotes
          return { x: WIDTH / 2, y: HEIGHT / 2, dx: 0, dy: 0 };
        }
        // Punto para jugador
        if (x > WIDTH) {
          setPlayerScore((s) => s + 1);
          audio.current?.playLineClear();
          resetAfterGoal(BALL_SPEED);
          // Devolver pelota quieta en el centro para evitar rebotes
          return { x: WIDTH / 2, y: HEIGHT / 2, dx: 0, dy: 0 };
        }
        // Rebote arriba/abajo
        if (y <= 0 || y + BALL_SIZE >= HEIGHT) {
          dy = -dy;
          audio.current?.playMove();
        }
        // Rebote jugador SOLO si la pelota está dentro del campo
        if (x >= 0 && x <= 20 && y + BALL_SIZE > playerY && y < playerY + PADDLE_HEIGHT) {
          dx = -dx;
          audio.current?.playMove();
        }
        // Rebote IA SOLO si la pelota está dentro del campo
        if (
          x + BALL_SIZE <= WIDTH &&
          x + BALL_SIZE >= WIDTH - 20 &&
          y + BALL_SIZE > aiY &&
          y < aiY + PADDLE_HEIGHT
        ) {
          dx = -dx;
          audio.current?.playMove();
        }
        return { x, y, dx, dy };
      });
      animation = requestAnimationFrame(gameLoop);
    }
    animation = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animation);
  }, [
    isRunning,
    gameOver,
    ball.y,
    aiY,
    playerY,
    moveDirection,
    playerScore,
    aiScore,
    countdownStage,
  ]);

  // Función para resetear tras gol y hacer cuenta atrás
  function resetAfterGoal(newDx) {
    // Si el juego ya terminó, no mostrar ready/go
    if (playerScore + 1 >= WIN_SCORE || aiScore + 1 >= WIN_SCORE) {
      setPlayerY(HEIGHT / 2 - PADDLE_HEIGHT / 2);
      setAiY(HEIGHT / 2 - PADDLE_HEIGHT / 2);
      setBall((b) => ({ ...b, x: WIDTH / 2, y: HEIGHT / 2, dx: 0, dy: 0 }));
      return;
    }
    setPlayerY(HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setAiY(HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setCountdownStage("ready");
    setBall((b) => ({ ...b, x: WIDTH / 2, y: HEIGHT / 2, dx: 0, dy: 0 }));
    setTimeout(() => {
      setCountdownStage("go");
      setTimeout(() => {
        setCountdownStage(null);
        // Asegura que dy nunca sea 0 y alterna dirección vertical aleatoriamente
        const dy = Math.random() < 0.5 ? BALL_SPEED : -BALL_SPEED;
        setBall((b) => ({ ...b, dx: newDx, dy }));
      }, 1000);
    }, 1000);
  }

  // Efecto para cuenta atrás
  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Sonido de victoria/derrota
  useEffect(() => {
    if (!gameOver) return;
    if (playerScore >= WIN_SCORE) audio.current?.playWin();
    else if (aiScore >= WIN_SCORE) audio.current?.playGameOver();
  }, [gameOver, playerScore, aiScore]);

  // Sonido al iniciar
  function startGame() {
    setPlayerY(HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setAiY(HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setBall({ x: WIDTH / 2, y: HEIGHT / 2, dx: BALL_SPEED, dy: BALL_SPEED });
    setPlayerScore(0);
    setAiScore(0);
    setGameOver(false);
    setIsRunning(true);
    audio.current?.playStart();
  }

  // Controles teclado (actualizado para movimiento fluido)
  useEffect(() => {
    if (!isRunning || gameOver) return;
    function handleKeyDown(e) {
      if (e.key === "ArrowUp" || e.key === "w") {
        setMoveDirection("up");
        e.preventDefault();
      }
      if (e.key === "ArrowDown" || e.key === "s") {
        setMoveDirection("down");
        e.preventDefault();
      }
    }
    function handleKeyUp(e) {
      if (["ArrowUp", "w", "ArrowDown", "s"].includes(e.key)) {
        setMoveDirection(null);
        e.preventDefault();
      }
    }
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isRunning, gameOver]);

  // Controles táctiles (móviles)
  function handleTouch(e) {
    if (!isRunning || gameOver) return;
    const touchY =
      e.touches[0].clientY - canvasRef.current.getBoundingClientRect().top;
    setPlayerY(
      Math.max(0, Math.min(touchY - PADDLE_HEIGHT / 2, HEIGHT - PADDLE_HEIGHT))
    );
  }

  // Guardar puntuación automáticamente al terminar si está autenticado
  useEffect(() => {
    if (gameOver && isAuthenticated && playerScore > 0) {
      addScore({ gameId: "pong", points: playerScore });
    }
    // eslint-disable-next-line
  }, [gameOver]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <PongMusic play={true} muted={musicMuted} />
      {/* Imagen de resultado (win/lose) */}
      {gameOver && (
        <>
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
            {playerScore >= WIN_SCORE ? (
              <GameOverGlitchText text="YOU WIN!" className="mb-6 text-green-400" />
            ) : (
              <GameOverGlitchText text="YOU LOSE!" className="mb-6 text-red-600" />
            )}
            {/* Botón Play Again eliminado */}
          </div>
        </>
      )}
      <div className="relative w-full flex justify-center items-start mt-4">
        {/* Campo de juego centrado */}
        <div className="z-10 flex flex-col items-center mx-auto">
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="border-2 border-arcade-neon-green rounded-lg bg-black"
            style={{
              touchAction: "none",
              maxWidth: "100%",
              height: isMobile ? 240 : 400,
            }}
            onTouchMove={handleTouch}
            tabIndex={0}
            onFocus={(e) => e.target.focus()}
          />
          <div className="flex justify-between w-full max-w-[300px] px-4 mt-4 gap-2">
            <ArcadeButton
              onClick={startGame}
              disabled={isRunning}
              className="w-full"
              variant="green"
            >
              {gameOver ? "Reset game" : isRunning ? "Playing" : "Start"}
            </ArcadeButton>
            <ArcadeButton
              onClick={() => setMusicMuted((m) => !m)}
              variant="purple"
              className="font-pixel flex gap-2 items-center"
              size="sm"
              aria-label={musicMuted ? "Unmute music" : "Mute music"}
            >
              {musicMuted ? "🔇" : "🔊"}
            </ArcadeButton>
            <ArcadeButton
              onClick={() => setShowControls((v) => !v)}
              variant="purple"
              className="font-pixel flex gap-2 items-center"
              size="sm"
              aria-label="Show controls"
            >
              🎮
            </ArcadeButton>
          </div>
        </div>
        {/* Elimina el cuadro lateral fijo de controles */}
      </div>
      {/* Modal de controles */}
      {showControls && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-arcade-dark border border-arcade-neon-blue/30 rounded-md p-6 min-w-[220px] max-w-[90vw] shadow-2xl relative">
            
            <h3 className="text-arcade-neon-blue font-pixel mb-4 text-center text-lg">
              Controls
            </h3>
            <ul className="text-sm text-gray-300 font-pixel space-y-1 mb-2">
              <li>⬆️ / W : Move up</li>
              <li>⬇️ / S : Move down</li>
                            
              <li>🔊 : Toggle music</li>
            </ul>
            <ArcadeButton
              onClick={() => setShowControls(false)}
              variant="purple"
              className="w-full mt-4"
            >
              Close
            </ArcadeButton>
          </div>
        </div>
      )}
      {/* Cuenta atrás */}
      {countdownStage && (
        <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center z-40 pointer-events-none">
          <span className="text-6xl font-bold text-arcade-neon-green drop-shadow-lg">
            {countdownStage === "ready" ? "Ready?" : "Go!"}
          </span>
        </div>
      )}
    </div>
  );
}
