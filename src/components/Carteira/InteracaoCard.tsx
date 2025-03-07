
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteracaoCardProps {
  id: string;
  data: string;
  tipo: "pagamento" | "negociacao" | "contato";
  conteudo: string;
  atendente: string;
  onDelete: (id: string) => void;
}

export const InteracaoCard = ({ 
  id, 
  data, 
  tipo, 
  conteudo, 
  atendente,
  onDelete 
}: InteracaoCardProps) => {
  const getCardColor = () => {
    switch(tipo) {
      case "pagamento": return "bg-green-50 border-green-200";
      case "negociacao": return "bg-blue-50 border-blue-200";
      case "contato": return "bg-yellow-50 border-yellow-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getTipoLabel = () => {
    switch(tipo) {
      case "pagamento": return "Pagamento";
      case "negociacao": return "Negociação";
      case "contato": return "Contato";
      default: return "Interação";
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getCardColor()} relative hover:shadow-md transition-shadow`}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => onDelete(id)}
      >
        <X className="h-3 w-3" />
      </Button>
      
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-start">
          <span className="text-xs font-medium text-muted-foreground">{getTipoLabel()}</span>
          <span className="text-xs text-muted-foreground">{new Date(data).toLocaleDateString('pt-BR')}</span>
        </div>
        
        <p className="text-sm">{conteudo}</p>
        
        <div className="flex justify-end">
          <span className="text-xs italic text-muted-foreground">Atendente: {atendente}</span>
        </div>
      </div>
    </div>
  );
};
