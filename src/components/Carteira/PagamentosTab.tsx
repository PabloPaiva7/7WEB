
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { EtapasPagamentoCard } from "./EtapasPagamentoCard";

interface PagamentosTabProps {
  ultimoPagamento: string | null;
}

export const PagamentosTab = ({ ultimoPagamento }: PagamentosTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold flex items-center">
            <DollarSign className="mr-2 h-4 w-4" />
            Histórico de Pagamentos
          </h3>
          
          {ultimoPagamento ? (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Último Pagamento</p>
              <p className="font-medium">
                {new Date(ultimoPagamento).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum pagamento registrado</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <EtapasPagamentoCard clienteId="44e89f89-bef0-4dfd-9d11-7e20ccc48699" />
    </div>
  );
};
