
import { useState, useMemo, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Calendar as CalendarIcon, Check, Plus, Trash, AlertTriangle } from "lucide-react";
import { format, isEqual, isToday, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DemandaAlert } from "@/components/Documentos/DemandaAlert";

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
  const [demandas, setDemandas] = useState([
    "Contrato 12345 - Necessário envio de documentação adicional",
    "Cliente João Silva - Pendência de assinatura em contrato",
    "Processo 789/2023 - Prazo de 5 dias para recurso",
    "Notificação extrajudicial - Cliente Maria Oliveira",
    "Contrato 56789 - Necessário reconhecimento de firma",
    "Ação judicial 2022/456 - Audiência marcada",
  ]);
  const [selectedDemanda, setSelectedDemanda] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      toast({
        title: "Data selecionada",
        description: `Você selecionou ${format(date, 'dd/MM/yyyy', { locale: ptBR })}`,
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

  const handleDemandaSelect = (demanda: string) => {
    setSelectedDemanda(demanda);
    toast({
      title: "Demanda Selecionada",
      description: `A demanda "${demanda}" foi selecionada e precisa de atenção.`,
      variant: "destructive",
    });
  };

  const handleResolveDemanda = () => {
    if (selectedDemanda) {
      const novasDemandas = demandas.filter(d => d !== selectedDemanda);
      setDemandas(novasDemandas);
      setSelectedDemanda(null);
      toast({
        title: "Demanda resolvida",
        description: `A demanda foi marcada como resolvida.`,
      });
    }
  };

  // Filtrar compromissos do dia selecionado
  const compromissosDoDia = useMemo(() => {
    return compromissos.filter(
      comp => selectedDate && isSameDay(comp.data, selectedDate)
    );
  }, [compromissos, selectedDate]);

  // Filtrar compromissos da semana atual
  const compromissosDaSemana = useMemo(() => {
    if (!selectedDate) return [];
    
    const inicioSemana = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Segunda
    const fimSemana = endOfWeek(selectedDate, { weekStartsOn: 1 }); // Domingo
    
    return compromissos
      .filter(comp => isWithinInterval(comp.data, { start: inicioSemana, end: fimSemana }))
      .sort((a, b) => a.data.getTime() - b.data.getTime());
  }, [compromissos, selectedDate]);

  // Função para personalizar o dia do calendário
  const modifiersClassNames = useMemo(() => {
    return {
      day: (day: Date) => {
        // Verificar se há compromissos no dia
        const temCompromisso = compromissos.some(comp => isSameDay(comp.data, day));
        
        // Verificar se há compromissos importantes no dia
        const temCompromissoImportante = compromissos.some(comp => 
          isSameDay(comp.data, day) && comp.alerta && comp.status === "pendente"
        );

        if (temCompromissoImportante) {
          return "calendar-day-with-important";
        } else if (temCompromisso) {
          return "calendar-day-with-appointment";
        }
        
        return "";
      }
    };
  }, [compromissos]);

  return (
    <div className="grid md:grid-cols-[1fr,300px] gap-6 animate-fadeIn">
      {selectedDemanda && (
        <DemandaAlert 
          demanda={selectedDemanda} 
          onResolve={handleResolveDemanda} 
        />
      )}
      
      <div className="space-y-6">
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
            <div className="flex flex-col gap-4">
              <div className="text-sm flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-primary"></span>
                  <span>Compromisso</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-destructive"></span>
                  <span>Compromisso Importante</span>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border w-full"
                modifiersClassNames={modifiersClassNames}
                locale={ptBR}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compromissos</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dia" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="dia">Do Dia</TabsTrigger>
                <TabsTrigger value="semana">Da Semana</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dia" className="space-y-4">
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
                      {format(compromisso.data, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                ))}
                {compromissosDoDia.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum compromisso para esta data
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="semana" className="space-y-4">
                {compromissosDaSemana.map((compromisso) => (
                  <div
                    key={compromisso.id}
                    className={`p-4 rounded-lg border bg-card hover:shadow-md transition-shadow ${
                      selectedDate && isSameDay(compromisso.data, selectedDate) 
                        ? "border-primary" 
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          compromisso.tipo === "pagamento"
                            ? "bg-green-100 text-green-800"
                            : compromisso.tipo === "ligacao"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {compromisso.tipo.charAt(0).toUpperCase() + compromisso.tipo.slice(1)}
                        </span>
                        {isToday(compromisso.data) && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-800">
                            Hoje
                          </span>
                        )}
                      </div>
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
                    <div className="flex items-center mt-2">
                      <CalendarIcon className="h-3 w-3 mr-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {format(compromisso.data, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
                {compromissosDaSemana.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum compromisso para esta semana
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Demandas Pendentes</CardTitle>
            <CardDescription>Clique para selecionar uma demanda e criar um alerta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {demandas.map((demanda, index) => (
                <Button 
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-2 px-3 w-full text-left"
                  onClick={() => handleDemandaSelect(demanda)}
                >
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0" />
                  <span className="truncate">{demanda}</span>
                </Button>
              ))}
              {demandas.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Não há demandas pendentes
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
