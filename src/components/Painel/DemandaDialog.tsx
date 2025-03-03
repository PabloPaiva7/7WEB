
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Demanda } from "@/types/demanda";

interface DemandaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  demanda: Partial<Demanda>;
  setDemanda: (demanda: Partial<Demanda>) => void;
  onSave: () => void;
  title: string;
  actionText: string;
}

export const DemandaDialog = ({
  isOpen,
  onOpenChange,
  demanda,
  setDemanda,
  onSave,
  title,
  actionText
}: DemandaDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={demanda.titulo || ""}
              onChange={(e) => setDemanda({...demanda, titulo: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={demanda.descricao || ""}
              onChange={(e) => setDemanda({...demanda, descricao: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select
              value={demanda.prioridade}
              onValueChange={(value) => setDemanda({...demanda, prioridade: value as any})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={demanda.status}
              onValueChange={(value) => setDemanda({...demanda, status: value as any})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>{actionText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
