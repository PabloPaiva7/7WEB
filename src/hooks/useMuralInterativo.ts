
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
  },
  {
    id: "aniv2",
    nome: "João Oliveira",
    departamento: "Vendas",
    data: "2023-07-20",
  },
  {
    id: "aniv3",
    nome: "Ana Costa",
    departamento: "Financeiro",
    data: "2023-07-25",
  },
  {
    id: "aniv4",
    nome: "Carlos Santos",
    departamento: "TI",
    data: "2023-08-05",
  },
  {
    id: "aniv5",
    nome: "Luiza Mendes",
    departamento: "RH",
    data: "2023-08-10",
  }
];

const mockConteudos: ConteudoRecomendado[] = [
  {
    id: "cont1",
    titulo: "O Poder do Hábito",
    descricao: "Livro sobre como criar novos hábitos e mudar comportamentos.",
    tipo: "livro",
    autor: "Charles Duhigg",
    dataCriacao: "2023-07-01",
    imagem: "https://m.media-amazon.com/images/I/61nTspM+BYL._AC_UF1000,1000_QL80_.jpg"
  },
  {
    id: "cont2",
    titulo: "Liderança em tempos de crise",
    descricao: "Curso online sobre gestão de equipes em situações desafiadoras.",
    tipo: "curso",
    dataCriacao: "2023-07-10",
    link: "https://www.coursera.org/"
  },
  {
    id: "cont3",
    titulo: "Succession",
    descricao: "Série sobre uma família disfuncional que controla um dos maiores conglomerados de mídia do mundo.",
    tipo: "serie",
    dataCriacao: "2023-07-15"
  }
];

const mockDicas: DicaHack[] = [
  {
    id: "dica1",
    titulo: "Atalhos do Excel",
    conteudo: "Use Ctrl+Shift+L para adicionar filtros rapidamente em suas tabelas.",
    categoria: "produtividade",
    autor: "André Luiz",
    dataCriacao: "2023-07-05",
    curtidas: 15
  },
  {
    id: "dica2",
    titulo: "Técnica Pomodoro",
    conteudo: "Trabalhe por 25 minutos e descanse por 5. Após 4 ciclos, faça uma pausa mais longa.",
    categoria: "trabalho",
    autor: "Camila Souza",
    dataCriacao: "2023-07-12",
    curtidas: 28
  },
  {
    id: "dica3",
    titulo: "Alongamentos para quem trabalha sentado",
    conteudo: "A cada hora, reserve 2 minutos para alongar o pescoço, ombros e costas para evitar dores.",
    categoria: "bem-estar",
    autor: "Paulo Mendes",
    dataCriacao: "2023-07-18",
    curtidas: 32
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

  const editarAniversariante = (aniversariante: Aniversariante) => {
    setAniversariantes(prev => 
      prev.map(a => a.id === aniversariante.id ? aniversariante : a)
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

  const editarConteudo = (conteudo: ConteudoRecomendado) => {
    setConteudos(prev => 
      prev.map(c => c.id === conteudo.id ? conteudo : c)
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

  const editarDica = (dica: DicaHack) => {
    setDicas(prev => 
      prev.map(d => d.id === dica.id ? dica : d)
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
