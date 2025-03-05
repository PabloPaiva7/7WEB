
import { DemandasColumn } from "./DemandasColumn";
import { Demanda } from "@/types/demanda";

interface DemandasBoardProps {
  demandas: Demanda[];
}

export function DemandasBoard({ demandas }: DemandasBoardProps) {
  // Filter demandas by status
  const backlog = demandas.filter((demanda) => demanda.status === "backlog");
  const emProgresso = demandas.filter((demanda) => demanda.status === "em_progresso");
  const concluido = demandas.filter((demanda) => demanda.status === "concluido");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <DemandasColumn title="Backlog" demandas={backlog} status="backlog" />
      <DemandasColumn title="Em Progresso" demandas={emProgresso} status="em_progresso" />
      <DemandasColumn title="Concluído" demandas={concluido} status="concluido" />
    </div>
  );
}
