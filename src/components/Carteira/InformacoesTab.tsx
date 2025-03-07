
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Phone, Calendar } from "lucide-react";

interface InformacoesTabProps {
  cliente: {
    contato: string | null;
    entrada: string | null;
    prazo: string | null;
    negociacao: string | null;
    resolucao: string | null;
  };
}

export const InformacoesTab = ({ cliente }: InformacoesTabProps) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Phone className="mr-2 h-4 w-4" />
          Informações de Contato
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Contato</p>
            <p className="font-medium">{cliente.contato || "Não informado"}</p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <h3 className="text-lg font-semibold flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          Datas Importantes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Data de Entrada</p>
            <p className="font-medium">
              {cliente.entrada ? new Date(cliente.entrada).toLocaleDateString('pt-BR') : "Não informado"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Prazo</p>
            <p className="font-medium">
              {cliente.prazo ? new Date(cliente.prazo).toLocaleDateString('pt-BR') : "Não informado"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Negociação</p>
            <p className="font-medium">
              {cliente.negociacao ? new Date(cliente.negociacao).toLocaleDateString('pt-BR') : "Não informado"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Resolução</p>
            <p className="font-medium">
              {cliente.resolucao ? new Date(cliente.resolucao).toLocaleDateString('pt-BR') : "Não informado"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
