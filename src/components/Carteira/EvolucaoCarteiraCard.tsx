
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EvolucaoLineChart } from "./Charts/EvolucaoLineChart";

interface EvolucaoCarteiraCardProps {
  dadosTendencia: { mes: string; valor: number }[];
}

export const EvolucaoCarteiraCard = ({ dadosTendencia }: EvolucaoCarteiraCardProps) => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 animate-fade-in-up card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-semibold gradient-text">Evolução da Carteira</CardTitle>
        <CardDescription className="dark:text-[#D9B300]/80 tracking-tight">Valores totais nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <EvolucaoLineChart dados={dadosTendencia} />
        </div>
      </CardContent>
    </Card>
  );
};
