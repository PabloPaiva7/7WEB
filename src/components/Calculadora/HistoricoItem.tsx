
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
          <span className="font-medium dark:text-[#D9B300]">Data:</span>{" "}
          <span className="dark:text-[#D9B300]">{data.toLocaleString()}</span>
        </p>
        <p>
          <span className="font-medium dark:text-[#D9B300]">Saldo Devedor:</span>{" "}
          <span className="dark:text-[#D9B300]">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(saldoDevedor)}</span>
        </p>
        <p>
          <span className="font-medium dark:text-[#D9B300]">Desconto:</span>{" "}
          <span className="dark:text-[#D9B300]">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(desconto)}</span>
        </p>
        <p>
          <span className="font-medium dark:text-[#D9B300]">Economia:</span>{" "}
          <span className="dark:text-[#D9B300]">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(resultado)}</span>
        </p>
        <p>
          <span className="font-medium dark:text-[#D9B300]">Desconto:</span>{" "}
          <span className="dark:text-[#D9B300]">{porcentagem.toFixed(2)}%</span>
        </p>
      </div>
    </Card>
  );
}
