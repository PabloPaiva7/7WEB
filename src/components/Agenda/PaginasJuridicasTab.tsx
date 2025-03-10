
import { 
  Search, 
  Scale
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { paginasJuridicasExemplo } from "@/data/agendaData";

interface PaginasJuridicasTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const PaginasJuridicasTab = ({ searchTerm, setSearchTerm }: PaginasJuridicasTabProps) => {
  // Filtrar páginas jurídicas
  const paginasJuridicasFiltradas = paginasJuridicasExemplo.filter(pagina => {
    return (
      pagina.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagina.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagina.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagina.link.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Páginas Jurídicas</CardTitle>
        <CardDescription>Acesso a legislações e documentos jurídicos importantes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por título, categoria..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginasJuridicasFiltradas.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              Nenhuma página jurídica encontrada com os filtros selecionados.
            </div>
          ) : (
            paginasJuridicasFiltradas.map((pagina) => (
              <Card key={pagina.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{pagina.titulo}</CardTitle>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {pagina.categoria}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{pagina.descricao}</p>
                    
                    <div className="pt-2">
                      <Button 
                        variant="outline"
                        className="w-full" 
                        onClick={() => window.open(pagina.link, '_blank')}
                      >
                        <Scale className="w-4 h-4 mr-2" />
                        Consultar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaginasJuridicasTab;
