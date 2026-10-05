import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, Search } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

interface MatrixCell {
  id: number;
  row: number;
  col: number;
  symbol: string;
  label: string;
  colorClass: string;
  hasDifference: boolean;
  altSymbol?: string;
  altColorClass?: string;
  altLabel?: string;
  diffType?: string;
}

export const Phase3DetectiveDetails: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [cells, setCells] = useState<MatrixCell[]>([]);
  const [foundDiffIds, setFoundDiffIds] = useState<number[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  // Generate 12 cells (3 rows x 4 cols) with exactly 3 differences
  const generateLevel = () => {
    const symbols = [
      { sym: '▲', label: 'Triângulo', color: 'text-emerald-400' },
      { sym: '■', label: 'Quadrado', color: 'text-amber-400' },
      { sym: '●', label: 'Círculo', color: 'text-sky-400' },
      { sym: '★', label: 'Estrela', color: 'text-purple-400' },
      { sym: '◆', label: 'Losango', color: 'text-rose-400' },
      { sym: '✖', label: 'Cruz', color: 'text-cyan-400' },
    ];

    const grid: MatrixCell[] = [];
    for (let i = 0; i < 12; i++) {
      const pick = symbols[Math.floor(Math.random() * symbols.length)];
      grid.push({
        id: i,
        row: Math.floor(i / 4),
        col: i % 4,
        symbol: pick.sym,
        label: pick.label,
        colorClass: pick.color,
        hasDifference: false,
      });
    }

    // Pick 3 random cells to inject differences
    const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].sort(() => 0.5 - Math.random()).slice(0, 3);

    indices.forEach((idx) => {
      const current = grid[idx];
      // Pick a distinct alternative
      const alternative = symbols.find((s) => s.sym !== current.symbol) || symbols[0];
      grid[idx] = {
        ...current,
        hasDifference: true,
        altSymbol: alternative.sym,
        altColorClass: alternative.color,
        altLabel: alternative.label,
        diffType: `Símbolo alterado para ${alternative.label}`,
      };
    });

    setCells(grid);
    setFoundDiffIds([]);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    generateLevel();
  }, []);

  const handleCellClick = (cell: MatrixCell) => {
    if (foundDiffIds.includes(cell.id)) return;

    sounds.playClick();
    if (cell.hasDifference) {
      sounds.playCorrect();
      const updatedFound = [...foundDiffIds, cell.id];
      setFoundDiffIds(updatedFound);

      if (updatedFound.length === 3) {
        const timeTaken = (Date.now() - startTimeRef.current) / 1000;
        const speedBonus = timeTaken < 20 ? 50 : 25;
        onSuccess(3, speedBonus, 100);
      }
    } else {
      sounds.playError();
      onError(20, 'Observe novamente. Estes dois blocos são idênticos nos dois painéis.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Tracker Banner */}
      <div className="flex items-center justify-between w-full max-w-2xl bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold">
          <Search className="w-4 h-4" />
          <span>Localize as 3 diferenças clicando no PAINEL B:</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono-numbers font-bold text-amber-400">
          <span>{foundDiffIds.length} / 3 Encontradas</span>
        </div>
      </div>

      {/* Comparison Grid: Painel A vs Painel B */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Painel A (Original) */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center">
          <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
            <span>PAINEL A (TRANSMISSÃO ORIGINAL)</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 w-full">
            {cells.map((cell) => (
              <div
                key={`a-${cell.id}`}
                className="h-14 sm:h-16 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center select-none"
              >
                <span className={`text-xl font-bold ${cell.colorClass}`}>
                  {cell.symbol}
                </span>
                <span className="text-[9px] text-slate-500">{cell.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Painel B (Com Anomalias - Clicável) */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/40 flex flex-col items-center">
          <div className="text-xs uppercase tracking-wider font-semibold text-cyan-300 mb-3 flex items-center gap-1.5">
            <span>PAINEL B (CLIQUE NAS DIFERENÇAS)</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5 w-full">
            {cells.map((cell) => {
              const isFound = foundDiffIds.includes(cell.id);
              const displaySymbol = cell.hasDifference ? cell.altSymbol : cell.symbol;
              const displayColor = cell.hasDifference ? cell.altColorClass : cell.colorClass;
              const displayLabel = cell.hasDifference ? cell.altLabel : cell.label;

              return (
                <button
                  key={`b-${cell.id}`}
                  onClick={() => handleCellClick(cell)}
                  className={`h-14 sm:h-16 rounded-xl flex flex-col items-center justify-center transition-all border relative cursor-pointer ${
                    isFound
                      ? 'bg-emerald-950/60 border-emerald-400 shadow-md shadow-emerald-950/50'
                      : 'bg-slate-900 border-slate-700/80 hover:border-cyan-400 hover:bg-slate-850 active:scale-95'
                  }`}
                  aria-label={`Painel B linha ${cell.row + 1} coluna ${cell.col + 1}: ${displayLabel}`}
                >
                  <span className={`text-xl font-bold ${displayColor}`}>
                    {displaySymbol}
                  </span>
                  <span className="text-[9px] text-slate-400">{displayLabel}</span>

                  {isFound && (
                    <div className="absolute top-1 right-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
