
import { useState } from "react";
import { DemandasColumn } from "./DemandasColumn";
import { Demanda } from "@/types/demanda";
import { Dispatch, SetStateAction } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, AlertCircle, Filter, SortAsc, SortDesc } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface DemandasBoardProps {
  demandas: Demanda[];
  setDemandas?: Dispatch<SetStateAction<Demanda[]>>;
  onSelectDemanda?: (demandaId: string) => void;
  onChangeDemandaStatus?: (id: string, status: Demanda['status']) => void;
  onEditDemanda?: (demanda: Demanda) => void;
  onDeleteDemanda?: (id: string) => void;
  onAddDemanda?: () => void;
}

type SortField = 'prioridade' | 'criacao' | 'tempoProcessamento';
type SortOrder = 'asc' | 'desc';

export function DemandasBoard({ 
  demandas, 
  setDemandas, 
  onSelectDemanda,
  onChangeDemandaStatus,
  onEditDemanda,
  onDeleteDemanda,
  onAddDemanda
}: DemandasBoardProps) {
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [sortField, setSortField] = useState<SortField>('criacao');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterPrioridade, setFilterPrioridade] = useState<Demanda['prioridade'] | 'todas'>('todas');

  // Apply filters
  let filteredDemandas = [...demandas];
  
  if (filterPrioridade !== 'todas') {
    filteredDemandas = filteredDemandas.filter(d => d.prioridade === filterPrioridade);
  }
  
  // Apply sorting
  filteredDemandas.sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'prioridade') {
      const priorityMap = { 'alta': 3, 'media': 2, 'baixa': 1 };
      comparison = (priorityMap[a.prioridade] || 0) - (priorityMap[b.prioridade] || 0);
    } else if (sortField === 'criacao') {
      comparison = new Date(a.criacao).getTime() - new Date(b.criacao).getTime();
    } else if (sortField === 'tempoProcessamento') {
      const aTime = a.tempoProcessamento || 0;
      const bTime = b.tempoProcessamento || 0;
      comparison = aTime - bTime;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Filter demandas by status
  const novos = filteredDemandas.filter((demanda) => demanda.status === "pendente");
  const emAndamento = filteredDemandas.filter((demanda) => demanda.status === "em_andamento");
  const encaminhados = filteredDemandas.filter((demanda) => demanda.status === "encaminhado");
  const confirmados = filteredDemandas.filter((demanda) => demanda.status === "confirmado");
  const finalizados = filteredDemandas.filter((demanda) => demanda.status === "finalizado" || demanda.status === "concluida");

  const handleDrag = (id: string, newStatus: Demanda['status']) => {
    if (onChangeDemandaStatus) {
      onChangeDemandaStatus(id, newStatus);
    } else if (setDemandas) {
      setDemandas(prevDemandas => {
        return prevDemandas.map(demanda => {
          if (demanda.id === id) {
            // Se estamos iniciando o processamento
            let updates: Partial<Demanda> = { status: newStatus };
            
            // Iniciar o cronômetro quando mover para em_andamento
            if (newStatus === 'em_andamento' && !demanda.inicioProcessamento) {
              updates.inicioProcessamento = new Date();
            }
            
            // Finalizar o cronômetro quando concluir
            if ((newStatus === 'finalizado' || newStatus === 'concluida') && demanda.inicioProcessamento && !demanda.conclusao) {
              const conclusao = new Date();
              const inicioProcessamento = demanda.inicioProcessamento;
              
              updates.conclusao = conclusao;
              updates.tempoProcessamento = conclusao.getTime() - inicioProcessamento.getTime();
            }
            
            return { ...demanda, ...updates };
          }
          return demanda;
        });
      });
    }
  };

  const formatTempoProcessamento = (tempo: number | null | undefined): string => {
    if (!tempo) return "Não iniciado";
    
    const segundos = Math.floor(tempo / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (dias > 0) {
      return `${dias}d ${horas % 24}h`;
    } else if (horas > 0) {
      return `${horas}h ${minutos % 60}m`;
    } else if (minutos > 0) {
      return `${minutos}m ${segundos % 60}s`;
    } else {
      return `${segundos}s`;
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-4">
      {/* Filters and sorting */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-3.5 w-3.5 mr-2" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Prioridade</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setFilterPrioridade('todas')}
                className={filterPrioridade === 'todas' ? "bg-accent" : ""}
              >
                Todas
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilterPrioridade('alta')}
                className={filterPrioridade === 'alta' ? "bg-accent" : ""}
              >
                Alta
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilterPrioridade('media')}
                className={filterPrioridade === 'media' ? "bg-accent" : ""}
              >
                Média
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setFilterPrioridade('baixa')}
                className={filterPrioridade === 'baixa' ? "bg-accent" : ""}
              >
                Baixa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                {sortOrder === 'asc' ? 
                  <SortAsc className="h-3.5 w-3.5 mr-2" /> : 
                  <SortDesc className="h-3.5 w-3.5 mr-2" />
                }
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setSortField('criacao')}
                className={sortField === 'criacao' ? "bg-accent" : ""}
              >
                Data de criação
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortField('prioridade')}
                className={sortField === 'prioridade' ? "bg-accent" : ""}
              >
                Prioridade
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortField('tempoProcessamento')}
                className={sortField === 'tempoProcessamento' ? "bg-accent" : ""}
              >
                Tempo de processamento
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleSortOrder}>
                {sortOrder === 'asc' ? "Crescente ↑" : "Decrescente ↓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {filterPrioridade !== 'todas' && (
            <Badge variant="outline" className="gap-1 h-8 px-3">
              Prioridade: {filterPrioridade}
              <button 
                className="ml-1 text-muted-foreground hover:text-foreground" 
                onClick={() => setFilterPrioridade('todas')}
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs and board */}
      <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="todos">
            Todos
            <Badge variant="outline" className="ml-2 bg-slate-100">
              {demandas.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="novos">
            Novos
            <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800">
              {novos.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="encaminhados">
            Encaminhados
            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
              {encaminhados.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="confirmados">
            Confirmados
            <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800">
              {confirmados.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="finalizados">
            Finalizados
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
              {finalizados.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <DemandasColumn 
              title="Novos" 
              color="bg-amber-500" 
              demandas={novos} 
              onSelectDemanda={onSelectDemanda}
              onChangeStatus={(id, status) => handleDrag(id, status)}
              onEdit={onEditDemanda}
              onDelete={onDeleteDemanda}
              formatTempo={formatTempoProcessamento}
              acceptDropStatus="pendente"
              showMoveToEncaminhado={true}
              onAddDemanda={onAddDemanda}
            />
            <DemandasColumn 
              title="Em Andamento" 
              color="bg-blue-500" 
              demandas={emAndamento} 
              onSelectDemanda={onSelectDemanda}
              onChangeStatus={(id, status) => handleDrag(id, status)}
              onEdit={onEditDemanda}
              onDelete={onDeleteDemanda}
              formatTempo={formatTempoProcessamento}
              acceptDropStatus="em_andamento"
              showMoveToConfirmado={true}
            />
            <DemandasColumn 
              title="Encaminhados" 
              color="bg-yellow-500" 
              demandas={encaminhados} 
              onSelectDemanda={onSelectDemanda}
              onChangeStatus={(id, status) => handleDrag(id, status)}
              onEdit={onEditDemanda}
              onDelete={onDeleteDemanda}
              formatTempo={formatTempoProcessamento}
              acceptDropStatus="encaminhado"
              showMoveToConfirmado={true}
            />
            <DemandasColumn 
              title="Confirmados" 
              color="bg-purple-500" 
              demandas={confirmados} 
              onSelectDemanda={onSelectDemanda}
              onChangeStatus={(id, status) => handleDrag(id, status)}
              onEdit={onEditDemanda} 
              onDelete={onDeleteDemanda}
              formatTempo={formatTempoProcessamento}
              acceptDropStatus="confirmado"
              showMoveToFinalizado={true}
            />
            <DemandasColumn 
              title="Finalizados" 
              color="bg-green-500" 
              demandas={finalizados} 
              onSelectDemanda={onSelectDemanda}
              onChangeStatus={(id, status) => handleDrag(id, status)}
              onEdit={onEditDemanda}
              onDelete={onDeleteDemanda}
              formatTempo={formatTempoProcessamento}
              acceptDropStatus="finalizado"
            />
          </div>
        </TabsContent>

        <TabsContent value="novos" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            <DemandasColumn 
              title="Novos" 
              color="bg-amber-500" 
              demandas={novos} 
              onSelectDemanda={onSelectDemanda}
              onChangeStatus={(id, status) => handleDrag(id, status)}
              onEdit={onEditDemanda}
              onDelete={onDeleteDemanda}
              formatTempo={formatTempoProcessamento}
              acceptDropStatus="pendente"
              showMoveToEncaminhado={true}
              fullWidth
              onAddDemanda={onAddDemanda}
            />
          </div>
        </TabsContent>

        <TabsContent value="encaminhados" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            <DemandasColumn 
              title="Encaminhados" 
              color="bg-yellow-500" 
              demandas={encaminhados} 
              onSelectDemanda={onSelectDemanda}
              onChangeStatus={(id, status) => handleDrag(id, status)}
              onEdit={onEditDemanda}
              onDelete={onDeleteDemanda}
              formatTempo={formatTempoProcessamento}
              acceptDropStatus="encaminhado"
              showMoveToConfirmado={true}
              fullWidth
            />
          </div>
        </TabsContent>

        <TabsContent value="confirmados" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            <DemandasColumn 
              title="Confirmados" 
              color="bg-purple-500" 
              demandas={confirmados} 
              onSelectDemanda={onSelectDemanda}
              onChangeStatus={(id, status) => handleDrag(id, status)}
              onEdit={onEditDemanda}
              onDelete={onDeleteDemanda}
              formatTempo={formatTempoProcessamento}
              acceptDropStatus="confirmado"
              showMoveToFinalizado={true}
              fullWidth
            />
          </div>
        </TabsContent>

        <TabsContent value="finalizados" className="mt-0">
          <div className="grid grid-cols-1 gap-4">
            <DemandasColumn 
              title="Finalizados" 
              color="bg-green-500" 
              demandas={finalizados} 
              onSelectDemanda={onSelectDemanda}
              onChangeStatus={(id, status) => handleDrag(id, status)}
              onEdit={onEditDemanda}
              onDelete={onDeleteDemanda}
              formatTempo={formatTempoProcessamento}
              acceptDropStatus="finalizado"
              fullWidth
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
