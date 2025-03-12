
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Demanda } from "@/types/demanda";
import { AlertTriangle, CheckCircle2, Clock, Flag, Send, FileCheck, Pencil, Trash } from "lucide-react";

interface DemandaCardProps {
  demanda: Demanda;
  onSelect?: (id: string) => void;
  onChangeStatus: (id: string, status: Demanda['status']) => void;
  onEdit: (demanda: Demanda) => void;
  onDelete: (id: string) => void;
  showMoveToEncaminhado?: boolean;
  showMoveToConfirmado?: boolean;
  showMoveToFinalizado?: boolean;
}

export const DemandaCard = ({
  demanda,
  onSelect,
  onChangeStatus,
  onEdit,
  onDelete,
  showMoveToEncaminhado = false,
  showMoveToConfirmado = false,
  showMoveToFinalizado = false
}: DemandaCardProps) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("demandaId", id);
  };

  return (
    <Card 
      className="p-3 bg-white shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={(e) => handleDragStart(e, demanda.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          {demanda.prioridade === 'alta' && (
            <Flag className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
          )}
          <div>
            <h3 className="text-sm font-medium line-clamp-1">{demanda.titulo}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{demanda.descricao}</p>
          </div>
        </div>
        <div className="flex flex-shrink-0 gap-1">
          {onSelect && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(demanda.id);
              }}
            >
              <AlertTriangle className="h-3 w-3 text-amber-500" />
            </Button>
          )}
          
          {showMoveToEncaminhado && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={(e) => {
                e.stopPropagation();
                onChangeStatus(demanda.id, 'encaminhado');
              }}
            >
              <Send className="h-3 w-3 text-blue-500" />
            </Button>
          )}
          
          {demanda.status === 'pendente' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={(e) => {
                e.stopPropagation();
                onChangeStatus(demanda.id, 'em_andamento');
              }}
            >
              <Clock className="h-3 w-3 text-purple-500" />
            </Button>
          )}
          
          {showMoveToConfirmado && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={(e) => {
                e.stopPropagation();
                onChangeStatus(demanda.id, 'confirmado');
              }}
            >
              <FileCheck className="h-3 w-3 text-purple-500" />
            </Button>
          )}
          
          {showMoveToFinalizado && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={(e) => {
                e.stopPropagation();
                onChangeStatus(demanda.id, 'finalizado');
              }}
            >
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(demanda);
            }}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(demanda.id);
            }}
          >
            <Trash className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
