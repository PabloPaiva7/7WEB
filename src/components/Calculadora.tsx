
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export function Calculadora() {
  const [saldoDevedor, setSaldoDevedor] = useState<string>("");
  const [desconto, setDesconto] = useState<string>("");
  const [resultado, setResultado] = useState<number | null>(null);
  const [porcentagem, setPorcentagem] = useState<number | null>(null);

  const calcularDesconto = () => {
    const saldo = parseFloat(saldoDevedor.replace(/[^\d.-]/g, ''));
    const desc = parseFloat(desconto.replace(/[^\d.-]/g, ''));

    if (!isNaN(saldo) && !isNaN(desc)) {
      const result = saldo - desc;
      const percent = (desc / saldo) * 100;
      setResultado(result);
      setPorcentagem(percent);
    }
  };

  const formatarMoeda = (valor: string) => {
    const numero = valor.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(numero) / 100);
  };

  const handleSaldoChange = (value: string) => {
    setSaldoDevedor(formatarMoeda(value));
  };

  const handleDescontoChange = (value: string) => {
    setDesconto(formatarMoeda(value));
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5" />
        <h3 className="font-semibold">Calculadora de Desconto</h3>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="saldo">Saldo Devedor</Label>
          <Input
            id="saldo"
            value={saldoDevedor}
            onChange={(e) => handleSaldoChange(e.target.value)}
            placeholder="R$ 0,00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="desconto">Desconto</Label>
          <Input
            id="desconto"
            value={desconto}
            onChange={(e) => handleDescontoChange(e.target.value)}
            placeholder="R$ 0,00"
          />
        </div>
        {resultado !== null && porcentagem !== null && (
          <div className="space-y-2 pt-2">
            <div className="text-sm">
              <span className="font-medium">Valor Final:</span>{" "}
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(resultado)}
            </div>
            <div className="text-sm">
              <span className="font-medium">Desconto:</span>{" "}
              {porcentagem.toFixed(2)}%
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
