
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
    >
      <EvolucaoLineChart dados={dadosTendencia} />
    </ChartCard>
  );
};
