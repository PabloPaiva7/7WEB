// src/components/Painel/DemandasColumn.tsx
import { DemandaCard } from "./DemandaCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMobile } from "@/hooks/useMobile";

interface Demanda {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface DemandasColumnProps {
  titulo: string;
  cor: string;
  demandas: Demanda[];
  onSelectDemanda?: (id: number) => void;
}

export const DemandasColumn = ({ 
  titulo, 
  cor, 
  demandas, 
  onSelectDemanda 
}: DemandasColumnProps) => {
  const { isMobile } = useMobile();

  return (
    <div className="min-w-[280px] max-w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${cor}`}></div>
          {titulo}
          <span className="ml-2 text-xs text-muted-foreground">
            ({demandas.length})
          </span>
        </h3>
      </div>

      <ScrollArea className={`${isMobile ? 'h-[calc(100vh-220px)]' : 'h-[calc(100vh-180px)]'}`}>
        <div className="pr-4 space-y-2">
          {demandas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center p-4">Nenhuma demanda</p>
          ) : (
            demandas.map((demanda) => (
              <DemandaCard 
                key={demanda.id} 
                demanda={demanda} 
                onClick={() => onSelectDemanda && onSelectDemanda(demanda.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
