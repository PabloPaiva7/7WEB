
import { Card } from "@/components/ui/card";

interface ValoresCardProps {
  valoresPorBanco: Record<string, number>;
  valorTotal: number;
}

export const ValoresCard = ({ valoresPorBanco, valorTotal }: ValoresCardProps) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Análise de Valores por Banco</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Valor Total da Carteira</p>
          <p className="text-2xl font-bold text-primary">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(valorTotal)}
          </p>
        </div>
        <div className="space-y-2">
          {Object.entries(valoresPorBanco).map(([banco, valor]) => (
            <div key={banco} className="flex justify-between items-center">
              <span className="font-medium">{banco}</span>
              <span className="text-muted-foreground">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(valor)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
