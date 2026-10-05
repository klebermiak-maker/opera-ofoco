import React, { useState, useEffect, useRef } from 'react';
import { Eye, Target, Brain, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

export const Phase14SuperConcentration: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const startTimeRef = useRef<number>(Date.now());

  // Step 1: Memory
  const [isMemStep1, setIsMemStep1] = useState(true);
  const [countdownStep1, setCountdownStep1] = useState(3);
  const [selectedStep1, setSelectedStep1] = useState<string[]>([]);
  const targetStep1 = ['🔑', '🛡️', '⚡'];

  // Step 2: Selective Filter
  // Find the single '🔵' amidst 15 '🔷'
  const [step2Found, setStep2Found] = useState(false);

  // Step 3: Logic
  // 12 -> 24 -> 48 -> ? (96)

  // Step 1 Countdown
  useEffect(() => {
    if (step !== 1 || !isMemStep1) return;
    const interval = setInterval(() => {
      setCountdownStep1((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setIsMemStep1(false);
          sounds.playUnlock();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, isMemStep1]);

  // Handle Step 1 Selection
  const handleStep1Select = (sym: string) => {
    sounds.playClick();
    if (selectedStep1.includes(sym)) return;

    if (!targetStep1.includes(sym)) {
      sounds.playError();
      onError(20, 'Este símbolo não fazia parte do trio memorizado!');
      return;
    }

    const updated = [...selectedStep1, sym];
    setSelectedStep1(updated);

    if (updated.length === targetStep1.length) {
      sounds.playCorrect();
      setTimeout(() => {
        setStep(2);
      }, 600);
    }
  };

  // Handle Step 2 Target
  const handleStep2Click = (isTarget: boolean) => {
    sounds.playClick();
    if (isTarget) {
      sounds.playCorrect();
      setStep2Found(true);
      setTimeout(() => {
        setStep(3);
      }, 600);
    } else {
      sounds.playError();
      onError(20, 'Atenção seletiva! Procure o Círculo Azul (🔵), ignore os Losangos (🔷).');
    }
  };

  // Handle Step 3
  const handleStep3Click = (val: number) => {
    sounds.playClick();
    if (val === 96) {
      sounds.playCorrect();
      const timeTaken = (Date.now() - startTimeRef.current) / 1000;
      const speedBonus = timeTaken < 30 ? 50 : 25;
      onSuccess(3, speedBonus, 100);
    } else {
      sounds.playError();
      onError(20, 'Observe o padrão: cada valor é o DOBRO do anterior (12 x 2 = 24, 24 x 2 = 48, 48 x 2 = ?).');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 max-w-xl mx-auto w-full">
      {/* 3 Step Stepper */}
      <div className="w-full flex items-center justify-between text-xs font-semibold px-2">
        {[
          { num: 1, label: 'Memória' },
          { num: 2, label: 'Atenção Seletiva' },
          { num: 3, label: 'Lógica Pura' },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-1.5 ${
              step === s.num
                ? 'text-cyan-400 font-bold'
                : step > s.num
                ? 'text-emerald-400'
                : 'text-slate-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${
                step === s.num
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : step > s.num
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Memory */}
      {step === 1 && (
        <div className="w-full p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4 animate-in fade-in">
          {isMemStep1 ? (
            <div className="space-y-3">
              <div className="text-xs text-cyan-400 font-semibold flex items-center justify-center gap-1.5">
                <Eye className="w-4 h-4 animate-pulse" />
                <span>MEMORIZE O TRIO DE ACESSO! Ocultando em {countdownStep1}s</span>
              </div>
              <div className="flex justify-center gap-4">
                {targetStep1.map((s, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-2xl bg-slate-900 border border-cyan-500/40 text-3xl flex items-center justify-center shadow-lg"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-slate-300">
                Selecione os 3 símbolos que você memorizou: ({selectedStep1.length}/3)
              </div>
              <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
                {['🔑', '📡', '🛡️', '💾', '⚡'].map((sym) => {
                  const isPicked = selectedStep1.includes(sym);
                  return (
                    <button
                      key={sym}
                      disabled={isPicked}
                      onClick={() => handleStep1Select(sym)}
                      className={`h-14 rounded-xl border text-2xl flex items-center justify-center transition-all ${
                        isPicked
                          ? 'bg-emerald-950 border-emerald-400 opacity-50'
                          : 'bg-slate-900 border-slate-700 hover:border-cyan-400 active:scale-95'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Selective Filter */}
      {step === 2 && (
        <div className="w-full p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4 animate-in fade-in">
          <div className="text-xs text-cyan-400 font-semibold flex items-center justify-center gap-1.5">
            <Target className="w-4 h-4" />
            <span>ENCONTRE O ÚNICO CÍRCULO AZUL (🔵) EM MEIO AOS LOSANGOS (🔷)</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-w-md mx-auto">
            {Array.from({ length: 18 }).map((_, i) => {
              const isTarget = i === 11;
              return (
                <button
                  key={i}
                  onClick={() => handleStep2Click(isTarget)}
                  className="h-12 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 text-2xl flex items-center justify-center active:scale-95 transition-all"
                >
                  {isTarget ? '🔵' : '🔷'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: Logic Sequence */}
      {step === 3 && (
        <div className="w-full p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4 animate-in fade-in">
          <div className="text-xs text-amber-400 font-semibold flex items-center justify-center gap-1.5">
            <Brain className="w-4 h-4" />
            <span>DEGRAU FINAL: COMPLETE A PROGRESSÃO DOBRADA</span>
          </div>

          <div className="flex items-center justify-center gap-3 font-mono font-bold text-xl sm:text-2xl text-white">
            <span className="p-3 rounded-xl bg-slate-900 border border-slate-800">12</span>
            <span>→</span>
            <span className="p-3 rounded-xl bg-slate-900 border border-slate-800">24</span>
            <span>→</span>
            <span className="p-3 rounded-xl bg-slate-900 border border-slate-800">48</span>
            <span>→</span>
            <span className="p-3 rounded-xl bg-amber-950/50 border border-amber-400 text-amber-300 animate-pulse">
              ?
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto pt-2">
            {[72, 84, 96].map((num) => (
              <button
                key={num}
                onClick={() => handleStep3Click(num)}
                className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 font-mono font-bold text-xl text-white active:scale-95 shadow-md"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
