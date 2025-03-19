
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
  onFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CarteiraHeader = ({
  searchTerm,
  onSearchChange,
  onFilterChange,
  isDialogOpen,
  setIsDialogOpen,
  onFileUpload
}: CarteiraHeaderProps) => {
  return (
    <div className="sticky top-0 bg-background z-10 pb-4 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground gradient-text-gold">Minha Carteira</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar..."
              className="pl-10 focus-visible:ring-2 focus-visible:ring-offset-0 text-sm"
              value={searchTerm}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onFilterChange('search', e.target.value);
              }}
            />
          </div>
          <div className="flex gap-2">
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 text-white shadow-md">
                <Plus className="h-4 w-4" />
                Novo
              </Button>
            </DialogTrigger>
            <Button variant="outline" size="sm" className="gap-2 transition-all hover:shadow-md" asChild>
              <label className="cursor-pointer">
                <Upload className="h-4 w-4 gradient-icon" />
                CSV
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={onFileUpload}
                />
              </label>
            </Button>
            <Button variant="outline" size="sm" className="transition-all hover:shadow-md">
              <Download className="h-4 w-4 gradient-icon" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
