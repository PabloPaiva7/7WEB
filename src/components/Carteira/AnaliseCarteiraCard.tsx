
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SituacaoBarChart } from "./Charts/SituacaoBarChart";

interface AnaliseCarteiraCardProps {
  totalClientes: number;
  valorTotal: number;
  dadosGrafico: { nome: string; valor: number }[];
}

export const AnaliseCarteiraCard = ({ totalClientes, valorTotal, dadosGrafico }: AnaliseCarteiraCardProps) => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold dark:text-[#D9B300]">Análise da Carteira</CardTitle>
        <CardDescription className="dark:text-[#D9B300]/80">Distribuição de contratos por situação</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#D9B300]/80">Total de Clientes</p>
              <p className="text-xl font-bold dark:text-[#D9B300]">{totalClientes}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground dark:text-[#D9B300]/80">Valor Total</p>
              <p className="text-xl font-bold dark:text-[#D9B300]">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(valorTotal)}
              </p>
            </div>
          </div>
          <SituacaoBarChart dados={dadosGrafico} />
        </div>
      </CardContent>
    </Card>
  );
};
