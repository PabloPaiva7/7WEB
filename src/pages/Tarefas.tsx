
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TarefasList from "@/components/Tarefas/TarefasList";
import TarefasBoard from "@/components/Tarefas/TarefasBoard";
import TarefaForm from "@/components/Tarefas/TarefaForm";
import { Tarefa, NovaTarefa, StatusTarefa } from "@/types/tarefa.types";
import { v4 } from "@/lib/utils";
import { ListFilter, LayoutGrid } from "lucide-react";

const Tarefas = () => {
  const { toast } = useToast();
  const [tarefas, setTarefas] = useState<Tarefa[]>(() => {
    const savedTarefas = localStorage.getItem("tarefas");
    return savedTarefas ? JSON.parse(savedTarefas) : [];
  });
  const [tarefaParaEditar, setTarefaParaEditar] = useState<Tarefa | null>(null);
  const [activeTab, setActiveTab] = useState<StatusTarefa>("todas");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  const salvarTarefasNoLocalStorage = (tarefasAtualizadas: Tarefa[]) => {
    localStorage.setItem("tarefas", JSON.stringify(tarefasAtualizadas));
  };

  const adicionarTarefa = (novaTarefa: NovaTarefa) => {
    const tarefa: Tarefa = {
      id: novaTarefa.id || v4(),
      titulo: novaTarefa.titulo,
      descricao: novaTarefa.descricao,
      prazo: novaTarefa.prazo,
      prioridade: novaTarefa.prioridade,
      status: novaTarefa.status,
      criacao: novaTarefa.criacao || new Date().toISOString(),
      categoria: novaTarefa.categoria
    };

    const tarefasAtualizadas = [...tarefas, tarefa];
    setTarefas(tarefasAtualizadas);
    salvarTarefasNoLocalStorage(tarefasAtualizadas);
    toast({
      title: "Tarefa adicionada",
      description: "A tarefa foi adicionada com sucesso.",
      duration: 3000,
    });
  };

  const atualizarTarefa = (tarefaAtualizada: Tarefa) => {
    const tarefasAtualizadas = tarefas.map((tarefa) =>
      tarefa.id === tarefaAtualizada.id ? tarefaAtualizada : tarefa
    );
    setTarefas(tarefasAtualizadas);
    salvarTarefasNoLocalStorage(tarefasAtualizadas);
    setTarefaParaEditar(null);
    toast({
      title: "Tarefa atualizada",
      description: "A tarefa foi atualizada com sucesso.",
      duration: 3000,
    });
  };

  const excluirTarefa = (id: string) => {
    const tarefasAtualizadas = tarefas.filter((tarefa) => tarefa.id !== id);
    setTarefas(tarefasAtualizadas);
    salvarTarefasNoLocalStorage(tarefasAtualizadas);
    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi excluída com sucesso.",
      duration: 3000,
    });
  };

  const mudarStatusTarefa = (id: string, novoStatus: StatusTarefa) => {
    const tarefasAtualizadas = tarefas.map((tarefa) =>
      tarefa.id === id ? { ...tarefa, status: novoStatus } : tarefa
    );
    setTarefas(tarefasAtualizadas);
    salvarTarefasNoLocalStorage(tarefasAtualizadas);
    toast({
      title: "Status atualizado",
      description: "O status da tarefa foi atualizado com sucesso.",
      duration: 3000,
    });
  };

  // Filtrar tarefas com base na aba ativa
  const filtrarTarefasPorStatus = (status: StatusTarefa) => {
    if (status === "todas") return tarefas;
    return tarefas.filter((tarefa) => tarefa.status === status);
  };

  const tarefasFiltradas = filtrarTarefasPorStatus(activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tarefas</h1>
        <div className="flex space-x-2">
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as "list" | "board")}
            className="hidden sm:block"
          >
            <TabsList className="grid w-[180px] grid-cols-2">
              <TabsTrigger value="list">
                <ListFilter className="h-4 w-4 mr-2" />
                Lista
              </TabsTrigger>
              <TabsTrigger value="board">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Quadro
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {viewMode === "list" ? (
            <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="todas">Todas ({tarefas.length})</TabsTrigger>
                  <TabsTrigger value="pendente">
                    Pendentes ({tarefas.filter(t => t.status === "pendente").length})
                  </TabsTrigger>
                  <TabsTrigger value="em_andamento">
                    Em Andamento ({tarefas.filter(t => t.status === "em_andamento").length})
                  </TabsTrigger>
                  <TabsTrigger value="concluida">
                    Concluídas ({tarefas.filter(t => t.status === "concluida").length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="todas" className="mt-0">
                <TarefasList 
                  tarefas={tarefasFiltradas} 
                  onEdit={setTarefaParaEditar} 
                  onDelete={excluirTarefa} 
                  onChangeStatus={mudarStatusTarefa}
                />
              </TabsContent>
              <TabsContent value="pendente" className="mt-0">
                <TarefasList 
                  tarefas={tarefasFiltradas} 
                  onEdit={setTarefaParaEditar} 
                  onDelete={excluirTarefa} 
                  onChangeStatus={mudarStatusTarefa}
                />
              </TabsContent>
              <TabsContent value="em_andamento" className="mt-0">
                <TarefasList 
                  tarefas={tarefasFiltradas} 
                  onEdit={setTarefaParaEditar} 
                  onDelete={excluirTarefa} 
                  onChangeStatus={mudarStatusTarefa}
                />
              </TabsContent>
              <TabsContent value="concluida" className="mt-0">
                <TarefasList 
                  tarefas={tarefasFiltradas} 
                  onEdit={setTarefaParaEditar} 
                  onDelete={excluirTarefa} 
                  onChangeStatus={mudarStatusTarefa}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <TarefasBoard 
              tarefas={tarefas} 
              onEdit={setTarefaParaEditar} 
              onDelete={excluirTarefa}
              onChangeStatus={mudarStatusTarefa}
            />
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{tarefaParaEditar ? "Editar Tarefa" : "Nova Tarefa"}</CardTitle>
            </CardHeader>
            <CardContent>
              <TarefaForm
                onSubmit={tarefaParaEditar ? atualizarTarefa : adicionarTarefa}
                tarefaInicial={tarefaParaEditar}
                onCancel={() => setTarefaParaEditar(null)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tarefas;
