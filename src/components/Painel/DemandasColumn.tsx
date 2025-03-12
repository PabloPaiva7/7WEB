
import { DemandaCard } from "./DemandaCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Demanda } from "@/types/demanda";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface DemandasColumnProps {
  title: string;
  color?: string;
  demandas: Demanda[];
  onSelectDemanda?: (id: string) => void;
  onChangeStatus?: (id: string, status: Demanda['status']) => void;
  onEdit?: (demanda: Demanda) => void;
  onDelete?: (id: string) => void;
  formatTempo?: (tempo: number | null | undefined) => string;
  acceptDropStatus?: Demanda['status'];
  showMoveToEncaminhado?: boolean;
  showMoveToConfirmado?: boolean;
  showMoveToFinalizado?: boolean;
  fullWidth?: boolean;
}

export const DemandasColumn = ({ 
  title, 
  color, 
  demandas,
  onSelectDemanda,
  onChangeStatus,
  onEdit,
  onDelete,
  formatTempo,
  acceptDropStatus,
  showMoveToEncaminhado = false,
  showMoveToConfirmado = false,
  showMoveToFinalizado = false,
  fullWidth = false
}: DemandasColumnProps) => {
  const isMobile = useIsMobile();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const demandaId = e.dataTransfer.getData("demandaId");
    if (demandaId && onChangeStatus && acceptDropStatus) {
      onChangeStatus(demandaId, acceptDropStatus);
    }
  };

  return (
    <div 
      className={`${fullWidth ? 'w-full' : 'min-w-[280px] max-w-full'} flex flex-col h-full bg-slate-50 rounded-lg p-3`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
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
              <div key={demanda.id} className="space-y-1">
                <DemandaCard 
                  demanda={demanda} 
                  onSelect={onSelectDemanda ? () => onSelectDemanda(demanda.id) : undefined}
                  onChangeStatus={onChangeStatus || (() => {})}
                  onEdit={onEdit || (() => {})}
                  onDelete={onDelete || (() => {})}
                  showMoveToEncaminhado={showMoveToEncaminhado}
                  showMoveToConfirmado={showMoveToConfirmado}
                  showMoveToFinalizado={showMoveToFinalizado}
                />
                {demanda.inicioProcessamento && (
                  <div className="flex items-center justify-end text-xs text-gray-500 pr-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTempo ? formatTempo(demanda.tempoProcessamento) : ""}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
