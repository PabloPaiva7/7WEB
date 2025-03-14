
import { useState } from "react";
import { DicaHack, CategoriaDica } from "@/types/mural.types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ThumbsUp, Edit, Trash, PlusCircle, HelpCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DicaHackForm } from "./DicaHackForm";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { cn } from "@/lib/utils";

interface DicasHacksProps {
  dicas: DicaHack[];
  filtroDica: CategoriaDica | "";
  setFiltroDica: (categoria: CategoriaDica | "todos") => void;
  onAdd: (dica: Omit<DicaHack, "id" | "dataCriacao" | "curtidas">) => void;
  onEdit: (id: string, dica: Omit<DicaHack, "id" | "dataCriacao" | "curtidas">) => void;
  onDelete: (id: string) => void;
  onLike: (id: string) => void;
}

export const DicasHacks = ({
  dicas,
  filtroDica,
  setFiltroDica,
  onAdd,
  onEdit,
  onDelete,
  onLike
}: DicasHacksProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [dicaParaEditar, setDicaParaEditar] = useState<DicaHack | undefined>(undefined);
  const [dicaParaExcluir, setDicaParaExcluir] = useState<string | null>(null);

  // Filtros
  const filteredDicas = dicas.filter(dica => {
    const matchesSearchTerm = dica.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dica.conteudo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filtroDica === "" || dica.categoria === filtroDica;
    return matchesSearchTerm && matchesCategory;
  });

  // Ordenar por curtidas e data
  const sortedDicas = [...filteredDicas].sort((a, b) => {
    if (b.curtidas !== a.curtidas) {
      return b.curtidas - a.curtidas; // Mais curtidas primeiro
    }
    return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime(); // Mais recente depois
  });

  const handleLike = (id: string) => {
    onLike(id);
  };

  const handleEdit = (dica: DicaHack) => {
    setDicaParaEditar(dica);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    setDicaParaExcluir(id);
  };

  const confirmarExclusao = () => {
    if (dicaParaExcluir) {
      onDelete(dicaParaExcluir);
      setDicaParaExcluir(null);
    }
  };

  const handleSave = (dicaData: Omit<DicaHack, "id" | "dataCriacao" | "curtidas">) => {
    if (dicaParaEditar) {
      onEdit(dicaParaEditar.id, dicaData);
    } else {
      onAdd(dicaData);
    }
    setShowAddForm(false);
    setDicaParaEditar(undefined);
  };

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

  // Formatar data para exibição
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return format(data, "d 'de' MMMM", { locale: ptBR });
  };

  // Transform categoria string to display format
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

  const renderFiltros = () => (
    <div className="flex items-center space-x-2 mb-4 flex-wrap">
      <Button
        variant={filtroDica === "" ? "default" : "outline"}
        size="sm"
        onClick={() => setFiltroDica("todos")}
      >
        Todos
      </Button>
      <Button
        variant={filtroDica === "trabalho" ? "default" : "outline"}
        size="sm"
        onClick={() => setFiltroDica("trabalho")}
      >
        Trabalho
      </Button>
      <Button
        variant={filtroDica === "produtividade" ? "default" : "outline"}
        size="sm"
        onClick={() => setFiltroDica("produtividade")}
      >
        Produtividade
      </Button>
      <Button
        variant={filtroDica === "tecnologia" ? "default" : "outline"}
        size="sm"
        onClick={() => setFiltroDica("tecnologia")}
      >
        Tecnologia
      </Button>
      <Button
        variant={filtroDica === "bem-estar" ? "default" : "outline"}
        size="sm"
        onClick={() => setFiltroDica("bem-estar")}
      >
        Bem-Estar
      </Button>
      <Button
        variant={filtroDica === "outro" ? "default" : "outline"}
        size="sm"
        onClick={() => setFiltroDica("outro")}
      >
        Outro
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          Dicas e Hacks
        </h2>
        <Button onClick={() => {
          setDicaParaEditar(undefined);
          setShowAddForm(true);
        }}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Dica
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px]">
          <Input
            placeholder="Buscar dicas e hacks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        {renderFiltros()}
      </div>

      {sortedDicas.length === 0 ? (
        <div className="text-center py-10">
          <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Nenhuma dica encontrada</h3>
          <p className="text-muted-foreground mt-2">
            Compartilhe uma dica útil com a equipe ou ajuste seus filtros de busca.
          </p>
          <Button onClick={() => {
            setDicaParaEditar(undefined);
            setShowAddForm(true);
          }} className="mt-4">
            <PlusCircle className="h-4 w-4 mr-2" />
            Compartilhar Dica
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDicas.map((dica) => (
            <Card key={dica.id} className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{dica.titulo}</CardTitle>
                  <Badge className={cn("font-normal", getCategoryColor(dica.categoria))}>
                    {formatCategoria(dica.categoria)}
                  </Badge>
                </div>
                <CardDescription>
                  Por {dica.autor} • {formatarData(dica.dataCriacao)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex-grow">
                <p className="whitespace-pre-line">{dica.conteudo}</p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(dica)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(dica.id)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(dica.id)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {dica.curtidas}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <DicaHackForm
        dica={dicaParaEditar}
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setDicaParaEditar(undefined);
        }}
        onSave={handleSave}
      />

      <ConfirmDeleteDialog
        isOpen={!!dicaParaExcluir}
        onClose={() => setDicaParaExcluir(null)}
        onConfirm={confirmarExclusao}
        title="Excluir dica"
        description="Tem certeza que deseja excluir esta dica? Esta ação não pode ser desfeita."
      />
    </div>
  );
};
