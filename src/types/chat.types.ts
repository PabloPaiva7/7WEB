
export interface Usuario {
  id: string;
  nome: string;
  avatar?: string;
}

export interface Mensagem {
  id: string;
  conteudo: string;
  usuario: Usuario;
  timestamp: string;
  lida: boolean;
}

export interface Conversa {
  id: string;
  participantes: Usuario[];
  ultimaMensagem?: Mensagem;
  naoLidas: number;
}

export interface Demanda {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  atribuido?: Usuario;
  status: 'pendente' | 'em_progresso' | 'concluida';
  dataCriacao: string;
  dataConclusao?: string;
}

export interface Ideia {
  id: string;
  titulo: string;
  descricao: string;
  autor: Usuario;
  likes: number;
  comentarios: number;
  dataCriacao: string;
  tags: string[];
}
