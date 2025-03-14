
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultDisplayProps {
  resultado: number | null;
  porcentagem: number | null;
}

export function ResultDisplay({ resultado, porcentagem }: ResultDisplayProps) {
  const { toast } = useToast();

  if (resultado === null || porcentagem === null) {
    return null;
  }

  const copiarValor = (valor: string, campo: string) => {
    navigator.clipboard.writeText(valor).then(() => {
      toast({
        title: "Copiado!",
        description: `O valor do campo ${campo} foi copiado para a área de transferência.`,
      });
    });
  };

  const valorFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(resultado);

  return (
    <div className="pt-2">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium dark:text-[#D9B300]">Economia</span>
          <div className="flex items-center gap-2">
            <span className="dark:text-[#D9B300]">{valorFormatado}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copiarValor(valorFormatado, "Economia")}
              className="h-6"
            >
              <Copy className="h-3 w-3 mr-1" />
              <span className="dark:text-[#D9B300]">Copiar</span>
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium dark:text-[#D9B300]">Desconto</span>
          <div className="flex items-center gap-2">
            <span className="dark:text-[#D9B300]">{porcentagem.toFixed(2)}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copiarValor(`${porcentagem.toFixed(2)}%`, "Porcentagem de Desconto")}
              className="h-6"
            >
              <Copy className="h-3 w-3 mr-1" />
              <span className="dark:text-[#D9B300]">Copiar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
