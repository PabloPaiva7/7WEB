
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Aniversariante, ConteudoRecomendado, DicaHack, TipoConteudo, CategoriaDica, Quiz, TipoQuiz, OpcaoQuiz, RespostaUsuario, NovoQuiz } from "@/types/mural.types";
import { toast } from "sonner";

// Helper para dados mockados - em um cenário real, viriam da API
const mockAniversariantes: Aniversariante[] = [
  {
    id: "aniv1",
    nome: "Maria Silva",
    departamento: "Marketing",
    data: "2023-07-15",
    foto: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: "aniv2",
    nome: "João Oliveira",
    departamento: "Vendas",
    data: "2023-07-20",
    foto: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "aniv3",
    nome: "Ana Costa",
    departamento: "Financeiro",
    data: "2023-07-25",
    foto: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: "aniv4",
    nome: "Carlos Santos",
    departamento: "TI",
    data: "2023-08-05",
    foto: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: "aniv5",
    nome: "Luiza Mendes",
    departamento: "RH",
    data: "2023-08-10",
    foto: "https://randomuser.me/api/portraits/women/29.jpg"
  },
  {
    id: "aniv6",
    nome: "Roberto Almeida",
    departamento: "Diretoria",
    data: "2023-08-15",
    foto: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    id: "aniv7",
    nome: "Clara Fernandes",
    departamento: "Atendimento",
    data: "2023-08-18",
    foto: "https://randomuser.me/api/portraits/women/54.jpg"
  }
];

const mockConteudos: ConteudoRecomendado[] = [
  {
    id: "cont1",
    titulo: "O Poder do Hábito",
    descricao: "Livro sobre como criar novos hábitos e mudar comportamentos. Charles Duhigg revela por que os hábitos existem e como podem ser transformados. Com novas descobertas científicas, o autor apresenta uma nova compreensão da natureza humana e seu potencial de transformação.",
    tipo: "livro",
    autor: "Charles Duhigg",
    dataCriacao: "2023-07-01",
    imagem: "https://m.media-amazon.com/images/I/61nTspM+BYL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: "cont2",
    titulo: "Liderança em tempos de crise",
    descricao: "Curso online sobre gestão de equipes em situações desafiadoras. Este curso aborda técnicas de comunicação assertiva, tomada de decisão sob pressão e como manter a equipe motivada em cenários adversos.",
    tipo: "curso",
    dataCriacao: "2023-07-10",
    link: "https://www.coursera.org/"
  },
  {
    id: "cont3",
    titulo: "Succession",
    descricao: "Série sobre uma família disfuncional que controla um dos maiores conglomerados de mídia do mundo. Acompanhe as disputas internas, traições e alianças enquanto os membros da família Logan Roy lutam pelo controle da empresa.",
    tipo: "serie",
    dataCriacao: "2023-07-15",
    imagem: "https://flxt.tmsimg.com/assets/p16119643_b_v13_aa.jpg"
  },
  {
    id: "cont4",
    titulo: "A Arte da Guerra",
    descricao: "Um clássico da literatura sobre estratégia militar que se aplica perfeitamente ao mundo dos negócios. Sun Tzu ensina táticas que podem ser aplicadas em qualquer campo de batalha, inclusive no universo corporativo.",
    tipo: "livro",
    autor: "Sun Tzu",
    dataCriacao: "2023-06-25",
    imagem: "https://m.media-amazon.com/images/I/71s0GVVdmHL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: "cont5",
    titulo: "Excel Avançado para Análise de Dados",
    descricao: "Aprenda técnicas avançadas de Excel para análise de dados e business intelligence. O curso inclui módulos sobre tabelas dinâmicas, Power Query, DAX e criação de dashboards interativos.",
    tipo: "curso",
    autor: "Microsoft Learning",
    dataCriacao: "2023-07-05",
    link: "https://learn.microsoft.com/excel"
  },
  {
    id: "cont6",
    titulo: "The Last of Us",
    descricao: "Série baseada no aclamado jogo que mostra um mundo pós-apocalíptico. Joel e Ellie devem atravessar os Estados Unidos devastados por uma infecção fúngica que transforma humanos em criaturas agressivas.",
    tipo: "serie",
    autor: "HBO",
    dataCriacao: "2023-06-10",
    imagem: "https://m.media-amazon.com/images/M/MV5BZGUzYTI3M2EtZmM0Yy00NGUzLWI4NWEtOGUyNTkwMjI2Zjk2XkEyXkFqcGdeQXVyNTM0OTY1OQ@@._V1_.jpg"
  },
  {
    id: "cont7",
    titulo: "Tudo posso naquele que me fortalece",
    descricao: "Filipenses 4:13 - Lembrete diário de que com fé e perseverança podemos superar os desafios que encontramos.",
    tipo: "versiculo",
    dataCriacao: "2023-07-20"
  }
];

