
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemandaCard } from "./DemandaCard";
import { Demanda } from "@/types/demanda";
import { LucideIcon } from "lucide-react";

interface DemandasColumnProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  demandas: Demanda[];
  onSelect?: (id: string) => void;
  onChangeStatus: (id: string, status: 'pendente' | 'em_andamento' | 'concluida') => void;
  onEdit: (demanda: Demanda) => void;
  onDelete: (id: string) => void;
  showMoveBackIcon?: boolean;
  showCompleteIcon?: boolean;
}

export const DemandasColumn = ({
  title,
  icon: Icon,
  iconColor,
  bgColor,
  borderColor,
  demandas,
  onSelect,
  onChangeStatus,
  onEdit,
  onDelete,
  showMoveBackIcon,
  showCompleteIcon
}: DemandasColumnProps) => {
  return (
    <Card className={`${bgColor} ${borderColor}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title} ({demandas.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {demandas.map((demanda) => (
          <DemandaCard
            key={demanda.id}
            demanda={demanda}
            onSelect={onSelect}
            onChangeStatus={onChangeStatus}
            onEdit={onEdit}
            onDelete={onDelete}
            showMoveBackIcon={showMoveBackIcon}
            showCompleteIcon={showCompleteIcon}
          />
        ))}
        {demandas.length === 0 && (
          <p className="text-sm text-center py-4 text-muted-foreground">
            Nenhuma demanda {title.toLowerCase()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
