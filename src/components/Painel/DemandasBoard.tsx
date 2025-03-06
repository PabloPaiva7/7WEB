
import { DemandasColumn } from "./DemandasColumn";
import { Demanda } from "@/types/demanda";
import { Dispatch, SetStateAction } from "react";

export interface DemandasBoardProps {
  demandas: Demanda[];
  setDemandas?: Dispatch<SetStateAction<Demanda[]>>;
  onSelectDemanda?: (demandaId: string) => void;
}

export function DemandasBoard({ demandas, setDemandas, onSelectDemanda }: DemandasBoardProps) {
  // Filter demandas by status
  const pendentes = demandas.filter((demanda) => demanda.status === "pendente");
  const emAndamento = demandas.filter((demanda) => demanda.status === "em_andamento");
  const concluidas = demandas.filter((demanda) => demanda.status === "concluida");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <DemandasColumn title="Pendentes" demandas={pendentes} onSelectDemanda={onSelectDemanda} />
      <DemandasColumn title="Em Andamento" demandas={emAndamento} onSelectDemanda={onSelectDemanda} />
      <DemandasColumn title="Concluídas" demandas={concluidas} onSelectDemanda={onSelectDemanda} />
    </div>
  );
}
