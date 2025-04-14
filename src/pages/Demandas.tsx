
import { useState, useEffect } from "react";
import { Demanda } from "@/types/demanda";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DemandasBoard } from "@/components/Demandas/DemandasBoard";
import { DemandaDialog } from "@/components/Demandas/DemandaDialog";
import { v4 as uuidv4 } from "uuid";

export default function Demandas() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [demandaAtual, setDemandaAtual] = useState<Demanda | null>(null);
  const [isLider, setIsLider] = useState(true); // Temporário: Definir com base no perfil do usuário
  
  useEffect(() => {
    // Aqui viria a lógica para carregar as demandas do Supabase
    // Por enquanto, vamos usar dados de exemplo
    const demandasExemplo: Demanda[] = [
      {
        id: uuidv4(),
        titulo: "Preparar relatório mensal",
        descricao: "Preparar o relatório mensal de desempenho para o departamento financeiro",
        status: "pendente",
        prioridade: "alta",
        criacao: new Date(new Date().setDate(new Date().getDate() - 2)),
        categoria: "Relatórios",
        responsavel: user?.id,
      },
      {
        id: uuidv4(),
        titulo: "Atualizar documentação do cliente",
        descricao: "Atualizar os documentos do cliente ABC Ltda com as novas informações",
        status: "em_andamento",
        prioridade: "media",
        criacao: new Date(new Date().setDate(new Date().getDate() - 5)),
        inicioProcessamento: new Date(new Date().setDate(new Date().getDate() - 3)),
        categoria: "Documentação",
        responsavel: user?.id,
      },
      {
        id: uuidv4(),
        titulo: "Revisar contrato",
        descricao: "Revisar o contrato de serviços para o cliente XYZ S.A.",
        status: "encaminhado",
        prioridade: "media",
        criacao: new Date(new Date().setDate(new Date().getDate() - 7)),
        categoria: "Contratos",
        responsavel: "outro-usuario",
      },
      {
        id: uuidv4(),
        titulo: "Finalizar apresentação",
        descricao: "Finalizar a apresentação para a reunião com os investidores",
        status: "confirmado",
        prioridade: "alta",
        criacao: new Date(new Date().setDate(new Date().getDate() - 4)),
        inicioProcessamento: new Date(new Date().setDate(new Date().getDate() - 3)),
        categoria: "Apresentações",
        responsavel: user?.id,
      },
    ];

    setDemandas(demandasExemplo);
  }, [user]);

  const handleAddDemanda = (novaDemanda: Demanda) => {
    setDemandas([...demandas, novaDemanda]);
    toast({
      title: "Demanda criada",
      description: "A demanda foi criada com sucesso.",
    });
    setIsDialogOpen(false);
  };

  const handleEditDemanda = (demandaEditada: Demanda) => {
    setDemandas(
      demandas.map((d) => (d.id === demandaEditada.id ? demandaEditada : d))
    );
    toast({
      title: "Demanda atualizada",
      description: "A demanda foi atualizada com sucesso.",
    });
    setIsDialogOpen(false);
    setDemandaAtual(null);
  };

  const handleDeleteDemanda = (id: string) => {
    setDemandas(demandas.filter((d) => d.id !== id));
    toast({
      title: "Demanda excluída",
      description: "A demanda foi excluída com sucesso.",
    });
  };

  const handleChangeDemandaStatus = (id: string, status: Demanda['status']) => {
    setDemandas(prevDemandas => {
      return prevDemandas.map(demanda => {
        if (demanda.id === id) {
          // Se estamos iniciando o processamento
          let updates: Partial<Demanda> = { status };
          
          // Iniciar o cronômetro quando mover para em_andamento
          if (status === 'em_andamento' && !demanda.inicioProcessamento) {
            updates.inicioProcessamento = new Date();
          }
          
          // Finalizar o cronômetro quando concluir
          if ((status === 'finalizado') && demanda.inicioProcessamento && !demanda.conclusao) {
            const conclusao = new Date();
            const inicioProcessamento = demanda.inicioProcessamento;
            
            updates.conclusao = conclusao;
            updates.tempoProcessamento = conclusao.getTime() - inicioProcessamento.getTime();
          }
          
          return { ...demanda, ...updates };
        }
        return demanda;
      });
    });

    toast({
      title: "Status atualizado",
      description: "O status da demanda foi atualizado com sucesso.",
    });
  };

  const openNewDemandaDialog = () => {
    setDemandaAtual(null);
    setIsDialogOpen(true);
  };

  const openEditDemandaDialog = (demanda: Demanda) => {
    setDemandaAtual(demanda);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Demandas</h1>
        {isLider && (
          <Button onClick={openNewDemandaDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Demanda
          </Button>
        )}
      </div>

      <DemandasBoard
        demandas={demandas}
        onChangeDemandaStatus={handleChangeDemandaStatus}
        onEditDemanda={openEditDemandaDialog}
        onDeleteDemanda={handleDeleteDemanda}
        onAddDemanda={openNewDemandaDialog}
      />

      <DemandaDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        demanda={demandaAtual}
        onSave={demandaAtual ? handleEditDemanda : handleAddDemanda}
        isLider={isLider}
      />
    </div>
  );
}
