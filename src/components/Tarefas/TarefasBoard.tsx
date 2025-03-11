
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tarefa, StatusTarefa } from "@/types/tarefa.types";
import { Edit, Trash2, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TarefasBoardProps {
  tarefas: Tarefa[];
  onEdit: (tarefa: Tarefa) => void;
  onDelete: (id: string) => void;
  onChangeStatus: (id: string, status: StatusTarefa) => void;
}

const TarefasBoard = ({ tarefas, onEdit, onDelete, onChangeStatus }: TarefasBoardProps) => {
  // Filtrar tarefas por status
  const tarefasPendentes = tarefas.filter((tarefa) => tarefa.status === "pendente");
  const tarefasEmAndamento = tarefas.filter((tarefa) => tarefa.status === "em_andamento");
  const tarefasConcluidas = tarefas.filter((tarefa) => tarefa.status === "concluida");

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

  const TarefaCard = ({ tarefa }: { tarefa: Tarefa }) => {
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

    return (
      <Card className="mb-2 hover:shadow-md transition-shadow">
        <CardHeader className="py-3 px-4">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium line-clamp-1 mr-2">{tarefa.titulo}</CardTitle>
            <Badge className={`${getPrioridadeBadgeClass(tarefa.prioridade)} text-xs`}>
              {tarefa.prioridade === "alta" ? "Alta" : 
                tarefa.prioridade === "media" ? "Média" : "Baixa"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">{tarefa.descricao}</p>
          
          {tarefa.prazo && (
            <div className="flex items-center text-xs mb-2">
              <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
              <span className={`
                ${isPrazoVencido(tarefa.prazo) ? "text-red-600 font-medium" : "text-gray-500"}
                ${isPrazoPróximo(tarefa.prazo) && !isPrazoVencido(tarefa.prazo) ? "text-amber-600 font-medium" : ""}
              `}>
                {format(new Date(tarefa.prazo), "dd/MM/yyyy", { locale: ptBR })}
                {isPrazoVencido(tarefa.prazo) && (
                  <span className="ml-1"><AlertTriangle className="h-3.5 w-3.5 inline text-red-600" /></span>
                )}
              </span>
            </div>
          )}
          
          <div className="flex justify-end space-x-1 mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={() => onEdit(tarefa)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(tarefa.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only">Excluir</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const KanbanColumn = ({ 
    title, 
    tarefas, 
    accentColor 
  }: { 
    title: string; 
    tarefas: Tarefa[]; 
    accentColor: string;
  }) => (
    <div className="w-full">
      <div className={`rounded-t-md px-4 py-2 ${accentColor} text-white font-medium text-sm flex justify-between items-center`}>
        <span>{title}</span>
        <span className="text-xs bg-white text-gray-800 rounded-full px-2 py-0.5">{tarefas.length}</span>
      </div>
      <div className="bg-slate-50 rounded-b-md p-2 min-h-[200px]">
        {tarefas.length === 0 ? (
          <div className="flex items-center justify-center h-[100px] text-xs text-gray-400">
            Nenhuma tarefa
          </div>
        ) : (
          tarefas.map((tarefa) => (
            <TarefaCard key={tarefa.id} tarefa={tarefa} />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KanbanColumn 
        title="Pendentes" 
        tarefas={tarefasPendentes} 
        accentColor="bg-amber-500"
      />
      <KanbanColumn 
        title="Em Andamento" 
        tarefas={tarefasEmAndamento} 
        accentColor="bg-purple-500" 
      />
      <KanbanColumn 
        title="Concluídas" 
        tarefas={tarefasConcluidas} 
        accentColor="bg-green-500" 
      />
    </div>
  );
};

export default TarefasBoard;
