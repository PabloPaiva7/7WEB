
import { useState } from "react";
import { ConteudoRecomendado, TipoConteudo } from "@/types/mural.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Film, BookOpen, GraduationCap, Play, ExternalLink, Plus, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ConteudoRecomendadoForm } from "./ConteudoRecomendadoForm";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { toast } from "sonner";

interface ConteudosRecomendadosProps {
  conteudos: ConteudoRecomendado[];
  filtroConteudo: TipoConteudo | "todos";
  setFiltroConteudo: (filtro: TipoConteudo | "todos") => void;
  onAdd: (conteudo: Omit<ConteudoRecomendado, "id" | "dataCriacao">) => void;
  onEdit: (id: string, conteudo: Omit<ConteudoRecomendado, "id" | "dataCriacao">) => void;
  onDelete: (id: string) => void;
}

export const ConteudosRecomendados = ({ 
  conteudos, 
  filtroConteudo, 
  setFiltroConteudo,
  onAdd,
  onEdit,
  onDelete
}: ConteudosRecomendadosProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedConteudo, setSelectedConteudo] = useState<ConteudoRecomendado | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conteudoToDelete, setConteudoToDelete] = useState<string | null>(null);

  // Obter ícone baseado no tipo
  const getIconByType = (tipo: TipoConteudo) => {
    switch (tipo) {
      case "livro":
        return <Book className="h-5 w-5 text-emerald-500" />;
      case "filme":
        return <Film className="h-5 w-5 text-red-500" />;
      case "serie":
        return <Play className="h-5 w-5 text-purple-500" />;
      case "curso":
        return <GraduationCap className="h-5 w-5 text-blue-500" />;
      case "versiculo":
        return <BookOpen className="h-5 w-5 text-amber-500" />;
    }
  };

  // Formatar data para exibição
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return format(data, "d 'de' MMMM", { locale: ptBR });
  };

  const handleEdit = (conteudo: ConteudoRecomendado) => {
    setSelectedConteudo(conteudo);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setConteudoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (conteudoToDelete) {
      onDelete(conteudoToDelete);
      toast.success("Conteúdo excluído com sucesso");
      setConteudoToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSave = (conteudoData: Omit<ConteudoRecomendado, "id" | "dataCriacao">) => {
    if (selectedConteudo) {
      onEdit(selectedConteudo.id, conteudoData);
      toast.success("Conteúdo atualizado com sucesso");
    } else {
      onAdd(conteudoData);
      toast.success("Conteúdo adicionado com sucesso");
    }
    setSelectedConteudo(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Conteúdos Recomendados</h2>
        <Button onClick={() => {
          setSelectedConteudo(undefined);
          setFormOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
      
      <Tabs defaultValue="todos" value={filtroConteudo} onValueChange={(value) => setFiltroConteudo(value as TipoConteudo | "todos")}>
        <TabsList className="w-full flex justify-start mb-4 overflow-x-auto">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="livro">Livros</TabsTrigger>
          <TabsTrigger value="versiculo">Versículos</TabsTrigger>
          <TabsTrigger value="filme">Filmes</TabsTrigger>
          <TabsTrigger value="serie">Séries</TabsTrigger>
          <TabsTrigger value="curso">Cursos</TabsTrigger>
        </TabsList>
        
        <TabsContent value={filtroConteudo} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {conteudos.length > 0 ? (
              conteudos.map((conteudo) => (
                <Card key={conteudo.id} className="overflow-hidden h-full flex flex-col relative group">
                  {/* Actions Overlay */}
                  <div className="absolute top-2 right-2 flex space-x-1 bg-white/80 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(conteudo)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(conteudo.id)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>

                  {conteudo.imagem && (
                    <div className="relative w-full h-40">
                      <img 
                        src={conteudo.imagem} 
                        alt={conteudo.titulo} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-white/80 rounded-full p-1.5">
                        {getIconByType(conteudo.tipo)}
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className={conteudo.imagem ? "pt-4" : "flex-row justify-between items-start"}>
                    <div>
                      <CardTitle className="text-lg">{conteudo.titulo}</CardTitle>
                      {conteudo.autor && (
                        <CardDescription>{conteudo.autor}</CardDescription>
                      )}
                    </div>
                    {!conteudo.imagem && getIconByType(conteudo.tipo)}
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <p className={`${conteudo.tipo === "versiculo" ? "text-lg italic text-center" : ""}`}>
                      {conteudo.descricao}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-4 mt-auto">
                    <p className="text-xs text-muted-foreground">
                      Adicionado em {formatarData(conteudo.dataCriacao)}
                    </p>
                    {conteudo.link && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={conteudo.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Acessar
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Nenhum conteúdo encontrado</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Formulário de conteúdo recomendado */}
      <ConteudoRecomendadoForm 
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        conteudo={selectedConteudo}
      />

      {/* Diálogo de confirmação de exclusão */}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir conteúdo"
        description="Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita."
      />
    </div>
  );
};
