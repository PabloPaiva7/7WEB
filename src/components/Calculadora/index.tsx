
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calculator, Percent } from "lucide-react";
import { InputField } from "./InputField";
import { ResultDisplay } from "./ResultDisplay";
import { HistoricoDialog } from "./HistoricoDialog";
import { formatarMoeda, limparValorNumerico, calcularDescontoPorPorcentagem, calcularPorcentagemDesconto } from "@/utils/calculadoraUtils";

type HistoricoCalculo = {
  id: number;
  saldoDevedor: number;
  desconto: number;
  resultado: number;
  porcentagem: number;
  data: Date;
};

export function Calculadora() {
  const [saldoDevedor, setSaldoDevedor] = useState<string>("");
  const [desconto, setDesconto] = useState<string>("");
  const [porcentagemInput, setPorcentagemInput] = useState<string>("");
  const [resultado, setResultado] = useState<number | null>(null);
  const [porcentagem, setPorcentagem] = useState<number | null>(null);
  const [historico, setHistorico] = useState<HistoricoCalculo[]>([]);

  const calcularDesconto = () => {
    const saldo = limparValorNumerico(saldoDevedor);
    const desc = limparValorNumerico(desconto);

    if (!isNaN(saldo) && !isNaN(desc)) {
      const result = saldo - desc;
      // Fórmula: VALOR DO DESCONTO / SALDO DEVEDOR * 100
      const percent = calcularPorcentagemDesconto(saldo, desc);
      setResultado(result);
      setPorcentagem(percent);
      setPorcentagemInput(percent.toFixed(2));

      setHistorico(prev => [...prev, {
        id: Date.now(),
        saldoDevedor: saldo,
        desconto: desc,
        resultado: result,
        porcentagem: percent,
        data: new Date()
      }]);
    }
  };

  const calcularPorPorcentagem = (percent: number) => {
    const saldo = limparValorNumerico(saldoDevedor);
    if (!isNaN(saldo) && !isNaN(percent)) {
      // Calcular o desconto baseado na porcentagem
      const desc = calcularDescontoPorPorcentagem(saldo, percent);
      setDesconto(formatarMoeda(desc.toString()));
      const result = saldo - desc;
      setResultado(result);
      setPorcentagem(percent);
    }
  };

  const handlePorcentagemChange = (value: string) => {
    setPorcentagemInput(value);
    const percent = parseFloat(value);
    if (!isNaN(percent)) {
      calcularPorPorcentagem(percent);
    }
  };

  const handleSaldoChange = (value: string) => {
    setSaldoDevedor(formatarMoeda(value));
    if (porcentagemInput) {
      const percent = parseFloat(porcentagemInput);
      if (!isNaN(percent)) {
        calcularPorPorcentagem(percent);
      }
    }
  };

  const handleDescontoChange = (value: string) => {
    setDesconto(formatarMoeda(value));
    calcularDesconto();
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <h3 className="font-semibold">Calculadora de Desconto</h3>
        </div>
        <HistoricoDialog historico={historico} />
      </div>
      <div className="space-y-4">
        <InputField
          id="saldo"
          label="Saldo Devedor"
          value={saldoDevedor}
          onChange={handleSaldoChange}
          placeholder="R$ 0,00"
        />

        <InputField
          id="porcentagem"
          label="Porcentagem de Desconto"
          value={porcentagemInput}
          onChange={handlePorcentagemChange}
          placeholder="0.00"
          icon={<Percent className="h-4 w-4" />}
        />

        <InputField
          id="desconto"
          label="Valor do Desconto"
          value={desconto}
          onChange={handleDescontoChange}
          placeholder="R$ 0,00"
        />

        <ResultDisplay resultado={resultado} porcentagem={porcentagem} />
      </div>
    </Card>
  );
}
