
import { Demanda } from "@/types/demanda";
import { DemandaCard } from "./DemandaCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DemandasColumnProps {
  title: string;
  demandas: Demanda[];
  onSelectDemanda?: (demandaId: string) => void;
}

export function DemandasColumn({ title, demandas, onSelectDemanda }: DemandasColumnProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          {title} ({demandas.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {demandas.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Sem demandas nesta coluna
            </div>
          ) : (
            demandas.map((demanda) => (
              <DemandaCard 
                key={demanda.id} 
                demanda={demanda} 
                onSelectDemanda={() => onSelectDemanda && onSelectDemanda(demanda.id)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
