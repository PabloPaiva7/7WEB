
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Aniversariante } from "@/types/mural.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AniversarianteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (aniversariante: Omit<Aniversariante, "id">) => void;
  aniversariante?: Aniversariante;
}

export const AniversarianteForm = ({ isOpen, onClose, onSave, aniversariante }: AniversarianteFormProps) => {
  const [nome, setNome] = useState(aniversariante?.nome || "");
  const [departamento, setDepartamento] = useState(aniversariante?.departamento || "");
  const [data, setData] = useState<Date | undefined>(
    aniversariante?.data ? new Date(aniversariante.data) : undefined
  );
  const [foto, setFoto] = useState(aniversariante?.foto || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !departamento || !data) return;

    onSave({
      nome,
      departamento,
      data: data.toISOString(),
      foto: foto || undefined
    });

    // Reset form
    setNome("");
    setDepartamento("");
    setData(undefined);
    setFoto("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{aniversariante ? "Editar" : "Adicionar"} Aniversariante</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo"
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="departamento">Departamento</Label>
            <Input
              id="departamento"
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              placeholder="Departamento"
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="data">Data de Aniversário</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="data"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data ? format(data, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data}
                  onSelect={setData}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="foto">URL da Foto (opcional)</Label>
            <Input
              id="foto"
              value={foto}
              onChange={(e) => setFoto(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!nome || !departamento || !data}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
