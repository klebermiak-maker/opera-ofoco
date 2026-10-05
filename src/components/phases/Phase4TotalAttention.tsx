import React, { useState, useEffect, useRef } from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

interface Item {
  id: number;
  shape: 'circle' | 'square' | 'triangle' | 'star';
  color: 'blue' | 'red' | 'green' | 'yellow';
  shapeChar: string;
  shapeName: string;
  colorName: string;
  colorClass: string;
  isTarget: boolean;
  isClicked: boolean;
}

export const Phase4TotalAttention: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [targetRule, setTargetRule] = useState<{
    shape: string;
    color: string;
    shapeName: string;
    colorName: string;
    char: string;
    colorClass: string;
    totalTargets: number;
  }>({
    shape: 'circle',
    color: 'blue',
    shapeName: 'Círculos',
    colorName: 'Azuis',
    char: '●',
    colorClass: 'text-sky-400',
    totalTargets: 5,
  });

  const [clickedTargetCount, setClickedTargetCount] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  const initGame = () => {
    // Generate random target criteria
    const targetConfigs = [
      { shape: 'circle', color: 'blue', shapeName: 'Círculos', colorName: 'Azuis', char: '●', colorClass: 'text-sky-400' },
      { shape: 'triangle', color: 'green', shapeName: 'Triângulos', colorName: 'Verdes', char: '▲', colorClass: 'text-emerald-400' },
      { shape: 'square', color: 'yellow', shapeName: 'Quadrados', colorName: 'Amarelos', char: '■', colorClass: 'text-amber-400' },
      { shape: 'star', color: 'red', shapeName: 'Estrelas', colorName: 'Vermelhas', char: '★', colorClass: 'text-rose-400' },
    ];

    const chosenTarget = targetConfigs[Math.floor(Math.random() * targetConfigs.length)];
    const shapes = [
      { type: 'circle', char: '●', name: 'Círculo' },
      { type: 'square', char: '■', name: 'Quadrado' },
      { type: 'triangle', char: '▲', name: 'Triângulo' },
      { type: 'star', char: '★', name: 'Estrela' },
    ] as const;

    const colors = [
      { type: 'blue', name: 'Azul', class: 'text-sky-400' },
      { type: 'red', name: 'Vermelho', class: 'text-rose-400' },
      { type: 'green', name: 'Verde', class: 'text-emerald-400' },
      { type: 'yellow', name: 'Amarelo', class: 'text-amber-400' },
    ] as const;

    const gridItems: Item[] = [];
    const targetCount = 6;

    // 1. Add targets
    for (let i = 0; i < targetCount; i++) {
      gridItems.push({
        id: Math.random(),
        shape: chosenTarget.shape as any,
        color: chosenTarget.color as any,
        shapeChar: chosenTarget.char,
        shapeName: chosenTarget.shapeName,
        colorName: chosenTarget.colorName,
        colorClass: chosenTarget.colorClass,
        isTarget: true,
        isClicked: false,
      });
    }

    // 2. Add 14 distractors (same color different shape, same shape different color, different both)
    for (let i = 0; i < 14; i++) {
      let randShape = shapes[Math.floor(Math.random() * shapes.length)];
      let randColor = colors[Math.floor(Math.random() * colors.length)];

      // Ensure it's not by chance the exact target
      while (randShape.type === chosenTarget.shape && randColor.type === chosenTarget.color) {
        randShape = shapes[Math.floor(Math.random() * shapes.length)];
        randColor = colors[Math.floor(Math.random() * colors.length)];
      }

      gridItems.push({
        id: Math.random(),
        shape: randShape.type,
        color: randColor.type,
        shapeChar: randShape.char,
        shapeName: randShape.name,
        colorName: randColor.name,
        colorClass: randColor.class,
        isTarget: false,
        isClicked: false,
      });
    }

    // Shuffle
    const shuffled = gridItems.sort(() => 0.5 - Math.random());
    setItems(shuffled);
    setTargetRule({
      ...chosenTarget,
      totalTargets: targetCount,
    });
    setClickedTargetCount(0);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleItemClick = (item: Item, index: number) => {
    if (item.isClicked) return;

    sounds.playClick();
    if (item.isTarget) {
      sounds.playCorrect();
      const updated = [...items];
      updated[index] = { ...item, isClicked: true };
      setItems(updated);

      const newCount = clickedTargetCount + 1;
      setClickedTargetCount(newCount);

      if (newCount === targetRule.totalTargets) {
        const timeTaken = (Date.now() - startTimeRef.current) / 1000;
        const speedBonus = timeTaken < 15 ? 50 : 25;
        onSuccess(3, speedBonus, 100);
      }
    } else {
      sounds.playError();
      onError(20, `Atenção! Você clicou em um ${item.shapeName} ${item.colorName}. Procure apenas ${targetRule.shapeName} ${targetRule.colorName}.`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Target Mission Callout */}
      <div className="w-full max-w-xl p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              ALVO DE ATENÇÃO SELETIVA
            </div>
            <div className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
              <span>Clique somente nos</span>
              <span className={`font-extrabold ${targetRule.colorClass}`}>
                {targetRule.shapeName} {targetRule.colorName} ({targetRule.char})
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-slate-400">Progresso</div>
          <div className="font-mono-numbers font-bold text-base sm:text-lg text-emerald-400">
            {clickedTargetCount} / {targetRule.totalTargets}
          </div>
        </div>
      </div>

      {/* Grid of 20 items (5x4) */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-w-xl w-full">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item, idx)}
            disabled={item.isClicked}
            className={`h-16 sm:h-20 rounded-xl border flex flex-col items-center justify-center transition-all ${
              item.isClicked
                ? 'bg-emerald-950/40 border-emerald-500/40 opacity-50 cursor-default'
                : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:bg-slate-900 active:scale-95 cursor-pointer'
            }`}
            aria-label={`${item.shapeName} ${item.colorName}`}
          >
            {item.isClicked ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            ) : (
              <>
                <span className={`text-2xl sm:text-3xl font-bold leading-none ${item.colorClass}`}>
                  {item.shapeChar}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  {item.colorName.slice(0, 3)}
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
