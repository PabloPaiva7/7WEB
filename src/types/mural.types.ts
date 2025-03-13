
export type TipoAnuncio = "treinamento" | "corporativo" | "mudanca" | "chamada" | "outro";

export type TipoConteudo = "livro" | "filme" | "serie" | "curso" | "versiculo";

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
