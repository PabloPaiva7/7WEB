
import { ChartCard } from "@/components/Painel/ChartCard";
import { EvolucaoLineChart } from "./Charts/EvolucaoLineChart";

interface EvolucaoCarteiraCardProps {
  dadosTendencia: { mes: string; valor: number }[];
}

export const EvolucaoCarteiraCard = ({ dadosTendencia }: EvolucaoCarteiraCardProps) => {
  return (
    <div className="dark:bg-gray-800 dark:border-gray-700 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up card-hover">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-1 gradient-text">Evolução da Carteira</h3>
        <p className="text-sm text-muted-foreground mb-4">Valores totais nos últimos 6 meses</p>
        <div className="h-[300px]">
          <EvolucaoLineChart dados={dadosTendencia} />
        </div>
      </div>
    </div>
  );
};
