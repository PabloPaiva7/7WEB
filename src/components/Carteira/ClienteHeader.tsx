
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, DollarSign } from "lucide-react";

interface ClienteHeaderProps {
  cliente: {
    contrato: string;
    situacao: string | null;
    banco: string | null;
    escritorio: string | null;
    codigo: string | null;
    data: string | null;
    valor_cliente: number | null;
  };
}

export const ClienteHeader = ({ cliente }: ClienteHeaderProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{cliente.contrato}</h2>
            </div>
            
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              cliente.situacao === "Em andamento" 
                ? "bg-blue-100 text-blue-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {cliente.situacao || 'Pendente'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-sm text-muted-foreground">Banco</p>
                <p className="font-medium">{cliente.banco || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Escritório</p>
                <p className="font-medium">{cliente.escritorio || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Código</p>
                <p className="font-medium">{cliente.codigo || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Entrada</p>
                <p className="font-medium">
                  {cliente.data ? new Date(cliente.data).toLocaleDateString('pt-BR') : "Não informado"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-lg space-y-3">
            <DollarSign className="h-8 w-8 text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Valor</p>
            <p className="text-3xl font-bold text-primary">
              {cliente.valor_cliente 
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(cliente.valor_cliente)
                : 'R$ 0,00'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
