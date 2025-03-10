
import { 
  Search, 
  Phone, 
  Mail, 
  Link as LinkIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { bancosExemplo } from "@/data/agendaData";

interface BancosTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const BancosTab = ({ searchTerm, setSearchTerm }: BancosTabProps) => {
  // Filtrar bancos
  const bancosFiltrados = bancosExemplo.filter(banco => {
    return (
      banco.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banco.contato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banco.telefone.includes(searchTerm) ||
      banco.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banco.website.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Bancos e Financeiras</CardTitle>
        <CardDescription>Contatos de instituições financeiras parceiras</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar banco por nome, contato..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Website</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bancosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    Nenhum banco encontrado com os filtros selecionados.
                  </TableCell>
                </TableRow>
              ) : (
                bancosFiltrados.map((banco) => (
                  <TableRow key={banco.id}>
                    <TableCell className="font-medium">{banco.nome}</TableCell>
                    <TableCell>{banco.contato}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                        {banco.telefone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                        {banco.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center" 
                        onClick={() => window.open(banco.website, '_blank')}
                      >
                        <LinkIcon className="w-3 h-3 mr-1" />
                        Acessar Site
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BancosTab;
