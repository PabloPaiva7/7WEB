
import { 
  Search, 
  Phone, 
  Mail 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ramaisExemplo } from "@/data/agendaData";

interface RamaisTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const RamaisTab = ({ searchTerm, setSearchTerm }: RamaisTabProps) => {
  // Filtrar ramais
  const ramaisFiltrados = ramaisExemplo.filter(ramal => {
    return (
      ramal.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ramal.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ramal.numero.includes(searchTerm) ||
      ramal.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Ramais Telefônicos</CardTitle>
        <CardDescription>Lista de ramais internos da empresa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar ramal por departamento, responsável..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Departamento</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Ramal</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ramaisFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                    Nenhum ramal encontrado com os filtros selecionados.
                  </TableCell>
                </TableRow>
              ) : (
                ramaisFiltrados.map((ramal) => (
                  <TableRow key={ramal.id}>
                    <TableCell className="font-medium">{ramal.departamento}</TableCell>
                    <TableCell>{ramal.responsavel}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                        {ramal.numero}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                        {ramal.email}
                      </div>
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

export default RamaisTab;
