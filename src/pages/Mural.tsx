
import { useMuralAnuncios } from "@/hooks/useMuralAnuncios";
import { useMuralInterativo } from "@/hooks/useMuralInterativo";
import { FiltroAnuncios } from "@/components/Mural/FiltroAnuncios";
import { AnuncioForm } from "@/components/Mural/AnuncioForm";
import { MuralHeader } from "@/components/Mural/MuralHeader";
import { MuralContent } from "@/components/Mural/MuralContent";
import { ExcluirAnuncioDialog } from "@/components/Mural/ExcluirAnuncioDialog";
import { Aniversariantes } from "@/components/Mural/Aniversariantes";
import { ConteudosRecomendados } from "@/components/Mural/ConteudosRecomendados";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, Cake, BookOpen } from "lucide-react";

export default function Mural() {
  const {
    anunciosFiltrados,
    anuncioSelecionado,
    mostrarNovoAnuncio,
    filtroTexto,
    filtroTipo,
    visualizacao,
    excluirId,
    modoVisualizacao,
    setMostrarNovoAnuncio,
    setFiltroTexto,
    setFiltroTipo,
    setVisualizacao,
    setAnuncioSelecionado,
    setExcluirId,
    handleSalvarAnuncio,
    handleEditar,
    handleExcluir,
    confirmarExclusao,
    toggleModoVisualizacao,
    handleUpdate
  } = useMuralAnuncios();

  const {
    aniversariantesDoDia,
    aniversariantesDaSemana,
    aniversariantesDoMes,
    conteudosFiltrados,
    filtroConteudo,
    setFiltroConteudo,
    adicionarAniversariante,
    editarAniversariante,
    excluirAniversariante,
    adicionarConteudo,
    editarConteudo,
    excluirConteudo
  } = useMuralInterativo();

  return (
    <div>
      <MuralHeader 
        visualizacao={visualizacao}
        setVisualizacao={setVisualizacao}
        modoVisualizacao={modoVisualizacao}
        toggleModoVisualizacao={toggleModoVisualizacao}
      />
      
      <Tabs defaultValue="anuncios" className="mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="anuncios">
            <Megaphone className="h-4 w-4 mr-2" />
            Anúncios
          </TabsTrigger>
          <TabsTrigger value="aniversariantes">
            <Cake className="h-4 w-4 mr-2" />
            Aniversariantes
          </TabsTrigger>
          <TabsTrigger value="conteudos">
            <BookOpen className="h-4 w-4 mr-2" />
            Conteúdos Recomendados
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="anuncios">
          <FiltroAnuncios
            filtroTexto={filtroTexto}
            setFiltroTexto={setFiltroTexto}
            filtroTipo={filtroTipo}
            setFiltroTipo={setFiltroTipo}
            setMostrarNovoAnuncio={setMostrarNovoAnuncio}
          />
          
          <MuralContent 
            anuncios={anunciosFiltrados}
            filtroTexto={filtroTexto}
            filtroTipo={filtroTipo}
            modoVisualizacao={modoVisualizacao}
            onEdit={handleEditar}
            onDelete={handleExcluir}
            onUpdate={handleUpdate}
          />
        </TabsContent>
        
        <TabsContent value="aniversariantes">
          <Aniversariantes 
            aniversariantesDoDia={aniversariantesDoDia}
            aniversariantesDaSemana={aniversariantesDaSemana}
            aniversariantesDoMes={aniversariantesDoMes}
            onAdd={adicionarAniversariante}
            onEdit={editarAniversariante}
            onDelete={excluirAniversariante}
          />
        </TabsContent>
        
        <TabsContent value="conteudos">
          <ConteudosRecomendados 
            conteudos={conteudosFiltrados}
            filtroConteudo={filtroConteudo}
            setFiltroConteudo={setFiltroConteudo}
            onAdd={adicionarConteudo}
            onEdit={editarConteudo}
            onDelete={excluirConteudo}
          />
        </TabsContent>
      </Tabs>
      
      <AnuncioForm
        anuncio={anuncioSelecionado}
        isOpen={mostrarNovoAnuncio}
        onClose={() => {
          setMostrarNovoAnuncio(false);
          setAnuncioSelecionado(undefined);
        }}
        onSave={handleSalvarAnuncio}
      />
      
      <ExcluirAnuncioDialog 
        isOpen={!!excluirId}
        onClose={() => setExcluirId(null)}
        onConfirm={confirmarExclusao}
      />
    </div>
  );
}
