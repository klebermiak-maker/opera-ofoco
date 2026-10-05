import React from 'react';
import { X, ShieldCheck, Heart, Award, Sparkles, BookOpen, Compass } from 'lucide-react';
import { AgentAvatar } from './AgentAvatar';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-play-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Fechar instruções"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <AgentAvatar mood="ready" size="sm" />
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Manual de Instruções do Agente
            </div>
            <h2 id="how-to-play-title" className="text-xl sm:text-2xl font-display font-bold text-white">
              Como Funciona a Operação Foco
            </h2>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300">
          {/* Narrativa */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              A Missão
            </h3>
            <p className="leading-relaxed">
              Uma falha misteriosa atingiu o Centro de Comando. Para restaurar o sistema, o agente precisa completar 15 missões de concentração, atenção e raciocínio lógico. Cada fase vencida desbloqueia o módulo seguinte até o Grande Desafio Final!
            </p>
          </div>

          {/* Sistema de Vidas & Pontos */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-rose-400">
                <Heart className="w-4 h-4 fill-rose-500" />
                Sistema de 3 Vidas
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Você começa cada fase com 3 corações. Erros descontam uma vida, mas nunca reiniciam todo o jogo! Se zerar as vidas, basta tentar a fase atual novamente.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-400">
                <Award className="w-4 h-4" />
                Pontuação & Estrelas
              </div>
              <ul className="text-xs space-y-1 text-slate-300">
                <li><strong className="text-emerald-400">+100 pts:</strong> Resposta correta</li>
                <li><strong className="text-cyan-400">+50 pts:</strong> Bônus de rapidez</li>
                <li><strong className="text-amber-400">+25 pts:</strong> Sequência perfeita</li>
                <li><strong className="text-rose-400">-20 pts:</strong> Tentativa incorreta</li>
              </ul>
            </div>
          </div>

          {/* Avaliação por Estrelas */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Classificação por Estrelas
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50">
                <span className="text-amber-400 font-bold block mb-1">⭐</span>
                <span className="text-slate-200 font-medium">1 Estrela</span>
                <span className="block text-slate-400 text-[11px] mt-0.5">Missão Concluída</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50">
                <span className="text-amber-400 font-bold block mb-1">⭐⭐</span>
                <span className="text-slate-200 font-medium">2 Estrelas</span>
                <span className="block text-slate-400 text-[11px] mt-0.5">Bom Desempenho</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/50">
                <span className="text-amber-400 font-bold block mb-1">⭐⭐⭐</span>
                <span className="text-slate-200 font-medium">3 Estrelas</span>
                <span className="block text-slate-400 text-[11px] mt-0.5">Foco de Elite</span>
              </div>
            </div>
          </div>

          {/* Objetivo Pedagógico & BNCC */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
            <h3 className="font-semibold text-cyan-300 flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Objetivo Pedagógico (5º Ano)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Desenvolvido com base nas habilidades da <strong>BNCC do 5º ano</strong> e <strong>BNCC Computação</strong> (reconhecimento de padrões, algoritmos sequenciais, depuração, controle inibitório e atenção seletiva). Ideal para utilização em laboratório de informática escolar, computadores e tablets.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-lg shadow-cyan-500/20"
          >
            Entendido, Comandante!
          </button>
        </div>
      </div>
    </div>
  );
};
