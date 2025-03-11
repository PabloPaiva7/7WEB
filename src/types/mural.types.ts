
export type TipoAnuncio = "treinamento" | "corporativo" | "mudanca" | "chamada" | "outro";

export interface Anuncio {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: TipoAnuncio;
  dataPublicacao: string; // ISO date
  dataEvento?: string; // ISO date, optional for events with specific dates
  autor: string;
  importante: boolean;
}

export type NovoAnuncio = Omit<Anuncio, "id" | "dataPublicacao"> & {
  id?: string;
  dataPublicacao?: string;
};
