
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash } from "lucide-react";

export interface ColumnConfig {
  label: string;
  type: string;
  format?: (value: string) => string;
  validate?: (value: string) => string;
}

export interface Cliente {
  id: number;
  data: string;
  resolucao: string;
  contrato: string;
  escritorio: string;
  ultimoPagamento: string;
  prazo: string;
  entrada: string;
  banco: string;
  codigo: string;
  valorCliente: string;
  contato: string;
  negociacao: string;
  situacao: string;
  [key: string]: string | number;
}

interface ClientesTableProps {
  clientes: Cliente[];
  columnConfig: Record<string, ColumnConfig>;
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

export const ClientesTable = ({
  clientes,
  columnConfig,
  onEdit,
  onDelete
}: ClientesTableProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {Object.entries(columnConfig).map(([key, config]) => (
                <TableHead key={key}>{config.label}</TableHead>
              ))}
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                {Object.entries(columnConfig).map(([key]) => (
                  <TableCell key={`${cliente.id}-${key}`}>
                    {cliente[key]}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(cliente)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(cliente)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
