
export interface Documento {
  id: number;
  nome: string;
  data: string;
  tipo: string;
  url?: string;
}

export interface Pasta {
  id: number;
  nome: string;
  documentos: Documento[];
}

// Lista de pastas predefinidas que já foram criadas no Supabase
export const pastasPredefinidas = [
  "minutas",
  "procuracoes",
  "prints",
  "boletos",
  "comprovantes",
  "notificacoes_extrajudiciais"
];

// Mapeamento de nomes para exibição
export const pastasDisplay: Record<string, string> = {
  "minutas": "MINUTAS",
  "procuracoes": "PROCURAÇÕES",
  "prints": "PRINTS",
  "boletos": "BOLETOS",
  "comprovantes": "COMPROVANTES",
  "notificacoes_extrajudiciais": "NOTIFICAÇÕES EXTRAJUDICIAIS"
};
