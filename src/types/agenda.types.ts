
// Interface para cliente
export interface Cliente {
  id: string;
  nome: string;
  contrato: string;
  tipoContrato: string;
  telefone: string;
  email: string;
  regiao: string;
  escritorio: string;
  status: string;
  ultimoContato: string;
  proximoContato: string;
}

// Interface para ramais
export interface Ramal {
  id: string;
  departamento: string;
  responsavel: string;
  numero: string;
  email: string;
}

// Interface para assessorias
export interface Assessoria {
  id: string;
  nome: string;
  contato: string;
  telefone: string;
  email: string;
  endereco: string;
  horarioFuncionamento: {
    inicio: string; // formato HH:MM
    fim: string; // formato HH:MM
    diasFuncionamento: number[]; // 0 = domingo, 1 = segunda, ..., 6 = sábado
  };
}

// Interface para bancos
export interface Banco {
  id: string;
  nome: string;
  contato: string;
  telefone: string;
  email: string;
  website: string;
}

// Interface para links úteis
export interface LinkUtil {
  id: string;
  nome: string;
  url: string;
  categoria: string;
  descricao: string;
}

// Interface para páginas jurídicas
export interface PaginaJuridica {
  id: string;
  titulo: string;
  descricao: string;
  link: string;
  categoria: string;
}

// Interface para senhas
export interface Senha {
  id: string;
  nome: string;
  url: string;
  usuario: string;
  senha: string;
  observacoes?: string;
  ultimaAtualizacao: string;
}
