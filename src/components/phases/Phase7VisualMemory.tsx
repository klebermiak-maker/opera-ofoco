import React, { useState, useEffect, useRef } from 'react';
import { Eye, HelpCircle } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

interface GridItem {
  id: number;
  symbol: string;
  name: string;
  colorClass: string;
}

const ITEMS_CATALOG: GridItem[] = [
  { id: 1, symbol: '🔋', name: 'Bateria', colorClass: 'text-emerald-400' },
  { id: 2, symbol: '📡', name: 'Antena', colorClass: 'text-sky-400' },
  { id: 3, symbol: '💾', name: 'Disco', colorClass: 'text-indigo-400' },
  { id: 4, symbol: '🔑', name: 'Chave', colorClass: 'text-amber-400' },
  { id: 5, symbol: '🔬', name: 'Lente', colorClass: 'text-cyan-400' },
  { id: 6, symbol: '🧭', name: 'Bússola', colorClass: 'text-rose-400' },
  { id: 7, symbol: '📻', name: 'Rádio', colorClass: 'text-purple-400' },
];

export const Phase7VisualMemory: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [round, setRound] = useState(1);
  const [grid, setGrid] = useState<(GridItem | null)[]>([]);
  const [targetIndex, setTargetIndex] = useState<number>(-1);
  const [missingItem, setMissingItem] = useState<GridItem | null>(null);
  const [options, setOptions] = useState<GridItem[]>([]);
  const [isMemorizing, setIsMemorizing] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const startTimeRef = useRef<number>(Date.now());

  const initRound = () => {
    // 3x3 = 9 cells
    // Place 5 random items
    const newGrid: (GridItem | null)[] = Array(9).fill(null);
    const chosenItems = [...ITEMS_CATALOG].sort(() => 0.5 - Math.random()).slice(0, 5);
    const cellIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => 0.5 - Math.random()).slice(0, 5);

    cellIndices.forEach((pos, idx) => {
      newGrid[pos] = chosenItems[idx];
    });

    // Choose 1 of these cellIndices to be the missing item
    const missingPos = cellIndices[Math.floor(Math.random() * cellIndices.length)];
    const theMissing = newGrid[missingPos]!;

    // Distractor options: 1 correct + 3 other catalog items
    const distractors = ITEMS_CATALOG.filter((i) => i.name !== theMissing.name).slice(0, 3);
    const roundOptions = [theMissing, ...distractors].sort(() => 0.5 - Math.random());

    setGrid(newGrid);
    setTargetIndex(missingPos);
    setMissingItem(theMissing);
    setOptions(roundOptions);
    setIsMemorizing(true);
    setCountdown(3);
  };

  useEffect(() => {
    initRound();
    startTimeRef.current = Date.now();
  }, [round]);

  useEffect(() => {
    if (!isMemorizing) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsMemorizing(false);
          sounds.playUnlock();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isMemorizing]);

  const handleOptionClick = (item: GridItem) => {
    if (!missingItem) return;
    sounds.playClick();

    if (item.name === missingItem.name) {
      sounds.playCorrect();
      if (round < 2) {
        setTimeout(() => setRound(2), 600);
      } else {
        const timeTaken = (Date.now() - startTimeRef.current) / 1000;
        const speedBonus = timeTaken < 15 ? 50 : 25;
        onSuccess(3, speedBonus, 100);
      }
    } else {
      sounds.playError();
      onError(20, `Observe novamente. Nesta posição não estava o(a) ${item.name}.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto w-full">
      {/* Round & Countdown Alert */}
      <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
        <span className="text-cyan-400">FASE DE RETENÇÃO ESPACIAL · {round}/2</span>
        <span className="text-slate-600">·</span>
        {isMemorizing ? (
          <span className="text-amber-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> Memorizando ({countdown}s)
          </span>
        ) : (
          <span className="text-emerald-400">Qual elemento sumiu da marcação?</span>
        )}
      </div>

      {/* 3x3 Grid Display */}
      <div className="grid grid-cols-3 gap-3 p-4 rounded-3xl bg-slate-950 border border-slate-800 w-72 sm:w-80">
        {grid.map((cell, idx) => {
          const isTargetMissing = !isMemorizing && idx === targetIndex;

          return (
            <div
              key={idx}
              className={`h-20 sm:h-22 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                isTargetMissing
                  ? 'bg-amber-950/40 border-2 border-amber-400 animate-pulse'
                  : cell
                  ? 'bg-slate-900 border-slate-700/80 shadow-sm'
                  : 'bg-slate-950/60 border-dashed border-slate-850'
              }`}
            >
              {isTargetMissing ? (
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-amber-400">?</span>
                  <span className="text-[9px] text-amber-300 font-semibold mt-0.5">QUAL ERA?</span>
                </div>
              ) : cell && (isMemorizing || idx !== targetIndex) ? (
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl leading-none">{cell.symbol}</span>
                  <span className="text-[10px] text-slate-300 font-medium mt-1">{cell.name}</span>
                </div>
              ) : (
                <span className="text-slate-800 text-xs">·</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Options to Choose From (Shown after memorization) */}
      {!isMemorizing && (
        <div className="w-full space-y-3 animate-in fade-in">
          <div className="text-xs text-slate-400 text-center font-medium">
            Selecione o objeto que ocupava a posição destacada:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(opt)}
                className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-md"
              >
                <span className="text-2xl">{opt.symbol}</span>
                <span className="text-xs font-semibold text-white">{opt.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
