
import { Cliente } from "@/components/Carteira/ClientesTable";

export interface FilterState {
  banco: string;
  escritorio: string;
  prazo: string;
}

export interface HistoricoItem {
  data: string;
  acao: string;
}

export interface Estatisticas {
  totalClientes: number;
  porSituacao: Record<string, number>;
  porBanco: Record<string, number>;
  valorTotal: number;
  mediaPrazo: number;
}

export interface ColumnConfigItem {
  label: string;
  type: string;
  format?: (value: string) => string;
  validate?: (value: string) => string;
}

export type ColumnConfig = Record<string, ColumnConfigItem>;

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
