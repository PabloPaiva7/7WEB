
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calculator, Copy, History, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const { toast } = useToast();

  const calcularDesconto = () => {
    const saldo = parseFloat(saldoDevedor.replace(/[^\d.-]/g, ''));
    const desc = parseFloat(desconto.replace(/[^\d.-]/g, ''));

    if (!isNaN(saldo) && !isNaN(desc)) {
      const result = saldo - desc;
      const percent = (desc / saldo) * 100;
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
    const saldo = parseFloat(saldoDevedor.replace(/[^\d.-]/g, ''));
    if (!isNaN(saldo) && !isNaN(percent)) {
      const desc = (saldo * percent) / 100;
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

  const formatarMoeda = (valor: string) => {
    const numero = valor.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(numero) / 100);
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

  const copiarValor = (valor: string, campo: string) => {
    navigator.clipboard.writeText(valor).then(() => {
      toast({
        title: "Copiado!",
        description: `O valor do campo ${campo} foi copiado para a área de transferência.`,
      });
    });
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          <h3 className="font-semibold">Calculadora de Desconto</h3>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <History className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Histórico de Cálculos</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {historico.slice().reverse().map((calc) => (
                  <Card key={calc.id} className="p-3">
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Data:</span>{" "}
                        {calc.data.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Saldo Devedor:</span>{" "}
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calc.saldoDevedor)}
                      </p>
                      <p>
                        <span className="font-medium">Desconto:</span>{" "}
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calc.desconto)}
                      </p>
                      <p>
                        <span className="font-medium">Valor Final:</span>{" "}
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(calc.resultado)}
                      </p>
                      <p>
                        <span className="font-medium">Desconto:</span>{" "}
                        {calc.porcentagem.toFixed(2)}%
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="saldo">Saldo Devedor</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copiarValor(saldoDevedor, "Saldo Devedor")}
              className="h-6"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copiar
            </Button>
          </div>
          <Input
            id="saldo"
            value={saldoDevedor}
            onChange={(e) => handleSaldoChange(e.target.value)}
            placeholder="R$ 0,00"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="porcentagem">Porcentagem de Desconto</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copiarValor(porcentagemInput, "Porcentagem")}
              className="h-6"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copiar
            </Button>
          </div>
          <div className="relative">
            <Input
              id="porcentagem"
              value={porcentagemInput}
              onChange={(e) => handlePorcentagemChange(e.target.value)}
              placeholder="0.00"
              className="pr-8"
            />
            <Percent className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="desconto">Valor do Desconto</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copiarValor(desconto, "Valor do Desconto")}
              className="h-6"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copiar
            </Button>
          </div>
          <Input
            id="desconto"
            value={desconto}
            onChange={(e) => handleDescontoChange(e.target.value)}
            placeholder="R$ 0,00"
          />
        </div>

        {resultado !== null && porcentagem !== null && (
          <div className="pt-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Valor Final</span>
                <div className="flex items-center gap-2">
                  <span>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(resultado)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copiarValor(
                      new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(resultado),
                      "Valor Final"
                    )}
                    className="h-6"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Desconto</span>
                <div className="flex items-center gap-2">
                  <span>{porcentagem.toFixed(2)}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copiarValor(`${porcentagem.toFixed(2)}%`, "Porcentagem de Desconto")}
                    className="h-6"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
