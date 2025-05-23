
export interface Documento {
  id: number;
  nome: string;
  data: string;
  tipo: string;
  url?: string;
  // Add new fields for document authentication
  protocolo?: string;
  autenticado?: boolean;
  dataAutenticacao?: string;
  hash?: string;
  conteudo?: string;
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
  "termos_de_distratos",
  "notificacoes_extrajudiciais"
];

// Mapeamento de nomes para exibição
export const pastasDisplay: Record<string, string> = {
  "minutas": "MINUTAS",
  "procuracoes": "PROCURAÇÕES",
  "prints": "PRINTS",
  "boletos": "BOLETOS",
  "comprovantes": "COMPROVANTES",
  "termos_de_distratos": "TERMOS DE DISTRATOS",
  "notificacoes_extrajudiciais": "NOTIFICAÇÕES EXTRAJUDICIAIS"
};
