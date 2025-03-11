
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Anuncio, TipoAnuncio } from "@/types/mural.types";
import { Calendar, Flag, Megaphone, Signpost, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Map for icon by announcement type
const iconesPorTipo: Record<TipoAnuncio, React.ReactNode> = {
  treinamento: <Calendar className="h-5 w-5 text-blue-500" />,
  corporativo: <Megaphone className="h-5 w-5 text-purple-500" />,
  mudanca: <Signpost className="h-5 w-5 text-orange-500" />,
  chamada: <Newspaper className="h-5 w-5 text-green-500" />,
  outro: <Megaphone className="h-5 w-5 text-gray-500" />
};

// Map for badge color by announcement type
const corPorTipo: Record<TipoAnuncio, string> = {
  treinamento: "bg-blue-100 text-blue-800",
  corporativo: "bg-purple-100 text-purple-800",
  mudanca: "bg-orange-100 text-orange-800",
  chamada: "bg-green-100 text-green-800",
  outro: "bg-gray-100 text-gray-800"
};

// Map for type labels
const labelPorTipo: Record<TipoAnuncio, string> = {
  treinamento: "Treinamento",
  corporativo: "Aviso Corporativo",
  mudanca: "Mudança",
  chamada: "Chamada",
  outro: "Outro"
};

interface AnuncioCardProps {
  anuncio: Anuncio;
  onEdit: (anuncio: Anuncio) => void;
  onDelete: (id: string) => void;
  onUpdate: (anuncio: Anuncio) => void;
}

export const AnuncioCard = ({ anuncio, onEdit, onDelete, onUpdate }: AnuncioCardProps) => {
  const dataPublicacaoFormatada = format(new Date(anuncio.dataPublicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const temDataEvento = anuncio.dataEvento && anuncio.dataEvento.trim() !== "";
  
  const renderDataEvento = () => {
    if (!temDataEvento) return null;
    const dataEventoFormatada = format(new Date(anuncio.dataEvento!), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    return (
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span>Data do evento: {dataEventoFormatada}</span>
      </div>
    );
  };

  return (
    <Card className={`${anuncio.importante ? 'border-l-4 border-l-red-500' : ''} transition-all hover:shadow-md`}>
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
          <div className="text-sm text-gray-500">Publicado em {dataPublicacaoFormatada}</div>
          {renderDataEvento()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap">{anuncio.conteudo}</div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 text-sm text-gray-500">
        <div>Por: {anuncio.autor}</div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(anuncio)} 
            className="text-blue-600 hover:text-blue-800"
          >
            Editar
          </button>
          <button 
            onClick={() => onDelete(anuncio.id)} 
            className="text-red-600 hover:text-red-800"
          >
            Excluir
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};
