
import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { DateRange } from 'react-day-picker';

interface HistoricoFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  contratoClienteFilter: string;
  setContratoClienteFilter: (value: string) => void;
  tipoFilter: string;
  setTipoFilter: (value: string) => void;
  moduloFilter: string;
  setModuloFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dataRange: DateRange | undefined;
  setDataRange: (value: DateRange | undefined) => void;
  contratosClientesUnicos: string[];
  tiposUnicos: string[];
  modulosUnicos: string[];
  statusUnicos: string[];
  exportarMovimentacoesContrato: (contratoCliente: string) => void;
}

export const HistoricoFilters = ({
  searchTerm,
  setSearchTerm,
  contratoClienteFilter,
  setContratoClienteFilter,
  tipoFilter,
  setTipoFilter,
  moduloFilter,
  setModuloFilter,
  statusFilter,
  setStatusFilter,
  dataRange,
  setDataRange,
  contratosClientesUnicos,
  tiposUnicos,
  modulosUnicos,
  statusUnicos,
  exportarMovimentacoesContrato
}: HistoricoFiltersProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filtros</CardTitle>
        <CardDescription>Refine a busca por movimentações de contratos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por contrato, cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={contratoClienteFilter} onValueChange={setContratoClienteFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Contrato/Cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os contratos</SelectItem>
              {contratosClientesUnicos.map(contratoCliente => (
                <SelectItem key={contratoCliente} value={contratoCliente}>
                  {contratoCliente}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            {contratoClienteFilter !== 'todos' && (
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => exportarMovimentacoesContrato(contratoClienteFilter)}
                title="Exportar todas as movimentações deste contrato"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select value={tipoFilter} onValueChange={setTipoFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de movimentação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              {tiposUnicos.map(tipo => (
                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={moduloFilter} onValueChange={setModuloFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Módulo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os módulos</SelectItem>
              {modulosUnicos.map(modulo => (
                <SelectItem key={modulo} value={modulo}>{modulo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {statusUnicos.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DatePickerWithRange 
            value={dataRange}
            onChange={(value) => setDataRange(value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
