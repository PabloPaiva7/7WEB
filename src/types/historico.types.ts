
import { MovimentacaoHistorico as AgendaMovimentacaoHistorico } from './agenda.types';

export type MovimentacaoHistorico = AgendaMovimentacaoHistorico;

export interface HistoricoFilterState {
  searchTerm: string;
  tipoFilter: string;
  moduloFilter: string;
  statusFilter: string;
  contratoClienteFilter: string;
  dataRange?: {
    from?: Date;
    to?: Date;
  };
}

export interface HistoricoSortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}
