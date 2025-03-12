
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, SortAsc, SortDesc } from "lucide-react";
import { Demanda } from "@/types/demanda";

interface FilterBarProps {
  sortField: 'prioridade' | 'criacao' | 'tempoProcessamento';
  sortOrder: 'asc' | 'desc';
  filterPrioridade: Demanda['prioridade'] | 'todas';
  setSortField: (field: 'prioridade' | 'criacao' | 'tempoProcessamento') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setFilterPrioridade: (prioridade: Demanda['prioridade'] | 'todas') => void;
  toggleSortOrder: () => void;
}

export const FilterBar = ({
  sortField,
  sortOrder,
  filterPrioridade,
  setSortField,
  setFilterPrioridade,
  toggleSortOrder,
}: FilterBarProps) => {
  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-3.5 w-3.5 mr-2" />
            Filtrar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Prioridade</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setFilterPrioridade('todas')}
            className={filterPrioridade === 'todas' ? "bg-accent" : ""}
          >
            Todas
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setFilterPrioridade('alta')}
            className={filterPrioridade === 'alta' ? "bg-accent" : ""}
          >
            Alta
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setFilterPrioridade('media')}
            className={filterPrioridade === 'media' ? "bg-accent" : ""}
          >
            Média
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setFilterPrioridade('baixa')}
            className={filterPrioridade === 'baixa' ? "bg-accent" : ""}
          >
            Baixa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            {sortOrder === 'asc' ? 
              <SortAsc className="h-3.5 w-3.5 mr-2" /> : 
              <SortDesc className="h-3.5 w-3.5 mr-2" />
            }
            Ordenar
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setSortField('criacao')}
            className={sortField === 'criacao' ? "bg-accent" : ""}
          >
            Data de criação
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setSortField('prioridade')}
            className={sortField === 'prioridade' ? "bg-accent" : ""}
          >
            Prioridade
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setSortField('tempoProcessamento')}
            className={sortField === 'tempoProcessamento' ? "bg-accent" : ""}
          >
            Tempo de processamento
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleSortOrder}>
            {sortOrder === 'asc' ? "Crescente ↑" : "Decrescente ↓"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {filterPrioridade !== 'todas' && (
        <Badge variant="outline" className="gap-1 h-8 px-3">
          Prioridade: {filterPrioridade}
          <button 
            className="ml-1 text-muted-foreground hover:text-foreground" 
            onClick={() => setFilterPrioridade('todas')}
          >
            ×
          </button>
        </Badge>
      )}
    </div>
  );
};