const mockDicas: DicaHack[] = [
  {
    id: "dica1",
    titulo: "Atalhos do Excel",
    conteudo: "Use Ctrl+Shift+L para adicionar filtros rapidamente em suas tabelas.\n\nCtrl+T transforma seu conjunto de dados em uma tabela formatada.\n\nAlt+= insere a função SOMA automaticamente.\n\nF4 após selecionar uma referência de célula alterna entre referência relativa e absoluta.\n\nCtrl+; insere a data atual.",
    categoria: "produtividade",
    autor: "André Luiz",
    dataCriacao: "2023-07-05",
    curtidas: 15
  },
  {
    id: "dica2",
    titulo: "Técnica Pomodoro",
    conteudo: "Trabalhe por 25 minutos e descanse por 5. Após 4 ciclos, faça uma pausa mais longa.\n\nEsta técnica ajuda a manter o foco e evitar a procrastinação. Utilize um temporizador para controlar os intervalos e mantenha-se disciplinado.\n\nDurante os 25 minutos, foque exclusivamente na tarefa, sem distrações como e-mails ou redes sociais.",
    categoria: "trabalho",
    autor: "Camila Souza",
    dataCriacao: "2023-07-12",
    curtidas: 28
  },
  {
    id: "dica3",
    titulo: "Alongamentos para quem trabalha sentado",
    conteudo: "A cada hora, reserve 2 minutos para alongar o pescoço, ombros e costas para evitar dores.\n\n1. Gire lentamente a cabeça em círculos, 5 vezes para cada lado.\n2. Eleve os ombros até as orelhas, segure por 5 segundos e relaxe. Repita 5 vezes.\n3. Estenda os braços para cima e incline-se suavemente para os lados.\n4. Cruze uma perna sobre a outra e gire o tronco na direção da perna cruzada.",
    categoria: "bem-estar",
    autor: "Paulo Mendes",
    dataCriacao: "2023-07-18",
    curtidas: 32
  },
  {
    id: "dica4",
    titulo: "Organização de e-mails com método FAST",
    conteudo: "Aplique o método FAST para gerenciar melhor sua caixa de entrada:\n\nF - Forward (Encaminhar): Se não for sua responsabilidade, encaminhe para quem deve lidar com isso.\n\nA - Action (Ação): Se puder resolver em menos de 2 minutos, faça-o imediatamente.\n\nS - Store (Armazenar): Se for importante para referência futura, arquive-o em uma pasta adequada.\n\nT - Trash (Lixo): Se não for mais necessário, delete-o sem hesitar.",
    categoria: "produtividade",
    autor: "Mariana Costa",
    dataCriacao: "2023-07-08",
    curtidas: 23
  },
  {
    id: "dica5",
    titulo: "Configuração rápida de reuniões no Teams",
    conteudo: "Para agendar reuniões mais eficientes no Microsoft Teams:\n\n1. Use o comando /reuniao na caixa de mensagens para iniciar uma reunião rápida\n\n2. Configure salas simultâneas para discussões em grupos menores\n\n3. Utilize a opção 'Anotações da Reunião' para manter todos informados sobre os pontos discutidos\n\n4. Ative a transcrição automática para ter um registro completo do que foi falado",
    categoria: "tecnologia",
    autor: "Lucas Oliveira",
    dataCriacao: "2023-07-03",
    curtidas: 19
  },
  {
    id: "dica6",
    titulo: "Meditação de 5 minutos",
    conteudo: "Uma rápida meditação diária pode ajudar a reduzir o estresse e aumentar o foco:\n\n1. Encontre um local tranquilo e sente-se confortavelmente\n\n2. Feche os olhos e respire profundamente 3 vezes\n\n3. Concentre-se apenas na sua respiração por 5 minutos\n\n4. Quando sua mente divagar, gentilmente traga sua atenção de volta à respiração\n\n5. Ao finalizar, observe como você se sente antes de retornar às atividades",
    categoria: "bem-estar",
    autor: "Juliana Alves",
    dataCriacao: "2023-07-21",
    curtidas: 41
  },
  {
    id: "dica7",
    titulo: "Comando Git para reverter commits",
    conteudo: "Quando precisar desfazer um commit sem perder as alterações:\n\n```\ngit reset --soft HEAD~1\n```\n\nPara desfazer o commit e também descartar as alterações:\n\n```\ngit reset --hard HEAD~1\n```\n\nPara reverter um commit específico mantendo o histórico:\n\n```\ngit revert <commit-hash>\n```",
    categoria: "tecnologia",
    autor: "Rafael Gomes",
    dataCriacao: "2023-07-15",
    curtidas: 37
  }
];

