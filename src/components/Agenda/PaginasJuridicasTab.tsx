
import { useState } from "react";
import { 
  Search, 
  Scale,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { paginasJuridicasExemplo } from "@/data/agendaData";
import { PaginaJuridica } from "@/types/agenda.types";
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

interface PaginasJuridicasTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

// Schema de validação para página jurídica
const paginaSchema = z.object({
  titulo: z.string().min(3, { message: "Título deve ter no mínimo 3 caracteres" }),
  descricao: z.string().min(5, { message: "Descrição deve ter no mínimo 5 caracteres" }),
  link: z.string().url({ message: "Link inválido. Inclua 'http://' ou 'https://'" }),
  categoria: z.string().min(2, { message: "Categoria deve ter no mínimo 2 caracteres" })
});

const PaginasJuridicasTab = ({ searchTerm, setSearchTerm }: PaginasJuridicasTabProps) => {
  const { toast } = useToast();
  const [paginas, setPaginas] = useState<PaginaJuridica[]>(paginasJuridicasExemplo);
  const [paginaParaEditar, setPaginaParaEditar] = useState<PaginaJuridica | null>(null);
  const [paginaParaExcluir, setPaginaParaExcluir] = useState<PaginaJuridica | null>(null);
  const [openNovaPagina, setOpenNovaPagina] = useState(false);
  const [openEditarPagina, setOpenEditarPagina] = useState(false);
  const [openExcluirPagina, setOpenExcluirPagina] = useState(false);

  // Obter categorias únicas para o filtro
  const categorias = Array.from(new Set(paginas.map(pagina => pagina.categoria)));

  // Filtrar páginas jurídicas
  const paginasFiltradas = paginas.filter(pagina => {
    return (
      pagina.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagina.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagina.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pagina.link.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Função para adicionar nova página jurídica
  const adicionarPagina = (dados: z.infer<typeof paginaSchema>) => {
    const novaPagina: PaginaJuridica = {
      id: `pagina-${Date.now()}`,
      titulo: dados.titulo,
      descricao: dados.descricao,
      link: dados.link,
      categoria: dados.categoria
    };
    
    setPaginas([...paginas, novaPagina]);
    setOpenNovaPagina(false);
    
    toast({
      title: "Página jurídica adicionada",
      description: `A página "${novaPagina.titulo}" foi adicionada com sucesso!`,
    });
  };

  // Função para atualizar página jurídica existente
  const atualizarPagina = (dados: z.infer<typeof paginaSchema>) => {
    if (!paginaParaEditar) return;
    
    const paginasAtualizadas = paginas.map(pagina => 
      pagina.id === paginaParaEditar.id ? { 
        ...pagina, 
        titulo: dados.titulo,
        descricao: dados.descricao,
        link: dados.link,
        categoria: dados.categoria
      } : pagina
    );
    
    setPaginas(paginasAtualizadas);
    setOpenEditarPagina(false);
    setPaginaParaEditar(null);
    
    toast({
      title: "Página jurídica atualizada",
      description: `A página "${dados.titulo}" foi atualizada com sucesso!`,
    });
  };

  // Função para excluir página jurídica
  const excluirPagina = () => {
    if (!paginaParaExcluir) return;
    
    const paginasAtualizadas = paginas.filter(pagina => pagina.id !== paginaParaExcluir.id);
    
    setPaginas(paginasAtualizadas);
    setOpenExcluirPagina(false);
    
    toast({
      title: "Página jurídica excluída",
      description: `A página "${paginaParaExcluir.titulo}" foi excluída com sucesso!`,
      variant: "destructive",
    });
    
    setPaginaParaExcluir(null);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">Páginas Jurídicas</CardTitle>
            <CardDescription>Acesso a legislações e documentos jurídicos importantes</CardDescription>
          </div>
          <Button size="sm" onClick={() => setOpenNovaPagina(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Página
          </Button>
        </div>
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
          {paginasFiltradas.length === 0 ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              Nenhuma página jurídica encontrada com os filtros selecionados.
            </div>
          ) : (
            paginasFiltradas.map((pagina) => (
              <Card key={pagina.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{pagina.titulo}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {pagina.categoria}
                      </span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaginaParaEditar(pagina);
                            setOpenEditarPagina(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPaginaParaExcluir(pagina);
                            setOpenExcluirPagina(true);
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

        {/* Diálogo para nova página */}
        <Dialog open={openNovaPagina} onOpenChange={setOpenNovaPagina}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Página Jurídica</DialogTitle>
              <DialogDescription>
                Preencha as informações da nova página jurídica abaixo.
              </DialogDescription>
            </DialogHeader>
            <FormularioPagina 
              categorias={categorias}
              onSubmit={adicionarPagina} 
              onCancel={() => setOpenNovaPagina(false)} 
            />
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar página */}
        <Dialog open={openEditarPagina} onOpenChange={setOpenEditarPagina}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Página Jurídica</DialogTitle>
              <DialogDescription>
                Atualize as informações da página jurídica abaixo.
              </DialogDescription>
            </DialogHeader>
            {paginaParaEditar && (
              <FormularioPagina 
                categorias={categorias}
                pagina={paginaParaEditar} 
                onSubmit={atualizarPagina} 
                onCancel={() => {
                  setOpenEditarPagina(false);
                  setPaginaParaEditar(null);
                }} 
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Diálogo para confirmar exclusão */}
        <Dialog open={openExcluirPagina} onOpenChange={setOpenExcluirPagina}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir esta página jurídica? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setOpenExcluirPagina(false);
                  setPaginaParaExcluir(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={excluirPagina}
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

// Componente de formulário para criação e edição de páginas jurídicas
const FormularioPagina = ({ 
  pagina,
  categorias,
  onSubmit, 
  onCancel 
}: { 
  pagina?: PaginaJuridica;
  categorias: string[];
  onSubmit: (dados: z.infer<typeof paginaSchema>) => void;
  onCancel: () => void;
}) => {
  const [categoriaNova, setCategoriaNova] = useState(false);

  const form = useForm<z.infer<typeof paginaSchema>>({
    resolver: zodResolver(paginaSchema),
    defaultValues: pagina ? {
      titulo: pagina.titulo,
      descricao: pagina.descricao,
      link: pagina.link,
      categoria: pagina.categoria
    } : {
      titulo: "",
      descricao: "",
      link: "https://",
      categoria: categorias.length > 0 ? categorias[0] : ""
    }
  });

  function handleSubmit(valores: z.infer<typeof paginaSchema>) {
    onSubmit(valores);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título da página jurídica" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Breve descrição do conteúdo"
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
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

        <DialogFooter className="sm:justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {pagina ? "Salvar alterações" : "Adicionar página"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default PaginasJuridicasTab;
