
import { useMuralAnuncios } from "@/hooks/useMuralAnuncios";
import { FiltroAnuncios } from "@/components/Mural/FiltroAnuncios";
import { AnuncioForm } from "@/components/Mural/AnuncioForm";
import { MuralHeader } from "@/components/Mural/MuralHeader";
import { MuralContent } from "@/components/Mural/MuralContent";
import { ExcluirAnuncioDialog } from "@/components/Mural/ExcluirAnuncioDialog";

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

  return (
    <div>
      <MuralHeader 
        visualizacao={visualizacao}
        setVisualizacao={setVisualizacao}
        modoVisualizacao={modoVisualizacao}
        toggleModoVisualizacao={toggleModoVisualizacao}
      />
      
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
