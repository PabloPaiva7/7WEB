
// src/components/Painel/DemandasColumn.tsx
import { DemandaCard } from "./DemandaCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile"; // Correct import path
import { Demanda } from "@/types/demanda"; // Import the correct Demanda type

interface DemandasColumnProps {
  title: string;
  color?: string;
  demandas: Demanda[];
  onSelectDemanda?: (id: string) => void;
}

export const DemandasColumn = ({ 
  title, 
  color, 
  demandas, 
  onSelectDemanda 
}: DemandasColumnProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-w-[280px] max-w-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${color}`}></div>
          {title}
          <span className="ml-2 text-xs text-muted-foreground">
            ({demandas.length})
          </span>
        </h3>
      </div>

      <ScrollArea className={`${isMobile ? 'h-[350px]' : 'h-[400px]'} overflow-y-auto`}>
        <div className="pr-4 space-y-2">
          {demandas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center p-4">Nenhuma demanda</p>
          ) : (
            demandas.map((demanda) => (
              <DemandaCard 
                key={demanda.id} 
                demanda={demanda} 
                onSelect={() => onSelectDemanda && onSelectDemanda(demanda.id)}
                onChangeStatus={(id, status) => {}} // Add empty handler to match DemandaCard props
                onEdit={() => {}} // Add empty handler to match DemandaCard props
                onDelete={() => {}} // Add empty handler to match DemandaCard props
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
