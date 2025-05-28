import { useState, useEffect } from "react";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { Audio } from "../audio";
import GameOverGlitchText from "../tetris/GameOverGlitchText";

import { useIsMobile } from "@/hooks/use-mobile";
import { useScores } from "@/lib/scores";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const audio = new Audio();

export function TicTacToeGame() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState("playing"); // Changed initial state to "playing" instead of "waiting"
  const [winner, setWinner] = useState(null); // null, 'player', 'ai', 'draw'
  const [difficulty, setDifficulty] = useState("normal"); // easy, normal, hard
  const isMobile = useIsMobile();
  const { addScore } = useScores();
  const { isAuthenticated } = useAuth();

  // Initialize the game automatically when component mounts
  useEffect(() => {
    startGame();
  }, []);

  // Start the game
  const startGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus("playing");
    setWinner(null);

    // Randomly set difficulty at the start of each game
    const difficulties = ["easy", "normal", "hard"];
    const randomDifficulty =
      difficulties[Math.floor(Math.random() * difficulties.length)];
    setDifficulty(randomDifficulty);
    // audio.playStart(); // Quitar sonido al iniciar
  };

  // Reset the game
  const resetGame = () => {
    startGame();
  };

  // Player makes a move
  const handlePlayerMove = (index) => {
    if (gameStatus !== "playing" || !isPlayerTurn || board[index] !== null)
      return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);

    // Solo reproducir sonido si el movimiento es dentro del juego, no al iniciar desde la card
    if (gameStatus === "playing") {
      audio.playMove();
    }

    // Check if game is over after player's move
    const result = checkGameStatus(newBoard);
    if (result) {
      handleGameOver(result);
    }
  };

  // AI makes a move
  useEffect(() => {
    if (gameStatus === "playing" && !isPlayerTurn) {
      const timeoutId = setTimeout(() => {
        let bestMove;

        // Adjust AI behavior based on difficulty
        switch (difficulty) {
          case "easy":
            bestMove = findRandomMove(board);
            break;
          case "hard":
            bestMove = findBestMove(board);
            break;
          case "normal":
          default:
            // For normal difficulty, sometimes make the best move, sometimes make a random move
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
      }, 500); // Add a small delay to make AI move feel more natural

      return () => clearTimeout(timeoutId);
    }
  }, [board, isPlayerTurn, gameStatus, difficulty]);

  // Handle game over
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
      audio.playLineClear(); // Play win sound
    } else if (result === "ai") {
      toast.error("You lose. Try again.");
      audio.playGameOver(); // Play lose sound
    } else {
      toast.info("Draw!");
    }
  };

  // Check if game is over
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

    // Check for winner
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a] === "X" ? "player" : "ai";
      }
    }

    // Check for draw
    if (!board.includes(null)) {
      return "draw";
    }

    return null;
  };

  // AI Logic: Find random move (for easy difficulty)
  const findRandomMove = (board) => {
    const emptySquares = board
      .map((value, index) => (value === null ? index : null))
      .filter((index) => index !== null);

    if (emptySquares.length === 0) return -1;

    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  };

  // AI Logic: Find best move (using minimax algorithm)
  const findBestMove = (board) => {
    // If there are no empty spaces, return -1
    if (!board.includes(null)) return -1;

    // First, check if AI can win in one move
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = "O";
        if (checkGameStatus(newBoard) === "ai") {
          return i;
        }
      }
    }

    // Second, check if player can win in one move and block it
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        const newBoard = [...board];
        newBoard[i] = "X";
        if (checkGameStatus(newBoard) === "player") {
          return i;
        }
      }
    }

    // Third, take the center if it's free
    if (board[4] === null) return 4;

    // Fourth, try to take the corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter((c) => board[c] === null);
    if (availableCorners.length > 0) {
      return availableCorners[
        Math.floor(Math.random() * availableCorners.length)
      ];
    }

    // Finally, take any available edge
    const edges = [1, 3, 5, 7];
    const availableEdges = edges.filter((e) => board[e] === null);
    if (availableEdges.length > 0) {
      return availableEdges[Math.floor(Math.random() * availableEdges.length)];
    }

    return -1;
  };

  // Render cell with proper symbol
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
        {/* Game board */}
        <div className="grid grid-cols-3 gap-2 mx-auto">
          {board.map((_, index) => (
            <div key={index}>{renderCell(index)}</div>
          ))}
        </div>
      </div>

      {/* Centered restart button when game is ended */}
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
