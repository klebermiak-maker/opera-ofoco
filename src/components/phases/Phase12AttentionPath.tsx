import React, { useState, useEffect, useRef } from 'react';
import { Route, CheckCircle2, Flag } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

interface PathCell {
  row: number;
  col: number;
  val: number;
  isEven: boolean;
  isOnValidPath: boolean;
  isStart?: boolean;
  isEnd?: boolean;
}

export const Phase12AttentionPath: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [grid, setGrid] = useState<PathCell[][]>([]);
  const [visited, setVisited] = useState<string[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  // Generate 5x5 grid with a continuous orthogonal even-number path from (0,0) to (4,4)
  const generateMaze = () => {
    // Defined winding path coordinates from (0,0) to (4,4)
    // (0,0) -> (0,1) -> (1,1) -> (2,1) -> (2,2) -> (2,3) -> (3,3) -> (4,3) -> (4,4)
    const validCoords = new Set([
      '0,0', '0,1', '1,1', '2,1', '2,2', '2,3', '3,3', '4,3', '4,4'
    ]);

    const evens = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    const odds = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

    const matrix: PathCell[][] = [];
    for (let r = 0; r < 5; r++) {
      const row: PathCell[] = [];
      for (let c = 0; c < 5; c++) {
        const key = `${r},${c}`;
        const isValid = validCoords.has(key);

        const val = isValid
          ? evens[Math.floor(Math.random() * evens.length)]
          : odds[Math.floor(Math.random() * odds.length)];

        row.push({
          row: r,
          col: c,
          val,
          isEven: isValid,
          isOnValidPath: isValid,
          isStart: r === 0 && c === 0,
          isEnd: r === 4 && c === 4,
        });
      }
      matrix.push(row);
    }

    setGrid(matrix);
    setVisited(['0,0']); // start visited automatically
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    generateMaze();
  }, []);

  const handleCellClick = (cell: PathCell) => {
    const key = `${cell.row},${cell.col}`;
    if (visited.includes(key)) return;

    // Check adjacency with last visited cell
    const lastKey = visited[visited.length - 1];
    const [lastR, lastC] = lastKey.split(',').map(Number);

    const isAdjacent =
      (Math.abs(cell.row - lastR) === 1 && cell.col === lastC) ||
      (Math.abs(cell.col - lastC) === 1 && cell.row === lastR);

    if (!isAdjacent) {
      sounds.playError();
      onError(20, 'O caminho deve ser contínuo! Conecte apenas células vizinhas (cima, baixo, esquerda ou direita).');
      return;
    }

    if (!cell.isEven) {
      sounds.playError();
      onError(20, `Cuidado! O número ${cell.val} é ÍMPAR. A regra exige passar SOMENTE por números PARES.`);
      return;
    }

    sounds.playCorrect();
    const newVisited = [...visited, key];
    setVisited(newVisited);

    // Reached destination?
    if (cell.isEnd) {
      const timeTaken = (Date.now() - startTimeRef.current) / 1000;
      const speedBonus = timeTaken < 25 ? 50 : 25;
      onSuccess(3, speedBonus, 100);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 max-w-xl mx-auto w-full">
      {/* Rule Header */}
      <div className="w-full p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-semibold">
          <Route className="w-4 h-4 text-cyan-400" />
          <span>Traçar caminho do INÍCIO à SAÍDA passando somente por NÚMEROS PARES</span>
        </div>
        <div className="font-mono-numbers text-amber-400 font-bold">
          Passos: {visited.length}
        </div>
      </div>

      {/* 5x5 Labyrinth Grid */}
      <div className="p-3 sm:p-4 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
        <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const key = `${r},${c}`;
              const isCellVisited = visited.includes(key);

              return (
                <button
                  key={key}
                  onClick={() => handleCellClick(cell)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-mono font-bold text-sm sm:text-base transition-all flex flex-col items-center justify-center border relative ${
                    isCellVisited
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/30'
                      : 'bg-slate-900 border-slate-700/80 text-white hover:border-cyan-400 hover:bg-slate-850 active:scale-95'
                  }`}
                  aria-label={`Linha ${r + 1} Coluna ${c + 1}: ${cell.val}`}
                >
                  <span>{cell.val}</span>

                  {cell.isStart && (
                    <span className="text-[8px] font-sans font-extrabold uppercase text-emerald-950 bg-emerald-400 px-1 rounded-sm leading-tight mt-0.5">
                      INÍCIO
                    </span>
                  )}
                  {cell.isEnd && (
                    <span className="text-[8px] font-sans font-extrabold uppercase text-amber-950 bg-amber-400 px-1 rounded-sm leading-tight mt-0.5">
                      SAÍDA
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="text-xs text-slate-400 text-center">
        Dica: Clique na próxima casa vizinha par para estender o cabo de conexão de dados.
      </div>
    </div>
  );
};
