
import { 
  Search, 
  Link as LinkIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { linksUteisExemplo } from "@/data/agendaData";

interface LinksUteisTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const LinksUteisTab = ({ searchTerm, setSearchTerm }: LinksUteisTabProps) => {
  // Filtrar links úteis
  const linksUteisFiltrados = linksUteisExemplo.filter(link => {
    return (
      link.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Links Úteis</CardTitle>
        <CardDescription>Acesso rápido a sites e sistemas importantes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome, categoria..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {linksUteisFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              Nenhum link encontrado com os filtros selecionados.
            </div>
          ) : (
            linksUteisFiltrados.map((link) => (
              <Card key={link.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{link.nome}</CardTitle>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {link.categoria}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{link.descricao}</p>
                    
                    <div className="pt-2">
                      <Button 
                        className="w-full" 
                        onClick={() => window.open(link.url, '_blank')}
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Acessar Link
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

export default LinksUteisTab;
