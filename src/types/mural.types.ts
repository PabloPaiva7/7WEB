
export type TipoAnuncio = "treinamento" | "corporativo" | "mudanca" | "chamada" | "outro";

export type TipoConteudo = "livro" | "filme" | "serie" | "curso" | "versiculo";

export type CategoriaDica = "trabalho" | "produtividade" | "tecnologia" | "bem-estar" | "outro";

export type TipoQuiz = "opiniao" | "conhecimento" | "preferencia" | "feedback" | "outro";

export interface Participante {
  id: string;
  nomeCompleto: string;
  email: string;
  departamento: string;
  observacoes?: string;
  dataInscricao: string;
}

export interface Aniversariante {
  id: string;
  nome: string;
  departamento: string;
  data: string; // formato ISO
  foto?: string;
}

export interface ConteudoRecomendado {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoConteudo;
  autor?: string;
  imagem?: string;
  link?: string;
  dataCriacao: string;
}

export interface DicaHack {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: CategoriaDica;
  autor: string;
  dataCriacao: string;
  curtidas: number;
}

export interface OpcaoQuiz {
  id: string;
  texto: string;
  votos: number;
}

export interface RespostaUsuario {
  usuarioId: string;
  opcaoId: string;
  dataResposta: string;
}

export interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoQuiz;
  opcoes: OpcaoQuiz[];
  ativo: boolean;
  multiplaEscolha: boolean;
  dataCriacao: string;
  dataEncerramento?: string;
  autor: string;
  respostas: RespostaUsuario[];
}

export type NovoQuiz = Omit<Quiz, "id" | "dataCriacao" | "respostas"> & {
  id?: string;
  dataCriacao?: string;
  respostas?: RespostaUsuario[];
};

export interface Anuncio {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: TipoAnuncio;
  dataPublicacao: string;
  dataEvento?: string;
  autor: string;
  importante: boolean;
  permitirInscricao: boolean;
  participantes?: Participante[];
  imagem?: string; // URL da imagem ou base64
}

export type NovoAnuncio = Omit<Anuncio, "id" | "dataPublicacao" | "participantes"> & {
  id?: string;
  dataPublicacao?: string;
};
