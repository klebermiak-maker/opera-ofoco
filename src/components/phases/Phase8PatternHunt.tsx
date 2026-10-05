import React, { useState, useEffect, useRef } from 'react';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

interface PatternRound {
  question: string;
  items: {
    id: number;
    char: string;
    label: string;
    color: string;
    isDifferent: boolean;
  }[];
  explanation: string;
}

const ROUNDS: PatternRound[] = [
  {
    question: 'Qual destes símbolos quebra a harmonia do padrão?',
    items: [
      { id: 1, char: '●', label: 'Círculo Azul', color: 'text-sky-400', isDifferent: false },
      { id: 2, char: '●', label: 'Círculo Azul', color: 'text-sky-400', isDifferent: false },
      { id: 3, char: '▲', label: 'Triângulo Vermelho', color: 'text-rose-400', isDifferent: true },
      { id: 4, char: '●', label: 'Círculo Azul', color: 'text-sky-400', isDifferent: false },
      { id: 5, char: '●', label: 'Círculo Azul', color: 'text-sky-400', isDifferent: false },
    ],
    explanation: 'O triângulo vermelho é o único com forma e cor divergentes.',
  },
  {
    question: 'Qual número NÃO pertence à família dos números pares?',
    items: [
      { id: 1, char: '12', label: 'Par (12)', color: 'text-emerald-400', isDifferent: false },
      { id: 2, char: '24', label: 'Par (24)', color: 'text-emerald-400', isDifferent: false },
      { id: 3, char: '18', label: 'Par (18)', color: 'text-emerald-400', isDifferent: false },
      { id: 4, char: '27', label: 'Ímpar (27)', color: 'text-amber-400', isDifferent: true },
      { id: 5, char: '30', label: 'Par (30)', color: 'text-emerald-400', isDifferent: false },
    ],
    explanation: '27 é o único número ímpar da sequência (não divisível por 2).',
  },
  {
    question: 'Qual seta aponta para uma direção oposta às demais?',
    items: [
      { id: 1, char: '⬆', label: 'Para Cima', color: 'text-cyan-400', isDifferent: false },
      { id: 2, char: '⬆', label: 'Para Cima', color: 'text-cyan-400', isDifferent: false },
      { id: 3, char: '⬆', label: 'Para Cima', color: 'text-cyan-400', isDifferent: false },
      { id: 4, char: '⬇', label: 'Para Baixo', color: 'text-rose-400', isDifferent: true },
      { id: 5, char: '⬆', label: 'Para Cima', color: 'text-cyan-400', isDifferent: false },
    ],
    explanation: 'A quarta seta aponta para baixo, quebrando a orientação para cima.',
  },
];

export const Phase8PatternHunt: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  const currentRound = ROUNDS[currentRoundIdx];

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleItemClick = (isDifferent: boolean) => {
    sounds.playClick();

    if (isDifferent) {
      sounds.playCorrect();
      if (currentRoundIdx < ROUNDS.length - 1) {
        setTimeout(() => {
          setCurrentRoundIdx((prev) => prev + 1);
        }, 500);
      } else {
        const timeTaken = (Date.now() - startTimeRef.current) / 1000;
        const speedBonus = timeTaken < 20 ? 50 : 25;
        onSuccess(3, speedBonus, 100);
      }
    } else {
      sounds.playError();
      onError(20, `Observe atentamente todos os elementos antes de responder. Dica: ${currentRound.explanation}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto w-full">
      {/* Header Info */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <span className="text-cyan-400">PADRÃO {currentRoundIdx + 1} DE {ROUNDS.length}</span>
        <span className="text-slate-600">·</span>
        <span>Localize o intruso</span>
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center w-full">
        <h3 className="text-sm sm:text-base font-semibold text-white">
          {currentRound.question}
        </h3>
      </div>

      {/* Row of Pattern Items */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap w-full">
        {currentRound.items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.isDifferent)}
            className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 flex flex-col items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            aria-label={`Item ${item.label}`}
          >
            <span className={`text-3xl sm:text-4xl font-bold leading-none ${item.color}`}>
              {item.char}
            </span>
            <span className="text-[10px] text-slate-400 text-center px-1 truncate max-w-[70px]">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
