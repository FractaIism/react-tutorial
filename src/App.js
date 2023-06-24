import { useState } from "react";

function Square({ value, onSquareClick, isOnWinLine }) {
  return (
    <button
      className={"square " + (isOnWinLine ? "yellow" : "")}
      onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)[0]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const [winner, winLine] = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`
  }

  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map((_, row) => (
        <div className="board-row">
          {[0, 1, 2].map((_, col) => {
            let index = 3 * row + col;
            return (
              <Square
                value={squares[index]}
                isOnWinLine={winLine.includes(index)}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      )) }
    </>
  );
}

export default function Game() {
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function toggleBtnOrder() {
    const newOrder = btnOrder === "asc" ? "desc" : "asc";
    setBtnOrder(newOrder);
  }

  function findFirstDiffIndex(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      throw "length mismatch";
    }
    for (let i = 0; i < arr1.length; i++){
      if (arr1[i] !== arr2[i]) {
        return i;
      }
    }
  }

  function indexToRowCol(index) {
    let row = Math.floor(index / 3);
    let col = index % 3;
    return [row, col];
  }

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [btnOrder, setBtnOrder] = useState("asc");
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const moves = history.map((squares, move) => {
    let description;
    let moveIndex = (move > 0) && findFirstDiffIndex(history[move], history[move - 1]);
    let [moveRow, moveCol] = indexToRowCol(moveIndex);
    if (move > 0) {
      description = `Go to move #${move} (${moveRow},${moveCol})`;
    } else {
      description = `Go to game start`;
    }
    return (
      <li key={move}>
        {move === currentMove
          ? <span>You are at move {currentMove} ({moveRow},{moveCol})</span>
          :<button onClick={() => jumpTo(move)}>{description}</button>
        }
      </li>
    );
  })

  const reorderedMoves = btnOrder === "asc" ? moves : moves.toReversed();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleBtnOrder}>Toggle button order</button>
        <ol>{reorderedMoves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // return winner and winning line
      return [squares[a], [a, b, c]];
    }
  }
  return [null, []];
}
