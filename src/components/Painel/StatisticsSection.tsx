
import { StatisticCard } from "./StatisticCard";
import { List, Clock, Inbox, CheckCircle2 } from "lucide-react";
import { Demanda } from "@/types/demanda";

interface StatisticsSectionProps {
  demandas: Demanda[];
}

export const StatisticsSection = ({ demandas }: StatisticsSectionProps) => {
  const demandasPendentes = demandas.filter(d => d.status === 'pendente');
  const demandasEmAndamento = demandas.filter(d => d.status === 'em_andamento');
  const demandasConcluidas = demandas.filter(d => d.status === 'concluida');

  const estatisticas = {
    total: demandas.length,
    pendentes: demandasPendentes.length,
    emAndamento: demandasEmAndamento.length,
    concluidas: demandasConcluidas.length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatisticCard
        title="Total de Demandas"
        value={estatisticas.total}
        icon={List}
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
        iconColor="text-blue-500"
      />
      
      <StatisticCard
        title="Pendentes"
        value={estatisticas.pendentes}
        icon={Clock}
        bgColor="bg-amber-50"
        borderColor="border-amber-200"
        iconColor="text-amber-500"
      />
      
      <StatisticCard
        title="Em Andamento"
        value={estatisticas.emAndamento}
        icon={Inbox}
        bgColor="bg-purple-50"
        borderColor="border-purple-200"
        iconColor="text-purple-500"
      />
      
      <StatisticCard
        title="Concluídas"
        value={estatisticas.concluidas}
        icon={CheckCircle2}
        bgColor="bg-green-50"
        borderColor="border-green-200"
        iconColor="text-green-500"
      />
    </div>
  );
};
