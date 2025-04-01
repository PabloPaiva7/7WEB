
export interface Cliente {
  id: string;
  nome: string;
  contrato: string;
  tipoContrato: string;
  email: string;
  telefone: string;
  regiao: string;
  escritorio: string;
  status: string;
  responsavel?: string; // Campo para o usuário responsável
  proximoContato: string;
}

export interface Banco {
  id: string;
  nome: string;
  contato: string;
  telefone: string;
  email: string;
  website: string;
}

export interface Ramal {
  id: string;
  departamento: string;
  responsavel: string;
  numero: string;
  email: string;
}

export interface Assessoria {
  id: string;
  nome: string;
  contato: string;
  telefone: string;
  email: string;
  endereco: string;
  horarioFuncionamento: {
    inicio: string;
    fim: string;
    diasFuncionamento: number[]; // Dias da semana (0 = Domingo, 1 = Segunda, etc.)
  };
}

export interface LinkUtil {
  id: string;
  nome: string;
  url: string;
  categoria: string;
  descricao: string;
}

export interface PaginaJuridica {
  id: string;
  titulo: string;
  descricao: string;
  link: string;
  categoria: string;
}
