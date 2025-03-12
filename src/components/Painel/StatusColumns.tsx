
import { Demanda } from "@/types/demanda";
import { DemandasColumn } from "./DemandasColumn";

interface StatusColumnsProps {
  novos: Demanda[];
  emAndamento: Demanda[];
  encaminhados: Demanda[];
  confirmados: Demanda[];
  finalizados: Demanda[];
  onSelectDemanda?: (id: string) => void;
  handleDrag: (id: string, status: Demanda['status']) => void;
  onEditDemanda?: (demanda: Demanda) => void;
  onDeleteDemanda?: (id: string) => void;
  formatTempo: (tempo: number | null | undefined) => string;
  onAddDemanda?: () => void;
}

export const AllStatusColumns = ({
  novos,
  emAndamento,
  encaminhados,
  confirmados,
  finalizados,
  onSelectDemanda,
  handleDrag,
  onEditDemanda,
  onDeleteDemanda,
  formatTempo,
  onAddDemanda
}: StatusColumnsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <DemandasColumn 
        title="Novos" 
        color="bg-amber-500" 
        demandas={novos} 
        onSelectDemanda={onSelectDemanda}
        onChangeStatus={(id, status) => handleDrag(id, status)}
        onEdit={onEditDemanda}
        onDelete={onDeleteDemanda}
        formatTempo={formatTempo}
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
        formatTempo={formatTempo}
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
        formatTempo={formatTempo}
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
        formatTempo={formatTempo}
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
        formatTempo={formatTempo}
        acceptDropStatus="finalizado"
      />
    </div>
  );
};

export const SingleStatusColumn = ({
  title,
  color,
  demandas,
  acceptDropStatus,
  showMoveToEncaminhado = false,
  showMoveToConfirmado = false,
  showMoveToFinalizado = false,
  onSelectDemanda,
  handleDrag,
  onEditDemanda,
  onDeleteDemanda,
  formatTempo,
  onAddDemanda
}: {
  title: string;
  color: string;
  demandas: Demanda[];
  acceptDropStatus: Demanda['status'];
  showMoveToEncaminhado?: boolean;
  showMoveToConfirmado?: boolean;
  showMoveToFinalizado?: boolean;
  onSelectDemanda?: (id: string) => void;
  handleDrag: (id: string, status: Demanda['status']) => void;
  onEditDemanda?: (demanda: Demanda) => void;
  onDeleteDemanda?: (id: string) => void;
  formatTempo: (tempo: number | null | undefined) => string;
  onAddDemanda?: () => void;
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <DemandasColumn 
        title={title} 
        color={color} 
        demandas={demandas} 
        onSelectDemanda={onSelectDemanda}
        onChangeStatus={(id, status) => handleDrag(id, status)}
        onEdit={onEditDemanda}
        onDelete={onDeleteDemanda}
        formatTempo={formatTempo}
        acceptDropStatus={acceptDropStatus}
        showMoveToEncaminhado={showMoveToEncaminhado}
        showMoveToConfirmado={showMoveToConfirmado}
        showMoveToFinalizado={showMoveToFinalizado}
        fullWidth
        onAddDemanda={onAddDemanda}
      />
    </div>
  );
};
