
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={demanda.titulo || ""}
              onChange={(e) => setDemanda({...demanda, titulo: e.target.value})}
              placeholder="Título da demanda"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              rows={3}
              value={demanda.descricao || ""}
              onChange={(e) => setDemanda({...demanda, descricao: e.target.value})}
              placeholder="Descrição detalhada da demanda"
              className="resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="prioridade">Prioridade</Label>
              <Select
                value={demanda.prioridade}
                onValueChange={(value) => setDemanda({...demanda, prioridade: value as any})}
              >
                <SelectTrigger id="prioridade">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={demanda.status}
                onValueChange={(value) => setDemanda({...demanda, status: value as any})}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                  <SelectItem value="encaminhado">Encaminhado</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="finalizado">Finalizado</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="categoria">Categoria</Label>
              <Input
                id="categoria"
                value={demanda.categoria || ""}
                onChange={(e) => setDemanda({...demanda, categoria: e.target.value})}
                placeholder="Ex: Contratos, Processos"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <Input
                id="responsavel"
                value={demanda.responsavel || ""}
                onChange={(e) => setDemanda({...demanda, responsavel: e.target.value})}
                placeholder="Nome do responsável"
              />
            </div>
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
