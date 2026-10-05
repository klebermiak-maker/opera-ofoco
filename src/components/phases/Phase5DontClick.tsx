import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

type StimulusType = 'GO' | 'NOGO' | 'NEUTRAL';

interface Trial {
  type: StimulusType;
  symbol: string;
  name: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

const TRIALS_SEQUENCE: Trial[] = [
  { type: 'GO', symbol: '●', name: 'Círculo Azul', colorClass: 'text-sky-400', bgClass: 'bg-sky-950/40', borderClass: 'border-sky-500/40' },
  { type: 'GO', symbol: '●', name: 'Círculo Azul', colorClass: 'text-sky-400', bgClass: 'bg-sky-950/40', borderClass: 'border-sky-500/40' },
  { type: 'NOGO', symbol: '■', name: 'Quadrado Vermelho', colorClass: 'text-rose-500', bgClass: 'bg-rose-950/40', borderClass: 'border-rose-500/50' },
  { type: 'GO', symbol: '●', name: 'Círculo Azul', colorClass: 'text-sky-400', bgClass: 'bg-sky-950/40', borderClass: 'border-sky-500/40' },
  { type: 'NEUTRAL', symbol: '▲', name: 'Triângulo Verde', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-950/40', borderClass: 'border-emerald-500/30' },
  { type: 'NOGO', symbol: '■', name: 'Quadrado Vermelho', colorClass: 'text-rose-500', bgClass: 'bg-rose-950/40', borderClass: 'border-rose-500/50' },
  { type: 'GO', symbol: '●', name: 'Círculo Azul', colorClass: 'text-sky-400', bgClass: 'bg-sky-950/40', borderClass: 'border-sky-500/40' },
  { type: 'GO', symbol: '●', name: 'Círculo Azul', colorClass: 'text-sky-400', bgClass: 'bg-sky-950/40', borderClass: 'border-sky-500/40' },
];

export const Phase5DontClick: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [trialIndex, setTrialIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasActedThisTrial, setHasActedThisTrial] = useState(false);
  const [trialFeedback, setTrialFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [successfulTrials, setSuccessfulTrials] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    sounds.playClick();
    setIsPlaying(true);
    setTrialIndex(0);
    setSuccessfulTrials(0);
    setHasActedThisTrial(false);
    setTrialFeedback(null);
  };

  useEffect(() => {
    if (!isPlaying || trialIndex < 0) return;

    if (trialIndex >= TRIALS_SEQUENCE.length) {
      // Completed sequence
      setIsPlaying(false);
      sounds.playVictory();
      onSuccess(3, 50, 100);
      return;
    }

    setHasActedThisTrial(false);
    setTrialFeedback(null);

    // Each trial lasts 1800ms
    timeoutRef.current = setTimeout(() => {
      const currentTrial = TRIALS_SEQUENCE[trialIndex];
      // Evaluate end of window if player didn't act
      if (!hasActedThisTrial) {
        if (currentTrial.type === 'GO') {
          // Missed a GO
          sounds.playError();
          onError(20, 'Tempo esgotado! Você deveria ter clicado no Círculo Azul.');
        } else {
          // Successfully inhibited on NOGO or NEUTRAL!
          setSuccessfulTrials((prev) => prev + 1);
        }
      }

      // Advance to next trial after a brief blank gap
      setTrialIndex((prev) => prev + 1);
    }, 1800);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [trialIndex, isPlaying]);

  const handlePlayerAction = () => {
    if (!isPlaying || trialIndex < 0 || trialIndex >= TRIALS_SEQUENCE.length || hasActedThisTrial) return;

    setHasActedThisTrial(true);
    const currentTrial = TRIALS_SEQUENCE[trialIndex];

    if (currentTrial.type === 'GO') {
      // Correct action!
      sounds.playCorrect();
      setTrialFeedback('correct');
      setSuccessfulTrials((prev) => prev + 1);
    } else {
      // Impulsivity error! Clicked on NOGO
      sounds.playError();
      setTrialFeedback('wrong');
      onError(20, `Cuidado com o impulso! O sinal era ${currentTrial.name}. A regra é: NÃO CLIQUE no sinal proibido!`);
    }
  };

  const currentTrial = trialIndex >= 0 && trialIndex < TRIALS_SEQUENCE.length ? TRIALS_SEQUENCE[trialIndex] : null;

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Rule Bar */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/40 flex items-center gap-2">
          <span className="text-2xl text-sky-400">●</span>
          <div className="text-xs">
            <span className="font-bold text-sky-300 block">CÍRCULO AZUL</span>
            <span className="text-slate-300">CLIQUE RÁPIDO!</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center gap-2">
          <span className="text-2xl text-rose-500">■</span>
          <div className="text-xs">
            <span className="font-bold text-rose-300 block">QUADRADO VERMELHO</span>
            <span className="text-slate-300">NÃO CLIQUE! ESPERE!</span>
          </div>
        </div>
      </div>

      {/* Main Stimulus Screen */}
      <div className="w-full max-w-lg h-60 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
        {!isPlaying ? (
          <div className="text-center space-y-4 p-6">
            <ShieldAlert className="w-12 h-12 text-cyan-400 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Teste de Controle Inibitório e Reflexos
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Os símbolos surgirão rapidamente. Mantenha os olhos na tela e controle seu impulso de clicar!
              </p>
            </div>
            <button
              onClick={startTest}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20"
            >
              INICIAR SEQUÊNCIA
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            {currentTrial ? (
              <div
                className={`w-32 h-32 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                  currentTrial.bgClass
                } ${currentTrial.borderClass} ${
                  trialFeedback === 'correct' ? 'ring-4 ring-emerald-500' : ''
                } ${trialFeedback === 'wrong' ? 'ring-4 ring-rose-500' : ''}`}
              >
                <span className={`text-6xl font-bold leading-none ${currentTrial.colorClass}`}>
                  {currentTrial.symbol}
                </span>
                <span className="text-xs font-semibold text-slate-300 mt-2">
                  {currentTrial.name}
                </span>
              </div>
            ) : (
              <div className="text-slate-500 text-sm">Carregando sinal...</div>
            )}

            <div className="text-[11px] text-slate-400 font-mono">
              Sinal {trialIndex + 1} de {TRIALS_SEQUENCE.length}
            </div>
          </div>
        )}
      </div>

      {/* Large Big Action Button */}
      {isPlaying && (
        <button
          onClick={handlePlayerAction}
          disabled={hasActedThisTrial}
          className={`w-full max-w-lg py-5 px-6 rounded-2xl font-display font-extrabold text-lg sm:text-xl tracking-wider transition-all shadow-xl flex items-center justify-center gap-3 ${
            hasActedThisTrial
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 border-2 border-cyan-300 shadow-cyan-500/30'
          }`}
          aria-label="Registrar Ação"
        >
          <Zap className="w-6 h-6 fill-current" />
          <span>{hasActedThisTrial ? 'RESPOSTA REGISTRADA' : 'CLIQUE AQUI (SE AUTORIZADO)!'}</span>
        </button>
      )}
    </div>
  );
};
