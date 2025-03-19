
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BancoBarChart } from "./Charts/BancoBarChart";

interface DistribuicaoBancoCardProps {
  dadosPizza: { name: string; value: number }[];
}

export const DistribuicaoBancoCard = ({ dadosPizza }: DistribuicaoBancoCardProps) => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 animate-fade-in-up card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-semibold gradient-text">Distribuição por Banco</CardTitle>
        <CardDescription className="dark:text-[#D9B300]/80 tracking-tight">Análise do volume por instituição financeira</CardDescription>
      </CardHeader>
      <CardContent>
        <BancoBarChart dados={dadosPizza} />
      </CardContent>
    </Card>
  );
};
