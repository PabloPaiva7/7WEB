
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Demanda } from "@/types/demanda";
import { Dispatch, SetStateAction } from "react";
import { useDemandaFilters } from "@/hooks/useDemandaFilters";
import { FilterBar } from "./FilterBar";
import { StatusTabsNav } from "./StatusTabsNav";
import { AllStatusColumns, SingleStatusColumn } from "./StatusColumns";
import { formatTempoProcessamento } from "./DemandaFiltering";

export interface DemandasBoardProps {
  demandas: Demanda[];
  setDemandas?: Dispatch<SetStateAction<Demanda[]>>;
  onSelectDemanda?: (demandaId: string) => void;
  onChangeDemandaStatus?: (id: string, status: Demanda['status']) => void;
  onEditDemanda?: (demanda: Demanda) => void;
  onDeleteDemanda?: (id: string) => void;
  onAddDemanda?: () => void;
}

export function DemandasBoard({ 
  demandas, 
  setDemandas, 
  onSelectDemanda,
  onChangeDemandaStatus,
  onEditDemanda,
  onDeleteDemanda,
  onAddDemanda
}: DemandasBoardProps) {
  const {
    activeTab,
    setActiveTab,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    filterPrioridade,
    setFilterPrioridade,
    toggleSortOrder,
    novos,
    emAndamento,
    encaminhados,
    confirmados,
    finalizados
  } = useDemandaFilters(demandas);

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

  return (
    <div className="space-y-4">
      {/* Filters and sorting */}
      <div className="flex items-center justify-between pb-2">
        <FilterBar 
          sortField={sortField}
          sortOrder={sortOrder}
          filterPrioridade={filterPrioridade}
          setSortField={setSortField}
          setSortOrder={setSortOrder}
          setFilterPrioridade={setFilterPrioridade}
          toggleSortOrder={toggleSortOrder}
        />
      </div>

      {/* Tabs and board */}
      <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <StatusTabsNav 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          demandas={demandas}
          novos={novos}
          encaminhados={encaminhados}
          confirmados={confirmados}
          finalizados={finalizados}
        />

        <TabsContent value="todos" className="mt-0">
          <AllStatusColumns 
            novos={novos}
            emAndamento={emAndamento}
            encaminhados={encaminhados}
            confirmados={confirmados}
            finalizados={finalizados}
            onSelectDemanda={onSelectDemanda}
            handleDrag={handleDrag}
            onEditDemanda={onEditDemanda}
            onDeleteDemanda={onDeleteDemanda}
            formatTempo={formatTempoProcessamento}
            onAddDemanda={onAddDemanda}
          />
        </TabsContent>

        <TabsContent value="novos" className="mt-0">
          <SingleStatusColumn 
            title="Novos"
            color="bg-amber-500"
            demandas={novos}
            acceptDropStatus="pendente"
            showMoveToEncaminhado={true}
            onSelectDemanda={onSelectDemanda}
            handleDrag={handleDrag}
            onEditDemanda={onEditDemanda}
            onDeleteDemanda={onDeleteDemanda}
            formatTempo={formatTempoProcessamento}
            onAddDemanda={onAddDemanda}
          />
        </TabsContent>

        <TabsContent value="encaminhados" className="mt-0">
          <SingleStatusColumn 
            title="Encaminhados"
            color="bg-yellow-500"
            demandas={encaminhados}
            acceptDropStatus="encaminhado"
            showMoveToConfirmado={true}
            onSelectDemanda={onSelectDemanda}
            handleDrag={handleDrag}
            onEditDemanda={onEditDemanda}
            onDeleteDemanda={onDeleteDemanda}
            formatTempo={formatTempoProcessamento}
          />
        </TabsContent>

        <TabsContent value="confirmados" className="mt-0">
          <SingleStatusColumn 
            title="Confirmados"
            color="bg-purple-500"
            demandas={confirmados}
            acceptDropStatus="confirmado"
            showMoveToFinalizado={true}
            onSelectDemanda={onSelectDemanda}
            handleDrag={handleDrag}
            onEditDemanda={onEditDemanda}
            onDeleteDemanda={onDeleteDemanda}
            formatTempo={formatTempoProcessamento}
          />
        </TabsContent>

        <TabsContent value="finalizados" className="mt-0">
          <SingleStatusColumn 
            title="Finalizados"
            color="bg-green-500"
            demandas={finalizados}
            acceptDropStatus="finalizado"
            onSelectDemanda={onSelectDemanda}
            handleDrag={handleDrag}
            onEditDemanda={onEditDemanda}
            onDeleteDemanda={onDeleteDemanda}
            formatTempo={formatTempoProcessamento}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
