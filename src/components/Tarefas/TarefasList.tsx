
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  Clock, 
  Tag, 
  Check, 
  PlayCircle, 
  CalendarClock,
  AlertTriangle,
} from "lucide-react";
import { Tarefa, StatusTarefa } from "@/types/tarefa.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TarefasListProps {
  tarefas: Tarefa[];
  onEdit: (tarefa: Tarefa) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: StatusTarefa) => void;
}

const TarefasList = ({ tarefas, onEdit, onDelete, onChangeStatus }: TarefasListProps) => {
  const getPrioridadeBadgeClass = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "bg-red-500 hover:bg-red-600";
      case "media":
        return "bg-amber-500 hover:bg-amber-600";
      case "baixa":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-slate-500 hover:bg-slate-600";
    }
  };

  const formatarData = (dataIso: string | null) => {
    if (!dataIso) return "Sem prazo";
    return format(new Date(dataIso), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const isPrazoPróximo = (prazo: string | null) => {
    if (!prazo) return false;
    const dataLimite = new Date(prazo);
    const hoje = new Date();
    const diferençaDias = Math.ceil((dataLimite.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    return diferençaDias <= 3 && diferençaDias >= 0;
  };

  const isPrazoVencido = (prazo: string | null) => {
    if (!prazo) return false;
    const dataLimite = new Date(prazo);
    const hoje = new Date();
    return dataLimite < hoje;
  };

  return (
    <div className="space-y-4">
      {tarefas.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Nenhuma tarefa encontrada</p>
        </div>
      ) : (
        tarefas.map((tarefa) => (
          <Card 
            key={tarefa.id} 
            className={`transition-all ${tarefa.status === "concluida" ? "opacity-75" : ""}`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-1 mr-2">{tarefa.titulo}</CardTitle>
                <Badge className={getPrioridadeBadgeClass(tarefa.prioridade)}>
                  {tarefa.prioridade === "alta" ? "Alta" : 
                    tarefa.prioridade === "media" ? "Média" : "Baixa"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{tarefa.descricao}</p>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center text-xs text-gray-500">
                  <Tag className="h-3.5 w-3.5 mr-1" />
                  {tarefa.categoria || "Sem categoria"}
                </div>
                
                <div className="flex items-center text-xs">
                  <CalendarClock className="h-3.5 w-3.5 mr-1 text-gray-500" />
                  <span className={`
                    ${isPrazoVencido(tarefa.prazo) && tarefa.status !== "concluida" ? "text-red-600 font-medium" : "text-gray-500"}
                    ${isPrazoPróximo(tarefa.prazo) && tarefa.status !== "concluida" && !isPrazoVencido(tarefa.prazo) ? "text-amber-600 font-medium" : ""}
                  `}>
                    {formatarData(tarefa.prazo)}
                    {isPrazoVencido(tarefa.prazo) && tarefa.status !== "concluida" && (
                      <span className="ml-1"><AlertTriangle className="h-3.5 w-3.5 inline text-red-600" /></span>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 flex flex-wrap gap-2">
              {tarefa.status === "pendente" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onChangeStatus(tarefa.id, "em_andamento")}
                >
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Iniciar
                </Button>
              )}
              
              {tarefa.status === "em_andamento" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onChangeStatus(tarefa.id, "concluida")}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Concluir
                </Button>
              )}
              
              {tarefa.status === "concluida" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onChangeStatus(tarefa.id, "pendente")}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Reabrir
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit(tarefa)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onDelete(tarefa.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default TarefasList;
