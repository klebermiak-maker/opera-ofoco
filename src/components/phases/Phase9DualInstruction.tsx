import React, { useState, useEffect, useRef } from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

interface DualItem {
  id: number;
  value: number;
  isEven: boolean;
  shape: 'circle' | 'square' | 'triangle';
  shapeName: string;
  isTarget: boolean;
  isClicked: boolean;
}

export const Phase9DualInstruction: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [items, setItems] = useState<DualItem[]>([]);
  const [targetsFound, setTargetsFound] = useState(0);
  const totalTargetsCount = 4;
  const startTimeRef = useRef<number>(Date.now());

  const initGame = () => {
    const list: DualItem[] = [];

    // 1. Add 4 targets: EVEN number inside CIRCLE
    const evenPool = [2, 4, 6, 8, 12, 14, 16, 18].sort(() => 0.5 - Math.random());
    for (let i = 0; i < totalTargetsCount; i++) {
      list.push({
        id: Math.random(),
        value: evenPool[i],
        isEven: true,
        shape: 'circle',
        shapeName: 'Círculo',
        isTarget: true,
        isClicked: false,
      });
    }

    // 2. Add Distractors:
    // a) Even numbers inside Squares (wrong shape)
    list.push({ id: Math.random(), value: 4, isEven: true, shape: 'square', shapeName: 'Quadrado', isTarget: false, isClicked: false });
    list.push({ id: Math.random(), value: 10, isEven: true, shape: 'square', shapeName: 'Quadrado', isTarget: false, isClicked: false });
    list.push({ id: Math.random(), value: 8, isEven: true, shape: 'triangle', shapeName: 'Triângulo', isTarget: false, isClicked: false });

    // b) Odd numbers inside Circles (wrong number)
    list.push({ id: Math.random(), value: 3, isEven: false, shape: 'circle', shapeName: 'Círculo', isTarget: false, isClicked: false });
    list.push({ id: Math.random(), value: 7, isEven: false, shape: 'circle', shapeName: 'Círculo', isTarget: false, isClicked: false });
    list.push({ id: Math.random(), value: 9, isEven: false, shape: 'circle', shapeName: 'Círculo', isTarget: false, isClicked: false });

    // c) Odd numbers inside Squares & Triangles
    list.push({ id: Math.random(), value: 5, isEven: false, shape: 'square', shapeName: 'Quadrado', isTarget: false, isClicked: false });
    list.push({ id: Math.random(), value: 11, isEven: false, shape: 'triangle', shapeName: 'Triângulo', isTarget: false, isClicked: false });

    setItems(list.sort(() => 0.5 - Math.random()));
    setTargetsFound(0);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleItemClick = (item: DualItem, index: number) => {
    if (item.isClicked) return;

    sounds.playClick();
    if (item.isTarget) {
      sounds.playCorrect();
      const updated = [...items];
      updated[index] = { ...item, isClicked: true };
      setItems(updated);

      const count = targetsFound + 1;
      setTargetsFound(count);

      if (count === totalTargetsCount) {
        const timeTaken = (Date.now() - startTimeRef.current) / 1000;
        const speedBonus = timeTaken < 15 ? 50 : 25;
        onSuccess(3, speedBonus, 100);
      }
    } else {
      sounds.playError();
      if (!item.isEven && item.shape === 'circle') {
        onError(20, `Atenção: o número ${item.value} está num círculo, mas é ÍMPAR! Procure números PARES.`);
      } else if (item.isEven && item.shape !== 'circle') {
        onError(20, `Atenção: o número ${item.value} é par, mas está dentro de um ${item.shapeName}! Apenas dentro de CÍRCULOS.`);
      } else {
        onError(20, `Atenção: nem o formato (${item.shapeName}) nem a paridade (${item.value} é ímpar) cumprem a regra dupla!`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto w-full">
      {/* Dual Condition Banner */}
      <div className="w-full p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              REGRA COMPOSTA (2 CONDIÇÕES)
            </div>
            <div className="text-sm sm:text-base font-bold text-white">
              Clique nos <span className="text-cyan-400">NÚMEROS PARES</span> que estiverem dentro de <span className="text-emerald-400">CÍRCULOS</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-slate-400">Encontrados</div>
          <div className="font-mono-numbers font-bold text-base sm:text-lg text-emerald-400">
            {targetsFound} / {totalTargetsCount}
          </div>
        </div>
      </div>

      {/* Grid of Dual Condition Items */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
        {items.map((item, idx) => {
          let shapeBorderClass = 'rounded-full border-sky-500/50 bg-sky-950/30';
          if (item.shape === 'square') {
            shapeBorderClass = 'rounded-xl border-amber-500/50 bg-amber-950/30';
          } else if (item.shape === 'triangle') {
            shapeBorderClass = 'rounded-t-3xl rounded-b-md border-rose-500/50 bg-rose-950/30';
          }

          return (
            <button
              key={item.id}
              disabled={item.isClicked}
              onClick={() => handleItemClick(item, idx)}
              className={`h-20 sm:h-24 border-2 flex flex-col items-center justify-center transition-all ${shapeBorderClass} ${
                item.isClicked
                  ? 'opacity-40 cursor-default ring-2 ring-emerald-500'
                  : 'hover:scale-105 active:scale-95 cursor-pointer shadow-md'
              }`}
              aria-label={`Número ${item.value} dentro de ${item.shapeName}`}
            >
              {item.isClicked ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              ) : (
                <>
                  <span className="font-mono font-bold text-2xl text-white">
                    {item.value}
                  </span>
                  <span className="text-[10px] text-slate-300 font-medium">
                    {item.shapeName}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
