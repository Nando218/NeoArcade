import { useState, useEffect } from "react";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { Audio } from "../audio";
import GameOverGlitchText from "../tetris/GameOverGlitchText";
import TicTacToeMusic from "./TicTacToeMusic";

import { useIsMobile } from "@/hooks/use-mobile";
import { useScores } from "@/lib/scores";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const audio = new Audio();

export function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState("playing"); // Estado inicial cambiado a "playing" en vez de "waiting"
  const [winner, setWinner] = useState(null); // null, 'player', 'ai', 'draw'
  const [difficulty, setDifficulty] = useState("normal"); // fácil, normal, difícil
  const [musicMuted, setMusicMuted] = useState(false);
  const isMobile = useIsMobile();
  const { addScore } = useScores();
  const { isAuthenticated } = useAuth();

  // Inicializar el juego automáticamente al montar el componente
  useEffect(() => {
    startGame();
  }, []);

  // Iniciar el juego
  const startGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus("playing");
    setWinner(null);

    // Selecciona la dificultad aleatoriamente al inicio de cada partida
    const difficulties = ["easy", "normal", "hard"];
    const randomDifficulty =
      difficulties[Math.floor(Math.random() * difficulties.length)];
    setDifficulty(randomDifficulty);
    // audio.playStart(); // Quitar sonido al iniciar
  };

  // Reiniciar el juego
  const resetGame = () => {
    startGame();
  };

  // El jugador hace un movimiento
  const handlePlayerMove = (index) => {
    if (gameStatus !== "playing" || !isPlayerTurn || board[index] !== null)
      return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);

    audio.playRotate(); // Sonido al rellenar casilla

    // Solo reproducir sonido si el movimiento es dentro del juego, no al iniciar desde la card
    if (gameStatus === "playing") {
      audio.playMove();
    }

    // Comprobar si el juego terminó después del movimiento del jugador
    const result = checkGameStatus(newBoard);
    if (result) {
      handleGameOver(result);
    }
  };

  // La IA hace un movimiento
  useEffect(() => {
    if (gameStatus === "playing" && !isPlayerTurn) {
      const timeoutId = setTimeout(() => {
        let bestMove;

        // Ajustar el comportamiento de la IA según la dificultad
        switch (difficulty) {
          case "easy":
            bestMove = findRandomMove(board);
            break;
          case "hard":
            bestMove = findBestMove(board);
            break;
          case "normal":
          default:
            // Para dificultad normal, a veces hace el mejor movimiento, a veces uno aleatorio
            bestMove =
              Math.random() < 0.7 ? findBestMove(board) : findRandomMove(board);
            break;
        }

        if (bestMove !== -1) {
          const newBoard = [...board];
          newBoard[bestMove] = "O";
          setBoard(newBoard);
          setIsPlayerTurn(true);

          // Check if game is over after AI's move
          const result = checkGameStatus(newBoard);
          if (result) {
            handleGameOver(result);
          }
        }
      }, 500); // Añade un pequeño retardo para que el movimiento de la IA se sienta más natural

      return () => clearTimeout(timeoutId);
    }
  }, [board, isPlayerTurn, gameStatus, difficulty]);

  // Manejar el final del juego
  const handleGameOver = (result) => {
    setGameStatus("ended");
    setWinner(result);

    if (result === "player") {
      if (isAuthenticated) {
        addScore({ gameId: "tictactoe", points: 100 })
          .then(() => {
            toast.success("Victory! +100 points");
          })
          .catch(() => {
            toast.error("Error saving score");
          });
      } else {
        toast.success("Victory!");
      }
      audio.playWin(); // Reproducir sonido de victoria
    } else if (result === "ai") {
      toast.error("You lose. Try again.");
      audio.playGameOver(); // Reproducir sonido de derrota
    } else {
      toast.info("Draw!");
      audio.playDraw(); // Reproducir sonido de empate
    }
  };

  // Comprobar si el juego ha terminado
  const checkGameStatus = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Comprobar ganador
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === "X" ? "player" : "ai";
      }
    }

    // Comprobar empate
    if (!board.includes(null)) {
      return "draw";
    }

    return null;
  };

  // Lógica IA: Encuentra un movimiento aleatorio (para dificultad fácil)
  const findRandomMove = (board) => {
    const emptySquares = board
      .map((value, index) => (value === null ? index : null))
      .filter((index) => index !== null);

    if (emptySquares.length === 0) return -1;

    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  // Lógica IA: Encuentra el mejor movimiento (usando algoritmo minimax)
  const findBestMove = (board) => {
    // Si no hay espacios vacíos, retorna -1
    if (!board.includes(null)) return -1;

    // Primero, comprueba si la IA puede ganar en un movimiento
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = "O";
        if (checkGameStatus(newBoard) === "ai") {
          return i;
        }
      }
    }

    // Segundo, comprueba si el jugador puede ganar en un movimiento y bloquéalo
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = "X";
        if (checkGameStatus(newBoard) === "player") {
          return i;
        }
      }
    }

    // Tercero, toma el centro si está libre
    if (board[4] === null) return 4;

    // Cuarto, intenta tomar las esquinas
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter((c) => board[c] === null);
    if (availableCorners.length > 0) {
      return availableCorners[
        Math.floor(Math.random() * availableCorners.length)
      ];
    }

    // Finalmente, toma cualquier borde disponible
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter((e) => board[e] === null);
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    return -1;
  };

  // Renderiza la celda con el símbolo correspondiente
  const renderCell = (index) => {
    const value = board[index];

    return (
      <div
        className={`bg-arcade-dark border-2 ${
          value ? "border-arcade-neon-purple" : "border-arcade-neon-purple/30"
        } flex items-center justify-center cursor-pointer transition-all ${
          value ? "shadow-[0_0_10px_rgba(157,0,255,0.3)]" : ""
        } hover:shadow-[0_0_10px_rgba(157,0,255,0.3)]`}
        style={{
          width: isMobile ? "70px" : "90px",
          height: isMobile ? "70px" : "90px",
        }}
        onClick={() => handlePlayerMove(index)}
      >
        {value === "X" && (
          <span
            className="text-arcade-neon-pink text-shadow-[0_0_5px_#fff,0_0_10px_#fff,0_0_15px_#ff00ff,0_0_20px_#ff00ff] font-arcade"
            style={{ fontSize: isMobile ? "24px" : "36px" }}
          >
            X
          </span>
        )}
        {value === "O" && (
          <span
            className="text-arcade-neon-green text-shadow-[0_0_5px_#fff,0_0_10px_#fff,0_0_15px_#39ff14,0_0_20px_#39ff14] font-arcade"
            style={{ fontSize: isMobile ? "24px" : "36px" }}
          >
            O
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg px-4">
      <TicTacToeMusic play={gameStatus === "playing" || gameStatus === "ended"} muted={musicMuted} />
      <div className="relative w-full flex justify-center items-center min-h-[320px]">
        {/* Game Over/Draw Overlay */}
        {gameStatus === "ended" && winner === "draw" && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
            <GameOverGlitchText text="DRAW!" className="mb-4" />
          </div>
        )}
        {gameStatus === "ended" && winner === "player" && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
            <GameOverGlitchText text="YOU WIN!" className="mb-4 text-green-400" />
          </div>
        )}
        {gameStatus === "ended" && winner === "ai" && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
            <GameOverGlitchText text="YOU LOSE!" className="mb-4 text-red-600" />
          </div>
        )}
        {/* Tablero de juego con botón de mute en la esquina inferior derecha */}
        <div className="grid grid-cols-3 gap-2 mx-auto relative">
          {board.map((_, index) => (
            <div key={index} className="relative">
              {renderCell(index)}
              {/* Botón de mute al lado de la casilla inferior derecha */}
              {index === 8 && (
                <div className="absolute right-[-70px] bottom-0 flex items-center">
                  <ArcadeButton
                    onClick={() => setMusicMuted((m) => !m)}
                    variant="purple"
                    className="font-pixel flex gap-2 items-center"
                    size="sm"
                    aria-label={musicMuted ? "Unmute music" : "Mute music"}
                  >
                    {musicMuted ? "🔇" : "🔊"}
                  </ArcadeButton>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Botón de reinicio centrado cuando el juego ha terminado */}
      {gameStatus === "ended" && (
        <div className="flex justify-center mt-6">
          <ArcadeButton variant="cyan" onClick={startGame} className="mx-auto">
            RESET
          </ArcadeButton>
        </div>
      )}
    </div>
  );
}
