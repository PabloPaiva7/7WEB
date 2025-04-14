
import { Demanda } from "@/types/demanda";
import { DemandaCard } from "@/components/Demandas/DemandaCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusColumnsProps {
  novos: Demanda[];
  emAndamento: Demanda[];
  encaminhados: Demanda[];
  confirmados: Demanda[];
  finalizados: Demanda[];
  handleDrag: (id: string, status: Demanda['status']) => void;
  onEditDemanda: (demanda: Demanda) => void;
  onDeleteDemanda: (id: string) => void;
  formatTempo: (tempo: number | null | undefined) => string;
  onAddDemanda: () => void;
}

export function StatusColumns({
  novos,
  emAndamento,
  encaminhados,
  confirmados,
  finalizados,
  handleDrag,
  onEditDemanda,
  onDeleteDemanda,
  formatTempo,
  onAddDemanda
}: StatusColumnsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <DemandasColumn 
        title="Novos" 
        color="bg-amber-500" 
        demandas={novos} 
        onChangeStatus={(id, status) => handleDrag(id, status)}
        onEdit={onEditDemanda}
        onDelete={onDeleteDemanda}
        formatTempo={formatTempo}
        acceptDropStatus="pendente"
        showMoveToEncaminhado={true}
        onAddDemanda={onAddDemanda}
      />
      <DemandasColumn 
        title="Em Andamento" 
        color="bg-blue-500" 
        demandas={emAndamento} 
        onChangeStatus={(id, status) => handleDrag(id, status)}
        onEdit={onEditDemanda}
        onDelete={onDeleteDemanda}
        formatTempo={formatTempo}
        acceptDropStatus="em_andamento"
        showMoveToConfirmado={true}
      />
      <DemandasColumn 
        title="Encaminhados" 
        color="bg-yellow-500" 
        demandas={encaminhados} 
        onChangeStatus={(id, status) => handleDrag(id, status)}
        onEdit={onEditDemanda}
        onDelete={onDeleteDemanda}
        formatTempo={formatTempo}
        acceptDropStatus="encaminhado"
        showMoveToConfirmado={true}
      />
      <DemandasColumn 
        title="Confirmados" 
        color="bg-purple-500" 
        demandas={confirmados} 
        onChangeStatus={(id, status) => handleDrag(id, status)}
        onEdit={onEditDemanda} 
        onDelete={onDeleteDemanda}
        formatTempo={formatTempo}
        acceptDropStatus="confirmado"
        showMoveToFinalizado={true}
      />
      <DemandasColumn 
        title="Finalizados" 
        color="bg-green-500" 
        demandas={finalizados} 
        onChangeStatus={(id, status) => handleDrag(id, status)}
        onEdit={onEditDemanda}
        onDelete={onDeleteDemanda}
        formatTempo={formatTempo}
        acceptDropStatus="finalizado"
      />
    </div>
  );
}

interface DemandasColumnProps {
  title: string;
  color?: string;
  demandas: Demanda[];
  onChangeStatus: (id: string, status: Demanda['status']) => void;
  onEdit: (demanda: Demanda) => void;
  onDelete: (id: string) => void;
  formatTempo: (tempo: number | null | undefined) => string;
  acceptDropStatus?: Demanda['status'];
  showMoveToEncaminhado?: boolean;
  showMoveToConfirmado?: boolean;
  showMoveToFinalizado?: boolean;
  onAddDemanda?: () => void;
}

function DemandasColumn({ 
  title, 
  color, 
  demandas,
  onChangeStatus,
  onEdit,
  onDelete,
  formatTempo,
  acceptDropStatus,
  showMoveToEncaminhado = false,
  showMoveToConfirmado = false,
  showMoveToFinalizado = false,
  onAddDemanda
}: DemandasColumnProps) {
  
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
    if (demandaId && acceptDropStatus) {
      onChangeStatus(demandaId, acceptDropStatus);
    }
  };

  return (
    <Card 
      className={cn(
        `min-w-[280px] max-w-full flex flex-col h-full bg-slate-50 dark:bg-slate-900 rounded-lg p-3 border-t-4`,
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
                  onChangeStatus={onChangeStatus}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  showMoveToEncaminhado={showMoveToEncaminhado}
                  showMoveToConfirmado={showMoveToConfirmado}
                  showMoveToFinalizado={showMoveToFinalizado}
                />
                {demanda.inicioProcessamento && (
                  <div className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400 pr-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTempo(demanda.tempoProcessamento)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
