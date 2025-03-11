
import { useState, useEffect } from "react";
import { Anuncio, NovoAnuncio } from "@/types/mural.types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { dadosExemplo } from "@/data/muralData";

const STORAGE_KEY = "mural_anuncios";

export const useMuralAnuncios = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [anuncioSelecionado, setAnuncioSelecionado] = useState<Anuncio | undefined>(undefined);
  const [mostrarNovoAnuncio, setMostrarNovoAnuncio] = useState(false);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [visualizacao, setVisualizacao] = useState("todos");
  const [excluirId, setExcluirId] = useState<string | null>(null);
  const [modoVisualizacao, setModoVisualizacao] = useState<"carrossel" | "grade">("carrossel");

  // Carrega os anúncios do localStorage na inicialização
  useEffect(() => {
    const storedAnuncios = localStorage.getItem(STORAGE_KEY);
    if (storedAnuncios) {
      setAnuncios(JSON.parse(storedAnuncios));
    } else {
      setAnuncios(dadosExemplo);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosExemplo));
    }
  }, []);

  // Salva os anúncios no localStorage sempre que mudam
  useEffect(() => {
    if (anuncios.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(anuncios));
    }
  }, [anuncios]);

  // Filtra e ordena os anúncios
  const anunciosFiltrados = anuncios
    .filter(anuncio => {
      const matchTexto = 
        anuncio.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        anuncio.conteudo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        anuncio.autor.toLowerCase().includes(filtroTexto.toLowerCase());
      
      const matchTipo = filtroTipo === "todos" || anuncio.tipo === filtroTipo;
      
      const matchVisualizacao = visualizacao === "todos" || 
        (visualizacao === "proximos" && anuncio.dataEvento && new Date(anuncio.dataEvento) > new Date());
      
      return matchTexto && matchTipo && matchVisualizacao;
    })
    .sort((a, b) => {
      if (a.importante !== b.importante) {
        return a.importante ? -1 : 1;
      }
      return new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime();
    });

  const handleSalvarAnuncio = (novoAnuncio: NovoAnuncio) => {
    if (anuncioSelecionado) {
      const anunciosAtualizados = anuncios.map(anuncio => 
        anuncio.id === anuncioSelecionado.id 
          ? { ...novoAnuncio, id: anuncio.id, dataPublicacao: anuncio.dataPublicacao } 
          : anuncio
      );
      setAnuncios(anunciosAtualizados);
      toast.success("Anúncio atualizado com sucesso!");
    } else {
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

  const handleUpdate = (anuncioAtualizado: Anuncio) => {
    const anunciosAtualizados = anuncios.map(anuncio => 
      anuncio.id === anuncioAtualizado.id ? anuncioAtualizado : anuncio
    );
    setAnuncios(anunciosAtualizados);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(anunciosAtualizados));
  };

  return {
    anuncios,
    anunciosFiltrados,
    anuncioSelecionado,
    mostrarNovoAnuncio,
    filtroTexto,
    filtroTipo,
    visualizacao,
    excluirId,
    modoVisualizacao,
    setAnuncioSelecionado,
    setMostrarNovoAnuncio,
    setFiltroTexto,
    setFiltroTipo,
    setVisualizacao,
    setExcluirId,
    handleSalvarAnuncio,
    handleEditar,
    handleExcluir,
    confirmarExclusao,
    toggleModoVisualizacao,
    handleUpdate
  };
};
