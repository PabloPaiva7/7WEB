
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageSquare } from "lucide-react";
import { InteracaoCard } from "@/components/Carteira/InteracaoCard";
import { NovaInteracaoForm } from "@/components/Carteira/NovaInteracaoForm";

interface Interacao {
  id: string;
  data: string;
  tipo: "pagamento" | "negociacao" | "contato" | "assessoria";
  conteudo: string;
  atendente: string;
}

interface InteracoesTabProps {
  interacoes: Interacao[];
  onAddInteracao: (interacao: {
    tipo: "pagamento" | "negociacao" | "contato" | "assessoria";
    conteudo: string;
    atendente: string;
  }) => void;
  onRemoveInteracao: (id: string) => void;
}

export const InteracoesTab = ({ 
  interacoes, 
  onAddInteracao, 
  onRemoveInteracao 
}: InteracoesTabProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold flex items-center dark:text-[#D9B300]">
            <MessageSquare className="mr-2 h-4 w-4 dark:text-[#D9B300]" />
            Interações com o Cliente
          </h3>
        </div>
        
        <div className="mb-6">
          <NovaInteracaoForm onAdd={onAddInteracao} />
        </div>
        
        <Separator className="my-4" />
        
        {interacoes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {interacoes.map((interacao) => (
              <InteracaoCard
                key={interacao.id}
                id={interacao.id}
                data={interacao.data}
                tipo={interacao.tipo}
                conteudo={interacao.conteudo}
                atendente={interacao.atendente}
                onDelete={onRemoveInteracao}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground dark:text-[#D9B300]/50 mb-4" />
            <p className="text-muted-foreground dark:text-[#D9B300]/80">Nenhuma interação registrada</p>
            <p className="text-sm text-muted-foreground dark:text-[#D9B300]/60 mt-2">
              Adicione interações preenchendo o formulário acima
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
