
import { useState } from "react";
import { 
  Search, 
  Phone, 
  Mail,
  Plus,
  Pencil,
  Trash2
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
import { ramaisExemplo } from "@/data/agendaData";
import { Ramal } from "@/types/agenda.types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface RamaisTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// Schema de validação para ramal
const ramalSchema = z.object({
  departamento: z.string().min(2, { message: "Departamento deve ter no mínimo 2 caracteres" }),
  responsavel: z.string().min(3, { message: "Responsável deve ter no mínimo 3 caracteres" }),
  numero: z.string().min(3, { message: "Número deve ter no mínimo 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" })
});

const RamaisTab = ({ searchTerm, setSearchTerm }: RamaisTabProps) => {
  const { toast } = useToast();
  const [ramais, setRamais] = useState<Ramal[]>(ramaisExemplo);
  const [ramalParaEditar, setRamalParaEditar] = useState<Ramal | null>(null);
  const [ramalParaExcluir, setRamalParaExcluir] = useState<Ramal | null>(null);
  const [openNovoRamal, setOpenNovoRamal] = useState(false);
  const [openEditarRamal, setOpenEditarRamal] = useState(false);
  const [openExcluirRamal, setOpenExcluirRamal] = useState(false);

  // Filtrar ramais
  const ramaisFiltrados = ramais.filter(ramal => {
    return (
      ramal.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ramal.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ramal.numero.includes(searchTerm) ||
      ramal.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Função para adicionar novo ramal
  const adicionarRamal = (dados: z.infer<typeof ramalSchema>) => {
    const novoRamal: Ramal = {
      id: `ramal-${Date.now()}`,
      departamento: dados.departamento,
      responsavel: dados.responsavel,
      numero: dados.numero,
      email: dados.email
    };
    
    setRamais([...ramais, novoRamal]);
    setOpenNovoRamal(false);
    
    toast({
      title: "Ramal adicionado",
      description: `O ramal para ${novoRamal.departamento} foi adicionado com sucesso!`,
    });
  };

  // Função para atualizar ramal existente
  const atualizarRamal = (dados: z.infer<typeof ramalSchema>) => {
    if (!ramalParaEditar) return;
    
    const ramaisAtualizados = ramais.map(ramal => 
      ramal.id === ramalParaEditar.id ? { 
        ...ramal, 
        departamento: dados.departamento,
        responsavel: dados.responsavel,
        numero: dados.numero,
        email: dados.email
      } : ramal
    );
    
    setRamais(ramaisAtualizados);
    setOpenEditarRamal(false);
    setRamalParaEditar(null);
    
    toast({
      title: "Ramal atualizado",
      description: `O ramal para ${dados.departamento} foi atualizado com sucesso!`,
    });
  };

  // Função para excluir ramal
  const excluirRamal = () => {
    if (!ramalParaExcluir) return;
    
    const ramaisAtualizados = ramais.filter(ramal => ramal.id !== ramalParaExcluir.id);
    
    setRamais(ramaisAtualizados);
    setOpenExcluirRamal(false);
    
    toast({
      title: "Ramal excluído",
      description: `O ramal para ${ramalParaExcluir.departamento} foi excluído com sucesso!`,
      variant: "destructive",
    });
    
    setRamalParaExcluir(null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">Ramais Telefônicos</CardTitle>
            <CardDescription>Lista de ramais internos da empresa</CardDescription>
          </div>
          <Button size="sm" onClick={() => setOpenNovoRamal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Ramal
          </Button>
        </div>
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ramaisFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
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
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setRamalParaEditar(ramal);
                            setOpenEditarRamal(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setRamalParaExcluir(ramal);
                            setOpenExcluirRamal(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Diálogo para novo ramal */}
        <Dialog open={openNovoRamal} onOpenChange={setOpenNovoRamal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Ramal</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo ramal abaixo.
              </DialogDescription>
            </DialogHeader>
            <FormularioRamal onSubmit={adicionarRamal} onCancel={() => setOpenNovoRamal(false)} />
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar ramal */}
        <Dialog open={openEditarRamal} onOpenChange={setOpenEditarRamal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Ramal</DialogTitle>
              <DialogDescription>
                Atualize as informações do ramal abaixo.
              </DialogDescription>
            </DialogHeader>
            {ramalParaEditar && (
              <FormularioRamal 
                ramal={ramalParaEditar} 
                onSubmit={atualizarRamal} 
                onCancel={() => {
                  setOpenEditarRamal(false);
                  setRamalParaEditar(null);
                }} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Diálogo para confirmar exclusão */}
        <Dialog open={openExcluirRamal} onOpenChange={setOpenExcluirRamal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este ramal? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setOpenExcluirRamal(false);
                  setRamalParaExcluir(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={excluirRamal}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

// Componente de formulário para criação e edição de ramais
const FormularioRamal = ({ 
  ramal, 
  onSubmit, 
  onCancel 
}: { 
  ramal?: Ramal; 
  onSubmit: (dados: z.infer<typeof ramalSchema>) => void;
  onCancel: () => void;
}) => {
  const form = useForm<z.infer<typeof ramalSchema>>({
    resolver: zodResolver(ramalSchema),
    defaultValues: ramal ? {
      departamento: ramal.departamento,
      responsavel: ramal.responsavel,
      numero: ramal.numero,
      email: ramal.email
    } : {
      departamento: "",
      responsavel: "",
      numero: "",
      email: ""
    }
  });

  function handleSubmit(valores: z.infer<typeof ramalSchema>) {
    onSubmit(valores);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="departamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departamento</FormLabel>
              <FormControl>
                <Input placeholder="Nome do departamento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="responsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <FormControl>
                <Input placeholder="Nome do responsável" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do Ramal</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {ramal ? "Salvar alterações" : "Adicionar ramal"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default RamaisTab;
