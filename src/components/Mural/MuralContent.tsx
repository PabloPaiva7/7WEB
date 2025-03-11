
import { Anuncio } from "@/types/mural.types";
import { AnuncioCard } from "./AnuncioCard";
import { AnuncioCarousel } from "./AnuncioCarousel";
import { EmptyMural } from "./EmptyMural";

interface MuralContentProps {
  anuncios: Anuncio[];
  filtroTexto: string;
  filtroTipo: string;
  modoVisualizacao: "carrossel" | "grade";
  onEdit: (anuncio: Anuncio) => void;
  onDelete: (id: string) => void;
  onUpdate: (anuncio: Anuncio) => void;
}

export const MuralContent = ({ 
  anuncios, 
  filtroTexto, 
  filtroTipo, 
  modoVisualizacao, 
  onEdit, 
  onDelete, 
  onUpdate 
}: MuralContentProps) => {
  if (anuncios.length === 0) {
    return <EmptyMural filtroTexto={filtroTexto} filtroTipo={filtroTipo} />;
  }

  if (modoVisualizacao === "carrossel") {
    return (
      <AnuncioCarousel
        anuncios={anuncios}
        onEdit={onEdit}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {anuncios.map(anuncio => (
        <AnuncioCard
          key={anuncio.id}
          anuncio={anuncio}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};
