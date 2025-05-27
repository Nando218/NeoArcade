import React, { useRef, useEffect, useState } from "react";
import { useScores } from "@/lib/scores";
import { useAuth } from "@/lib/auth";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { Audio } from "../audio";

// Parámetros originales del repositorio react-pong
const WIDTH = 600;
const HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;
const BALL_SIZE = 10;
const PLAYER_SPEED = 14;
const AI_SPEED = 4; // IA más lenta para menor dificultad
const BALL_SPEED = 6;
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
    // Pelota
    ctx.fillStyle = "#fff";
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
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
        // Rebote arriba/abajo
        if (y <= 0 || y + BALL_SIZE >= HEIGHT) {
          dy = -dy;
          audio.current?.playMove();
        }
        // Rebote jugador
        if (x <= 20 && y + BALL_SIZE > playerY && y < playerY + PADDLE_HEIGHT) {
          dx = -dx;
          audio.current?.playMove();
        }
        // Rebote IA
        if (
          x + BALL_SIZE >= WIDTH - 20 &&
          y + BALL_SIZE > aiY &&
          y < aiY + PADDLE_HEIGHT
        ) {
          dx = -dx;
          audio.current?.playMove();
        }
        // Punto para IA
        if (x < 0) {
          setAiScore((s) => s + 1);
          audio.current?.playGameOver();
          resetAfterGoal(-BALL_SPEED);
          return prev; // No mover la pelota hasta terminar la cuenta atrás
        }
        // Punto para jugador
        if (x > WIDTH) {
          setPlayerScore((s) => s + 1);
          audio.current?.playLineClear();
          resetAfterGoal(BALL_SPEED);
          return prev; // No mover la pelota hasta terminar la cuenta atrás
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
        setBall((b) => ({ ...b, dx: newDx, dy: BALL_SPEED }));
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
    if (playerScore >= WIN_SCORE) audio.current?.playStart();
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
      {/* Imagen de resultado (win/lose) */}
      {gameOver && (
        <>
          <div className="z-20 mb-2 flex flex-col items-center">
            {playerScore >= WIN_SCORE ? (
              <img
                src="https://res.cloudinary.com/dgzgzx9ov/image/upload/v1746613949/2025-05-07-You-Win-_h3rqsh.gif"
                alt="You Win"
                className="mx-auto w-[320px] h-[200px] object-contain"
              />
            ) : (
              <img
                src="https://res.cloudinary.com/dgzgzx9ov/image/upload/v1746613958/2025-05-07-You-Lose-_d5ktwc.gif"
                alt="You Lose"
                className="mx-auto w-[320px] h-[200px] object-contain"
              />
            )}
          </div>
          <div className="absolute left-0 top-0 w-full h-full flex items-center justify-center z-30 pointer-events-none">
            <ArcadeButton
              onClick={startGame}
              className="w-40 pointer-events-auto"
              variant="green"
            >
              Play Again
            </ArcadeButton>
          </div>
        </>
      )}
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
      <div className="flex justify-between w-full max-w-[200px] px-4 mt-4">
        <ArcadeButton
          onClick={startGame}
          disabled={isRunning}
          className="w-full"
          variant="green"
        >
          {gameOver ? "Reset game" : isRunning ? "Playing" : "Start"}
        </ArcadeButton>
      </div>
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
