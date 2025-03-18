
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clipboard, Calculator, Save, Plus, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

// Define the calculation record type
type CalculoRecord = {
  id: string;
  saldoDevedor: number;
  desconto: number;
  economia: number;
  data: Date;
};

export function Calculadora() {
  const [saldoDevedor, setSaldoDevedor] = useState<number | undefined>();
  const [desconto, setDesconto] = useState<number | undefined>();
  const [economia, setEconomia] = useState<number | undefined>();
  const [historico, setHistorico] = useState<CalculoRecord[]>([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const { toast } = useToast();

  // Load saved calculations from localStorage on component mount
  useEffect(() => {
    const savedHistorico = localStorage.getItem('calculadora-historico');
    if (savedHistorico) {
      try {
        const parsed = JSON.parse(savedHistorico);
        setHistorico(parsed.map((item: any) => ({
          ...item,
          data: new Date(item.data)
        })));
      } catch (e) {
        console.error("Erro ao carregar histórico:", e);
      }
    }
  }, []);

  // Save calculations to localStorage when historico changes
  useEffect(() => {
    if (historico.length > 0) {
      localStorage.setItem('calculadora-historico', JSON.stringify(historico));
    }
  }, [historico]);

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

  const salvarCalculo = () => {
    if (saldoDevedor === undefined || desconto === undefined || economia === undefined) {
      toast({
        title: "Cálculo incompleto",
        description: "Por favor, realize um cálculo antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    const novoCalculo: CalculoRecord = {
      id: Date.now().toString(),
      saldoDevedor,
      desconto,
      economia,
      data: new Date()
    };

    setHistorico(prev => [novoCalculo, ...prev]);
    
    toast({
      title: "Cálculo salvo",
      description: "O cálculo foi salvo no histórico.",
    });
  };

  const excluirCalculo = (id: string) => {
    setHistorico(prev => prev.filter(calc => calc.id !== id));
    
    toast({
      title: "Cálculo excluído",
      description: "O cálculo foi removido do histórico.",
    });
  };

  const limparHistorico = () => {
    setHistorico([]);
    localStorage.removeItem('calculadora-historico');
    
    toast({
      title: "Histórico limpo",
      description: "Todo o histórico de cálculos foi apagado.",
    });
  };

  const carregarCalculo = (calculo: CalculoRecord) => {
    setSaldoDevedor(calculo.saldoDevedor);
    setDesconto(calculo.desconto);
    setEconomia(calculo.economia);
    
    toast({
      title: "Cálculo carregado",
      description: "Os valores do cálculo foram carregados.",
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
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Calculadora de Economia</CardTitle>
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
                <div className="space-x-2">
                  <Button 
                    variant="secondary"
                    className="gap-2"
                    onClick={() => copiarValor(economia, "Economia")}
                  >
                    <Clipboard className="h-4 w-4" />
                    Copiar Valor
                  </Button>
                  <Button 
                    variant="outline"
                    className="gap-2"
                    onClick={salvarCalculo}
                  >
                    <Save className="h-4 w-4" />
                    Salvar
                  </Button>
                </div>
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

      {/* Histórico de Cálculos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Histórico de Cálculos</CardTitle>
            <CardDescription>
              {historico.length} cálculos salvos
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setMostrarHistorico(!mostrarHistorico)}
            >
              {mostrarHistorico ? "Ocultar" : "Mostrar"}
            </Button>
            {historico.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={limparHistorico}
              >
                <Trash className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </CardHeader>
        {mostrarHistorico && historico.length > 0 && (
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-auto">
              {historico.map((calculo) => (
                <div 
                  key={calculo.id} 
                  className="p-4 border rounded-md flex justify-between items-center hover:bg-accent"
                >
                  <div>
                    <p className="font-medium">
                      {formatCurrency(calculo.saldoDevedor)} - {formatCurrency(calculo.desconto)} = {formatCurrency(calculo.economia)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {calculo.data.toLocaleDateString()} {calculo.data.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => carregarCalculo(calculo)}
                    >
                      Carregar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => excluirCalculo(calculo.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
        {mostrarHistorico && historico.length === 0 && (
          <CardContent>
            <div className="p-8 text-center text-muted-foreground">
              <p>Nenhum cálculo salvo. Faça um cálculo e salve-o para visualizar aqui.</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
