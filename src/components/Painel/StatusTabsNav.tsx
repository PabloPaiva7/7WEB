
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Demanda } from "@/types/demanda";

interface StatusTabsNavProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  demandas: Demanda[];
  novos: Demanda[];
  encaminhados: Demanda[];
  confirmados: Demanda[];
  finalizados: Demanda[];
}

export const StatusTabsNav = ({
  activeTab,
  onTabChange,
  demandas,
  novos,
  encaminhados,
  confirmados,
  finalizados
}: StatusTabsNavProps) => {
  return (
    <TabsList className="grid grid-cols-5 mb-4">
      <TabsTrigger value="todos">
        Todos
        <Badge variant="outline" className="ml-2 bg-slate-100">
          {demandas.length}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="novos">
        Novos
        <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800">
          {novos.length}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="encaminhados">
        Encaminhados
        <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
          {encaminhados.length}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="confirmados">
        Confirmados
        <Badge variant="outline" className="ml-2 bg-purple-100 text-purple-800">
          {confirmados.length}
        </Badge>
      </TabsTrigger>
      <TabsTrigger value="finalizados">
        Finalizados
        <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
          {finalizados.length}
        </Badge>
      </TabsTrigger>
    </TabsList>
  );
};
