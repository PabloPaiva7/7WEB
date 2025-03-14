
import { useState } from "react";
import { DicaHack, CategoriaDica } from "@/types/mural.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ThumbsUp, Sparkles, Zap, BookOpen, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DicaHackForm } from "./DicaHackForm";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

interface DicasHacksProps {
  dicas: DicaHack[];
  filtroDica: CategoriaDica | "todos";
  setFiltroDica: (categoria: CategoriaDica | "todos") => void;
  onAdd: (dica: Omit<DicaHack, "id" | "dataCriacao" | "curtidas">) => void;
  onEdit: (id: string, dica: Omit<DicaHack, "id" | "dataCriacao" | "curtidas">) => void;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
}

// Ícones para cada categoria de dica
const iconesPorCategoria: Record<CategoriaDica, React.ReactNode> = {
  trabalho: <BookOpen className="h-5 w-5 text-blue-500" />,
  produtividade: <Zap className="h-5 w-5 text-yellow-500" />,
  tecnologia: <Sparkles className="h-5 w-5 text-purple-500" />,
  "bem-estar": <MessageSquare className="h-5 w-5 text-green-500" />,
  outro: <Lightbulb className="h-5 w-5 text-gray-500" />
};

// Cores para cada categoria de dica
const corPorCategoria: Record<CategoriaDica, string> = {
  trabalho: "bg-blue-100 text-blue-800",
  produtividade: "bg-yellow-100 text-yellow-800",
  tecnologia: "bg-purple-100 text-purple-800",
  "bem-estar": "bg-green-100 text-green-800",
  outro: "bg-gray-100 text-gray-800"
};

// Labels para cada categoria
const labelPorCategoria: Record<CategoriaDica, string> = {
  trabalho: "Trabalho",
  produtividade: "Produtividade",
  tecnologia: "Tecnologia",
  "bem-estar": "Bem-estar",
  outro: "Outro"
};

export const DicasHacks = ({
  dicas,
  filtroDica,
  setFiltroDica,
  onAdd,
  onEdit,
  onDelete,
  onLike
}: DicasHacksProps) => {
  const [pesquisa, setPesquisa] = useState("");
  const [mostrarFormDica, setMostrarFormDica] = useState(false);
  const [dicaSelecionada, setDicaSelecionada] = useState<DicaHack | undefined>(undefined);
  const [excluirId, setExcluirId] = useState<string | null>(null);

  // Filtrar dicas com base na pesquisa e categoria
  const dicasFiltradas = dicas.filter(dica => {
    const matchTexto = 
      dica.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
      dica.conteudo.toLowerCase().includes(pesquisa.toLowerCase()) ||
      dica.autor.toLowerCase().includes(pesquisa.toLowerCase());
    
    const matchCategoria = filtroDica === "todos" || dica.categoria === filtroDica;
    
    return matchTexto && matchCategoria;
  });

  const handleEditarDica = (dica: DicaHack) => {
    setDicaSelecionada(dica);
    setMostrarFormDica(true);
  };

  const handleExcluirDica = (id: string) => {
    setExcluirId(id);
  };

  const confirmarExclusao = () => {
    if (excluirId) {
      onDelete(excluirId);
      setExcluirId(null);
    }
  };

  const handleSalvarDica = (novaDica: Omit<DicaHack, "id" | "dataCriacao" | "curtidas">) => {
    if (dicaSelecionada) {
      onEdit(dicaSelecionada.id, novaDica);
    } else {
      onAdd(novaDica);
    }
    setDicaSelecionada(undefined);
    setMostrarFormDica(false);
  };

  return (
    <div className="space-y-6">
      {/* Barra de filtros */}
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="flex flex-1 flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Pesquisar dicas..."
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
              className="pl-10"
            />
            <Lightbulb className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="w-full sm:w-48">
            <Select
              value={filtroDica}
              onValueChange={(value) => setFiltroDica(value as CategoriaDica | "todos")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as categorias</SelectItem>
                <SelectItem value="trabalho">Trabalho</SelectItem>
                <SelectItem value="produtividade">Produtividade</SelectItem>
                <SelectItem value="tecnologia">Tecnologia</SelectItem>
                <SelectItem value="bem-estar">Bem-estar</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          onClick={() => {
            setDicaSelecionada(undefined);
            setMostrarFormDica(true);
          }}
          className="gap-2"
        >
          <Lightbulb className="h-4 w-4" />
          Nova Dica
        </Button>
      </div>

      {/* Lista de dicas */}
      {dicasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Lightbulb className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">Nenhuma dica encontrada</h3>
          <p className="text-muted-foreground mt-2">
            {pesquisa || filtroDica !== "todos" ? 
              "Tente ajustar seus filtros ou adicione uma nova dica." : 
              "Seja o primeiro a compartilhar uma dica útil!"}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setDicaSelecionada(undefined);
              setMostrarFormDica(true);
            }}
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Adicionar Dica
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dicasFiltradas.map(dica => (
            <Card key={dica.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge className={`${corPorCategoria[dica.categoria]}`}>
                    {labelPorCategoria[dica.categoria]}
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-2">{dica.titulo}</CardTitle>
                <CardDescription>
                  {format(new Date(dica.dataCriacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{dica.conteudo}</div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="text-sm text-gray-500">Por: {dica.autor}</div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => onLike(dica.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{dica.curtidas}</span>
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEditarDica(dica)} 
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleExcluirDica(dica.id)} 
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Form para adicionar/editar dica */}
      <DicaHackForm
        dica={dicaSelecionada}
        isOpen={mostrarFormDica}
        onClose={() => {
          setMostrarFormDica(false);
          setDicaSelecionada(undefined);
        }}
        onSave={handleSalvarDica}
      />

      {/* Diálogo de confirmação de exclusão */}
      <ConfirmDeleteDialog
        isOpen={!!excluirId}
        onClose={() => setExcluirId(null)}
        onConfirm={confirmarExclusao}
        title="Excluir Dica"
        description="Tem certeza que deseja excluir esta dica? Esta ação não pode ser desfeita."
      />
    </div>
  );
};
