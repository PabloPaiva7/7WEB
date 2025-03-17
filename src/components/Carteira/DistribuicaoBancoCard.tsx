
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BancoBarChart } from "./Charts/BancoBarChart";

interface DistribuicaoBancoCardProps {
  dadosPizza: { name: string; value: number }[];
}

export const DistribuicaoBancoCard = ({ dadosPizza }: DistribuicaoBancoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-[#D9B300]">Distribuição por Banco</CardTitle>
        <CardDescription className="dark:text-[#D9B300]/80">Análise do volume por instituição financeira</CardDescription>
      </CardHeader>
      <CardContent>
        <BancoBarChart dados={dadosPizza} />
      </CardContent>
    </Card>
  );
};