const mockQuizzes: Quiz[] = [
  {
    id: "quiz1",
    titulo: "Qual música mais te motiva no trabalho?",
    descricao: "Compartilhe suas preferências musicais para o ambiente de trabalho",
    tipo: "preferencia",
    opcoes: [
      { id: "op1-quiz1", texto: "Música clássica", votos: 5 },
      { id: "op2-quiz1", texto: "Pop/Rock", votos: 12 },
      { id: "op3-quiz1", texto: "Lo-fi/Instrumental", votos: 8 },
      { id: "op4-quiz1", texto: "Prefiro silêncio", votos: 3 }
    ],
    ativo: true,
    multiplaEscolha: false,
    dataCriacao: "2023-07-10",
    autor: "Equipe RH",
    respostas: []
  },
  {
    id: "quiz2",
    titulo: "Melhor lugar para almoço na região",
    descricao: "Precisamos definir opções de restaurantes para nossos eventos",
    tipo: "opiniao",
    opcoes: [
      { id: "op1-quiz2", texto: "Restaurante Sabor & Arte", votos: 15 },
      { id: "op2-quiz2", texto: "Cantina Dona Maria", votos: 9 },
      { id: "op3-quiz2", texto: "Gourmet Express", votos: 7 }
    ],
    ativo: true,
    multiplaEscolha: false,
    dataCriacao: "2023-07-15",
    autor: "Comitê de Eventos",
    respostas: []
  },
  {
    id: "quiz3",
    titulo: "Como podemos melhorar o ambiente de trabalho?",
    descricao: "Sua opinião é importante para tornar nosso escritório mais agradável",
    tipo: "feedback",
    opcoes: [
      { id: "op1-quiz3", texto: "Mais plantas e áreas verdes", votos: 20 },
      { id: "op2-quiz3", texto: "Espaço de descompressão", votos: 18 },
      { id: "op3-quiz3", texto: "Iluminação melhor", votos: 7 },
      { id: "op4-quiz3", texto: "Sistema de som ambiente", votos: 5 }
    ],
    ativo: false,
    multiplaEscolha: true,
    dataCriacao: "2023-06-20",
    dataEncerramento: "2023-07-01",
    autor: "Diretoria",
    respostas: []
  },
  {
    id: "quiz4",
    titulo: "Qual horário você prefere para nossas reuniões de equipe?",
    descricao: "Estamos reorganizando nosso calendário para atender às preferências da maioria",
    tipo: "preferencia",
    opcoes: [
      { id: "op1-quiz4", texto: "Início da manhã (8h-10h)", votos: 14 },
      { id: "op2-quiz4", texto: "Final da manhã (10h-12h)", votos: 7 },
      { id: "op3-quiz4", texto: "Início da tarde (13h-15h)", votos: 9 },
      { id: "op4-quiz4", texto: "Final da tarde (15h-17h)", votos: 4 }
    ],
    ativo: true,
    multiplaEscolha: false,
    dataCriacao: "2023-07-22",
    autor: "Gerência",
    respostas: []
  },
  {
    id: "quiz5",
    titulo: "Quiz de conhecimentos gerais sobre a empresa",
    descricao: "Teste o quanto você conhece sobre a história e valores da nossa organização",
    tipo: "conhecimento",
    opcoes: [
      { id: "op1-quiz5", texto: "Em que ano a empresa foi fundada?", votos: 0 },
      { id: "op2-quiz5", texto: "Qual é a missão principal da organização?", votos: 0 },
      { id: "op3-quiz5", texto: "Quantos escritórios temos atualmente?", votos: 0 },
      { id: "op4-quiz5", texto: "Quem foi o fundador da empresa?", votos: 0 }
    ],
    ativo: true,
    multiplaEscolha: true,
    dataCriacao: "2023-07-18",
    autor: "Departamento de Comunicação",
    respostas: []
  },
  {
    id: "quiz6",
    titulo: "Qual tema você gostaria para a próxima confraternização?",
    descricao: "Ajude-nos a planejar nosso próximo evento social",
    tipo: "opiniao",
    opcoes: [
      { id: "op1-quiz6", texto: "Anos 80", votos: 12 },
      { id: "op2-quiz6", texto: "Festival Gastronômico", votos: 18 },
      { id: "op3-quiz6", texto: "Noite do Karaokê", votos: 14 },
      { id: "op4-quiz6", texto: "Esportes e Jogos", votos: 9 }
    ],
    ativo: true,
    multiplaEscolha: false,
    dataCriacao: "2023-07-05",
    autor: "Comitê de Eventos",
    respostas: []
  }
];

