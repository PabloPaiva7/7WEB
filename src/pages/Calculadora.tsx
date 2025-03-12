
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clipboard, Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const Calculadora = () => {
  const [saldoDevedor, setSaldoDevedor] = useState<number | undefined>();
  const [desconto, setDesconto] = useState<number | undefined>();
  const [economia, setEconomia] = useState<number | undefined>();

  const calcularEconomia = () => {
    if (saldoDevedor === undefined || desconto === undefined) {
      toast({
        title: "Campos vazios",
        description: "Por favor, preencha todos os campos para calcular a economia.",
        variant: "destructive",
      });
      return;
    }

    if (desconto > saldoDevedor) {
      toast({
        title: "Erro no cálculo",
        description: "O desconto não pode ser maior que o saldo devedor.",
        variant: "destructive",
      });
      return;
    }

    const economiaCalculada = saldoDevedor - desconto;
    setEconomia(economiaCalculada);
    
    toast({
      title: "Cálculo realizado",
      description: `Economia calculada com sucesso: ${formatCurrency(economiaCalculada)}`,
    });
  };

  const copiarValor = (valor: number | undefined, tipo: string) => {
    if (valor === undefined) {
      toast({
        title: "Valor não disponível",
        description: `Não há valor de ${tipo} para copiar.`,
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(valor.toString());
    toast({
      title: "Valor copiado",
      description: `O valor de ${tipo} foi copiado para a área de transferência.`,
    });
  };

  const handleSaldoDevedorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    setSaldoDevedor(value);
    if (value !== undefined && desconto !== undefined) {
      setEconomia(value - desconto);
    } else {
      setEconomia(undefined);
    }
  };

  const handleDescontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : undefined;
    setDesconto(value);
    if (saldoDevedor !== undefined && value !== undefined) {
      setEconomia(saldoDevedor - value);
    } else {
      setEconomia(undefined);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Calculadora de Economia</h1>
        <Calculator size={36} className="text-primary" />
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Calcule sua Economia</CardTitle>
          <CardDescription>
            Insira o saldo devedor e o desconto para calcular a economia gerada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="saldoDevedor">Saldo Devedor</Label>
                <div className="flex">
                  <Input
                    id="saldoDevedor"
                    type="number"
                    placeholder="Digite o saldo devedor"
                    value={saldoDevedor || ""}
                    onChange={handleSaldoDevedorChange}
                    className="rounded-r-none"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-l-none border-l-0"
                    onClick={() => copiarValor(saldoDevedor, "Saldo Devedor")}
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="desconto">Desconto</Label>
                <div className="flex">
                  <Input
                    id="desconto"
                    type="number"
                    placeholder="Digite o valor do desconto"
                    value={desconto || ""}
                    onChange={handleDescontoChange}
                    className="rounded-r-none"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-l-none border-l-0"
                    onClick={() => copiarValor(desconto, "Desconto")}
                  >
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center bg-primary/5 rounded-lg p-6">
              <div className="text-center">
                <h2 className="text-lg font-medium text-muted-foreground mb-1">Economia</h2>
                <div className="text-4xl font-bold text-primary mb-4">
                  {economia !== undefined ? formatCurrency(economia) : "R$ 0,00"}
                </div>
                <Button 
                  variant="secondary"
                  className="gap-2"
                  onClick={() => copiarValor(economia, "Economia")}
                >
                  <Clipboard className="h-4 w-4" />
                  Copiar Valor
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t pt-6">
          <div className="text-sm text-muted-foreground">
            {economia !== undefined ? (
              <p>Saldo Devedor ({formatCurrency(saldoDevedor!)}) - Desconto ({formatCurrency(desconto!)}) = Economia ({formatCurrency(economia)})</p>
            ) : (
              <p>Preencha os valores para ver o cálculo detalhado</p>
            )}
          </div>
          <Button onClick={calcularEconomia}>Calcular</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Calculadora;
