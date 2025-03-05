
import { Card } from "@/components/ui/card";

interface HistoricoItemProps {
  id: number;
  saldoDevedor: number;
  desconto: number;
  resultado: number;
  porcentagem: number;
  data: Date;
}

export function HistoricoItem({ id, saldoDevedor, desconto, resultado, porcentagem, data }: HistoricoItemProps) {
  return (
    <Card key={id} className="p-3">
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Data:</span>{" "}
          {data.toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Saldo Devedor:</span>{" "}
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoDevedor)}
        </p>
        <p>
          <span className="font-medium">Desconto:</span>{" "}
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(desconto)}
        </p>
        <p>
          <span className="font-medium">Valor Final:</span>{" "}
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado)}
        </p>
        <p>
          <span className="font-medium">Desconto:</span>{" "}
          {porcentagem.toFixed(2)}%
        </p>
      </div>
    </Card>
  );
}
