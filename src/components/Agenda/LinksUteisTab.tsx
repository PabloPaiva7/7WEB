
import { useState } from "react";
import { 
  Search, 
  Link as LinkIcon,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { linksUteisExemplo } from "@/data/agendaData";
import { LinkUtil } from "@/types/agenda.types";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LinksUteisTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// Schema de validação para link útil
const linkSchema = z.object({
  nome: z.string().min(2, { message: "Nome deve ter no mínimo 2 caracteres" }),
  url: z.string().url({ message: "URL inválida. Inclua 'http://' ou 'https://'" }),
  categoria: z.string().min(2, { message: "Categoria deve ter no mínimo 2 caracteres" }),
  descricao: z.string().min(5, { message: "Descrição deve ter no mínimo 5 caracteres" })
});

const LinksUteisTab = ({ searchTerm, setSearchTerm }: LinksUteisTabProps) => {
  const { toast } = useToast();
  const [links, setLinks] = useState<LinkUtil[]>(linksUteisExemplo);
  const [linkParaEditar, setLinkParaEditar] = useState<LinkUtil | null>(null);
  const [linkParaExcluir, setLinkParaExcluir] = useState<LinkUtil | null>(null);
  const [openNovoLink, setOpenNovoLink] = useState(false);
  const [openEditarLink, setOpenEditarLink] = useState(false);
  const [openExcluirLink, setOpenExcluirLink] = useState(false);

  // Obter categorias únicas para o filtro
  const categorias = Array.from(new Set(links.map(link => link.categoria)));

  // Filtrar links úteis
  const linksFiltrados = links.filter(link => {
    return (
      link.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Função para adicionar novo link
  const adicionarLink = (dados: z.infer<typeof linkSchema>) => {
    const novoLink: LinkUtil = {
      id: `link-${Date.now()}`,
      nome: dados.nome,
      url: dados.url,
      categoria: dados.categoria,
      descricao: dados.descricao
    };
    
    setLinks([...links, novoLink]);
    setOpenNovoLink(false);
    
    toast({
      title: "Link adicionado",
      description: `O link "${novoLink.nome}" foi adicionado com sucesso!`,
    });
  };

  // Função para atualizar link existente
  const atualizarLink = (dados: z.infer<typeof linkSchema>) => {
    if (!linkParaEditar) return;
    
    const linksAtualizados = links.map(link => 
      link.id === linkParaEditar.id ? { 
        ...link, 
        nome: dados.nome,
        url: dados.url,
        categoria: dados.categoria,
        descricao: dados.descricao
      } : link
    );
    
    setLinks(linksAtualizados);
    setOpenEditarLink(false);
    setLinkParaEditar(null);
    
    toast({
      title: "Link atualizado",
      description: `O link "${dados.nome}" foi atualizado com sucesso!`,
    });
  };

  // Função para excluir link
  const excluirLink = () => {
    if (!linkParaExcluir) return;
    
    const linksAtualizados = links.filter(link => link.id !== linkParaExcluir.id);
    
    setLinks(linksAtualizados);
    setOpenExcluirLink(false);
    
    toast({
      title: "Link excluído",
      description: `O link "${linkParaExcluir.nome}" foi excluído com sucesso!`,
      variant: "destructive",
    });
    
    setLinkParaExcluir(null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">Links Úteis</CardTitle>
            <CardDescription>Acesso rápido a sites e sistemas importantes</CardDescription>
          </div>
          <Button size="sm" onClick={() => setOpenNovoLink(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Link
          </Button>
        </div>
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
          {linksFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              Nenhum link encontrado com os filtros selecionados.
            </div>
          ) : (
            linksFiltrados.map((link) => (
              <Card key={link.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{link.nome}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {link.categoria}
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLinkParaEditar(link);
                            setOpenEditarLink(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLinkParaExcluir(link);
                            setOpenExcluirLink(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
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

        {/* Diálogo para novo link */}
        <Dialog open={openNovoLink} onOpenChange={setOpenNovoLink}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Link</DialogTitle>
              <DialogDescription>
                Preencha as informações do novo link abaixo.
              </DialogDescription>
            </DialogHeader>
            <FormularioLink 
              categorias={categorias}
              onSubmit={adicionarLink} 
              onCancel={() => setOpenNovoLink(false)} 
            />
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar link */}
        <Dialog open={openEditarLink} onOpenChange={setOpenEditarLink}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Link</DialogTitle>
              <DialogDescription>
                Atualize as informações do link abaixo.
              </DialogDescription>
            </DialogHeader>
            {linkParaEditar && (
              <FormularioLink 
                categorias={categorias}
                link={linkParaEditar} 
                onSubmit={atualizarLink} 
                onCancel={() => {
                  setOpenEditarLink(false);
                  setLinkParaEditar(null);
                }} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Diálogo para confirmar exclusão */}
        <Dialog open={openExcluirLink} onOpenChange={setOpenExcluirLink}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este link? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setOpenExcluirLink(false);
                  setLinkParaExcluir(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={excluirLink}
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

// Componente de formulário para criação e edição de links
const FormularioLink = ({ 
  link,
  categorias,
  onSubmit, 
  onCancel 
}: { 
  link?: LinkUtil;
  categorias: string[];
  onSubmit: (dados: z.infer<typeof linkSchema>) => void;
  onCancel: () => void;
}) => {
  const [categoriaNova, setCategoriaNova] = useState(false);

  const form = useForm<z.infer<typeof linkSchema>>({
    resolver: zodResolver(linkSchema),
    defaultValues: link ? {
      nome: link.nome,
      url: link.url,
      categoria: link.categoria,
      descricao: link.descricao
    } : {
      nome: "",
      url: "https://",
      categoria: categorias.length > 0 ? categorias[0] : "",
      descricao: ""
    }
  });

  function handleSubmit(valores: z.infer<typeof linkSchema>) {
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
              <FormLabel>Nome do Link</FormLabel>
              <FormControl>
                <Input placeholder="Nome do link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://www.exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!categoriaNova && categorias.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <FormLabel>Categoria</FormLabel>
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                onClick={() => setCategoriaNova(true)}
                className="h-auto p-0 text-xs"
              >
                Adicionar nova categoria
              </Button>
            </div>
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        {(categoriaNova || categorias.length === 0) && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <FormLabel>Nova Categoria</FormLabel>
              {categorias.length > 0 && (
                <Button 
                  type="button" 
                  variant="link" 
                  size="sm" 
                  onClick={() => setCategoriaNova(false)}
                  className="h-auto p-0 text-xs"
                >
                  Usar categoria existente
                </Button>
              )}
            </div>
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Nome da categoria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Breve descrição do link"
                  className="min-h-[80px]" 
                  {...field} 
                />
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
            {link ? "Salvar alterações" : "Adicionar link"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default LinksUteisTab;
