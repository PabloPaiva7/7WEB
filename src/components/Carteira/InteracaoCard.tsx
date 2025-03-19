
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteracaoCardProps {
  id: string;
  data: string;
  tipo: "pagamento" | "negociacao" | "contato" | "assessoria";
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
      case "pagamento": return "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700";
      case "negociacao": return "bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700";
      case "contato": return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700";
      case "assessoria": return "bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-700";
      default: return "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700";
    }
  };

  const getTipoLabel = () => {
    switch(tipo) {
      case "pagamento": return "Pagamento";
      case "negociacao": return "Negociação";
      case "contato": return "Contato";
      case "assessoria": return "Assessoria";
      default: return "Interação";
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getCardColor()} relative card-hover`}>
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
          <span className="text-xs font-medium text-muted-foreground dark:text-[#D9B300]">{getTipoLabel()}</span>
          <span className="text-xs text-muted-foreground dark:text-[#D9B300]/80">{new Date(data).toLocaleDateString('pt-BR')}</span>
        </div>
        
        <p className="text-sm dark:text-[#D9B300]">{conteudo}</p>
        
        <div className="flex justify-end">
          <span className="text-xs italic text-muted-foreground dark:text-[#D9B300]/80">Atendente: {atendente}</span>
        </div>
      </div>
    </div>
  );
};
