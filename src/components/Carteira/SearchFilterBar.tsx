
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: SearchFilterBarProps) => {
  return (
    <div className="flex gap-2 items-center">
      <div className="w-48">
        <Select defaultValue="todos" onValueChange={onStatusFilterChange} value={statusFilter}>
          <SelectTrigger className="h-9">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filtrar por status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="prioridade total">Prioridade Total</SelectItem>
            <SelectItem value="prioridade">Prioridade</SelectItem>
            <SelectItem value="verificado">Verificado</SelectItem>
            <SelectItem value="análise">Análise</SelectItem>
            <SelectItem value="aprovado">Aprovado</SelectItem>
            <SelectItem value="quitado">Quitado</SelectItem>
            <SelectItem value="apreendido">Apreendido</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
            <SelectItem value="outros acordos">Outros Acordos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar cliente..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};
