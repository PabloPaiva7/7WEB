
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Check, Plus, Trash } from "lucide-react";
import { format } from "date-fns";

type Compromisso = {
  id: string;
  data: Date;
  tipo: "pagamento" | "ligacao" | "reuniao";
  cliente: string;
  descricao: string;
  alerta: boolean;
  status: "pendente" | "concluido";
};

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novoCompromisso, setNovoCompromisso] = useState<Partial<Compromisso>>({
    data: new Date(),
    tipo: "reuniao",
    status: "pendente",
    alerta: true,
  });
  const { toast } = useToast();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      toast({
        title: "Data selecionada",
        description: `Você selecionou ${date.toLocaleDateString()}`,
      });
    }
  };

  const handleAddCompromisso = () => {
    if (novoCompromisso.cliente && novoCompromisso.descricao && selectedDate) {
      const compromisso: Compromisso = {
        id: Math.random().toString(36).substr(2, 9),
        data: selectedDate,
        tipo: novoCompromisso.tipo as "pagamento" | "ligacao" | "reuniao",
        cliente: novoCompromisso.cliente,
        descricao: novoCompromisso.descricao,
        alerta: novoCompromisso.alerta || false,
        status: novoCompromisso.status as "pendente" | "concluido",
      };

      setCompromissos([...compromissos, compromisso]);
      setIsDialogOpen(false);
      
      if (compromisso.alerta) {
        toast({
          title: "Alerta configurado",
          description: `Você receberá um alerta para: ${compromisso.descricao}`,
        });
      }
    }
  };

  const handleToggleStatus = (id: string) => {
    setCompromissos(compromissos.map(comp => 
      comp.id === id 
        ? { ...comp, status: comp.status === "pendente" ? "concluido" : "pendente" }
        : comp
    ));
  };

  const handleDeleteCompromisso = (id: string) => {
    setCompromissos(compromissos.filter(comp => comp.id !== id));
    toast({
      title: "Compromisso removido",
      description: "O compromisso foi removido com sucesso.",
    });
  };

  const compromissosDoDia = compromissos.filter(
    comp => selectedDate && comp.data.toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="grid md:grid-cols-[1fr,300px] gap-6 animate-fadeIn">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Calendário</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Compromisso
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Compromisso</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select
                    value={novoCompromisso.tipo}
                    onValueChange={(value) =>
                      setNovoCompromisso({ ...novoCompromisso, tipo: value as any })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reuniao">Reunião</SelectItem>
                      <SelectItem value="pagamento">Pagamento</SelectItem>
                      <SelectItem value="ligacao">Ligação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cliente">Cliente</Label>
                  <Input
                    id="cliente"
                    value={novoCompromisso.cliente || ""}
                    onChange={(e) =>
                      setNovoCompromisso({ ...novoCompromisso, cliente: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={novoCompromisso.descricao || ""}
                    onChange={(e) =>
                      setNovoCompromisso({ ...novoCompromisso, descricao: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="alerta"
                    checked={novoCompromisso.alerta}
                    onChange={(e) =>
                      setNovoCompromisso({ ...novoCompromisso, alerta: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="alerta">Ativar alerta</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddCompromisso}>Adicionar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border w-full"
          />
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Compromissos do Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {compromissosDoDia.map((compromisso) => (
                <div
                  key={compromisso.id}
                  className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      compromisso.tipo === "pagamento"
                        ? "bg-green-100 text-green-800"
                        : compromisso.tipo === "ligacao"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {compromisso.tipo.charAt(0).toUpperCase() + compromisso.tipo.slice(1)}
                    </span>
                    <div className="flex items-center gap-2">
                      {compromisso.alerta && (
                        <Bell className="h-4 w-4 text-yellow-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(compromisso.id)}
                      >
                        <Check className={`h-4 w-4 ${
                          compromisso.status === "concluido" 
                            ? "text-green-500" 
                            : "text-gray-300"
                        }`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCompromisso(compromisso.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h4 className="font-medium mt-2">{compromisso.cliente}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {compromisso.descricao}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(compromisso.data, "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              ))}
              {compromissosDoDia.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum compromisso para esta data
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
