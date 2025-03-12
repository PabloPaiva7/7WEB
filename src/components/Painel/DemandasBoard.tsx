
import { useState } from "react";
import { DemandasColumn } from "./DemandasColumn";
import { Demanda } from "@/types/demanda";
import { Dispatch, SetStateAction } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface DemandasBoardProps {
  demandas: Demanda[];
  setDemandas?: Dispatch<SetStateAction<Demanda[]>>;
  onSelectDemanda?: (demandaId: string) => void;
  onChangeDemandaStatus?: (id: string, status: Demanda['status']) => void;
  onEditDemanda?: (demanda: Demanda) => void;
  onDeleteDemanda?: (id: string) => void;
}

export function DemandasBoard({ 
  demandas, 
  setDemandas, 
  onSelectDemanda,
  onChangeDemandaStatus,
  onEditDemanda,
  onDeleteDemanda 
}: DemandasBoardProps) {
  const [activeTab, setActiveTab] = useState<string>("todos");

  // Filter demandas by status
  const novos = demandas.filter((demanda) => demanda.status === "pendente");
  const emAndamento = demandas.filter((demanda) => demanda.status === "em_andamento");
  const encaminhados = demandas.filter((demanda) => demanda.status === "encaminhado");
  const confirmados = demandas.filter((demanda) => demanda.status === "confirmado");
  const finalizados = demandas.filter((demanda) => demanda.status === "finalizado" || demanda.status === "concluida");

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

  return (
    <div className="space-y-4">
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
