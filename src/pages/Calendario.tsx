
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
import { Bell, Calendar as CalendarIcon, Check, Plus, Trash } from "lucide-react";
import { format, isEqual, isToday, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isWithinInterval, addDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novoCompromisso, setNovoCompromisso] = useState<Partial<Compromisso>>({
    data: new Date(),
    tipo: "reuniao",
    status: "pendente",
    alerta: true,
  });
  const { toast } = useToast();

  // Exemplos de compromissos para demonstração
  const [compromissos, setCompromissos] = useState<Compromisso[]>([
    // Exemplos para hoje
    {
      id: "1",
      data: new Date(),
      tipo: "reuniao",
      cliente: "João Silva",
      descricao: "Discussão sobre contrato de financiamento",
      alerta: true,
      status: "pendente"
    },
    {
      id: "2",
      data: new Date(),
      tipo: "ligacao",
      cliente: "Maria Oliveira",
      descricao: "Retorno sobre documentação pendente",
      alerta: false,
      status: "pendente"
    },
    // Exemplos para amanhã
    {
      id: "3",
      data: addDays(new Date(), 1),
      tipo: "pagamento",
      cliente: "Carlos Santos",
      descricao: "Pagamento de parcela do contrato #4567",
      alerta: true,
      status: "pendente"
    },
    // Exemplos para demais dias da semana
    {
      id: "4",
      data: addDays(new Date(), 2),
      tipo: "reuniao",
      cliente: "Ana Paula Fernandes",
      descricao: "Assinatura de contrato",
      alerta: true,
      status: "pendente"
    },
    {
      id: "5",
      data: addDays(new Date(), 3),
      tipo: "ligacao",
      cliente: "Roberto Almeida",
      descricao: "Confirmação de dados cadastrais",
      alerta: false,
      status: "pendente"
    },
    {
      id: "6",
      data: addDays(new Date(), 4),
      tipo: "reuniao",
      cliente: "Juliana Costa",
      descricao: "Apresentação de proposta comercial",
      alerta: true,
      status: "pendente"
    },
    // Exemplos para semana passada (alguns concluídos)
    {
      id: "7",
      data: subDays(new Date(), 2),
      tipo: "reuniao",
      cliente: "Fernando Mendes",
      descricao: "Renegociação de contrato",
      alerta: false,
      status: "concluido"
    },
    {
      id: "8",
      data: subDays(new Date(), 4),
      tipo: "pagamento",
      cliente: "Luciana Martins",
      descricao: "Pagamento de entrada - Contrato #1245",
      alerta: true,
      status: "concluido"
    },
    // Exemplos para próximas semanas
    {
      id: "9",
      data: addDays(new Date(), 10),
      tipo: "reuniao",
      cliente: "Marcelo Souza",
      descricao: "Reunião sobre novo produto financeiro",
      alerta: true,
      status: "pendente"
    },
    {
      id: "10",
      data: addDays(new Date(), 15),
      tipo: "ligacao",
      cliente: "Patricia Lima",
      descricao: "Follow-up de proposta",
      alerta: false,
      status: "pendente"
    },
    // Exemplos adicionais para mostrar calendário cheio
    {
      id: "11",
      data: addDays(new Date(), 7),
      tipo: "reuniao",
      cliente: "Grupo Investidores SA",
      descricao: "Apresentação de resultados",
      alerta: true,
      status: "pendente"
    },
    {
      id: "12",
      data: addDays(new Date(), 8),
      tipo: "ligacao",
      cliente: "Ricardo Ferreira",
      descricao: "Esclarecimentos sobre contrato",
      alerta: false,
      status: "pendente"
    },
    {
      id: "13",
      data: addDays(new Date(), 9),
      tipo: "pagamento",
      cliente: "Empresa ABC Ltda",
      descricao: "Pagamento de parcela mensal",
      alerta: true,
      status: "pendente"
    },
    {
      id: "14",
      data: addDays(new Date(), 12),
      tipo: "reuniao",
      cliente: "Sandra Vieira",
      descricao: "Reunião de alinhamento de cronograma",
      alerta: true,
      status: "pendente"
    },
    {
      id: "15",
      data: addDays(new Date(), 14),
      tipo: "ligacao",
      cliente: "Bruno Costa",
      descricao: "Confirmação de assinatura de contrato",
      alerta: false,
      status: "pendente"
    }
  ]);

  // Mostra alerta visual quando a página carrega para compromissos do dia com alerta
  useEffect(() => {
    const compromissosImportantes = compromissos.filter(comp => 
      isToday(comp.data) && comp.alerta && comp.status === "pendente"
    );

    if (compromissosImportantes.length > 0) {
      // Espera 1 segundo antes de mostrar o alerta para não aparecer imediatamente na carga da página
      const timeoutId = setTimeout(() => {
        compromissosImportantes.forEach(comp => {
          toast({
            title: "Compromisso Importante Hoje",
            description: `${comp.tipo.charAt(0).toUpperCase() + comp.tipo.slice(1)} com ${comp.cliente}: ${comp.descricao}`,
            variant: "destructive",
          });
        });
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const compromissosDoDia = compromissos.filter(comp => isSameDay(comp.data, date));
      
      if (compromissosDoDia.length > 0) {
        toast({
          title: `${compromissosDoDia.length} compromisso(s) para ${format(date, 'dd/MM/yyyy', { locale: ptBR })}`,
          description: `Clique para ver os detalhes.`,
        });
      } else {
        toast({
          title: "Data selecionada",
          description: `Você selecionou ${format(date, 'dd/MM/yyyy', { locale: ptBR })}`,
        });
      }
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
          variant: "destructive",
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
  const dayModifiers = useMemo(() => {
    return {
      appointment: (date: Date) => {
        return compromissos.some(comp => isSameDay(comp.data, date) && comp.status === "pendente");
      },
      importantAppointment: (date: Date) => {
        return compromissos.some(comp => 
          isSameDay(comp.data, date) && comp.alerta && comp.status === "pendente"
        );
      }
    };
  }, [compromissos]);

  const modifiersClassNames = {
    appointment: "calendar-day-with-appointment",
    importantAppointment: "calendar-day-with-important"
  };

  return (
    <div className="grid md:grid-cols-[1fr] gap-6 animate-fadeIn">
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
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                  <span>Compromisso</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                  <span>Compromisso Importante</span>
                </div>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border w-full"
                modifiers={dayModifiers}
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
                    className={`p-4 rounded-lg border bg-card hover:shadow-md transition-shadow ${
                      compromisso.alerta ? 'border-red-400' : ''
                    }`}
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
                          <Bell className="h-4 w-4 text-red-500 animate-pulse" />
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
                        : compromisso.alerta ? 'border-red-400' : ''
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
                          <Bell className="h-4 w-4 text-red-500 animate-pulse" />
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
    </div>
  );
}
