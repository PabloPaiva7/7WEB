
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DemandasColumn } from "./DemandasColumn";
import { Demanda } from "@/types/demanda";
import { Clock, Inbox, CheckCircle2, Plus } from "lucide-react";
import { useState } from "react";
import { DemandaDialog } from "./DemandaDialog";
import { useToast } from "@/hooks/use-toast";

interface DemandasBoardProps {
  demandas: Demanda[];
  setDemandas: (demandas: Demanda[]) => void;
  onSelectDemanda: (demandaId: string) => void;
}

export const DemandasBoard = ({ demandas, setDemandas, onSelectDemanda }: DemandasBoardProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [demandaAtual, setDemandaAtual] = useState<Demanda | null>(null);
  const [novaDemanda, setNovaDemanda] = useState<Partial<Demanda>>({
    titulo: '',
    descricao: '',
    status: 'pendente',
    prioridade: 'media',
  });
  const { toast } = useToast();

  const demandasPendentes = demandas.filter(d => d.status === 'pendente');
  const demandasEmAndamento = demandas.filter(d => d.status === 'em_andamento');
  const demandasConcluidas = demandas.filter(d => d.status === 'concluida');

  const handleStatusChange = (demandaId: string, novoStatus: 'pendente' | 'em_andamento' | 'concluida') => {
    setDemandas(demandas.map(d => 
      d.id === demandaId ? { ...d, status: novoStatus } : d
    ));
    
    toast({
      title: "Status atualizado",
      description: `Status da demanda atualizado para ${novoStatus.replace('_', ' ')}`,
    });
  };

  const handleEditDemanda = () => {
    if (demandaAtual && demandaAtual.titulo && demandaAtual.descricao) {
      setDemandas(demandas.map(d => 
        d.id === demandaAtual.id ? demandaAtual : d
      ));
      
      setIsEditDialogOpen(false);
      setDemandaAtual(null);
      
      toast({
        title: "Demanda atualizada",
        description: "Demanda atualizada com sucesso.",
      });
    }
  };

  const handleAddDemanda = () => {
    if (novaDemanda.titulo && novaDemanda.descricao) {
      const newDemanda: Demanda = {
        id: Math.random().toString(36).substring(2, 9),
        titulo: novaDemanda.titulo,
        descricao: novaDemanda.descricao,
        status: novaDemanda.status as 'pendente' | 'em_andamento' | 'concluida',
        prioridade: novaDemanda.prioridade as 'baixa' | 'media' | 'alta',
        criacao: new Date(),
      };
      
      setDemandas([...demandas, newDemanda]);
      setIsAddDialogOpen(false);
      setNovaDemanda({
        titulo: '',
        descricao: '',
        status: 'pendente',
        prioridade: 'media',
      });
      
      toast({
        title: "Demanda adicionada",
        description: "Nova demanda adicionada com sucesso.",
      });
    }
  };

  const handleDeleteDemanda = (demandaId: string) => {
    setDemandas(demandas.filter(d => d.id !== demandaId));
    
    toast({
      title: "Demanda removida",
      description: "Demanda removida com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Fluxo de Demandas</CardTitle>
          <CardDescription>Gerencie e acompanhe as demandas pendentes</CardDescription>
        </div>
        <Button size="sm" className="gap-1" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Nova Demanda
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DemandasColumn
            title="Pendentes"
            icon={Clock}
            iconColor="text-amber-500"
            bgColor="bg-amber-50"
            borderColor="border-amber-200"
            demandas={demandasPendentes}
            onSelect={onSelectDemanda}
            onChangeStatus={handleStatusChange}
            onEdit={(demanda) => {
              setDemandaAtual(demanda);
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteDemanda}
          />

          <DemandasColumn
            title="Em Andamento"
            icon={Inbox}
            iconColor="text-purple-500"
            bgColor="bg-purple-50"
            borderColor="border-purple-200"
            demandas={demandasEmAndamento}
            onChangeStatus={handleStatusChange}
            onEdit={(demanda) => {
              setDemandaAtual(demanda);
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteDemanda}
            showMoveBackIcon={true}
            showCompleteIcon={true}
          />

          <DemandasColumn
            title="Concluídas"
            icon={CheckCircle2}
            iconColor="text-green-500"
            bgColor="bg-green-50"
            borderColor="border-green-200"
            demandas={demandasConcluidas}
            onChangeStatus={handleStatusChange}
            onEdit={(demanda) => {
              setDemandaAtual(demanda);
              setIsEditDialogOpen(true);
            }}
            onDelete={handleDeleteDemanda}
            showMoveBackIcon={true}
          />
        </div>
      </CardContent>

      {/* Diálogos de Adicionar e Editar Demanda */}
      <DemandaDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        demanda={novaDemanda}
        setDemanda={setNovaDemanda}
        onSave={handleAddDemanda}
        title="Adicionar Nova Demanda"
        actionText="Adicionar"
      />

      {demandaAtual && (
        <DemandaDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          demanda={demandaAtual}
          setDemanda={setDemandaAtual as any}
          onSave={handleEditDemanda}
          title="Editar Demanda"
          actionText="Salvar"
        />
      )}
    </Card>
  );
};
