export interface ConcentrationTip {
  id: number;
  title: string;
  category: string;
  technique: string;
  content: string;
  actionStep: string;
  badge: string;
}

export const CONCENTRATION_TIPS: ConcentrationTip[] = [
  {
    id: 1,
    title: 'Técnica dos Blocos de Foco (Pomodoro Infantil)',
    category: 'Gerenciamento de Tempo',
    technique: 'Foco de 20 minutos + 5 minutos de pausa',
    content: 'O cérebro de quem tem 10 a 11 anos atinge o pico de concentração em blocos de 20 a 25 minutos. Tentar estudar 2 horas seguidas sem pausa esgota a atenção e causa erros bobos.',
    actionStep: 'Coloque um alarme de 20 minutos para focar 100% em uma única tarefa. Quando tocar, levante e descanse 5 minutos!',
    badge: '⏱️ BLOCOS DE TEMPO',
  },
  {
    id: 2,
    title: 'Respiração Tática 4-4-4 (Box Breathing)',
    category: 'Atenção Plena',
    technique: 'Controle de Ansiedade & Foco',
    content: 'Quando sentimos pressa ou nervosismo em um teste, os batimentos cardíacos aumentam e a memória de trabalho falha. A respiração ritmada avisa o cérebro que você está seguro e no controle.',
    actionStep: 'Puxe o ar pelo nariz contando até 4, segure o ar contando até 4 e solte devagar pela boca contando até 4. Repita 3 vezes!',
    badge: '🫁 RESPIRAÇÃO TÁTICA',
  },
  {
    id: 3,
    title: 'Zona Limpa de Distrações (Mesa do Agente)',
    category: 'Ambiente de Estudos',
    technique: 'Redução de Ruído Visual',
    content: 'Tudo o que está no seu campo de visão consome um pouquinho da sua atenção, mesmo que você não perceba: notificações, brinquedos, abas abertas no computador ou materiais espalhados.',
    actionStep: 'Antes de estudar ou jogar, deixe em cima da mesa apenas o caderno e a caneta daquela matéria. Feche todas as abas que não usar.',
    badge: '🧹 ESPAÇO DE TRABALHO',
  },
  {
    id: 4,
    title: 'O Mito da Multitarefa (Monofoco)',
    category: 'Neurociência',
    technique: 'Uma missão por vez',
    content: 'Fazer lição assistindo vídeo ou ouvindo música com letra não é ser rápido: é alternar a atenção dezenas de vezes por minuto. Cada troca faz você perder até 20% da sua capacidade de raciocínio.',
    actionStep: 'Escolha uma única missão para começar e terminar antes de abrir qualquer outra coisa.',
    badge: '🎯 MONOFOCO',
  },
  {
    id: 5,
    title: 'O Efeito da Autoexplicação',
    category: 'Fixação de Memória',
    technique: 'Ensinar em voz alta',
    content: 'Se você consegue explicar um desafio de matemática ou um texto com as suas próprias palavras para um colega (ou até para o seu estojo!), significa que você realmente entendeu a lógica.',
    actionStep: 'Depois de ler um parágrafo ou ver uma regra do jogo, tente resumi-la em uma frase em voz alta sem olhar.',
    badge: '🗣️ AUTOEXPLICAÇÃO',
  },
  {
    id: 6,
    title: 'Combustível Cerebral: Água & Oxigênio',
    category: 'Saúde Cognitiva',
    technique: 'Hidratação constante',
    content: 'O cérebro humano é composto por cerca de 75% de água. Uma leve desidratação já reduz a velocidade de reação visual e causa cansaço mental e dores de cabeça.',
    actionStep: 'Mantenha uma garrafinha de água por perto e beba um gole a cada missão concluída.',
    badge: '💧 HIDRATAÇÃO',
  },
  {
    id: 7,
    title: 'A Regra dos 2 Minutos contra a Preguiça',
    category: 'Início de Ação',
    technique: 'Superando o atrito inicial',
    content: 'A parte mais difícil da concentração é quase sempre os primeiros dois minutos. Depois que você começa a rabiscar ou ler a primeira questão, o cérebro engrena no fluxo natural de trabalho.',
    actionStep: 'Quando bater a preguiça, prometa para si mesmo: "Vou fazer só os 2 primeiros minutos". Você vai ver que continuará facilmente!',
    badge: '⚡ AÇÃO RÁPIDA',
  },
  {
    id: 8,
    title: 'O Sono Guarda os Seus Arquivos Mentais',
    category: 'Neurociência',
    technique: 'Consolidação de Memória',
    content: 'Durante o sono profundo, o cérebro transfere as memórias temporárias do dia para a memória de longo prazo. Quem dorme 8 a 9 horas por noite tem raciocínio 30% mais ágil no dia seguinte.',
    actionStep: 'Evite telas brilhantes 30 minutos antes de dormir para permitir que seu cérebro descanse de verdade.',
    badge: '🌙 SONO REPARADOR',
  },
  {
    id: 9,
    title: 'Anotações Visuais & Esquemas em Setas',
    category: 'Organização do Pensamento',
    technique: 'Mapeamento Visual',
    content: 'Nosso cérebro processa desenhos, setas e formas geométricas até 60.000 vezes mais rápido do que blocos de texto puro. Organizar ideias em diagramas clareia a mente.',
    actionStep: 'Ao resolver um problema difícil, faça um pequeno rascunho com caixas e setas mostrando a ordem dos passos.',
    badge: '✏️ ESQUEMAS VISUAIS',
  },
  {
    id: 10,
    title: 'A Pausa Ativa Inteligente',
    category: 'Recuperação de Energia',
    technique: 'Descanso sem telas',
    content: 'Descansar o cérebro não é pegar o celular para rolar vídeos rápidos (isso cansa ainda mais a atenção visual). O descanso verdadeiro é dar movimento ao corpo e olhar para longe.',
    actionStep: 'No intervalo, olhe pela janela para um ponto distante, estique os braços para cima e gire os ombros.',
    badge: '🧘 PAUSA ATIVA',
  },
];

/**
 * Calculates the current daily tip based on the browser's local calendar date.
 * Automatically advances to the next tip every 24 hours at midnight.
 */
export function getDailyTip(referenceDate: Date = new Date()) {
  // Day of year calculation based on local browser date
  const year = referenceDate.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const diff = referenceDate.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const tipIndex = Math.abs(dayOfYear) % CONCENTRATION_TIPS.length;
  const currentTip = CONCENTRATION_TIPS[tipIndex];

  // Format date in Brazilian Portuguese
  const formattedDate = referenceDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  // Capitalize first letter of weekday
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return {
    tip: currentTip,
    tipIndex,
    totalTips: CONCENTRATION_TIPS.length,
    formattedDate: capitalizedDate,
  };
}
