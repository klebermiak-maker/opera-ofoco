import React, { useState, useEffect, useRef } from 'react';
import { Timer, Check, AlertCircle } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

interface QuickChallenge {
  prompt: string;
  visualItems: { char: string; color: string; label: string }[];
  correctAnswer: string | number;
  options: (string | number)[];
}

const QUICK_CHALLENGES: QuickChallenge[] = [
  {
    prompt: 'Quantas ESTRELAS AMARELAS (★) estão espalhadas no painel?',
    visualItems: [
      { char: '★', color: 'text-amber-400', label: 'Estrela Amarela' },
      { char: '●', color: 'text-sky-400', label: 'Círculo Azul' },
      { char: '★', color: 'text-amber-400', label: 'Estrela Amarela' },
      { char: '■', color: 'text-rose-400', label: 'Quadrado Vermelho' },
      { char: '★', color: 'text-amber-400', label: 'Estrela Amarela' },
      { char: '▲', color: 'text-emerald-400', label: 'Triângulo Verde' },
      { char: '★', color: 'text-amber-400', label: 'Estrela Amarela' },
      { char: '●', color: 'text-sky-400', label: 'Círculo Azul' },
    ],
    correctAnswer: 4,
    options: [3, 4, 5, 6],
  },
  {
    prompt: 'Qual destes símbolos NÃO é verde?',
    visualItems: [
      { char: '▲', color: 'text-emerald-400', label: 'Triângulo Verde' },
      { char: '■', color: 'text-emerald-400', label: 'Quadrado Verde' },
      { char: '●', color: 'text-rose-500', label: 'Círculo Vermelho' },
      { char: '★', color: 'text-emerald-400', label: 'Estrela Verde' },
    ],
    correctAnswer: '● Círculo Vermelho',
    options: ['▲ Triângulo Verde', '■ Quadrado Verde', '● Círculo Vermelho', '★ Estrela Verde'],
  },
  {
    prompt: 'Resolva a calibração de dados rápida: 15 + 17 = ?',
    visualItems: [],
    correctAnswer: 32,
    options: [28, 31, 32, 34],
  },
];

export const Phase13TimeAttack: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(16);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const current = QUICK_CHALLENGES[challengeIdx];

  useEffect(() => {
    setSecondsLeft(16);
    startTimeRef.current = Date.now();
  }, [challengeIdx]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          sounds.playError();
          onError(20, 'O tempo da rodada acabou! Respire fundo e tente com calma.');
          return 16; // reset gentle timer
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [challengeIdx]);

  const handleAnswer = (opt: string | number) => {
    sounds.playClick();

    if (String(opt) === String(current.correctAnswer)) {
      sounds.playCorrect();
      if (challengeIdx < QUICK_CHALLENGES.length - 1) {
        setChallengeIdx((prev) => prev + 1);
      } else {
        onSuccess(3, 50, 100);
      }
    } else {
      sounds.playError();
      onError(20, 'Resposta incorreta. Observe o painel com atenção!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 max-w-xl mx-auto w-full">
      {/* Header Info & Gentle Timer */}
      <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-300">
        <span className="text-cyan-400">MICRO-DESAFIO {challengeIdx + 1} DE {QUICK_CHALLENGES.length}</span>
        <div className="flex items-center gap-1.5 text-amber-400 font-mono-numbers">
          <Timer className="w-4 h-4" />
          <span>{secondsLeft}s restantes</span>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-1000"
          style={{ width: `${(secondsLeft / 16) * 100}%` }}
        />
      </div>

      {/* Challenge Question Card */}
      <div className="w-full p-5 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
          {current.prompt}
        </h3>

        {current.visualItems.length > 0 && (
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap p-4 rounded-xl bg-slate-900 border border-slate-800">
            {current.visualItems.map((item, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl font-bold"
              >
                <span className={item.color}>{item.char}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(opt)}
            className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-white font-semibold text-sm sm:text-base transition-all shadow-md active:scale-95"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
