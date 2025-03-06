
import { DemandaCard } from "./DemandaCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Demanda } from "@/types/demanda";

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
    <div className="min-w-[280px] max-w-full flex flex-col h-full bg-slate-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${color}`}></div>
          {title}
          <span className="ml-2 text-xs text-muted-foreground">
            ({demandas.length})
          </span>
        </h3>
      </div>

      <ScrollArea className="h-[400px] overflow-y-auto flex-grow">
        <div className="space-y-2 pr-2">
          {demandas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center p-4">Nenhuma demanda</p>
          ) : (
            demandas.map((demanda) => (
              <DemandaCard 
                key={demanda.id} 
                demanda={demanda} 
                onSelect={() => onSelectDemanda && onSelectDemanda(demanda.id)}
                onChangeStatus={(id, status) => {}} 
                onEdit={() => {}} 
                onDelete={() => {}} 
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
