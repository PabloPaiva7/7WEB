
import { ChartCard } from "@/components/Painel/ChartCard";
import { EvolucaoLineChart } from "./Charts/EvolucaoLineChart";

interface EvolucaoCarteiraCardProps {
  dadosTendencia: { mes: string; valor: number }[];
}

export const EvolucaoCarteiraCard = ({ dadosTendencia }: EvolucaoCarteiraCardProps) => {
  return (
    <div className="dark:bg-gray-800 dark:border-gray-700 rounded-lg border">
      <ChartCard 
        title="Evolução da Carteira" 
        description="Valores totais nos últimos 6 meses"
      >
        <EvolucaoLineChart dados={dadosTendencia} />
      </ChartCard>
    </div>
  );
};
