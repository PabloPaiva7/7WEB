
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Upload, Download } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";

interface CarteiraHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterChange: (type: string, value: string) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

export const CarteiraHeader = ({
  searchTerm,
  onSearchChange,
  onFilterChange,
  isDialogOpen,
  setIsDialogOpen
}: CarteiraHeaderProps) => {
  return (
    <div className="sticky top-0 bg-background z-10 pb-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-semibold text-foreground">Minha Carteira</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onFilterChange('search', e.target.value);
              }}
            />
          </div>
          <div className="flex gap-2">
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Novo
              </Button>
            </DialogTrigger>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <label className="cursor-pointer">
                <Upload className="h-4 w-4" />
                CSV
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                />
              </label>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
