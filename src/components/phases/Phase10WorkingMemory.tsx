import React, { useState, useEffect, useRef } from 'react';
import { Eye, Brain, Check } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

interface WorkingMemoryChallenge {
  sequence: number[];
  question: string;
  correctAnswer: number;
  options: number[];
  memorizeSeconds: number;
}

const CHALLENGES: WorkingMemoryChallenge[] = [
  {
    sequence: [3, 8, 2, 7],
    question: 'Qual era o SEGUNDO número da sequência memorizada?',
    correctAnswer: 8,
    options: [2, 3, 7, 8],
    memorizeSeconds: 3,
  },
  {
    sequence: [9, 4, 7, 1, 6],
    question: 'Qual era o MAIOR número presente na sequência?',
    correctAnswer: 9,
    options: [6, 7, 8, 9],
    memorizeSeconds: 4,
  },
];

export const Phase10WorkingMemory: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [isMemorizing, setIsMemorizing] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const startTimeRef = useRef<number>(Date.now());

  const currentChallenge = CHALLENGES[currentRoundIdx];

  useEffect(() => {
    setIsMemorizing(true);
    setCountdown(currentChallenge.memorizeSeconds);
    startTimeRef.current = Date.now();
  }, [currentRoundIdx]);

  useEffect(() => {
    if (!isMemorizing) return;
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setIsMemorizing(false);
          sounds.playUnlock();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isMemorizing]);

  const handleOptionClick = (answer: number) => {
    sounds.playClick();

    if (answer === currentChallenge.correctAnswer) {
      sounds.playCorrect();
      if (currentRoundIdx < CHALLENGES.length - 1) {
        setTimeout(() => {
          setCurrentRoundIdx((prev) => prev + 1);
        }, 500);
      } else {
        const timeTaken = (Date.now() - startTimeRef.current) / 1000;
        const speedBonus = timeTaken < 15 ? 50 : 25;
        onSuccess(3, speedBonus, 100);
      }
    } else {
      sounds.playError();
      onError(20, 'Observe novamente. Tente reconstruir mentalmente os números da esquerda para a direita.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto w-full">
      {/* Round Info */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <span className="text-cyan-400">DESAFIO COGNITIVO {currentRoundIdx + 1} DE {CHALLENGES.length}</span>
        <span className="text-slate-600">·</span>
        <span>Retenção & Manipulação Mental</span>
      </div>

      {/* Screen Area */}
      <div className="w-full p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center min-h-[160px] text-center">
        {isMemorizing ? (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-cyan-400">
              <Eye className="w-4 h-4 animate-pulse" />
              <span>MEMORIZE ESTA SEQUÊNCIA! Ocultando em {countdown}s</span>
            </div>
            <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              {currentChallenge.sequence.map((num, i) => (
                <div
                  key={i}
                  className="w-14 h-16 sm:w-16 sm:h-20 rounded-2xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-2xl sm:text-3xl flex items-center justify-center shadow-lg"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-center gap-2 text-amber-400 font-semibold text-xs">
              <Brain className="w-4 h-4" />
              <span>TRANSFORMAÇÃO MENTAL</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white max-w-md">
              {currentChallenge.question}
            </h3>
          </div>
        )}
      </div>

      {/* Options when not memorizing */}
      {!isMemorizing && (
        <div className="w-full space-y-3">
          <div className="text-xs text-slate-400 text-center font-medium">
            Selecione a resposta correta:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentChallenge.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleOptionClick(opt)}
                className="py-4 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-white font-mono font-bold text-2xl transition-all shadow-md active:scale-95"
                aria-label={`Opção número ${opt}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
