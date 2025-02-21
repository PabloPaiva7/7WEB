import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Compromisso = {
  id: string;
  data: Date;
  tipo: "pagamento" | "ligacao";
  cliente: string;
  descricao: string;
};

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  
  // Dados de exemplo para compromissos
  const compromissos: Compromisso[] = [
    {
      id: "1",
      data: new Date(),
      tipo: "pagamento",
      cliente: "João Silva",
      descricao: "Pagamento agendado",
    },
    {
      id: "2",
      data: new Date(),
      tipo: "ligacao",
      cliente: "Maria Santos",
      descricao: "Retorno de ligação",
    },
  ];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      toast({
        title: "Data selecionada",
        description: `Você selecionou ${date.toLocaleDateString()}`,
      });
    }
  };

  return (
    <div className="grid md:grid-cols-[1fr,300px] gap-6 animate-fadeIn">
      <Card>
        <CardHeader>
          <CardTitle>Calendário</CardTitle>
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
              {compromissos.map((compromisso) => (
                <div
                  key={compromisso.id}
                  className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      compromisso.tipo === "pagamento"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {compromisso.tipo === "pagamento" ? "Pagamento" : "Ligação"}
                    </span>
                  </div>
                  <h4 className="font-medium mt-2">{compromisso.cliente}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {compromisso.descricao}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
