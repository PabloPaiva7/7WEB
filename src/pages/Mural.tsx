
import { useState, useEffect } from "react";
import { Anuncio, NovoAnuncio } from "@/types/mural.types";
import { AnuncioCard } from "@/components/Mural/AnuncioCard";
import { AnuncioForm } from "@/components/Mural/AnuncioForm";
import { FiltroAnuncios } from "@/components/Mural/FiltroAnuncios";
import { AnuncioCarousel } from "@/components/Mural/AnuncioCarousel";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar, Megaphone, LayoutGrid, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const dadosExemplo: Anuncio[] = [
  {
    id: "1",
    titulo: "Treinamento de Excel Avançado",
    conteudo: "Estamos organizando um treinamento de Excel Avançado para todos os colaboradores interessados. O treinamento abordará fórmulas avançadas, tabelas dinâmicas e automação com macros.\n\nVagas limitadas!",
    tipo: "treinamento",
    dataPublicacao: new Date().toISOString(),
    dataEvento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    autor: "Departamento de RH",
    importante: true
  },
  {
    id: "2",
    titulo: "Novos procedimentos para solicitação de férias",
    conteudo: "A partir do próximo mês, todas as solicitações de férias deverão ser feitas através do novo sistema online. O prazo mínimo para solicitação será de 30 dias de antecedência.",
    tipo: "corporativo",
    dataPublicacao: new Date().toISOString(),
    autor: "Diretoria",
    importante: false
  },
  {
    id: "3",
    titulo: "Mudança no horário de funcionamento",
    conteudo: "Informamos que a partir da próxima semana nosso horário de funcionamento será das 9h às 18h, de segunda a sexta-feira.",
    tipo: "mudanca",
    dataPublicacao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    autor: "Administração",
    importante: true
  }
];

const STORAGE_KEY = "mural_anuncios";

