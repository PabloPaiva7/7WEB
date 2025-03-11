
import { useState } from "react";
import { 
  Search, 
  Phone, 
  Mail, 
  Link as LinkIcon,
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
import { bancosExemplo } from "@/data/agendaData";
import { Banco } from "@/types/agenda.types";
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

interface BancosTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// Schema de validação para banco
const bancoSchema = z.object({
  nome: z.string().min(2, { message: "Nome deve ter no mínimo 2 caracteres" }),
  contato: z.string().min(3, { message: "Contato deve ter no mínimo 3 caracteres" }),
  telefone: z.string().min(8, { message: "Telefone deve ter no mínimo 8 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  website: z.string().url({ message: "Website inválido. Inclua 'http://' ou 'https://'" })
});

const BancosTab = ({ searchTerm, setSearchTerm }: BancosTabProps) => {
  const { toast } = useToast();
  const [bancos, setBancos] = useState<Banco[]>(bancosExemplo);
  const [bancoParaEditar, setBancoParaEditar] = useState<Banco | null>(null);
  const [bancoParaExcluir, setBancoParaExcluir] = useState<Banco | null>(null);
  const [openNovoBanco, setOpenNovoBanco] = useState(false);
  const [openEditarBanco, setOpenEditarBanco] = useState(false);
  const [openExcluirBanco, setOpenExcluirBanco] = useState(false);

  // Filtrar bancos
  const bancosFiltrados = bancos.filter(banco => {
    return (
      banco.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banco.contato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banco.telefone.includes(searchTerm) ||
      banco.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      banco.website.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Função para adicionar novo banco
  const adicionarBanco = (dados: z.infer<typeof bancoSchema>) => {
    const novoBanco: Banco = {
      id: `banco-${Date.now()}`,
      nome: dados.nome,
      contato: dados.contato,
      telefone: dados.telefone,
      email: dados.email,
      website: dados.website
    };
    
    setBancos([...bancos, novoBanco]);
    setOpenNovoBanco(false);
    
    toast({
      title: "Banco adicionado",
      description: `O banco ${novoBanco.nome} foi adicionado com sucesso!`,
    });
  };

  // Função para atualizar banco existente
  const atualizarBanco = (dados: z.infer<typeof bancoSchema>) => {
    if (!bancoParaEditar) return;
    
    const bancosAtualizados = bancos.map(banco => 
      banco.id === bancoParaEditar.id ? { 
        ...banco, 
        nome: dados.nome,
        contato: dados.contato,
        telefone: dados.telefone,
        email: dados.email,
        website: dados.website
      } : banco
    );
    
    setBancos(bancosAtualizados);
    setOpenEditarBanco(false);
    setBancoParaEditar(null);
    
    toast({
      title: "Banco atualizado",
      description: `O banco ${dados.nome} foi atualizado com sucesso!`,
    });
  };

  // Função para excluir banco
  const excluirBanco = () => {
    if (!bancoParaExcluir) return;
    
    const bancosAtualizados = bancos.filter(banco => banco.id !== bancoParaExcluir.id);
    
    setBancos(bancosAtualizados);
    setOpenExcluirBanco(false);
    
    toast({
      title: "Banco excluído",
      description: `O banco ${bancoParaExcluir.nome} foi excluído com sucesso!`,
      variant: "destructive",
    });
    
    setBancoParaExcluir(null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">Bancos e Financeiras</CardTitle>
            <CardDescription>Contatos de instituições financeiras parceiras</CardDescription>
          </div>
          <Button size="sm" onClick={() => setOpenNovoBanco(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Banco
          </Button>
        </div>
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
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bancosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
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
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setBancoParaEditar(banco);
                            setOpenEditarBanco(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setBancoParaExcluir(banco);
                            setOpenExcluirBanco(true);
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

        {/* Diálogo para novo banco */}
        <Dialog open={openNovoBanco} onOpenChange={setOpenNovoBanco}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Banco</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo banco abaixo.
              </DialogDescription>
            </DialogHeader>
            <FormularioBanco onSubmit={adicionarBanco} onCancel={() => setOpenNovoBanco(false)} />
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar banco */}
        <Dialog open={openEditarBanco} onOpenChange={setOpenEditarBanco}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Banco</DialogTitle>
              <DialogDescription>
                Atualize as informações do banco abaixo.
              </DialogDescription>
            </DialogHeader>
            {bancoParaEditar && (
              <FormularioBanco 
                banco={bancoParaEditar} 
                onSubmit={atualizarBanco} 
                onCancel={() => {
                  setOpenEditarBanco(false);
                  setBancoParaEditar(null);
                }} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Diálogo para confirmar exclusão */}
        <Dialog open={openExcluirBanco} onOpenChange={setOpenExcluirBanco}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este banco? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setOpenExcluirBanco(false);
                  setBancoParaExcluir(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={excluirBanco}
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

// Componente de formulário para criação e edição de bancos
const FormularioBanco = ({ 
  banco, 
  onSubmit, 
  onCancel 
}: { 
  banco?: Banco; 
  onSubmit: (dados: z.infer<typeof bancoSchema>) => void;
  onCancel: () => void;
}) => {
  const form = useForm<z.infer<typeof bancoSchema>>({
    resolver: zodResolver(bancoSchema),
    defaultValues: banco ? {
      nome: banco.nome,
      contato: banco.contato,
      telefone: banco.telefone,
      email: banco.email,
      website: banco.website
    } : {
      nome: "",
      contato: "",
      telefone: "",
      email: "",
      website: "https://"
    }
  });

  function handleSubmit(valores: z.infer<typeof bancoSchema>) {
    onSubmit(valores);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Banco</FormLabel>
              <FormControl>
                <Input placeholder="Nome da instituição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contato"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contato</FormLabel>
              <FormControl>
                <Input placeholder="Nome do contato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 0000-0000" {...field} />
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
                <Input placeholder="contato@banco.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://www.banco.com" {...field} />
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
            {banco ? "Salvar alterações" : "Adicionar banco"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default BancosTab;
