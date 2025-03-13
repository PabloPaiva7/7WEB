
import { ConteudoRecomendado, TipoConteudo } from "@/types/mural.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Film, BookOpen, GraduationCap, Play, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ConteudosRecomendadosProps {
  conteudos: ConteudoRecomendado[];
  filtroConteudo: TipoConteudo | "todos";
  setFiltroConteudo: (filtro: TipoConteudo | "todos") => void;
}

export const ConteudosRecomendados = ({ 
  conteudos, 
  filtroConteudo, 
  setFiltroConteudo 
}: ConteudosRecomendadosProps) => {
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Conteúdos Recomendados</h2>
      
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
                <Card key={conteudo.id} className="overflow-hidden h-full flex flex-col">
                  {conteudo.imagem && (
                    <div className="relative w-full h-40">
                      <img 
                        src={conteudo.imagem} 
                        alt={conteudo.titulo} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5">
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
    </div>
  );
};
