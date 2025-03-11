
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TipoAnuncio } from "@/types/mural.types";
import { Calendar, Search } from "lucide-react";

interface FiltroAnunciosProps {
  filtroTexto: string;
  setFiltroTexto: (value: string) => void;
  filtroTipo: string;
  setFiltroTipo: (value: string) => void;
  setMostrarNovoAnuncio: (value: boolean) => void;
}

export const FiltroAnuncios = ({
  filtroTexto,
  setFiltroTexto,
  filtroTipo,
  setFiltroTipo,
  setMostrarNovoAnuncio
}: FiltroAnunciosProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
      <div className="flex flex-1 flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar anúncios..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select
            value={filtroTipo}
            onValueChange={setFiltroTipo}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="treinamento">Treinamento</SelectItem>
              <SelectItem value="corporativo">Aviso Corporativo</SelectItem>
              <SelectItem value="mudanca">Mudança</SelectItem>
              <SelectItem value="chamada">Chamada</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button
        onClick={() => setMostrarNovoAnuncio(true)}
        className="gap-2"
      >
        <Calendar className="h-4 w-4" />
        Novo Anúncio
      </Button>
    </div>
  );
};
