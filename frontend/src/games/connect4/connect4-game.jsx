import { useState } from "react";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { useScores } from "@/lib/scores";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import GameOverGlitchText from "../tetris/GameOverGlitchText";
import { Audio } from "../audio";
import Connect4Music from "./Connect4Music";

// Parámetros del tablero
const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const PLAYER = 1;
const AI = 2;

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
}

function checkWinner(board) {
  // Horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      const cell = board[row][col];
      if (
        cell !== EMPTY &&
        cell === board[row][col + 1] &&
        cell === board[row][col + 2] &&
        cell === board[row][col + 3]
      ) {
        return cell;
      }
    }
  }
  // Vertical
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row <= ROWS - 4; row++) {
      const cell = board[row][col];
      if (
        cell !== EMPTY &&
        cell === board[row + 1][col] &&
        cell === board[row + 2][col] &&
        cell === board[row + 3][col]
      ) {
        return cell;
      }
    }
  }
  // Diagonal descendente (\)
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      const cell = board[row][col];
      if (
        cell !== EMPTY &&
        cell === board[row + 1][col + 1] &&
        cell === board[row + 2][col + 2] &&
        cell === board[row + 3][col + 3]
      ) {
        return cell;
      }
    }
  }
  // Diagonal ascendente (/)
  for (let row = 3; row < ROWS; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      const cell = board[row][col];
      if (
        cell !== EMPTY &&
        cell === board[row - 1][col + 1] &&
        cell === board[row - 2][col + 2] &&
        cell === board[row - 3][col + 3]
      ) {
        return cell;
      }
    }
  }
  // Empate
  const isDraw = board.every(row => row.every(cell => cell !== EMPTY));
  if (isDraw) return "draw";
  return null;
}

const audio = new Audio();

export function Connect4Game() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [musicMuted, setMusicMuted] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addScore } = useScores();

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(PLAYER);
    setGameOver(false);
    setWinner(null);
    audio.playStart(); // sonido de inicio
  };

  const handleColumnClick = (col) => {
    if (gameOver || currentPlayer !== PLAYER) return;
    // Buscar la fila más baja disponible
    const row = [...Array(ROWS).keys()].reverse().find(r => board[r][col] === EMPTY);
    if (row === undefined) return;
    const newBoard = board.map(rowArr => [...rowArr]);
    newBoard[row][col] = PLAYER;
    setBoard(newBoard);
    audio.playMove(); // sonido de movimiento
    const result = checkWinner(newBoard);
    if (result) {
      endGame(result);
    } else {
      setCurrentPlayer(AI);
      setTimeout(() => aiMove(newBoard), 500);
    }
  };

  const aiMove = (b) => {
    // Movimiento IA simple: elige columna aleatoria válida
    const validCols = [];
    for (let c = 0; c < COLS; c++) {
      if (b[0][c] === EMPTY) validCols.push(c);
    }
    if (validCols.length === 0) return;
    const col = validCols[Math.floor(Math.random() * validCols.length)];
    const row = [...Array(ROWS).keys()].reverse().find(r => b[r][col] === EMPTY);
    if (row === undefined) return;
    const newBoard = b.map(rowArr => [...rowArr]);
    newBoard[row][col] = AI;
    setBoard(newBoard);
    audio.playMove(); // sonido de movimiento IA
    const result = checkWinner(newBoard);
    if (result) {
      endGame(result);
    } else {
      setCurrentPlayer(PLAYER);
    }
  };

  const endGame = async (result) => {
    setGameOver(true);
    setWinner(result);
    if (result === PLAYER && isAuthenticated) {
      try {
        await addScore({ gameId: "connect4", points: 100 });
        toast.success("Victory! +100 points");
        audio.playLineClear(); // sonido de victoria
      } catch {
        toast.error("Error saving score");
      }
    } else if (result === AI) {
      toast.error("You lost. Try again.");
      audio.playGameOver(); // sonido de derrota
    } else if (result === "draw") {
      toast.info("Draw!");
      audio.playPause(); // sonido de empate
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full px-1">
      <Connect4Music play={true} muted={musicMuted} />
      <div className="relative p-2 sm:p-4 rounded-2xl shadow-2xl border border-green-500 w-full max-w-[540px] min-h-[320px] sm:min-h-[520px] flex items-center justify-center bg-transparent">
        {/* Mensaje de victoria superpuesto */}
        {gameOver && winner === 1 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <GameOverGlitchText text="YOU WIN!" className="text-white text-3xl sm:text-5xl md:text-7xl font-pixel text-center drop-shadow-[0_0_16px_white]" />
          </div>
        )}
        <div className="flex flex-col gap-1 sm:gap-2 z-10 w-full">
          {board.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-7 gap-1 sm:gap-2">
              {row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-8 h-8 sm:w-14 sm:h-14 rounded-full border-2 sm:border-4 flex items-center justify-center cursor-pointer transition-all duration-200
                    ${cell === EMPTY ? 'border-gray-700 bg-gradient-to-b from-[#232946] to-[#393e6c] hover:bg-pink-400/20' : ''}
                    ${cell === PLAYER ? 'bg-[radial-gradient(circle_at_30%_30%,#a21caf_70%,#9333ea_100%)] border-[#a21caf]' : ''}
                    ${cell === AI ? 'bg-[radial-gradient(circle_at_30%_30%,#22c55e_70%,#166534_100%)] border-[#22c55e]' : ''}
                  `}
                  style={{}}
                  onClick={() =>
                    !gameOver &&
                    currentPlayer === PLAYER &&
                    cell === EMPTY &&
                    rIdx === [...Array(ROWS).keys()].reverse().find(r => board[r][cIdx] === EMPTY)
                      ? handleColumnClick(cIdx)
                      : undefined
                  }
                />
              ))}
            </div>
          ))}
        </div>
        {/* Otros mensajes */}
        {gameOver && winner !== 1 && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            {winner === 2 && (
              <GameOverGlitchText text="YOU LOSE!" className="text-white text-3xl sm:text-5xl md:text-7xl font-pixel text-center drop-shadow-[0_0_16px_#22c55e]" />
            )}
            {winner === 'draw' && <span className="font-pixel text-2xl sm:text-4xl md:text-5xl text-gray-300 bg-black/70 px-4 sm:px-8 py-2 sm:py-4 rounded-lg">Draw!</span>}
          </div>
        )}
      </div>
      <div className="flex flex-row justify-center items-center w-full max-w-[320px] mt-2 gap-2">
        <ArcadeButton onClick={resetGame} className="w-full">Reset game</ArcadeButton>
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
    </div>
  );
}


