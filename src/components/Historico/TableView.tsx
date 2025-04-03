
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Download, History } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Badge } from '@/components/ui/badge';
import { MovimentacaoHistorico } from '@/types/agenda.types';

interface SortConfig {
  key: string;
  direction: 'ascending' | 'descending';
}

interface TableViewProps {
  currentItems: MovimentacaoHistorico[];
  selectedItems: string[];
  handleSelectItem: (id: string) => void;
  handleSelectAll: () => void;
  sortConfig: SortConfig;
  requestSort: (key: string) => void;
  verificarAutenticidade: (protocolo: string) => void;
  exportarParaPDF: (items: MovimentacaoHistorico[], filename: string) => void;
  toast: any;
}

export const TableView = ({
  currentItems,
  selectedItems,
  handleSelectItem,
  handleSelectAll,
  sortConfig,
  requestSort,
  verificarAutenticidade,
  exportarParaPDF,
  toast
}: TableViewProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox 
                checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Selecionar todos"
              />
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('data')}>
              <div className="flex items-center">
                Data/Hora
                {sortConfig.key === 'data' && (
                  sortConfig.direction === 'ascending' 
                    ? <ArrowUpWideNarrow className="ml-2 h-4 w-4" /> 
                    : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('contrato')}>
              <div className="flex items-center">
                Contrato/Cliente
                {sortConfig.key === 'contrato' && (
                  sortConfig.direction === 'ascending' 
                    ? <ArrowUpWideNarrow className="ml-2 h-4 w-4" /> 
                    : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('tipo')}>
              <div className="flex items-center">
                Tipo
                {sortConfig.key === 'tipo' && (
                  sortConfig.direction === 'ascending' 
                    ? <ArrowUpWideNarrow className="ml-2 h-4 w-4" /> 
                    : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('modulo')}>
              <div className="flex items-center">
                Módulo
                {sortConfig.key === 'modulo' && (
                  sortConfig.direction === 'ascending' 
                    ? <ArrowUpWideNarrow className="ml-2 h-4 w-4" /> 
                    : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('usuario')}>
              <div className="flex items-center">
                Usuário
                {sortConfig.key === 'usuario' && (
                  sortConfig.direction === 'ascending' 
                    ? <ArrowUpWideNarrow className="ml-2 h-4 w-4" /> 
                    : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => requestSort('status')}>
              <div className="flex items-center">
                Status
                {sortConfig.key === 'status' && (
                  sortConfig.direction === 'ascending' 
                    ? <ArrowUpWideNarrow className="ml-2 h-4 w-4" /> 
                    : <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>Protocolo</TableHead>
            <TableHead>Status Campanha</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="h-24 text-center">
                Nenhum registro encontrado com os filtros aplicados.
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleSelectItem(item.id)}
                    aria-label={`Selecionar ${item.contrato}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{new Date(item.data).toLocaleDateString('pt-BR')}</div>
                  <div className="text-sm text-muted-foreground">{new Date(item.data).toLocaleTimeString('pt-BR')}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{item.contrato}</div>
                  <div className="text-sm text-muted-foreground">{item.cliente}</div>
                </TableCell>
                <TableCell>{item.tipo}</TableCell>
                <TableCell>{item.modulo}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={item.descricao}>
                    {item.descricao}
                  </div>
                </TableCell>
                <TableCell>{item.usuario}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  <div className="font-mono text-xs">{item.protocolo}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={item.statusCampanha ? "default" : "outline"}>
                    {item.statusCampanha ? "Sim" : "Não"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost" 
                      size="icon" 
                      onClick={() => verificarAutenticidade(item.protocolo)}
                      title="Verificar autenticidade"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Baixar PDF"
                      onClick={() => {
                        exportarParaPDF([item], `movimentacao-${item.protocolo}`);
                        toast({
                          title: "Exportação concluída",
                          description: "Registro exportado para PDF com sucesso."
                        });
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
