
import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoricoHeaderProps {
  handleExportCSV: () => void;
  handleExportPDF: () => void;
}

export const HistoricoHeader = ({ handleExportCSV, handleExportPDF }: HistoricoHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Histórico de Movimentações</h1>
        <p className="text-muted-foreground">
          Acompanhe todas as alterações e atividades nos contratos com autenticidade jurídica
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Exportar CSV
        </Button>
        <Button onClick={handleExportPDF} variant="outline" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Exportar PDF
        </Button>
      </div>
    </div>
  );
};
