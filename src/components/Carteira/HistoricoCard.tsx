
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Historico {
  data: string;
  acao: string;
}

interface HistoricoCardProps {
  historico: Historico[];
}

export const HistoricoCard = ({ historico }: HistoricoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Histórico de Ações</CardTitle>
        <CardDescription>Registro das últimas alterações na carteira</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {historico.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{new Date(item.data).toLocaleString()}</span>
              <span>{item.acao}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
