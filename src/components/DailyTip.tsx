import React, { useState, useMemo } from 'react';
import { Lightbulb, Target, Calendar, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/audio';

export interface TipItem {
  id: number;
  title: string;
  category: string;
  content: string;
  actionStep: string;
}

export const CONCENTRATION_TIPS_30: TipItem[] = [
  {
    id: 1,
    title: 'Técnica dos Blocos de Foco (Pomodoro Infantil)',
    category: 'Gerenciamento de Tempo',
    content: 'O cérebro atinge seu rendimento máximo em blocos de 20 a 25 minutos. Focar sem parar por horas esgota a energia mental e causa distrações bobas.',
    actionStep: 'Cronometre 20 minutos de foco absoluto na atividade. Quando o alarme tocar, descanse 5 minutos.',
  },
  {
    id: 2,
    title: 'Respiração Tática 4-4-4 (Box Breathing)',
    category: 'Atenção Plena',
    content: 'Quando surge pressa ou nervosismo, os batimentos aceleram e a memória falha. Respirar com ritmo avisa o cérebro que você está no comando.',
    actionStep: 'Puxe o ar pelo nariz em 4 segundos, segure por 4 e expire pela boca em 4 segundos. Repita 3 vezes.',
  },
  {
    id: 3,
    title: 'Mesa do Agente: Zona Zero Distrações',
    category: 'Ambiente de Estudos',
    content: 'Cada objeto espalhado no seu campo de visão consome um pouco de atenção sem você perceber: brinquedos, celular ou abas abertas no navegador.',
    actionStep: 'Deixe na mesa apenas o material da missão atual e feche as abas extras do computador.',
  },
  {
    id: 4,
    title: 'O Mito da Multitarefa (Monofoco)',
    category: 'Neurociência',
    content: 'Tentar fazer a lição conversando ou com vídeos abertos não é rapidez, é alternância constante. Cada troca de foco drena até 20% da sua energia mental.',
    actionStep: 'Escolha uma única tarefa e faça-a do início ao fim antes de abrir qualquer outra.',
  },
  {
    id: 5,
    title: 'A Regra dos 2 Minutos contra a Preguiça',
    category: 'Início de Ação',
    content: 'A barreira mais difícil da concentração quase sempre é começar. Após dois minutos de ação contínua, o cérebro entra no fluxo natural de trabalho.',
    actionStep: 'Quando a tarefa parecer chata, prometa a si mesmo fazer só os 2 primeiros minutos. Depois fica fácil!',
  },
  {
    id: 6,
    title: 'Hidratação e Oxigenação Cerebral',
    category: 'Saúde Cognitiva',
    content: 'O cérebro é formado por cerca de 75% de água. Uma leve desidratação reduz a velocidade de reação e causa cansaço mental precoce.',
    actionStep: 'Deixe uma garrafinha de água por perto e tome alguns goles a cada missão concluída.',
  },
  {
    id: 7,
    title: 'O Poder da Autoexplicação',
    category: 'Fixação de Memória',
    content: 'Ensinar um conteúdo com as suas próprias palavras para um amigo (ou até para um objeto) consolida os caminhos neurais do aprendizado.',
    actionStep: 'Após ler uma instrução ou problema, resuma a lógica em voz alta em uma única frase.',
  },
  {
    id: 8,
    title: 'O Sono Guarda os Seus Arquivos Mentais',
    category: 'Neurociência',
    content: 'É durante o sono profundo que o cérebro transfere os dados da memória de curto prazo para a memória permanente, organizando o que aprendeu.',
    actionStep: 'Desligue telas e aparelhos 30 minutos antes de dormir para permitir que seu cérebro descanse de verdade.',
  },
  {
    id: 9,
    title: 'Esquemas Visuais e Mapas de Raciocínio',
    category: 'Organização do Pensamento',
    content: 'Nosso cérebro processa desenhos, setas e formas geométricas até 60 mil vezes mais rápido do que páginas de texto denso.',
    actionStep: 'Ao enfrentar uma questão complexa, faça um rascunho com caixas e setas mostrando a ordem dos passos.',
  },
  {
    id: 10,
    title: 'A Pausa Ativa sem Telas',
    category: 'Recuperação',
    content: 'Mudar do jogo para rolar vídeos rápidos no celular não descansa a mente. O descanso real é dar movimento ao corpo e aliviar os olhos.',
    actionStep: 'No intervalo, olhe pela janela para um ponto distante, levante os braços e gire os ombros.',
  },
  {
    id: 11,
    title: 'Folha de Estacionamento de Ideias',
    category: 'Controle de Pensamentos',
    content: 'Quando um pensamento aleatório surgir no meio do estudo ("preciso jogar futebol mais tarde"), não tente reprimi-lo: anote-o em um papel à parte.',
    actionStep: 'Escreva a distração no papel de rascunho e prometa voltar a ela depois que terminar a tarefa atual.',
  },
  {
    id: 12,
    title: 'Postura Atenta e Circulação Sanguínea',
    category: 'Ergonomia',
    content: 'Ficar curvado sobre a mesa comprime os pulmões e reduz o fluxo de oxigênio para a cabeça, provocando sonolência e falta de foco.',
    actionStep: 'Apoie os dois pés no chão, mantenha as costas retas e ajuste a tela na altura dos olhos.',
  },
  {
    id: 13,
    title: 'Recuperação Ativa de Memória',
    category: 'Técnica de Aprendizado',
    content: 'Apenas reler um texto várias vezes cria a falsa sensação de que você já sabe. O que fortalece o cérebro é tentar lembrar sem olhar.',
    actionStep: 'Feche o livro e pergunte a si mesmo: "Quais eram os três pontos principais que acabei de ler?"',
  },
  {
    id: 14,
    title: 'Dividir o Monstro em Pedaços Pequenos',
    category: 'Resolução de Problemas',
    content: 'Desafios muito grandes assustam o cérebro e geram vontade de desistir. Transforme uma grande missão em pequenas etapas de 5 minutos.',
    actionStep: 'Liste os 3 primeiros passos práticos e concentre-se apenas em cumprir o primeiro deles.',
  },
  {
    id: 15,
    title: 'Iluminação Natural e Claridade',
    category: 'Ambiente de Estudos',
    content: 'Ambientes escuros estimulam a produção de melatonina, o hormônio do sono, diminuindo a agilidade visual e o estado de alerta.',
    actionStep: 'Sempre que possível, estude perto de uma janela ou com luz clara e direcionada sobre seu material.',
  },
  {
    id: 16,
    title: 'O Silêncio dos Sons Vocais',
    category: 'Atenção Auditiva',
    content: 'Músicas com letra em português ou inglês disputam o centro de linguagem do cérebro enquanto você tenta ler ou calcular.',
    actionStep: 'Se for escutar música para estudar, prefira instrumentais suaves, trilhas de videogame calmas ou sons da natureza.',
  },
  {
    id: 17,
    title: 'A Regra dos 3 Segundos de Calma',
    category: 'Controle da Impulsividade',
    content: 'Muitos erros acontecem porque a mão clica antes de os olhos terminarem de verificar toda a tela. Esse é o reflexo da impulsividade.',
    actionStep: 'Antes de clicar ou marcar sua resposta final, conte mentalmente "1, 2, 3" e faça uma última checagem.',
  },
  {
    id: 18,
    title: 'Alimentação Inteligente para o Cérebro',
    category: 'Nutrição e Foco',
    content: 'Alimentos com excesso de açúcar geram um pico rápido de energia seguido de uma queda brusca, causando lentidão e perda de foco.',
    actionStep: 'Prefira frutas, castanhas ou um lanche saudável antes de sessões intensas de concentração.',
  },
  {
    id: 19,
    title: 'Curiosidade Ativa de Detetive',
    category: 'Motivação Intrínseca',
    content: 'Quando encaramos uma atividade como um mistério que precisa ser desvendado, o cérebro libera dopamina, hormônio que aguça a atenção.',
    actionStep: 'Pergunte-se: "Qual é o enigma que esse desafio está tentando me ensinar a solucionar?"',
  },
  {
    id: 20,
    title: 'Alongamento Tático do Pescoço',
    category: 'Relaxamento Físico',
    content: 'A tensão acumulada na nuca e nos ombros ao olhar para telas pode gerar dor de cabeça tensional e dificuldade de concentração.',
    actionStep: 'Incline a cabeça suavemente para cada lado por 10 segundos, respirando fundo pelo nariz.',
  },
  {
    id: 21,
    title: 'Descobrir seu Turno de Ouro',
    category: 'Autoconhecimento',
    content: 'Algumas pessoas concentram-se melhor de manhã cedo, enquanto outras têm mais foco à tarde. Conhecer seu ritmo é uma vantagem tática.',
    actionStep: 'Observe em qual período do dia você se sente mais alerta e reserve esse horário para os desafios difíceis.',
  },
  {
    id: 22,
    title: 'Leitura com Dedo ou Marcador Guiado',
    category: 'Rastreamento Ocular',
    content: 'Guiar os olhos com o dedo ou uma régua embaixo da linha evita que o olhar salte de volta, aumentando a velocidade de compreensão.',
    actionStep: 'Em textos longos ou enunciados cheios de números, aponte a linha atual com o lápis ou o cursor.',
  },
  {
    id: 23,
    title: 'Repetição Espaçada Inteligente',
    category: 'Memória de Longo Prazo',
    content: 'Revisar um conteúdo 1 dia depois, 3 dias depois e 1 semana depois é 5 vezes mais eficiente do que estudar tudo na véspera da prova.',
    actionStep: 'Ao aprender uma regra nova, resolva um pequeno exercício no dia seguinte para fixar o aprendizado.',
  },
  {
    id: 24,
    title: 'Visualização da Missão Concluída',
    category: 'Preparação Mental',
    content: 'Atletas e pilotos de elite fecham os olhos e imaginam os passos perfeitos antes da competição. O cérebro treina a resposta com antecedência.',
    actionStep: 'Feche os olhos por 10 segundos e visualize você mesmo resolvendo a missão com calma e precisão.',
  },
  {
    id: 25,
    title: 'Sublinhar Palavras-Chave de Comando',
    category: 'Atenção Seletiva',
    content: 'Palavras como "NÃO", "EXCETO", "TODOS" ou "DIFERENTE" mudam todo o sentido da questão e costumam ser ignoradas na leitura rápida.',
    actionStep: 'Circule ou destaque a palavra central da instrução antes de começar a responder.',
  },
  {
    id: 26,
    title: 'O Sistema de Recompensas do Agente',
    category: 'Motivação',
    content: 'Nosso cérebro adora comemorar metas alcançadas. Estabelecer um pequeno prêmio pós-tarefa mantém a dedicação em alta.',
    actionStep: 'Defina: "Assim que terminar estas 2 fases com foco total, vou brincar 15 minutos com meu jogo favorito."',
  },
  {
    id: 27,
    title: 'Troca de Postura: Em Pé e Sentado',
    category: 'Vitalidade',
    content: 'Permanecer imóvel na mesma posição por muito tempo diminui a taxa de batimentos e pode causar sensação de peso nas pálpebras.',
    actionStep: 'Faça algumas questões em pé ou caminhe pelo quarto repetindo a regra memorizada.',
  },
  {
    id: 28,
    title: 'Errar Faz Parte da Calibração Neural',
    category: 'Mentalidade de Crescimento',
    content: 'Errar uma questão não significa falta de inteligência. No cérebro, o erro acende um alerta que ajuda a recalibrar os neurônios para acertar depois.',
    actionStep: 'Quando errar uma fase, não desanime: analise o porquê e tente novamente com atenção redobrada.',
  },
  {
    id: 29,
    title: 'Treino da Visão Periférica',
    category: 'Percepção Visual',
    content: 'Em jogos de detecção e no trânsito, perceber o que acontece nas bordas da tela sem virar os olhos aumenta muito a agilidade.',
    actionStep: 'Fixe o olhar no centro do monitor e tente notar os cantos da tela sem mover a cabeça.',
  },
  {
    id: 30,
    title: 'O Poder da Autoafirmação Positiva',
    category: 'Autoeficácia',
    content: 'Dizer a si mesmo "eu não consigo" bloqueia o córtex pré-frontal. Dizer "com calma e foco eu vou resolver" abre caminhos lógicos.',
    actionStep: 'Antes de iniciar qualquer desafio tático, diga mentalmente: "Eu sou capaz de manter o foco até o final!"',
  },
];

/**
 * DailyTip Component:
 * Calculates the current day index using `new Date().getDate()` to ensure
 * a different concentration tip is displayed every day of the month.
 */
export const DailyTip: React.FC = () => {
  // Use new Date().getDate() as requested to guarantee a daily rotation
  const { todayIndex, dayOfMonth, formattedDate } = useMemo(() => {
    const now = new Date();
    const day = now.getDate(); // 1 to 31
    // Map day of month (1-31) to 0-29 index
    const index = (day - 1) % CONCENTRATION_TIPS_30.length;

    const dateStr = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
    const capitalized = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

    return { todayIndex: index, dayOfMonth: day, formattedDate: capitalized };
  }, []);

  const [activeIndex, setActiveIndex] = useState<number>(todayIndex);
  const currentTip = CONCENTRATION_TIPS_30[activeIndex];
  const isViewingToday = activeIndex === todayIndex;

  const handleNext = () => {
    sounds.playClick();
    setActiveIndex((prev) => (prev + 1) % CONCENTRATION_TIPS_30.length);
  };

  const handlePrev = () => {
    sounds.playClick();
    setActiveIndex((prev) => (prev - 1 + CONCENTRATION_TIPS_30.length) % CONCENTRATION_TIPS_30.length);
  };

  const handleReset = () => {
    sounds.playClick();
    setActiveIndex(todayIndex);
  };

  return (
    <aside
      aria-label="Dica de Concentração do Dia"
      className="w-full text-left rounded-2xl bg-slate-900/90 border border-cyan-500/35 p-4 sm:p-5 shadow-xl relative overflow-hidden backdrop-blur-sm transition-all"
    >
      {/* Subtle ambient tech lighting */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <span>DICA DE CONCENTRAÇÃO DO DIA</span>
              <span className="text-slate-600">·</span>
              <span className="text-[10px] text-emerald-400 font-medium">Dia {dayOfMonth}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center gap-1">
          {!isViewingToday && (
            <button
              onClick={handleReset}
              className="px-2 py-1 rounded text-[11px] font-medium text-cyan-300 hover:text-cyan-200 hover:bg-slate-800 transition-colors flex items-center gap-1 mr-1"
              aria-label="Voltar para a dica do dia de hoje"
              title="Voltar para a dica de hoje"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Dica de Hoje</span>
            </button>
          )}

          <span className="text-[11px] font-mono-numbers text-slate-400 px-1">
            {activeIndex + 1}/{CONCENTRATION_TIPS_30.length}
          </span>

          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Dica anterior"
            title="Dica anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Próxima dica"
            title="Próxima dica"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tip Body */}
      <div className="pt-3.5 space-y-2.5">
        <div>
          <div className="text-xs text-slate-400 mb-0.5">
            <span className="text-cyan-400 font-medium">{currentTip.category}</span>
          </div>
          <h3 className="text-base font-display font-bold text-white tracking-tight">
            {currentTip.title}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {currentTip.content}
        </p>

        {/* Action challenge box with subtle Target icon */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 flex items-start gap-2.5">
          <Target className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="font-semibold text-amber-300 mr-1">Missão Prática:</strong>
            {currentTip.actionStep}
          </div>
        </div>
      </div>
    </aside>
  );
};