export const useMuralInterativo = () => {
  // Estado para aniversariantes
  const [aniversariantes, setAniversariantes] = useState<Aniversariante[]>(mockAniversariantes);
  
  // Estado para conteúdos recomendados
  const [conteudos, setConteudos] = useState<ConteudoRecomendado[]>(mockConteudos);
  const [filtroConteudo, setFiltroConteudo] = useState<TipoConteudo | "">("");
  
  // Estado para dicas e hacks
  const [dicas, setDicas] = useState<DicaHack[]>(mockDicas);
  const [filtroDica, setFiltroDica] = useState<CategoriaDica | "">("");

  // Estado para quizzes e enquetes
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [filtroQuiz, setFiltroQuiz] = useState<TipoQuiz | "">("");

  // Filtragem de conteúdos baseado no tipo selecionado
  const conteudosFiltrados = conteudos.filter(conteudo => {
    if (filtroConteudo === "") return true;
    return conteudo.tipo === filtroConteudo;
  });

  // Filtragem de dicas baseado na categoria selecionada
  const dicasFiltradas = dicas.filter(dica => {
    if (filtroDica === "") return true;
    return dica.categoria === filtroDica;
  });

  // Função para verificar se uma data está dentro da semana atual
  const ehAniversarioNaSemana = (data: string): boolean => {
    const hoje = new Date();
    const dataAniversario = new Date(data);
    
    // Ajustar para o ano atual
    dataAniversario.setFullYear(hoje.getFullYear());
    
    // Se já passou, pode ser no próximo ano
    if (dataAniversario < hoje) {
      dataAniversario.setFullYear(hoje.getFullYear() + 1);
    }
    
    const umaSemanaDepois = new Date(hoje);
    umaSemanaDepois.setDate(hoje.getDate() + 7);
    
    return dataAniversario >= hoje && dataAniversario <= umaSemanaDepois;
  };

  // Função para verificar se é aniversário hoje
  const ehAniversarioHoje = (data: string): boolean => {
    const hoje = new Date();
    const dataAniversario = new Date(data);
    
    return (
      dataAniversario.getDate() === hoje.getDate() &&
      dataAniversario.getMonth() === hoje.getMonth()
    );
  };

  // Função para verificar se é aniversário neste mês
  const ehAniversarioNoMes = (data: string): boolean => {
    const hoje = new Date();
    const dataAniversario = new Date(data);
    
    return dataAniversario.getMonth() === hoje.getMonth();
  };

  // Filtrar aniversariantes por período
  const aniversariantesDoDia = aniversariantes.filter(aniv => 
    ehAniversarioHoje(aniv.data)
  );

  const aniversariantesDaSemana = aniversariantes.filter(aniv => 
    !ehAniversarioHoje(aniv.data) && ehAniversarioNaSemana(aniv.data)
  );

  const aniversariantesDoMes = aniversariantes.filter(aniv => 
    !ehAniversarioHoje(aniv.data) && 
    !ehAniversarioNaSemana(aniv.data) && 
    ehAniversarioNoMes(aniv.data)
  );

  // CRUD para Aniversariantes
  const adicionarAniversariante = (aniversariante: Omit<Aniversariante, "id">) => {
    const novoAniversariante = {
      ...aniversariante,
      id: uuidv4()
    };
    setAniversariantes(prev => [...prev, novoAniversariante]);
    toast.success("Aniversariante adicionado com sucesso!");
  };

  const editarAniversariante = (id: string, aniversariante: Omit<Aniversariante, "id">) => {
    setAniversariantes(prev => 
      prev.map(a => a.id === id ? { ...aniversariante, id } : a)
    );
    toast.success("Aniversariante atualizado com sucesso!");
  };

  const excluirAniversariante = (id: string) => {
    setAniversariantes(prev => prev.filter(a => a.id !== id));
    toast.success("Aniversariante removido com sucesso!");
  };

  // CRUD para Conteúdos Recomendados
  const adicionarConteudo = (conteudo: Omit<ConteudoRecomendado, "id" | "dataCriacao">) => {
    const novoConteudo = {
      ...conteudo,
      id: uuidv4(),
      dataCriacao: new Date().toISOString()
    };
    setConteudos(prev => [...prev, novoConteudo]);
    toast.success("Conteúdo adicionado com sucesso!");
  };

  const editarConteudo = (id: string, conteudo: Omit<ConteudoRecomendado, "id" | "dataCriacao">) => {
    setConteudos(prev => 
      prev.map(c => c.id === id ? { ...conteudo, id, dataCriacao: prev.find(item => item.id === id)?.dataCriacao || new Date().toISOString() } : c)
    );
    toast.success("Conteúdo atualizado com sucesso!");
  };

  const excluirConteudo = (id: string) => {
    setConteudos(prev => prev.filter(c => c.id !== id));
    toast.success("Conteúdo removido com sucesso!");
  };

  // CRUD para Dicas e Hacks
  const adicionarDica = (dica: Omit<DicaHack, "id" | "dataCriacao" | "curtidas">) => {
    const novaDica = {
      ...dica,
      id: uuidv4(),
      dataCriacao: new Date().toISOString(),
      curtidas: 0
    };
    setDicas(prev => [...prev, novaDica]);
    toast.success("Dica adicionada com sucesso!");
  };

  const editarDica = (id: string, dica: Omit<DicaHack, "id" | "dataCriacao" | "curtidas">) => {
    setDicas(prev => 
      prev.map(d => d.id === id ? {
        ...dica,
        id,
        dataCriacao: prev.find(item => item.id === id)?.dataCriacao || new Date().toISOString(),
        curtidas: prev.find(item => item.id === id)?.curtidas || 0
      } : d)
    );
    toast.success("Dica atualizada com sucesso!");
  };

  const excluirDica = (id: string) => {
    setDicas(prev => prev.filter(d => d.id !== id));
    toast.success("Dica removida com sucesso!");
  };

  const curtirDica = (id: string) => {
    setDicas(prev => 
      prev.map(d => d.id === id ? { ...d, curtidas: d.curtidas + 1 } : d)
    );
  };

  // CRUD para Quizzes e Enquetes
  const adicionarQuiz = (quiz: NovoQuiz) => {
    const novoQuiz = {
      ...quiz,
      id: uuidv4(),
      dataCriacao: new Date().toISOString(),
      respostas: []
    };
    setQuizzes(prev => [...prev, novoQuiz]);
    toast.success("Enquete criada com sucesso!");
  };

  const editarQuiz = (quiz: Quiz) => {
    setQuizzes(prev => 
      prev.map(q => q.id === quiz.id ? quiz : q)
    );
    toast.success("Enquete atualizada com sucesso!");
  };

  const excluirQuiz = (id: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
    toast.success("Enquete removida com sucesso!");
  };

  const votarQuiz = (quizId: string, opcaoId: string) => {
    const usuarioId = `user-${Math.random().toString(36).substr(2, 9)}`; // Simulando ID de usuário
    
    setQuizzes(prev => 
      prev.map(quiz => {
        if (quiz.id === quizId) {
          // Adicionar resposta do usuário
          const novaResposta: RespostaUsuario = {
            usuarioId,
            opcaoId,
            dataResposta: new Date().toISOString()
          };
          
          // Incrementar votos na opção selecionada
          const opcoesAtualizadas = quiz.opcoes.map(opcao => 
            opcao.id === opcaoId 
              ? { ...opcao, votos: opcao.votos + 1 } 
              : opcao
          );
          
          return {
            ...quiz,
            opcoes: opcoesAtualizadas,
            respostas: [...quiz.respostas, novaResposta]
          };
        }
        return quiz;
      })
    );
    
    toast.success("Voto registrado com sucesso!");
  };

  const alternarAtivoQuiz = (quizId: string, ativo: boolean) => {
    setQuizzes(prev => 
      prev.map(quiz => {
        if (quiz.id === quizId) {
          return {
            ...quiz,
            ativo,
            dataEncerramento: !ativo ? new Date().toISOString() : undefined
          };
        }
        return quiz;
      })
    );
    
    toast.success(ativo ? "Enquete ativada com sucesso!" : "Enquete encerrada com sucesso!");
  };

  return {
    // Aniversariantes
    aniversariantesDoDia,
    aniversariantesDaSemana,
    aniversariantesDoMes,
    adicionarAniversariante,
    editarAniversariante,
    excluirAniversariante,
    
    // Conteúdos Recomendados
    conteudosFiltrados,
    filtroConteudo,
    setFiltroConteudo,
    adicionarConteudo,
    editarConteudo,
    excluirConteudo,
    
    // Dicas e Hacks
    dicasFiltradas,
    filtroDica,
    setFiltroDica,
    adicionarDica,
    editarDica,
    excluirDica,
    curtirDica,
    
    // Quizzes e Enquetes
    quizzes,
    filtroQuiz,
    setFiltroQuiz,
    adicionarQuiz,
    editarQuiz,
    excluirQuiz,
    votarQuiz,
    alternarAtivoQuiz
  };
};
