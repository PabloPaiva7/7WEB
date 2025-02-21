
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type FilterProps = {
  bancos: string[];
  escritorios: string[];
  prazos: string[];
  onFilterChange: (type: string, value: string) => void;
};

export function CarteiraSidebar({ bancos, escritorios, prazos, onFilterChange }: FilterProps) {
  return (
    <Card className="p-4 h-[calc(100vh-2rem)] w-64">
      <h3 className="font-semibold mb-4">Filtros</h3>
      <ScrollArea className="h-[calc(100%-2rem)]">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Banco</Label>
            <Select onValueChange={(value) => onFilterChange('banco', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um banco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {bancos.map((banco) => (
                  <SelectItem key={banco} value={banco}>{banco}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Escritório</Label>
            <Select onValueChange={(value) => onFilterChange('escritorio', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um escritório" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {escritorios.map((escritorio) => (
                  <SelectItem key={escritorio} value={escritorio}>{escritorio}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Prazo</Label>
            <Select onValueChange={(value) => onFilterChange('prazo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um prazo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {prazos.map((prazo) => (
                  <SelectItem key={prazo} value={prazo}>{prazo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
