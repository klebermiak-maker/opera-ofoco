import React, { useState, useEffect, useRef } from 'react';
import { Eye, Shield, Key, Lock, Search, Cpu, Database, Compass } from 'lucide-react';
import { sounds } from '../../utils/audio';

interface PhaseProps {
  onSuccess: (stars: number, speedBonus: number, points: number) => void;
  onError: (penalty: number, message: string) => void;
}

interface CardItem {
  id: number;
  symbolId: string;
  iconName: string;
  label: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const AVAILABLE_SYMBOLS = [
  { id: 'key', label: 'Chave', color: 'text-amber-400', icon: Key },
  { id: 'lock', label: 'Trava', color: 'text-emerald-400', icon: Lock },
  { id: 'search', label: 'Lente', color: 'text-cyan-400', icon: Search },
  { id: 'shield', label: 'Escudo', color: 'text-sky-400', icon: Shield },
  { id: 'cpu', label: 'Chip', color: 'text-purple-400', icon: Cpu },
  { id: 'db', label: 'Dados', color: 'text-indigo-400', icon: Database },
];

export const Phase1MemoryCards: React.FC<PhaseProps> = ({ onSuccess, onError }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isMemorizing, setIsMemorizing] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [moves, setMoves] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize random 6 cards (3 pairs)
  const initGame = () => {
    // Pick 3 symbols randomly
    const shuffledSymbols = [...AVAILABLE_SYMBOLS].sort(() => 0.5 - Math.random()).slice(0, 3);
    const cardDeck: CardItem[] = [];

    shuffledSymbols.forEach((sym) => {
      // Pair item 1
      cardDeck.push({
        id: Math.random(),
        symbolId: sym.id,
        iconName: sym.id,
        label: sym.label,
        color: sym.color,
        isFlipped: true, // visible initially
        isMatched: false,
      });
      // Pair item 2
      cardDeck.push({
        id: Math.random(),
        symbolId: sym.id,
        iconName: sym.id,
        label: sym.label,
        color: sym.color,
        isFlipped: true,
        isMatched: false,
      });
    });

    const finalDeck = cardDeck.sort(() => 0.5 - Math.random());
    setCards(finalDeck);
    setSelectedCards([]);
    setIsMemorizing(true);
    setCountdown(3);
    setMoves(0);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    initGame();
  }, []);

  // Countdown for memorization phase
  useEffect(() => {
    if (!isMemorizing) return;
    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else {
      // Close all cards
      setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false })));
      setIsMemorizing(false);
      sounds.playUnlock();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown, isMemorizing]);

  const handleCardClick = (index: number) => {
    if (isMemorizing) return;
    const card = cards[index];
    if (card.isFlipped || card.isMatched || selectedCards.length >= 2) return;

    sounds.playClick();
    const newSelected = [...selectedCards, index];
    const newCards = [...cards];
    newCards[index] = { ...card, isFlipped: true };
    setCards(newCards);
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const firstIdx = newSelected[0];
      const secondIdx = newSelected[1];
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.symbolId === secondCard.symbolId) {
        // Matched!
        sounds.playCorrect();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setSelectedCards([]);

          // Check if all matched
          const remainingUnmatched = newCards.filter(
            (c, idx) => !c.isMatched && idx !== firstIdx && idx !== secondIdx
          ).length;

          if (remainingUnmatched === 0) {
            const timeTaken = (Date.now() - startTimeRef.current) / 1000;
            const speedBonus = timeTaken < 12 ? 50 : 25;
            const stars = moves <= 4 ? 3 : moves <= 6 ? 2 : 1;
            onSuccess(stars, speedBonus, 100);
          }
        }, 300);
      } else {
        // Not a match
        sounds.playError();
        onError(20, 'Observe novamente. Memorize a localização antes de virar.');
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, idx) =>
              idx === firstIdx || idx === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  const renderIcon = (id: string, color: string) => {
    switch (id) {
      case 'key':
        return <Key className={`w-8 h-8 ${color}`} />;
      case 'lock':
        return <Lock className={`w-8 h-8 ${color}`} />;
      case 'search':
        return <Search className={`w-8 h-8 ${color}`} />;
      case 'shield':
        return <Shield className={`w-8 h-8 ${color}`} />;
      case 'cpu':
        return <Cpu className={`w-8 h-8 ${color}`} />;
      case 'db':
        return <Database className={`w-8 h-8 ${color}`} />;
      default:
        return <Compass className={`w-8 h-8 ${color}`} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* Memorization Alert */}
      {isMemorizing ? (
        <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-cyan-200 text-sm font-semibold flex items-center gap-2 animate-pulse">
          <Eye className="w-5 h-5 text-cyan-400" />
          <span>MEMORIZE AS POSIÇÕES! Ocultando em: {countdown}s</span>
        </div>
      ) : (
        <div className="text-xs text-slate-400">
          Encontre os 3 pares correspondentes. Tentativas: <span className="font-bold text-white">{moves}</span>
        </div>
      )}

      {/* Cards Grid: 6 cards (3x2 or 2x3) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md w-full">
        {cards.map((card, idx) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <button
              key={card.id}
              disabled={isMemorizing || card.isMatched}
              onClick={() => handleCardClick(idx)}
              className={`h-28 sm:h-32 rounded-2xl p-2 transition-all flex flex-col items-center justify-center border ${
                card.isMatched
                  ? 'bg-emerald-950/40 border-emerald-500/50 opacity-90 cursor-default'
                  : isRevealed
                  ? 'bg-slate-800 border-cyan-400 shadow-md shadow-cyan-950/50'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:bg-slate-900 active:scale-95 cursor-pointer'
              }`}
              aria-label={
                isRevealed
                  ? `Cartão revelado: ${card.label}`
                  : `Cartão oculto ${idx + 1}, clique para virar`
              }
            >
              {isRevealed ? (
                <div className="flex flex-col items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
                  {renderIcon(card.symbolId, card.color)}
                  <span className="text-[11px] font-bold text-slate-200 tracking-wide">
                    {card.label}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-600">
                  <div className="w-8 h-8 rounded-full border border-dashed border-slate-700 flex items-center justify-center font-mono text-xs">
                    ?
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
