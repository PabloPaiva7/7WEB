
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DicaHack, CategoriaDica } from "@/types/mural.types";
import { Lightbulb, ThumbsUp, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DicaDetalheDialogProps {
  dica: DicaHack | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: (id: string) => void;
  onEdit: (dica: DicaHack) => void;
  onDelete: (id: string) => void;
}

export const DicaDetalheDialog = ({
  dica,
  isOpen,
  onClose,
  onLike,
  onEdit,
  onDelete
}: DicaDetalheDialogProps) => {
  if (!dica) return null;

  // Obter a cor da tag baseada na categoria
  const getCategoryColor = (categoria: CategoriaDica) => {
    switch (categoria) {
      case "trabalho": return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "produtividade": return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "tecnologia": return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      case "bem-estar": return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
    }
  };

  const formatCategoria = (categoria: CategoriaDica) => {
    const categoriaMap: Record<CategoriaDica, string> = {
      "trabalho": "Trabalho",
      "produtividade": "Produtividade",
      "tecnologia": "Tecnologia",
      "bem-estar": "Bem-estar",
      "outro": "Outro"
    };
    return categoriaMap[categoria] || categoria;
  };

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return format(data, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-card text-card-foreground">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl text-foreground">{dica.titulo}</DialogTitle>
            <Badge className={cn("font-normal", getCategoryColor(dica.categoria))}>
              {formatCategoria(dica.categoria)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-sm text-muted-foreground">
            Por {dica.autor} • {formatarData(dica.dataCriacao)}
          </div>
          
          <div className="whitespace-pre-line text-lg text-foreground">{dica.conteudo}</div>
          
          <div className="flex justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(dica)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(dica.id)}
              >
                <Trash className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLike(dica.id)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Curtir ({dica.curtidas})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
