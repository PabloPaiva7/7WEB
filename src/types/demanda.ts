
export type Demanda = {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'encaminhado' | 'confirmado' | 'finalizado';
  prioridade: 'baixa' | 'media' | 'alta';
  criacao: Date;
  inicioProcessamento?: Date | null;
  conclusao?: Date | null;
  tempoProcessamento?: number | null; // tempo em milissegundos
};
