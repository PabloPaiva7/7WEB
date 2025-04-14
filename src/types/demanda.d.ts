
export type ColaboradorDemanda = {
  id: string;
  nome: string;
  avatar?: string;
  email: string;
};

export type Demanda = {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'encaminhado' | 'confirmado' | 'finalizado';
  prioridade: 'baixa' | 'media' | 'alta';
  criacao: Date;
  inicioProcessamento?: Date | null;
  conclusao?: Date | null;
  tempoProcessamento?: number | null; // tempo em milissegundos
  responsavel?: string;
  colaborador?: ColaboradorDemanda;
  lider?: string;
  categoria?: string;
  comentarios?: DemandaComentario[];
  arquivos?: DemandaArquivo[];
};

export type DemandaComentario = {
  id: string;
  texto: string;
  criadoPor: string;
  criadoEm: Date;
};

export type DemandaArquivo = {
  id: string;
  nome: string;
  url: string;
  tamanho: number;
  tipo: string;
  adicionadoPor: string;
  adicionadoEm: Date;
};

export type NovaDemanda = Omit<Demanda, 'id' | 'criacao' | 'inicioProcessamento' | 'conclusao' | 'tempoProcessamento' | 'comentarios' | 'arquivos'>;
