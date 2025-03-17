
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Demanda } from "@/types/demanda";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Flag, 
  Send, 
  FileCheck, 
  Pencil, 
  Trash, 
  Tag, 
  User,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

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

  const getBorderColorByPriority = () => {
    switch (demanda.prioridade) {
      case 'alta': return 'border-l-4 border-l-red-500';
      case 'media': return 'border-l-4 border-l-yellow-500';
      case 'baixa': return 'border-l-4 border-l-green-500';
      default: return '';
    }
  };

  return (
    <Card 
      className={cn(
        "p-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing",
        getBorderColorByPriority()
      )}
      draggable
      onDragStart={(e) => handleDragStart(e, demanda.id)}
    >
      <div className="space-y-2">
        {/* Header with title and priority */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            {demanda.prioridade === 'alta' && (
              <Flag className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
            )}
            <div>
              <h3 className="text-sm font-medium line-clamp-1 text-gray-900 dark:text-gray-100">{demanda.titulo}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 dark:text-gray-300">{demanda.descricao}</p>
            </div>
          </div>
        </div>
        
        {/* Metadata */}
        <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
          {demanda.categoria && (
            <Badge variant="outline" className="flex items-center gap-1 px-2 py-0 h-5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <Tag className="h-3 w-3" />
              {demanda.categoria}
            </Badge>
          )}
          
          {demanda.responsavel && (
            <Badge variant="outline" className="flex items-center gap-1 px-2 py-0 h-5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <User className="h-3 w-3" />
              {demanda.responsavel}
            </Badge>
          )}
          
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-0 h-5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(demanda.criacao), { addSuffix: true, locale: ptBR })}
          </Badge>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end gap-1">
          {onSelect && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={(e) => {
                e.stopPropagation();
                onSelect(demanda.id);
              }}
              title="Marcar como prioritária"
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
              title="Encaminhar"
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
              title="Iniciar processamento"
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
              title="Confirmar recebimento"
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
              title="Finalizar"
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
            title="Editar"
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
            title="Excluir"
          >
            <Trash className="h-3 w-3 text-red-500" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

