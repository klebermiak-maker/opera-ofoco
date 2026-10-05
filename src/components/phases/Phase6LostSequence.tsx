import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Check, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

interface SequenceChallenge {
  terms: (string | number)[];
  missingIndex: number;
  correctAnswer: string | number;
  options: (string | number)[];
  ruleHint: string;
}

const CHALLENGES_POOL: SequenceChallenge[] = [
  {
    terms: [2, 4, 6, '?', 10],
    missingIndex: 3,
    correctAnswer: 8,
    options: [7, 8, 9, 12],
    ruleHint: 'Padrão dos números pares de 2 em 2 (+2).',
  },
  {
    terms: [5, 10, 15, 20, '?'],
    missingIndex: 4,
    correctAnswer: 25,
    options: [22, 24, 25, 30],
    ruleHint: 'Múltiplos de 5 somando 5 a cada etapa (+5).',
  },
  {
    terms: [3, 6, 12, '?', 48],
    missingIndex: 3,
    correctAnswer: 24,
    options: [18, 20, 24, 28],
    ruleHint: 'Cada número é o dobro do anterior (multiplicação por 2).',
  },
  {
    terms: ['A', 'C', 'E', '?', 'I'],
    missingIndex: 3,
    correctAnswer: 'G',
    options: ['F', 'G', 'H', 'J'],
    ruleHint: 'Letras do alfabeto pulando de 2 em 2.',
  },
  {
    terms: [50, 45, '?', 35, 30],
    missingIndex: 2,
    correctAnswer: 40,
    options: [38, 40, 42, 44],
    ruleHint: 'Sequência decrescente subtraindo 5 (-5).',
  },
  {
    terms: ['▲', '■', '▲', '?', '▲'],
    missingIndex: 3,
    correctAnswer: '■',
    options: ['●', '▲', '■', '★'],
    ruleHint: 'Alternância regular entre triângulo e quadrado.',
  },
];

export const Phase6LostSequence: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedChallenge, setSelectedChallenge] = useState<SequenceChallenge | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const pickChallenge = () => {
    const rand = CHALLENGES_POOL[Math.floor(Math.random() * CHALLENGES_POOL.length)];
    // Shuffle options
    const shuffledOptions = [...rand.options].sort(() => 0.5 - Math.random());
    setSelectedChallenge({
      ...rand,
      options: shuffledOptions,
    });
  };

  useEffect(() => {
    pickChallenge();
    startTimeRef.current = Date.now();
  }, [currentRound]);

  const handleOptionClick = (val: string | number) => {
    if (!selectedChallenge) return;
    sounds.playClick();

    if (String(val) === String(selectedChallenge.correctAnswer)) {
      sounds.playCorrect();
      if (currentRound < 2) {
        setTimeout(() => {
          setCurrentRound((r) => r + 1);
        }, 500);
      } else {
        const timeTaken = (Date.now() - startTimeRef.current) / 1000;
        const speedBonus = timeTaken < 20 ? 50 : 25;
        onSuccess(3, speedBonus, 100);
      }
    } else {
      sounds.playError();
      onError(20, `Observe a regra da sequência! Dica: ${selectedChallenge.ruleHint}`);
    }
  };

  if (!selectedChallenge) return null;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto w-full">
      {/* Round Info */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <span className="text-cyan-400">DESAFIO LÓGICO {currentRound} DE 2</span>
        <span className="text-slate-600">·</span>
        <span>Descubra o padrão oculto</span>
      </div>

      {/* Sequence Board */}
      <div className="w-full p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        {selectedChallenge.terms.map((term, idx) => {
          const isMissing = idx === selectedChallenge.missingIndex;
          return (
            <div
              key={idx}
              className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl flex flex-col items-center justify-center text-xl sm:text-2xl font-bold font-mono transition-all ${
                isMissing
                  ? 'bg-amber-950/40 border-2 border-amber-400 text-amber-300 animate-pulse shadow-lg shadow-amber-950/50'
                  : 'bg-slate-900 border border-slate-700/80 text-white'
              }`}
            >
              {term}
              {isMissing && <span className="text-[9px] text-amber-400 font-sans mt-0.5">FALTA</span>}
            </div>
          );
        })}
      </div>

      {/* Options */}
      <div className="w-full space-y-3">
        <div className="text-xs text-slate-400 text-center">
          Qual valor preenche a interrogação <span className="text-amber-400 font-bold">[ ? ]</span> ?
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {selectedChallenge.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleOptionClick(opt)}
              className="py-4 px-4 rounded-xl bg-slate-900 hover:bg-cyan-950 hover:border-cyan-400 border border-slate-700/80 text-white font-mono font-bold text-xl sm:text-2xl transition-all shadow-md active:scale-95"
              aria-label={`Opção ${opt}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
