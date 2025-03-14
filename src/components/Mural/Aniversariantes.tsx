
import { useState } from "react";
import { Aniversariante } from "@/types/mural.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cake, Users, Calendar, Plus, Edit, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AniversarianteForm } from "./AniversarianteForm";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { toast } from "sonner";

interface AniversariantesProps {
  aniversariantesDoDia: Aniversariante[];
  aniversariantesDaSemana: Aniversariante[];
  aniversariantesDoMes: Aniversariante[];
  onAdd: (aniversariante: Omit<Aniversariante, "id">) => void;
  onEdit: (id: string, aniversariante: Omit<Aniversariante, "id">) => void;
  onDelete: (id: string) => void;
}

export const Aniversariantes = ({ 
  aniversariantesDoDia, 
  aniversariantesDaSemana, 
  aniversariantesDoMes,
  onAdd,
  onEdit,
  onDelete
}: AniversariantesProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAniversariante, setSelectedAniversariante] = useState<Aniversariante | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [aniversarianteToDelete, setAniversarianteToDelete] = useState<string | null>(null);

  // Formatar data para exibição
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return format(data, "d 'de' MMMM", { locale: ptBR });
  };

  const handleEdit = (aniversariante: Aniversariante) => {
    setSelectedAniversariante(aniversariante);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setAniversarianteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (aniversarianteToDelete) {
      onDelete(aniversarianteToDelete);
      toast.success("Aniversariante excluído com sucesso");
      setAniversarianteToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleSave = (aniversarianteData: Omit<Aniversariante, "id">) => {
    if (selectedAniversariante) {
      onEdit(selectedAniversariante.id, aniversarianteData);
      toast.success("Aniversariante atualizado com sucesso");
    } else {
      onAdd(aniversarianteData);
      toast.success("Aniversariante adicionado com sucesso");
    }
    setSelectedAniversariante(undefined);
  };

  // Renderiza um aniversariante com botões de edição e exclusão
  const renderAniversarianteItem = (aniversariante: Aniversariante) => (
    <li key={aniversariante.id} className="flex items-center">
      <div className="flex-grow flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={aniversariante.foto} />
          <AvatarFallback className="bg-pink-100 text-pink-500">
            {aniversariante.nome.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{aniversariante.nome}</p>
          <p className="text-sm text-muted-foreground">
            {aniversariante.departamento} 
            {aniversariante.data && ` • ${formatarData(aniversariante.data)}`}
          </p>
        </div>
      </div>
      <div className="flex gap-1 ml-2">
        <Button variant="ghost" size="sm" onClick={() => handleEdit(aniversariante)}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDelete(aniversariante.id)}>
          <Trash className="h-4 w-4" />
          <span className="sr-only">Excluir</span>
        </Button>
      </div>
    </li>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Aniversariantes</h2>
        <Button onClick={() => {
          setSelectedAniversariante(undefined);
          setFormOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Aniversariantes do Dia */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Hoje</CardTitle>
              <Cake className="h-5 w-5 text-pink-500" />
            </div>
            <CardDescription>
              {aniversariantesDoDia.length} aniversariante(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aniversariantesDoDia.length > 0 ? (
              <ul className="space-y-3">
                {aniversariantesDoDia.map(renderAniversarianteItem)}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum aniversariante hoje
              </p>
            )}
          </CardContent>
        </Card>

        {/* Aniversariantes da Semana */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Próximos Dias</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <CardDescription>
              {aniversariantesDaSemana.length} aniversariante(s) da semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aniversariantesDaSemana.length > 0 ? (
              <ul className="space-y-3">
                {aniversariantesDaSemana.map(renderAniversarianteItem)}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum aniversariante nos próximos dias
              </p>
            )}
          </CardContent>
        </Card>

        {/* Aniversariantes do Mês */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Do Mês</CardTitle>
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <CardDescription>
              {aniversariantesDoMes.length} aniversariante(s) este mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            {aniversariantesDoMes.length > 0 ? (
              <ul className="space-y-3">
                {aniversariantesDoMes.map(renderAniversarianteItem)}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum aniversariante este mês
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Formulário de aniversariante */}
      <AniversarianteForm 
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        aniversariante={selectedAniversariante}
      />

      {/* Diálogo de confirmação de exclusão */}
      <ConfirmDeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir aniversariante"
        description="Tem certeza que deseja excluir este aniversariante? Esta ação não pode ser desfeita."
      />
    </div>
  );
};
