
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Anuncio, TipoAnuncio } from "@/types/mural.types";
import { Calendar, Flag, Megaphone, Signpost, Newspaper, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { DetalhesAnuncio } from "./DetalhesAnuncio";

const iconesPorTipo: Record<TipoAnuncio, React.ReactNode> = {
  treinamento: <Calendar className="h-5 w-5 text-blue-500" />,
  corporativo: <Megaphone className="h-5 w-5 text-purple-500" />,
  mudanca: <Signpost className="h-5 w-5 text-orange-500" />,
  chamada: <Newspaper className="h-5 w-5 text-green-500" />,
  outro: <Megaphone className="h-5 w-5 text-gray-500" />
};

const corPorTipo: Record<TipoAnuncio, string> = {
  treinamento: "bg-blue-100 text-blue-800",
  corporativo: "bg-purple-100 text-purple-800",
  mudanca: "bg-orange-100 text-orange-800",
  chamada: "bg-green-100 text-green-800",
  outro: "bg-gray-100 text-gray-800"
};

const labelPorTipo: Record<TipoAnuncio, string> = {
  treinamento: "Treinamento",
  corporativo: "Aviso Corporativo",
  mudanca: "Mudança",
  chamada: "Chamada",
  outro: "Outro"
};

interface AnuncioCarouselProps {
  anuncios: Anuncio[];
  onEdit: (anuncio: Anuncio) => void;
  onDelete: (id: string) => void;
  onUpdate: (anuncio: Anuncio) => void;
}

export const AnuncioCarousel = ({ anuncios, onEdit, onDelete, onUpdate }: AnuncioCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetalhes, setShowDetalhes] = useState(false);
  
  useEffect(() => {
    setCurrentIndex(0);
  }, [anuncios]);
  
  if (anuncios.length === 0) {
    return null;
  }
  
  const anuncio = anuncios[currentIndex];
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % anuncios.length);
  };
  
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + anuncios.length) % anuncios.length);
  };
  
  const dataPublicacaoFormatada = format(new Date(anuncio.dataPublicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const temDataEvento = anuncio.dataEvento && anuncio.dataEvento.trim() !== "";
  
  const renderDataEvento = () => {
    if (!temDataEvento) return null;
    const dataEventoFormatada = format(new Date(anuncio.dataEvento!), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    return (
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        <span>Data do evento: {dataEventoFormatada}</span>
      </div>
    );
  };

  return (
    <div className="relative mx-auto max-w-3xl">
      <Card className={`${anuncio.importante ? 'border-l-4 border-l-red-500' : ''} min-h-[300px] transition-all shadow-md`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {iconesPorTipo[anuncio.tipo]}
              <Badge className={`${corPorTipo[anuncio.tipo]}`}>
                {labelPorTipo[anuncio.tipo]}
              </Badge>
              {anuncio.importante && (
                <Badge variant="destructive" className="ml-2 flex items-center gap-1">
                  <Flag className="h-3 w-3" /> Importante
                </Badge>
              )}
            </div>
          </div>
          <CardTitle className="text-xl mt-2">{anuncio.titulo}</CardTitle>
          <CardDescription className="flex flex-col gap-1">
            <div className="text-sm text-gray-500 dark:text-gray-400">Publicado em {dataPublicacaoFormatada}</div>
            {renderDataEvento()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap line-clamp-4">{anuncio.conteudo}</div>
          <Button
            variant="link"
            className="mt-2 h-auto p-0"
            onClick={() => setShowDetalhes(true)}
          >
            Ler mais
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-between w-full">
            <div>Por: {anuncio.autor}</div>
            <div className="flex gap-2">
              {anuncio.permitirInscricao && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDetalhes(true)}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Inscrever-se
                </Button>
              )}
              <button 
                onClick={() => onEdit(anuncio)} 
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Editar
              </button>
              <button 
                onClick={() => onDelete(anuncio.id)} 
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Excluir
              </button>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      <div className="absolute inset-y-0 left-0 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handlePrevious}
          className="h-10 w-10 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 hover:bg-opacity-100 dark:hover:bg-opacity-100 rounded-full shadow-md"
          disabled={anuncios.length <= 1}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNext}
          className="h-10 w-10 bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 hover:bg-opacity-100 dark:hover:bg-opacity-100 rounded-full shadow-md"
          disabled={anuncios.length <= 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex justify-center mt-4 gap-2">
        {anuncios.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            className={`w-3 h-3 p-0 rounded-full ${
              index === currentIndex ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
      
      <DetalhesAnuncio
        anuncio={anuncio}
        isOpen={showDetalhes}
        onClose={() => setShowDetalhes(false)}
        onUpdate={onUpdate}
      />
    </div>
  );
};
