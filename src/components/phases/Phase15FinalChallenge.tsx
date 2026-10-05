import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Cpu, Key, Lock, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

export const Phase15FinalChallenge: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const startTimeRef = useRef<number>(Date.now());

  // Subsystem 1: Sequence Memory (▲ ★ ■ ●)
  const [seq1Input, setSeq1Input] = useState<string[]>([]);
  const [isSeq1Memorizing, setIsSeq1Memorizing] = useState(true);
  const [seq1Count, setSeq1Count] = useState(3);
  const targetSeq1 = ['▲', '★', '■', '●'];

  // Subsystem 2: Pattern Anomaly
  // 5 numbers: 10, 20, 30, 45, 50 (45 breaks the multiples of 10)

  // Subsystem 3: Selective Detail
  // Find the exact IP / Security string "COD-905" among 4 similar ones ("COD-902", "COD-905", "COD-950", "COD-805")

  // Subsystem 4: Master Cipher
  // ⭐ = 3, 🔷 = 8. Código: ⭐ + 🔷 = ? (11)

  // Subsystem 5: Master Authorization Lock
  // Enter final code "2026"

  // Stage 1 Memorize Countdown
  useEffect(() => {
    if (stage !== 1 || !isSeq1Memorizing) return;
    const timer = setInterval(() => {
      setSeq1Count((c) => {
        if (c <= 1) {
          clearInterval(timer);
          setIsSeq1Memorizing(false);
          sounds.playUnlock();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [stage, isSeq1Memorizing]);

  const handleSeq1Symbol = (sym: string) => {
    sounds.playClick();
    const updated = [...seq1Input, sym];
    setSeq1Input(updated);

    const idx = updated.length - 1;
    if (sym !== targetSeq1[idx]) {
      sounds.playError();
      onError(20, 'Sequência incorreta! Tente reproduzir na ordem exata.');
      setTimeout(() => setSeq1Input([]), 500);
      return;
    }

    if (updated.length === targetSeq1.length) {
      sounds.playCorrect();
      setTimeout(() => setStage(2), 600);
    }
  };

  const handleStage2Click = (val: number) => {
    sounds.playClick();
    if (val === 45) {
      sounds.playCorrect();
      setTimeout(() => setStage(3), 600);
    } else {
      sounds.playError();
      onError(20, 'Observe: todos os outros números terminam em zero (múltiplos de 10).');
    }
  };

  const handleStage3Click = (code: string) => {
    sounds.playClick();
    if (code === 'COD-905') {
      sounds.playCorrect();
      setTimeout(() => setStage(4), 600);
    } else {
      sounds.playError();
      onError(20, 'Atenção aos detalhes! Não confunda os dígitos 0, 5 e 9.');
    }
  };

  const handleStage4Click = (ans: number) => {
    sounds.playClick();
    if (ans === 11) {
      sounds.playCorrect();
      setTimeout(() => setStage(5), 600);
    } else {
      sounds.playError();
      onError(20, '⭐ (3) + 🔷 (8) = 11.');
    }
  };

  const handleStage5Complete = () => {
    sounds.playVictory();
    const timeTaken = (Date.now() - startTimeRef.current) / 1000;
    const speedBonus = timeTaken < 45 ? 50 : 25;
    onSuccess(3, speedBonus, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto w-full">
      {/* 5-Module Restoration Progress Header */}
      <div className="w-full p-4 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-display font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            RESTAURAÇÃO DO NÚCLEO CENTRAL
          </span>
          <span className="text-xs font-mono-numbers text-cyan-300 font-bold">
            Módulo {stage} de 5
          </span>
        </div>

        {/* 5 Status LEDs */}
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((m) => {
            const isDone = stage > m;
            const isCurrent = stage === m;
            return (
              <div
                key={m}
                className={`py-1.5 px-2 rounded-lg text-center text-[10px] font-mono font-bold transition-all border ${
                  isDone
                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                    : isCurrent
                    ? 'bg-amber-950/80 border-amber-400 text-amber-200 animate-pulse'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                MOD-0{m} {isDone ? '✓' : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* STAGE 1: Sequence Memory */}
      {stage === 1 && (
        <div className="w-full p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4 animate-in fade-in">
          <div className="text-xs font-semibold text-cyan-400">
            ETAPA 1: CHAVE DE RESTAURAÇÃO CRIPTOGRÁFICA
          </div>

          {isSeq1Memorizing ? (
            <div className="space-y-3">
              <div className="text-xs text-amber-300">
                Memorize os 4 símbolos na ordem: ({seq1Count}s)
              </div>
              <div className="flex justify-center gap-3">
                {targetSeq1.map((s, i) => (
                  <div key={i} className="w-14 h-16 rounded-xl bg-slate-900 border border-cyan-400 text-2xl flex items-center justify-center font-bold text-cyan-300">
                    {s}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-300">
                Repita a chave de 4 símbolos na mesma ordem ({seq1Input.length}/4):
              </div>
              <div className="flex justify-center gap-2 mb-3">
                {targetSeq1.map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-lg border border-dashed border-slate-700 flex items-center justify-center text-lg font-bold text-white bg-slate-900">
                    {seq1Input[i] || ''}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-3">
                {['▲', '●', '■', '★'].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => handleSeq1Symbol(sym)}
                    className="w-14 h-14 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-2xl text-white active:scale-95"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 2: Pattern Hunt */}
      {stage === 2 && (
        <div className="w-full p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4 animate-in fade-in">
          <div className="text-xs font-semibold text-cyan-400">
            ETAPA 2: ISOLAR O NÚMERO ANÔMALO DO SISTEMA
          </div>
          <div className="text-xs text-slate-300">
            Qual destes pacotes quebra a regra de múltiplos de 10?
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            {[10, 20, 30, 45, 50].map((num) => (
              <button
                key={num}
                onClick={() => handleStage2Click(num)}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 font-mono font-bold text-xl text-white active:scale-95"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STAGE 3: Selective Detail (COD-905) */}
      {stage === 3 && (
        <div className="w-full p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4 animate-in fade-in">
          <div className="text-xs font-semibold text-cyan-400">
            ETAPA 3: PERCEPÇÃO MINUCIOSA DE DETALHES
          </div>
          <div className="text-xs text-slate-300">
            Encontre a chave de transmissão exata: <strong className="text-amber-400 font-mono text-sm">COD-905</strong>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {['COD-902', 'COD-950', 'COD-905', 'COD-805'].map((code) => (
              <button
                key={code}
                onClick={() => handleStage3Click(code)}
                className="py-3.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 font-mono font-bold text-sm sm:text-base text-white active:scale-95"
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STAGE 4: Master Cipher */}
      {stage === 4 && (
        <div className="w-full p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4 animate-in fade-in">
          <div className="text-xs font-semibold text-cyan-400">
            ETAPA 4: RESOLVER EQUAÇÃO CRIPTOGRÁFICA
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-center gap-6 text-sm font-semibold">
            <span>⭐ = 3</span>
            <span className="text-slate-600">·</span>
            <span>🔷 = 8</span>
          </div>
          <div className="text-base sm:text-lg font-bold text-white">
            Quanto vale: ⭐ + 🔷 = ?
          </div>
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {[9, 11, 12].map((num) => (
              <button
                key={num}
                onClick={() => handleStage4Click(num)}
                className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 font-mono font-bold text-xl text-white active:scale-95"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STAGE 5: Final Authorization */}
      {stage === 5 && (
        <div className="w-full p-6 sm:p-8 rounded-2xl bg-slate-950 border-2 border-emerald-500/50 text-center space-y-5 animate-in fade-in shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-display font-extrabold text-white">
              TODOS OS SUBSISTEMAS ESTABILIZADOS!
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Resta apenas a autorização manual do Agente para reativar o Centro de Comando em potência máxima.
            </p>
          </div>

          <button
            onClick={handleStage5Complete}
            className="py-4 px-8 rounded-xl font-display font-extrabold text-base bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 mx-auto active:scale-95"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>RESTAURAR CENTRO DE COMANDO</span>
          </button>
        </div>
      )}
    </div>
  );
};
