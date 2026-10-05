import React, { useState, useEffect, useRef } from 'react';
import { KeyRound, Delete, Check } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

interface CipherMapping {
  symbol: string;
  name: string;
  digit: number;
  colorClass: string;
}

const CIPHER_MAP: CipherMapping[] = [
  { symbol: '●', name: 'Círculo Azul', digit: 4, colorClass: 'text-sky-400' },
  { symbol: '▲', name: 'Triângulo Vermelho', digit: 7, colorClass: 'text-rose-400' },
  { symbol: '★', name: 'Estrela Amarela', digit: 2, colorClass: 'text-amber-400' },
  { symbol: '◆', name: 'Losango Ciano', digit: 9, colorClass: 'text-cyan-400' },
  { symbol: '■', name: 'Quadrado Verde', digit: 5, colorClass: 'text-emerald-400' },
];

export const Phase11CodeDetective: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [round, setRound] = useState(1);
  const [cipherSequence, setCipherSequence] = useState<CipherMapping[]>([]);
  const [expectedDigits, setExpectedDigits] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  const generateCode = (length: number) => {
    const seq: CipherMapping[] = [];
    const digits: number[] = [];
    for (let i = 0; i < length; i++) {
      const pick = CIPHER_MAP[Math.floor(Math.random() * CIPHER_MAP.length)];
      seq.push(pick);
      digits.push(pick.digit);
    }
    setCipherSequence(seq);
    setExpectedDigits(digits);
    setPlayerInput([]);
  };

  useEffect(() => {
    generateCode(round === 1 ? 3 : 4);
    startTimeRef.current = Date.now();
  }, [round]);

  const handleDigitPress = (digit: number) => {
    if (playerInput.length >= expectedDigits.length) return;
    sounds.playClick();

    const newInput = [...playerInput, digit];
    setPlayerInput(newInput);

    // If completed code
    if (newInput.length === expectedDigits.length) {
      const isCorrect = newInput.every((val, idx) => val === expectedDigits[idx]);

      if (isCorrect) {
        sounds.playCorrect();
        if (round < 2) {
          setTimeout(() => setRound(2), 700);
        } else {
          const timeTaken = (Date.now() - startTimeRef.current) / 1000;
          const speedBonus = timeTaken < 20 ? 50 : 25;
          onSuccess(3, speedBonus, 100);
        }
      } else {
        sounds.playError();
        onError(20, 'Código incorreto! Verifique a correspondência de cada símbolo na tabela de chaves.');
        setTimeout(() => setPlayerInput([]), 600);
      }
    }
  };

  const handleBackspace = () => {
    if (playerInput.length === 0) return;
    sounds.playClick();
    setPlayerInput((prev) => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 max-w-xl mx-auto w-full">
      {/* Header Info */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
        <span className="text-cyan-400">DESCRIPTOGRAFIA {round} DE 2</span>
        <span className="text-slate-600">·</span>
        <span>Decodificação Simbólica</span>
      </div>

      {/* Legend / Cipher Key Table */}
      <div className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center mb-3">
          TABELA DE CORRESPONDÊNCIA CRIPTOGRÁFICA
        </div>
        <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
          {CIPHER_MAP.map((m) => (
            <div
              key={m.digit}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/60"
            >
              <span className={`text-xl font-bold leading-none ${m.colorClass}`}>
                {m.symbol}
              </span>
              <span className="text-slate-500 font-mono">=</span>
              <span className="font-mono font-bold text-white text-base">{m.digit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cipher Display to Decode */}
      <div className="w-full p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 text-center space-y-3">
        <div className="text-xs text-cyan-300 font-semibold">
          SEQUÊNCIA TRANSMITIDA:
        </div>
        <div className="flex items-center justify-center gap-4">
          {cipherSequence.map((item, idx) => (
            <div
              key={idx}
              className="w-14 h-16 rounded-xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center shadow-lg"
            >
              <span className={`text-3xl font-bold leading-none ${item.colorClass}`}>
                {item.symbol}
              </span>
            </div>
          ))}
        </div>

        {/* Player Input Slots */}
        <div className="pt-2 flex items-center justify-center gap-3">
          {expectedDigits.map((_, idx) => {
            const entered = playerInput[idx];
            return (
              <div
                key={idx}
                className={`w-12 h-12 rounded-xl font-mono font-bold text-2xl flex items-center justify-center border transition-all ${
                  entered !== undefined
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900/50 border-dashed border-slate-700 text-slate-600'
                }`}
              >
                {entered !== undefined ? entered : '_'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Keypad */}
      <div className="w-full max-w-xs space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleDigitPress(num)}
              className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xl active:scale-95 transition-all shadow-sm"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigitPress(0)}
            className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xl active:scale-95 transition-all shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-slate-900 hover:bg-rose-950 hover:border-rose-500/50 border border-slate-700 text-slate-300 hover:text-rose-300 flex items-center justify-center active:scale-95 transition-all shadow-sm"
            aria-label="Apagar dígito"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
