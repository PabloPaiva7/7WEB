
import React from "react";
import { Siren } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface DemandaAlertProps {
  demanda: string;
  onResolve: () => void;
}

export const DemandaAlert: React.FC<DemandaAlertProps> = ({ demanda, onResolve }) => {
  const handleResolve = () => {
    toast({
      title: "Demanda resolvida",
      description: `A demanda "${demanda}" foi marcada como resolvida.`,
    });
    onResolve();
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-pulse w-80">
      <Alert variant="destructive" className="border-red-500 bg-red-50">
        <div className="flex items-center gap-2">
          <Siren className="h-5 w-5 text-red-600 animate-pulse" />
          <AlertTitle className="text-red-600">Alerta de Demanda</AlertTitle>
        </div>
        <AlertDescription className="mt-2 text-red-600">
          <p className="mb-2">{demanda}</p>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleResolve}
            className="mt-2 w-full"
          >
            Marcar como Resolvida
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};
