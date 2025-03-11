
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Megaphone, LayoutGrid, Maximize2 } from "lucide-react";

interface MuralHeaderProps {
  visualizacao: string;
  setVisualizacao: (value: string) => void;
  modoVisualizacao: "carrossel" | "grade";
  toggleModoVisualizacao: () => void;
}

export const MuralHeader = ({ 
  visualizacao, 
  setVisualizacao, 
  modoVisualizacao, 
  toggleModoVisualizacao 
}: MuralHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mural de Avisos</h1>
          <p className="text-muted-foreground mt-1">
            Fique por dentro dos anúncios, treinamentos e comunicados da empresa
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <Tabs 
          defaultValue="todos" 
          value={visualizacao}
          onValueChange={setVisualizacao}
        >
          <TabsList>
            <TabsTrigger value="todos" className="gap-2">
              <Megaphone className="h-4 w-4" />
              Todos os Anúncios
            </TabsTrigger>
            <TabsTrigger value="proximos" className="gap-2">
              <Calendar className="h-4 w-4" />
              Próximos Eventos
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleModoVisualizacao}
          className="flex items-center gap-2"
        >
          {modoVisualizacao === "carrossel" ? (
            <>
              <LayoutGrid className="h-4 w-4" />
              Ver em grade
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" />
              Ver em carrossel
            </>
          )}
        </Button>
      </div>
    </>
  );
};
