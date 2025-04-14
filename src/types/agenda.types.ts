
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

export interface Senha {
  id: string;
  sistema: string;
  nome: string;
  url: string;
  usuario: string;
  senha: string;
  observacoes: string;
  ultimaAtualizacao: string;
}

export interface EtapaPagamento {
  id: string;
  nome: string;
  prazo: string;
  status: string;
  valor: number;
  descricao?: string;
  concluido?: boolean;
  porcentagemConcluida?: number;
  clienteId?: string;
  dataInicio?: string;
  dataConclusao?: string;
}

export interface MovimentacaoHistorico {
  id: string;
  data: string;
  cliente: string;
  contrato: string;
  tipo: string;
  descricao: string;
  usuario: string;
  modulo: string;
  status: string;
  protocolo: string;
  statusCampanha?: string;
}
