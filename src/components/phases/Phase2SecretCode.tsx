import React, { useState, useEffect, useRef } from 'react';
import { Eye, ArrowRight, RotateCcw } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

interface SymbolOption {
  id: string;
  char: string;
  name: string;
  color: string;
}

const SYMBOLS: SymbolOption[] = [
  { id: 'tri', char: '▲', name: 'Triângulo', color: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30' },
  { id: 'cir', char: '●', name: 'Círculo', color: 'text-sky-400 bg-sky-950/40 border-sky-500/30' },
  { id: 'squ', char: '■', name: 'Quadrado', color: 'text-amber-400 bg-amber-950/40 border-amber-500/30' },
  { id: 'sta', char: '★', name: 'Estrela', color: 'text-purple-400 bg-purple-950/40 border-purple-500/30' },
  { id: 'dia', char: '◆', name: 'Losango', color: 'text-rose-400 bg-rose-950/40 border-rose-500/30' },
];

export const Phase2SecretCode: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [round, setRound] = useState(1);
  const [targetSequence, setTargetSequence] = useState<SymbolOption[]>([]);
  const [playerInput, setPlayerInput] = useState<SymbolOption[]>([]);
  const [isMemorizing, setIsMemorizing] = useState(true);
  const [countdown, setCountdown] = useState(4);
  const startTimeRef = useRef<number>(Date.now());

  // Setup round
  const generateSequence = (length: number) => {
    const seq: SymbolOption[] = [];
    for (let i = 0; i < length; i++) {
      const randIdx = Math.floor(Math.random() * SYMBOLS.length);
      seq.push(SYMBOLS[randIdx]);
    }
    setTargetSequence(seq);
    setPlayerInput([]);
    setIsMemorizing(true);
    setCountdown(length + 1);
  };

  useEffect(() => {
    generateSequence(round === 1 ? 3 : 4);
    startTimeRef.current = Date.now();
  }, [round]);

  // Countdown timer for preview
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

  const handleSymbolClick = (sym: SymbolOption) => {
    if (isMemorizing) return;
    sounds.playClick();

    const newInput = [...playerInput, sym];
    setPlayerInput(newInput);

    // Validate current step
    const currentIndex = playerInput.length;
    if (sym.id !== targetSequence[currentIndex].id) {
      sounds.playError();
      onError(20, 'Observe novamente. A sequência quebrou na posição ' + (currentIndex + 1) + '.');
      // Reset input for retry of current sequence
      setTimeout(() => {
        setPlayerInput([]);
      }, 500);
      return;
    }

    // Check if finished sequence
    if (newInput.length === targetSequence.length) {
      sounds.playCorrect();
      if (round === 1) {
        setTimeout(() => {
          setRound(2);
        }, 700);
      } else {
        // Complete!
        const totalDuration = (Date.now() - startTimeRef.current) / 1000;
        const speedBonus = totalDuration < 15 ? 50 : 25;
        onSuccess(3, speedBonus, 100);
      }
    }
  };

  const handleClear = () => {
    sounds.playClick();
    setPlayerInput([]);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Round & Step Info */}
      <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
        <span className="text-cyan-400">RODADA {round} DE 2</span>
        <span className="text-slate-600">·</span>
        <span>Sequência de {targetSequence.length} símbolos</span>
      </div>

      {/* Target Display or Hidden Screen */}
      <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[140px] text-center relative">
        {isMemorizing ? (
          <div className="space-y-3 animate-in fade-in">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-cyan-400">
              <Eye className="w-4 h-4 animate-pulse" />
              <span>MEMORIZE A ORDEM! Ocultando em {countdown}s</span>
            </div>
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              {targetSequence.map((item, idx) => (
                <div
                  key={idx}
                  className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center ${item.color} shadow-lg`}
                >
                  <span className="text-2xl font-bold leading-none">{item.char}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3 w-full">
            <div className="text-xs text-slate-400">
              Reproduza a chave criptográfica clicando nos símbolos abaixo na ordem correta:
            </div>
            {/* Player's entered slots */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {targetSequence.map((_, idx) => {
                const entered = playerInput[idx];
                return (
                  <div
                    key={idx}
                    className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      entered
                        ? `${entered.color} shadow-sm`
                        : 'bg-slate-900/60 border-dashed border-slate-700 text-slate-600'
                    }`}
                  >
                    {entered ? (
                      <>
                        <span className="text-2xl font-bold leading-none">{entered.char}</span>
                        <span className="text-[10px] opacity-75 mt-0.5">{entered.name}</span>
                      </>
                    ) : (
                      <span className="text-xs font-mono">{idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Symbol Input Keyboard (available after memorization) */}
      <div className="w-full max-w-lg space-y-3">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {SYMBOLS.map((sym) => (
            <button
              key={sym.id}
              disabled={isMemorizing || playerInput.length >= targetSequence.length}
              onClick={() => handleSymbolClick(sym)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                sym.color
              } hover:brightness-125 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed`}
              aria-label={`Inserir símbolo ${sym.name} ${sym.char}`}
            >
              <span className="text-2xl font-bold">{sym.char}</span>
              <span className="text-[10px] font-medium mt-1 truncate">{sym.name}</span>
            </button>
          ))}
        </div>

        {!isMemorizing && playerInput.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar entrada</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
