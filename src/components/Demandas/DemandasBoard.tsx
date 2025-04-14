
import { useState } from "react";
import { Demanda } from "@/types/demanda";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusColumns } from "@/components/Demandas/StatusColumns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUpDown } from "lucide-react";

interface DemandasBoardProps {
  demandas: Demanda[];
  onChangeDemandaStatus: (id: string, status: Demanda['status']) => void;
  onEditDemanda: (demanda: Demanda) => void;
  onDeleteDemanda: (id: string) => void;
  onAddDemanda: () => void;
}

export function DemandasBoard({
  demandas,
  onChangeDemandaStatus,
  onEditDemanda,
  onDeleteDemanda,
  onAddDemanda
}: DemandasBoardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPrioridade, setFilterPrioridade] = useState<"todas" | Demanda["prioridade"]>("todas");
  const [sortBy, setSortBy] = useState<"data" | "prioridade">("data");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"board" | "kanban">("board");

  // Filtre as demandas com base no termo de pesquisa e prioridade
  const demandasFiltradas = demandas.filter((demanda) => {
    const matchesSearch =
      demanda.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      demanda.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (demanda.categoria && demanda.categoria.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPrioridade = filterPrioridade === "todas" || demanda.prioridade === filterPrioridade;
    
    return matchesSearch && matchesPrioridade;
  });

  // Ordene as demandas com base nos critérios selecionados
  const demandasOrdenadas = [...demandasFiltradas].sort((a, b) => {
    if (sortBy === "data") {
      return sortOrder === "asc"
        ? new Date(a.criacao).getTime() - new Date(b.criacao).getTime()
        : new Date(b.criacao).getTime() - new Date(a.criacao).getTime();
    } else {
      const prioridadeOrdem = { alta: 0, media: 1, baixa: 2 };
      return sortOrder === "asc"
        ? prioridadeOrdem[a.prioridade] - prioridadeOrdem[b.prioridade]
        : prioridadeOrdem[b.prioridade] - prioridadeOrdem[a.prioridade];
    }
  });

  // Agrupe as demandas por status
  const novos = demandasOrdenadas.filter((d) => d.status === "pendente");
  const emAndamento = demandasOrdenadas.filter((d) => d.status === "em_andamento");
  const encaminhados = demandasOrdenadas.filter((d) => d.status === "encaminhado");
  const confirmados = demandasOrdenadas.filter((d) => d.status === "confirmado");
  const finalizados = demandasOrdenadas.filter((d) => d.status === "finalizado");

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const formatTempoProcessamento = (tempo: number | null | undefined): string => {
    if (!tempo) return "-";
    
    const segundos = Math.floor(tempo / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (dias > 0) return `${dias}d ${horas % 24}h`;
    if (horas > 0) return `${horas}h ${minutos % 60}m`;
    if (minutos > 0) return `${minutos}m ${segundos % 60}s`;
    return `${segundos}s`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex items-center w-full sm:w-auto">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar demandas..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select
            value={filterPrioridade}
            onValueChange={(value: "todas" | "baixa" | "media" | "alta") => setFilterPrioridade(value)}
          >
            <SelectTrigger className="w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={sortBy}
            onValueChange={(value: "data" | "prioridade") => setSortBy(value)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="data">Data</SelectItem>
              <SelectItem value="prioridade">Prioridade</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            title={sortOrder === "asc" ? "Ordem crescente" : "Ordem decrescente"}
          >
            <ArrowUpDown
              className={`h-4 w-4 ${
                sortOrder === "asc" ? "transform rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <StatusColumns
          novos={novos}
          emAndamento={emAndamento}
          encaminhados={encaminhados}
          confirmados={confirmados}
          finalizados={finalizados}
          handleDrag={onChangeDemandaStatus}
          onEditDemanda={onEditDemanda}
          onDeleteDemanda={onDeleteDemanda}
          formatTempo={formatTempoProcessamento}
          onAddDemanda={onAddDemanda}
        />
      </div>
    </div>
  );
}
