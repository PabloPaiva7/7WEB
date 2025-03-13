
export type TipoAnuncio = "treinamento" | "corporativo" | "mudanca" | "chamada" | "outro";

export interface Participante {
  id: string;
  nomeCompleto: string;
  email: string;
  departamento: string;
  observacoes?: string;
  dataInscricao: string;
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
