
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BancoPieChart } from "../Charts/BancoPieChart";

interface DistribuicaoBancoCardProps {
  dadosPizza: { name: string; value: number }[];
}

export const DistribuicaoBancoCard = ({ dadosPizza }: DistribuicaoBancoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Distribuição por Banco</CardTitle>
        <CardDescription>Análise do volume por instituição financeira</CardDescription>
      </CardHeader>
      <CardContent>
        <BancoPieChart dados={dadosPizza} />
      </CardContent>
    </Card>
  );
};
