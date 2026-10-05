import { MissionDef } from '../types/game';

export const MISSIONS: MissionDef[] = [
  {
    id: 1,
    code: 'MIS-01',
    title: 'Memória Relâmpago',
    category: 'Memória Visual',
    description: 'Os dados foram embaralhados na memória temporária. Encontre os pares de símbolos correspondentes.',
    instruction: 'Memorize a posição dos cartões antes que eles se fechem e encontre todos os pares idênticos.',
    bnccSkill: 'EF05MA24 (Identificar padrões e regularidades) & Computação (Armazenamento e busca)',
    cognitiveFocus: ['Memória visual', 'Atenção sustentada', 'Localização espacial']
  },
  {
    id: 2,
    code: 'MIS-02',
    title: 'Código Secreto',
    category: 'Sequência & Ordem',
    description: 'O protocolo de transmissão exige a reprodução exata da chave criptográfica gerada.',
    instruction: 'Observe com atenção a sequência de símbolos exibida e repita-a na mesma ordem exata.',
    bnccSkill: 'EF05MA25 (Sequências recursivas) & Computação (Execução de algoritmos sequenciais)',
    cognitiveFocus: ['Memória de trabalho', 'Ordenação sequencial', 'Atenção focalizada']
  },
  {
    id: 3,
    code: 'MIS-03',
    title: 'Detetive dos Detalhes',
    category: 'Percepção de Detalhes',
    description: 'Dois fluxos de dados parecem idênticos à primeira vista, mas contêm anomalias de segurança.',
    instruction: 'Compare os dois painéis de controle e localize todas as diferenças sutis entre eles.',
    bnccSkill: 'EF05MA19 (Percepção espacial e geométrica) & Computação (Depuração e detecção de falhas)',
    cognitiveFocus: ['Atenção seletiva', 'Percepção visual minuciosa', 'Rastreamento ocular']
  },
  {
    id: 4,
    code: 'MIS-04',
    title: 'Atenção Total',
    category: 'Atenção Seletiva',
    description: 'Uma tempestade de dados sobrecarregou a tela. Isole apenas o sinal de transmissão correto.',
    instruction: 'Siga rigorosamente a instrução do alvo (ex: apenas círculos azuis) e ignore todas as distrações.',
    bnccSkill: 'EF05CI03 (Organização e classificação com base em critérios) & Computação (Filtragem de dados)',
    cognitiveFocus: ['Atenção seletiva', 'Filtragem de ruído', 'Controle inibitório']
  },
  {
    id: 5,
    code: 'MIS-05',
    title: 'Não Clique!',
    category: 'Controle de Impulsividade',
    description: 'Sinais de alta velocidade exigem reflexo consciente: aja no sinal verde, freie no sinal proibido.',
    instruction: 'Clique no alvo autorizado assim que surgir. SE surgir o símbolo proibido, NÃO CLIQUE!',
    bnccSkill: 'EF05MA11 (Condições de controle e decisão) & Computação (Estruturas condicionais SE/SENÃO)',
    cognitiveFocus: ['Controle inibitório', 'Inibição de resposta', 'Vigilância sustentada']
  },
  {
    id: 6,
    code: 'MIS-06',
    title: 'Sequência Perdida',
    category: 'Raciocínio Lógico',
    description: 'Um elo da cadeia de processamento foi corrompido. Identifique a lógica e complete o termo que falta.',
    instruction: 'Descubra a regra da sequência lógica (números, formas ou padrões) e aponte o elemento correto.',
    bnccSkill: 'EF05MA10 (Relações de igualdade e padrões matemáticos) & Computação (Reconhecimento de padrões)',
    cognitiveFocus: ['Raciocínio lógico dedutivo', 'Identificação de padrões', 'Pensamento algébrico']
  },
  {
    id: 7,
    code: 'MIS-07',
    title: 'Memória Visual',
    category: 'Retenção Espacial',
    description: 'A matriz de segurança alterou de posição. Reconstitua qual elemento ocupava o setor indicado.',
    instruction: 'Memorize a disposição dos objetos na grade. Quando um sumir, indique qual elemento estava ali.',
    bnccSkill: 'EF05GE08 (Localização e coordenadas) & Computação (Matrizes e indexação espacial)',
    cognitiveFocus: ['Memória espacial de curto prazo', 'Retenção visual', 'Orientação espacial']
  },
  {
    id: 8,
    code: 'MIS-08',
    title: 'Caça ao Padrão',
    category: 'Detecção de Anomalias',
    description: 'Um elemento estranho infiltrou a linha de montagem de dados. Identifique o intruso que quebra a regra.',
    instruction: 'Analise o grupo e clique no único elemento que não obedece ao padrão compartilhado pelos demais.',
    bnccSkill: 'EF05MA24 (Classificação por propriedades) & Computação (Classificação e anomalias)',
    cognitiveFocus: ['Discriminação visual', 'Agrupamento categórico', 'Atenção aos detalhes']
  },
  {
    id: 9,
    code: 'MIS-09',
    title: 'Instrução Dupla',
    category: 'Atenção Dividida & Regras Combinadas',
    description: 'A trava de segurança requer duas condições simultâneas para validação segura.',
    instruction: 'Clique apenas nos elementos que cumprem AMBAS as condições (ex: número par E formato circular).',
    bnccSkill: 'EF05MA11 (Operadores lógicos E / OU) & Computação (Lógica booleana condicional)',
    cognitiveFocus: ['Flexibilidade cognitiva', 'Processamento de critérios múltiplos', 'Controle executivo']
  },
  {
    id: 10,
    code: 'MIS-10',
    title: 'Memória de Trabalho',
    category: 'Transformação Mental',
    description: 'Não basta lembrar: o agente precisa manipular os dados mentalmente antes de responder.',
    instruction: 'Guarde a sequência na memória e responda à pergunta que exige manipular ou selecionar a informação.',
    bnccSkill: 'EF05MA07 (Operações e cálculo mental) & Computação (Variáveis e manipulação de estado)',
    cognitiveFocus: ['Memória operacional', 'Manipulação cognitiva', 'Foco prolongado']
  },
  {
    id: 11,
    code: 'MIS-11',
    title: 'Detetive do Código',
    category: 'Criptografia & Substituição',
    description: 'Decodifique a mensagem transmitida em símbolos utilizando a tabela de correspondência numérica.',
    instruction: 'Consulte a legenda de símbolos e valores e converta a mensagem criptografada no código numérico.',
    bnccSkill: 'EF05MA11 (Representação simbólica e correspondência) & Computação (Criptografia e mapeamento chave-valor)',
    cognitiveFocus: ['Decodificação simbólica', 'Associação pareada', 'Atenção focalizada']
  },
  {
    id: 12,
    code: 'MIS-12',
    title: 'Caminho da Atenção',
    category: 'Navegação por Regra',
    description: 'Guie o pacote de dados do ponto de entrada até o destino passando apenas pelas células permitidas.',
    instruction: 'Trace o caminho seguro da entrada à saída clicando nos blocos adjacentes que cumprem a regra.',
    bnccSkill: 'EF05GE09 (Trajetos, direções e malhas) & Computação (Grafos, caminhos e algoritmos de busca)',
    cognitiveFocus: ['Planejamento espacial', 'Seguimento de regras continuadas', 'Atenção sequencial']
  },
  {
    id: 13,
    code: 'MIS-13',
    title: 'Missão Contra o Tempo',
    category: 'Agilidade com Precisão',
    description: 'O gerador de energia oscila. Responda com calma e precisão dentro do tempo limite.',
    instruction: 'Resolva os microdesafios de atenção antes que o medidor de tempo expire. Precisão vale mais que pressa!',
    bnccSkill: 'EF05MA19 (Medidas de tempo e estimativa) & Computação (Eficiência e tempos de resposta)',
    cognitiveFocus: ['Tomada de decisão sob pressão de tempo', 'Agilidade perceptual', 'Controle emocional']
  },
  {
    id: 14,
    code: 'MIS-14',
    title: 'Super Concentração',
    category: 'Multi-habilidade Integrada',
    description: 'Fase avançada combinando memória imediata, atenção seletiva refinada e raciocínio simultâneo.',
    instruction: 'Encare uma sequência de três etapas consecutivas que testam diferentes facetas do seu foco mental.',
    bnccSkill: 'EF05MA24 (Resolução de problemas complexos) & Computação (Composição de submódulos)',
    cognitiveFocus: ['Integração cognitiva', 'Resistência à fadiga mental', 'Alternância de tarefas']
  },
  {
    id: 15,
    code: 'MIS-15',
    title: 'Desafio Final: Restauração do Comando',
    category: 'Desafio Mestre',
    description: 'O núcleo central do Centro de Comando precisa ser totalmente recalibrado em 5 módulos cruciais.',
    instruction: 'Complete todos os módulos de segurança para salvar o sistema e consagrar seu treinamento de elite!',
    bnccSkill: 'Competências Gerais da BNCC (Pensamento crítico, científico e criativo) & BNCC Computação',
    cognitiveFocus: ['Maestria em concentração', 'Resolução abrangente de problemas', 'Autoeficácia']
  }
];
