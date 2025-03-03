
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Demanda } from "@/types/demanda";
import { AlertTriangle, CheckCircle2, Clock, Flag, Inbox, Pencil, Trash } from "lucide-react";

interface DemandaCardProps {
  demanda: Demanda;
  onSelect?: (id: string) => void;
  onChangeStatus: (id: string, status: 'pendente' | 'em_andamento' | 'concluida') => void;
  onEdit: (demanda: Demanda) => void;
  onDelete: (id: string) => void;
  showMoveBackIcon?: boolean;
  showCompleteIcon?: boolean;
}

export const DemandaCard = ({
  demanda,
  onSelect,
  onChangeStatus,
  onEdit,
  onDelete,
  showMoveBackIcon = false,
  showCompleteIcon = false
}: DemandaCardProps) => {
  return (
    <Card className="p-3 bg-white">
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
              onClick={() => onSelect(demanda.id)}
            >
              <AlertTriangle className="h-3 w-3 text-amber-500" />
            </Button>
          )}
          
          {showMoveBackIcon && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => onChangeStatus(demanda.id, 'pendente')}
            >
              <Clock className="h-3 w-3 text-amber-500" />
            </Button>
          )}
          
          {demanda.status === 'pendente' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => onChangeStatus(demanda.id, 'em_andamento')}
            >
              <Inbox className="h-3 w-3 text-purple-500" />
            </Button>
          )}
          
          {showCompleteIcon && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={() => onChangeStatus(demanda.id, 'concluida')}
            >
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => onEdit(demanda)}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={() => onDelete(demanda.id)}
          >
            <Trash className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
