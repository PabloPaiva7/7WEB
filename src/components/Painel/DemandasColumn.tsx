
import { DemandaCard } from "./DemandaCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Demanda } from "@/types/demanda";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  onAddDemanda?: () => void;
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
  fullWidth = false,
  onAddDemanda
}: DemandasColumnProps) => {
  const isMobile = useIsMobile();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Add a visual indicator for drop target
    e.currentTarget.classList.add('bg-slate-100', 'dark:bg-slate-800');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-slate-100', 'dark:bg-slate-800');
    const demandaId = e.dataTransfer.getData("demandaId");
    if (demandaId && onChangeStatus && acceptDropStatus) {
      onChangeStatus(demandaId, acceptDropStatus);
    }
  };

  return (
    <Card 
      className={cn(
        `${fullWidth ? 'w-full' : 'min-w-[280px] max-w-full'} flex flex-col h-full bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border-t-4`,
        color ? `border-t-${color.replace('bg-', '')}` : ''
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm flex items-center dark:text-gray-200">
          <div className={`w-3 h-3 rounded-full mr-2 ${color}`}></div>
          {title}
          <Badge variant="outline" className="ml-2 bg-white dark:bg-gray-800 dark:text-gray-200">
            {demandas.length}
          </Badge>
        </h3>
        {onAddDemanda && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full" 
            onClick={onAddDemanda}
            title="Adicionar demanda"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      <ScrollArea className="h-[400px] overflow-y-auto flex-grow pr-1">
        <div className="space-y-2 pr-2">
          {demandas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <p className="text-sm text-muted-foreground mb-2 dark:text-gray-400">Nenhuma demanda</p>
              {onAddDemanda && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={onAddDemanda}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
              )}
            </div>
          ) : (
            demandas.map((demanda) => (
              <div key={demanda.id} className="space-y-1 animate-fade-in">
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
                  <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400 pr-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTempo ? formatTempo(demanda.tempoProcessamento) : ""}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
