
import { ChartCard } from "@/components/Painel/ChartCard";
import { EvolucaoLineChart } from "./Charts/EvolucaoLineChart";

interface EvolucaoCarteiraCardProps {
  dadosTendencia: { mes: string; valor: number }[];
}

export const EvolucaoCarteiraCard = ({ dadosTendencia }: EvolucaoCarteiraCardProps) => {
  return (
    <ChartCard 
      title="Evolução da Carteira" 
      description="Valores totais nos últimos 6 meses"
      className="dark:bg-gray-800 dark:border-gray-700"
    >
      <EvolucaoLineChart dados={dadosTendencia} />
    </ChartCard>
  );
};
