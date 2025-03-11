
import { Megaphone } from "lucide-react";

interface EmptyMuralProps {
  filtroTexto: string;
  filtroTipo: string;
}

export const EmptyMural = ({ filtroTexto, filtroTipo }: EmptyMuralProps) => {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-12 text-center">
      <Megaphone className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium">Nenhum anúncio encontrado</h3>
      <p className="text-muted-foreground mt-1">
        {filtroTexto || filtroTipo !== "todos" 
          ? "Tente ajustar os filtros para encontrar o que procura" 
          : "Publique o primeiro anúncio para começar"}
      </p>
    </div>
  );
};
