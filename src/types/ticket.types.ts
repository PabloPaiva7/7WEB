
export interface TicketProgresso {
  id: string;
  ticketId: string;
  data: string;
  descricao: string;
  usuario: string;
}

export type TicketStatus = 'novo' | 'encaminhado' | 'confirmado' | 'finalizado';

export interface Ticket {
  id: string;
  clienteNome: string;
  clienteContato: string;
  oferta: string;
  valor: number;
  data: string;
  banco: string;
  status: TicketStatus;
  atendente: string;
  progressos: TicketProgresso[];
}
