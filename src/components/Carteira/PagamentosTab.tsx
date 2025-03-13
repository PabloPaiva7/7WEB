
import React from "react";
import { EtapasPagamentoCard } from "./EtapasPagamentoCard";

interface PagamentosTabProps {
  ultimoPagamento: string | null;
  clienteId: string;
}

export const PagamentosTab = ({ ultimoPagamento, clienteId }: PagamentosTabProps) => {
  return (
    <div className="space-y-6">
      <EtapasPagamentoCard clienteId={clienteId} />
    </div>
  );
};