export default function Mural() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [anuncioSelecionado, setAnuncioSelecionado] = useState<Anuncio | undefined>(undefined);
  const [mostrarNovoAnuncio, setMostrarNovoAnuncio] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [visualizacao, setVisualizacao] = useState("todos");
  const [excluirId, setExcluirId] = useState<string | null>(null);
  const [modoVisualizacao, setModoVisualizacao] = useState<"carrossel" | "grade">("carrossel");

  // Carregar anúncios do localStorage
  useEffect(() => {
    const storedAnuncios = localStorage.getItem(STORAGE_KEY);
    if (storedAnuncios) {
      setAnuncios(JSON.parse(storedAnuncios));
    } else {
      // Usar dados de exemplo na primeira execução
      setAnuncios(dadosExemplo);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosExemplo));
    }
  }, []);

  // Salvar anúncios no localStorage quando mudar
  useEffect(() => {
    if (anuncios.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(anuncios));
    }
  }, [anuncios]);

  // Filtrar anúncios
  const anunciosFiltrados = anuncios
    .filter(anuncio => {
      // Filtro de texto
      const matchTexto = 
        anuncio.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        anuncio.conteudo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        anuncio.autor.toLowerCase().includes(filtroTexto.toLowerCase());
      
      // Filtro de tipo
      const matchTipo = filtroTipo === "todos" || anuncio.tipo === filtroTipo;
      
      // Filtro de visualização (próximos eventos ou todos)
      const matchVisualizacao = visualizacao === "todos" || 
        (visualizacao === "proximos" && anuncio.dataEvento && new Date(anuncio.dataEvento) > new Date());
      
      return matchTexto && matchTipo && matchVisualizacao;
    })
    .sort((a, b) => {
      // Ordenar por importância (importantes primeiro)
      if (a.importante !== b.importante) {
        return a.importante ? -1 : 1;
      }
      // Em seguida por data de publicação (mais recentes primeiro)
      return new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime();
    });

  const handleSalvarAnuncio = (novoAnuncio: NovoAnuncio) => {
    if (anuncioSelecionado) {
      // Editar anúncio existente
      const anunciosAtualizados = anuncios.map(anuncio => 
        anuncio.id === anuncioSelecionado.id 
          ? { ...novoAnuncio, id: anuncio.id, dataPublicacao: anuncio.dataPublicacao } 
          : anuncio
      );
      setAnuncios(anunciosAtualizados);
      toast.success("Anúncio atualizado com sucesso!");
    } else {
      // Criar novo anúncio
      const anuncioCompleto: Anuncio = {
        ...novoAnuncio,
        id: uuidv4(),
        dataPublicacao: new Date().toISOString(),
      } as Anuncio;
      
      setAnuncios([anuncioCompleto, ...anuncios]);
      toast.success("Anúncio publicado com sucesso!");
    }
    
    setAnuncioSelecionado(undefined);
  };

  const handleEditar = (anuncio: Anuncio) => {
    setAnuncioSelecionado(anuncio);
    setMostrarNovoAnuncio(true);
  };

  const handleExcluir = (id: string) => {
    setExcluirId(id);
  };

  const confirmarExclusao = () => {
    if (excluirId) {
      const anunciosAtualizados = anuncios.filter(anuncio => anuncio.id !== excluirId);
      setAnuncios(anunciosAtualizados);
      toast.success("Anúncio excluído com sucesso!");
      setExcluirId(null);
    }
  };

  const toggleModoVisualizacao = () => {
    setModoVisualizacao(prev => prev === "carrossel" ? "grade" : "carrossel");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mural de Avisos</h1>
          <p className="text-muted-foreground mt-1">
            Fique por dentro dos anúncios, treinamentos e comunicados da empresa
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <Tabs 
          defaultValue="todos" 
          value={visualizacao}
          onValueChange={setVisualizacao}
        >
          <TabsList>
            <TabsTrigger value="todos" className="gap-2">
              <Megaphone className="h-4 w-4" />
              Todos os Anúncios
            </TabsTrigger>
            <TabsTrigger value="proximos" className="gap-2">
              <Calendar className="h-4 w-4" />
              Próximos Eventos
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleModoVisualizacao}
          className="flex items-center gap-2"
        >
          {modoVisualizacao === "carrossel" ? (
            <>
              <LayoutGrid className="h-4 w-4" />
              Ver em grade
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" />
              Ver em carrossel
            </>
          )}
        </Button>
      </div>
      
      <FiltroAnuncios
        filtroTexto={filtroTexto}
        setFiltroTexto={setFiltroTexto}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        setMostrarNovoAnuncio={setMostrarNovoAnuncio}
      />
      
      {anunciosFiltrados.length > 0 ? (
        modoVisualizacao === "carrossel" ? (
          <AnuncioCarousel
            anuncios={anunciosFiltrados}
            onEdit={handleEditar}
            onDelete={handleExcluir}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {anunciosFiltrados.map(anuncio => (
              <AnuncioCard
                key={anuncio.id}
                anuncio={anuncio}
                onEdit={handleEditar}
                onDelete={handleExcluir}
              />
            ))}
          </div>
        )
      ) : (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12 text-center">
          <Megaphone className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Nenhum anúncio encontrado</h3>
          <p className="text-muted-foreground mt-1">
            {filtroTexto || filtroTipo !== "todos" 
              ? "Tente ajustar os filtros para encontrar o que procura" 
              : "Publique o primeiro anúncio para começar"}
          </p>
        </div>
      )}
      
      {/* Dialog para novo/editar anúncio */}
      <AnuncioForm
        anuncio={anuncioSelecionado}
        isOpen={mostrarNovoAnuncio}
        onClose={() => {
          setMostrarNovoAnuncio(false);
          setAnuncioSelecionado(undefined);
        }}
        onSave={handleSalvarAnuncio}
      />
      
      {/* Dialog de confirmação para exclusão */}
      <AlertDialog open={!!excluirId} onOpenChange={() => setExcluirId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir anúncio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmarExclusao} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
