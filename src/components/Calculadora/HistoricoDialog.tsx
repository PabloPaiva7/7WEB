
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoricoItem } from "./HistoricoItem";

type HistoricoCalculo = {
  id: number;
  saldoDevedor: number;
  desconto: number;
  resultado: number;
  porcentagem: number;
  data: Date;
};

interface HistoricoDialogProps {
  historico: HistoricoCalculo[];
}

export function HistoricoDialog({ historico }: HistoricoDialogProps) {
  return (
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
              <HistoricoItem 
                key={calc.id}
                id={calc.id}
                saldoDevedor={calc.saldoDevedor}
                desconto={calc.desconto}
                resultado={calc.resultado}
                porcentagem={calc.porcentagem}
                data={calc.data}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
